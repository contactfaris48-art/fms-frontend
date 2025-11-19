import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { SignupFormData, signupSchema } from '@/schemas/auth.schema';
import { useRegisterMutation } from '@/store/api/authApi';
import { useRedirectIfAuthenticated, useToast } from '@/hooks/common';
import { ROUTES } from '@/utils/constants';
import { ErrorHandler } from '@/utils/errors';

/**
 * Hook for signup page logic
 * Handles form state, validation, password strength, and registration with backend API
 */
export const useSignup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const [needsVerification, setNeedsVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Redirect if already authenticated
  useRedirectIfAuthenticated();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
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

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Backend returns: { user, message, userConfirmed }
      const response = await registerMutation({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      }).unwrap();

      setRegisteredEmail(data.email);

      // Check if user needs email verification
      if (!response.userConfirmed) {
        setNeedsVerification(true);
        toast.success(response.message || 'Please check your email to verify your account');
        // Redirect to verification page
        navigate(`${ROUTES.LOGIN}?email=${encodeURIComponent(data.email)}&verify=true`);
      } else {
        // User is auto-confirmed, can login
        toast.success('Account created successfully! Please login.');
        navigate(ROUTES.LOGIN);
      }
    } catch (error) {
      const appError = ErrorHandler.handle(error, {
        operation: 'Signup',
        defaultMessage: 'Signup failed',
        statusMessages: {
          409: 'An account with this email already exists',
          400: 'Invalid input. Please check your information.',
        },
      });

      toast.error(appError.message);
    }
  };

  return {
    form,
    isLoading,
    password,
    passwordStrength: getPasswordStrength(),
    needsVerification,
    registeredEmail,
    onSubmit: form.handleSubmit(onSubmit),
  };
};