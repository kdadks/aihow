import { useCallback } from 'react';
import { useAdminAuthContext } from '../context/AdminAuthContext';
import type { AdminUser } from '../types/adminAuth';

export const useAdminAuth = () => {
  const {
    state,
    login,
    logout,
    verifyMFA,
    refreshSession,
    updateSessionActivity,
    checkPermission
  } = useAdminAuthContext();

  const getAdmin = useCallback((): AdminUser | null => {
    return state.admin;
  }, [state.admin]);

  const getIsAuthenticated = useCallback((): boolean => {
    return state.isAuthenticated;
  }, [state.isAuthenticated]);

  const hasPermission = useCallback((permission: string): boolean => {
    return checkPermission(permission);
  }, [checkPermission]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('[useAdminAuth] Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('[useAdminAuth] Logout error:', error);
      throw error;
    }
  };

  const handleVerifyMFA = async (code: string) => {
    try {
      await verifyMFA(code);
    } catch (error) {
      console.error('[useAdminAuth] MFA verification error:', error);
      throw error;
    }
  };

  const handleRefreshSession = async () => {
    try {
      await refreshSession();
    } catch (error) {
      console.error('[useAdminAuth] Session refresh error:', error);
      throw error;
    }
  };

  const handleUpdateSessionActivity = () => {
    try {
      updateSessionActivity();
    } catch (error) {
      console.error('[useAdminAuth] Session activity update error:', error);
    }
  };

  return {
    admin: getAdmin(),
    isAuthenticated: getIsAuthenticated(),
    hasPermission,
    login: handleLogin,
    logout: handleLogout,
    verifyMFA: handleVerifyMFA,
    refreshSession: handleRefreshSession,
    updateSessionActivity: handleUpdateSessionActivity,
    sessionInfo: state.sessionInfo,
    permissions: state.permissions,
    state
  };
};