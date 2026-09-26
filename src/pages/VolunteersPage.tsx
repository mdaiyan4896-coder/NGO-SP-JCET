import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Clock,
  Award,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  X,
  Edit,
  Trash2,
  Download,
  Upload,
  MessageSquare,
  MessageCircle,
  Send,
  ShieldCheck,
  Tag,
  FileSpreadsheet,
  CheckSquare,
  Square,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { volunteerService } from '../services/api/volunteerService';
import { VolunteerModel, dataStore } from '../services/api/dataStore';
import { useToast } from '../context/ToastContext';

interface CoordinatorNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

export const VolunteersPage: React.FC = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState<VolunteerModel[]>(() => dataStore.getVolunteers());
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [hoursFilter, setHoursFilter] = useState('ALL');

  // Multi-select bulk state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerModel | null>(null);
  const [bulkEmailModalOpen, setBulkEmailModalOpen] = useState(false);
  const [bulkEmailSubject, setBulkEmailSubject] = useState('');
  const [bulkEmailBody, setBulkEmailBody] = useState('');
  const [isSendingBulk, setIsSendingBulk] = useState(false);

  // Coordinator notes per volunteer (in-memory demo state)
  const [coordinatorNotes, setCoordinatorNotes] = useState<Record<string, CoordinatorNote[]>>({
    'vol-1': [
      {
        id: 'n1',
        author: 'Aiyan (Lead Coordinator)',
        date: 'Sept 20, 2026',
        text: 'Outstanding leadership during the Coastal Dune cleanup. Supervised 12 first-time volunteers.',
      },
    ],
  });
  const [newNoteText, setNewNoteText] = useState('');

  // New volunteer form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    skills: '',
    bio: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    address: '',
  });

  const { success, info, error: toastError } = useToast();

  const handleSearch = (q: string) => {
    setSearch(q);
    filterList(q, statusFilter, skillFilter, hoursFilter);
  };

  const handleStatusFilter = (st: string) => {
    setStatusFilter(st);
    filterList(search, st, skillFilter, hoursFilter);
  };

  const handleSkillFilter = (sk: string) => {
    setSkillFilter(sk);
    filterList(search, statusFilter, sk, hoursFilter);
  };

  const handleHoursFilter = (hf: string) => {
    setHoursFilter(hf);
    filterList(search, statusFilter, skillFilter, hf);
  };

  const filterList = (q: string, st: string, sk: string, hf: string) => {
    let list = dataStore.getVolunteers();
    if (q) {
      const lower = q.toLowerCase();
      list = list.filter(
        (v) =>
          v.firstName.toLowerCase().includes(lower) ||
          v.lastName.toLowerCase().includes(lower) ||
          v.email.toLowerCase().includes(lower) ||
          (v.phone && v.phone.includes(q))
      );
    }
    if (st !== 'ALL') {
      list = list.filter((v) => v.status === st);
    }
    if (sk !== 'ALL') {
      list = list.filter((v) => v.skills.includes(sk));
    }
    if (hf === '100_PLUS') {
      list = list.filter((v) => v.totalHoursContributed >= 100);
    } else if (hf === '50_PLUS') {
      list = list.filter((v) => v.totalHoursContributed >= 50);
    } else if (hf === '10_PLUS') {
      list = list.filter((v) => v.totalHoursContributed >= 10);
    }
    setVolunteers(list);
  };

  // Multi-select handlers
  const handleToggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === volunteers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(volunteers.map((v) => v.id)));
    }
  };

  // Bulk actions
  const handleBulkStatusChange = async (newStatus: 'ACTIVE' | 'PENDING' | 'INACTIVE') => {
    for (const id of selectedIds) {
      await volunteerService.updateVolunteer(id, { status: newStatus as any });
    }
    setVolunteers(dataStore.getVolunteers());
    success('Bulk Status Updated', `Updated ${selectedIds.size} volunteers to ${newStatus}.`);
    setSelectedIds(new Set());
  };

  const handleBulkExportCsv = () => {
    const selectedVols = volunteers.filter((v) => selectedIds.has(v.id));
    const target = selectedVols.length > 0 ? selectedVols : volunteers;

    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Total Hours', 'Reliability', 'Status', 'Skills'];
    const rows = target.map((v) => [
      v.firstName,
      v.lastName,
      v.email,
      v.phone || '',
      v.totalHoursContributed,
      `${v.reliabilityScore}%`,
      v.status,
      `"${v.skills.join('; ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `VolunEase_Roster_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    success('Roster Exported', `Downloaded spreadsheet with ${target.length} volunteer records.`);
  };

  const handleSendBulkEmail = async () => {
    if (!bulkEmailSubject || !bulkEmailBody) {
      toastError('Missing Fields', 'Please enter a subject and message body.');
      return;
    }
    setIsSendingBulk(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSendingBulk(false);
    setBulkEmailModalOpen(false);
    success(
      'Bulk Dispatch Sent! ✉️',
      `Delivered email announcement to ${selectedIds.size} selected volunteers.`
    );
    setSelectedIds(new Set());
    setBulkEmailSubject('');
    setBulkEmailBody('');
  };

  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      toastError('Validation Error', 'First name and email are required');
      return;
    }

    try {
      const skillsArray = formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const created = await volunteerService.createVolunteer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio || 'Passionate volunteer dedicated to community aid.',
        skills: skillsArray.length > 0 ? skillsArray : ['Community Aid'],
        status: 'ACTIVE',
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        address: formData.address || 'San Francisco, CA',
        avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 90000)}?w=150&auto=format&fit=crop&q=80`,
      });

      setVolunteers(dataStore.getVolunteers());
      setAddModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        skills: '',
        bio: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        address: '',
      });
      success('Volunteer Added!', `${created.firstName} ${created.lastName} added to active roster.`);
    } catch (err: any) {
      toastError('Failed to add volunteer', err.message);
    }
  };

  const handleAddCoordinatorNote = () => {
    if (!selectedVolunteer || !newNoteText.trim()) return;
    const newNote: CoordinatorNote = {
      id: `note-${Date.now()}`,
      author: 'Aiyan (Lead Coordinator)',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      text: newNoteText.trim(),
    };

    setCoordinatorNotes((prev) => ({
      ...prev,
      [selectedVolunteer.id]: [newNote, ...(prev[selectedVolunteer.id] || [])],
    }));
    setNewNoteText('');
    success('Note Saved', 'Coordinator log updated.');
  };

  const handleEndorseSkill = (skill: string) => {
    if (!selectedVolunteer) return;
    if (selectedVolunteer.skills.includes(skill)) {
      info('Skill Already Present', `${selectedVolunteer.firstName} already has ${skill}.`);
      return;
    }
    const updatedSkills = [...selectedVolunteer.skills, skill];
    volunteerService.updateVolunteer(selectedVolunteer.id, { skills: updatedSkills });
    setSelectedVolunteer({ ...selectedVolunteer, skills: updatedSkills });
    setVolunteers(dataStore.getVolunteers());
    success('Skill Endorsed! 🏆', `Added "${skill}" badge to ${selectedVolunteer.firstName}'s profile.`);
  };

  const allSkills = Array.from(new Set(dataStore.getVolunteers().flatMap((v) => v.skills)));

  return (
    <div className="space-y-6 font-['Inter'] pb-16">
      {/* Header with Title and Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
              Volunteer Directory & Talent Management
            </h2>
            <Badge variant="accent">{volunteers.length} Total</Badge>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Manage your registered volunteer pool, endorse skills, track impact hours, and dispatch bulk alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkExportCsv}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Roster (CSV)
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
        {/* Search */}
        <div className="w-full lg:w-72 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
          />
        </div>

        {/* Dropdown Filters & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end text-xs">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Only</option>
            <option value="PENDING">Pending Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          <select
            value={skillFilter}
            onChange={(e) => handleSkillFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer max-w-[150px] truncate"
          >
            <option value="ALL">All Skills</option>
            {allSkills.map((sk) => (
              <option key={sk} value={sk}>
                {sk}
              </option>
            ))}
          </select>

          <select
            value={hoursFilter}
            onChange={(e) => handleHoursFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
          >
            <option value="ALL">All Hours</option>
            <option value="10_PLUS">10+ Hours Logged</option>
            <option value="50_PLUS">50+ Hours Logged</option>
            <option value="100_PLUS">100+ Hours (Centurion)</option>
          </select>

          {/* Table / Grid Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-[var(--bg-elevated)] text-[var(--accent-primary)] shadow-xs' : 'text-[var(--text-muted)]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[var(--bg-elevated)] text-[var(--accent-primary)] shadow-xs' : 'text-[var(--text-muted)]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Roster View */}
      {viewMode === 'table' ? (
        <Card padding="none" className="overflow-hidden border border-[var(--border-subtle)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-card-subtle)] border-b border-[var(--border-subtle)] text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="py-3 px-4 w-10 text-center">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] cursor-pointer"
                    >
                      {selectedIds.size > 0 && selectedIds.size === volunteers.length ? (
                        <CheckSquare className="w-4 h-4 text-[var(--accent-primary)]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Volunteer</th>
                  <th className="py-3 px-4">Direct Contact</th>
                  <th className="py-3 px-4">Skills & Endorsements</th>
                  <th className="py-3 px-4">Total Hours</th>
                  <th className="py-3 px-4">Reliability</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-primary)]">
                {volunteers.map((vol) => {
                  const isChecked = selectedIds.has(vol.id);
                  return (
                    <tr
                      key={vol.id}
                      onClick={() => setSelectedVolunteer(vol)}
                      className={`hover:bg-[var(--bg-secondary)]/50 transition-colors cursor-pointer ${
                        isChecked ? 'bg-[var(--accent-primary-light)]/15' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center" onClick={(e) => handleToggleSelect(vol.id, e)}>
                        <button type="button" className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[var(--accent-primary)]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={`${vol.firstName} ${vol.lastName}`} src={vol.avatarUrl} size="sm" />
                          <div>
                            <div className="font-bold text-[var(--text-primary)] hover:text-[var(--accent-primary)]">
                              {vol.firstName} {vol.lastName}
                            </div>
                            <div className="text-[11px] text-[var(--text-muted)]">{vol.address}</div>
                          </div>
                        </div>
                      </td>

                      {/* Direct Clickable Contact Buttons */}
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${vol.email}`}
                            title={`Email ${vol.email}`}
                            className="p-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary-light)] transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          {vol.phone && (
                            <>
                              <a
                                href={`tel:${vol.phone.replace(/[^0-9+]/g, '')}`}
                                title={`Call ${vol.phone}`}
                                className="p-1.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary-light)] transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`https://wa.me/${vol.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp Chat"
                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </>
                          )}
                          <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[110px]">
                            {vol.email}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {vol.skills.slice(0, 3).map((sk, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                            >
                              {sk}
                            </span>
                          ))}
                          {vol.skills.length > 3 && (
                            <span className="text-[10px] text-[var(--text-muted)] self-center font-bold">
                              +{vol.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {vol.totalHoursContributed.toFixed(1)} hrs
                      </td>

                      <td className="py-3 px-4 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              vol.reliabilityScore >= 95 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          <span>{vol.reliabilityScore}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant={vol.status === 'ACTIVE' ? 'success' : vol.status === 'PENDING' ? 'warning' : 'default'}
                          dot
                        >
                          {vol.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVolunteer(vol);
                              navigate('/dashboard/reports');
                            }}
                            title="Award Service Certificate"
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                          >
                            <Award className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedVolunteer(vol)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.map((vol) => {
            const isChecked = selectedIds.has(vol.id);
            return (
              <Card
                key={vol.id}
                padding="md"
                className={`space-y-4 hover:border-[var(--accent-primary)] transition-all cursor-pointer relative ${
                  isChecked ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-light)]/10 shadow-md' : ''
                }`}
                onClick={() => setSelectedVolunteer(vol)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => handleToggleSelect(vol.id, e)}
                      className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] mr-1"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[var(--accent-primary)]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <Avatar name={`${vol.firstName} ${vol.lastName}`} src={vol.avatarUrl} size="md" />
                    <div>
                      <h4 className="font-bold text-sm text-[var(--text-primary)]">
                        {vol.firstName} {vol.lastName}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)]">{vol.email}</p>
                    </div>
                  </div>
                  <Badge variant={vol.status === 'ACTIVE' ? 'success' : 'warning'} dot>
                    {vol.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Contributed</span>
                    <span className="font-bold text-emerald-600">{vol.totalHoursContributed.toFixed(1)} hrs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Reliability</span>
                    <span className="font-bold text-[var(--text-primary)]">{vol.reliabilityScore}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {vol.skills.slice(0, 3).map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--accent-primary-light)] text-[var(--accent-primary)]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <a href={`mailto:${vol.email}`} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                    {vol.phone && (
                      <a href={`tel:${vol.phone}`} className="text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <span className="text-[10px] text-[var(--accent-primary)] font-bold">View Profile →</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* =====================================================
          FLOATING BULK ACTIONS TOOLBAR
          ===================================================== */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[var(--bg-elevated)] border-2 border-[var(--accent-primary)] rounded-2xl shadow-2xl px-5 py-3 flex flex-wrap items-center gap-4 animate-in slide-in-from-bottom duration-250">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[var(--accent-primary)] text-white font-bold text-xs flex items-center justify-center">
              {selectedIds.size}
            </span>
            <span className="text-xs font-bold text-[var(--text-primary)]">Volunteers Selected</span>
          </div>

          <div className="h-4 w-[1px] bg-[var(--border-subtle)] hidden sm:block" />

          <div className="flex items-center gap-2 text-xs">
            <Button
              variant="primary"
              size="xs"
              onClick={() => setBulkEmailModalOpen(true)}
              leftIcon={<Mail className="w-3.5 h-3.5" />}
            >
              Bulk Email Blast
            </Button>

            <Button
              variant="outline"
              size="xs"
              onClick={() => handleBulkStatusChange('ACTIVE')}
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            >
              Mark Active
            </Button>

            <Button
              variant="outline"
              size="xs"
              onClick={handleBulkExportCsv}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export CSV
            </Button>

            <Button
              variant="ghost"
              size="xs"
              onClick={() => setSelectedIds(new Set())}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Email Modal */}
      <Modal
        isOpen={bulkEmailModalOpen}
        onClose={() => setBulkEmailModalOpen(false)}
        title={`Broadcast Email to ${selectedIds.size} Volunteers`}
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setBulkEmailModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={isSendingBulk}
              onClick={handleSendBulkEmail}
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Dispatch Email Blast
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Email Subject *</label>
            <Input
              value={bulkEmailSubject}
              onChange={(e) => setBulkEmailSubject(e.target.value)}
              placeholder="e.g. Important Update: Saturday Beach Cleanup Shift Times"
            />
          </div>
          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Message Content *</label>
            <Textarea
              rows={4}
              value={bulkEmailBody}
              onChange={(e) => setBulkEmailBody(e.target.value)}
              placeholder="Dear Volunteers, thank you for your ongoing commitment to GreenEarth..."
            />
          </div>
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)]">
            ✉️ Dispatched via VolunEase High-Deliverability Relays. Includes coordinator signature block.
          </div>
        </div>
      </Modal>

      {/* Add Volunteer Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Volunteer to Roster"
        description="Register a volunteer manually or record an on-site registration."
        size="md"
      >
        <form onSubmit={handleAddVolunteer} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="e.g. Marcus"
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="e.g. Vance"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address *"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="marcus@example.com"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 234-0021"
            />
          </div>

          <Input
            label="Skills & Certifications (Comma-separated)"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="First Aid, Beach Cleanup, Event Coordination"
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Volunteer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Volunteer Detail Modal with Coordinator Notes & Skill Endorsements */}
      {selectedVolunteer && (
        <Modal
          isOpen={!!selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
          title="Volunteer Talent Dossier"
          size="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigate('/dashboard/reports');
                }}
                leftIcon={<Award className="w-3.5 h-3.5 text-amber-500" />}
              >
                Award Impact Certificate
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSelectedVolunteer(null)}>
                Close Dossier
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            {/* Top Header Card */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              <Avatar
                name={`${selectedVolunteer.firstName} ${selectedVolunteer.lastName}`}
                src={selectedVolunteer.avatarUrl}
                size="xl"
                status="online"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                      {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                    </h3>
                    <Badge variant={selectedVolunteer.status === 'ACTIVE' ? 'success' : 'warning'} dot>
                      {selectedVolunteer.status}
                    </Badge>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${selectedVolunteer.phone}`}
                      className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] text-xs font-semibold flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call</span>
                    </a>
                    <a
                      href={`mailto:${selectedVolunteer.email}`}
                      className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:text-[var(--accent-primary)] text-xs font-semibold flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>

                <p className="text-xs text-[var(--text-muted)] mt-0.5">{selectedVolunteer.email} • {selectedVolunteer.phone}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">{selectedVolunteer.bio}</p>
              </div>
            </div>

            {/* Impact Metric Row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <span className="text-[11px] text-[var(--text-muted)] block">Total Logged</span>
                <span className="text-lg font-bold text-emerald-600">{selectedVolunteer.totalHoursContributed} hrs</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <span className="text-[11px] text-[var(--text-muted)] block">Attendance Score</span>
                <span className="text-lg font-bold text-[var(--text-primary)]">{selectedVolunteer.reliabilityScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <span className="text-[11px] text-[var(--text-muted)] block">Service Level</span>
                <span className="text-lg font-bold text-amber-600">Gold Tier</span>
              </div>
            </div>

            {/* Skills & Endorsements Tool */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Skills & Endorsements
                </h4>
                <span className="text-[11px] text-[var(--accent-primary)] font-medium">Click to endorse new badge:</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {selectedVolunteer.skills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--accent-primary-light)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>

              {/* Endorse Pills */}
              <div className="flex flex-wrap gap-1 pt-1">
                {['First Aid & CPR', 'Crisis Leadership', 'Vehicle Operator', 'Logistics Lead', 'Public Speaker'].map(
                  (sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleEndorseSkill(sk)}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[var(--bg-secondary)] hover:bg-emerald-500/15 text-[var(--text-muted)] hover:text-emerald-600 border border-[var(--border-subtle)] transition-colors cursor-pointer"
                    >
                      + Endorse {sk}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Internal Coordinator Notes Ledger */}
            <div className="space-y-3 pt-3 border-t border-[var(--border-subtle)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Internal Coordinator Notes (Private)</span>
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add private note (e.g. Excellent teamwork at beach cleanup...)"
                  className="flex-1 h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                />
                <Button size="sm" variant="primary" onClick={handleAddCoordinatorNote}>
                  Add Note
                </Button>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {(coordinatorNotes[selectedVolunteer.id] || []).length > 0 ? (
                  (coordinatorNotes[selectedVolunteer.id] || []).map((note) => (
                    <div
                      key={note.id}
                      className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                        <span className="font-bold text-[var(--text-primary)]">{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p className="text-[var(--text-secondary)]">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic">No coordinator notes added yet.</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
