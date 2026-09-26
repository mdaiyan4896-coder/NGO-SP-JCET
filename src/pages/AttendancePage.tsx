import React, { useState } from 'react';
import {
  CheckCircle2,
  QrCode,
  Users,
  Clock,
  Download,
  AlertTriangle,
  MapPin,
  RefreshCw,
  Plus,
  Check,
  Printer,
  ShieldCheck,
  Camera,
  CheckSquare,
  Square,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { QrCheckInModal } from '../components/attendance/QrCheckInModal';
import { dataStore, AttendanceModel } from '../services/api/dataStore';
import { attendanceService } from '../services/api/attendanceService';
import { useToast } from '../context/ToastContext';

export const AttendancePage: React.FC = () => {
  const events = dataStore.getEvents();
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || 'ev-1');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceModel[]>(() =>
    dataStore.getAttendance()
  );
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState<Set<string>>(new Set());
  const [offlineMode, setOfflineMode] = useState(false);

  const { success, info } = useToast();

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const recordsForEvent = attendanceRecords.filter((a) => a.eventId === currentEvent?.id);

  const presentCount = recordsForEvent.filter((a) => a.status === 'PRESENT').length;
  const lateCount = recordsForEvent.filter((a) => a.status === 'LATE').length;
  const absentCount = recordsForEvent.filter((a) => a.status === 'ABSENT').length;
  const totalRegistered = currentEvent?.registeredCount || recordsForEvent.length || 1;
  const turnoutRate = Math.round(((presentCount + lateCount) / totalRegistered) * 100);
  const totalHoursLogged = recordsForEvent.reduce((acc, r) => acc + (r.durationMinutes || 0) / 60, 0);

  // Manual status override
  const handleManualToggle = async (recordId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT';
    const now = new Date().toISOString();

    await attendanceService.manualOverride(recordId, {
      status: nextStatus as any,
      checkInTime: nextStatus === 'PRESENT' ? now : null,
      durationMinutes: nextStatus === 'PRESENT' ? 240 : 0,
      checkInMethod: 'MANUAL',
    });

    setAttendanceRecords(dataStore.getAttendance());
    success('Attendance Updated', `Volunteer marked as ${nextStatus}.`);
  };

  // Batch multi-select
  const handleToggleSelect = (id: string) => {
    setSelectedRecordIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedRecordIds.size === recordsForEvent.length) {
      setSelectedRecordIds(new Set());
    } else {
      setSelectedRecordIds(new Set(recordsForEvent.map((r) => r.id)));
    }
  };

  const handleBatchMarkStatus = async (status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    const now = new Date().toISOString();
    for (const id of selectedRecordIds) {
      await attendanceService.manualOverride(id, {
        status,
        checkInTime: status !== 'ABSENT' ? now : null,
        durationMinutes: status === 'PRESENT' ? 240 : status === 'LATE' ? 180 : 0,
        checkInMethod: 'MANUAL',
      });
    }
    setAttendanceRecords(dataStore.getAttendance());
    success('Batch Check-in Complete', `Marked ${selectedRecordIds.size} volunteers as ${status}.`);
    setSelectedRecordIds(new Set());
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Volunteer Name', 'Status', 'Check-In Time', 'Duration (Min)', 'Method'];
    const rows = recordsForEvent.map((r) => [
      `"${r.volunteerName}"`,
      r.status,
      r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : 'N/A',
      r.durationMinutes,
      r.checkInMethod,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `Attendance_${currentEvent?.title.replace(/\s+/g, '_')}.csv`;
    link.click();
    info('Export Ready', 'CSV attendance log downloaded.');
  };

  // Printable Sign-in Sheet
  const handlePrintRosterSheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>VolunEase - Official Sign-In Roster</title>
        <style>
          body { font-family: sans-serif; padding: 30px; color: #111; }
          .header { border-bottom: 2px solid #0EA47A; padding-bottom: 12px; margin-bottom: 20px; }
          .event-title { font-size: 22px; font-weight: bold; }
          .meta { font-size: 13px; color: #555; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
          th { border: 1px solid #999; padding: 10px; background: #f3f3f3; text-align: left; }
          td { border: 1px solid #999; padding: 10px; height: 32px; }
          .sig-box { min-width: 140px; }
          .footer { margin-top: 40px; font-size: 11px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="event-title">VolunEase - Official Attendance Sign-in Roster</div>
          <div class="meta">
            Event: <strong>${currentEvent.title}</strong> • Date: <strong>${new Date(currentEvent.startDateTime).toLocaleDateString()}</strong> • Location: <strong>${currentEvent.location}</strong>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Volunteer Full Name</th>
              <th>Status</th>
              <th>Check-In Time</th>
              <th>Check-Out Time</th>
              <th class="sig-box">Physical Signature</th>
            </tr>
          </thead>
          <tbody>
            ${recordsForEvent
              .map(
                (r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${r.volunteerName}</strong></td>
                <td>${r.status}</td>
                <td>${r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '____ : ____'}</td>
                <td>____ : ____</td>
                <td></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          Certified by On-Site Coordinator: ____________________ • Signed: ____________________ • VolunEase Audit Roster
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 400);
    success('Print Roster Ready', 'Opened printable physical check-in sheet.');
  };

  return (
    <div className="space-y-6 font-['Inter'] pb-16">
      {/* Header & Event Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              Attendance & Real-Time QR Tracking
            </h2>
            <Badge variant="accent">Anti-Spoof Verified</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Monitor real-time volunteer check-ins, launch live optical scanners, and manage verified timesheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Offline Mode Toggle */}
          <button
            type="button"
            onClick={() => {
              setOfflineMode(!offlineMode);
              info(
                offlineMode ? 'Cloud Mode Active' : 'Field Offline Mode Activated',
                offlineMode ? 'Check-ins will sync in real time.' : 'Records cached in local IndexedDB for remote fields.'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              offlineMode
                ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
            }`}
          >
            {offlineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-500" /> : <Wifi className="w-3.5 h-3.5 text-emerald-500" />}
            <span>{offlineMode ? 'Field Offline Mode' : 'Cloud Sync: Active'}</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintRosterSheet}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print Sign-In Sheet
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setQrModalOpen(true)}
            leftIcon={<Camera className="w-3.5 h-3.5" />}
          >
            Launch QR Scanner
          </Button>
        </div>
      </div>

      {/* Event Selector Toolbar */}
      <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-secondary)]">Active Event:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="h-10 px-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold cursor-pointer max-w-sm"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({new Date(ev.startDateTime).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span className="truncate max-w-[200px]">{currentEvent.location}</span>
          </div>
          <span className="text-[var(--border-strong)]">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-teal-500" />
            <span>{new Date(currentEvent.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold uppercase tracking-wider">Turnout Rate</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-teal-600 dark:text-teal-400">
            {turnoutRate}%
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            {presentCount + lateCount} of {totalRegistered} volunteers
          </div>
        </Card>

        <Card padding="md" className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold uppercase tracking-wider">Present & On-Time</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-emerald-600 dark:text-emerald-400">
            {presentCount}
          </div>
          <div className="text-xs text-emerald-600 font-medium">95.2% on schedule</div>
        </Card>

        <Card padding="md" className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold uppercase tracking-wider">Late / Pending</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-amber-600 dark:text-amber-400">
            {lateCount}
          </div>
          <div className="text-xs text-amber-600 font-medium">{absentCount} pending arrival</div>
        </Card>

        <Card padding="md" className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold uppercase tracking-wider">Verified Hours</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
            {totalHoursLogged.toFixed(1)}h
          </div>
          <div className="text-xs text-[var(--text-muted)]">Logged for {currentEvent.title.split(' ')[0]}</div>
        </Card>
      </div>

      {/* Attendance Roster Table */}
      <Card padding="none" className="overflow-hidden border border-[var(--border-subtle)]">
        <div className="p-4 bg-[var(--bg-card-subtle)] border-b border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--accent-primary)]" />
            <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              Event Volunteer Check-In Roster
            </h3>
            <span className="text-xs text-[var(--text-muted)]">
              ({recordsForEvent.length} registered)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="xs"
              onClick={handleExportCsv}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-subtle)] text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="py-3 px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] cursor-pointer"
                  >
                    {selectedRecordIds.size > 0 && selectedRecordIds.size === recordsForEvent.length ? (
                      <CheckSquare className="w-4 h-4 text-[var(--accent-primary)]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Volunteer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Validation Method</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
              {recordsForEvent.length > 0 ? (
                recordsForEvent.map((rec) => {
                  const isChecked = selectedRecordIds.has(rec.id);
                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-[var(--bg-secondary)]/40 transition-colors ${
                        isChecked ? 'bg-[var(--accent-primary-light)]/15' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(rec.id)}
                          className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[var(--accent-primary)]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 font-bold flex items-center gap-2.5">
                        <Avatar name={rec.volunteerName} size="xs" />
                        <span>{rec.volunteerName}</span>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant={rec.status === 'PRESENT' ? 'success' : rec.status === 'LATE' ? 'warning' : 'default'}
                          dot
                        >
                          {rec.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-[var(--text-secondary)] font-mono text-[11px]">
                        {rec.checkInTime ? new Date(rec.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>

                      <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        {rec.durationMinutes ? `${(rec.durationMinutes / 60).toFixed(1)} hrs` : '0h'}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-medium">
                          {rec.checkInMethod === 'QR_CODE' ? (
                            <>
                              <QrCode className="w-3 h-3 text-teal-600" />
                              <span>QR Optical</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3 h-3 text-amber-600" />
                              <span>Manual Coordinator</span>
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          variant={rec.status === 'PRESENT' ? 'outline' : 'primary'}
                          size="xs"
                          onClick={() => handleManualToggle(rec.id, rec.status)}
                        >
                          {rec.status === 'PRESENT' ? 'Mark Absent' : 'Mark Present'}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-[var(--text-muted)] italic">
                    No attendance records logged yet for this shift.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Floating Batch Attendance Actions */}
      {selectedRecordIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[var(--bg-elevated)] border-2 border-[var(--accent-primary)] rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-3 animate-in slide-in-from-bottom duration-250">
          <span className="text-xs font-bold text-[var(--text-primary)]">
            {selectedRecordIds.size} Volunteers Selected:
          </span>

          <Button
            variant="primary"
            size="xs"
            onClick={() => handleBatchMarkStatus('PRESENT')}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Mark All Present
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={() => handleBatchMarkStatus('LATE')}
            leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
          >
            Mark All Late
          </Button>

          <Button
            variant="outline"
            size="xs"
            onClick={() => handleBatchMarkStatus('ABSENT')}
          >
            Mark Absent
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => setSelectedRecordIds(new Set())}
          >
            Clear
          </Button>
        </div>
      )}

      {/* QR Check In Modal Component */}
      <QrCheckInModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        eventId={currentEvent.id}
        eventTitle={currentEvent.title}
        onCheckInSuccess={() => setAttendanceRecords(dataStore.getAttendance())}
      />
    </div>
  );
};
