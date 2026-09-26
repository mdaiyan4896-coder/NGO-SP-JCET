import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { StaffSignupPage } from './pages/auth/StaffSignupPage';
import { VolunteerSignupPage } from './pages/auth/VolunteerSignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { VolunteerPortalLayout } from './components/layout/VolunteerPortalLayout';
import { Dashboard } from './pages/Dashboard';
import { VolunteersPage } from './pages/VolunteersPage';
import { EventsPage } from './pages/EventsPage';
import { AttendancePage } from './pages/AttendancePage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { VolunteerPortalPage } from './pages/VolunteerPortalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { GlobalCustomizerTrigger } from './components/common/GlobalCustomizerTrigger';
import { useAuth } from './context/AuthContext';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'VOLUNTEER') {
      return <Navigate to="/portal" replace />;
    }
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      {/* Subtle tactile grain overlay */}
      <div className="noise-overlay" />

      {/* Global 100+ Colors and 100+ Languages Quick Access Floating Trigger */}
      <GlobalCustomizerTrigger />

      <Routes>
        {/* Public Landing & Marketing */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<StaffSignupPage />} />
        <Route path="/signup/volunteer" element={<VolunteerSignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Authenticated Staff / Coordinator Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ORG_ADMIN', 'COORDINATOR', 'VIEWER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="volunteers" element={<VolunteersPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Authenticated Volunteer Portal */}
        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <VolunteerPortalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VolunteerPortalPage />} />
          <Route path="registrations" element={<VolunteerPortalPage />} />
          <Route path="hours" element={<VolunteerPortalPage />} />
          <Route path="certificates" element={<VolunteerPortalPage />} />
          <Route path="profile" element={<SettingsPage />} />
        </Route>

        {/* System Error & Access Fallbacks */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
};
