import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, CheckCircle2, Award, User, LogOut, ArrowLeft, Shield } from 'lucide-react';
import { Logo } from '../brand/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import { HeaderCustomizerButton } from '../common/GlobalCustomizerTrigger';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { VolleyChatbot } from '../ai/VolleyChatbot';

export const VolunteerPortalLayout: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { info } = useToast();

  const navLinks = [
    { path: '/portal', label: 'Browse Events', icon: Calendar },
    { path: '/portal/registrations', label: 'My Registrations', icon: CheckCircle2 },
    { path: '/portal/hours', label: 'Attendance & Hours', icon: Sparkles },
    { path: '/portal/certificates', label: 'My Certificates', icon: Award },
    { path: '/portal/profile', label: 'Volunteer Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    info('Logged Out', 'You have been signed out.');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] font-['Inter'] transition-colors duration-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/portal" className="shrink-0">
              <Logo size="sm" variant="full" />
            </Link>

            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[var(--accent-primary-light)] text-[var(--accent-primary)] border border-[var(--accent-primary-glow)]">
              Volunteer Portal
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] shadow-xs'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2.5">
            {/* 100+ Colors & Languages Header Button */}
            <HeaderCustomizerButton type="both" />

            {/* Quick Switch to Staff Dashboard */}
            <button
              type="button"
              onClick={() => {
                switchRole('ORG_ADMIN');
                navigate('/dashboard');
                info('Switched View', 'Welcome to Coordinator Admin Dashboard');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent-primary-light)] border border-[var(--accent-primary-glow)] text-[var(--accent-primary)] text-xs font-semibold hover:opacity-80 transition-all cursor-pointer"
              title="Switch to Staff Coordinator View"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Coordinator Dashboard</span>
            </button>

            <ThemeToggle />

            {/* Volunteer User Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-subtle)]">
              <Avatar
                name={`${user?.firstName} ${user?.lastName}`}
                src={user?.avatarUrl}
                size="sm"
                status="online"
              />
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-600 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Scroller */}
        <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-[var(--border-subtle)] overflow-x-auto no-scrollbar">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
        <Outlet />
      </main>

      {/* AI Assistant Floating Chatbot: Volley */}
      <VolleyChatbot />
    </div>
  );
};
