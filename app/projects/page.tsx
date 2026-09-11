'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/lib/store/data-provider';
import { POPULAR_SKILLS } from '@/lib/seed-data';
import ProjectCard from '@/components/shared/ProjectCard';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  X, 
  SlidersHorizontal, 
  Sparkles,
  Layers,
  Dog
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'AI & Machine Learning',
  'Social & Community',
  'EdTech & Study Tools',
  'FinTech & Web3',
  'Hardware & Robotics',
];

export default function ProjectsPage() {
  const { projects, currentUser } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [onlyMatchingMySkills, setOnlyMatchingMySkills] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search input
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Toggle skill filter
  const toggleSkill = (skill: string) => {
    const s = skill.toLowerCase();
    if (selectedSkills.includes(s)) {
      setSelectedSkills(selectedSkills.filter((item) => item !== s));
    } else {
      setSelectedSkills([...selectedSkills, s]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedCategory('All');
    setSelectedSkills([]);
    setOnlyMatchingMySkills(false);
  };

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search query filter (title + description)
      if (debouncedQuery) {
        const q = debouncedQuery.toLowerCase();
        const matchTitle = project.title.toLowerCase().includes(q);
        const matchDesc = project.description.toLowerCase().includes(q);
        const matchSkill = project.required_skills.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchSkill) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && project.category !== selectedCategory) {
        return false;
      }

      // Selected skills filter
      if (selectedSkills.length > 0) {
        const projectSkills = project.required_skills.map((s) => s.toLowerCase());
        const hasAnySelected = selectedSkills.some((s) => projectSkills.includes(s));
        if (!hasAnySelected) return false;
      }

      // Only matching my skills filter
      if (onlyMatchingMySkills && currentUser) {
        const userSkills = currentUser.skills.map((s) => s.toLowerCase());
        const projectSkills = project.required_skills.map((s) => s.toLowerCase());
        const overlap = projectSkills.some((s) => userSkills.includes(s));
        if (!overlap) return false;
      }

      return true;
    });
  }, [projects, debouncedQuery, selectedCategory, selectedSkills, onlyMatchingMySkills, currentUser]);

  return (
    <div className="py-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="kasukabe">Open Recruitment</Badge>
            <span className="text-xs font-bold text-shin-ink/60">
              {projects.length} Active Projects
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-shin-ink tracking-tight">
            Explore Open Projects
          </h1>
          <p className="text-xs sm:text-sm text-shin-ink/70 font-semibold mt-1">
            Browse live projects and view your real-time complementary skill match.
          </p>
        </div>

        <Link href="/projects/new">
          <Button
            variant="red"
            size="md"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Post a Project Need
          </Button>
        </Link>
      </div>

      {/* Search & Filter Controls Panel */}
      <div className="card-pop p-6 bg-white space-y-5 border-2 border-shin-ink">
        {/* Search Bar & Quick Toggles */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-shin-ink/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, topic, or required skill (e.g. PyTorch, React, Rover)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-shin-canvas/50 border-2 border-shin-ink text-sm font-bold shadow-pop-sm focus:outline-none focus:ring-2 focus:ring-shin-yellow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-shin-ink/50 hover:text-shin-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {currentUser && (
            <button
              onClick={() => setOnlyMatchingMySkills(!onlyMatchingMySkills)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black border-2 border-shin-ink shadow-pop-sm flex items-center gap-2 whitespace-nowrap transition-all ${
                onlyMatchingMySkills
                  ? 'bg-shin-yellow text-shin-ink'
                  : 'bg-white text-shin-ink/70 hover:bg-shin-canvas'
              }`}
            >
              <Sparkles className="w-4 h-4 text-shin-red" />
              <span>Matching My Skills ({currentUser.skills.length})</span>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-shin-red text-white border-shin-ink shadow-pop-sm'
                  : 'bg-white text-shin-ink/70 border-shin-ink/30 hover:border-shin-ink hover:text-shin-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t-2 border-shin-ink/10">
          <span className="text-[11px] font-black uppercase text-shin-ink/50 tracking-wider flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3 h-3" /> Filter Skills:
          </span>

          {POPULAR_SKILLS.slice(0, 10).map((skill) => {
            const isSelected = selectedSkills.includes(skill.toLowerCase());
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-shin-yellow text-shin-ink border-shin-ink shadow-pop-sm font-black'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-500'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {skill}
              </button>
            );
          })}

          {(selectedCategory !== 'All' || selectedSkills.length > 0 || searchQuery || onlyMatchingMySkills) && (
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-black text-shin-red hover:underline ml-auto flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid with Skeleton Loading */}
      {isSearching ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty Search State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-pop p-12 bg-white text-center flex flex-col items-center justify-center max-w-lg mx-auto border-2 border-shin-ink my-8"
        >
          <div className="w-16 h-16 rounded-full bg-shin-canvas border-2 border-shin-ink flex items-center justify-center text-shin-ink shadow-pop-sm mb-4">
            <Dog className="w-8 h-8 text-shin-ink" />
          </div>
          <h3 className="text-xl font-black text-shin-ink">No Matching Projects Found</h3>
          <p className="text-xs text-shin-ink/70 font-semibold mt-2 leading-relaxed">
            Shiro sniffed around but couldn&apos;t find projects matching your exact criteria. Try broadening your search or clear some filters!
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="yellow" size="sm" onClick={clearAllFilters}>
              Reset All Filters
            </Button>
            <Link href="/projects/new">
              <Button variant="red" size="sm">
                Create This Project
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
