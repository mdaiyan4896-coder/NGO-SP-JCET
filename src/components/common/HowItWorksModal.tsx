import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Users,
  Calendar,
  CheckCircle2,
  BarChart3,
  MessageSquare,
  Shield,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Check,
  QrCode,
  Download,
  Send,
  Clock,
  MapPin,
  Lock,
  Layers,
  Award,
  Smartphone,
  Eye,
  FileSpreadsheet,
  Globe2,
  RefreshCw,
  BellRing,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';

export type FeatureKey =
  | 'registration'
  | 'scheduling'
  | 'attendance'
  | 'reporting'
  | 'communication'
  | 'team';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFeature?: FeatureKey;
}

interface FeatureData {
  id: FeatureKey;
  title: string;
  badge: string;
  badgeVariant: 'teal' | 'emerald' | 'cyan' | 'amber' | 'indigo' | 'coral';
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  primaryActionLabel: string;
  primaryActionRoute: string;
  steps: {
    number: string;
    title: string;
    description: string;
    tip: string;
  }[];
}

const FEATURE_LIST: FeatureData[] = [
  {
    id: 'registration',
    title: 'Volunteer Registration & Onboarding',
    badge: 'Self-Service',
    badgeVariant: 'teal',
    icon: Users,
    tagline: 'Frictionless self-signup, instant skill tagging, and verified digital volunteer profiles.',
    description:
      'Eliminate paper forms and messy spreadsheets. VolunEase gives your non-profit a modern branded registration portal where volunteers create profiles, select verified skill categories, and submit background credentials in under 2 minutes.',
    primaryActionLabel: 'Explore Volunteers Roster',
    primaryActionRoute: '/dashboard/volunteers',
    steps: [
      {
        number: '01',
        title: 'Share Branded Registration Portal',
        description: 'Publish custom signup forms with custom waiver checkboxes, emergency contact requirements, and availability slots.',
        tip: 'Volunteers can sign up from their smartphones in under 90 seconds without downloading an app.',
      },
      {
        number: '02',
        title: 'Smart Skill Taxonomy & Availability',
        description: 'Volunteers choose their proficiencies across 16 standard skill categories (First Aid, Tree Planting, Food Prep, etc.).',
        tip: 'Our AI coordinator engine instantly matches volunteers to upcoming shifts based on skill compatibility.',
      },
      {
        number: '03',
        title: 'Verified Digital Pass & Welcome Kit',
        description: 'Approved volunteers receive an instant digital volunteer pass, emergency guidelines, and calendar integration.',
        tip: 'Track reliability scores from day one with automatic 100% initial rating.',
      },
    ],
  },
  {
    id: 'scheduling',
    title: 'Event Scheduling & Shift Calendar',
    badge: 'Smart Sync',
    badgeVariant: 'emerald',
    icon: Calendar,
    tagline: 'Publish complex community shifts with skill constraints and auto-sync to calendars.',
    description:
      'Manage multi-day missions, set volunteer capacity thresholds, and ensure every shift has required certifications like CPR or multilingual leads. Automated reminders prevent no-shows by up to 40%.',
    primaryActionLabel: 'Open Events Calendar',
    primaryActionRoute: '/dashboard/events',
    steps: [
      {
        number: '01',
        title: 'Create Shifts with Skill Requirements',
        description: 'Define location coordinates, start/end dates, team capacity, and required coordinator leads.',
        tip: 'Set minimum capacity thresholds to trigger automatic alerts if extra hands are needed.',
      },
      {
        number: '02',
        title: 'Automated Multi-Channel Reminders',
        description: 'System automatically dispatches SMS & email confirmations at 48 hours, 24 hours, and 2 hours prior to start.',
        tip: 'Includes live Google Maps directions and weather forecast for the event location.',
      },
      {
        number: '03',
        title: '1-Click Calendar Sync (Google & Apple)',
        description: 'Volunteers export shifts to Google Calendar, Apple iCal, or Microsoft Outlook with live updates.',
        tip: 'Schedule changes automatically synchronize to subscribers’ mobile calendars.',
      },
    ],
  },
  {
    id: 'attendance',
    title: 'Instant QR & Geo Attendance',
    badge: 'Anti-Spoof',
    badgeVariant: 'cyan',
    icon: CheckCircle2,
    tagline: 'Cryptographically signed QR tokens, geo-fencing, and coordinator kiosk check-in.',
    description:
      'No more lost paper sign-in clipboards or proxy check-ins. On-site coordinators display a rotating dynamic QR code on a tablet or print-out. Volunteers scan once with their phone to clock in with timestamp and GPS verification.',
    primaryActionLabel: 'Launch Attendance Scanner',
    primaryActionRoute: '/dashboard/attendance',
    steps: [
      {
        number: '01',
        title: 'Dynamic Rotating QR Code',
        description: 'Event QR code rotates every 60 seconds with HMAC encryption to prevent photo sharing and remote fraud.',
        tip: 'Works seamlessly on mobile screens or printed event signs.',
      },
      {
        number: '02',
        title: '1-Second Mobile Check-In',
        description: 'Volunteers scan the code using their native phone camera or coordinator kiosk scanner.',
        tip: 'Captures precise check-in time and calculates service hours down to the minute.',
      },
      {
        number: '03',
        title: 'Live WebSocket Coordinator Roster',
        description: 'Coordinators see who is on-site in real-time. Offline scanning queue automatically flushes when reconnected.',
        tip: 'Manual override allows coordinators to mark volunteers present even if their phone battery died.',
      },
    ],
  },
  {
    id: 'reporting',
    title: 'Activity & Impact PDF Reporting',
    badge: 'Export Ready',
    badgeVariant: 'amber',
    icon: BarChart3,
    tagline: 'Auto-generate grant-ready impact summaries, styled Excel sheets, and luxury service certificates.',
    description:
      'Satisfy board members, donors, and grant audits with single-click reporting. Track total economic contribution value ($31.80/hr benchmark), export formatted spreadsheets, and award official volunteer certificates.',
    primaryActionLabel: 'View Reports & Exports',
    primaryActionRoute: '/dashboard/reports',
    steps: [
      {
        number: '01',
        title: 'Automated Grant Summaries',
        description: 'One-click summaries calculating total hours, volunteer retention, and equivalent economic community value.',
        tip: 'Includes visual charts perfect for inclusion in annual grant applications.',
      },
      {
        number: '02',
        title: 'Styled Multi-Tab Excel Exports',
        description: 'Export complete event rosters, volunteer contact lists, and hour ledgers with styled header styling.',
        tip: 'Compatible with Microsoft Excel, Google Sheets, and CRM databases.',
      },
      {
        number: '03',
        title: 'Gold-Foil Service Certificates',
        description: 'Volunteers download high-resolution PDF certificates with unique QR verification codes for schools & employers.',
        tip: 'Recognize top contributors automatically when they cross 50, 100, and 250 service hour milestones.',
      },
    ],
  },
  {
    id: 'communication',
    title: 'Volunteer Communication Hub',
    badge: 'Multi-Channel',
    badgeVariant: 'indigo',
    icon: MessageSquare,
    tagline: 'Bulk SMS alerts, targeted broadcast messaging, and instant post-event feedback surveys.',
    description:
      'Keep your community engaged and informed. Send urgent weather updates, call for emergency volunteer dispatch, and gather feedback ratings after every event to continuously improve your operations.',
    primaryActionLabel: 'Open Communication Dispatch',
    primaryActionRoute: '/dashboard',
    steps: [
      {
        number: '01',
        title: 'Targeted Role & Event Segmentation',
        description: 'Broadcast to all volunteers, or selectively filter to only those attending a specific tomorrow shift.',
        tip: 'Filter by skills like "First Aid Certified" for emergency storm relief or medical stations.',
      },
      {
        number: '02',
        title: 'Multi-Channel Reach (SMS + Push + Email)',
        description: 'Deliver time-sensitive announcements straight to volunteers’ text inboxes and portal notification trays.',
        tip: 'Volunteers can set granular notification preferences to avoid notification fatigue.',
      },
      {
        number: '03',
        title: 'AI Announcement & Survey Generator',
        description: 'Use our built-in Volley AI to compose compelling volunteer recruitment calls and thank-you notes.',
        tip: 'Collect 1-5 star ratings and feedback testimonials immediately after shift check-out.',
      },
    ],
  },
  {
    id: 'team',
    title: 'Role & Team Management',
    badge: 'RBAC Security',
    badgeVariant: 'coral',
    icon: Shield,
    tagline: 'Granular role permissions, branch chapter segregation, and enterprise-grade 2FA security.',
    description:
      'Ensure the right people have the right access. Manage administrators, shift coordinators, board observers, and volunteers with full audit trails and optional two-factor authentication.',
    primaryActionLabel: 'Manage Team & Permissions',
    primaryActionRoute: '/dashboard/settings',
    steps: [
      {
        number: '01',
        title: '5-Tier Role-Based Access Control (RBAC)',
        description: 'Separate Super Admin, Org Admin, Field Coordinator, Viewer, and Volunteer privileges.',
        tip: 'Field coordinators can only edit events they are assigned to, keeping master settings safe.',
      },
      {
        number: '02',
        title: 'Multi-Branch Chapter Support',
        description: 'Organize non-profits across different city branches or regional hubs under one master account.',
        tip: 'Each branch maintains its own volunteer pool while sharing central reporting.',
      },
      {
        number: '03',
        title: 'Two-Factor Authentication & Audit Trail',
        description: 'Enforce TOTP authenticator app verification for staff with comprehensive immutable action logs.',
        tip: 'Includes 30-day soft-delete grace period to prevent accidental volunteer data loss.',
      },
    ],
  },
];

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  initialFeature = 'registration',
}) => {
  const navigate = useNavigate();
  const { success, info } = useToast();
  const [activeFeatureKey, setActiveFeatureKey] = useState<FeatureKey>(initialFeature);
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'interactive'>('walkthrough');

  // Interactive sandbox state for the 6 features
  // 1. Registration state
  const [simSkills, setSimSkills] = useState<string[]>(['First Aid', 'Tree Planting']);
  const [simName, setSimName] = useState('Alex Rivers');
  const [simRegistered, setSimRegistered] = useState(false);

  // 2. Scheduling state
  const [simCapacity, setSimCapacity] = useState(25);
  const [simEnrolled, setSimEnrolled] = useState(19);

  // 3. Attendance QR state
  const [qrSimSeconds, setQrSimSeconds] = useState(48);
  const [qrScanned, setQrScanned] = useState(false);

  // 4. Reporting state
  const [certHours, setCertHours] = useState(84.5);
  const [certTier, setCertTier] = useState<'Gold' | 'Silver' | 'Community'>('Gold');

  // 5. Communication state
  const [broadcastTarget, setBroadcastTarget] = useState('Tomorrow Clean-up Team (18)');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // 6. Team state
  const [rbacSelectedRole, setRbacSelectedRole] = useState<'ORG_ADMIN' | 'COORDINATOR' | 'VOLUNTEER'>('COORDINATOR');

  // Sync initialFeature when modal opens
  React.useEffect(() => {
    if (initialFeature) {
      setActiveFeatureKey(initialFeature);
      setActiveTab('walkthrough');
    }
  }, [initialFeature, isOpen]);

  if (!isOpen) return null;

  const currentFeature =
    FEATURE_LIST.find((f) => f.id === activeFeatureKey) || FEATURE_LIST[0];
  const currentIndex = FEATURE_LIST.findIndex((f) => f.id === activeFeatureKey);
  const FeatureIcon = currentFeature.icon;

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % FEATURE_LIST.length;
    setActiveFeatureKey(FEATURE_LIST[nextIdx].id);
    setActiveTab('walkthrough');
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + FEATURE_LIST.length) % FEATURE_LIST.length;
    setActiveFeatureKey(FEATURE_LIST[prevIdx].id);
    setActiveTab('walkthrough');
  };

  // Sim handlers
  const handleSimRegister = () => {
    setSimRegistered(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    success('Volunteer Registered! 🎉', `${simName} is now onboarded with verified skills!`);
  };

  const handleSimQrScan = () => {
    setQrScanned(true);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    success('Attendance Verified! ⚡', 'Clocked in at 09:00 AM via signed QR token!');
    setTimeout(() => setQrScanned(false), 3500);
  };

  const handleSimBroadcast = () => {
    setBroadcastSent(true);
    success('Broadcast Delivered! 📲', `Sent SMS and app notification to ${broadcastTarget}`);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-[var(--bg-backdrop)] backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[var(--bg-card)] via-[var(--bg-secondary)] to-[var(--bg-card)] border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary-light)] text-[var(--accent-primary)] flex items-center justify-center shrink-0 shadow-xs">
              <FeatureIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={currentFeature.badgeVariant}>{currentFeature.badge}</Badge>
                <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:inline-block">
                  Feature Spotlight ({currentIndex + 1} of {FEATURE_LIST.length})
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] leading-tight mt-0.5">
                {currentFeature.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-[var(--bg-elevated)] p-1 rounded-xl border border-[var(--border-subtle)] shadow-2xs">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Previous Feature"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                title="Next Feature"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-2xl border border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shadow-xs"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Category Selector Pills (Scrollable on mobile) */}
        <div className="px-6 py-2.5 bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {FEATURE_LIST.map((feat) => {
            const Icon = feat.icon;
            const isActive = feat.id === activeFeatureKey;
            return (
              <button
                key={feat.id}
                type="button"
                onClick={() => {
                  setActiveFeatureKey(feat.id);
                  setActiveTab('walkthrough');
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                    : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{feat.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Switcher: 3-Step Walkthrough vs Live Interactive Demo */}
        <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-[var(--border-subtle)] shrink-0 bg-[var(--bg-card)]">
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-lg hidden sm:block">
            {currentFeature.tagline}
          </p>
          <div className="flex items-center p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('walkthrough')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'walkthrough'
                  ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              How It Works (3 Steps)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('interactive')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'interactive'
                  ? 'bg-[var(--bg-elevated)] text-[var(--accent-primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--accent-primary)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Interactive Sandbox</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'walkthrough' ? (
            /* =========================================================
               TAB 1: 3-STEP WALKTHROUGH WITH DETAILED EXPLANATION
               ========================================================= */
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-[var(--accent-primary-light)]/40 border border-[var(--accent-primary)]/30 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                <span className="font-bold text-[var(--accent-primary)]">Overview: </span>
                {currentFeature.description}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentFeature.steps.map((st, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-all hover:shadow-md flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black font-['Plus_Jakarta_Sans'] text-gradient-teal">
                          {st.number}
                        </span>
                        <span className="w-7 h-7 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-xs font-bold text-[var(--accent-primary)]">
                          ✓
                        </span>
                      </div>
                      <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] leading-snug">
                        {st.title}
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {st.description}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-start gap-2">
                      <span className="text-amber-500 font-bold shrink-0">💡</span>
                      <span>{st.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* =========================================================
               TAB 2: LIVE INTERACTIVE SANDBOX DEMO
               ========================================================= */
            <div className="animate-in fade-in duration-150">
              {currentFeature.id === 'registration' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        Interactive Volunteer Registration Simulator
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Test how easy it is for a new volunteer to pick skills and complete onboarding.
                      </p>
                    </div>
                    <Badge variant="teal">Live Sandbox</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                        Volunteer Full Name
                      </label>
                      <input
                        type="text"
                        value={simName}
                        onChange={(e) => setSimName(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                        placeholder="e.g. Maya Chen"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                        Volunteer Email
                      </label>
                      <input
                        type="email"
                        defaultValue="alex.rivers@example.org"
                        className="w-full h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-primary)] block mb-2">
                      Select Volunteer Skills (Click to Toggle):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'First Aid & CPR',
                        'Tree Planting & Forestry',
                        'Beach & Waterway Cleanup',
                        'Food Prep & Packaging',
                        'Public Speaking',
                        'Heavy Logistics',
                        'Youth Mentorship',
                        'Emergency Disaster Relief',
                      ].map((skill) => {
                        const isSelected = simSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSimSkills(simSkills.filter((s) => s !== skill));
                              } else {
                                setSimSkills([...simSkills, skill]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-teal-500/15 border-teal-500 text-teal-700 dark:text-teal-300 font-bold shadow-2xs'
                                : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {simRegistered ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between animate-in zoom-in-95">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-200">
                            Digital Pass Generated for {simName}!
                          </div>
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                            Tagged with {simSkills.length} verified skills • Reliability: 100%
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setSimRegistered(false)}>
                        Reset Demo
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleSimRegister} className="w-full gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Simulate Volunteer Signup</span>
                    </Button>
                  )}
                </div>
              )}

              {currentFeature.id === 'scheduling' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        Interactive Shift Scheduling & Capacity Simulator
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        See how smart quotas and automatic reminders coordinate volunteers.
                      </p>
                    </div>
                    <Badge variant="emerald">Live Shift</Badge>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-[var(--text-primary)]">
                        Coastal Dune Restoration & Beach Cleanup
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                        Saturday, 09:00 AM - 01:00 PM
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-[var(--text-secondary)]">Shift Capacity:</span>
                        <span className="font-bold text-[var(--text-primary)]">
                          {simEnrolled} / {simCapacity} volunteers confirmed ({Math.round((simEnrolled / simCapacity) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, (simEnrolled / simCapacity) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSimEnrolled((prev) => Math.max(0, prev - 1))}
                        disabled={simEnrolled <= 0}
                      >
                        - Drop RSVP
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setSimEnrolled((prev) => Math.min(simCapacity, prev + 1))}
                        disabled={simEnrolled >= simCapacity}
                      >
                        + Add Volunteer RSVP
                      </Button>
                      <span className="text-xs text-[var(--text-muted)] ml-auto">
                        Auto-reminders active
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Next Automated Reminder: Friday at 09:00 AM (24h before shift)</span>
                    </div>
                    <span className="font-bold">Active</span>
                  </div>
                </div>
              )}

              {currentFeature.id === 'attendance' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        Dynamic Encrypted QR Scanner Simulator
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Rotating security token prevents screenshot sharing and guarantees physical presence.
                      </p>
                    </div>
                    <Badge variant="cyan">HMAC Signed</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    {/* Simulated QR Code on Screen */}
                    <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center shadow-md flex flex-col items-center">
                      <div className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center relative p-2">
                        <QrCode className="w-32 h-32 text-gray-900 animate-pulse" />
                        <span className="absolute bottom-1 right-2 text-[9px] bg-teal-600 text-white font-bold px-1.5 py-0.5 rounded">
                          ROTATING
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-800 mt-3 flex items-center justify-center gap-1.5">
                        <RefreshCw className="w-3 h-3 text-teal-600 animate-spin" />
                        <span>Token expires in: {qrSimSeconds}s</span>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-0.5">
                        Location: Ocean Beach Pier (GPS Validated)
                      </span>
                    </div>

                    {/* Volunteer Phone Scan Action */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]">
                          <Smartphone className="w-4 h-4 text-cyan-500" />
                          <span>Volunteer Phone Camera</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          Volunteer points phone at screen. Scanner reads HMAC cryptographic token, validates timestamp & GPS proximity in 150ms.
                        </p>
                      </div>

                      {qrScanned ? (
                        <div className="p-4 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-800 dark:text-cyan-200 text-xs font-bold flex items-center gap-2">
                          <Check className="w-4 h-4 text-cyan-500" />
                          <span>Instant Check-in Confirmed! Status: PRESENT</span>
                        </div>
                      ) : (
                        <Button onClick={handleSimQrScan} className="w-full gap-2 bg-cyan-600 hover:bg-cyan-700 text-white">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Simulate Camera QR Scan</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentFeature.id === 'reporting' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        Certificate & Grant PDF Generator Simulator
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Award verified service certificates and donor-ready metric sheets.
                      </p>
                    </div>
                    <Badge variant="amber">PDF & Excel</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          Volunteer Total Service Hours
                        </span>
                        <span className="text-sm font-extrabold text-amber-600">
                          {certHours} hrs
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        step="5"
                        value={certHours}
                        onChange={(e) => setCertHours(parseFloat(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-[var(--text-secondary)]">Economic Value:</span>
                        <span className="text-xs font-bold text-emerald-600">
                          ${(certHours * 31.8).toFixed(2)} USD
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>{certHours >= 100 ? 'Gold' : certHours >= 50 ? 'Silver' : 'Community'} Honor Certificate</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] mt-1">
                          Includes QR verification hash, executive signatures, and organization watermark.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="mt-3 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={() => {
                          info('Sample Certificate Generated!', 'Download package prepared for grant audit.');
                        }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Preview Certificate</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {currentFeature.id === 'communication' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        Multi-Channel Broadcast Dispatch Simulator
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Send targeted alerts via SMS, push notifications, and email in seconds.
                      </p>
                    </div>
                    <Badge variant="indigo">SMS & Push</Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                        Audience Filter:
                      </label>
                      <select
                        value={broadcastTarget}
                        onChange={(e) => setBroadcastTarget(e.target.value)}
                        className="w-full h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                      >
                        <option value="Tomorrow Clean-up Team (18)">Tomorrow Clean-up Team (18 volunteers)</option>
                        <option value="All Active Volunteers (142)">All Active Volunteers (142 volunteers)</option>
                        <option value="Emergency First Aid Certified Only (14)">Emergency First Aid Certified Only (14 volunteers)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[var(--text-primary)] block mb-1">
                        Message Preview:
                      </label>
                      <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono">
                        [GreenEarth Alert] Reminder: Wear heavy boots and sun hat for tomorrow’s Coastal Cleanup. Meet at 09:00 AM at Ocean Beach Pier. Tap link for map!
                      </div>
                    </div>

                    <Button
                      onClick={handleSimBroadcast}
                      disabled={broadcastSent}
                      className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                      <span>{broadcastSent ? 'Delivered to Inboxes!' : 'Simulate Multi-Channel Broadcast'}</span>
                    </Button>
                  </div>
                </div>
              )}

              {currentFeature.id === 'team' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        Interactive RBAC Permission Matrix Simulator
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Experience how roles isolate sensitive donor records from field volunteers.
                      </p>
                    </div>
                    <Badge variant="coral">Security Matrix</Badge>
                  </div>

                  <div className="flex gap-2">
                    {(['ORG_ADMIN', 'COORDINATOR', 'VOLUNTEER'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRbacSelectedRole(r)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          rbacSelectedRole === r
                            ? 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 shadow-2xs'
                            : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        {r === 'ORG_ADMIN' ? 'Org Admin' : r === 'COORDINATOR' ? 'Field Coordinator' : 'Volunteer'}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-xl border border-[var(--border-subtle)] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                        <tr>
                          <th className="py-2.5 px-3">Permission Capability</th>
                          <th className="py-2.5 px-3">Status for {rbacSelectedRole}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-subtle)]">
                        {[
                          { name: 'View Volunteer Roster', allowed: true },
                          { name: 'Scan & Validate Attendance', allowed: true },
                          { name: 'Create & Edit Shifts', allowed: rbacSelectedRole !== 'VOLUNTEER' },
                          { name: 'Export Official Donor Reports', allowed: rbacSelectedRole === 'ORG_ADMIN' },
                          { name: 'Manage Staff Credentials & 2FA', allowed: rbacSelectedRole === 'ORG_ADMIN' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-[var(--bg-secondary)]/50">
                            <td className="py-2.5 px-3 font-medium text-[var(--text-primary)]">{row.name}</td>
                            <td className="py-2.5 px-3">
                              {row.allowed ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-500/15 px-2 py-0.5 rounded-full text-[10px]">
                                  <Check className="w-3 h-3" /> Allowed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-500/15 px-2 py-0.5 rounded-full text-[10px]">
                                  <Lock className="w-3 h-3" /> Restricted
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Platform Jump Button */}
        <div className="px-6 py-4 bg-[var(--bg-card)] border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] order-2 sm:order-1">
            <span>Learn about all features anytime from the landing page.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <Button variant="secondary" onClick={onClose} className="flex-1 sm:flex-initial">
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                navigate(currentFeature.primaryActionRoute);
              }}
              className="flex-1 sm:flex-initial gap-2 shadow-glow"
            >
              <span>{currentFeature.primaryActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
