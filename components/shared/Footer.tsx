import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Shield, Dog, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t-2 border-shin-ink bg-[#FFFDF9] py-12 px-4 sm:px-8 mt-20 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-shin-yellow/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-shin-blue/20 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Col 1: Brand & Slogan */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-shin-red border-2 border-shin-ink flex items-center justify-center text-white shadow-pop-sm">
              <Zap className="w-4 h-4 fill-shin-yellow text-shin-yellow" />
            </div>
            <span className="text-lg font-black text-shin-ink tracking-tight">
              SkillMatch <span className="text-shin-red">×</span> Shin-chan
            </span>
          </div>
          <p className="text-xs text-shin-ink/70 max-w-md leading-relaxed font-medium">
            Helping university students assemble their ultimate hackathon squad and class project dream team using weighted Jaccard skill-overlap algorithms.
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-shin-blue/10 border border-shin-blue text-shin-blue text-[11px] font-bold">
              <Shield className="w-3.5 h-3.5" />
              Action Kamen Endorsed
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-shin-yellow/20 border border-shin-yellow text-amber-900 text-[11px] font-bold">
              <Dog className="w-3.5 h-3.5" />
              Shiro Approved Fit
            </div>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-black uppercase text-shin-ink tracking-wider mb-1">
            Explore
          </h4>
          <Link href="/projects" className="text-xs font-semibold text-shin-ink/70 hover:text-shin-red transition-colors">
            All Open Projects
          </Link>
          <Link href="/projects/new" className="text-xs font-semibold text-shin-ink/70 hover:text-shin-red transition-colors">
            Post a Project Need
          </Link>
          <Link href="/dashboard" className="text-xs font-semibold text-shin-ink/70 hover:text-shin-red transition-colors">
            Student Dashboard
          </Link>
          <Link href="/onboarding" className="text-xs font-semibold text-shin-ink/70 hover:text-shin-red transition-colors">
            Setup Skills Profile
          </Link>
        </div>

        {/* Col 3: Kasukabe Squad Values */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-black uppercase text-shin-ink tracking-wider mb-1">
            Kasukabe Code
          </h4>
          <span className="text-xs font-medium text-shin-ink/70">1. No boring unstyled tables</span>
          <span className="text-xs font-medium text-shin-ink/70">2. Real complementary skills</span>
          <span className="text-xs font-medium text-shin-ink/70">3. Always support your teammates</span>
          <span className="text-xs font-medium text-shin-ink/70">4. Chocobi breaks are mandatory</span>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t-2 border-shin-ink/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-shin-ink/60">
        <div className="flex items-center gap-1">
          Crafted with <Heart className="w-3.5 h-3.5 text-shin-red fill-shin-red inline mx-0.5" /> for university builders across Kasukabe & beyond.
        </div>
        <div className="text-[11px] font-semibold">
          © {new Date().getFullYear()} SkillMatch Inc. YC W26 Batch.
        </div>
      </div>
    </footer>
  );
}
