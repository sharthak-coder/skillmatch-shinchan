'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useData } from '@/lib/store/data-provider';
import { POPULAR_SKILLS } from '@/lib/seed-data';
import { Project } from '@/lib/types';
import ProjectCard from '@/components/shared/ProjectCard';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import TagInput from '@/components/ui/TagInput';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { 
  Sparkles, 
  PlusCircle, 
  ArrowLeft, 
  Eye, 
  Users, 
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORY_OPTIONS = [
  'AI & Machine Learning',
  'Social & Community',
  'EdTech & Study Tools',
  'FinTech & Web3',
  'Hardware & Robotics',
  'Game Development',
  'Climate & Sustainability',
];

export default function NewProjectPage() {
  const router = useRouter();
  const { currentUser, createProject } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [teamSize, setTeamSize] = useState(4);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['react', 'typescript']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Live preview project object
  const previewProject: Project = {
    id: 'preview-proj',
    owner_id: currentUser?.id || 'demo-owner',
    title: title.trim() || 'Untitled Super Project',
    description:
      description.trim() ||
      'Describe what your project solves and what kind of rockstar teammate you are hunting for...',
    team_size: teamSize,
    status: 'open',
    category: category,
    required_skills: requiredSkills.length > 0 ? requiredSkills : ['react', 'python'],
    created_at: new Date().toISOString(),
    members_count: 1,
    owner: currentUser || undefined,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    if (!title.trim() || !description.trim()) {
      setError('Please fill in title and description');
      return;
    }
    if (requiredSkills.length === 0) {
      setError('Please specify at least 1 required skill');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const created = await createProject({
        title,
        description,
        category,
        team_size: teamSize,
        status: 'open',
        required_skills: requiredSkills,
      });

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#FACC15', '#0284C7'],
        });
      } catch {}

      router.push(`/projects/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 space-y-8 max-w-6xl mx-auto">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-black text-shin-ink hover:text-shin-red transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <Badge variant="kasukabe">Mission Post</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Project Creation Form */}
        <div className="lg:col-span-7">
          <Card className="bg-white p-6 sm:p-8 border-2 border-shin-ink shadow-pop-lg">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-shin-ink tracking-tight">
                Post a Project Need
              </h1>
              <p className="text-xs sm:text-sm text-shin-ink/60 font-semibold mt-1">
                Tell the university builder community what you&apos;re building and what complementary skills you need.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border-2 border-shin-red text-shin-red text-xs font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Project Title"
                placeholder="e.g. Action Kamen Vision: AI Pose Web App"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-shin-ink uppercase tracking-wider block mb-1">
                    Project Category / Track
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border-2 border-shin-ink text-sm font-bold shadow-pop-sm focus:outline-none focus:ring-2 focus:ring-shin-yellow"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-shin-ink uppercase tracking-wider block mb-1">
                    Target Team Size: <span className="text-shin-red">{teamSize} members</span>
                  </label>
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="range"
                      min={2}
                      max={6}
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full accent-shin-red cursor-pointer h-3 bg-shin-canvas rounded-lg border-2 border-shin-ink"
                    />
                    <span className="text-xs font-black px-2 py-1 bg-shin-canvas rounded-lg border border-shin-ink">
                      {teamSize}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-shin-ink uppercase tracking-wider block mb-1">
                  Project Description & Pitch
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what the project does, the technical stack you already have, and what specific role you need filled..."
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-shin-ink text-sm font-medium shadow-pop-sm focus:outline-none focus:ring-2 focus:ring-shin-yellow"
                />
              </div>

              {/* Required Skills Tag Input */}
              <TagInput
                label="Required Skills You Need in Teammates"
                value={requiredSkills}
                onChange={setRequiredSkills}
                suggestions={POPULAR_SKILLS}
                placeholder="Type skill (e.g. Next.js, PyTorch) and press Enter"
                badgeColor="red"
              />

              <div className="pt-4 border-t-2 border-shin-ink/10 flex justify-end">
                <Button
                  type="submit"
                  variant="red"
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<PlusCircle className="w-5 h-5" />}
                >
                  Publish Project Need
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right 5 Cols: Real-Time Live Preview */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-shin-ink/70">
            <Eye className="w-4 h-4 text-shin-blue" />
            <span>Live Project Card Preview</span>
          </div>

          <div className="pointer-events-none">
            <ProjectCard project={previewProject} />
          </div>

          <div className="p-4 rounded-2xl bg-shin-canvas/70 border-2 border-shin-ink/20 text-xs text-shin-ink/70 font-semibold leading-relaxed">
            <span className="font-black text-shin-red">Action Kamen Tip:</span> Be specific with your required skills! The weighted overlap algorithm gives candidates accurate match scores when requirements are clearly defined.
          </div>
        </div>

      </div>
    </div>
  );
}
