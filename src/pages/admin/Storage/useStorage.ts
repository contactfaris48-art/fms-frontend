import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal, useToast } from '@/hooks/common';
import { useGetStorageStatsQuery } from '@/store/api/storageApi';
import { useGetUsersQuery, useSetUserQuotaMutation } from '@/store/api/usersApi';
import { ROUTES } from '@/utils/constants';
import { formatFileSize } from '@/utils/helpers';

/**
 * Hook for storage management page logic
 * Handles storage statistics, user quotas, and bulk updates
 */
export const useStorage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const bulkQuotaModal = useModal();
  const [bulkQuotaValue, setBulkQuotaValue] = useState('10');

  // Fetch real data
  const { data: storageData, isLoading: storageLoading, refetch: refetchStorage } = useGetStorageStatsQuery();
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useGetUsersQuery({});
  const [setUserQuota] = useSetUserQuotaMutation();

  const storageStats = storageData?.data;
  const users = usersData?.data?.users || [];

  // Mock fallback data
  const mockStorageStats = {
    totalStorage: 107374182400, // 100 GB
    totalUsed: 16106127360, // 15 GB
    totalAvailable: 91268055040, // 85 GB
    userCount: 3,
    fileCount: 0,
    topUsers: [],
  };

  const displayStats = storageStats || mockStorageStats;

  // Sort users by storage usage
  const topUsers = [...users]
    .sort((a, b) => b.storageUsed - a.storageUsed)
    .slice(0, 10);

  const handleBulkQuotaUpdate = async () => {
    try {
      const quotaInBytes = parseInt(bulkQuotaValue) * 1024 * 1024 * 1024;

      // Update all users
      await Promise.all(
        users.map((user) =>
          setUserQuota({
            userId: user.id,
            data: { storageQuota: quotaInBytes },
          }).unwrap()
        )
      );

      toast.success(`Updated storage quota to ${bulkQuotaValue} GB for all users`);
      bulkQuotaModal.close();
      refetchUsers();
      refetchStorage();
    } catch (error) {
      toast.error('Failed to update storage quotas');
    }
  };

  const handleRefresh = () => {
    refetchStorage();
    refetchUsers();
    toast.success('Data refreshed');
  };

  const navigateToUsers = () => navigate(ROUTES.ADMIN_USERS);

  const storageUsagePercent = (displayStats.totalUsed / displayStats.totalStorage) * 100;

  return {
    displayStats,
    topUsers,
    storageLoading,
    usersLoading,
    bulkQuotaModal,
    bulkQuotaValue,
    setBulkQuotaValue,
    handleBulkQuotaUpdate,
    handleRefresh,
    navigateToUsers,
    storageUsagePercent,
    formatFileSize,
  };
};