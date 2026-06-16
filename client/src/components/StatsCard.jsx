import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color = 'blue', description }) {
  const getColorClasses = (col) => {
    switch (col) {
      case 'purple':
        return {
          bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
          iconBg: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
          glow: 'glow-border-purple'
        };
      case 'emerald':
      case 'green':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
          glow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]'
        };
      case 'amber':
      case 'yellow':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
          glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
        };
      case 'blue':
      default:
        return {
          bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          iconBg: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
          glow: 'glow-border-blue'
        };
    }
  };

  const style = getColorClasses(color);

  return (
    <div className={`glass-panel p-5 rounded-xl border flex items-center justify-between shadow-sm transition-all duration-300 hover:scale-[1.02] ${style.bg} ${style.glow}`}>
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {title}
        </span>
        <div className="text-3xl font-extrabold text-text tracking-tight">
          {value}
        </div>
        {description && (
          <span className="text-[10px] text-text-muted font-medium">
            {description}
          </span>
        )}
      </div>
      
      <div className={`p-3 rounded-lg ${style.iconBg} shadow-inner`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
