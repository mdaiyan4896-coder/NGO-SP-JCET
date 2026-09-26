import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center p-4 sm:p-6 font-['Inter']">
      <div className="w-full max-w-md text-center space-y-6">
        <Link to="/" className="inline-block mb-2">
          <Logo size="lg" variant="full" />
        </Link>

        <div className="p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              Email Verified Successfully! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Your VolunEase account is fully verified and ready. You now have full access to volunteer onboarding, scheduling, and verified impact tracking.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full text-base"
            onClick={() => navigate('/dashboard')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Continue to Platform
          </Button>
        </div>
      </div>
    </div>
  );
};
