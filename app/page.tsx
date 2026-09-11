'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import HeroNetwork from '@/components/landing/HeroNetwork';
import FeatureBento from '@/components/landing/FeatureBento';
import Testimonials from '@/components/landing/Testimonials';
import ProjectCard from '@/components/shared/ProjectCard';
import Button from '@/components/ui/Button';
import { useData } from '@/lib/store/data-provider';
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from 'lucide-react';

export default function LandingPage() {
  const { projects } = useData();
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* 1. Scrollytelling Hero Network Section */}
      <HeroNetwork />

      {/* 2. Live Projects Spotlight */}
      <section className="py-12 border-t-2 border-shin-ink/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-shin-red flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" /> Live Hackathon & Class Projects
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-shin-ink">
              Currently Scouting for Teammates
            </h2>
          </div>

          <Link href="/projects">
            <Button
              variant="white"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Browse All ({projects.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 3. Feature Bento Grid */}
      <FeatureBento />

      {/* 4. Testimonials & Hall of Fame */}
      <Testimonials />

      {/* 5. Playful Bottom Call To Action */}
      <section className="mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card-pop p-8 sm:p-12 bg-gradient-to-br from-shin-red via-rose-500 to-amber-500 text-white border-2 border-shin-ink shadow-pop-lg text-center relative overflow-hidden"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-shin-yellow/20 rounded-full blur-xl" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white text-shin-ink border-2 border-shin-ink flex items-center justify-center shadow-pop-sm mb-6 animate-bounce-subtle">
              <Rocket className="w-7 h-7 text-shin-red" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Assemble Your Kasukabe Dream Team?
            </h2>

            <p className="mt-4 text-sm sm:text-base text-white/90 font-semibold leading-relaxed">
              Create your profile in 60 seconds, input your superpower skills, and let our weighted Jaccard algorithm find your perfect project match.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Link href="/signup">
                <Button
                  variant="yellow"
                  size="lg"
                  leftIcon={<Zap className="w-5 h-5 fill-shin-ink" />}
                  className="text-base text-shin-ink"
                >
                  Join Free Today
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  variant="white"
                  size="lg"
                  className="text-base text-shin-ink"
                >
                  Explore First
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
