import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

// Lazy load page components for code splitting & faster bundle loading
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const LinkNotFoundPage = lazy(() => import('./pages/LinkNotFoundPage').then(m => ({ default: m.LinkNotFoundPage })));
const LinkExpiredPage = lazy(() => import('./pages/LinkExpiredPage').then(m => ({ default: m.LinkExpiredPage })));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-(--bg)">
    <LoadingSpinner size="lg" />
  </div>
);

const AppRoutes = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/link-not-found" element={<LinkNotFoundPage />} />
      <Route path="/link-expired" element={<LinkExpiredPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics/:urlId"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <AppRoutes />
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              fontSize: '14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: 'white' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: 'white' },
            },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
