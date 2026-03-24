import React, { createContext, useContext, useState, useCallback } from 'react';
import { authAPI, saveTokens, clearTokens, getAccessToken } from '../lib/api';
import Toast from '../components/Toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('erp_user');
      if (stored && getAccessToken()) {
        return JSON.parse(stored);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

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
        showToast(`Welcome back, ${userData.name}!`, 'success');
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
        showToast('Registration successful! Please log in.', 'success');
        return { success: true };
      }
      const msg = data.error || 'Registration failed.';
      return { success: false, error: msg };
    } catch (err) {
      return { success: false, error: 'Could not connect to server. Is the backend running?' };
    }
  };

  const logout = () => {
    setUser(null);
    clearTokens();
    showToast('Logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, showToast }}>
      {children}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
