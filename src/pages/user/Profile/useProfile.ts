import { useState } from 'react';
import { useAuth, useToast } from '@/hooks/common';
import { formatFileSize } from '@/utils/helpers';

/**
 * Hook for profile page logic
 * Handles profile settings, security, and notifications
 */
export const useProfile = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password changed successfully!');
  };

  const storageUsagePercent = user
    ? (user.storageUsed / user.storageQuota) * 100
    : 0;

  return {
    user,
    activeTab,
    setActiveTab,
    handleSaveProfile,
    handleChangePassword,
    storageUsagePercent,
    formatFileSize,
  };
};