import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // true on mount until checkAuth resolves

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/api/auth/me');
      set({ user: data.data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    const { data } = await api.post('/api/auth/login', credentials);
    set({ user: data.data, isAuthenticated: true });
    return data;
  },

  signup: async (userData) => {
    const { data } = await api.post('/api/auth/signup', userData);
    set({ user: data.data, isAuthenticated: true });
    return data;
  },

  logout: async () => {
    await api.post('/api/auth/logout');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/api/auth/profile', profileData);
    set({ user: data.data });
    return data;
  },

  updatePassword: async (passwordData) => {
    const { data } = await api.put('/api/auth/password', passwordData);
    return data;
  },

  clearAuth: () => {
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
