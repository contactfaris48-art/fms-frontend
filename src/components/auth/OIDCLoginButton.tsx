import React from 'react';
import { API_BASE_URL } from '@/utils/constants';

interface OIDCLoginButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * OIDC Login Button Component
 * Redirects to backend OIDC login endpoint (Cognito Hosted UI)
 */
export const OIDCLoginButton: React.FC<OIDCLoginButtonProps> = ({
  className = '',
  children = 'Login with SSO',
}) => {
  const handleOIDCLogin = () => {
    // Redirect to backend OIDC login endpoint
    window.location.href = `${API_BASE_URL}/auth/oidc/login`;
  };

  return (
    <button
      type="button"
      onClick={handleOIDCLogin}
      className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z"
          clipRule="evenodd"
        />
      </svg>
      {children}
    </button>
  );
};

export default OIDCLoginButton;