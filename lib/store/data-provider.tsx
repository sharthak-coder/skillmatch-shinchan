'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Profile, Project, JoinRequest, RequestStatus, ProjectStatus } from '@/lib/types';
import { SEED_PROFILES, SEED_PROJECTS, SEED_REQUESTS } from '@/lib/seed-data';
import { createClient } from '@/lib/supabase/client';

interface DataContextType {
  currentUser: Profile | null;
  profiles: Profile[];
  projects: Project[];
  requests: JoinRequest[];
  isDemoMode: boolean;
  isLoading: boolean;
  loginDemoUser: (userId: string) => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'owner_id' | 'members_count'>) => Promise<Project>;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => Promise<void>;
  sendJoinRequest: (projectId: string, message: string) => Promise<{ success: boolean; error?: string }>;
  respondToRequest: (requestId: string, status: 'accepted' | 'rejected') => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  getProfileById: (id: string) => Profile | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'skillmatch_current_user_v1',
  PROFILES: 'skillmatch_profiles_v1',
  PROJECTS: 'skillmatch_projects_v1',
  REQUESTS: 'skillmatch_requests_v1',
};

function normalizeAvatar(avatarUrl?: string, name?: string): string {
  if (!avatarUrl || avatarUrl.includes('unsplash') || avatarUrl.includes('dicebear')) {
    const n = (name || '').toLowerCase();
    if (n.includes('shin')) return '/avatars/shinchan.svg';
    if (n.includes('kazama')) return '/avatars/kazama.svg';
    if (n.includes('nene')) return '/avatars/nene.svg';
    if (n.includes('masao')) return '/avatars/masao.svg';
    if (n.includes('bo')) return '/avatars/bochan.svg';
    if (n.includes('shiro')) return '/avatars/shiro.svg';
    return '/avatars/shinchan.svg';
  }
  return avatarUrl;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const isDemoMode = !supabase;

  const [profiles, setProfiles] = useState<Profile[]>(SEED_PROFILES);
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [requests, setRequests] = useState<JoinRequest[]>(SEED_REQUESTS);
  
  // Real session single source of truth: default to null (no user logged in)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync profile from Supabase profiles table or metadata
  const syncProfileFromSupabase = useCallback(async (user: { id: string; email?: string; user_metadata?: Record<string, any> }): Promise<Profile> => {
    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    // 1. Fetch from public.profiles
    let existingProfile: any = null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (!error && data) {
        existingProfile = data;
      }
    } catch (err) {
      console.warn('Error fetching profiles record:', err);
    }

    // 2. Fetch skills
    let skills: string[] = [];
    try {
      const { data: skillRows } = await supabase
        .from('profile_skills')
        .select('skills(name)')
        .eq('profile_id', user.id);
      if (skillRows && Array.isArray(skillRows)) {
        skills = skillRows.map((r: any) => r.skills?.name).filter(Boolean);
      }
    } catch {}

    // 3. Fetch interests
    let interests: string[] = [];
    try {
      const { data: interestRows } = await supabase
        .from('profile_interests')
        .select('interests(name)')
        .eq('profile_id', user.id);
      if (interestRows && Array.isArray(interestRows)) {
        interests = interestRows.map((r: any) => r.interests?.name).filter(Boolean);
      }
    } catch {}

    if (skills.length === 0) skills = ['react', 'typescript'];
    if (interests.length === 0) interests = ['ai & machine learning', 'social & community'];

    if (existingProfile) {
      return {
        id: existingProfile.id,
        name: existingProfile.name,
        bio: existingProfile.bio || '',
        avatar_url: normalizeAvatar(existingProfile.avatar_url, existingProfile.name),
        year: existingProfile.year || 'Junior',
        major: existingProfile.major || 'Computer Science',
        skills,
        interests,
        created_at: existingProfile.created_at,
        is_demo: false,
      };
    }

    // If profile row doesn't exist yet, construct and upsert
    const userMeta = user.user_metadata || {};
    const fallbackName = (userMeta.name || user.email?.split('@')[0] || 'Student').trim();
    const newRecord = {
      id: user.id,
      name: fallbackName,
      bio: 'Ready to build something legendary with the Kasukabe Defense Corps!',
      avatar_url: normalizeAvatar(userMeta.avatar_url || '/avatars/shinchan.svg', fallbackName),
      year: 'Junior',
      major: 'Computer Science',
    };

    try {
      await supabase.from('profiles').upsert(newRecord);
    } catch (e) {
      console.warn('Could not upsert profile record:', e);
    }

    return {
      ...newRecord,
      skills,
      interests,
      created_at: new Date().toISOString(),
      is_demo: false,
    };
  }, [supabase]);

  // Handle session initialization and auth state changes
  useEffect(() => {
    let mounted = true;

    // Purge legacy hardcoded localStorage demo session if it exists
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch {}

    // Load projects and requests from storage if available
    try {
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedRequests) setRequests(JSON.parse(storedRequests));
    } catch {}

    async function initSession() {
      if (!supabase) {
        if (mounted) {
          setCurrentUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        // Handle client-side PKCE code in URL search params (e.g. from confirmation link)
        if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          if (code) {
            try {
              await supabase.auth.exchangeCodeForSession(code);
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
            } catch (exchangeErr) {
              console.error('PKCE exchange error on client:', exchangeErr);
            }
          }
        }

        // Fetch current active Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Error fetching Supabase session:', error.message);
        }

        if (mounted && session?.user) {
          const profile = await syncProfileFromSupabase(session.user);
          if (mounted) {
            setCurrentUser(profile);
            setProfiles((prev) => {
              const exists = prev.some((p) => p.id === profile.id);
              return exists ? prev.map((p) => (p.id === profile.id ? profile : p)) : [profile, ...prev];
            });
          }
        } else if (mounted) {
          // Single source of truth: No active session means user is logged out!
          setCurrentUser(null);
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    // Subscribe to auth state changes from Supabase
    let subscription: { unsubscribe: () => void } | null = null;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT' || !session) {
          setCurrentUser(null);
        } else if (session?.user) {
          try {
            const profile = await syncProfileFromSupabase(session.user);
            if (mounted) {
              setCurrentUser(profile);
              setProfiles((prev) => {
                const exists = prev.some((p) => p.id === profile.id);
                return exists ? prev.map((p) => (p.id === profile.id ? profile : p)) : [profile, ...prev];
              });
            }
          } catch (syncErr) {
            console.error('Failed to sync profile on auth change:', syncErr);
          }
        }
      });
      subscription = data.subscription;
    }

    initSession();

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [supabase, syncProfileFromSupabase]);

  // Explicit 1-Click Demo Login (Only activated upon explicit button click)
  const loginDemoUser = (userId: string) => {
    const user = profiles.find((p) => p.id === userId) || SEED_PROFILES.find((p) => p.id === userId);
    if (user) {
      const demoUser: Profile = {
        ...user,
        is_demo: true,
      };
      setCurrentUser(demoUser);
    }
  };

  // Sign In with Email & Password
  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { success: false, error: error.message };

      if (data.user) {
        const profile = await syncProfileFromSupabase(data.user);
        setCurrentUser(profile);
        setProfiles((prev) => {
          const exists = prev.some((p) => p.id === profile.id);
          return exists ? prev.map((p) => (p.id === profile.id ? profile : p)) : [profile, ...prev];
        });
      }
      return { success: true };
    }

    // Local-only demo mode fallback (when no Supabase configured)
    const existing = profiles.find(
      (p) => p.id === email || p.name.toLowerCase().includes(email.toLowerCase().split('@')[0])
    );
    if (existing) {
      setCurrentUser(existing);
      return { success: true };
    }

    return { success: false, error: 'User not found in local demo store.' };
  };

  // Sign Up with Email
  const signUpWithEmail = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }> => {
    if (supabase) {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=/dashboard`
        : undefined;

      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) return { success: false, error: error.message };

      if (data.session && data.user) {
        const profile = await syncProfileFromSupabase(data.user);
        setCurrentUser(profile);
        setProfiles((prev) => [profile, ...prev]);
        return { success: true, needsConfirmation: false };
      }

      // Email confirmation required by Supabase
      return { success: true, needsConfirmation: true };
    }

    // Local demo mode fallback
    const newUser: Profile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Kasukabe Builder',
      bio: 'New student joining SkillMatch! Let’s build something fun.',
      avatar_url: '/avatars/shinchan.svg',
      year: 'Freshman',
      major: 'Computer Science',
      skills: ['react', 'typescript'],
      interests: ['ai & machine learning'],
      created_at: new Date().toISOString(),
      is_demo: true,
    };

    setCurrentUser(newUser);
    setProfiles((prev) => [newUser, ...prev]);
    return { success: true, needsConfirmation: false };
  };

  // Explicit Logout
  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error during Supabase signOut:', err);
      }
    }
    // Single source of truth: reset to null immediately
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch {}
  };

  // Update Profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };

    if (supabase && !currentUser.is_demo) {
      try {
        await supabase.from('profiles').update({
          name: updated.name,
          bio: updated.bio,
          avatar_url: updated.avatar_url,
          year: updated.year,
          major: updated.major,
        }).eq('id', currentUser.id);
      } catch (e) {
        console.warn('Failed to update Supabase profile:', e);
      }
    }

    setCurrentUser(updated);
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const createProject = async (
    data: Omit<Project, 'id' | 'created_at' | 'owner_id' | 'members_count'>
  ): Promise<Project> => {
    if (!currentUser) throw new Error('Must be logged in to create a project');

    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      owner_id: currentUser.id,
      created_at: new Date().toISOString(),
      members_count: 1,
      owner: currentUser,
    };

    setProjects((prev) => {
      const updated = [newProject, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return newProject;
  };

  const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === projectId ? { ...p, status } : p));
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const sendJoinRequest = async (
    projectId: string,
    message: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) {
      return { success: false, error: 'Please log in to send a join request.' };
    }

    const project = projects.find((p) => p.id === projectId);
    if (!project) return { success: false, error: 'Project not found.' };
    if (project.owner_id === currentUser.id) {
      return { success: false, error: 'You are already the owner of this project!' };
    }

    const existing = requests.find((r) => r.project_id === projectId && r.requester_id === currentUser.id);
    if (existing) {
      return { success: false, error: `You have already sent a request (${existing.status}).` };
    }

    const newRequest: JoinRequest = {
      id: `req-${Date.now()}`,
      project_id: projectId,
      requester_id: currentUser.id,
      message,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      requester: currentUser,
      project,
    };

    setRequests((prev) => {
      const updated = [newRequest, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return { success: true };
  };

  const respondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    setRequests((prev) => {
      const updated = prev.map((r) =>
        r.id === requestId ? { ...r, status, updated_at: new Date().toISOString() } : r
      );
      try {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (status === 'accepted') {
      const targetReq = requests.find((r) => r.id === requestId);
      if (targetReq) {
        setProjects((prev) => {
          const updated = prev.map((p) =>
            p.id === targetReq.project_id ? { ...p, members_count: (p.members_count || 1) + 1 } : p
          );
          try {
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    }
  };

  const getProjectById = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return undefined;
    const owner = profiles.find((p) => p.id === project.owner_id);
    return { ...project, owner };
  };

  const getProfileById = (id: string) => {
    return profiles.find((p) => p.id === id);
  };

  const value = useMemo(
    () => ({
      currentUser,
      profiles,
      projects,
      requests,
      isDemoMode,
      isLoading,
      loginDemoUser,
      loginWithEmail,
      signUpWithEmail,
      logout,
      updateProfile,
      createProject,
      updateProjectStatus,
      sendJoinRequest,
      respondToRequest,
      getProjectById,
      getProfileById,
    }),
    [currentUser, profiles, projects, requests, isDemoMode, isLoading, syncProfileFromSupabase]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
