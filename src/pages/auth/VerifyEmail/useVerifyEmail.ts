import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useConfirmSignupMutation, useResendVerificationMutation } from '@/store/api/authApi';
import { useToast } from '@/hooks/common';
import { ROUTES } from '@/utils/constants';
import { ErrorHandler } from '@/utils/errors';

/**
 * Hook for email verification page logic
 * Handles OTP verification with backend API
 */
export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const email = location.state?.email || searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [confirmSignup, { isLoading: isVerifying }] = useConfirmSignupMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();
  const [hasError, setHasError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate(ROUTES.LOGIN);
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerifyOTP = async (code: string) => {
    if (code.length !== 6) return;

    setHasError(false);

    try {
      // Backend endpoint: POST /auth/confirm-signup
      const response = await confirmSignup({ email, code }).unwrap();
        
      toast.success(response.message || 'Email verified successfully! 🎉');
      
      // Redirect to login page after successful verification
      navigate(ROUTES.LOGIN);
    } catch (error) {
      setHasError(true);
      setOtp('');
      
      const appError = ErrorHandler.handle(error, {
        operation: 'Email verification',
        defaultMessage: 'Verification failed',
        statusMessages: {
          401: 'Invalid or expired verification code',
        },
      });
      
      toast.error(appError.message);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || isResending) return;

    try {
      const response = await resendVerification({ email }).unwrap();
      
      toast.success(response.message || 'Verification code resent successfully!');
      setCountdown(60);
      setCanResend(false);
      setOtp('');
      setHasError(false);
    } catch (error) {
      const appError = ErrorHandler.handle(error, {
        operation: 'Resend verification',
        defaultMessage: 'Failed to resend code',
        statusMessages: {
          429: 'Too many requests. Please try again later',
        },
      });
      
      toast.error(appError.message);
    }
  };

  return {
    email,
    otp,
    setOtp,
    isVerifying,
    isResending,
    hasError,
    countdown,
    canResend,
    handleVerifyOTP,
    handleResendCode,
  };
};