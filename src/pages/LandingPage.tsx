import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Users,
  Calendar,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  Shield,
  Star,
  Check,
  Sparkles,
  Heart,
  Globe2,
  Clock,
  Layers,
  ChevronRight,
  Phone,
  Mail,
  Send,
  MessageCircle,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { HowItWorksModal, FeatureKey } from '../components/common/HowItWorksModal';
import { useToast } from '../context/ToastContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [annualBilling, setAnnualBilling] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [howItWorksModalOpen, setHowItWorksModalOpen] = useState(false);
  const [selectedFeatureKey, setSelectedFeatureKey] = useState<FeatureKey>('registration');
  const [activeStep, setActiveStep] = useState(0);

  const { success } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactSending, setContactSending] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSending(true);
    await new Promise((r) => setTimeout(r, 500));
    setContactSending(false);
    setContactSubmitted(true);
    success('Message Dispatched to Aiyan!', 'Thank you! Aiyan will contact you directly within 2 hours.');
  };

  // Auto-advance step timeline
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features: {
    key: FeatureKey;
    title: string;
    description: string;
    icon: any;
    badge: string;
    color: string;
  }[] = [
    {
      key: 'registration',
      title: 'Volunteer Registration & Onboarding',
      description: 'Self-service custom signup forms, automated skill tagging, and background check document collection.',
      icon: Users,
      badge: 'Self-Service',
      color: 'text-teal-600 dark:text-teal-400',
    },
    {
      key: 'scheduling',
      title: 'Event Scheduling & Shift Calendar',
      description: 'Create events, assign team shifts, send automated 24h reminders, and sync with Google or Apple calendars.',
      icon: Calendar,
      badge: 'Smart Sync',
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'attendance',
      title: 'Instant QR & Geo Attendance',
      description: 'Signed on-site QR code scanning, geo-tagged check-ins, real-time rosters, and manual coordinator overrides.',
      icon: CheckCircle2,
      badge: 'Anti-Spoof',
      color: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      key: 'reporting',
      title: 'Activity & Impact PDF Reporting',
      description: 'Auto-generate grant-ready impact summaries, export styled Excel sheets, and award official service certificates.',
      icon: BarChart3,
      badge: 'Export Ready',
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      key: 'communication',
      title: 'Volunteer Communication Hub',
      description: 'Send bulk SMS alerts, in-app volunteer notifications, and collect instant post-event feedback surveys.',
      icon: MessageSquare,
      badge: 'Multi-Channel',
      color: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      key: 'team',
      title: 'Role & Team Management',
      description: 'Assign coordinator roles, manage branch permissions, and group volunteers by emergency skills and availability.',
      icon: Shield,
      badge: 'RBAC Security',
      color: 'text-coral-600 dark:text-coral-400',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your NGO Profile',
      desc: 'Set up your non-profit workspace, customize your skills taxonomy, and brand your volunteer portal in minutes.',
      icon: Globe2,
    },
    {
      number: '02',
      title: 'Invite & Onboard Volunteers',
      desc: 'Share self-registration links or import your current roster. Volunteers build verified skill profiles.',
      icon: Users,
    },
    {
      number: '03',
      title: 'Schedule Events & Track Attendance',
      desc: 'Publish shifts with skill requirements. Volunteers RSVP and check in seamlessly using encrypted QR codes.',
      icon: Calendar,
    },
    {
      number: '04',
      title: 'Generate Reports & Celebrate Impact',
      desc: 'Automate hour verifications, download donor impact reports, and award beautiful community certificates.',
      icon: Sparkles,
    },
  ];

  const testimonials = [
    {
      quote: "VolunEase cut our weekly event administration from 12 hours to under 30 minutes. The QR code check-in eliminated paper sign-in chaos entirely.",
      author: 'Marcus Vance',
      role: 'Operations Director',
      org: 'Urban Canopy Initiative',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      rating: 5,
    },
    {
      quote: "Our volunteers love having their own portal! Downloading verified service certificates for college applications has made our recruitment soar.",
      author: 'Amara Okafor',
      role: 'Volunteer Engagement Lead',
      org: 'Global Youth Literacy Alliance',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      rating: 5,
    },
    {
      quote: "The AI attendance forecast accurately predicted a 15% drop during rainy weather, allowing us to proactively recruit backups. Truly game-changing.",
      author: 'Elena Gomez',
      role: 'Emergency Response Lead',
      org: 'Coastal Wildlife Rescue',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] font-['Inter'] relative selection:bg-teal-500/20 selection:text-teal-600">
      <Navbar />

      {/* =====================================================
          HERO SECTION (Prompt 1, 9)
          ===================================================== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Ambient Gradient Mesh Blobs in Background */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-teal-500/15 via-emerald-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-blob-1" />
        <div className="absolute top-48 right-10 w-[450px] h-[450px] bg-gradient-to-br from-coral-500/10 to-teal-400/15 rounded-full blur-3xl pointer-events-none -z-10 animate-blob-2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Mission Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-primary-light)] border border-[var(--accent-primary)]/20 text-xs font-semibold text-[var(--accent-primary)] animate-in fade-in slide-in-from-top-4 duration-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Volunteer Management for NGOs</span>
              </div>

              {/* Bold Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight text-[var(--text-primary)] leading-[1.12]">
                Manage Volunteers.{' '}
                <span className="text-gradient-teal block sm:inline">Multiply Impact.</span>
              </h1>

              {/* Subheadline in Warm Human Language */}
              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                VolunEase streamlines volunteer onboarding, intelligent event scheduling, real-time QR attendance, and automated donor reports — so your non-profit can focus on changing lives.
              </p>

              {/* CTAs - Log In as primary entry point */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => navigate('/login')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto text-base shadow-xl px-8 py-3.5 hover:scale-105 transition-transform"
                >
                  Log In to VolunEase
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setVideoModalOpen(true)}
                  leftIcon={<Play className="w-4 h-4 text-[var(--accent-secondary)] fill-current" />}
                  className="w-full sm:w-auto"
                >
                  Platform Walkthrough
                </Button>
              </div>

              {/* Trust metrics under buttons */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>

            {/* Right Hero Mockup: 3D Floating Dashboard Card */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-md animate-float">
                {/* Main Glassmorphic Mockup Card */}
                <div className="rounded-3xl bg-[var(--bg-elevated)]/90 backdrop-blur-2xl border border-teal-500/25 p-5 sm:p-6 shadow-2xl shadow-teal-950/10 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full blur-xl pointer-events-none" />

                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-400 shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-xs" />
                      <span className="text-xs font-bold text-[var(--text-primary)] font-['Plus_Jakarta_Sans'] ml-2">VolunEase Live Roster</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live Event
                    </span>
                  </div>

                  {/* Sample Live Volunteer Check-ins */}
                  <div className="space-y-2.5 relative z-10">
                    {[
                      { name: 'Elena Rostova', role: 'Marine Specialist', hours: '112.0h', status: 'Checked In', time: '09:25 AM', avatarBg: 'from-teal-500 to-emerald-500' },
                      { name: 'Aarav Sharma', role: 'Logistics Lead', hours: '84.5h', status: 'Checked In', time: '09:28 AM', avatarBg: 'from-emerald-500 to-teal-600' },
                      { name: 'Priya Nair', role: 'Youth Educator', hours: '138.5h', status: 'Checked In', time: '09:32 AM', avatarBg: 'from-cyan-500 to-blue-600' },
                    ].map((v, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-secondary)]/80 backdrop-blur-sm text-xs border border-[var(--border-subtle)] hover:border-teal-500/40 transition-all hover:scale-[1.01]"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${v.avatarBg} text-white font-extrabold flex items-center justify-center text-xs shadow-xs`}>
                            {v.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[var(--text-primary)] text-xs">{v.name}</div>
                            <div className="text-[10px] text-[var(--text-muted)] font-medium">{v.role}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full shadow-2xs">
                            {v.status}
                          </span>
                          <div className="text-[9px] text-[var(--text-muted)] font-mono mt-0.5">{v.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Live Progress Bar */}
                  <div className="pt-2 relative z-10">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-[var(--text-secondary)]">
                      <span>Live Shift Attendance</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">34 of 40 Volunteers (85%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden p-0.5">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 w-[85%] shadow-xs transition-all duration-500" />
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1: 500+ NGOs */}
                <div className="absolute -top-6 -left-6 rounded-2xl bg-[var(--bg-elevated)]/90 backdrop-blur-xl border border-[var(--border-subtle)] px-4 py-2.5 shadow-xl flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)] animate-pulse-glow">
                  <span className="text-xl">🎉</span>
                  <div>
                    <div className="font-extrabold font-['Plus_Jakarta_Sans']">500+ NGOs</div>
                    <div className="text-[10px] font-medium text-[var(--text-muted)]">Active Worldwide</div>
                  </div>
                </div>

                {/* Floating Badge 2: 2M+ Hours Tracked */}
                <div className="absolute -bottom-6 -right-6 rounded-2xl bg-[var(--bg-elevated)]/90 backdrop-blur-xl border border-[var(--border-subtle)] px-4 py-2.5 shadow-xl flex items-center gap-2.5 text-xs font-bold text-[var(--text-primary)]">
                  <span className="text-xl">⏱️</span>
                  <div>
                    <div className="font-extrabold font-['Plus_Jakarta_Sans']">2M+ Hours Logged</div>
                    <div className="text-[10px] font-medium text-[var(--text-muted)]">Verified Service</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Bar below the fold */}
          <div className="mt-20 pt-10 border-t border-[var(--border-subtle)] text-center">
            <p className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] mb-6">
              Trusted by Changemakers Across 20+ Countries
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
              {['GreenEarth Action', 'Hope Pantry Alliance', 'Habitat Guardians', 'Global Literacy Aid', 'Ocean Care Network'].map((partner, idx) => (
                <div key={idx} className="flex items-center gap-2 font-bold font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-[var(--text-secondary)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                  <span>{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS / IMPACT COUNTER SECTION (Prompt 1, 9)
          ===================================================== */}
      <section className="py-16 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, number: '10,000+', label: 'Volunteers Mobilized' },
              { icon: Calendar, number: '1,200+', label: 'Community Events Run' },
              { icon: Clock, number: '2,000,000+', label: 'Service Hours Logged' },
              { icon: Heart, number: '500+', label: 'Empowered NGOs' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="space-y-2 group cursor-default">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-primary)] group-hover:scale-110 group-hover:border-[var(--accent-primary)] transition-all shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] text-gradient-teal">
                    {stat.number}
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[var(--text-secondary)]">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES SECTION (Prompt 1, 9: Spotlight Cards)
          ===================================================== */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="teal">Comprehensive Toolkit</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
            Everything Your NGO Needs to Succeed
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Built from the ground up for grassroots organizers, mission directors, and passionate volunteers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card
                key={idx}
                spotlight
                padding="lg"
                onClick={() => {
                  setSelectedFeatureKey(feat.key);
                  setHowItWorksModalOpen(true);
                }}
                className="flex flex-col justify-between cursor-pointer group hover:border-[var(--accent-primary)] hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary-light)] text-[var(--accent-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2.5 py-1 rounded-full border border-[var(--border-subtle)]">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFeatureKey(feat.key);
                    setHowItWorksModalOpen(true);
                  }}
                  className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-primary)] group-hover:translate-x-1 transition-transform cursor-pointer"
                >
                  <span>Learn how it works</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS (Prompt 1, 9: 4-Step Timeline)
          ===================================================== */}
      <section id="how-it-works" className="py-24 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="coral">Simplicity & Speed</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              Four Steps from Chaos to Clarity
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              A frictionless workflow designed to save staff hundreds of coordination hours every month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-6 rounded-2xl transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? 'bg-[var(--bg-elevated)] border-[var(--accent-primary)] shadow-lg scale-105'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] text-gradient-teal">
                      {st.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary-light)] text-[var(--accent-primary)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS SECTION (Prompt 1, 9)
          ===================================================== */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <Badge variant="teal">Real Stories</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
            Loved by Coordinators & Volunteers Alike
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            Hear from leaders transforming their communities with VolunEase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-amber-500 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-[var(--text-primary)] mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">{t.author}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{t.role}</div>
                  <div className="text-[10px] text-[var(--accent-primary)] font-semibold">{t.org}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          PRICING SECTION (Prompt 1, 9: NGO-Friendly)
          ===================================================== */}
      <section id="pricing" className="py-24 bg-[var(--bg-secondary)] border-y border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge variant="coral">Simple Non-Profit Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              Accessible Plans for Any Mission Scale
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Every plan includes unlimited volunteer logins and secure QR attendance tracking.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] mt-4">
              <button
                type="button"
                onClick={() => setAnnualBilling(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  !annualBilling
                    ? 'bg-gradient-teal text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnualBilling(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  annualBilling
                    ? 'bg-gradient-teal text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-gray-900 font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Community Free */}
            <Card padding="lg" className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                  Community
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  For small grassroots initiatives & student clubs.
                </p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-[var(--text-primary)]">$0</span>
                  <span className="text-xs text-[var(--text-muted)] ml-1">/ forever</span>
                </div>
                <ul className="space-y-3 text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-6">
                  {['Up to 50 active volunteers', '3 active events / month', 'QR check-in & check-out', 'Basic CSV roster export', 'Community forum support'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="secondary"
                className="w-full mt-8"
                onClick={() => navigate('/signup')}
              >
                Get Started Free
              </Button>
            </Card>

            {/* Growth (Most Popular) */}
            <Card
              padding="lg"
              className="flex flex-col justify-between relative border-2 border-[var(--accent-primary)] shadow-xl"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-coral text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                  Growth
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  For growing regional non-profits & active chapters.
                </p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-[var(--text-primary)]">
                    ${annualBilling ? '39' : '49'}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] ml-1">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-6">
                  {[
                    'Up to 500 active volunteers',
                    'Unlimited events & shifts',
                    'Real-time QR & Geo attendance',
                    'Branded PDF impact certificates',
                    'AI Volunteer-Event matching',
                    'Priority email & chat support',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="primary"
                className="w-full mt-8"
                onClick={() => navigate('/signup')}
              >
                Start 14-Day Free Trial
              </Button>
            </Card>

            {/* Enterprise */}
            <Card padding="lg" className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                  Enterprise
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  For nationwide NGOs with multiple chapters & custom SSO.
                </p>
                <div className="my-6">
                  <span className="text-4xl font-extrabold text-[var(--text-primary)]">Custom</span>
                </div>
                <ul className="space-y-3 text-xs text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-6">
                  {[
                    'Unlimited volunteers & branches',
                    'SAML 2.0 / Okta SSO & 2FA enforcement',
                    'Custom database & API webhooks',
                    'Dedicated non-profit success manager',
                    'Automated weekly AI grant digests',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="secondary"
                className="w-full mt-8"
                onClick={() => navigate('/signup')}
              >
                Contact Sales
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT US SECTION (Aiyan - 8431980683, mdaiyan4896@gmail.com)
          ===================================================== */}
      <section id="contact" className="py-20 relative bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] bg-[var(--accent-primary-light)] px-3 py-1 rounded-full">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] tracking-tight">
              Connect Directly with Our Leadership
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Have questions about deploying VolunEase for your NGO, custom integrations, or volunteer grants? Reach out directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Direct Contact Card for Aiyan */}
            <div className="lg:col-span-5 rounded-3xl bg-[var(--bg-elevated)]/90 backdrop-blur-xl border border-teal-500/25 p-6 sm:p-8 shadow-2xl shadow-teal-950/5 space-y-6 relative overflow-hidden group hover:border-teal-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-teal-500/15 via-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center font-black font-['Plus_Jakarta_Sans'] text-2xl shadow-lg shadow-teal-500/20">
                    A
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--bg-elevated)] flex items-center justify-center shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                      Aiyan
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[var(--accent-primary)] mt-0.5">
                    Lead Coordinator & Operations Director
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] font-medium">VolunEase Global Core Team</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)] text-xs relative z-10">
                {/* Phone */}
                <div className="p-3 rounded-2xl bg-[var(--bg-secondary)]/80 border border-[var(--border-subtle)] hover:border-teal-500/40 transition-all flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-[var(--accent-primary)] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Direct Telephone / Call</div>
                    <a
                      href="tel:8431980683"
                      className="text-sm font-extrabold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors block font-mono"
                    >
                      +91 8431980683
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="p-3 rounded-2xl bg-[var(--bg-secondary)]/80 border border-[var(--border-subtle)] hover:border-teal-500/40 transition-all flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Direct Email Inquiries</div>
                    <a
                      href="mailto:mdaiyan4896@gmail.com"
                      className="text-xs font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors break-all block"
                    >
                      mdaiyan4896@gmail.com
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="p-3 rounded-2xl bg-[var(--bg-secondary)]/80 border border-[var(--border-subtle)] hover:border-emerald-500/40 transition-all flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">WhatsApp Direct Chat</div>
                    <a
                      href="https://wa.me/918431980683?text=Hi%20Aiyan,%20I'm%20interested%20in%20VolunEase%20for%20our%20NGO."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>Chat on WhatsApp (+91 8431980683)</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 relative z-10">
                <a
                  href="tel:8431980683"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary-light)] text-[var(--text-primary)] font-bold text-xs border border-[var(--border-subtle)] transition-all cursor-pointer shadow-xs hover:border-[var(--accent-primary)]"
                >
                  <Phone className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Call Aiyan</span>
                </a>
                <a
                  href="mailto:mdaiyan4896@gmail.com"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/90 border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] flex items-center gap-2 relative z-10">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Response guaranteed within 2 hours • 24/7 emergency dispatch support.</span>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="lg:col-span-7 rounded-3xl bg-[var(--bg-elevated)]/90 backdrop-blur-xl border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] mb-1">
                Send an Instant Message to Aiyan
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-6 font-medium">
                Fill in your non-profit details below for immediate consultation and platform onboarding.
              </p>

              {contactSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                    Message Dispatched Successfully!
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                    Thank you! Aiyan will review your inquiry and reach back via phone (<strong>8431980683</strong>) or email (<strong>mdaiyan4896@gmail.com</strong>) shortly.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({ name: '', email: '', phone: '', organization: '', message: '' });
                    }}
                  >
                    Send Another Note
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-[var(--text-secondary)] block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[var(--text-secondary)] block mb-1">Organization / NGO *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.organization}
                        onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                        placeholder="e.g. Wildlife Habitat Network"
                        className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-[var(--text-secondary)] block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="sarah@organization.org"
                        className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-[var(--text-secondary)] block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-[var(--text-secondary)] block mb-1">Your Message or Query *</label>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell Aiyan about your volunteer management goals, number of volunteers, or specific features needed..."
                      className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full text-sm font-bold shadow-md"
                    isLoading={contactSending}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Send Direct Message to Aiyan
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA BANNER (Executive Modern Luxury Gradient - Log In to VolunEase)
          ===================================================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white p-8 sm:p-14 text-center relative overflow-hidden shadow-2xl border border-teal-500/20">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />

            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider mb-5 text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Transform Your Volunteer Experience</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight mb-4 text-white">
              Ready to Empower Your Volunteers?
            </h2>

            <p className="text-emerald-100/80 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal leading-relaxed">
              Join hundreds of high-impact NGOs saving time, scaling events, and inspiring communities worldwide.
            </p>

            <Button
              size="lg"
              variant="accent"
              onClick={() => navigate('/login')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-base px-8 py-3.5 shadow-2xl shadow-emerald-500/30 hover:scale-105 font-bold bg-gradient-to-r from-amber-500 to-coral-500 hover:from-amber-600 hover:to-coral-600 text-white border-0"
            >
              Log In to VolunEase Dashboard
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Video Demo Tour Modal */}
      <Modal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        title="VolunEase Platform Product Walkthrough"
        description="A 2-minute tour of volunteer onboarding, event check-in, and automated certificates."
        size="lg"
      >
        <div className="aspect-video bg-gray-950 rounded-2xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden border border-gray-800">
          <Play className="w-14 h-14 text-emerald-400 fill-emerald-400/20 mb-3 animate-pulse" />
          <h4 className="text-lg font-bold font-['Plus_Jakarta_Sans']">Interactive Product Tour</h4>
          <p className="text-xs text-gray-400 max-w-md text-center mt-1">
            Experience our instant QR scanning, coordinator shift scheduler, and live volunteer analytics in action.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-6"
            onClick={() => {
              setVideoModalOpen(false);
              navigate('/dashboard');
            }}
          >
            Launch Live Interactive Sandbox
          </Button>
        </div>
      </Modal>

      {/* Feature Deep Dive & Interactive How-It-Works Modal */}
      <HowItWorksModal
        isOpen={howItWorksModalOpen}
        onClose={() => setHowItWorksModalOpen(false)}
        initialFeature={selectedFeatureKey}
      />
    </div>
  );
};
