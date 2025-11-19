import { useState } from 'react';
import { useModal } from '@/hooks/common';

/**
 * Hook for files page logic
 * Handles file list, search, view mode, and upload modal
 */
export const useFiles = () => {
  const uploadModal = useModal();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with real data from API
  const files: any[] = [];

  const folders = [
    { id: '1', name: 'Documents', fileCount: 0, color: 'blue' },
    { id: '2', name: 'Images', fileCount: 0, color: 'purple' },
    { id: '3', name: 'Videos', fileCount: 0, color: 'pink' },
  ];

  return {
    uploadModal,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    files,
    folders,
  };
};