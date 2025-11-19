/**
 * User-facing message constants
 */

export const ERROR_MESSAGES = {
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_TOKEN_EXPIRED: 'Your session has expired. Please login again',
  AUTH_TOKEN_INVALID: 'Invalid authentication token',
  AUTH_UNAUTHORIZED: 'You are not authorized to perform this action',
  FILE_NOT_FOUND: 'File not found',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed size',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded',
  VALIDATION_ERROR: 'Please check your input and try again',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
} as const;

export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully',
  FILE_DELETED: 'File deleted successfully',
  FILE_UPDATED: 'File updated successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  QUOTA_UPDATED: 'Storage quota updated successfully',
  LOGIN_SUCCESS: 'Login successful',
  SIGNUP_SUCCESS: 'Account created successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
} as const;