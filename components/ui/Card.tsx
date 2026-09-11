import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'yellow' | 'blue' | 'red';
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  ...props
}: CardProps) {
  const bgStyles = {
    default: 'bg-white',
    yellow: 'bg-shin-yellow/10 border-amber-900',
    blue: 'bg-shin-blue/10 border-shin-blue',
    red: 'bg-shin-red/10 border-shin-red',
  }[variant];

  return (
    <div
      className={`card-pop p-6 ${bgStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
