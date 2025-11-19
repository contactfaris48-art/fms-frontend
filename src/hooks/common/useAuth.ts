import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { ROUTES } from '@/utils/constants';

/**
 * Common authentication hook
 * Provides authentication state and utilities
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);

  const login = (
    userData: any,
    tokenData: string,
    refreshToken: string,
    idToken?: string
  ) => {
    dispatch(
      setCredentials({
        user: userData,
        token: tokenData,
        refreshToken,
        ...(idToken && { idToken }),
      })
    );
  };

  const signOut = () => {
    dispatch(logout());
  };

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isUser,
    login,
    signOut,
  };
};

/**
 * Hook to redirect authenticated users
 * @param redirectTo - Route to redirect to if authenticated
 */
export const useRedirectIfAuthenticated = (redirectTo: string = ROUTES.DASHBOARD) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);
};

/**
 * Hook to require authentication
 * @param redirectTo - Route to redirect to if not authenticated
 */
export const useRequireAuth = (redirectTo: string = ROUTES.LOGIN) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo);
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return { isAuthenticated };
};