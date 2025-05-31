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

  const isAuthenticated = useCallback((): boolean => {
    return state.isAuthenticated;
  }, [state.isAuthenticated]);

  const hasPermission = useCallback((permission: string): boolean => {
    return checkPermission(permission);
  }, [checkPermission]);

  return {
    admin: getAdmin(),
    isAuthenticated: isAuthenticated(),
    hasPermission,
    login,
    logout,
    verifyMFA,
    refreshSession,
    updateSessionActivity,
    sessionInfo: state.sessionInfo
  };
};