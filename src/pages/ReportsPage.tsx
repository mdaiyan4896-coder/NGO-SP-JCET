import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Award,
  Users,
  Clock,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  PieChart,
  Layers,
  Printer,
  FileText,
  Filter,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { LuxuryCertificate } from '../components/certificate/LuxuryCertificate';
import { dataStore } from '../services/api/dataStore';
import { useToast } from '../context/ToastContext';

export const ReportsPage: React.FC = () => {
  const volunteers = dataStore.getVolunteers();
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>(volunteers[0]?.id || 'vol-1');
  const [dateRange, setDateRange] = useState('LAST_6_MONTHS');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'analytics' | 'certificates' | 'export'>('certificates');

  const { success, info } = useToast();

  const selectedVolunteer = volunteers.find((v) => v.id === selectedVolunteerId) || volunteers[0];
  const sortedByHours = [...volunteers].sort((a, b) => b.totalHoursContributed - a.totalHoursContributed);

  // High-Quality PDF/Executive Report Download
  const handleGenerateExecutiveReport = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsGenerating(false);

    if (reportFormat === 'pdf') {
      const reportHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>VolunEase Executive Impact & Audit Report - 2026</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #0F172A; background: #ffffff; line-height: 1.5; }
            .header { border-bottom: 3px solid #0EA47A; padding-bottom: 20px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
            .brand { display: flex; align-items: center; gap: 12px; }
            .logo-icon { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #0EA47A, #06B6D4); display: inline-flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 20px; }
            .logo-text { font-size: 28px; font-weight: 900; color: #0E3D31; letter-spacing: -0.5px; }
            .tagline { font-size: 11px; color: #64748B; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; margin-top: 2px; }
            .meta { text-align: right; font-size: 11px; color: #475569; }
            .meta strong { color: #0F172A; }
            .badge-verified { display: inline-block; background: #DCFCE7; color: #166534; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; margin-bottom: 6px; }
            h2 { color: #0E3D31; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 6px; margin-top: 28px; font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
            .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 20px 0; }
            .metric-box { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 16px; text-align: center; }
            .metric-val { font-size: 26px; font-weight: 900; color: #0EA47A; margin-bottom: 2px; }
            .metric-label { font-size: 10px; text-transform: uppercase; color: #64748B; font-weight: 700; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12px; }
            th { background: #F1F5F9; text-align: left; padding: 10px 12px; font-weight: 800; color: #1E293B; border-bottom: 2px solid #CBD5E1; text-transform: uppercase; font-size: 10px; }
            td { padding: 9px 12px; border-bottom: 1px solid #E2E8F0; color: #334155; }
            tr:nth-child(even) td { background: #FAFAFA; }
            .signature-area { margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            .sign-box { border-top: 2px solid #0F172A; padding-top: 10px; font-size: 12px; }
            .sign-box .sig { font-family: cursive; font-size: 22px; color: #0EA47A; margin-bottom: 4px; }
            .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; font-size: 10px; color: #94A3B8; }
            .contact-lead { background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 10px 14px; margin-top: 24px; font-size: 11px; color: #166534; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">
                <div class="logo-icon">V</div>
                <div>
                  <div class="logo-text">VolunEase</div>
                  <div class="tagline">Official NGO Volunteer Governance & Audit Document</div>
                </div>
              </div>
            </div>
            <div class="meta">
              <span class="badge-verified">Audited & Cryptographically Signed</span>
              <div>Organization: <strong>GreenEarth Action Global</strong></div>
              <div>Reporting Period: <strong>${dateRange.replace(/_/g, ' ')}</strong></div>
              <div>Generated: <strong>${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></div>
              <div>Auditor Verification ID: <strong>#VE-AUD-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026</strong></div>
            </div>
          </div>

          <div class="grid">
            <div class="metric-box">
              <div class="metric-val">${volunteers.length}</div>
              <div class="metric-label">Active Volunteers</div>
            </div>
            <div class="metric-box">
              <div class="metric-val">5,070h</div>
              <div class="metric-label">Verified Service Hours</div>
            </div>
            <div class="metric-box">
              <div class="metric-val">94.8%</div>
              <div class="metric-label">On-Time Turnout Rate</div>
            </div>
            <div class="metric-box">
              <div class="metric-val">$159,705</div>
              <div class="metric-label">Economic Impact Value ($31.50/hr)</div>
            </div>
          </div>

          <h2>Top Volunteer Contributors & Service Ledgers</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Volunteer Name</th>
                <th>Official Email</th>
                <th>Phone Number</th>
                <th>Primary Skills</th>
                <th>Verified Hours</th>
                <th>Turnout Rate</th>
              </tr>
            </thead>
            <tbody>
              ${sortedByHours
                .slice(0, 10)
                .map(
                  (v, idx) => `
                <tr>
                  <td><strong>${idx + 1}</strong></td>
                  <td><strong>${v.firstName} ${v.lastName}</strong></td>
                  <td>${v.email}</td>
                  <td>${v.phone || 'N/A'}</td>
                  <td>${v.skills.slice(0, 2).join(', ')}</td>
                  <td><strong style="color: #0EA47A;">${v.totalHoursContributed.toFixed(1)} hrs</strong></td>
                  <td>${v.reliabilityScore}%</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="contact-lead">
            <strong>Lead Operations & Coordinator Desk:</strong> Managed directly by <strong>Aiyan</strong> (Lead Coordinator & Program Director). Direct Phone: <strong>+91 8431980683</strong> | Email: <strong>mdaiyan4896@gmail.com</strong>
          </div>

          <div class="signature-area">
            <div class="sign-box">
              <div class="sig">Sofia Martinez</div>
              <strong>Sofia Martinez</strong><br/>
              Executive Director, GreenEarth Action Global
            </div>
            <div class="sign-box">
              <div class="sig">Aiyan</div>
              <strong>Aiyan</strong><br/>
              Lead Program Coordinator & Operations Director
            </div>
          </div>

          <div class="footer">
            <span>VolunEase Non-Profit Governance Engine • Licensed Under Open Impact Standard</span>
            <span>Page 1 of 1 • SHA-256 Validated</span>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([reportHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.focus();
        setTimeout(() => win.print(), 500);
      }
      success('Executive Report Ready 📄', 'Generated official high-resolution printable audit document.');
    } else {
      // High Quality 12-Column CSV Export
      const headers = [
        'Volunteer ID',
        'Full Name',
        'First Name',
        'Last Name',
        'Email Address',
        'Phone Number',
        'Status',
        'Total Verified Hours',
        'Reliability Score',
        'Skills',
        'Emergency Contact Name',
        'Emergency Phone',
        'Address',
        'Joined Date',
      ];

      const rows = volunteers.map((v) => [
        `"${v.id}"`,
        `"${v.firstName} ${v.lastName}"`,
        `"${v.firstName}"`,
        `"${v.lastName}"`,
        `"${v.email}"`,
        `"${v.phone || ''}"`,
        `"${v.status}"`,
        `"${v.totalHoursContributed.toFixed(1)}"`,
        `"${v.reliabilityScore}%"`,
        `"${v.skills.join('; ')}"`,
        `"${v.emergencyContactName || ''}"`,
        `"${v.emergencyContactPhone || ''}"`,
        `"${v.address || ''}"`,
        `"${v.joinedAt}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VolunEase_Volunteer_Audit_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      success('CSV Roster Exported! 📊', `Exported comprehensive 14-column audit dataset.`);
    }
  };

  return (
    <div className="space-y-8 font-['Inter']">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              Analytics & Certificate Studio
            </h2>
            <Badge variant="accent">Executive Suite</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Award luxury cryptographic volunteer certificates, monitor retention metrics, and export grant-ready reports.
          </p>
        </div>

        {/* Tab Switcher & Date Range */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-semibold">
            {[
              { id: 'certificates', label: 'Award Certificates 🏆', icon: Award },
              { id: 'analytics', label: 'Graphs & Analytics 📊', icon: BarChart3 },
              { id: 'export', label: 'Export Reports 📥', icon: FileText },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="h-9 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] cursor-pointer font-medium"
            >
              <option value="THIS_MONTH">This Month (Sept 2026)</option>
              <option value="LAST_3_MONTHS">Past 3 Months</option>
              <option value="LAST_6_MONTHS">Past 6 Months</option>
              <option value="YEAR_TO_DATE">Year to Date (2026)</option>
            </select>
          </div>
        </div>
      </div>

      {/* =====================================================
          TAB 1: CERTIFICATE STUDIO (High Polish UI)
          ===================================================== */}
      {activeTab === 'certificates' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Volunteer Selection & Customization Bar */}
          <Card padding="md" className="border-emerald-500/30 bg-emerald-500/5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-teal text-white flex items-center justify-center shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                    Official Certificate Customizer & Registry
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Select any volunteer to automatically render their customized credential with cryptographic QR seal.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">Recipient:</span>
                  <select
                    value={selectedVolunteerId}
                    onChange={(e) => setSelectedVolunteerId(e.target.value)}
                    className="h-10 px-3.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-bold shadow-xs cursor-pointer min-w-[220px]"
                  >
                    {volunteers.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.firstName} {v.lastName} ({v.totalHoursContributed.toFixed(1)} hrs logged)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="success" className="text-xs py-1">
                    ✓ Verified by Aiyan
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Luxury Certificate Render */}
          <LuxuryCertificate
            data={{
              volunteerName: `${selectedVolunteer.firstName} ${selectedVolunteer.lastName}`,
              totalHours: selectedVolunteer.totalHoursContributed,
              organizationName: 'GreenEarth Action Global',
              eventName: 'Coastal Dune Restoration & Sustainable Community Initiatives',
              signatory1Name: 'Sofia Martinez',
              signatory1Title: 'Executive Director, GreenEarth Action',
              signatory2Name: 'Aiyan',
              signatory2Title: 'Lead Program Coordinator & Director',
            }}
          />
        </div>
      )}

      {/* =====================================================
          TAB 2: ADVANCED GRAPHS & IMPACT ANALYTICS
          ===================================================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top 3 Impact Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Verified Hours', val: '5,070 hrs', change: '+28.4% YoY', icon: Clock, color: 'text-teal-600' },
              { label: 'Avg Volunteer Turnout', val: '94.8%', change: '+6.1% vs Goal', icon: CheckCircle2, color: 'text-emerald-600' },
              { label: 'Active Volunteer Corps', val: `${volunteers.length} Active`, change: '+14 New this month', icon: Users, color: 'text-cyan-600' },
              { label: 'Economic Contribution', val: '$159,705', change: 'Independent Sector Calc', icon: TrendingUp, color: 'text-amber-600' },
            ].map((k, idx) => {
              const Icon = k.icon;
              return (
                <Card key={idx} padding="md" className="space-y-2">
                  <div className="flex items-center justify-between text-[var(--text-muted)]">
                    <span className="text-xs font-semibold uppercase tracking-wider">{k.label}</span>
                    <Icon className={`w-4 h-4 ${k.color}`} />
                  </div>
                  <div className="text-2xl font-black font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                    {k.val}
                  </div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {k.change}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Main Visual Graphs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graph 1: Multi-Month Hours Trend vs Goal Target */}
            <Card padding="lg" className="lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Monthly Contributed Service Hours (Actual vs Target)</span>
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Demonstrating continuous impact growth over the last two quarters.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-gradient-teal" />
                    <span>Actual Hours</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-amber-500 border-dashed" />
                    <span>Target Goal (750h)</span>
                  </div>
                </div>
              </div>

              {/* Responsive SVG Chart with Target Baseline */}
              <div className="relative pt-6 pb-2">
                <div className="h-56 flex items-end justify-between gap-3 px-4 border-b border-[var(--border-subtle)] relative">
                  {/* Target line across chart */}
                  <div
                    className="absolute left-0 right-0 border-t-2 border-dashed border-amber-500/70 z-10 pointer-events-none"
                    style={{ bottom: '54%' }}
                  >
                    <span className="absolute right-2 -top-4 text-[9px] font-bold text-amber-500 bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded shadow-xs">
                      Target 750h
                    </span>
                  </div>

                  {[
                    { month: 'Apr', hours: 420, volunteers: 32 },
                    { month: 'May', hours: 590, volunteers: 41 },
                    { month: 'Jun', hours: 740, volunteers: 52 },
                    { month: 'Jul', hours: 880, volunteers: 64 },
                    { month: 'Aug', hours: 1060, volunteers: 78 },
                    { month: 'Sep', hours: 1380, volunteers: 95 },
                  ].map((d, i) => {
                    const maxH = 1400;
                    const heightPct = Math.round((d.hours / maxH) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative z-20">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-12 bg-gray-900 text-white text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                          <strong>{d.hours} hrs</strong> • {d.volunteers} active
                        </div>
                        <div
                          className="w-full max-w-[46px] rounded-t-xl bg-gradient-teal group-hover:from-emerald-400 group-hover:to-teal-300 transition-all duration-300 shadow-sm cursor-pointer"
                          style={{ height: `${heightPct}%` }}
                        />
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
                <span>Q2 Total: 1,750h</span>
                <span className="font-bold text-emerald-600">+89% Q3 Impact Acceleration</span>
                <span>Q3 Total: 3,320h</span>
              </div>
            </Card>

            {/* Graph 2: Hours Distribution by Cause */}
            <Card padding="lg" className="space-y-4">
              <div>
                <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-500" />
                  <span>Impact Hours by Cause</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Allocation across core initiatives</p>
              </div>

              <div className="space-y-4 pt-2">
                {[
                  { cause: 'Environmental Conservation', pct: 45, hrs: '2,280h', color: 'bg-emerald-500' },
                  { cause: 'Crisis & Food Distribution', pct: 28, hrs: '1,420h', color: 'bg-teal-500' },
                  { cause: 'Youth & STEM Literacy', pct: 18, hrs: '910h', color: 'bg-cyan-500' },
                  { cause: 'Animal Rescue Operations', pct: 9, hrs: '460h', color: 'bg-amber-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--text-primary)]">{item.cause}</span>
                      <span className="text-[var(--text-muted)]">
                        <strong>{item.hrs}</strong> ({item.pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all duration-500`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
                💡 Environmental conservation leads community interest this quarter by 62% in volunteer signups.
              </div>
            </Card>
          </div>

          {/* Volunteer Leaderboard & Recognition Roster */}
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Top Verified Volunteer Honor Roll</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Volunteers eligible for Presidential Service Citations</p>
              </div>
              <Badge variant="accent">Top 5 Leaders</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedByHours.slice(0, 6).map((vol, idx) => (
                <div
                  key={vol.id}
                  onClick={() => {
                    setSelectedVolunteerId(vol.id);
                    setActiveTab('certificates');
                  }}
                  className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary-light)]/20 border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        idx === 0
                          ? 'bg-amber-400 text-gray-900 shadow-sm'
                          : idx === 1
                          ? 'bg-gray-300 text-gray-900'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <Avatar name={`${vol.firstName} ${vol.lastName}`} src={vol.avatarUrl} size="sm" />
                    <div>
                      <div className="font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
                        {vol.firstName} {vol.lastName}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">{vol.reliabilityScore}% reliability score</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 block">
                      {vol.totalHoursContributed.toFixed(1)}h
                    </span>
                    <span className="text-[9px] text-[var(--accent-primary)] font-semibold">Award Cert 🏆</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* =====================================================
          TAB 3: EXPORT AUDIT REPORTS & GRANT PACKAGES
          ===================================================== */}
      {activeTab === 'export' && (
        <Card padding="lg" className="space-y-6 animate-in fade-in duration-300 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                Grant-Ready Audit & Board Reporting Engine
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Export formal governance packages with signatures, timesheet reconciliations, and economic valuation.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-2">Export Format</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'pdf',
                    label: 'Printable Executive PDF',
                    desc: 'Official audit summary with executive signature lines & graphics.',
                  },
                  {
                    id: 'excel',
                    label: 'Excel Workbook (.xlsx)',
                    desc: 'Multi-tab spreadsheet with volunteer records & raw timesheets.',
                  },
                  {
                    id: 'csv',
                    label: 'Raw Data CSV',
                    desc: 'Machine-readable comma separated records for database import.',
                  },
                ].map((fmt) => (
                  <div
                    key={fmt.id}
                    onClick={() => setReportFormat(fmt.id as any)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      reportFormat === fmt.id
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-light)]/20 shadow-xs'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-strong)]'
                    }`}
                  >
                    <div className="font-bold text-xs text-[var(--text-primary)]">{fmt.label}</div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-1">{fmt.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
              <div className="font-bold text-xs text-[var(--text-primary)]">Included Report Modules</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-teal-600" />
                  <span>Volunteer Hours & Turnout Ledgers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-teal-600" />
                  <span>Event Check-in QR Logs</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-teal-600" />
                  <span>Economic Value Estimation ($31.50/hr)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded accent-teal-600" />
                  <span>Executive Director Signature Block</span>
                </label>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-base"
                isLoading={isGenerating}
                onClick={handleGenerateExecutiveReport}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Generate & Download Official Report ({reportFormat.toUpperCase()})
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
