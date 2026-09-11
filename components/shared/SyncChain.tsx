'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, Check, Star, Shield, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SyncChainProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLockAnimation?: boolean;
  label?: string;
  sourceLabel?: string;
  targetLabel?: string;
  className?: string;
  interactive?: boolean;
}

export default function SyncChain({
  percentage,
  size = 'md',
  showLockAnimation = true,
  label,
  sourceLabel = 'You',
  targetLabel = 'Team',
  className = '',
  interactive = false,
}: SyncChainProps) {
  const isHighMatch = percentage >= 80;
  const isMediumMatch = percentage >= 30 && percentage < 80;
  const isLowMatch = percentage < 30;
  const isLocked = percentage === 100;

  const [hasSnapped, setHasSnapped] = useState(false);

  useEffect(() => {
    if (isLocked && showLockAnimation && !hasSnapped) {
      setHasSnapped(true);
      // Playful confetti burst for 100% Action Kamen Lock-in!
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#EF4444', '#FACC15', '#0284C7', '#7C3AED'],
        });
      } catch {
        // Safe fallback if canvas not available
      }
    }
  }, [isLocked, showLockAnimation, hasSnapped]);

  // Size configurations
  const dimensions = {
    sm: { height: 42, width: 150, nodeSize: 24, strokeWidth: 3, fontSize: 'text-[10px]' },
    md: { height: 58, width: 220, nodeSize: 34, strokeWidth: 4, fontSize: 'text-xs' },
    lg: { height: 76, width: 300, nodeSize: 44, strokeWidth: 5, fontSize: 'text-sm' },
  }[size];

  // Flow animation speed based on percentage
  const flowDuration = isLowMatch ? 4.5 : isMediumMatch ? 2.2 : 1.0;

  // Colors based on Shin-chan theme
  const getChainStroke = () => {
    if (isLowMatch) return '#CBD5E1'; // muted slate
    if (isMediumMatch) return '#0284C7'; // Action Kamen sky blue
    if (isLocked) return '#EF4444'; // Shin-chan Red lock
    return '#F59E0B'; // Energetic Amber/Yellow
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div 
        className="relative flex items-center justify-between"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {/* Connecting Animated SVG Chain */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          fill="none"
        >
          {/* Base muted guide line */}
          <line
            x1={dimensions.nodeSize / 2 + 6}
            y1={dimensions.height / 2}
            x2={dimensions.width - dimensions.nodeSize / 2 - 6}
            y2={dimensions.height / 2}
            stroke="#E2E8F0"
            strokeWidth={dimensions.strokeWidth}
            strokeLinecap="round"
          />

          {/* Flowing animated segmented chain */}
          <motion.line
            x1={dimensions.nodeSize / 2 + 6}
            y1={dimensions.height / 2}
            x2={dimensions.width - dimensions.nodeSize / 2 - 6}
            y2={dimensions.height / 2}
            stroke={getChainStroke()}
            strokeWidth={dimensions.strokeWidth}
            strokeDasharray={isLowMatch ? '4 8' : '8 6'}
            strokeLinecap="round"
            animate={{
              strokeDashoffset: isLowMatch ? [0, -24] : [0, -56],
            }}
            transition={{
              repeat: Infinity,
              duration: flowDuration,
              ease: 'linear',
            }}
          />

          {/* Pulse beam dot for high match */}
          {percentage >= 50 && (
            <motion.circle
              r={dimensions.strokeWidth + 1}
              fill="#FACC15"
              stroke="#1E293B"
              strokeWidth={1.5}
              animate={{
                cx: [dimensions.nodeSize / 2 + 8, dimensions.width - dimensions.nodeSize / 2 - 8],
                cy: dimensions.height / 2,
              }}
              transition={{
                repeat: Infinity,
                duration: flowDuration * 1.2,
                ease: 'easeInOut',
              }}
            />
          )}
        </svg>

        {/* Node 1: "You" (Shin-chan Red Motif) */}
        <motion.div
          whileHover={interactive ? { scale: 1.15 } : undefined}
          animate={isLocked ? { scale: [1, 1.2, 1], rotate: [0, -10, 0] } : {}}
          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
          className="relative z-10 flex items-center justify-center rounded-full border-2 border-shin-ink shadow-pop-sm font-black text-white"
          style={{
            width: dimensions.nodeSize,
            height: dimensions.nodeSize,
            backgroundColor: isLowMatch ? '#94A3B8' : '#EF4444',
          }}
        >
          <span className="text-[10px] sm:text-xs">U</span>
        </motion.div>

        {/* Center Match Percentage Pill */}
        <motion.div
          animate={
            isLocked
              ? {
                  scale: [1, 1.28, 1],
                  boxShadow: [
                    '0px 0px 0px rgba(239, 68, 68, 0)',
                    '0px 0px 18px rgba(239, 68, 68, 0.6)',
                    '2px 2px 0px #1E293B',
                  ],
                }
              : {}
          }
          transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          className={`relative z-10 px-2.5 py-0.5 rounded-full border-2 border-shin-ink shadow-pop-sm flex items-center gap-1 font-black ${
            isLocked
              ? 'bg-shin-red text-white'
              : isHighMatch
              ? 'bg-shin-yellow text-shin-ink'
              : isMediumMatch
              ? 'bg-shin-blue-light text-shin-blue border-shin-blue'
              : 'bg-slate-100 text-slate-500 border-slate-300'
          }`}
        >
          {isLocked ? (
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-white text-white animate-spin" />
              <span className={dimensions.fontSize}>100% LOCK!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              {percentage >= 70 && <Zap className="w-3 h-3 fill-shin-ink text-shin-ink" />}
              <span className={dimensions.fontSize}>{percentage}%</span>
            </div>
          )}
        </motion.div>

        {/* Node 2: "Target / Project" (Action Kamen Blue Motif) */}
        <motion.div
          whileHover={interactive ? { scale: 1.15 } : undefined}
          animate={isLocked ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : {}}
          transition={{ type: 'spring', stiffness: 350, damping: 15 }}
          className="relative z-10 flex items-center justify-center rounded-full border-2 border-shin-ink shadow-pop-sm font-black text-white"
          style={{
            width: dimensions.nodeSize,
            height: dimensions.nodeSize,
            backgroundColor: isLowMatch ? '#94A3B8' : isLocked ? '#EF4444' : '#0284C7',
          }}
        >
          {isLocked ? (
            <Check className="w-4 h-4 text-white stroke-[3]" />
          ) : (
            <Star className="w-3.5 h-3.5 fill-white text-white" />
          )}
        </motion.div>
      </div>

      {/* Optional Under-Label */}
      {label && (
        <span className="text-[10px] font-bold text-shin-ink/60 mt-1 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
