import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';

export const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center p-6 text-center font-['Inter']">
      <div className="max-w-md space-y-6">
        <Link to="/" className="inline-block mb-2">
          <Logo size="lg" variant="full" />
        </Link>

        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-amber-600 font-['Plus_Jakarta_Sans']">
            403
          </span>
          <h2 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
            Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            You do not have coordinator permissions to access this specific non-profit setting or administrative resource.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/portal" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Volunteer Portal
            </Button>
          </Link>
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
              Coordinator Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
