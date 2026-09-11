import React from 'react';
import { Shield, Zap, Dog, Star, Sparkles } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'kamen' | 'shiro' | 'kasukabe' | 'red' | 'yellow' | 'blue' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'yellow',
  size = 'md',
  className = '',
}: BadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  }[size];

  if (variant === 'kamen') {
    return (
      <span className={`inline-flex items-center gap-1 font-black bg-gradient-to-r from-shin-blue to-shin-kamen.purple text-white border-2 border-shin-ink rounded-xl shadow-pop-sm ${sizeStyles} ${className}`}>
        <Shield className="w-3.5 h-3.5 text-shin-yellow fill-shin-yellow" />
        {children || 'Action Kamen Approved'}
      </span>
    );
  }

  if (variant === 'shiro') {
    return (
      <span className={`inline-flex items-center gap-1 font-black bg-white text-shin-ink border-2 border-shin-ink rounded-xl shadow-pop-sm ${sizeStyles} ${className}`}>
        <Dog className="w-3.5 h-3.5 text-shin-blue" />
        {children || 'Shiro Cotton Seal'}
      </span>
    );
  }

  if (variant === 'kasukabe') {
    return (
      <span className={`inline-flex items-center gap-1 font-black bg-shin-red text-white border-2 border-shin-ink rounded-xl shadow-pop-sm ${sizeStyles} ${className}`}>
        <Zap className="w-3.5 h-3.5 fill-shin-yellow text-shin-yellow" />
        {children || 'Kasukabe Defense Corps'}
      </span>
    );
  }

  const baseStyles = {
    red: 'bg-shin-red text-white border-shin-ink',
    yellow: 'bg-shin-yellow text-shin-ink border-shin-ink',
    blue: 'bg-shin-blue text-white border-shin-ink',
    gray: 'bg-slate-100 text-slate-700 border-slate-300',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 font-black border-2 rounded-xl shadow-pop-sm ${baseStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
}
