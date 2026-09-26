import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Send, CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface AttendanceForecastWidgetProps {
  eventId: string;
  totalRegistered: number;
}

export const AttendanceForecastWidget: React.FC<AttendanceForecastWidgetProps> = ({
  eventId,
  totalRegistered,
}) => {
  const [remindersSent, setRemindersSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { success } = useToast();

  const turnoutRate = 88;
  const expectedTurnout = Math.round((turnoutRate / 100) * (totalRegistered || 34));

  const atRiskList = [
    {
      id: 'vol-5',
      name: 'Jordan Taylor',
      reliability: 82,
      reason: 'First event RSVP; onboarding documentation incomplete',
    },
    {
      id: 'vol-18',
      name: 'Gabriel Silva',
      reliability: 78,
      reason: 'Past cancellation on same-day shifts; no-show history',
    },
  ];

  const handleSendReminders = async () => {
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSending(false);
    setRemindersSent(true);
    success('Reminders Dispatched', `Automated SMS & email reminders sent to ${atRiskList.length} flagged volunteers.`);
  };

  return (
    <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-4 font-['Inter']">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              AI Attendance Forecast
            </h4>
            <p className="text-[11px] text-[var(--text-muted)]">
              Turnout prediction modeled over volunteer historical reliability
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          Claude 3.5 Sonnet
        </span>
      </div>

      {/* Progress Gauge & Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[var(--border-strong)]"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray={`${turnoutRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-[var(--text-primary)]">{turnoutRate}%</span>
          </div>
          <div>
            <span className="text-[11px] text-[var(--text-muted)]">Predicted Turnout</span>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">High Confidence</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[var(--bg-secondary)] flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <Users className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Expected Attendees</span>
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)] mt-1">
            ~{expectedTurnout} <span className="text-xs font-normal text-[var(--text-muted)]">of {totalRegistered} registered</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[var(--bg-secondary)] flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            <span>Recommended Overbooking</span>
          </div>
          <div className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-1">
            +3 to 4 <span className="text-xs font-normal text-[var(--text-muted)]">waitlist seats</span>
          </div>
        </div>
      </div>

      {/* Flagged At-Risk Registrants */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--text-primary)]">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>At-Risk Registrants Flagged ({atRiskList.length})</span>
          </div>
          {remindersSent ? (
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Reminders Sent
            </span>
          ) : (
            <Button
              variant="outline"
              size="sm"
              isLoading={isSending}
              onClick={handleSendReminders}
              leftIcon={<Send className="w-3 h-3" />}
            >
              Nudge At-Risk Volunteers
            </Button>
          )}
        </div>

        <div className="space-y-1.5">
          {atRiskList.map((vol) => (
            <div
              key={vol.id}
              className="p-2.5 rounded-xl bg-[var(--bg-secondary)]/70 flex items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-semibold text-[var(--text-primary)]">{vol.name}</span>
                <span className="text-[11px] text-[var(--text-muted)] ml-2">• Reliability: {vol.reliability}%</span>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{vol.reason}</p>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                Action Required
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
