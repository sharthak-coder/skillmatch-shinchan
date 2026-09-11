'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/lib/store/data-provider';
import { computeDetailedMatch } from '@/lib/match/algorithm';
import SyncChain from '@/components/shared/SyncChain';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { 
  Users, 
  Sparkles, 
  Calendar, 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Shield, 
  MessageSquare,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getProjectById, currentUser, sendJoinRequest, requests } = useData();

  const project = getProjectById(id);

  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [justSubmitted, setJustSubmitted] = useState(false);

  if (!project) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-black text-shin-ink">Project Not Found</h2>
        <p className="text-xs text-shin-ink/60 font-semibold mt-2">
          The requested project might have been completed or removed.
        </p>
        <Link href="/projects" className="inline-block mt-4">
          <Button variant="red" size="sm">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  // Calculate detailed match
  const matchResult = currentUser
    ? computeDetailedMatch(
        currentUser.skills,
        project.required_skills,
        currentUser.interests,
        project.category
      )
    : { percentage: 0, matchingSkills: [], missingSkills: project.required_skills, interestBonus: false };

  // Check if current user is owner or has existing request
  const isOwner = currentUser?.id === project.owner_id;
  const existingRequest = requests.find(
    (r) => r.project_id === project.id && r.requester_id === currentUser?.id
  );

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setIsSending(true);
    setRequestError('');

    const res = await sendJoinRequest(project.id, message);
    setIsSending(false);

    if (res.success) {
      setJustSubmitted(true);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#FACC15', '#0284C7'],
        });
      } catch {}
    } else {
      setRequestError(res.error || 'Failed to send request');
    }
  };

  return (
    <div className="py-6 space-y-8 max-w-5xl mx-auto">
      {/* Back button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-black text-shin-ink hover:text-shin-red transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Projects
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Main Project Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-shin-canvas border border-shin-ink text-shin-ink">
                {project.category}
              </span>
              <span className="text-xs font-bold text-shin-ink/60 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Posted {new Date(project.created_at).toLocaleDateString()}
              </span>
              <span
                className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-lg border ${
                  project.status === 'open'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                    : 'bg-slate-100 text-slate-600 border-slate-400'
                }`}
              >
                {project.status === 'open' ? 'Recruiting Teammates' : 'Team Filled'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-shin-ink tracking-tight leading-tight">
              {project.title}
            </h1>

            {/* Team Size Progress Meter */}
            <div className="mt-4 p-3 bg-shin-canvas/70 rounded-2xl border border-shin-ink/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-shin-blue" />
                <div>
                  <div className="text-xs font-black text-shin-ink">
                    Team Capacity: {project.members_count || 1} of {project.team_size} slots taken
                  </div>
                  <div className="text-[11px] font-semibold text-shin-ink/60">
                    {project.team_size - (project.members_count || 1) > 0
                      ? `${project.team_size - (project.members_count || 1)} open spots remaining`
                      : 'Squad is fully staffed!'}
                  </div>
                </div>
              </div>

              {/* Progress circles */}
              <div className="flex items-center gap-1.5">
                {[...Array(project.team_size)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border border-shin-ink ${
                      idx < (project.members_count || 1)
                        ? 'bg-shin-red'
                        : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 pt-6 border-t-2 border-shin-ink/10">
              <h3 className="text-xs font-black uppercase tracking-wider text-shin-ink mb-2">
                Project Overview & Mission
              </h3>
              <p className="text-sm text-shin-ink/80 font-medium leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Required Skills Breakdown */}
            <div className="mt-8 pt-6 border-t-2 border-shin-ink/10">
              <h3 className="text-xs font-black uppercase tracking-wider text-shin-ink mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-shin-yellow" />
                Required Tech Stack & Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {project.required_skills.map((skill) => {
                  const isMatching = matchResult.matchingSkills.includes(skill.toLowerCase());
                  return (
                    <div
                      key={skill}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-black text-xs shadow-pop-sm capitalize ${
                        isMatching
                          ? 'bg-shin-yellow text-shin-ink border-shin-ink ring-1 ring-shin-ink'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      {isMatching ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                      )}
                      <span>{skill}</span>
                      {isMatching && (
                        <span className="text-[10px] text-shin-red font-black">(You bring this!)</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Join Request Form Card */}
          <Card className="bg-white p-6 border-2 border-shin-ink">
            <h3 className="text-lg font-black text-shin-ink mb-1">
              Join This Project
            </h3>
            <p className="text-xs text-shin-ink/60 font-semibold mb-4">
              Send a personalized pitch note explaining what you can build for this team.
            </p>

            {isOwner ? (
              <div className="p-4 rounded-xl bg-shin-canvas border-2 border-shin-ink text-xs font-black text-shin-ink flex items-center gap-2">
                <Shield className="w-4 h-4 text-shin-blue" />
                <span>You are the captain of this project! Manage applicants in your dashboard.</span>
              </div>
            ) : existingRequest || justSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-xs font-black text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>
                    Request Sent! Status:{' '}
                    <span className="uppercase">{existingRequest?.status || 'pending'}</span>
                  </span>
                </div>
                <Link href="/dashboard">
                  <Button variant="white" size="sm">View on Dashboard</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendRequest} className="space-y-4">
                {requestError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-shin-red text-shin-red text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{requestError}</span>
                  </div>
                )}

                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hey! I can help with React components, API integration, and I have 20 hours free this weekend..."
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-shin-canvas/50 border-2 border-shin-ink text-xs sm:text-sm font-semibold placeholder:text-shin-ink/40 shadow-pop-sm focus:outline-none focus:ring-2 focus:ring-shin-yellow"
                />

                <Button
                  type="submit"
                  variant="red"
                  size="md"
                  isLoading={isSending}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Join Request
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Right Col: SyncChain & Project Owner Card */}
        <div className="space-y-6">
          {/* SkillMatch Score Card */}
          <Card className="bg-white p-6 border-2 border-shin-ink text-center">
            <span className="text-[10px] font-black uppercase text-shin-ink/50 tracking-wider block mb-3">
              Action Kamen Compatibility
            </span>

            <div className="py-4 flex justify-center">
              <SyncChain
                percentage={matchResult.percentage}
                size="md"
                label="Weighted Synergy Score"
                sourceLabel="You"
                targetLabel="Project"
              />
            </div>

            <div className="mt-4 pt-4 border-t-2 border-shin-ink/10 text-left text-xs font-semibold space-y-1.5">
              <div className="flex justify-between">
                <span className="text-shin-ink/70">Skill Overlap:</span>
                <span className="font-black text-shin-ink">
                  {matchResult.matchingSkills.length} of {project.required_skills.length} skills
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-shin-ink/70">Category Affinity:</span>
                <span className="font-black text-shin-blue">
                  {matchResult.interestBonus ? '+5% Bonus Active' : 'Neutral'}
                </span>
              </div>
            </div>
          </Card>

          {/* Project Owner Card */}
          {project.owner && (
            <Card className="bg-white p-6 border-2 border-shin-ink">
              <span className="text-[10px] font-black uppercase text-shin-ink/50 tracking-wider block mb-3">
                Project Lead
              </span>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src={project.owner.avatar_url}
                  alt={project.owner.name}
                  className="w-12 h-12 rounded-2xl border-2 border-shin-ink object-cover shadow-pop-sm"
                />
                <div>
                  <h4 className="text-sm font-black text-shin-ink">{project.owner.name}</h4>
                  <p className="text-xs text-shin-ink/60 font-semibold">
                    {project.owner.year} • {project.owner.major}
                  </p>
                </div>
              </div>

              <p className="text-xs text-shin-ink/70 font-medium leading-relaxed line-clamp-3 mb-4">
                &ldquo;{project.owner.bio}&rdquo;
              </p>

              <Link href={`/profile/${project.owner.id}`}>
                <Button variant="white" size="sm" className="w-full">
                  View Full Profile
                </Button>
              </Link>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
