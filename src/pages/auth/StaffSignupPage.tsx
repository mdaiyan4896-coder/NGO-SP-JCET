import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, CheckCircle2, ArrowRight, ShieldCheck, Mail, Lock, Phone } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const StaffSignupPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    orgName: '',
    address: '',
    website: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { signupStaff } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orgName) {
      toastError('Validation Error', 'Organization name is required');
      return;
    }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) {
      toastError('Validation Error', 'All fields are required');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toastError('Password Mismatch', 'Passwords do not match');
      return;
    }

    try {
      await signupStaff({
        orgName: form.orgName,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      });
      setStep(3);
      success('Account Created! 🎉', 'Your organization workspace has been created.');
    } catch (err: any) {
      toastError('Signup Failed', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center p-4 sm:p-6 font-['Inter']">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block mb-2">
            <Logo size="lg" variant="full" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
            Create Organization Workspace
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Set up your NGO platform to manage volunteer registrations, events, and attendance.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-xs">
          {[
            { num: 1, label: 'Organization' },
            { num: 2, label: 'Admin Account' },
            { num: 3, label: 'Launch' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.num
                    ? 'bg-gradient-teal text-white'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </span>
              <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-xl animate-in fade-in duration-200">
          {/* STEP 1: ORGANIZATION */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <Input
                label="Non-Profit / NGO Name"
                required
                value={form.orgName}
                onChange={(e) => setForm({ ...form, orgName: e.target.value })}
                placeholder="e.g. GreenEarth Action Global"
                leftIcon={<Building2 className="w-4 h-4 text-[var(--text-muted)]" />}
              />

              <Input
                label="Headquarters Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="742 Evergreen Way, San Francisco, CA"
              />

              <Input
                label="Official Website (Optional)"
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://greenearthaction.org"
              />

              <div className="flex justify-between items-center pt-3 border-t border-[var(--border-subtle)]">
                <Link to="/login" className="text-xs text-[var(--text-muted)] hover:underline">
                  Already have an account?
                </Link>
                <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Next: Admin Details
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: ADMIN CREDENTIALS */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Sofia"
                />
                <Input
                  label="Last Name"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Martinez"
                />
              </div>

              <Input
                label="Work Email Address"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="sofia@greenearth.org"
                leftIcon={<Mail className="w-4 h-4 text-[var(--text-muted)]" />}
              />

              <Input
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (415) 555-0101"
                leftIcon={<Phone className="w-4 h-4 text-[var(--text-muted)]" />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  leftIcon={<Lock className="w-4 h-4 text-[var(--text-muted)]" />}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••••••"
                />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[var(--border-subtle)]">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Complete Workspace Setup
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS LAUNCH */}
          {step === 3 && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                Workspace Initialized! 🎉
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                Welcome to VolunEase, {form.firstName}. Your workspace for <strong>{form.orgName}</strong> is ready to onboard volunteers and publish your first community event.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="w-full text-base"
                onClick={() => navigate('/dashboard')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Open Coordinator Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
