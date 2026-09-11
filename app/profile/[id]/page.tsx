'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useData } from '@/lib/store/data-provider';
import ProjectCard from '@/components/shared/ProjectCard';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  GraduationCap, 
  Sparkles, 
  FolderKanban, 
  ArrowLeft, 
  ShieldCheck, 
  HeartHandshake,
  Dog,
  Zap
} from 'lucide-react';

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { getProfileById, projects, currentUser } = useData();

  const profile = getProfileById(id);

  if (!profile) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl font-black text-shin-ink">Student Profile Not Found</h2>
        <p className="text-xs text-shin-ink/60 font-semibold mt-2">
          This builder may have deleted their account or entered Kasukabe stealth mode.
        </p>
        <Link href="/projects" className="inline-block mt-4">
          <Button variant="red" size="sm">Browse Projects</Button>
        </Link>
      </div>
    );
  }

  // Projects created by this profile
  const createdProjects = projects.filter((p) => p.owner_id === profile.id);

  const isSelf = currentUser?.id === profile.id;

  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto">
      {/* Back button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-black text-shin-ink hover:text-shin-red transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      {/* Main Profile Header Card */}
      <Card className="p-6 sm:p-8 bg-white border-2 border-shin-ink shadow-pop-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-2 border-shin-ink object-cover shadow-pop-sm flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-shin-ink">
                  {profile.name}
                </h1>
                <Badge variant="kasukabe">Verified Member</Badge>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-shin-ink/70 mt-1">
                <GraduationCap className="w-4 h-4 text-shin-blue" />
                <span>
                  {profile.year} • {profile.major}
                </span>
              </div>

              <p className="text-xs text-shin-ink/70 font-medium leading-relaxed mt-3 max-w-lg">
                &ldquo;{profile.bio}&rdquo;
              </p>
            </div>
          </div>

          {isSelf && (
            <Link href="/settings">
              <Button variant="yellow" size="sm">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>

        {/* Skills Section */}
        <div className="mt-8 pt-6 border-t-2 border-shin-ink/10">
          <h3 className="text-xs font-black uppercase tracking-wider text-shin-ink mb-3 flex items-center gap-1.5">
            <Zap className="w-4 h-4 fill-shin-yellow text-shin-yellow" />
            Superpower Skills ({profile.skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-shin-yellow text-shin-ink text-xs font-black border-2 border-shin-ink shadow-pop-sm capitalize"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Interests Section */}
        {profile.interests.length > 0 && (
          <div className="mt-6 pt-6 border-t-2 border-shin-ink/10">
            <h3 className="text-xs font-black uppercase tracking-wider text-shin-ink mb-3 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-shin-blue" />
              Passion Tracks & Interests ({profile.interests.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 rounded-xl bg-shin-blue-light text-shin-blue text-xs font-black border-2 border-shin-blue shadow-pop-sm capitalize"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Projects Created by this Member */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-shin-red" />
          <h2 className="text-xl font-black text-shin-ink">
            Projects Led by {profile.name.split(' ')[0]} ({createdProjects.length})
          </h2>
        </div>

        {createdProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {createdProjects.map((p) => (
              <ProjectCard key={p.id} project={p} owner={profile} />
            ))}
          </div>
        ) : (
          <Card className="bg-white text-center py-8">
            <p className="text-xs text-shin-ink/60 font-semibold">
              No active projects created by {profile.name.split(' ')[0]} at the moment.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
