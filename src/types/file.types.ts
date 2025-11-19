import { SortBy, SortOrder } from './common.types';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnailUrl?: string;
  userId: string;
  folderId?: string;
  isPublic: boolean;
  shareLink?: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface FileUploadRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
  folderId?: string;
}

export interface FileUploadResponse {
  uploadUrl: string;
  fileId: string;
  expiresIn: number;
}

export interface ConfirmUploadRequest {
  fileId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  folderId?: string;
}

export interface FileUpdateRequest {
  name?: string;
  folderId?: string;
}

export interface FileDownloadResponse {
  downloadUrl: string;
  expiresIn: number;
}

export interface FileFilters {
  type?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  } | null;
}

export interface FileListParams {
  folderId?: string;
  search?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
}

export interface FilesState {
  items: FileItem[];
  selectedFiles: string[];
  currentFolder: string | null;
  viewMode: 'grid' | 'list';
  sortBy: SortBy;
  sortOrder: SortOrder;
  searchQuery: string;
  filters: FileFilters;
  isUploading: boolean;
  uploadProgress: number;
}

export interface StorageUsage {
  storageUsed: number;
  storageQuota: number;
  usagePercentage: number;
  fileCount: number;
  largestFile?: {
    id: string;
    name: string;
    size: number;
  };
}

export interface StorageStats {
  totalStorage: number;
  totalUsed: number;
  totalAvailable: number;
  userCount: number;
  fileCount: number;
  topUsers: Array<{
    userId: string;
    email: string;
    storageUsed: number;
  }>;
}