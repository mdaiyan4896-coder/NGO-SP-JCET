import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'COORDINATOR' | 'VIEWER' | 'VOLUNTEER';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password?: string, requestedRole?: UserRole) => Promise<void>;
  signupStaff: (data: { orgName: string; firstName: string; lastName: string; email: string }) => Promise<void>;
  signupVolunteer: (data: { firstName: string; lastName: string; email: string; phone?: string }) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'voluneease_auth_user';

const DEFAULT_STAFF_USER: AuthUser = {
  id: 'usr-sofia-1',
  firstName: 'Sofia',
  lastName: 'Martinez',
  email: 'sofia.martinez@greenearth.org',
  role: 'ORG_ADMIN',
  organizationId: 'org-greenearth-1',
  organizationName: 'GreenEarth Action Global',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  bio: 'Executive Director with 12 years in environmental conservation and volunteer operations.',
  phone: '+1 (415) 555-0101',
};

const DEFAULT_VOLUNTEER_USER: AuthUser = {
  id: 'vol-1',
  firstName: 'Elena',
  lastName: 'Rostova',
  email: 'elena.rostova@example.com',
  role: 'VOLUNTEER',
  organizationId: 'org-greenearth-1',
  organizationName: 'GreenEarth Action Global',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Marine biologist and environmental conservationist passionate about coastal cleanup.',
  phone: '+1 (555) 234-0021',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const role = user?.role || 'VIEWER';
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, _password?: string, requestedRole: UserRole = 'ORG_ADMIN') => {
    await new Promise((r) => setTimeout(r, 400));
    if (requestedRole === 'VOLUNTEER' || email.includes('volunteer')) {
      const volUser = { ...DEFAULT_VOLUNTEER_USER, email: email || DEFAULT_VOLUNTEER_USER.email };
      setUser(volUser);
    } else {
      const staffUser = { ...DEFAULT_STAFF_USER, email: email || DEFAULT_STAFF_USER.email, role: requestedRole };
      setUser(staffUser);
    }
  };

  const signupStaff = async (data: { orgName: string; firstName: string; lastName: string; email: string }) => {
    await new Promise((r) => setTimeout(r, 500));
    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'ORG_ADMIN',
      organizationId: `org-${Date.now()}`,
      organizationName: data.orgName,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
  };

  const signupVolunteer = async (data: { firstName: string; lastName: string; email: string; phone?: string }) => {
    await new Promise((r) => setTimeout(r, 500));
    const newUser: AuthUser = {
      id: `vol-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: 'VOLUNTEER',
      organizationId: 'org-greenearth-1',
      organizationName: 'GreenEarth Action Global',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'VOLUNTEER') {
      setUser(DEFAULT_VOLUNTEER_USER);
    } else {
      setUser({ ...DEFAULT_STAFF_USER, role: newRole });
    }
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        signupStaff,
        signupVolunteer,
        logout,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
