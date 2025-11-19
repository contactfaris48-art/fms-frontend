import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/common';
import { useGetUsersQuery } from '@/store/api/usersApi';
import { useGetStorageStatsQuery } from '@/store/api/storageApi';
import { formatFileSize } from '@/utils/helpers';
import { ROUTES } from '@/utils/constants';
import {
  UserGroupIcon,
  ServerIcon,
  FolderIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

/**
 * Hook for admin dashboard page logic
 * Handles dashboard statistics, recent users, and storage overview
 */
export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch real data
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery({
    page: 1,
    limit: 5,
  });
  const { data: storageData, isLoading: storageLoading } = useGetStorageStatsQuery();

  const users = usersData?.data?.users || [];
  const storageStats = storageData?.data;

  // Dashboard statistics
  const stats = [
    {
      name: 'Total Users',
      value: storageStats?.userCount?.toString() || '0',
      change: '+0',
      changeType: 'positive' as const,
      icon: UserGroupIcon,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Storage Used',
      value: storageStats ? formatFileSize(storageStats.totalUsed) : '0 GB',
      change: '+0 GB',
      changeType: 'positive' as const,
      icon: ServerIcon,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      name: 'Total Files',
      value: storageStats?.fileCount?.toString() || '0',
      change: '+0',
      changeType: 'positive' as const,
      icon: FolderIcon,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Active Users',
      value: users.filter((u) => u.isActive).length.toString(),
      change: '0%',
      changeType: 'neutral' as const,
      icon: ChartBarIcon,
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  const recentUsers = users.slice(0, 5);

  // Navigation handlers
  const navigateToUsers = () => navigate(ROUTES.ADMIN_USERS);
  const navigateToStorage = () => navigate(ROUTES.ADMIN_STORAGE);

  // Calculate storage usage percentage
  const storageUsagePercent = storageStats
    ? (storageStats.totalUsed / storageStats.totalStorage) * 100
    : 0;

  return {
    // User data
    user,
    
    // Statistics
    stats,
    recentUsers,
    storageStats,
    storageUsagePercent,
    
    // Loading states
    usersLoading,
    storageLoading,
    
    // Navigation
    navigateToUsers,
    navigateToStorage,
    
    // Utilities
    formatFileSize,
  };
};