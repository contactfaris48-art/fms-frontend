import {
  FolderIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useAuth, useModal } from '@/hooks/common';
import { formatFileSize } from '@/utils/helpers';

/**
 * Hook for user dashboard page logic
 * Handles dashboard statistics and file upload modal
 */
export const useDashboard = () => {
  const { user } = useAuth();
  const uploadModal = useModal();

  const stats = [
    {
      name: 'Total Files',
      value: '0',
      icon: DocumentIcon,
      change: '+0%',
      changeType: 'positive' as const,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Storage Used',
      value: user ? formatFileSize(user.storageUsed) : '0 B',
      icon: ChartBarIcon,
      change: `${user ? ((user.storageUsed / user.storageQuota) * 100).toFixed(1) : 0}%`,
      changeType: 'neutral' as const,
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      name: 'Folders',
      value: '0',
      icon: FolderIcon,
      change: '+0%',
      changeType: 'positive' as const,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Recent Uploads',
      value: '0',
      icon: CloudArrowUpIcon,
      change: 'Today',
      changeType: 'neutral' as const,
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

  const storageUsagePercent = user
    ? (user.storageUsed / user.storageQuota) * 100
    : 0;

  return {
    user,
    stats,
    uploadModal,
    storageUsagePercent,
    formatFileSize,
  };
};