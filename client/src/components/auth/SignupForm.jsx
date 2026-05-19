import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateEmail, validatePassword } from '../../utils/validators';

export const SignupForm = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await signup({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created! Welcome to Hop Lynk 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input
        label="Full name"
        id="signup-name"
        type="text"
        placeholder="John Doe"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name', {
          required: 'Name is required',
          maxLength: { value: 50, message: 'Name cannot exceed 50 characters' },
        })}
      />
      <Input
        label="Email address"
        id="signup-email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email', { validate: validateEmail })}
      />
      <Input
        label="Password"
        id="signup-password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Min. 8 characters"
        autoComplete="new-password"
        error={errors.password?.message}
        hint="At least 8 characters"
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="text-(--text-muted) hover:text-(--text-secondary) transition-colors"
            tabIndex={-1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        }
        {...register('password', { validate: validatePassword })}
      />
      <Input
        label="Confirm password"
        id="signup-confirm-password"
        type={showPassword ? 'text' : 'password'}
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (v) => v === watch('password') || 'Passwords do not match',
        })}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full mt-2"
        isLoading={isSubmitting}
        id="signup-submit-btn"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-(--text-muted)">
        Already have an account?{' '}
        <Link to="/login" className="text-(--color-brand-600) hover:text-(--color-brand-500) font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
};
