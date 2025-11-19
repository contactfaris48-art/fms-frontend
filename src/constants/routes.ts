/**
 * Application route constants
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  CHANGE_PASSWORD: '/dashboard/change-password',
  DASHBOARD: '/dashboard',
  FILES: '/dashboard/files',
  PROFILE: '/dashboard/profile',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_STORAGE: '/admin/storage',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/unauthorized',
} as const;