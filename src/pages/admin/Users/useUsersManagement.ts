import { useState } from 'react';
import { useModalWithData, useToast } from '@/hooks/common';
import {
  useGetUsersQuery,
  useSetUserQuotaMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from '@/store/api/usersApi';
import { User } from '@/types/user.types';

/**
 * Hook for users management page logic
 * Handles user list, search, filters, quota management, and user actions
 */
export const useUsersManagement = () => {
  const toast = useToast();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [newQuota, setNewQuota] = useState('10');

  // Modal state
  const editModal = useModalWithData<User>();

  // API queries and mutations
  const { data: usersData, isLoading, refetch } = useGetUsersQuery({
    search: searchQuery,
    role: filterRole === 'all' ? undefined : filterRole,
    isActive: filterStatus === 'all' ? undefined : filterStatus === 'active',
  });

  const [setUserQuota, { isLoading: isUpdatingQuota }] = useSetUserQuotaMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const users = usersData?.data?.users || [];

  // Mock fallback data for development
  const mockUsers: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'user',
      storageUsed: 5368709120, // 5 GB
      storageQuota: 10737418240, // 10 GB
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'user',
      storageUsed: 2147483648, // 2 GB
      storageQuota: 10737418240, // 10 GB
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      role: 'user',
      storageUsed: 8589934592, // 8 GB
      storageQuota: 10737418240, // 10 GB
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const displayUsers = users.length > 0 ? users : mockUsers;

  // Filter users by search query
  const filteredUsers = displayUsers.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleEditUser = (user: User) => {
    setNewQuota((user.storageQuota / (1024 * 1024 * 1024)).toString());
    editModal.open(user);
  };

  const handleSaveQuota = async () => {
    if (!editModal.data) return;

    try {
      const quotaInBytes = parseInt(newQuota) * 1024 * 1024 * 1024; // Convert GB to bytes
      await setUserQuota({
        userId: editModal.data.id,
        data: { storageQuota: quotaInBytes },
      }).unwrap();

      toast.success(`Storage quota updated to ${newQuota} GB for ${editModal.data.email}`);
      editModal.close();
      refetch();
    } catch (error) {
      toast.error('Failed to update storage quota');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.email}?`)) return;

    try {
      await deleteUser(user.id).unwrap();
      toast.success(`User ${user.email} deleted successfully`);
      refetch();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await updateUser({
        userId: user.id,
        data: { isActive: !user.isActive },
      }).unwrap();

      toast.success(`User ${user.email} ${user.isActive ? 'deactivated' : 'activated'}`);
      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    filterRole,
    setFilterRole,
    newQuota,
    setNewQuota,
    
    // Data
    users: filteredUsers,
    isLoading,
    isUpdatingQuota,
    
    // Modal
    editModal,
    
    // Handlers
    handleEditUser,
    handleSaveQuota,
    handleDeleteUser,
    handleToggleStatus,
    refetch,
  };
};