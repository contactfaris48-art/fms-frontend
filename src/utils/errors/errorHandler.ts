import { ErrorType, AppError, RTKQueryError, ErrorContext } from './types';

/**
 * Centralized error handler for the application
 * Provides consistent error handling, logging, and user messaging
 */
export class ErrorHandler {
  /**
   * Main error handling method
   * @param error - The error to handle (can be any type)
   * @param context - Additional context for error handling
   * @returns Parsed AppError object
   */
  static handle(error: unknown, context?: ErrorContext): AppError {
    const appError = this.parseError(error, context);
    this.logError(appError, context);
    return appError;
  }

  /**
   * Parse different error types into a standard AppError format
   * @param error - The error to parse
   * @param context - Additional context for parsing
   * @returns Parsed AppError object
   */
  static parseError(error: unknown, context?: ErrorContext): AppError {
    // Handle RTK Query errors
    if (this.isRTKQueryError(error)) {
      return this.handleRTKQueryError(error, context);
    }

    // Handle standard Error objects
    if (error instanceof Error) {
      return {
        type: ErrorType.UNKNOWN,
        message: error.message || context?.defaultMessage || 'An error occurred',
        originalError: error,
      };
    }

    // Handle string errors
    if (typeof error === 'string') {
      return {
        type: ErrorType.UNKNOWN,
        message: error,
        originalError: error,
      };
    }

    // Handle unknown error types
    return {
      type: ErrorType.UNKNOWN,
      message: context?.defaultMessage || 'An unexpected error occurred',
      originalError: error,
    };
  }

  /**
   * Handle RTK Query specific errors
   * @param error - RTK Query error object
   * @param context - Additional context for error handling
   * @returns Parsed AppError object
   */
  static handleRTKQueryError(error: RTKQueryError, context?: ErrorContext): AppError {
    const statusCode = error.status;
    let message = context?.defaultMessage || 'An error occurred';
    let type = ErrorType.UNKNOWN;

    // Extract message from error object
    if (error.data?.message) {
      message = error.data.message;
    } else if (error.data?.error) {
      message = error.data.error;
    } else if (error.message) {
      message = error.message;
    } else if (error.error) {
      message = error.error;
    }

    // Check for context-specific status messages
    if (statusCode && context?.statusMessages?.[statusCode]) {
      message = context.statusMessages[statusCode];
    }

    // Determine error type based on status code
    if (statusCode) {
      if (statusCode === 401 || statusCode === 403) {
        type = ErrorType.AUTH;
      } else if (statusCode === 400 || statusCode === 422) {
        type = ErrorType.VALIDATION;
      } else if (statusCode >= 500) {
        type = ErrorType.SERVER;
      } else if (statusCode === 0 || (typeof statusCode === 'string' && statusCode === 'FETCH_ERROR')) {
        type = ErrorType.NETWORK;
      }
    }

    return {
      type,
      message,
      statusCode: typeof statusCode === 'number' ? statusCode : undefined,
      originalError: error,
    };
  }

  /**
   * Type guard to check if error is an RTK Query error
   * @param error - The error to check
   * @returns True if error is an RTK Query error
   */
  static isRTKQueryError(error: unknown): error is RTKQueryError {
    return (
      typeof error === 'object' &&
      error !== null &&
      ('status' in error || 'data' in error || 'error' in error)
    );
  }

  /**
   * Log error to console (can be extended to send to monitoring service)
   * @param error - The AppError to log
   * @param context - Additional context for logging
   */
  static logError(error: AppError, context?: ErrorContext): void {
    const logMessage = context?.operation
      ? `[${context.operation}] ${error.message}`
      : error.message;

    console.error(logMessage, {
      type: error.type,
      statusCode: error.statusCode,
      originalError: error.originalError,
    });
  }

  /**
   * Get user-friendly error message based on context
   * @param error - The error object
   * @param context - Error context with operation-specific messages
   * @returns User-friendly error message
   */
  static getUserMessage(error: unknown, context?: ErrorContext): string {
    const appError = this.parseError(error, context);
    return appError.message;
  }
}