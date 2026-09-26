import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  MapPin,
  Users,
  QrCode,
  Sparkles,
  TrendingUp,
  Clock,
  List,
  LayoutGrid,
  CheckCircle2,
  ExternalLink,
  Send,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select } from '../components/ui/Input';
import { QrCheckInModal } from '../components/attendance/QrCheckInModal';
import { AttendanceForecastWidget } from '../components/ai/AttendanceForecastWidget';
import { AiContentGeneratorModal } from '../components/ai/AiContentGeneratorModal';
import { eventService } from '../services/api/eventService';
import { aiService, AiMatchResult } from '../services/api/aiService';
import { EventModel, dataStore } from '../services/api/dataStore';
import { useToast } from '../context/ToastContext';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventModel[]>(() => dataStore.getEvents());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
  const [detailTab, setDetailTab] = useState<'details' | 'forecast' | 'matching'>('details');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [aiGenOpen, setAiGenOpen] = useState(false);
  const [activeQrEvent, setActiveQrEvent] = useState<EventModel | null>(null);

  // Suggested Volunteers state
  const [suggestedVolunteers, setSuggestedVolunteers] = useState<AiMatchResult[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Create form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Environmental' as EventModel['category'],
    location: '',
    startDateTime: '2026-10-15T09:00',
    endDateTime: '2026-10-15T13:00',
    capacity: 30,
    requiredSkills: 'First Aid & CPR, Logistics',
    coordinatorName: 'Sofia Martinez',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
  });

  const { success, error: toastError, info } = useToast();

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.location) {
      toastError('Validation Error', 'Title and location are required');
      return;
    }

    try {
      const skillsArr = form.requiredSkills.split(',').map((s) => s.trim());
      const created = await eventService.createEvent({
        ...form,
        latitude: 37.7749,
        longitude: -122.4194,
        status: 'UPCOMING',
        requiredSkills: skillsArr,
      });

      setEvents(dataStore.getEvents());
      setCreateModalOpen(false);
      success('Event Published!', `"${created.title}" is now open for volunteer registration.`);
    } catch (err: any) {
      toastError('Failed to create event', err.message);
    }
  };

  const handleOpenDetails = async (ev: EventModel) => {
    setSelectedEvent(ev);
    setDetailTab('details');
    loadAiSuggestions(ev.id);
  };

  const loadAiSuggestions = async (eventId: string) => {
    setLoadingSuggestions(true);
    try {
      const results = await aiService.getSuggestedVolunteers(eventId);
      setSuggestedVolunteers(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleInviteVolunteer = (name: string) => {
    success('Invitation Dispatched ✉️', `Automated invitation sent to ${name}.`);
  };

  return (
    <div className="space-y-6 font-['Inter']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
            Events & Shift Scheduling
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Coordinate upcoming volunteer operations, inspect live RSVP progress, and generate check-in passes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            onClick={() => setCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Event
          </Button>
        </div>
      </div>

      {/* View Switcher & List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => {
          const fillPct = Math.round((ev.registeredCount / ev.capacity) * 100);
          return (
            <Card
              key={ev.id}
              spotlight
              padding="none"
              className="overflow-hidden flex flex-col justify-between group hover:border-[var(--accent-primary)] transition-all"
            >
              {/* Event Image Banner */}
              <div className="relative h-44 w-full bg-[var(--bg-secondary)] overflow-hidden">
                <img
                  src={ev.imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80'}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="teal">{ev.category}</Badge>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-black/60 backdrop-blur-xs text-white">
                    {ev.status}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--accent-primary)] font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(ev.startDateTime).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        weekday: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenDetails(ev)}
                    className="text-base font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors mt-1 cursor-pointer line-clamp-1"
                  >
                    {ev.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </p>
                </div>

                {/* RSVP Progress */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-[var(--text-secondary)]">RSVP Capacity</span>
                    <span className="text-emerald-600 font-bold">{ev.registeredCount} / {ev.capacity} ({fillPct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-teal"
                      style={{ width: `${Math.min(fillPct, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveQrEvent(ev);
                      setQrModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>QR Pass</span>
                  </button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDetails(ev)}
                    rightIcon={<Sparkles className="w-3.5 h-3.5 text-purple-500" />}
                  >
                    Manage & AI Insights
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New NGO Event & Shift"
        description="Publish a volunteer initiative with shift slots and required qualifications."
        size="lg"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Coastal Dune Restoration & Beach Cleanup"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Cause / Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              options={[
                { value: 'Environmental', label: 'Environmental Conservation' },
                { value: 'Community Aid', label: 'Community Aid & Food Security' },
                { value: 'Education', label: 'Youth Education & STEM' },
                { value: 'Caregiving', label: 'Senior Care & Wellness' },
                { value: 'Disaster Relief', label: 'Emergency Disaster Relief' },
              ]}
            />
            <Input
              label="Volunteer Capacity"
              type="number"
              min={1}
              required
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value, 10) })}
            />
          </div>

          <Input
            label="Location Address"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Ocean Beach Pier, San Francisco, CA"
            leftIcon={<MapPin className="w-4 h-4 text-[var(--text-muted)]" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date & Time"
              type="datetime-local"
              required
              value={form.startDateTime}
              onChange={(e) => setForm({ ...form, startDateTime: e.target.value })}
            />
            <Input
              label="End Date & Time"
              type="datetime-local"
              required
              value={form.endDateTime}
              onChange={(e) => setForm({ ...form, endDateTime: e.target.value })}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Event Description
              </label>
              <button
                type="button"
                onClick={() => setAiGenOpen(true)}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate with AI</span>
              </button>
            </div>
            <Textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detail volunteer responsibilities, what to wear, on-site parking instructions..."
            />
          </div>

          <Input
            label="Required Skills (Comma-separated)"
            value={form.requiredSkills}
            onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
            placeholder="First Aid & CPR, Logistics, Heavy Lifting"
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* Event Detail & AI Insights Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={selectedEvent.title}
          description={`Coordinated by ${selectedEvent.coordinatorName} • ${selectedEvent.location}`}
          size="xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveQrEvent(selectedEvent);
                  setQrModalOpen(true);
                }}
                leftIcon={<QrCode className="w-3.5 h-3.5 text-[var(--accent-primary)]" />}
              >
                View QR Check-In Pass
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Tabs Header */}
            <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2">
              {[
                { id: 'details', label: 'Event Details', icon: CalendarIcon },
                { id: 'forecast', label: 'AI Attendance Forecast', icon: TrendingUp },
                { id: 'matching', label: 'Suggested Volunteers', icon: Sparkles },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = detailTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setDetailTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] shadow-xs'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: DETAILS */}
            {detailTab === 'details' && (
              <div className="space-y-4 text-xs">
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                  {selectedEvent.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[11px]">Registered</span>
                    <span className="text-base font-bold text-emerald-600">
                      {selectedEvent.registeredCount} / {selectedEvent.capacity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[11px]">Category</span>
                    <span className="text-base font-bold text-[var(--text-primary)]">{selectedEvent.category}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[11px]">Status</span>
                    <span className="text-base font-bold text-teal-600">{selectedEvent.status}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[11px]">Time</span>
                    <span className="text-base font-bold text-[var(--text-primary)]">
                      {new Date(selectedEvent.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="font-bold text-[var(--text-primary)]">Required Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.requiredSkills.map((sk, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-[var(--accent-primary-light)] text-[var(--accent-primary)] font-semibold"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI FORECAST */}
            {detailTab === 'forecast' && (
              <AttendanceForecastWidget
                eventId={selectedEvent.id}
                totalRegistered={selectedEvent.registeredCount}
              />
            )}

            {/* TAB 3: SMART MATCHING */}
            {detailTab === 'matching' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                      AI Suggested Volunteers for this Event
                    </h4>
                    <p className="text-xs text-[var(--text-muted)]">
                      Ranked by skill match, reliability score, and past shift participation.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-600 border border-purple-500/20">
                    Claude AI Engine
                  </span>
                </div>

                <div className="space-y-2.5">
                  {suggestedVolunteers.map((m) => (
                    <div
                      key={m.volunteerId}
                      className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[var(--text-primary)]">{m.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600">
                            {m.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">{m.rationale}</p>
                        <div className="flex gap-1 pt-1">
                          {m.skillsMatched.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleInviteVolunteer(m.name)}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Invite
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Standalone QR Code Check-In Pass Modal */}
      {activeQrEvent && (
        <QrCheckInModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          eventId={activeQrEvent.id}
          eventTitle={activeQrEvent.title}
          onCheckInSuccess={() => setEvents(dataStore.getEvents())}
        />
      )}

      {/* AI Content Generator Modal for Event Description */}
      <AiContentGeneratorModal
        isOpen={aiGenOpen}
        onClose={() => setAiGenOpen(false)}
        type="EVENT_DESCRIPTION"
        initialTitle={form.title}
        initialCategory={form.category}
        onApply={(text) => setForm({ ...form, description: text })}
      />
    </div>
  );
};
