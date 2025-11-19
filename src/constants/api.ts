/**
 * API endpoint constants
 */

export const API_ENDPOINTS = {
  AUTH: {
    // Cognito Auth
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CONFIRM_SIGNUP: '/auth/confirm-signup',
    RESEND_VERIFICATION: '/auth/resend-verification',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
    
    // OIDC Auth
    OIDC: {
      LOGIN: '/auth/oidc/login',
      CALLBACK: '/auth/oidc/callback',
      LOGOUT: '/auth/oidc/logout',
      STATUS: '/auth/oidc/status',
    },
    
    // Passwordless Auth
    PASSWORDLESS: {
      SEND_OTP: '/auth/passwordless/send-otp',
      VERIFY_OTP: '/auth/passwordless/verify-otp',
      SEND_MAGIC_LINK: '/auth/passwordless/send-magic-link',
      VERIFY_MAGIC_LINK: '/auth/passwordless/verify-magic-link',
      STATUS: '/auth/passwordless/status',
    },
  },
  FILES: {
    LIST: '/files',
    UPLOAD_URL: '/files/upload-url',
    CONFIRM: '/files/confirm',
    DOWNLOAD_URL: (id: string) => `/files/${id}/download-url`,
    DELETE: (id: string) => `/files/${id}`,
    UPDATE: (id: string) => `/files/${id}`,
  },
  USERS: {
    LIST: '/admin/users',
    GET: (id: string) => `/admin/users/${id}`,
    UPDATE: (id: string) => `/admin/users/${id}`,
    DELETE: (id: string) => `/admin/users/${id}`,
    SET_QUOTA: (id: string) => `/admin/users/${id}/quota`,
  },
  STORAGE: {
    USAGE: '/storage/usage',
    STATS: '/admin/storage/stats',
  },
} as const;