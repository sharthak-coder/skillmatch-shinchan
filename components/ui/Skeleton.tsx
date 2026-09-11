import React from 'react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl border border-shin-ink/10 ${className}`}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card-pop p-6 bg-white border-2 border-shin-ink flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-4/5 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-2/3 rounded-md" />

        <div className="flex flex-wrap gap-1.5 mt-2">
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-6 w-14 rounded-lg" />
        </div>
      </div>

      <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between">
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}
