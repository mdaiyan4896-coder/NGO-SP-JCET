import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  MapPin,
  Sparkles,
  Download,
  Shield,
  ArrowRight,
  Heart,
  QrCode,
  Phone,
  MessageCircle,
  ExternalLink,
  Sun,
  Flame,
  Trophy,
  Share2,
  PlusCircle,
  Check,
  Search,
  Filter,
  FileText,
  Star,
  DollarSign,
  HelpCircle,
  Compass,
  Zap,
  Printer,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { LuxuryCertificate } from '../components/certificate/LuxuryCertificate';
import { dataStore, EventModel } from '../services/api/dataStore';
import { eventService } from '../services/api/eventService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { useColorTheme } from '../context/ColorContext';

export const VolunteerPortalPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { success, info } = useToast();
  const { t, currentLanguage } = useLanguage();
  const { activeColor, activeColorName } = useColorTheme();

  // Tab sync with URL
  const [activeTab, setActiveTab] = useState<'browse' | 'registered' | 'hours' | 'certificates'>('browse');

  useEffect(() => {
    if (location.pathname.includes('/registrations')) setActiveTab('registered');
    else if (location.pathname.includes('/hours')) setActiveTab('hours');
    else if (location.pathname.includes('/certificates')) setActiveTab('certificates');
  }, [location.pathname]);

  const [events, setEvents] = useState<EventModel[]>(() => dataStore.getEvents());
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>(['ev-1', 'ev-5']);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modals state
  const [qrPassModalOpen, setQrPassModalOpen] = useState(false);
  const [selectedPassEvent, setSelectedPassEvent] = useState<EventModel | null>(null);

  const [claimHoursModalOpen, setClaimHoursModalOpen] = useState(false);
  const [claimForm, setClaimForm] = useState({
    eventTitle: '',
    date: new Date().toISOString().split('T')[0],
    hours: '3.5',
    supervisor: 'Aiyan',
    description: '',
  });

  const attendanceRecords = dataStore.getAttendance();

  const handleRsvp = async (event: EventModel) => {
    try {
      await eventService.registerVolunteer(
        event.id,
        user?.id || 'vol-1',
        `${user?.firstName} ${user?.lastName}`
      );

      setRegisteredEventIds((prev) => [...prev, event.id]);
      setEvents(dataStore.getEvents());

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#0EA47A', '#10B981', '#38BDF8', '#F59E0B', '#EC4899'],
      });

      success(
        "You're Registered! 🎉",
        `We've reserved your spot for "${event.title}". Your digital check-in pass is ready!`
      );
    } catch (err: any) {
      info('Notice', err.message);
    }
  };

  const handleCancelRsvp = (eventId: string, title: string) => {
    setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
    info('RSVP Withdrawn', `Your registration for "${title}" has been cancelled.`);
  };

  const handleOpenEventPass = (event: EventModel) => {
    setSelectedPassEvent(event);
    setQrPassModalOpen(true);
  };

  const handleOpenGeneralPass = () => {
    const defaultEv = events.find((e) => registeredEventIds.includes(e.id)) || events[0];
    setSelectedPassEvent(defaultEv);
    setQrPassModalOpen(true);
  };

  const handleSubmitHoursClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimForm.eventTitle || !claimForm.hours) {
      info('Missing Info', 'Please enter an event title and hours worked.');
      return;
    }
    setClaimHoursModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    success(
      'Service Hours Claim Submitted! ⏱️',
      `Submitted ${claimForm.hours} hours for "${claimForm.eventTitle}". Coordinator Aiyan will audit and verify shortly.`
    );
    setClaimForm({
      eventTitle: '',
      date: new Date().toISOString().split('T')[0],
      hours: '3.5',
      supervisor: 'Aiyan',
      description: '',
    });
  };

  const handleDownloadTimesheetCsv = () => {
    const headers = ['Record ID', 'Service Initiative', 'Date', 'Check-In Method', 'Hours Logged', 'Verification Status', 'Coordinator'];
    const rows = attendanceRecords.map((att, i) => [
      `"ATT-2026-00${i + 1}"`,
      `"Senior Citizens Nutrition & Wellness Walk"`,
      `"2026-09-20"`,
      `"${att.checkInMethod}"`,
      `"${att.durationMinutes ? (att.durationMinutes / 60).toFixed(1) : 4.0} hrs"`,
      `"VERIFIED"`,
      `"Aiyan & Sofia Martinez"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VolunEase_Timesheet_${user?.firstName || 'Volunteer'}_2026.csv`;
    a.click();
    URL.revokeObjectURL(url);
    success('Timesheet Exported! 📊', 'Your verified volunteer attendance records have been downloaded.');
  };

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = categoryFilter === 'ALL' || ev.category === categoryFilter;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const registeredEvents = events.filter((e) => registeredEventIds.includes(e.id));

  return (
    <div className="space-y-6 font-['Inter'] pb-16">
      {/* =====================================================
          1. VIBRANT AURORA HERO BANNER WITH LEVEL & PROGRESS
          ===================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-white/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-60 h-60 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Level 4 Community Champion</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/25 text-amber-200 border border-amber-300/40">
                <Trophy className="w-3 h-3 text-amber-300" />
                <span>Top 5% Contributor</span>
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
                Welcome back, {user?.firstName || 'Elena'}! 🌟
              </h2>
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed mt-1">
                You have contributed <strong className="text-white font-bold">112.0 verified hours</strong> to climate resilience & humanitarian aid under Lead Coordinator <strong>Aiyan</strong>.
              </p>
            </div>

            {/* Level Milestone Progress Bar */}
            <div className="space-y-1.5 pt-1 max-w-md">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-emerald-100">Progress to Level 5 Platinum Distinction</span>
                <span className="text-amber-300">112 / 150 hrs (74.6%)</span>
              </div>
              <div className="h-2.5 w-full bg-black/25 backdrop-blur-xs rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 via-emerald-200 to-white shadow-sm transition-all duration-1000"
                  style={{ width: '74.6%' }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Tools in Hero */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenGeneralPass}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-all shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>My Digital QR Pass</span>
            </button>

            <button
              type="button"
              onClick={() => setClaimHoursModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs backdrop-blur-md transition-all cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>Log Hours Claim</span>
            </button>

            <a
              href="tel:8431980683"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-400/40 text-emerald-100 font-bold text-xs backdrop-blur-md transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>Call Coordinator Aiyan</span>
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================
          2. KPI STATS CARDS (Aesthetic & Colorful)
          ===================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Verified Service Hours',
            value: '112.0h',
            sub: '+18.5h this month',
            icon: Clock,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-500/10 border-emerald-500/20',
          },
          {
            label: 'Confirmed Shifts',
            value: `${registeredEvents.length} Shifts`,
            sub: '2 upcoming this week',
            icon: Calendar,
            color: 'text-teal-600 dark:text-teal-400',
            bg: 'bg-teal-500/10 border-teal-500/20',
          },
          {
            label: 'Reliability Turnout',
            value: '100%',
            sub: 'Zero unexcused absences',
            icon: CheckCircle2,
            color: 'text-cyan-600 dark:text-cyan-400',
            bg: 'bg-cyan-500/10 border-cyan-500/20',
          },
          {
            label: 'Economic Valuation',
            value: '$3,528',
            sub: '@ $31.50/hr civic value',
            icon: DollarSign,
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-500/10 border-amber-500/20',
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} padding="md" className={`space-y-2 border ${stat.bg} hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {stat.label}
                </span>
                <div className={`p-2 rounded-xl bg-[var(--bg-elevated)] ${stat.color} shadow-xs`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                {stat.value}
              </div>
              <div className="text-[11px] font-medium text-[var(--text-secondary)]">
                {stat.sub}
              </div>
            </Card>
          );
        })}
      </div>

      {/* =====================================================
          3. VOLUNTEER WORKBENCH TOOLBAR & TABS
          ===================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'browse', label: `${t('browseEvents', 'Browse Opportunities')} 🌿`, count: events.length, icon: Compass },
            { id: 'registered', label: `${t('myRegistrations', 'My Registered Shifts')} 🎟️`, count: registeredEvents.length, icon: CheckCircle2 },
            { id: 'hours', label: `${t('hoursAttendance', 'Attendance & Hours')} ⏱️`, count: attendanceRecords.length, icon: Clock },
            { id: 'certificates', label: `${t('myCertificates', 'My Certificates')} 🏆`, count: 1, icon: Award },
          ].map((tabItem) => {
            const Icon = tabItem.icon;
            const isSelected = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                onClick={() => setActiveTab(tabItem.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] shadow-xs border border-[var(--accent-primary)]/30'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tabItem.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isSelected
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  }`}
                >
                  {tabItem.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Lead Coordinator Contact Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://wa.me/918431980683"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-500/20 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Coordinator Aiyan</span>
          </a>
        </div>
      </div>

      {/* =====================================================
          TAB 1: BROWSE OPPORTUNITIES (Rich, Aesthetic & Functional)
          ===================================================== */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search Bar & Category Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search volunteer shifts, topics, or venues..."
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:bg-[var(--bg-elevated)] transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {['ALL', 'Environmental', 'Community Aid', 'Disaster Relief', 'Caregiving', 'Education'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {cat === 'ALL' ? 'All Initiatives' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Event Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => {
              const isRegistered = registeredEventIds.includes(ev.id);
              const percentFilled = Math.min(100, Math.round((ev.registeredCount / ev.capacity) * 100));

              return (
                <Card
                  key={ev.id}
                  spotlight
                  padding="none"
                  className="overflow-hidden flex flex-col justify-between group hover:border-[var(--accent-primary)] hover:shadow-xl transition-all duration-300 rounded-2xl border border-[var(--border-subtle)]"
                >
                  {/* Photo Header */}
                  <div className="relative h-48 w-full bg-[var(--bg-secondary)] overflow-hidden">
                    <img
                      src={ev.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {ev.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                        Verified Shift
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] font-bold flex items-center gap-1.5 text-emerald-300 drop-shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {new Date(ev.startDateTime).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            weekday: 'short',
                          })}{' '}
                          •{' '}
                          {new Date(ev.startDateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                        {ev.title}
                      </h3>

                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] pt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>

                      {/* Capacity Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-semibold text-[var(--text-muted)]">
                          <span>Capacity Roster</span>
                          <span className={percentFilled >= 90 ? 'text-amber-500 font-bold' : ''}>
                            {ev.registeredCount} / {ev.capacity} spots filled ({percentFilled}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              percentFilled >= 90 ? 'bg-amber-500' : 'bg-gradient-teal'
                            }`}
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                      {isRegistered ? (
                        <>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Spot Confirmed
                          </span>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleOpenEventPass(ev)}
                            leftIcon={<QrCode className="w-3.5 h-3.5 text-teal-600" />}
                          >
                            View QR Pass
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="text-[11px] text-[var(--text-muted)] font-medium">Free registration</span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleRsvp(ev)}
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                          >
                            RSVP for Shift
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 2: REGISTERED SHIFTS & ATTENDANCE PASSES
          ===================================================== */}
      {activeTab === 'registered' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <div>
              <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                Your Confirmed Volunteer Shifts ({registeredEvents.length})
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Bring your digital QR pass on event day. Coordinators will scan you in at the venue check-in desk.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenGeneralPass}
              leftIcon={<QrCode className="w-4 h-4 text-emerald-500" />}
            >
              Open Universal Pass
            </Button>
          </div>

          <div className="space-y-4">
            {registeredEvents.map((ev) => (
              <Card
                key={ev.id}
                padding="md"
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-2 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 transition-all rounded-2xl"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[var(--accent-primary)]">{ev.category}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold px-2 py-0.5 rounded-full">
                        Confirmed Entry ✓
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--text-primary)]">{ev.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                      <span>📅 {new Date(ev.startDateTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} • {new Date(ev.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>📍 {ev.location}</span>
                      <span>👤 Coord: {ev.coordinatorName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenEventPass(ev)}
                    leftIcon={<QrCode className="w-4 h-4" />}
                  >
                    Show Entry QR Pass
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancelRsvp(ev.id, ev.title)}
                    className="text-rose-600 hover:bg-rose-500/10 text-xs"
                  >
                    Withdraw RSVP
                  </Button>
                </div>
              </Card>
            ))}

            {registeredEvents.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                <Compass className="w-12 h-12 mx-auto text-[var(--text-muted)] animate-bounce" />
                <h4 className="font-bold text-base text-[var(--text-primary)]">No Registered Shifts Yet</h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                  Browse open community volunteer initiatives and RSVP to earn verified service hours and certificates!
                </p>
                <Button variant="primary" size="sm" onClick={() => setActiveTab('browse')}>
                  Browse Upcoming Shifts
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================
          TAB 3: HOURS & ATTENDANCE AUDIT LOG
          ===================================================== */}
      {activeTab === 'hours' && (
        <Card padding="none" className="overflow-hidden border border-[var(--border-subtle)] rounded-2xl">
          <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-card-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                  Verified Community Service Record & Audit
                </h3>
                <Badge variant="accent">Official Ledger</Badge>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Lifetime verified hours: <strong>112.0 hours</strong> • Signed by GreenEarth Action Coordinators
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClaimHoursModalOpen(true)}
                leftIcon={<PlusCircle className="w-3.5 h-3.5 text-emerald-500" />}
              >
                Claim Unlogged Hours
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownloadTimesheetCsv}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Export Timesheet (CSV)
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3.5 px-4">Event Initiative</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Check-In Method</th>
                  <th className="py-3.5 px-4">Hours Logged</th>
                  <th className="py-3.5 px-4">Audit Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-primary)]">
                {[
                  {
                    event: 'Senior Citizens Nutrition & Wellness Walk',
                    date: 'Sept 20, 2026',
                    method: 'QR Optical Scanner',
                    hours: '4.0 hrs',
                    auditor: 'Aiyan & Sofia Martinez',
                  },
                  {
                    event: 'Coastal Dune Restoration & Microplastics Harvest',
                    date: 'Sept 14, 2026',
                    method: 'Geo-Fenced Beacon',
                    hours: '4.5 hrs',
                    auditor: 'David Chen',
                  },
                  {
                    event: 'Bayview Family Pantry Food Sort',
                    date: 'Sept 07, 2026',
                    method: 'QR Optical Scanner',
                    hours: '3.5 hrs',
                    auditor: 'Aiyan',
                  },
                  {
                    event: 'Urban Forestry Sapling Planting & Mulch',
                    date: 'Aug 28, 2026',
                    method: 'Manual Audit',
                    hours: '5.0 hrs',
                    auditor: 'Amara Okafor',
                  },
                ].map((att, i) => (
                  <tr key={i} className="hover:bg-[var(--bg-secondary)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[var(--text-primary)]">{att.event}</td>
                    <td className="py-3.5 px-4 text-[var(--text-muted)]">{att.date}</td>
                    <td className="py-3.5 px-4 font-medium">{att.method}</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {att.hours}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-500/20">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Verified by {att.auditor}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* =====================================================
          TAB 4: MY LUXURY CERTIFICATES (Rich 24K Gold Interactive)
          ===================================================== */}
      {activeTab === 'certificates' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[var(--text-primary)]">
                  Cryptographic Certificate of Distinction
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Conferred for dedicating <strong>112.0 verified community service hours</strong>. Choose themes, preview live, and export high-res vector assets.
                </p>
              </div>
            </div>

            <Button
              variant="accent"
              size="sm"
              onClick={() => confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } })}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Celebrate Impact 🎉
            </Button>
          </div>

          {/* Luxury Certificate Component */}
          <LuxuryCertificate
            data={{
              volunteerName: `${user?.firstName || 'Elena'} ${user?.lastName || 'Rostova'}`,
              totalHours: 112.0,
              eventName: 'Coastal Dune Restoration & Community Aid',
              organizationName: 'GreenEarth Action Global',
              signatory1Name: 'Sofia Martinez',
              signatory1Title: 'Executive Director, GreenEarth',
              signatory2Name: 'Aiyan',
              signatory2Title: 'Lead Program Coordinator & Director',
            }}
          />
        </div>
      )}

      {/* =====================================================
          DIGITAL QR PASS & VOLUNTEER ID BADGE MODAL
          ===================================================== */}
      <Modal
        isOpen={qrPassModalOpen}
        onClose={() => setQrPassModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <span>Official Volunteer Entry Pass</span>
          </div>
        }
        description="Present this QR code on-site for instant touchless shift check-in."
        size="md"
      >
        <div className="space-y-4 text-xs">
          {/* Hologram Conference Badge Frame */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white shadow-2xl border-2 border-emerald-500/30 text-center space-y-4 relative overflow-hidden">
            {/* Holographic light sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/10 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                VolunEase Global ID Pass
              </span>
              <span className="text-[10px] font-mono text-slate-400">#VE-VOL-9482</span>
            </div>

            {/* Avatar & Name */}
            <div className="space-y-1">
              <Avatar
                name={`${user?.firstName} ${user?.lastName}`}
                src={user?.avatarUrl}
                size="lg"
                status="online"
                className="mx-auto border-2 border-emerald-400 shadow-md"
              />
              <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans']">
                {user?.firstName} {user?.lastName}
              </h3>
              <div className="text-[11px] text-emerald-400 font-semibold">
                Certified Level 4 Volunteer Changemaker
              </div>
            </div>

            {/* Big Scannable QR Code */}
            <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-inner border-4 border-slate-800">
              <div className="w-44 h-44 flex flex-col items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                  <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10z" />
                  <rect x="40" y="10" width="10" height="20" />
                  <rect x="10" y="40" width="20" height="10" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="70" y="40" width="10" height="30" />
                  <rect x="40" y="70" width="20" height="10" />
                  <rect x="70" y="80" width="20" height="10" />
                  <rect x="90" y="70" width="10" height="10" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    VE
                  </div>
                </div>
              </div>
            </div>

            {/* Event Context Info */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Assigned Shift Event
              </div>
              <div className="font-bold text-xs text-white truncate">
                {selectedPassEvent?.title || 'Coastal Dune Restoration & Beach Cleanup'}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{selectedPassEvent?.location || 'Ocean Beach Pier, SF'}</span>
              </div>
            </div>

            {/* Security clearance */}
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
              <span>Security Clearance: ACTIVE ✓</span>
              <span>Coordinator: Aiyan (8431980683)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                info('Saved to Device', 'Digital pass ready in offline browser cache.');
                setQrPassModalOpen(false);
              }}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Save Offline Pass
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Print Pass Badge
            </Button>
          </div>
        </div>
      </Modal>

      {/* =====================================================
          CLAIM UNLOGGED SERVICE HOURS MODAL
          ===================================================== */}
      <Modal
        isOpen={claimHoursModalOpen}
        onClose={() => setClaimHoursModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <span>Self-Report Volunteer Service Hours</span>
          </div>
        }
        description="Claim community service hours completed off-platform or for emergency assignments."
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setClaimHoursModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitHoursClaim}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Submit Claim for Audit
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmitHoursClaim} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">
              Service Activity / Project Title *
            </label>
            <Input
              value={claimForm.eventTitle}
              onChange={(e) => setClaimForm({ ...claimForm, eventTitle: e.target.value })}
              placeholder="e.g. Neighborhood Emergency Tree Debris Clearance"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">Service Date *</label>
              <Input
                type="date"
                value={claimForm.date}
                onChange={(e) => setClaimForm({ ...claimForm, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">Hours Worked *</label>
              <Input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={claimForm.hours}
                onChange={(e) => setClaimForm({ ...claimForm, hours: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">
              Supervising Lead Coordinator
            </label>
            <Input
              value={claimForm.supervisor}
              onChange={(e) => setClaimForm({ ...claimForm, supervisor: e.target.value })}
              placeholder="Aiyan (Lead Coordinator)"
            />
          </div>

          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">
              Description of Tasks Accomplished
            </label>
            <Textarea
              rows={3}
              value={claimForm.description}
              onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
              placeholder="Summarize activities performed, teammates present, and community outcomes..."
            />
          </div>

          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-900 dark:text-teal-200">
            <strong>Audit Note:</strong> Claims are evaluated and certified by Lead Coordinator <strong>Aiyan (+91 8431980683)</strong> within 24 hours and automatically credited to your official transcript.
          </div>
        </form>
      </Modal>
    </div>
  );
};
