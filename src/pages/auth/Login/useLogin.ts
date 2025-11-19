import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { LoginFormData, loginSchema } from '@/schemas/auth.schema';
import { useLoginMutation } from '@/store/api/authApi';
import { useAuth, useRedirectIfAuthenticated, useToast } from '@/hooks/common';
import { ROUTES } from '@/utils/constants';
import { ErrorHandler } from '@/utils/errors';

/**
 * Hook for login page logic
 * Handles form state, validation, and authentication with backend API
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [loginMutation, { isLoading }] = useLoginMutation();

  // Redirect if already authenticated
  useRedirectIfAuthenticated();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Backend returns: { user, accessToken, idToken, refreshToken, expiresIn }
      const response = await loginMutation(data).unwrap();

      // Store tokens and user info
      login(
        response.user,
        response.accessToken,
        response.refreshToken
      );

      // Store additional tokens if needed
      if (response.idToken) {
        localStorage.setItem('fms_id_token', response.idToken);
      }

      toast.success('Welcome back! 🎉');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      const appError = ErrorHandler.handle(error, {
        operation: 'Login',
        defaultMessage: 'Login failed',
        statusMessages: {
          401: 'Invalid email or password',
          403: 'Please verify your email before logging in',
        },
      });

      toast.error(appError.message);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
};