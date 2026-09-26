import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--bg-card-subtle)] ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--accent-primary-light)] text-[var(--accent-primary)] flex items-center justify-center mb-4 shadow-xs">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
