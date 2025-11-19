import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useSendOTPMutation,
  useVerifyOTPMutation,
  useSendMagicLinkMutation,
} from '@/store/api/authApi';
import { useAuth, useToast } from '@/hooks/common';
import { ROUTES } from '@/utils/constants';
import { ErrorHandler } from '@/utils/errors';

/**
 * Hook for passwordless authentication
 * Supports both OTP and Magic Link flows
 */
export const usePasswordlessAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [sendOTP, { isLoading: isSendingOTP }] = useSendOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
  const [sendMagicLink, { isLoading: isSendingMagicLink }] = useSendMagicLinkMutation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  /**
   * Send OTP to user's email
   */
  const handleSendOTP = async (userEmail?: string) => {
    const emailToUse = userEmail || email;
    
    if (!emailToUse) {
      toast.error('Please enter your email');
      return;
    }

    try {
      const response = await sendOTP({ email: emailToUse }).unwrap();
      setEmail(emailToUse);
      setOtpSent(true);
      toast.success(response.message || 'OTP sent to your email');
    } catch (error) {
      const appError = ErrorHandler.handle(error, {
        operation: 'Send OTP',
        defaultMessage: 'Failed to send OTP',
      });
      
      toast.error(appError.message);
    }
  };

  /**
   * Verify OTP and authenticate user
   */
  const handleVerifyOTP = async (userEmail?: string, userOtp?: string) => {
    const emailToUse = userEmail || email;
    const otpToUse = userOtp || otp;
    
    if (!emailToUse || !otpToUse) {
      toast.error('Please enter email and OTP');
      return;
    }

    try {
      const response = await verifyOTP({ 
        email: emailToUse, 
        otp: otpToUse 
      }).unwrap();

      // Store user info and navigate to dashboard
      if (response.user) {
        login(
          response.user,
          'passwordless_session', // Placeholder token
          'passwordless_session'
        );
        
        toast.success(response.message || 'Login successful! 🎉');
        navigate(ROUTES.DASHBOARD);
      }
    } catch (error) {
      const appError = ErrorHandler.handle(error, {
        operation: 'Verify OTP',
        defaultMessage: 'Invalid or expired OTP',
        statusMessages: {
          401: 'Invalid or expired OTP',
        },
      });
      
      toast.error(appError.message);
      setOtp('');
    }
  };

  /**
   * Send magic link to user's email
   */
  const handleSendMagicLink = async (userEmail?: string) => {
    const emailToUse = userEmail || email;
    
    if (!emailToUse) {
      toast.error('Please enter your email');
      return;
    }

    try {
      const response = await sendMagicLink({ email: emailToUse }).unwrap();
      setEmail(emailToUse);
      toast.success(response.message || 'Magic link sent to your email');
    } catch (error) {
      const appError = ErrorHandler.handle(error, {
        operation: 'Send magic link',
        defaultMessage: 'Failed to send magic link',
      });
      
      toast.error(appError.message);
    }
  };

  /**
   * Reset the passwordless auth state
   */
  const resetState = () => {
    setEmail('');
    setOtp('');
    setOtpSent(false);
  };

  return {
    // State
    email,
    setEmail,
    otp,
    setOtp,
    otpSent,
    
    // Loading states
    isSendingOTP,
    isVerifyingOTP,
    isSendingMagicLink,
    
    // Actions
    handleSendOTP,
    handleVerifyOTP,
    handleSendMagicLink,
    resetState,
  };
};