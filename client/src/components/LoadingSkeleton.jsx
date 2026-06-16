import React from 'react';

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 rounded-xl border border-slate-800 animate-pulse flex flex-col justify-between h-48">
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="h-5 w-20 bg-slate-800 rounded"></div>
          <div className="h-5 w-12 bg-slate-800 rounded"></div>
        </div>
        <div className="h-6 w-3/4 bg-slate-800 rounded mb-4"></div>
        <div className="h-4 w-full bg-slate-800 rounded mb-2"></div>
        <div className="h-4 w-5/6 bg-slate-800 rounded"></div>
      </div>
      <div className="h-4 w-24 bg-slate-800 rounded mt-4"></div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, idx) => (
        <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 animate-pulse flex items-center justify-between h-24">
          <div className="space-y-2">
            <div className="h-3 w-16 bg-slate-800 rounded"></div>
            <div className="h-6 w-12 bg-slate-800 rounded"></div>
          </div>
          <div className="h-10 w-10 bg-slate-800 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="glass-panel p-6 rounded-xl border border-slate-800 animate-pulse space-y-4">
      <div className="h-6 w-40 bg-slate-800 rounded"></div>
      <div className="space-y-2">
        <div className="h-3 w-20 bg-slate-800 rounded"></div>
        <div className="h-10 w-full bg-slate-800 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 bg-slate-800 rounded"></div>
        <div className="h-10 w-full bg-slate-800 rounded"></div>
      </div>
      <div className="h-10 w-32 bg-slate-800 rounded mt-4"></div>
    </div>
  );
}

export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'stats') {
    return <StatsSkeleton />;
  }
  if (type === 'form') {
    return <FormSkeleton />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, idx) => (
        <CardSkeleton key={idx} />
      ))}
    </div>
  );
}
