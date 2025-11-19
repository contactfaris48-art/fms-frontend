import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ChangePasswordFormData, changePasswordSchema } from '@/schemas/auth.schema';
import { useChangePasswordMutation } from '@/store/api/authApi';
import { useToast } from '@/hooks/common';
import { ROUTES } from '@/constants';

/**
 * Hook for change password page logic
 * Handles form state, validation, and password change with backend API
 */
export const useChangePassword = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [changePasswordMutation, { isLoading }] = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = form.watch('newPassword');

  // Password strength checker
  const getPasswordStrength = () => {
    if (!newPassword) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/[0-9]/.test(newPassword)) strength++;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const response = await changePasswordMutation({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      
      toast.success(response.message || 'Password changed successfully! 🎉');
      
      // Reset form
      form.reset();
      
      // Optionally navigate back to profile or dashboard
      setTimeout(() => {
        navigate(ROUTES.PROFILE);
      }, 1500);
    } catch (error: any) {
      console.error('Change password error:', error);
      
      let errorMessage = 'Failed to change password';
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status === 401) {
        errorMessage = 'Current password is incorrect';
      } else if (error?.status === 400) {
        errorMessage = 'Invalid password format';
      }

      toast.error(errorMessage);
    }
  };

  return {
    form,
    isLoading,
    newPassword,
    passwordStrength: getPasswordStrength(),
    onSubmit: form.handleSubmit(onSubmit),
  };
};