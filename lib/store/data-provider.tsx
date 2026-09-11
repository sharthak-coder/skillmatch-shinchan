'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
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
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());
  const isDemoMode = !supabase;

  const [profiles, setProfiles] = useState<Profile[]>(SEED_PROFILES);
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [requests, setRequests] = useState<JoinRequest[]>(SEED_REQUESTS);
  const [currentUser, setCurrentUser] = useState<Profile | null>(SEED_PROFILES[0]); // Default to Shin-chan for instant play!
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from LocalStorage on mount
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
      const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

      if (storedProfiles) setProfiles(JSON.parse(storedProfiles));
      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedRequests) setRequests(JSON.parse(storedRequests));
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        // Default to Shin-chan
        setCurrentUser(SEED_PROFILES[0]);
      }
    } catch (e) {
      console.warn('LocalStorage error, using in-memory state', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes to localStorage
  const persist = (
    newProfiles?: Profile[],
    newProjects?: Project[],
    newRequests?: JoinRequest[],
    newUser?: Profile | null
  ) => {
    try {
      if (newProfiles !== undefined) {
        setProfiles(newProfiles);
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(newProfiles));
      }
      if (newProjects !== undefined) {
        setProjects(newProjects);
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newProjects));
      }
      if (newRequests !== undefined) {
        setRequests(newRequests);
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(newRequests));
      }
      if (newUser !== undefined) {
        setCurrentUser(newUser);
        if (newUser) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
        } else {
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
      }
    } catch (e) {
      console.error('Failed to persist data', e);
    }
  };

  const loginDemoUser = (userId: string) => {
    const user = profiles.find((p) => p.id === userId) || SEED_PROFILES.find((p) => p.id === userId);
    if (user) {
      persist(undefined, undefined, undefined, user);
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { success: false, error: error.message };
      // Profile will sync
      return { success: true };
    }

    // Demo / Local Auth logic
    const existing = profiles.find((p) => p.id === email || p.name.toLowerCase().includes(email.toLowerCase().split('@')[0]));
    if (existing) {
      persist(undefined, undefined, undefined, existing);
      return { success: true };
    }

    // Fallback: Create session for this user
    const namePart = email.split('@')[0];
    const newUser: Profile = {
      id: `user-${Date.now()}`,
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      bio: 'New explorer ready to find project partners!',
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${namePart}`,
      year: 'Sophomore',
      major: 'Computer Science',
      skills: ['react', 'typescript'],
      interests: ['ai & machine learning', 'social & community'],
      created_at: new Date().toISOString(),
    };

    persist([...profiles, newUser], undefined, undefined, newUser);
    return { success: true };
  };

  const signUpWithEmail = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { name } },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    const newUser: Profile = {
      id: `user-${Date.now()}`,
      name: name.trim() || 'Kasukabe Builder',
      bio: 'New student joining SkillMatch! Let’s build something fun.',
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      year: 'Freshman',
      major: 'Computer Science',
      skills: [],
      interests: [],
      created_at: new Date().toISOString(),
    };

    persist([...profiles, newUser], undefined, undefined, newUser);
    return { success: true };
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut();
    }
    persist(undefined, undefined, undefined, null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    const updatedProfiles = profiles.map((p) => (p.id === currentUser.id ? updated : p));
    persist(updatedProfiles, undefined, undefined, updated);
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

    persist(undefined, [newProject, ...projects], undefined, undefined);
    return newProject;
  };

  const updateProjectStatus = async (projectId: string, status: ProjectStatus) => {
    const updated = projects.map((p) => (p.id === projectId ? { ...p, status } : p));
    persist(undefined, updated);
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

    persist(undefined, undefined, [newRequest, ...requests]);
    return { success: true };
  };

  const respondToRequest = async (requestId: string, status: 'accepted' | 'rejected') => {
    const updated = requests.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          updated_at: new Date().toISOString(),
        };
      }
      return r;
    });

    // If accepted, increment project members count
    let updatedProjects = projects;
    if (status === 'accepted') {
      const targetReq = requests.find((r) => r.id === requestId);
      if (targetReq) {
        updatedProjects = projects.map((p) => {
          if (p.id === targetReq.project_id) {
            return { ...p, members_count: (p.members_count || 1) + 1 };
          }
          return p;
        });
      }
    }

    persist(undefined, updatedProjects, updated);
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
    [currentUser, profiles, projects, requests, isDemoMode, isLoading]
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
