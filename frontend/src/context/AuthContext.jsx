import React, { createContext, useContext, useState } from 'react';
import { authAPI, saveTokens, clearTokens, getAccessToken } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('erp_user');
      // Only restore if we still have a token
      if (stored && getAccessToken()) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    try {
      const { ok, data } = await authAPI.login(email, password);
      if (ok) {
        saveTokens({ access: data.access, refresh: data.refresh });
        const userData = {
          name: data.user.full_name || data.user.email,
          email: data.user.email,
          role: data.user.email === 'admin@erp.com' ? 'admin' : 'operator',
          id: data.user.id,
        };
        setUser(userData);
        localStorage.setItem('erp_user', JSON.stringify(userData));
        return { success: true };
      }
      return { success: false, error: data.error || 'Invalid email or password.' };
    } catch (err) {
      return { success: false, error: 'Could not connect to server. Is the backend running?' };
    }
  };

  const register = async ({ name, email, phone, password }) => {
    try {
      const { ok, data } = await authAPI.register({ name, email, phone, password });
      if (ok) {
        return { success: true };
      }
      // Flatten DRF validation errors
      const firstError = Object.values(data)[0];
      const msg = Array.isArray(firstError) ? firstError[0] : (data.error || 'Registration failed.');
      return { success: false, error: msg };
    } catch (err) {
      return { success: false, error: 'Could not connect to server. Is the backend running?' };
    }
  };

  const logout = () => {
    setUser(null);
    clearTokens();
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
