'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Dog, 
  Sparkles, 
  Target, 
  Users, 
  Layers, 
  CheckCircle2,
  Cpu
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function FeatureBento() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="kamen" size="md" className="mb-3">
          Why University Builders Love It
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-black text-shin-ink tracking-tight">
          Engineered for Real Collaboration.
        </h2>
        <p className="text-sm text-shin-ink/70 font-semibold mt-3">
          Ditch spreadsheet sign-ups and ghosting Discord channels. Find peers whose skills fit yours like puzzle pieces.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {/* Bento 1: Weighted Jaccard Overlap (Large card, span 2) */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="h-full bg-white flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-shin-red text-white flex items-center justify-center border-2 border-shin-ink shadow-pop-sm">
                <Cpu className="w-6 h-6" />
              </div>
              <Badge variant="kasukabe">Formula v1.2</Badge>
            </div>

            <div>
              <h3 className="text-xl font-black text-shin-ink mb-2">
                Weighted Jaccard Skill Overlap Algorithm
              </h3>
              <p className="text-xs text-shin-ink/70 font-medium leading-relaxed max-w-lg mb-6">
                Our matching engine weighs primary requirement coverage at 80%, Jaccard union similarity at 15%, and project category passion affinity at 5%. You only match with people who actually complement your project needs.
              </p>
            </div>

            {/* Formula visualization snippet */}
            <div className="p-4 bg-shin-canvas rounded-2xl border-2 border-shin-ink/20 font-mono text-xs text-shin-ink">
              <div className="flex items-center justify-between text-shin-ink/60 mb-1 font-bold">
                <span>// Skill-Match Pure Equation</span>
                <span className="text-shin-red font-bold">80% Coverage + 15% Jaccard + 5% Interest</span>
              </div>
              <div className="text-shin-ink font-semibold">
                Match = (0.80 × |M|/|P|) + (0.15 × |M|/|U∪P|) + (0.05 × Interest)
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Bento 2: Action Kamen Lock-in (1 col) */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-shin-yellow/15 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-shin-yellow text-shin-ink flex items-center justify-center border-2 border-shin-ink shadow-pop-sm mb-4">
                <Zap className="w-6 h-6 fill-shin-ink" />
              </div>
              <h3 className="text-lg font-black text-shin-ink mb-2">
                Action Kamen Lock-In
              </h3>
              <p className="text-xs text-shin-ink/70 font-medium leading-relaxed">
                When a match hits 100% or an owner accepts a teammate request, the SyncChain snaps into full lock mode with celebratory spring physics and confetti.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-shin-ink/10 flex items-center gap-2 text-xs font-black text-amber-900">
              <Sparkles className="w-4 h-4 text-shin-red" />
              <span>Zero boring status updates</span>
            </div>
          </Card>
        </motion.div>

        {/* Bento 3: Shiro's Fluffy Seal (1 col) */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-shin-blue/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-shin-blue text-white flex items-center justify-center border-2 border-shin-ink shadow-pop-sm mb-4">
                <Dog className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-shin-ink mb-2">
                Shiro Cotton Candy Seal
              </h3>
              <p className="text-xs text-shin-ink/70 font-medium leading-relaxed">
                Every member lists validated skills, majors, and graduating years. No ghosting or anonymous accounts that vanish before demo day.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-shin-ink/10 flex items-center gap-2 text-xs font-black text-shin-blue">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified university peers</span>
            </div>
          </Card>
        </motion.div>

        {/* Bento 4: Real-Time Team Requests (2 cols) */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="h-full bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-shin-ink border-2 border-shin-ink flex items-center justify-center shadow-pop-sm">
                <Users className="w-6 h-6 text-shin-red" />
              </div>
              <Badge variant="kamen">Live Dashboard</Badge>
            </div>

            <div>
              <h3 className="text-xl font-black text-shin-ink mb-2">
                Instant Requests & Team Dashboard
              </h3>
              <p className="text-xs text-shin-ink/70 font-medium leading-relaxed max-w-lg mb-4">
                Send a custom pitch note to any project owner in one click. Project owners review applicants side-by-side with calculated match percentages and can accept or reject in seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t-2 border-shin-ink/10">
              <div className="p-2.5 rounded-xl bg-shin-canvas border border-shin-ink/20 text-center">
                <div className="text-base font-black text-shin-red">1-Click</div>
                <div className="text-[11px] font-bold text-shin-ink/60">Pitch submission</div>
              </div>
              <div className="p-2.5 rounded-xl bg-shin-canvas border border-shin-ink/20 text-center">
                <div className="text-base font-black text-shin-blue">Live %</div>
                <div className="text-[11px] font-bold text-shin-ink/60">Per-candidate fit</div>
              </div>
              <div className="p-2.5 rounded-xl bg-shin-canvas border border-shin-ink/20 text-center">
                <div className="text-base font-black text-amber-900">Zero Spams</div>
                <div className="text-[11px] font-bold text-shin-ink/60">One request per project</div>
              </div>
            </div>
          </Card>
        </motion.div>

      </motion.div>
    </section>
  );
}
