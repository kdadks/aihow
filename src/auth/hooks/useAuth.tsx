import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { formatAuthError } from '../utils/authHelpers';
import { UserProfile } from '../types';

export function useAuth() {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      await auth.login(email, password);
      
      // Handle redirect after successful login
      const params = new URLSearchParams(location.search);
      const returnTo = params.get('returnTo');
      
      if (returnTo) {
        navigate(decodeURIComponent(returnTo));
      } else {
        navigate('/');
      }
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }, [auth.login, navigate, location]);

  const handleRegister = useCallback(async (
    email: string, 
    password: string, 
    username?: string
  ) => {
    try {
      await auth.register(email, password, username);
      navigate('/onboarding');
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }, [auth.register, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await auth.logout();
      navigate('/login');
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }, [auth.logout, navigate]);

  const handleUpdateProfile = useCallback(async (profile: Partial<UserProfile>) => {
    try {
      await auth.updateProfile(profile);
    } catch (error) {
      throw new Error(formatAuthError(error));
    }
  }, [auth.updateProfile]);

  return {
    // Auth state
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: !!auth.user,
    
    // Auth methods with navigation handling
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    
    // Role and permission checks
    hasRole: auth.hasRole,
    hasPermission: auth.hasPermission,
    
    // Additional helper
    checkAuth: auth.checkAuth,
  };
}