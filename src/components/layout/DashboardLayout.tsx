import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckCircle2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  User,
  Shield,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Building2,
  Sparkles,
  Phone,
  Mail,
  Edit3,
  Check,
  Trash2,
} from 'lucide-react';
import { Logo, LogoIcon } from '../brand/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { HeaderCustomizerButton } from '../common/GlobalCustomizerTrigger';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { VolleyChatbot } from '../ai/VolleyChatbot';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { dataStore, NotificationModel } from '../../services/api/dataStore';

export const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const [currentOrg, setCurrentOrg] = useState('GreenEarth Action (SF Main)');
  const [dutyStatus, setDutyStatus] = useState<'ON_DUTY' | 'BUSY' | 'AWAY'>('ON_DUTY');

  const { user, role, logout, switchRole, updateUser } = useAuth();
  const { info, success } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [notificationsList, setNotificationsList] = useState<NotificationModel[]>(() => dataStore.getNotifications());
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const unreadCount = notificationsList.filter((n) => !n.isRead).length;

  // Preset Avatars for easy coordinator identity customization
  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  // Profile Modal State
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || 'Sofia',
    lastName: user?.lastName || 'Martinez',
    phone: user?.phone || '+1 (415) 555-0101',
    email: user?.email || 'sofia.martinez@greenearth.org',
    bio: user?.bio || 'Executive Director with 12 years in environmental conservation and volunteer operations.',
    role: (user?.role || 'ORG_ADMIN') as UserRole,
    avatarUrl: user?.avatarUrl || AVATAR_PRESETS[0],
  });

  const handleMarkAllRead = () => {
    const updated = dataStore.markAllNotificationsAsRead();
    setNotificationsList(updated);
    info('All Caught Up', 'All notifications marked as read.');
  };

  const handleMarkRead = (id: string) => {
    const updated = dataStore.markNotificationAsRead(id);
    setNotificationsList(updated);
  };

  const handleClearAllNotifs = () => {
    const updated = dataStore.clearNotifications();
    setNotificationsList(updated);
    info('Tray Cleared', 'All notifications removed.');
  };

  const handleOpenProfileModal = () => {
    setProfileForm({
      firstName: user?.firstName || 'Sofia',
      lastName: user?.lastName || 'Martinez',
      phone: user?.phone || '+1 (415) 555-0101',
      email: user?.email || 'sofia.martinez@greenearth.org',
      bio: user?.bio || 'Executive Director with 12 years in environmental conservation.',
      role: (user?.role || 'ORG_ADMIN') as UserRole,
      avatarUrl: user?.avatarUrl || AVATAR_PRESETS[0],
    });
    setShowProfileMenu(false);
    setProfileModalOpen(true);
  };

  const handleSaveProfile = () => {
    updateUser({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      phone: profileForm.phone,
      email: profileForm.email,
      bio: profileForm.bio,
      role: profileForm.role,
      avatarUrl: profileForm.avatarUrl,
    });
    setProfileModalOpen(false);
    success('Profile Saved! ✨', 'Your coordinator identity, avatar, and credentials were fully updated.');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/volunteers', label: 'Volunteers', icon: Users },
    { path: '/dashboard/events', label: 'Events & Scheduling', icon: Calendar },
    { path: '/dashboard/attendance', label: 'Attendance (QR)', icon: CheckCircle2 },
    { path: '/dashboard/reports', label: 'Reports & Impact', icon: BarChart3 },
    { path: '/dashboard/settings', label: 'Settings & 2FA', icon: Settings },
  ];

  const orgBranches = [
    'GreenEarth Action (SF Main)',
    'GreenEarth Action (East Bay)',
    'GreenEarth Youth Chapter',
  ];

  const handleLogout = () => {
    logout();
    info('Logged Out', 'You have been safely signed out.');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] font-['Inter'] transition-colors duration-200">
      {/* =====================================================
          DESKTOP SIDEBAR
          ===================================================== */}
      <aside
        className={`hidden lg:flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-card)] transition-all duration-300 z-30 shrink-0 select-none ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Logo & Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[var(--border-subtle)]">
          <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
            {sidebarCollapsed ? (
              <LogoIcon size={36} />
            ) : (
              <Logo size="md" variant="full" />
            )}
          </Link>
        </div>

        {/* Organization Switcher Dropdown */}
        <div className="p-3 border-b border-[var(--border-subtle)] relative">
          <button
            type="button"
            onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
            className={`w-full flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] transition-all cursor-pointer ${
              sidebarCollapsed ? 'justify-center' : 'justify-between'
            }`}
            title={currentOrg}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Building2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-semibold truncate">{currentOrg}</span>
              )}
            </div>
            {!sidebarCollapsed && <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />}
          </button>

          {showOrgSwitcher && !sidebarCollapsed && (
            <div className="absolute top-14 left-3 right-3 rounded-xl glass-dropdown p-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95">
              <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 text-[var(--text-muted)]">
                Switch Organization
              </div>
              {orgBranches.map((branch) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => {
                    setCurrentOrg(branch);
                    setShowOrgSwitcher(false);
                    info('Switched Organization', `Active branch: ${branch}`);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    currentOrg === branch
                      ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] font-semibold'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/dashboard'
                ? location.pathname === '/dashboard'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] font-semibold shadow-xs'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[var(--accent-primary)]" />
                )}
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'
                  }`}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}

          {/* Quick link to Volunteer Portal */}
          <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
            <Link
              to="/portal"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/15 transition-all ${
                sidebarCollapsed ? 'justify-center px-0' : ''
              }`}
              title="Open Volunteer Portal"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Volunteer Portal View</span>}
            </Link>
          </div>
        </nav>

        {/* Collapse / Expand Toggle Button */}
        <div className="p-3 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN APP WRAPPER
          ===================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <header className="h-16 px-4 sm:px-6 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          {/* Mobile hamburger menu */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <LogoIcon size={30} />
          </div>

          {/* Page Title & Breadcrumb Indicator */}
          <div className="hidden sm:block">
            <div className="text-xs font-medium text-[var(--text-muted)] capitalize">
              VolunEase / {location.pathname.replace('/dashboard/', '').replace('/dashboard', 'Overview')}
            </div>
            <h1 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)] capitalize">
              {location.pathname === '/dashboard'
                ? 'Coordinator Overview'
                : location.pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search volunteers, events, shifts, tags..."
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:bg-[var(--bg-elevated)] transition-all"
              />
            </div>

            {showSearchDropdown && (
              <div className="absolute top-11 left-0 right-0 glass-dropdown p-2 rounded-xl shadow-xl z-50 animate-in fade-in">
                <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 text-[var(--text-muted)]">
                  Quick Results
                </div>
                <div
                  onMouseDown={() => navigate('/dashboard/events')}
                  className="px-2.5 py-1.5 rounded-lg text-xs hover:bg-[var(--bg-secondary)] cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium text-[var(--text-primary)]">Coastal Dune Restoration & Beach Cleanup</span>
                  <span className="text-[10px] text-teal-600 bg-teal-500/10 px-1.5 py-0.5 rounded">Event</span>
                </div>
                <div
                  onMouseDown={() => navigate('/dashboard/volunteers')}
                  className="px-2.5 py-1.5 rounded-lg text-xs hover:bg-[var(--bg-secondary)] cursor-pointer flex items-center justify-between"
                >
                  <span className="font-medium text-[var(--text-primary)]">Elena Rostova (112.0 hours)</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">Volunteer</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Pill */}
            <button
              type="button"
              onClick={() => {
                const nextRole = role === 'ORG_ADMIN' ? 'COORDINATOR' : 'ORG_ADMIN';
                switchRole(nextRole);
                info('Role Changed', `Switched view mode to ${nextRole}`);
              }}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
              title="Click to toggle between Admin and Coordinator roles"
            >
              <Shield className="w-3 h-3 text-[var(--accent-primary)]" />
              <span>{role}</span>
            </button>

            {/* Notification Bell */}
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-9 h-9 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-84 sm:w-96 rounded-2xl glass-dropdown p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 border border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-['Plus_Jakarta_Sans'] text-[var(--text-primary)]">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                      <button
                        type="button"
                        onClick={handleClearAllNotifs}
                        className="text-[11px] text-[var(--text-muted)] hover:text-rose-500 cursor-pointer p-0.5"
                        title="Clear all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex gap-1.5 pt-2 pb-1">
                    <button
                      type="button"
                      onClick={() => setNotifFilter('ALL')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                        notifFilter === 'ALL'
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      All ({notificationsList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifFilter('UNREAD')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                        notifFilter === 'UNREAD'
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                  </div>

                  <div className="space-y-1.5 mt-2 max-h-72 overflow-y-auto pr-1">
                    {notificationsList
                      .filter((n) => (notifFilter === 'UNREAD' ? !n.isRead : true))
                      .map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkRead(n.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            !n.isRead
                              ? 'bg-[var(--accent-primary-light)]/20 border-[var(--accent-primary)]/40 hover:bg-[var(--accent-primary-light)]/30'
                              : 'bg-[var(--bg-secondary)]/50 border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-xs text-[var(--text-primary)] leading-tight">
                              {n.title}
                            </span>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shrink-0 mt-1" />
                            )}
                          </div>
                          <div className="text-[11px] text-[var(--text-secondary)] mt-1 leading-snug">
                            {n.message}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] mt-1.5">
                            <span>{n.timestamp}</span>
                            <span className="text-[9px] uppercase tracking-wider font-semibold opacity-70">
                              {n.type}
                            </span>
                          </div>
                        </div>
                      ))}

                    {notificationsList.filter((n) => (notifFilter === 'UNREAD' ? !n.isRead : true)).length === 0 && (
                      <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                        No {notifFilter === 'UNREAD' ? 'unread' : ''} notifications right now.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 100+ Colors & Languages Quick Selector */}
            <HeaderCustomizerButton type="both" />

            {/* Theme Toggle Switcher */}
            <ThemeToggle />

            {/* User Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer border border-transparent hover:border-[var(--border-subtle)]"
              >
                <Avatar
                  name={`${user?.firstName} ${user?.lastName}`}
                  src={user?.avatarUrl}
                  size="sm"
                  status="online"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-medium leading-tight">
                    {user?.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl glass-dropdown p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 border border-[var(--border-subtle)]">
                  {/* Identity Header */}
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)]/70 border border-[var(--border-subtle)] mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={`${user?.firstName} ${user?.lastName}`}
                        src={user?.avatarUrl}
                        size="md"
                        status={dutyStatus === 'ON_DUTY' ? 'online' : dutyStatus === 'BUSY' ? 'busy' : 'offline'}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate">{user?.email}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--accent-primary-light)] text-[var(--accent-primary)]">
                            {user?.role}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)] truncate">SF Main</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Duty Status Selector */}
                    <div className="mt-2.5 pt-2 border-t border-[var(--border-subtle)]">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] mb-1.5">
                        Coordinator Availability
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDutyStatus('ON_DUTY');
                            info('Status Updated', 'You are marked On Duty for volunteer shifts.');
                          }}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            dutyStatus === 'ON_DUTY'
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                              : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>On Duty</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDutyStatus('BUSY');
                            info('Status Updated', 'You are marked Busy / In Field.');
                          }}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            dutyStatus === 'BUSY'
                              ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 shadow-2xs'
                              : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Busy</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDutyStatus('AWAY');
                            info('Status Updated', 'You are marked Away.');
                          }}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                            dutyStatus === 'AWAY'
                              ? 'bg-gray-500/20 border-gray-500 text-gray-700 dark:text-gray-300 shadow-2xs'
                              : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                          <span>Away</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions List */}
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={handleOpenProfileModal}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[var(--accent-primary)]" />
                      <span>Edit Full Profile</span>
                      <span className="ml-auto text-[10px] text-[var(--text-muted)] font-normal">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/dashboard/settings');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-[var(--text-muted)]" />
                      <span>Account Settings & 2FA</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/portal');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors font-bold cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Switch to Volunteer Portal</span>
                      <span className="ml-auto text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold">
                        Live
                      </span>
                    </button>
                  </div>

                  <div className="pt-1 mt-1 border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors font-semibold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out Securely</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN OUTLET CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>
      </div>

      {/* =====================================================
          MOBILE DRAWER SIDEBAR
          ===================================================== */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed top-0 bottom-0 left-0 w-72 bg-[var(--bg-card)] border-r border-[var(--border-subtle)] p-4 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <Logo size="md" variant="full" />
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-[var(--text-muted)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] font-semibold'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 p-2.5 rounded-xl text-sm text-red-600 hover:bg-red-500/10 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT PROFILE & IDENTITY MODAL
          ===================================================== */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--accent-primary-light)] text-[var(--accent-primary)] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span>Coordinator Profile & Credentials</span>
          </div>
        }
        description="Update your coordinator details, contact info, and permission tier."
        size="md"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setProfileModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Save Profile Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Profile Card Preview */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-3">
            <Avatar
              name={`${profileForm.firstName} ${profileForm.lastName}`}
              src={profileForm.avatarUrl}
              size="lg"
              status="online"
            />
            <div className="min-w-0">
              <div className="font-bold text-sm text-[var(--text-primary)]">
                {profileForm.firstName || 'Anonymous'} {profileForm.lastName}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] truncate">{profileForm.email}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--accent-primary-light)] text-[var(--accent-primary)] font-semibold text-[10px]">
                <Shield className="w-3 h-3" />
                <span>{profileForm.role}</span>
              </div>
            </div>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1.5">Select Profile Avatar</label>
            <div className="flex items-center gap-2">
              {AVATAR_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setProfileForm({ ...profileForm, avatarUrl: url })}
                  className={`relative rounded-xl p-0.5 border-2 transition-all cursor-pointer ${
                    profileForm.avatarUrl === url
                      ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)]/30 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-[var(--border-strong)]'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-10 h-10 rounded-lg object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">First Name *</label>
              <Input
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                placeholder="Sofia"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">Last Name *</label>
              <Input
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                placeholder="Martinez"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">Official Email *</label>
              <Input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="coordinator@greenearth.org"
              />
            </div>
            <div>
              <label className="font-bold text-[var(--text-primary)] block mb-1">Direct Phone</label>
              <Input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="+1 (555) 019-2834"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Assigned Operational Role</label>
            <select
              value={profileForm.role}
              onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value as UserRole })}
              className="w-full h-10 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer font-medium"
            >
              <option value="ORG_ADMIN">Organization Administrator (Full Access)</option>
              <option value="COORDINATOR">Event Coordinator (Shifts & Check-in)</option>
              <option value="SUPER_ADMIN">Super Administrator (System Wide)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-[var(--text-primary)] block mb-1">Bio & Experience</label>
            <Textarea
              rows={2}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="Tell volunteers about your background and role..."
            />
          </div>

          {/* Lead Coordinator Contact Box */}
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-900 dark:text-teal-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[11px]">
              <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Lead Coordinator Direct Line</span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              Contact <strong>Aiyan</strong> for escalation, emergency shifts, or key authority:
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-semibold text-[11px]">
              <a
                href="tel:8431980683"
                className="hover:underline text-teal-700 dark:text-teal-300 flex items-center gap-1"
              >
                📞 +91 8431980683
              </a>
              <span>•</span>
              <a
                href="mailto:mdaiyan4896@gmail.com"
                className="hover:underline text-teal-700 dark:text-teal-300 flex items-center gap-1"
              >
                ✉️ mdaiyan4896@gmail.com
              </a>
            </div>
          </div>
        </div>
      </Modal>

      {/* Floating AI Volunteer & Coordinator Assistant */}
      <VolleyChatbot />
    </div>
  );
};
