import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Hop Lynk account"
    >
      <LoginForm />
    </AuthLayout>
  );
};
