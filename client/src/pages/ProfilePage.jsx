import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const ProfilePage = () => {
  const { user, updateProfile, updatePassword } = useAuthStore();

  // Profile Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showProfilePassword, setShowProfilePassword] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize values when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Derived properties
  const isEmailDirty = user && email.toLowerCase() !== user.email.toLowerCase();
  const isProfilePristine = user && name === user.name && email === user.email;

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Name is required');
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      return toast.error('Please enter a valid email address');
    }
    if (isEmailDirty && !profilePassword) {
      return toast.error('Please enter your current password to confirm the email change');
    }

    setIsUpdatingProfile(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        ...(isEmailDirty && { currentPassword: profilePassword }),
      });
      toast.success('Profile updated successfully');
      setProfilePassword(''); // clear verification field
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      return toast.error('Current password is required');
    }
    if (newPassword.length < 8) {
      return toast.error('New password must be at least 8 characters');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setIsUpdatingPassword(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const EyeIcon = () => (
    <svg className="w-5 h-5 text-(--text-muted) hover:text-(--text-secondary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="w-5 h-5 text-(--text-muted) hover:text-(--text-secondary)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.024 10.024 0 014.17-5.384m3-1.9A9.97 9.97 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.4m-4.66-4.66a3 3 0 11-4.24-4.24" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-(--text-primary)">Profile Settings</h1>
          <p className="text-sm text-(--text-muted) mt-1">Manage your account information and security preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Details Form */}
          <div className="bg-(--card) border border-(--border) rounded-xl p-5 sm:p-6 space-y-4">
            <h2 className="text-base font-semibold text-(--text-primary)">Profile Details</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />

              {isEmailDirty && (
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-3 animate-fade-in">
                  <p className="text-xs text-amber-600 font-medium leading-relaxed">
                    ⚠️ You are changing your account email address. This requires verifying your current password for security.
                  </p>
                  <Input
                    label="Current Password"
                    type={showProfilePassword ? 'text' : 'password'}
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="Enter current password"
                    required={isEmailDirty}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowProfilePassword(!showProfilePassword)}
                        className="focus:outline-none"
                      >
                        {showProfilePassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    }
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={isUpdatingProfile || isProfilePristine}
                className="w-full"
              >
                {isUpdatingProfile ? 'Saving changes…' : 'Save Changes'}
              </Button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-(--card) border border-(--border) rounded-xl p-5 sm:p-6 space-y-4">
            <h2 className="text-base font-semibold text-(--text-primary)">Security & Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="focus:outline-none"
                  >
                    {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />

              <Input
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                hint="Minimum 8 characters"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="focus:outline-none"
                  >
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />

              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />

              <Button
                type="submit"
                variant="primary"
                disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="w-full"
              >
                {isUpdatingPassword ? 'Updating password…' : 'Update Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
