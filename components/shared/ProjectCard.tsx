'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Project, Profile } from '@/lib/types';
import { useData } from '@/lib/store/data-provider';
import { computeMatchPercentage } from '@/lib/match/algorithm';
import SyncChain from '@/components/shared/SyncChain';
import Badge from '@/components/ui/Badge';
import { Users, ArrowRight, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  owner?: Profile;
}

export default function ProjectCard({ project, owner }: ProjectCardProps) {
  const { currentUser, profiles } = useData();

  // Find owner if not provided
  const resolvedOwner = owner || project.owner || profiles.find((p) => p.id === project.owner_id);

  // Memoized match percentage against logged-in user
  const matchPercentage = useMemo(() => {
    if (!currentUser) return 0;
    return computeMatchPercentage(
      currentUser.skills,
      project.required_skills,
      currentUser.interests,
      project.category
    );
  }, [currentUser, project.required_skills, project.category]);

  const isFull = (project.members_count || 1) >= project.team_size;

  return (
    <div className="card-pop flex flex-col justify-between bg-white overflow-hidden group border-2 border-shin-ink hover:-translate-y-1 transition-transform">
      <div>
        {/* Top Header: Category & Team Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl bg-shin-canvas border border-shin-ink text-shin-ink">
            {project.category}
          </span>

          <div className="flex items-center gap-1.5 text-xs font-bold text-shin-ink/70">
            <Users className="w-3.5 h-3.5 text-shin-blue" />
            <span>
              {project.members_count || 1}/{project.team_size} members
            </span>
          </div>
        </div>

        {/* Project Title */}
        <Link href={`/projects/${project.id}`}>
          <h3 className="text-lg font-black text-shin-ink group-hover:text-shin-red transition-colors line-clamp-1">
            {project.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="text-xs text-shin-ink/70 mt-2 line-clamp-2 leading-relaxed font-medium">
          {project.description}
        </p>

        {/* Required Skills Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.required_skills.slice(0, 4).map((skill) => {
            const hasSkill = currentUser?.skills.map((s) => s.toLowerCase()).includes(skill.toLowerCase());
            return (
              <span
                key={skill}
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
                  hasSkill
                    ? 'bg-shin-yellow text-shin-ink border-shin-ink shadow-pop-sm'
                    : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}
              >
                {hasSkill && '✓ '}
                {skill}
              </span>
            );
          })}
          {project.required_skills.length > 4 && (
            <span className="text-[10px] font-bold text-shin-ink/50 self-center">
              +{project.required_skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: SyncChain Match indicator & Action */}
      <div className="mt-6 pt-4 border-t-2 border-shin-ink/10 flex items-center justify-between gap-3">
        {/* SyncChain indicator */}
        <div className="flex flex-col">
          <SyncChain
            percentage={matchPercentage}
            size="sm"
            label="Skill Match"
            sourceLabel="You"
            targetLabel="Team"
          />
        </div>

        {/* Owner Info & CTA Button */}
        <div className="flex items-center gap-2">
          {resolvedOwner && (
            <Link
              href={`/profile/${resolvedOwner.id}`}
              title={`View ${resolvedOwner.name}'s profile`}
              className="relative group/owner"
            >
              <img
                src={resolvedOwner.avatar_url}
                alt={resolvedOwner.name}
                className="w-8 h-8 rounded-full border-2 border-shin-ink object-cover group-hover/owner:scale-105 transition-transform"
              />
            </Link>
          )}

          <Link
            href={`/projects/${project.id}`}
            className="px-3 py-1.5 rounded-xl bg-shin-red text-white text-xs font-black border-2 border-shin-ink shadow-pop-sm hover:translate-y-[-1px] transition-transform flex items-center gap-1"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
