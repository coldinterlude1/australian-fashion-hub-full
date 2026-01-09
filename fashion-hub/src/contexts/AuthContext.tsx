import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { base44 } from '@/api/base44Client';
import type { User, LoginCredentials, SignupData } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and restore session
    const token = localStorage.getItem('auth_token');
    if (token) {
      base44.auth.getCurrentUser().then(setUser).catch(() => {
        localStorage.removeItem('auth_token');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await base44.auth.login(credentials);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await base44.auth.signup(data);
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await base44.auth.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  const sendMagicLink = async (email: string) => {
    await base44.auth.sendMagicLink(email);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await base44.auth.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, sendMagicLink, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

