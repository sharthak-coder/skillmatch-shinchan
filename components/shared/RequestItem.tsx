'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JoinRequest, Profile, Project } from '@/lib/types';
import { useData } from '@/lib/store/data-provider';
import { computeMatchPercentage } from '@/lib/match/algorithm';
import SyncChain from '@/components/shared/SyncChain';
import Button from '@/components/ui/Button';
import { Check, X, Sparkles, MessageSquare, Clock, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RequestItemProps {
  request: JoinRequest;
  isOwnerView?: boolean;
}

export default function RequestItem({ request, isOwnerView = false }: RequestItemProps) {
  const { profiles, projects, respondToRequest } = useData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localStatus, setLocalStatus] = useState(request.status);
  const [justAccepted, setJustAccepted] = useState(false);

  // Resolve requester and project
  const requester = request.requester || profiles.find((p) => p.id === request.requester_id);
  const project = request.project || projects.find((p) => p.id === request.project_id);

  // Match % between requester and project
  const matchPercentage =
    requester && project
      ? computeMatchPercentage(
          requester.skills,
          project.required_skills,
          requester.interests,
          project.category
        )
      : 85;

  const handleAction = async (status: 'accepted' | 'rejected') => {
    setIsProcessing(true);
    if (status === 'accepted') {
      setJustAccepted(true);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#FACC15', '#0284C7', '#10B981'],
        });
      } catch {}
    }
    setLocalStatus(status);
    await respondToRequest(request.id, status);
    setIsProcessing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`card-pop p-5 mb-4 border-2 border-shin-ink ${
        localStatus === 'accepted'
          ? 'bg-emerald-50/70 border-emerald-600'
          : localStatus === 'rejected'
          ? 'bg-slate-50 opacity-60 border-slate-300'
          : 'bg-white'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: User / Project info */}
        <div className="flex items-start gap-3.5">
          {isOwnerView && requester ? (
            <img
              src={requester.avatar_url}
              alt={requester.name}
              className="w-11 h-11 rounded-2xl border-2 border-shin-ink object-cover shadow-pop-sm flex-shrink-0"
            />
          ) : (
            <div className="w-11 h-11 rounded-2xl bg-shin-yellow border-2 border-shin-ink flex items-center justify-center font-black shadow-pop-sm flex-shrink-0">
              <Sparkles className="w-6 h-6 text-shin-ink" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-black text-shin-ink">
                {isOwnerView
                  ? requester?.name || 'Applicant'
                  : project?.title || 'Project Request'}
              </h4>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                  localStatus === 'accepted'
                    ? 'bg-emerald-500 text-white border-emerald-700'
                    : localStatus === 'rejected'
                    ? 'bg-rose-500 text-white border-rose-700'
                    : 'bg-amber-100 text-amber-900 border-amber-400'
                }`}
              >
                {localStatus}
              </span>
            </div>

            {isOwnerView && requester && (
              <p className="text-xs text-shin-ink/60 font-semibold mt-0.5">
                {requester.year} • {requester.major}
              </p>
            )}

            {!isOwnerView && project && (
              <p className="text-xs text-shin-ink/60 font-semibold mt-0.5">
                Target: {project.title}
              </p>
            )}

            {/* Note / Pitch message */}
            {request.message && (
              <div className="mt-2.5 p-2.5 bg-shin-canvas/80 rounded-xl border border-shin-ink/20 text-xs font-medium text-shin-ink/80 flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-shin-blue flex-shrink-0 mt-0.5" />
                <span>&ldquo;{request.message}&rdquo;</span>
              </div>
            )}
          </div>
        </div>

        {/* Center: SyncChain connection */}
        <div className="flex items-center justify-center my-2 md:my-0">
          <SyncChain
            percentage={localStatus === 'accepted' ? 100 : matchPercentage}
            size="sm"
            showLockAnimation={justAccepted}
            label={localStatus === 'accepted' ? 'LOCKED IN!' : 'Fit Score'}
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 justify-end">
          {isOwnerView && localStatus === 'pending' ? (
            <>
              <Button
                variant="red"
                size="sm"
                onClick={() => handleAction('accepted')}
                isLoading={isProcessing}
                leftIcon={<Check className="w-3.5 h-3.5 stroke-[3]" />}
              >
                Accept Teammate
              </Button>
              <Button
                variant="white"
                size="sm"
                onClick={() => handleAction('rejected')}
                isLoading={isProcessing}
                leftIcon={<X className="w-3.5 h-3.5" />}
              >
                Decline
              </Button>
            </>
          ) : localStatus === 'accepted' ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-500 text-emerald-800 text-xs font-black">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Squad Confirmed!</span>
            </div>
          ) : (
            <span className="text-xs text-shin-ink/50 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(request.created_at).toLocaleDateString()}
            </span>
          )}
        </div>

      </div>
    </motion.div>
  );
}
