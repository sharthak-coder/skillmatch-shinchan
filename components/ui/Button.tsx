'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'red' | 'yellow' | 'blue' | 'white' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asMotion?: boolean;
}

export default function Button({
  children,
  variant = 'red',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl',
    md: 'px-4 py-2 text-sm rounded-2xl',
    lg: 'px-6 py-3 text-base rounded-2xl font-black',
  }[size];

  const variantStyles = {
    red: 'btn-pop-red',
    yellow: 'btn-pop-yellow',
    blue: 'btn-pop-blue',
    white: 'btn-pop-white',
    outline: 'bg-transparent text-shin-ink border-2 border-shin-ink hover:bg-shin-canvas',
    ghost: 'bg-transparent text-shin-ink hover:bg-shin-canvas/60 border-none shadow-none',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`btn-pop inline-flex items-center justify-center gap-2 font-black select-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
}
