import { baseApi } from './baseApi';
import {
  LoginCredentials,
  RegisterDto,
  CognitoAuthResponse,
  RegisterResponse,
  ConfirmSignupRequest,
  ConfirmSignupResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
  SendMagicLinkRequest,
  SendMagicLinkResponse,
  OIDCStatusResponse,
  PasswordlessStatusResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
} from '@/types/auth.types';
import { API_ENDPOINTS } from '@/utils/constants';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ========== Cognito Auth ==========
    login: builder.mutation<CognitoAuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      }),
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.SIGNUP,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    confirmSignup: builder.mutation<ConfirmSignupResponse, ConfirmSignupRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.CONFIRM_SIGNUP,
        method: 'POST',
        body: data,
      }),
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.REFRESH,
        method: 'POST',
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    resendVerification: builder.mutation<ResendVerificationResponse, ResendVerificationRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
        method: 'POST',
        body: data,
      }),
    }),

    // ========== Passwordless Auth ==========
    sendOTP: builder.mutation<SendOTPResponse, SendOTPRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.PASSWORDLESS.SEND_OTP,
        method: 'POST',
        body: data,
      }),
    }),

    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.PASSWORDLESS.VERIFY_OTP,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),

    sendMagicLink: builder.mutation<SendMagicLinkResponse, SendMagicLinkRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.PASSWORDLESS.SEND_MAGIC_LINK,
        method: 'POST',
        body: data,
      }),
    }),

    getPasswordlessStatus: builder.query<PasswordlessStatusResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.PASSWORDLESS.STATUS,
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),

    // ========== OIDC Auth ==========
    getOIDCStatus: builder.query<OIDCStatusResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.OIDC.STATUS,
        method: 'GET',
      }),
      providesTags: ['Auth'],
    }),

    // Note: OIDC login/logout are handled via redirects, not API calls
  }),
});

export const {
  // Cognito Auth
  useLoginMutation,
  useRegisterMutation,
  useConfirmSignupMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useResendVerificationMutation,
  
  // Passwordless Auth
  useSendOTPMutation,
  useVerifyOTPMutation,
  useSendMagicLinkMutation,
  useGetPasswordlessStatusQuery,
  
  // OIDC Auth
  useGetOIDCStatusQuery,
} = authApi;

// Legacy export for backward compatibility
export const useSignupMutation = useRegisterMutation;
export const useLogoutMutation = () => {
  // Logout is handled by clearing local storage and redirecting
  return [
    async () => {
      localStorage.clear();
      window.location.href = '/auth/login';
    },
    { isLoading: false },
  ] as const;
};