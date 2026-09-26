import React from 'react';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'teal'
  | 'coral'
  | 'accent'
  | 'emerald'
  | 'cyan'
  | 'amber'
  | 'indigo'
  | 'purple'
  | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    success: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-500/20',
      dotColor: 'bg-emerald-500',
    },
    accent: {
      bg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-300 font-bold',
      border: 'border-emerald-500/30',
      dotColor: 'bg-emerald-500',
    },
    default: {
      bg: 'bg-[var(--bg-secondary)]',
      text: 'text-[var(--text-secondary)]',
      border: 'border-[var(--border-subtle)]',
      dotColor: 'bg-gray-400',
    },
    warning: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-500/20',
      dotColor: 'bg-amber-500',
    },
    danger: {
      bg: 'bg-red-500/10 dark:bg-red-500/15',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-500/20',
      dotColor: 'bg-red-500',
    },
    info: {
      bg: 'bg-sky-500/10 dark:bg-sky-500/15',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-500/20',
      dotColor: 'bg-sky-500',
    },
    teal: {
      bg: 'bg-[var(--accent-primary-light)]',
      text: 'text-[var(--accent-primary)]',
      border: 'border-[var(--accent-primary)]/20',
      dotColor: 'bg-[var(--accent-primary)]',
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      text: 'text-emerald-700 dark:text-emerald-300 font-semibold',
      border: 'border-emerald-500/30',
      dotColor: 'bg-emerald-500',
    },
    cyan: {
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      text: 'text-cyan-700 dark:text-cyan-300 font-semibold',
      border: 'border-cyan-500/30',
      dotColor: 'bg-cyan-500',
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
      text: 'text-amber-700 dark:text-amber-300 font-semibold',
      border: 'border-amber-500/30',
      dotColor: 'bg-amber-500',
    },
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
      text: 'text-indigo-700 dark:text-indigo-300 font-semibold',
      border: 'border-indigo-500/30',
      dotColor: 'bg-indigo-500',
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      text: 'text-purple-700 dark:text-purple-300 font-semibold',
      border: 'border-purple-500/30',
      dotColor: 'bg-purple-500',
    },
    coral: {
      bg: 'bg-[var(--accent-secondary-light)]',
      text: 'text-[var(--accent-secondary)]',
      border: 'border-[var(--accent-secondary)]/20',
      dotColor: 'bg-[var(--accent-secondary)]',
    },
    neutral: {
      bg: 'bg-[var(--bg-secondary)]',
      text: 'text-[var(--text-secondary)]',
      border: 'border-[var(--border-subtle)]',
      dotColor: 'bg-[var(--text-muted)]',
    },
  };

  const current = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor} shrink-0`} />}
      {children}
    </span>
  );
};
