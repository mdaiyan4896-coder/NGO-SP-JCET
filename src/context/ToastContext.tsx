import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => toast({ type: 'success', title, message }), [toast]);
  const error = useCallback((title: string, message?: string) => toast({ type: 'error', title, message }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ type: 'warning', title, message }), [toast]);
  const info = useCallback((title: string, message?: string) => toast({ type: 'info', title, message }), [toast]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const borderColors = {
    success: 'border-l-4 border-l-emerald-500',
    warning: 'border-l-4 border-l-amber-500',
    error: 'border-l-4 border-l-red-500',
    info: 'border-l-4 border-l-sky-500',
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, removeToast }}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto relative overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] ${borderColors[t.type]} rounded-xl shadow-xl p-4 flex items-start gap-3 transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-5`}
          >
            {icons[t.type]}
            <div className="flex-1 min-w-0 pr-4">
              <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                {t.title}
              </h4>
              {t.message && (
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                  {t.message}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {/* Auto-dismiss progress countdown */}
            {t.duration && t.duration > 0 && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-current opacity-20"
                style={{
                  animation: `toast-progress ${t.duration}ms linear forwards`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
