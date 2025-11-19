import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResetPasswordFormData, resetPasswordSchema } from '@/schemas/auth.schema';
import { useResetPasswordMutation } from '@/store/api/authApi';
import { useRedirectIfAuthenticated, useToast } from '@/hooks/common';
import { ROUTES } from '@/constants';

/**
 * Hook for reset password page logic
 * Handles form state, validation, and password reset with backend API
 */
export const useResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [resetPasswordMutation, { isLoading }] = useResetPasswordMutation();

  const email = location.state?.email || '';

  // Redirect if already authenticated or no email
  useRedirectIfAuthenticated();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = form.watch('password');

  // Password strength checker
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      toast.error('Email is required. Please start from forgot password page.');
      navigate(ROUTES.FORGOT_PASSWORD);
      return;
    }

    try {
      const response = await resetPasswordMutation({
        email,
        code: data.code,
        password: data.password,
      }).unwrap();
      
      toast.success(response.message || 'Password reset successfully! 🎉');
      
      // Navigate to login page
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      let errorMessage = 'Failed to reset password';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 400) {
        errorMessage = 'Invalid or expired reset code';
      } else if (error?.status === 404) {
        errorMessage = 'Account not found';
      }

      toast.error(errorMessage);
    }
  };

  return {
    form,
    isLoading,
    email,
    password,
    passwordStrength: getPasswordStrength(),
    onSubmit: form.handleSubmit(onSubmit),
  };
};