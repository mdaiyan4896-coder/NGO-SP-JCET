import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success } = useToast();

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSent(true);
    success('Reset Link Dispatched', 'Check your email inbox for instructions.');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center p-4 sm:p-6 font-['Inter']">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block mb-2">
            <Logo size="lg" variant="full" />
          </Link>
          <h2 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Enter your registered email and we'll send you a secure recovery link.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-xl">
          {sent ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">Check Your Inbox!</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                We've sent a password reset link to <strong>{email}</strong>. It expires in 15 minutes.
              </p>
              <Link to="/login">
                <Button variant="outline" size="sm" className="w-full mt-4" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSendReset} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.org"
                leftIcon={<Mail className="w-4 h-4 text-[var(--text-muted)]" />}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={loading}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link to="/login" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
