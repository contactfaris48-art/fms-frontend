import { User } from './user.types';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Cognito Auth Response
export interface CognitoAuthResponse {
  user: User;
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Register Response
export interface RegisterResponse {
  user: User;
  message: string;
  userConfirmed: boolean;
}

// Confirm Signup
export interface ConfirmSignupRequest {
  email: string;
  code: string;
}

export interface ConfirmSignupResponse {
  message: string;
}

// Refresh Token
export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  idToken: string;
  expiresIn: number;
}

// Passwordless Auth
export interface SendOTPRequest {
  email: string;
}

export interface SendOTPResponse {
  message: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  user: User;
}

export interface SendMagicLinkRequest {
  email: string;
}

export interface SendMagicLinkResponse {
  message: string;
}

// OIDC Auth
export interface OIDCStatusResponse {
  isAuthenticated: boolean;
  userInfo: any | null;
}

export interface PasswordlessStatusResponse {
  isAuthenticated: boolean;
  user: User | null;
}

// Legacy types for compatibility
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}