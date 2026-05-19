import { AuthLayout } from '../layouts/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Hop Lynk account"
    >
      <LoginForm />
    </AuthLayout>
  );
};
