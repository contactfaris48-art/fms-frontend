export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  storageUsed: number;
  storageQuota: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  // Additional profile fields can be added here
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive?: boolean;
  role?: UserRole;
}

export interface SetQuotaRequest {
  storageQuota: number;
}

export interface UserListFilters {
  search?: string;
  role?: UserRole;
  isActive?: boolean;
}