import { AuthLayout } from '../layouts/AuthLayout';
import { SignupForm } from '../components/auth/SignupForm';

export const SignupPage = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start shortening URLs in seconds — it's free"
    >
      <SignupForm />
    </AuthLayout>
  );
};
