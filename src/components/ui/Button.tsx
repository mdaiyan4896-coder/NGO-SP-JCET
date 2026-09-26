import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'h-7 px-2.5 text-[11px] gap-1 rounded-lg font-medium',
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-10 px-4 text-sm gap-2 rounded-xl',
      lg: 'h-12 px-6 text-base gap-2.5 rounded-xl font-semibold',
      icon: 'w-10 h-10 p-0 rounded-xl justify-center',
    };

    const variantClasses = {
      primary:
        'bg-gradient-teal text-white shadow-sm hover:shadow-[var(--shadow-glow)] border border-teal-500/30 active:scale-[0.98]',
      accent:
        'bg-gradient-coral text-white shadow-sm hover:shadow-[var(--accent-secondary-glow)] border border-amber-500/30 active:scale-[0.98]',
      secondary:
        'bg-[var(--bg-card)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] shadow-xs active:scale-[0.98]',
      outline:
        'bg-transparent hover:bg-[var(--accent-primary-light)] text-[var(--accent-primary)] border border-[var(--accent-primary)] hover:border-[var(--accent-primary-hover)] active:scale-[0.98]',
      ghost:
        'bg-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-transparent active:scale-[0.98]',
      danger:
        'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 active:scale-[0.98]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center font-medium font-['Inter'] transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
