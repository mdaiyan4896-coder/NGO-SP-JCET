import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
} from 'lucide-react';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ThemeToggle } from '../../components/common/ThemeToggle';

export const LoginPage: React.FC = () => {
  const [roleMode, setRoleMode] = useState<'STAFF' | 'VOLUNTEER'>('STAFF');
  const [email, setEmail] = useState('sofia.martinez@greenearth.org');
  const [password, setPassword] = useState('VolunEase2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const handleToggleRole = (mode: 'STAFF' | 'VOLUNTEER') => {
    setRoleMode(mode);
    if (mode === 'VOLUNTEER') {
      setEmail('elena.rostova@example.com');
    } else {
      setEmail('sofia.martinez@greenearth.org');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userRole: UserRole = roleMode === 'VOLUNTEER' ? 'VOLUNTEER' : 'ORG_ADMIN';
      await login(email, password, userRole);
      success('Welcome Back!', `Signed in as ${roleMode === 'VOLUNTEER' ? 'Volunteer' : 'Staff Coordinator'}.`);
      navigate(roleMode === 'VOLUNTEER' ? '/portal' : '/dashboard');
    } catch (err: any) {
      toastError('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login('sofia.martinez@greenearth.org', 'VolunEase2026!', 'ORG_ADMIN');
      success('Instant Access Granted! 🚀', 'Entering Coordinator Dashboard as Sofia Martinez.');
      navigate('/dashboard');
    } catch (err: any) {
      toastError('Login Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] font-['Inter'] relative selection:bg-teal-500/20 selection:text-teal-600 overflow-hidden">
      {/* Top Floating Controls */}
      <div className="absolute top-5 right-5 z-30 flex items-center gap-3">
        <Link
          to="/"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-all shadow-xs"
        >
          ← Back to Home
        </Link>
        <ThemeToggle />
      </div>

      {/* =====================================================
          LEFT BRANDED PANEL (Rich Ambient Visuals & Micro-Animations)
          ===================================================== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B7A5C] via-[#0EA47A] to-[#14B8A6] text-white flex-col justify-between p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        {/* Floating Animated Mesh Gradient Blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none animate-blob-1" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-amber-300/25 rounded-full blur-3xl pointer-events-none animate-blob-2" />
        <div className="absolute -bottom-20 left-1/3 w-88 h-88 bg-emerald-900/30 rounded-full blur-2xl pointer-events-none animate-float" />

        {/* Top Logo with Inverted High-Contrast Text */}
        <div className="z-10">
          <Link to="/" className="inline-block focus:outline-none group">
            <Logo size="lg" variant="full" inverted showTagline className="transition-transform group-hover:scale-105" />
          </Link>
        </div>

        {/* Center Testimonial Glassmorphic Showcase Card */}
        <div className="space-y-6 max-w-lg z-10 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/25 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-sm">
              <HeartHandshake className="w-6 h-6 text-amber-300" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
              Verified Non-Profit
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] leading-snug text-white drop-shadow-xs">
            "The simplest way to organize passionate volunteers and multiply real community impact."
          </h2>

          <div className="flex items-center gap-3 pt-3 border-t border-white/20">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-300 to-amber-500 text-gray-950 font-black text-sm flex items-center justify-center shadow-md">
              EG
            </div>
            <div>
              <div className="font-bold text-sm text-white">Elena Gomez</div>
              <div className="text-xs text-white/90">Regional Director, Coastal Wildlife Rescue</div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Bar with Glass Tiles */}
        <div className="grid grid-cols-3 gap-3.5 pt-6 text-xs z-10">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/15 transition-all">
            <div className="text-2xl font-black font-['Plus_Jakarta_Sans'] text-white">500+</div>
            <div className="text-white/90 font-medium text-[11px] mt-0.5">NGOs Powered</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/15 transition-all">
            <div className="text-2xl font-black font-['Plus_Jakarta_Sans'] text-amber-300">2M+</div>
            <div className="text-white/90 font-medium text-[11px] mt-0.5">Hours Verified</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm hover:bg-white/15 transition-all">
            <div className="text-2xl font-black font-['Plus_Jakarta_Sans'] text-white">98.4%</div>
            <div className="text-white/90 font-medium text-[11px] mt-0.5">On-Time Attendance</div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT PANEL (High-Contrast Form, Highly Legible Typography)
          ===================================================== */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
          {/* Mobile Top Logo & Title */}
          <div className="space-y-2">
            <Link to="/" className="lg:hidden block mb-6">
              <Logo size="md" variant="full" />
            </Link>
            <h2 className="text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] tracking-tight">
              Sign In to VolunEase
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
              Welcome back! Please enter your credentials to access your dashboard.
            </p>
          </div>

          {/* Sliding Role Toggle: Staff Coordinator vs Volunteer */}
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border-2 border-[var(--border-subtle)] text-xs font-bold">
            <button
              type="button"
              onClick={() => handleToggleRole('STAFF')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer text-center ${
                roleMode === 'STAFF'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20 font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Staff / Coordinator
            </button>
            <button
              type="button"
              onClick={() => handleToggleRole('VOLUNTEER')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer text-center ${
                roleMode === 'VOLUNTEER'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20 font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Volunteer Member
            </button>
          </div>

          {/* =====================================================
              ENHANCED 1-CLICK INSTANT DEMO PREVIEW CARD (High Contrast)
              ===================================================== */}
          <div className="p-4 rounded-2xl bg-emerald-500/15 dark:bg-emerald-950/40 border-2 border-emerald-500/50 shadow-md flex items-center justify-between gap-3 relative overflow-hidden group">
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Instant Demo Preview
                </span>
              </div>
              <p className="text-xs text-[var(--text-primary)] font-bold">
                1-Click Coordinator Dashboard Access
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Skip typing & test all features with prefilled credentials
              </p>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isLoading}
              onClick={handleDirectDemoLogin}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="font-bold text-xs shadow-lg shadow-teal-500/25 shrink-0 hover:scale-105 transition-transform"
            >
              Enter Dashboard
            </Button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-teal-600 dark:text-teal-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.org"
                  className="w-full h-11 pl-10 pr-4 bg-[var(--bg-elevated)] border-2 border-[var(--border-strong)] focus:border-[var(--accent-primary)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-[var(--accent-primary)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-teal-600 dark:text-teal-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 pl-10 pr-10 bg-[var(--bg-elevated)] border-2 border-[var(--border-strong)] focus:border-[var(--accent-primary)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-[var(--text-primary)] font-semibold">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-teal-600 cursor-pointer"
                />
                <span>Remember this device for 30 days</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-base font-bold mt-2 shadow-xl shadow-teal-500/20 py-3.5 hover:scale-[1.01] active:scale-[0.99] transition-all"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to {roleMode === 'STAFF' ? 'Coordinator Dashboard' : 'Volunteer Portal'}
            </Button>
          </form>

          {/* Social Sign-In Divider */}
          <div className="space-y-4 pt-1">
            <div className="relative flex items-center justify-center">
              <div className="border-t-2 border-[var(--border-subtle)] w-full" />
              <span className="bg-[var(--bg-primary)] px-3 text-xs text-[var(--text-muted)] absolute uppercase tracking-wider font-bold">
                Or Continue With
              </span>
            </div>

            <Button
              variant="secondary"
              className="w-full font-bold text-sm h-11 border-2 border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all"
              onClick={() => {
                success('Google OAuth Connected', 'Demonstration login authenticated.');
                navigate('/dashboard');
              }}
            >
              <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.645-5.2 3.645-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.92H1.3v3.15C3.3 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.33 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.57H1.3C.47 8.22 0 10.05 0 12s.47 3.78 1.3 5.43l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.3 2.64 1.3 6.57l4.03 3.15c.94-2.82 3.57-4.97 6.67-4.97z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>

          {/* Signup Switch Link */}
          <div className="text-center text-xs text-[var(--text-secondary)] font-medium pt-3 border-t border-[var(--border-subtle)]">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-[var(--accent-primary)] font-bold hover:underline">
              Create an organization or volunteer account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
