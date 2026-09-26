import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ showMenu?: boolean; className?: string }> = ({
  showMenu = true,
  className = '',
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => (showMenu ? setIsOpen(!isOpen) : toggleTheme())}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] cursor-pointer"
        aria-label="Toggle color theme"
        title={`Current theme: ${theme} (${resolvedTheme})`}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <Sun
            className={`w-4 h-4 transition-all duration-300 absolute text-amber-500 ${
              resolvedTheme === 'dark'
                ? 'rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100'
            }`}
          />
          <Moon
            className={`w-4 h-4 transition-all duration-300 absolute text-teal-400 ${
              resolvedTheme === 'dark'
                ? 'rotate-0 scale-100 opacity-100'
                : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </div>
      </button>

      {showMenu && isOpen && (
        <div className="absolute right-0 mt-2 w-38 py-1.5 px-1 rounded-xl glass-dropdown shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 text-[var(--text-muted)]">
            Appearance
          </div>
          {(
            [
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTheme(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </div>
                {isSelected && <Check className="w-3 h-3 text-[var(--accent-primary)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
