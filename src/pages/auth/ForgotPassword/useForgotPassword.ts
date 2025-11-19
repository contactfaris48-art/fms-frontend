import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/schemas/auth.schema';
import { useForgotPasswordMutation } from '@/store/api/authApi';
import { useRedirectIfAuthenticated, useToast } from '@/hooks/common';
import { ROUTES } from '@/constants';

/**
 * Hook for forgot password page logic
 * Handles form state, validation, and forgot password request with backend API
 */
export const useForgotPassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [forgotPasswordMutation, { isLoading }] = useForgotPasswordMutation();

  // Redirect if already authenticated
  useRedirectIfAuthenticated();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPasswordMutation(data).unwrap();
      
      toast.success(response.message || 'Password reset code sent to your email');
      
      // Navigate to reset password page with email
      navigate(ROUTES.RESET_PASSWORD, { 
        state: { email: data.email } 
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      let errorMessage = 'Failed to send reset code';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 404) {
        errorMessage = 'No account found with this email';
      } else if (error?.status === 429) {
        errorMessage = 'Too many requests. Please try again later';
      }

      toast.error(errorMessage);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
};