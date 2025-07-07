import { useCallback } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';
import type { AdminUser } from '../types/adminAuth';

export const useAdminAuth = () => {
  const authContext = useAuth();
  const {
    user,
    profile,
    permissions,
    isAdmin,
    hasPermission: authHasPermission,
    signIn,
    signOut,
    refreshAuth
  } = authContext;

  const isUserAuthenticated = user && isAdmin;
  
  const state = {
    admin: user ? {
      id: user.id,
      email: user.email || '',
      firstName: profile?.full_name?.split(' ')[0] || '',
      lastName: profile?.full_name?.split(' ').slice(1).join(' ') || '',
      role: 'admin' as any,
      permissions: permissions.map(p => p.name),
      lastLogin: new Date(),
      securityLevel: 2
    } as AdminUser : null,
    isAuthenticated: !!isUserAuthenticated,
    permissions: permissions.map(p => p.name),
    sessionInfo: {
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      lastActive: new Date()
    }
  };

  const login = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.error) {
      throw new Error(result.error.message);
    }
    if (!isAdmin) {
      throw new Error('User does not have admin privileges');
    }
  };

  const logout = async () => {
    await signOut();
  };

  const verifyMFA = async (code: string) => {
    // MFA verification would be handled by the unified auth context
    // For now, this is a placeholder
    console.log('MFA verification not yet implemented in unified auth');
  };

  const refreshSession = async () => {
    await refreshAuth();
  };

  const updateSessionActivity = () => {
    // Session activity tracking would be handled by the unified auth context
    console.log('Session activity tracking not yet implemented in unified auth');
  };

  const checkPermission = (permission: string) => {
    return authHasPermission(permission);
  };

  const getAdmin = useCallback((): AdminUser | null => {
    return state.admin;
  }, [state.admin]);

  const getIsAuthenticated = useCallback((): boolean => {
    return state.isAuthenticated;
  }, [state.isAuthenticated]);

  const hasPermission = useCallback((permission: string): boolean => {
    return checkPermission(permission);
  }, [checkPermission]);

  return {
    admin: getAdmin(),
    isAuthenticated: getIsAuthenticated(),
    hasPermission,
    login,
    logout,
    verifyMFA,
    refreshSession,
    updateSessionActivity,
    sessionInfo: state.sessionInfo
  };
};