'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SyncChain from '@/components/shared/SyncChain';
import Button from '@/components/ui/Button';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Users, 
  Code, 
  Layers,
  Heart
} from 'lucide-react';

export default function HeroNetwork() {
  const [demoMatch, setDemoMatch] = useState(88);

  return (
    <section className="relative pt-6 pb-16 overflow-hidden">
      {/* Playful Floating Gradient Blobs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-shin-yellow/30 blur-3xl -z-10 animate-float-slow" />
      <div className="absolute top-28 right-10 w-80 h-80 rounded-full bg-shin-red/15 blur-3xl -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-shin-blue/15 blur-3xl -z-10" />

      <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Playful Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-shin-canvas border-2 border-shin-ink shadow-pop-sm mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-shin-red animate-ping" />
          <span className="text-xs font-black tracking-wide uppercase text-shin-ink">
            Action Kamen × Kasukabe Defense Corps Match Engine
          </span>
          <span className="text-xs">⚡</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-shin-ink tracking-tight leading-[1.08]">
          Find Your <span className="text-shin-red underline decoration-shin-yellow decoration-wavy decoration-4">Ultimate</span> Project Partner.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-shin-ink/80 max-w-2xl font-semibold leading-relaxed">
          Stop building solo or suffering through random group project assignments. SkillMatch matches university students via weighted Jaccard skill overlaps, shared hackathon ambitions, and zero boring corporate fluff.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/projects">
            <Button
              variant="red"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="text-base"
            >
              Explore Projects
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              variant="yellow"
              size="lg"
              leftIcon={<Zap className="w-5 h-5 fill-shin-ink" />}
              className="text-base"
            >
              Assemble Your Squad
            </Button>
          </Link>
        </div>

        {/* Interactive SyncChain Network Hero Showcase */}
        <div className="mt-12 w-full max-w-3xl card-pop bg-white p-6 sm:p-8 border-2 border-shin-ink shadow-pop-lg relative">
          {/* Top card header */}
          <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b-2 border-shin-ink/10 gap-3">
            <div className="flex items-center gap-2 text-left">
              <div className="w-3 h-3 rounded-full bg-shin-red border border-shin-ink" />
              <div className="w-3 h-3 rounded-full bg-shin-yellow border border-shin-ink" />
              <div className="w-3 h-3 rounded-full bg-shin-blue border border-shin-ink" />
              <span className="text-xs font-black text-shin-ink ml-2">
                Live Dynamic SyncChain™ Simulator
              </span>
            </div>

            <div className="text-[11px] font-bold text-shin-ink/60 bg-shin-canvas px-3 py-1 rounded-lg border border-shin-ink/20">
              Drag slider to test 100% Lock-in!
            </div>
          </div>

          {/* Interactive Match Display */}
          <div className="py-8 flex flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-center w-full overflow-x-auto py-2">
              <SyncChain
                percentage={demoMatch}
                size="lg"
                showLockAnimation={true}
                label="Realtime Complementary Synergy"
                sourceLabel="Frontend"
                targetLabel="AI Engineer"
              />
            </div>

            {/* Slider Control */}
            <div className="w-full max-w-md flex flex-col items-center gap-2">
              <div className="w-full flex justify-between text-xs font-black text-shin-ink">
                <span>0% (Cold fit)</span>
                <span className="text-shin-red font-black">{demoMatch}% Match</span>
                <span>100% (Action Beam Lock!)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={demoMatch}
                onChange={(e) => setDemoMatch(Number(e.target.value))}
                className="w-full accent-shin-red cursor-pointer h-3 bg-shin-canvas rounded-lg border-2 border-shin-ink"
              />
            </div>
          </div>

          {/* Connected Personas preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-shin-ink/10 text-left">
            <div className="p-3 bg-shin-canvas/60 rounded-xl border border-shin-ink/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-shin-red border border-shin-ink flex items-center justify-center text-white font-black text-xs shadow-pop-sm">
                Shin
              </div>
              <div>
                <p className="text-xs font-black text-shin-ink">Shinnosuke (React + Three.js)</p>
                <p className="text-[11px] font-semibold text-shin-ink/60">Creative UI & Micro-interactions</p>
              </div>
            </div>

            <div className="p-3 bg-shin-canvas/60 rounded-xl border border-shin-ink/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-shin-blue border border-shin-ink flex items-center justify-center text-white font-black text-xs shadow-pop-sm">
                Kazama
              </div>
              <div>
                <p className="text-xs font-black text-shin-ink">Toru (PyTorch + Rust)</p>
                <p className="text-[11px] font-semibold text-shin-ink/60">High-performance AI Backends</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
