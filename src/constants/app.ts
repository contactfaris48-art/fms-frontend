/**
 * Application-level constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'FMS';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '104857600'); // 100MB

export const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  videos: ['video/mp4', 'video/webm', 'video/ogg'],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ],
  archives: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
  text: ['text/plain', 'text/csv', 'text/html', 'text/css', 'text/javascript'],
} as const;

export const DEFAULT_STORAGE_QUOTA = 10737418240; // 10GB in bytes
export const MIN_PASSWORD_LENGTH = 8;
export const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes