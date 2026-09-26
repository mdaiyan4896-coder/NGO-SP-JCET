import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      id,
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-['Inter']">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full h-11 px-3.5 bg-[var(--bg-elevated)] border rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-red-500/80 focus:ring-red-500/50 bg-red-50/20 dark:bg-red-950/10'
                : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[var(--text-muted)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!error && helperText && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, id, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-['Inter']">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full p-3.5 bg-[var(--bg-elevated)] border rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent resize-y min-h-[90px] ${
            error
              ? 'border-red-500/80 focus:ring-red-500/50 bg-red-50/20 dark:bg-red-950/10'
              : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
          } ${className}`}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!error && helperText && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, id, options, children, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 font-['Inter']">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={`w-full h-11 px-3.5 bg-[var(--bg-elevated)] border rounded-xl text-sm text-[var(--text-primary)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent cursor-pointer ${
            error
              ? 'border-red-500/80 focus:ring-red-500/50 bg-red-50/20 dark:bg-red-950/10'
              : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
          } ${className}`}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {!error && helperText && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
