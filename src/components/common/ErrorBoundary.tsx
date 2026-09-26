import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by VolunEase ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)] font-['Inter'] text-center">
          <div className="max-w-md p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                Something went wrong
              </h2>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                An unexpected interface issue occurred. Your data is safe. Please refresh to resume your volunteer management session.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] text-red-600 font-mono text-left overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => window.location.reload()}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
