import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AuthLayout } from '../layouts/AuthLayout';
import { SignupForm } from '../components/auth/SignupForm';

export const SignupPage = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start shortening URLs in seconds — it's free"
    >
      <SignupForm />
    </AuthLayout>
  );
};
