import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const VolunteerSignupPage: React.FC = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    skills: '',
    password: '',
  });
  const [agreed, setAgreed] = useState(true);

  const { signupVolunteer } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) {
      toastError('Validation Error', 'First name, email, and password are required');
      return;
    }

    try {
      await signupVolunteer(form);
      success('Welcome to VolunEase! 🌟', 'Your volunteer account is ready.');
      navigate('/portal');
    } catch (err: any) {
      toastError('Registration Failed', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center p-4 sm:p-6 font-['Inter']">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block mb-2">
            <Logo size="lg" variant="full" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
            Join as a Community Volunteer
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Discover meaningful causes, RSVP for local shifts, and build a verified service record.
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Elena"
              />
              <Input
                label="Last Name"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Rostova"
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="elena@example.com"
              leftIcon={<Mail className="w-4 h-4 text-[var(--text-muted)]" />}
            />

            <Input
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+1 (555) 234-0021"
              leftIcon={<Phone className="w-4 h-4 text-[var(--text-muted)]" />}
            />

            <Input
              label="Skills / Interests (Comma-separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              placeholder="First Aid, Beach Cleanup, Translation"
            />

            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-[var(--text-muted)]" />}
            />

            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded accent-teal-600"
              />
              <span>I agree to community safety guidelines and volunteer terms</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-base"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Register & Open Volunteer Portal
            </Button>
          </form>

          <div className="text-center text-xs text-[var(--text-secondary)] pt-4 mt-4 border-t border-[var(--border-subtle)]">
            Already registered?{' '}
            <Link to="/login" className="text-[var(--accent-primary)] font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
