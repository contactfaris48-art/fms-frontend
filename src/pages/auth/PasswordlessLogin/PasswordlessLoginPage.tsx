import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePasswordlessAuth } from '@/hooks/common';
import OTPInput from '@/components/auth/OTPInput';
import { ROUTES } from '@/utils/constants';

/**
 * Passwordless Login Page
 * Supports both OTP and Magic Link authentication
 */
export const PasswordlessLoginPage: React.FC = () => {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    otpSent,
    isSendingOTP,
    isVerifyingOTP,
    isSendingMagicLink,
    handleSendOTP,
    handleVerifyOTP,
    handleSendMagicLink,
    resetState,
  } = usePasswordlessAuth();

  const [authMethod, setAuthMethod] = useState<'otp' | 'magic-link'>('otp');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMethod === 'otp') {
      if (!otpSent) {
        await handleSendOTP();
      } else {
        await handleVerifyOTP();
      }
    } else {
      await handleSendMagicLink();
    }
  };

  const handleChangeEmail = () => {
    resetState();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Passwordless Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Login without a password using OTP or Magic Link
          </p>
        </div>

        {/* Auth Method Selector */}
        <div className="flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              resetState();
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-lg border ${
              authMethod === 'otp'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            OTP Code
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('magic-link');
              resetState();
            }}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-lg border ${
              authMethod === 'magic-link'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Magic Link
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Email Input */}
            {!otpSent && (
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  disabled={isSendingOTP || isSendingMagicLink}
                />
              </div>
            )}

            {/* OTP Input (only for OTP method) */}
            {authMethod === 'otp' && otpSent && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-sm font-medium text-gray-900">{email}</p>
                  <button
                    type="button"
                    onClick={handleChangeEmail}
                    className="text-sm text-blue-600 hover:text-blue-500 mt-1"
                  >
                    Change email
                  </button>
                </div>
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  onComplete={handleVerifyOTP}
                  disabled={isVerifyingOTP}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSendingOTP || isVerifyingOTP || isSendingMagicLink}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingOTP || isSendingMagicLink
                ? 'Sending...'
                : isVerifyingOTP
                ? 'Verifying...'
                : authMethod === 'otp'
                ? otpSent
                  ? 'Verify OTP'
                  : 'Send OTP'
                : 'Send Magic Link'}
            </button>
          </div>

          {/* Magic Link Success Message */}
          {authMethod === 'magic-link' && email && !isSendingMagicLink && (
            <div className="text-center">
              <p className="text-sm text-green-600">
                ✓ Check your email for the magic link
              </p>
            </div>
          )}

          {/* Back to Login */}
          <div className="text-center">
            <Link
              to={ROUTES.LOGIN}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to traditional login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordlessLoginPage;