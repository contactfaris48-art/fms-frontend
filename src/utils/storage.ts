import { STORAGE_KEYS } from './constants';

/**
 * Generic localStorage operations
 */
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Auth-specific storage operations
 */
export const authStorage = {
  getToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  setToken: (token: string): void => {
    storage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  getRefreshToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken: (token: string): void => {
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, token);
  },

  setItem: (key: string, value: string): void => {
    storage.set(key, value);
  },

  getItem: (key: string): string | null => {
    return storage.get<string>(key);
  },

  clearAuth: (): void => {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER);
    storage.remove('id_token');
  },
};

/**
 * UI preferences storage
 */
export const uiStorage = {
  getViewMode: (): 'grid' | 'list' => {
    return storage.get<'grid' | 'list'>(STORAGE_KEYS.VIEW_MODE) || 'grid';
  },

  setViewMode: (mode: 'grid' | 'list'): void => {
    storage.set(STORAGE_KEYS.VIEW_MODE, mode);
  },

  getTheme: (): 'light' | 'dark' => {
    return storage.get<'light' | 'dark'>(STORAGE_KEYS.THEME) || 'light';
  },

  setTheme: (theme: 'light' | 'dark'): void => {
    storage.set(STORAGE_KEYS.THEME, theme);
  },
};