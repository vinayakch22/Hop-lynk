import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  // Empty string → relative URLs → Vite proxy handles routing in dev.
  // Set VITE_API_URL to the production API origin (e.g. https://api.example.com).
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isProfileOrPasswordUpdate =
      error.config?.url?.endsWith('/api/auth/profile') ||
      error.config?.url?.endsWith('/api/auth/password');

    if (error.response?.status === 401 && !isProfileOrPasswordUpdate) {
      // Clear auth state and redirect to login
      useAuthStore.getState().clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
