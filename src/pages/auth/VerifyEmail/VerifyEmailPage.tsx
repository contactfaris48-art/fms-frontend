import { EnvelopeIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import OTPInput from '@/components/auth/OTPInput';
import { useVerifyEmail } from './useVerifyEmail';
import { ROUTES } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const {
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
  } = useVerifyEmail();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <EnvelopeIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Verify Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a 6-digit code to
            </p>
            <p className="font-medium text-gray-900">{email}</p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              autoFocus
              disabled={isVerifying}
              hasError={hasError}
              onComplete={handleVerifyOTP}
            />
          </div>

          {/* Loading State */}
          {isVerifying && (
            <div className="flex items-center justify-center gap-2 text-indigo-600 mb-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              <span className="text-sm font-medium">Verifying...</span>
            </div>
          )}

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendCode}
              disabled={!canResend || isResending}
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  Sending...
                </>
              ) : canResend ? (
                <>
                  <ArrowPathIcon className="h-4 w-4" />
                  Resend Code
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-4 w-4" />
                  Resend in {countdown}s
                </>
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-900">
              💡 <strong>Tip:</strong> Check your spam folder if you don't see the email. The code expires in 5 minutes.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to login
          </button>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}