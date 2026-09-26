import React, { useRef } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  spotlight?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  spotlight = false,
  glass = false,
  padding = 'md',
  className = '',
  onMouseMove,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (spotlight && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
    if (onMouseMove) onMouseMove(e);
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`rounded-2xl transition-all duration-200 border border-[var(--border-subtle)] ${
        glass
          ? 'glass-panel'
          : spotlight
          ? 'spotlight-card'
          : 'bg-[var(--bg-card)] shadow-xs hover:shadow-md hover:border-[var(--border-strong)]'
      } ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
