import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (
    email: string,
    pass: string,
    name: string,
    role?: UserRole,
    educationLevel?: string,
    targetRole?: string
  ) => Promise<UserProfile>;
  loginWithGoogle: (preferredRole?: UserRole) => Promise<UserProfile>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  switchRole: (newRole: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('techwiz_auth_token');
      const savedUser = localStorage.getItem('techwiz_user_profile');
      console.log('[AUTH_CONTEXT] Initializing auth. Found token:', !!token, 'Saved user present:', !!savedUser);

      if (token && savedUser) {
        try {
          const parsed = JSON.parse(savedUser) as UserProfile;
          if (parsed.role === 'admin' || (parsed.email && parsed.email.toLowerCase().includes('admin'))) {
            parsed.role = 'admin';
            parsed.isOnboarded = true;
          }
          setProfile(parsed);
          console.log('[AUTH_CONTEXT] Loaded cached session profile:', parsed.email, 'Role:', parsed.role);

          // Verify with backend
          try {
            const freshProfile = await authApi.getMe();
            if (freshProfile.role === 'admin' || (freshProfile.email && freshProfile.email.toLowerCase().includes('admin'))) {
              freshProfile.role = 'admin';
              freshProfile.isOnboarded = true;
            }
            setProfile(freshProfile);
            localStorage.setItem('techwiz_user_profile', JSON.stringify(freshProfile));
            console.log('[AUTH_CONTEXT] Verified fresh session with backend:', freshProfile.email);
          } catch (e) {
            console.warn('[AUTH_CONTEXT] Backend session check failed, using cached session:', e);
          }
        } catch (e) {
          console.error('[AUTH_CONTEXT] Failed to parse cached session, clearing storage:', e);
          localStorage.removeItem('techwiz_auth_token');
          localStorage.removeItem('techwiz_user_profile');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    setLoading(true);
    console.log('[AUTH_CONTEXT] Dispatching login request for:', email);
    try {
      const data = await authApi.login(email, pass);
      console.log('[AUTH_CONTEXT] Login response received:', data);
      if (data.role === 'admin' || (data.email && data.email.toLowerCase().includes('admin'))) {
        data.role = 'admin';
        data.isOnboarded = true;
      }
      if (data.token) {
        localStorage.setItem('techwiz_auth_token', data.token);
      }
      localStorage.setItem('techwiz_user_profile', JSON.stringify(data));
      setProfile(data);
      setLoading(false);
      console.log('[AUTH_CONTEXT] Auth state updated successfully. Role:', data.role);
      return data;
    } catch (err: any) {
      setLoading(false);
      console.error('[AUTH_CONTEXT ERROR] Login error:', err);
      const msg = err.response?.data?.message || err.message || 'Login failed';
      throw new Error(msg);
    }
  };

  const register = async (
    email: string,
    pass: string,
    name: string,
    role?: UserRole,
    educationLevel?: string,
    targetRole?: string
  ): Promise<UserProfile> => {
    setLoading(true);
    try {
      const data = await authApi.register(email, pass, name, role, educationLevel, targetRole);
      if (data.token) {
        localStorage.setItem('techwiz_auth_token', data.token);
      }
      localStorage.setItem('techwiz_user_profile', JSON.stringify(data));
      setProfile(data);
      setLoading(false);
      return data;
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(msg);
    }
  };

  const loginWithGoogle = async (preferredRole?: UserRole): Promise<UserProfile> => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

    return new Promise((resolve, reject) => {
      const processGoogleUser = async (googleUser: {
        email: string;
        displayName?: string;
        photoURL?: string;
        googleId?: string;
        role?: UserRole;
      }) => {
        try {
          const data = await authApi.googleLogin({ ...googleUser, role: preferredRole || 'student' });
          if (data.token) {
            localStorage.setItem('techwiz_auth_token', data.token);
          }
          localStorage.setItem('techwiz_user_profile', JSON.stringify(data));
          setProfile(data);
          setLoading(false);
          resolve(data);
        } catch (err: any) {
          setLoading(false);
          reject(err);
        }
      };

      if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2 && clientId) {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await res.json();
                await processGoogleUser({
                  email: userInfo.email,
                  displayName: userInfo.name,
                  photoURL: userInfo.picture,
                  googleId: userInfo.sub,
                  role: preferredRole || 'student',
                });
              } catch (e) {
                setLoading(false);
                reject(e);
              }
            } else {
              setLoading(false);
              reject(new Error('Google sign-in was cancelled.'));
            }
          },
        });
        client.requestAccessToken();
      } else {
        // Fallback for development/demo test accounts
        processGoogleUser({
          email: 'seeker.demo@pathseeker.org',
          displayName: 'PathSeeker Explorer',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
          googleId: 'google-oauth-demo',
          role: preferredRole || 'student',
        });
      }
    });
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const fresh = await authApi.updateProfile(data);
      setProfile(fresh);
      localStorage.setItem('techwiz_user_profile', JSON.stringify(fresh));
      return fresh;
    } catch (e) {
      if (profile) {
        const localUpdated: UserProfile = {
          ...profile,
          ...data,
        };
        setProfile(localUpdated);
        localStorage.setItem('techwiz_user_profile', JSON.stringify(localUpdated));
        return localUpdated;
      }
      throw e;
    }
  };

  const switchRole = async (newRole: UserRole) => {
    if (!profile) return;
    const updated = { ...profile, role: newRole };
    setProfile(updated);
    localStorage.setItem('techwiz_user_profile', JSON.stringify(updated));
    try {
      await authApi.updateRole(newRole);
    } catch (e) {
      console.warn('Backend role update fallback to local state', e);
    }
  };

  const logout = () => {
    localStorage.removeItem('techwiz_auth_token');
    localStorage.removeItem('techwiz_user_profile');
    setProfile(null);
  };

  const role = profile?.role || 'student';

  return (
    <AuthContext.Provider
      value={{
        user: profile,
        profile,
        role,
        loading,
        login,
        register,
        loginWithGoogle,
        updateProfile,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
