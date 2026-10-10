import React from 'react';

export function StatCard({ title, value, subtitle, icon: Icon, color = 'emerald', trend }) {
  const colorStyles = {
    emerald: {
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
    },
    amber: {
      bg: 'bg-amber-50/80',
      text: 'text-amber-700',
      border: 'border-amber-100',
    },
    blue: {
      bg: 'bg-sky-50/80',
      text: 'text-sky-700',
      border: 'border-sky-100',
    },
    stone: {
      bg: 'bg-stone-100/80',
      text: 'text-stone-700',
      border: 'border-stone-200',
    },
  };

  const scheme = colorStyles[color] || colorStyles.emerald;

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-soft hover:shadow-card transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-stone-500 uppercase">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${scheme.bg} ${scheme.text} border ${scheme.border}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-stone-900">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-stone-500 font-medium">{subtitle}</p>
      )}
    </div>
  );
}
