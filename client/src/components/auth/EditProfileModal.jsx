import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Split name for initial values
  const nameParts = (user?.name || '').split(' ');
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      email: user?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        firstName: initialFirstName,
        lastName: initialLastName,
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, [isOpen, user, reset]);

  const onSubmit = async (data) => {
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        ...(data.newPassword && {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      };

      await updateProfile(payload);
      toast.success('Profile updated successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="First Name"
          placeholder="First Name"
          {...register('firstName', { required: 'First name is required' })}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name"
          placeholder="Last Name"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Email address"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />

        <div className="pt-2">
          <Input
            label="Current Password"
            type="password"
            placeholder="Current Password"
            {...register('currentPassword')}
            hint="Required only if changing password"
          />
        </div>
        
        <div className="mt-2 space-y-4">
          
          <Input
            label="New Password"
            type="password"
            placeholder="New Password"
            {...register('newPassword', {
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
            error={errors.newPassword?.message}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm New Password"
            {...register('confirmNewPassword')}
            error={errors.confirmNewPassword?.message}
          />
        </div>

        <div className="flex justify-between items-center gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-1/2"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-1/2 bg-[#31515E] hover:bg-[#25424D] text-white border-none"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};