'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/lib/store/data-provider';
import RequestItem from '@/components/shared/RequestItem';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { 
  PlusCircle, 
  Inbox, 
  Send, 
  FolderKanban, 
  Sparkles, 
  Users, 
  Zap, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Dog
} from 'lucide-react';

export default function DashboardPage() {
  const { 
    currentUser, 
    projects, 
    requests, 
    updateProjectStatus, 
    loginDemoUser, 
    profiles 
  } = useData();

  const [activeTab, setActiveTab] = useState<'incoming' | 'myProjects' | 'sent'>('incoming');

  if (!currentUser) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <h2 className="text-2xl font-black text-shin-ink">Please Sign In</h2>
        <p className="text-xs text-shin-ink/60 font-semibold mt-2">
          You need to be logged in to view your dashboard and manage team requests.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login">
            <Button variant="red" size="md">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="white" size="md">Sign Up</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter projects owned by current user
  const myProjects = projects.filter((p) => p.owner_id === currentUser.id);
  const myProjectIds = myProjects.map((p) => p.id);

  // Incoming requests: requests for projects owned by currentUser
  const incomingRequests = requests.filter((r) => myProjectIds.includes(r.project_id));
  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'pending').length;

  // Sent requests: requests submitted by currentUser
  const sentRequests = requests.filter((r) => r.requester_id === currentUser.id);

  return (
    <div className="py-6 space-y-8">
      
      {/* Top Welcome Banner with Persona Switcher */}
      <div className="card-pop p-6 sm:p-8 bg-white border-2 border-shin-ink flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar_url}
            alt={currentUser.name}
            className="w-16 h-16 rounded-3xl border-2 border-shin-ink object-cover shadow-pop-sm flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-shin-ink">
                Hey, {currentUser.name}!
              </h1>
              <Badge variant="kasukabe">Captain</Badge>
            </div>
            <p className="text-xs text-shin-ink/60 font-semibold mt-1">
              {currentUser.year} • {currentUser.major} • {currentUser.skills.length} superpower skills listed
            </p>
          </div>
        </div>

        {/* Quick Persona Switcher for easy testing */}
        <div className="p-3 bg-shin-canvas rounded-2xl border-2 border-shin-ink/30 flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase text-shin-ink/50 tracking-wider">
            Quick Persona Switcher (Test Accept Flow):
          </span>
          <div className="flex items-center gap-1.5">
            {profiles.slice(0, 3).map((p) => (
              <button
                key={p.id}
                onClick={() => loginDemoUser(p.id)}
                className={`text-[11px] font-black px-2.5 py-1 rounded-xl border transition-all ${
                  currentUser.id === p.id
                    ? 'bg-shin-yellow text-shin-ink border-shin-ink shadow-pop-sm'
                    : 'bg-white text-shin-ink/70 border-shin-ink/30 hover:bg-slate-50'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-pop p-4 bg-white border-2 border-shin-ink">
          <div className="text-xs font-black uppercase text-shin-ink/50 flex items-center justify-between">
            <span>My Projects</span>
            <FolderKanban className="w-4 h-4 text-shin-red" />
          </div>
          <div className="text-2xl font-black text-shin-ink mt-2">{myProjects.length}</div>
          <div className="text-[10px] font-semibold text-shin-ink/60 mt-0.5">Created by you</div>
        </div>

        <div className="card-pop p-4 bg-white border-2 border-shin-ink">
          <div className="text-xs font-black uppercase text-shin-ink/50 flex items-center justify-between">
            <span>Incoming</span>
            <Inbox className="w-4 h-4 text-shin-yellow" />
          </div>
          <div className="text-2xl font-black text-shin-red mt-2">
            {pendingIncomingCount}
          </div>
          <div className="text-[10px] font-semibold text-shin-ink/60 mt-0.5">Pending decisions</div>
        </div>

        <div className="card-pop p-4 bg-white border-2 border-shin-ink">
          <div className="text-xs font-black uppercase text-shin-ink/50 flex items-center justify-between">
            <span>Sent Requests</span>
            <Send className="w-4 h-4 text-shin-blue" />
          </div>
          <div className="text-2xl font-black text-shin-ink mt-2">{sentRequests.length}</div>
          <div className="text-[10px] font-semibold text-shin-ink/60 mt-0.5">Teams applied to</div>
        </div>

        <div className="card-pop p-4 bg-white border-2 border-shin-ink">
          <div className="text-xs font-black uppercase text-shin-ink/50 flex items-center justify-between">
            <span>Skills Active</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-shin-ink mt-2">
            {currentUser.skills.length}
          </div>
          <div className="text-[10px] font-semibold text-shin-ink/60 mt-0.5">Complement arsenal</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b-2 border-shin-ink/10 pb-2">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'incoming'
              ? 'bg-shin-yellow text-shin-ink border-shin-ink shadow-pop-sm'
              : 'bg-white text-shin-ink/60 border-transparent hover:border-shin-ink/20'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Incoming Applicants
          {pendingIncomingCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-shin-red text-white text-[10px] flex items-center justify-center font-black">
              {pendingIncomingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('myProjects')}
          className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'myProjects'
              ? 'bg-shin-red text-white border-shin-ink shadow-pop-sm'
              : 'bg-white text-shin-ink/60 border-transparent hover:border-shin-ink/20'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          My Projects ({myProjects.length})
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-xl text-xs font-black border-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'sent'
              ? 'bg-shin-blue text-white border-shin-ink shadow-pop-sm'
              : 'bg-white text-shin-ink/60 border-transparent hover:border-shin-ink/20'
          }`}
        >
          <Send className="w-4 h-4" />
          Requests Sent ({sentRequests.length})
        </button>
      </div>

      {/* TAB 1: Incoming Applicants */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-shin-ink">
              Applications for Your Projects
            </h2>
            <span className="text-xs text-shin-ink/60 font-semibold">
              Accepting triggers the Action Kamen 100% Lock-in!
            </span>
          </div>

          {incomingRequests.length > 0 ? (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <RequestItem key={req.id} request={req} isOwnerView={true} />
              ))}
            </div>
          ) : (
            <Card className="bg-white text-center py-10">
              <Dog className="w-10 h-10 text-shin-ink/40 mx-auto mb-2" />
              <h3 className="text-base font-black text-shin-ink">No Incoming Requests Yet</h3>
              <p className="text-xs text-shin-ink/60 font-semibold mt-1">
                When students discover your projects and apply, their pitch notes and fit scores will appear here.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: My Projects */}
      {activeTab === 'myProjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-shin-ink">Projects You Lead</h2>
            <Link href="/projects/new">
              <Button variant="red" size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                New Project
              </Button>
            </Link>
          </div>

          {myProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((p) => (
                <Card key={p.id} className="bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-lg bg-shin-canvas border border-shin-ink">
                        {p.category}
                      </span>
                      <button
                        onClick={() =>
                          updateProjectStatus(p.id, p.status === 'open' ? 'closed' : 'open')
                        }
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border transition-colors ${
                          p.status === 'open'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                            : 'bg-slate-100 text-slate-600 border-slate-400'
                        }`}
                      >
                        Status: {p.status} (Click to toggle)
                      </button>
                    </div>

                    <Link href={`/projects/${p.id}`}>
                      <h3 className="text-base font-black text-shin-ink hover:text-shin-red">
                        {p.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-shin-ink/70 line-clamp-2 mt-1 font-medium">
                      {p.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-shin-ink/70">
                      <Users className="w-3.5 h-3.5 text-shin-blue" />
                      <span>
                        {p.members_count || 1} of {p.team_size} members
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-shin-ink/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-shin-ink/50">
                      Created {new Date(p.created_at).toLocaleDateString()}
                    </span>
                    <Link href={`/projects/${p.id}`}>
                      <Button variant="white" size="sm">
                        View Page
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-white text-center py-10">
              <FolderKanban className="w-10 h-10 text-shin-ink/40 mx-auto mb-2" />
              <h3 className="text-base font-black text-shin-ink">You Haven&apos;t Posted Any Projects</h3>
              <p className="text-xs text-shin-ink/60 font-semibold mt-1 mb-4">
                Post your hackathon or class idea to recruit complementary builders!
              </p>
              <Link href="/projects/new">
                <Button variant="red" size="sm">Create First Project</Button>
              </Link>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: Sent Requests */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-shin-ink">Projects You&apos;ve Applied To</h2>
            <Link href="/projects">
              <Button variant="white" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Find More Projects
              </Button>
            </Link>
          </div>

          {sentRequests.length > 0 ? (
            <div className="space-y-3">
              {sentRequests.map((req) => (
                <RequestItem key={req.id} request={req} isOwnerView={false} />
              ))}
            </div>
          ) : (
            <Card className="bg-white text-center py-10">
              <Send className="w-10 h-10 text-shin-ink/40 mx-auto mb-2" />
              <h3 className="text-base font-black text-shin-ink">No Sent Requests</h3>
              <p className="text-xs text-shin-ink/60 font-semibold mt-1 mb-4">
                Explore open projects and send requests to join exciting squads!
              </p>
              <Link href="/projects">
                <Button variant="red" size="sm">Explore Projects</Button>
              </Link>
            </Card>
          )}
        </div>
      )}

    </div>
  );
}
