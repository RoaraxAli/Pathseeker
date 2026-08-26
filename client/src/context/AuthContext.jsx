import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch, getToken, setToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, if a token is stored, verify it against the server and
  // populate the user — this is what keeps someone logged in across refreshes.
  useEffect(() => {
    async function loadUser() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const data = await apiFetch('/auth/me');
        setUser(data.user);
      } catch {
        setToken(null); // stored token is invalid/expired
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await apiFetch('/auth/login', { method: 'POST', body: { email, password } });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: { name, email, password, role },
    });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await apiFetch('/auth/me');
    setUser(data.user);
    return data.user;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
