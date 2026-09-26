import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink,
  ChevronRight,
  Activity,
  AlertTriangle,
  Sun,
  CloudRain,
  Bell,
  QrCode,
  Send,
  Award,
  FileSpreadsheet,
  ShieldAlert,
  Zap,
  MessageSquare,
  Radio,
  Download,
  Flame,
  Check,
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PlusCircle,
  MessageCircle,
  Filter,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { QrCheckInModal } from '../components/attendance/QrCheckInModal';
import { useAuth } from '../context/AuthContext';
import { dataStore, EventModel } from '../services/api/dataStore';
import { useToast } from '../context/ToastContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, info } = useToast();

  const volunteers = dataStore.getVolunteers();
  const [eventsList, setEventsList] = useState<EventModel[]>(() => dataStore.getEvents());
  const attendance = dataStore.getAttendance();

  // Modals & Tool state
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastAudience, setBroadcastAudience] = useState('ALL');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  // Calling & VoIP Dispatch State
  const [callerModalOpen, setCallerModalOpen] = useState(false);
  const [dialPadNumber, setDialPadNumber] = useState('');
  const [activeCall, setActiveCall] = useState<{
    name: string;
    phone: string;
    avatar?: string;
    status: 'DIALING' | 'CONNECTED';
  } | null>(null);
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  // New Shift Creation Modal
  const [newShiftModalOpen, setNewShiftModalOpen] = useState(false);
  const [shiftForm, setShiftForm] = useState({
    title: '',
    category: 'Environmental' as EventModel['category'],
    location: '',
    startDateTime: '2026-10-25T09:00:00',
    endDateTime: '2026-10-25T13:00:00',
    capacity: 25,
    description: '',
  });

  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>('ALL');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedEventForQr, setSelectedEventForQr] = useState(eventsList[0]?.id || 'ev-1');

  const [sosSent, setSosSent] = useState(false);

  // Call timer effect
  React.useEffect(() => {
    let interval: any = null;
    if (activeCall && activeCall.status === 'CONNECTED') {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleStartCall = (name: string, phone: string, avatar?: string) => {
    setActiveCall({
      name,
      phone,
      avatar,
      status: 'DIALING',
    });
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'CONNECTED' } : null));
    }, 1500);
  };

  const handleEndCall = () => {
    if (activeCall) {
      info('Call Ended', `Call with ${activeCall.name} lasted ${Math.floor(callTimer / 60)}m ${callTimer % 60}s.`);
    }
    setActiveCall(null);
    setCallTimer(0);
    setIsMuted(false);
  };

  const handleQuickRsvp = (eventId: string) => {
    const updated = eventsList.map((ev) => {
      if (ev.id === eventId) {
        const isFull = ev.registeredCount >= ev.capacity;
        const newCount = isFull ? ev.registeredCount - 1 : ev.registeredCount + 1;
        return { ...ev, registeredCount: newCount };
      }
      return ev;
    });
    setEventsList(updated);
    dataStore.saveEvents(updated);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    success('Shift Roster Updated', 'Volunteers registered count successfully adjusted.');
  };

  const handleCreateNewShift = () => {
    if (!shiftForm.title || !shiftForm.location) {
      info('Incomplete Form', 'Please provide a shift title and location.');
      return;
    }
    const newEvent: EventModel = {
      id: `ev-${Date.now()}`,
      title: shiftForm.title,
      description: shiftForm.description || 'Community service initiative organized by GreenEarth coordinators.',
      category: shiftForm.category,
      location: shiftForm.location,
      latitude: 37.7749,
      longitude: -122.4194,
      startDateTime: shiftForm.startDateTime,
      endDateTime: shiftForm.endDateTime,
      capacity: Number(shiftForm.capacity) || 20,
      registeredCount: 1,
      attendedCount: 0,
      status: 'UPCOMING',
      coordinatorName: user?.firstName || 'Aiyan',
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&auto=format&fit=crop&q=80',
      requiredSkills: ['Community Aid', 'Logistics'],
      qrCodeSecret: `qr_${Date.now()}`,
    };
    const updated = [newEvent, ...eventsList];
    setEventsList(updated);
    dataStore.saveEvents(updated);
    setNewShiftModalOpen(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    success('New Shift Scheduled! 📅', `"${newEvent.title}" is now open for volunteer registrations.`);
  };
  const totalVolunteers = volunteers.length;
  const upcomingEvents = eventsList.filter((e) => e.status === 'UPCOMING');
  const totalHours = volunteers.reduce((acc, v) => acc + (v.totalHoursContributed || 0), 0);
  const presentCount = attendance.filter((a) => a.status === 'PRESENT').length;
  const attendanceRate = Math.round((presentCount / (attendance.length || 1)) * 100);

  // Understaffed shift detection
  const understaffedEvent = eventsList.find((e) => e.registeredCount < e.capacity * 0.75) || eventsList[0];
  const volunteersNeeded = understaffedEvent ? understaffedEvent.capacity - understaffedEvent.registeredCount : 0;

  const stats = [
    {
      title: 'Total Active Volunteers',
      value: totalVolunteers,
      change: '+14% this month',
      isPositive: true,
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400',
      sparkline: [20, 24, 28, 35, 42, 50, 58],
    },
    {
      title: 'Scheduled NGO Events',
      value: upcomingEvents.length,
      change: '+4 shifts this week',
      isPositive: true,
      icon: Calendar,
      color: 'text-emerald-600 dark:text-emerald-400',
      sparkline: [4, 5, 3, 6, 7, 5, 8],
    },
    {
      title: 'Turnout Check-In Rate',
      value: `${attendanceRate}%`,
      change: '+5.2% vs target',
      isPositive: true,
      icon: CheckCircle2,
      color: 'text-cyan-600 dark:text-cyan-400',
      sparkline: [82, 85, 84, 88, 89, 91, 94],
    },
    {
      title: 'Hours Logged This Month',
      value: `${Math.round(totalHours)}h`,
      change: '+22.5% impact growth',
      isPositive: true,
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400',
      sparkline: [450, 520, 610, 780, 950, 1100, 1340],
    },
  ];

  const recentActivity = [
    {
      actor: 'Elena Rostova',
      action: 'checked into',
      target: 'Coastal Dune Restoration & Beach Cleanup',
      time: '12 minutes ago',
      type: 'CHECKIN',
      method: 'QR Optical',
    },
    {
      actor: 'Aarav Sharma',
      action: 'completed 4.0 verified hours for',
      target: 'Community Food Bank Packaging',
      time: '1 hour ago',
      type: 'HOURS',
      method: 'Manual Audit',
    },
    {
      actor: 'Jordan Taylor',
      action: 'submitted volunteer qualification dossier in First Aid',
      target: '',
      time: '3 hours ago',
      type: 'REGISTRATION',
      method: 'Self-Serve',
    },
    {
      actor: 'Priya Nair',
      action: 'earned 24K Royal Gold Impact Certificate (138.5 hrs)',
      target: '',
      time: '5 hours ago',
      type: 'AWARD',
      method: 'Aiyan Approved',
    },
  ];

  const handleSendBroadcast = async () => {
    if (!broadcastSubject || !broadcastMessage) {
      info('Missing Content', 'Please provide a subject and message text.');
      return;
    }
    setIsSendingBroadcast(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSendingBroadcast(false);
    setBroadcastModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    success(
      'Announcement Dispatched! 📣',
      `Sent SMS & email notifications to all volunteers in group: ${broadcastAudience}.`
    );
    setBroadcastSubject('');
    setBroadcastMessage('');
  };

  const handleTriggerSos = () => {
    setSosSent(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    success(
      'SOS Dispatch Broadcasted! 🚨',
      `Sent emergency SMS alerts to 18 nearby qualified volunteers for "${understaffedEvent.title}".`
    );
  };

  return (
    <div className="space-y-6 font-['Inter'] pb-16">
      {/* Welcome & Coordinator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              Operations Command Dashboard
            </h2>
            <Badge variant="accent">Staff Live</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Welcome back, <strong>{user?.firstName || 'Sofia'}</strong>! Managed by <strong>Aiyan</strong> & GreenEarth Action Leadership.
          </p>
        </div>

        {/* Top Quick Launch Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCallerModalOpen(true)}
            leftIcon={<PhoneCall className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
          >
            Volunteer Dialer & Phone
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setNewShiftModalOpen(true)}
            leftIcon={<PlusCircle className="w-3.5 h-3.5 text-emerald-500" />}
          >
            Schedule New Shift
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setBroadcastModalOpen(true)}
            leftIcon={<Bell className="w-3.5 h-3.5 text-amber-500" />}
          >
            Broadcast Announcement
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setQrModalOpen(true)}
            leftIcon={<QrCode className="w-3.5 h-3.5" />}
          >
            Launch QR Check-In
          </Button>
        </div>
      </div>

      {/* Operational Quick NGO Toolbelt */}
      <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-[var(--text-primary)] font-['Plus_Jakarta_Sans']">
            Operations Command Tools:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCallerModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>VoIP Calling Center</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Award Certificates</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold text-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV Reports</span>
          </button>
          <a
            href="tel:8431980683"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs transition-colors"
            title="Call Lead Coordinator Aiyan"
          >
            <span>📞 Call Aiyan (8431980683)</span>
          </a>
        </div>
      </div>

      {/* =====================================================
          TOOL 1: URGENT UNDERSTAFFED SHIFTS ALERT BANNER
          ===================================================== */}
      {understaffedEvent && volunteersNeeded > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Staffing Deficit Alert
                </span>
                <span className="text-[10px] bg-amber-500 text-gray-950 font-black px-1.5 py-0.5 rounded">
                  {volunteersNeeded} Volunteers Needed
                </span>
              </div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] mt-0.5">
                "{understaffedEvent.title}" starts in 36 hours and needs volunteer reinforcement!
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Currently at {understaffedEvent.registeredCount}/{understaffedEvent.capacity} capacity. Targeted roles: Beach Steward & Logistics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            {sosSent ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 font-bold text-xs">
                <Check className="w-4 h-4" />
                <span>SOS Sent to 18 Volunteers</span>
              </div>
            ) : (
              <Button
                variant="accent"
                size="sm"
                onClick={handleTriggerSos}
                leftIcon={<Flame className="w-3.5 h-3.5 text-white animate-bounce" />}
              >
                Broadcast Urgent Shift SOS
              </Button>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          TOOL 2: 4 METRIC KPI STAT CARDS
          ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} padding="md" className="space-y-3 relative overflow-hidden group hover:border-[var(--accent-primary)] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className="p-2 rounded-xl bg-[var(--bg-secondary)] group-hover:bg-[var(--accent-primary-light)] transition-colors">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] tracking-tight">
                  {stat.value}
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {stat.change}
                </span>
              </div>

              {/* Sparkline Visual */}
              <div className="h-2 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden flex items-end">
                <div
                  className="h-full bg-gradient-teal rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (idx + 1) * 25)}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* =====================================================
          MIDDLE ROW: WEATHER WIDGET + ANNUAL NGO MILESTONE TRACKER
          ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOOL 3: Outdoor Weather & Field Safety Monitor */}
        <Card padding="md" className="space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Event Field Conditions & Weather</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
              Clear & Safe
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              <Sun className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '20s' }} />
              <div>
                <div className="text-2xl font-black font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                  24°C / 75°F
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">Ocean Beach & Coastal Dunes</div>
              </div>
            </div>

            <div className="text-right text-[11px] space-y-0.5 text-[var(--text-secondary)]">
              <div>💨 Wind: <strong>12 km/h WNW</strong></div>
              <div>☀️ UV Index: <strong>5 (Moderate)</strong></div>
              <div>💧 Rain Risk: <strong>5%</strong></div>
            </div>
          </div>

          <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 p-2 rounded-xl bg-teal-500/10 text-teal-800 dark:text-teal-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Optimal conditions for Saturday Beach Cleanup. Advise sunscreen & hydration bottles.</span>
          </div>
        </Card>

        {/* TOOL 4: 2026 NGO Community Hours Milestone Tracker */}
        <Card padding="md" className="lg:col-span-2 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div>
              <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>2026 Annual NGO Impact Milestone</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)]">Progress towards GreenEarth's 6,000 Verified Service Hours Goal</p>
            </div>
            <span className="text-xs font-black text-[var(--accent-primary)]">
              84.5% Completed
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[var(--text-primary)]">
                <strong>5,070 Hours</strong> Achieved
              </span>
              <span className="text-[var(--text-muted)]">Target: 6,000 Hours</span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 w-full rounded-full bg-[var(--bg-secondary)] overflow-hidden p-0.5 border border-[var(--border-subtle)]">
              <div
                className="h-full rounded-full bg-gradient-teal transition-all duration-1000 shadow-sm"
                style={{ width: '84.5%' }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                ✓ 2,500h Seed Grant
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                ✓ 5,000h Regional Star
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                🎯 6,000h Global Leader
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* =====================================================
          BOTTOM SECTION: UPCOMING SHIFTS + LIVE ACTIVITY TICKER
          ===================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upcoming Shifts & Quick RSVPs */}
        <div className="lg:col-span-7 space-y-4">
          <Card padding="md" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                  Upcoming Volunteer Shifts ({upcomingEvents.length})
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setNewShiftModalOpen(true)}
                  leftIcon={<PlusCircle className="w-3 h-3 text-emerald-500" />}
                >
                  + New Shift
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => navigate('/dashboard/events')}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  All ({eventsList.length})
                </Button>
              </div>
            </div>

            {/* Shift Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {['ALL', 'Environmental', 'Community Aid', 'Disaster Relief', 'Caregiving', 'Education'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setEventCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    eventCategoryFilter === cat
                      ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat === 'ALL' ? 'All Types' : cat}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {upcomingEvents
                .filter((ev) => (eventCategoryFilter === 'ALL' ? true : ev.category === eventCategoryFilter))
                .map((ev) => {
                  const percentFilled = Math.min(100, Math.round((ev.registeredCount / ev.capacity) * 100));
                  return (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary-light)]/20 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                            {ev.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300">
                            {ev.category}
                          </span>
                          <Badge variant="default" className="text-[10px] py-0">
                            {ev.registeredCount}/{ev.capacity} RSVPs ({percentFilled}%)
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--text-muted)]">
                          <span>📅 {new Date(ev.startDateTime).toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })} • {new Date(ev.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>📍 {ev.location}</span>
                          <span>👤 Coord: {ev.coordinatorName}</span>
                        </div>
                        {/* Fill Progress Bar */}
                        <div className="h-1.5 w-full max-w-xs bg-[var(--bg-primary)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percentFilled >= 90
                                ? 'bg-amber-500'
                                : 'bg-gradient-teal'
                            }`}
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => handleQuickRsvp(ev.id)}
                          className="text-emerald-600 hover:bg-emerald-500/10 font-bold"
                          title="Click to toggle quick RSVP"
                        >
                          RSVP +1
                        </Button>
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => {
                            setSelectedEventForQr(ev.id);
                            setQrModalOpen(true);
                          }}
                          leftIcon={<QrCode className="w-3 h-3" />}
                        >
                          QR Pass
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>

        {/* Right Column: Live Attendance Ticker & Coordinator Audit Feed */}
        <div className="lg:col-span-5 space-y-4">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                  Live Volunteer Feed & Ticker
                </h3>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Stream
              </span>
            </div>

            <div className="space-y-3">
              {recentActivity.map((act, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[var(--text-primary)]">{act.actor}</span>
                    <span className="text-[var(--text-muted)]">{act.time}</span>
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    {act.action} <strong>{act.target}</strong>
                  </p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-[var(--text-muted)] border-t border-[var(--border-subtle)]">
                    <span>Validation: <strong>{act.method}</strong></span>
                    <span className="text-emerald-600 font-semibold">Verified ✓</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* =====================================================
          BROADCAST ANNOUNCEMENT MODAL TOOL
          ===================================================== */}
      <Modal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <span>Broadcast Volunteer Announcement</span>
          </div>
        }
        description="Dispatch an instant SMS and email alert to all or targeted volunteer groups."
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setBroadcastModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={isSendingBroadcast}
              onClick={handleSendBroadcast}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send Broadcast
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Target Volunteer Audience</label>
            <select
              value={broadcastAudience}
              onChange={(e) => setBroadcastAudience(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer font-medium"
            >
              <option value="ALL">All Registered Volunteers (Full Roster)</option>
              <option value="WEEKEND">Weekend Crew Only</option>
              <option value="BEACH_STEWARDS">Beach Stewards & Environmental Leads</option>
              <option value="FIRST_AID">Certified First Aid Volunteers</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Announcement Subject *</label>
            <Input
              value={broadcastSubject}
              onChange={(e) => setBroadcastSubject(e.target.value)}
              placeholder="e.g. Venue Reminder: Bring reusable water bottles tomorrow!"
            />
          </div>

          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Message Body *</label>
            <Textarea
              rows={4}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Hello Volunteers, this is an important message from coordinator Aiyan..."
            />
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Delivered via SMS + Email push gateway with delivery tracking.</span>
          </div>
        </div>
      </Modal>

      {/* QR Check-In Terminal Modal */}
      <QrCheckInModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        eventId={selectedEventForQr}
        eventTitle={eventsList.find((e) => e.id === selectedEventForQr)?.title || eventsList[0].title}
      />

      {/* =====================================================
          VOLUNTEER PHONE & VOIP DISPATCH CALLER MODAL
          ===================================================== */}
      <Modal
        isOpen={callerModalOpen}
        onClose={() => {
          if (activeCall) handleEndCall();
          setCallerModalOpen(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <span>Volunteer VoIP & Cellular Dispatch</span>
          </div>
        }
        description="Place cellular or VoIP simulated calls to volunteers or Lead Coordinator Aiyan."
        size="lg"
      >
        <div className="space-y-4 text-xs">
          {/* ACTIVE IN-CALL STATE SCREEN */}
          {activeCall ? (
            <div className="p-6 rounded-2xl bg-slate-950 text-white text-center space-y-4 shadow-xl border border-teal-500/30 animate-in zoom-in-95">
              <div className="relative inline-block mx-auto">
                <Avatar
                  name={activeCall.name}
                  src={activeCall.avatar}
                  size="xl"
                  status="busy"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                  <Phone className="w-2.5 h-2.5 text-white" />
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans']">{activeCall.name}</h3>
                <div className="text-xs text-slate-400">{activeCall.phone}</div>
                <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                  {activeCall.status === 'DIALING' ? (
                    <span className="animate-pulse">Ringing volunteer line... 📡</span>
                  ) : (
                    <span>
                      Connected • {Math.floor(callTimer / 60).toString().padStart(2, '0')}:
                      {(callTimer % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition-colors cursor-pointer ${
                    isMuted ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={handleEndCall}
                  className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-all transform hover:scale-105 cursor-pointer shadow-lg"
                  title="End Call"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSpeaker(!isSpeaker)}
                  className={`p-3 rounded-full transition-colors cursor-pointer ${
                    isSpeaker ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isSpeaker ? 'Speaker On' : 'Speaker Off'}
                >
                  {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column: Direct Keypad & Custom Number Dial */}
              <div className="md:col-span-5 space-y-3 p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center">
                <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Manual Phone Dialpad
                </div>

                <div className="h-10 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between text-sm font-mono font-bold text-[var(--text-primary)]">
                  <span>{dialPadNumber || 'Enter digits...'}</span>
                  {dialPadNumber && (
                    <button
                      type="button"
                      onClick={() => setDialPadNumber('')}
                      className="text-xs text-[var(--text-muted)] hover:text-rose-500"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDialPadNumber((prev) => prev + d)}
                      className="h-10 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--accent-primary-light)] text-[var(--text-primary)] font-bold text-sm transition-colors cursor-pointer border border-[var(--border-subtle)]"
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  disabled={!dialPadNumber}
                  onClick={() => handleStartCall(`Volunteer (${dialPadNumber})`, dialPadNumber)}
                  leftIcon={<PhoneCall className="w-4 h-4" />}
                >
                  Place Call
                </Button>
              </div>

              {/* Right Column: Lead Coordinator Direct Line + Quick Volunteer Contacts */}
              <div className="md:col-span-7 space-y-3">
                {/* Emergency Leadership Box: Aiyan */}
                <div className="p-3 rounded-2xl bg-teal-500/10 border-2 border-teal-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Aiyan Lead" size="md" status="online" />
                    <div>
                      <div className="font-bold text-xs text-[var(--text-primary)]">Aiyan (Lead Coordinator)</div>
                      <div className="text-[11px] text-[var(--text-muted)]">+91 8431980683 • Operations Lead</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href="tel:8431980683"
                      className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                      title="Direct Cellular Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <a
                      href="https://wa.me/918431980683"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                      title="WhatsApp Chat"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider pl-1">
                  Active Volunteer Roster Speed-Dial
                </div>

                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {volunteers.slice(0, 5).map((vol) => (
                    <div
                      key={vol.id}
                      className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={`${vol.firstName} ${vol.lastName}`} src={vol.avatarUrl} size="sm" />
                        <div className="truncate">
                          <div className="font-bold text-xs text-[var(--text-primary)] truncate">
                            {vol.firstName} {vol.lastName}
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] truncate">{vol.phone}</div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => handleStartCall(`${vol.firstName} ${vol.lastName}`, vol.phone, vol.avatarUrl)}
                        leftIcon={<PhoneCall className="w-3 h-3 text-teal-600" />}
                      >
                        Call
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* =====================================================
          SCHEDULE NEW SHIFT MODAL
          ===================================================== */}
      <Modal
        isOpen={newShiftModalOpen}
        onClose={() => setNewShiftModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span>Schedule New Volunteer Shift</span>
          </div>
        }
        description="Publish a new NGO service event or community shift with instant QR pass generation."
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setNewShiftModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateNewShift}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Publish Shift
            </Button>
          </div>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Shift / Event Title *</label>
            <Input
              value={shiftForm.title}
              onChange={(e) => setShiftForm({ ...shiftForm, title: e.target.value })}
              placeholder="e.g. Community Fresh Produce Harvest"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">Category</label>
              <select
                value={shiftForm.category}
                onChange={(e) => setShiftForm({ ...shiftForm, category: e.target.value as any })}
                className="w-full h-10 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer font-medium"
              >
                <option value="Environmental">Environmental</option>
                <option value="Community Aid">Community Aid</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Caregiving">Caregiving</option>
                <option value="Education">Education</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">Volunteer Capacity</label>
              <Input
                type="number"
                value={shiftForm.capacity}
                onChange={(e) => setShiftForm({ ...shiftForm, capacity: Number(e.target.value) })}
                placeholder="25"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Location & Address *</label>
            <Input
              value={shiftForm.location}
              onChange={(e) => setShiftForm({ ...shiftForm, location: e.target.value })}
              placeholder="e.g. Ocean Beach Boardwalk, SF"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">Start Date & Time</label>
              <Input
                type="datetime-local"
                value={shiftForm.startDateTime}
                onChange={(e) => setShiftForm({ ...shiftForm, startDateTime: e.target.value })}
              />
            </div>
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">End Date & Time</label>
              <Input
                type="datetime-local"
                value={shiftForm.endDateTime}
                onChange={(e) => setShiftForm({ ...shiftForm, endDateTime: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Short Description</label>
            <Textarea
              rows={2}
              value={shiftForm.description}
              onChange={(e) => setShiftForm({ ...shiftForm, description: e.target.value })}
              placeholder="Describe goals, recommended apparel, and duties..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
