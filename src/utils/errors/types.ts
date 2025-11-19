/**
 * Error types for categorizing different kinds of errors
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Standard application error interface
 */
export interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  originalError?: unknown;
}

/**
 * RTK Query error structure
 */
export interface RTKQueryError {
  status?: number;
  data?: {
    message?: string;
    error?: string;
  };
  error?: string;
  message?: string;
}

/**
 * Error context for providing additional information
 */
export interface ErrorContext {
  operation?: string;
  defaultMessage?: string;
  statusMessages?: Record<number, string>;
}