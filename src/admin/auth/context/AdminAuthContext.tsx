import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminAuthState, AdminUser, AdminRole, ProfileWithRoles, RoleData } from '../types/adminAuth';
import { supabase } from '../../../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface AdminAuthContextType {
  state: AdminAuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyMFA: (code: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  updateSessionActivity: () => void;
  checkPermission: (permission: string) => boolean;
}

const defaultState: AdminAuthState = {
  admin: null,
  isAuthenticated: false,
  permissions: [],
  sessionInfo: {
    expiresAt: new Date(),
    lastActive: new Date()
  }
};

export const AdminAuthContext = createContext<AdminAuthContextType>({
  state: defaultState,
  login: async () => {},
  logout: async () => {},
  verifyMFA: async () => {},
  refreshSession: async () => {},
  updateSessionActivity: () => {},
  checkPermission: () => false
});

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AdminAuthState>(defaultState);
  const [pendingMFA, setPendingMFA] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaChallengeId, setMfaChallengeId] = useState<string | null>(null);

  useEffect(() => {
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async (): Promise<void> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      await handleAuthChange('SIGNED_IN', session);
    }
  };

  const handleAuthChange = async (event: string, session: Session | null): Promise<void> => {
    if (event === 'SIGNED_IN' && session) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          roles:user_roles!inner (
            role:roles!inner (
              name,
              permissions:role_permissions (
                permission:permissions (name)
              )
            )
          )
        `)
        .eq('id', session.user.id)
        .single() as { data: ProfileWithRoles | null, error: any };

      if (profileError || !profileData) {
        console.error('Failed to fetch admin profile:', profileError);
        await handleLogout();
        return;
      }

      const role = profileData.roles?.[0]?.role?.name as AdminRole || 'content_admin';
      const permissions = profileData.roles?.[0]?.role?.permissions?.map(p => p.permission.name) || [];

      const adminUser: AdminUser = {
        id: profileData.id,
        email: session.user.email!,
        firstName: profileData.full_name?.split(' ')[0] || '',
        lastName: profileData.full_name?.split(' ').slice(1).join(' ') || '',
        role,
        permissions,
        lastLogin: new Date(session.user.last_sign_in_at || Date.now()),
        securityLevel: role === 'admin' ? 2 : 1
      };

      setState({
        admin: adminUser,
        isAuthenticated: true,
        permissions: permissions,
        sessionInfo: {
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          lastActive: new Date()
        }
      });
    } else {
      setState(defaultState);
    }
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('roles:role_id(name)')
        .eq('user_id', data.user?.id)
        .single() as { data: RoleData | null, error: any };

      if (roleError || !roleData || !roleData.roles) {
        throw new Error('Failed to fetch user role');
      }

      const validRoles = ['admin', 'system_admin', 'content_admin'];
      if (!validRoles.includes(roleData.roles.name)) {
        throw new Error('User does not have admin privileges');
      }

      // Check if MFA is required for super admin
      if (roleData.roles.name === 'admin' || roleData.roles.name === 'system_admin') {
        const factorId = data.user?.factors?.[0]?.id;
        if (!factorId) {
          throw new Error('No MFA factor found for super admin');
        }

        const { data: mfaData, error: mfaError } = await supabase.auth.mfa.challenge({
          factorId
        });

        if (mfaError || !mfaData) {
          throw new Error('Failed to initialize MFA challenge');
        }

        setMfaFactorId(factorId);
        setMfaChallengeId(mfaData.id);
        setPendingMFA(true);
        throw new Error('MFA_REQUIRED');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleVerifyMFA = async (code: string): Promise<void> => {
    try {
      if (!mfaFactorId || !mfaChallengeId) {
        throw new Error('MFA session not initialized');
      }

      const { error } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: mfaChallengeId,
        code
      });

      if (error) throw error;

      setPendingMFA(false);
      setMfaFactorId(null);
      setMfaChallengeId(null);
    } catch (error) {
      console.error('MFA verification error:', error);
      throw error;
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      if (state.admin) {
        await supabase
          .from('admin_sessions')
          .update({ ended_at: new Date().toISOString() })
          .eq('admin_id', state.admin.id)
          .is('ended_at', null);
      }

      await supabase.auth.signOut();
      setState(defaultState);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const handleRefreshSession = async (): Promise<void> => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (session) {
        await handleAuthChange('SIGNED_IN', session);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
  };

  const handleUpdateSessionActivity = async (): Promise<void> => {
    if (!state.admin) return;

    try {
      const now = new Date();
      await supabase
        .from('admin_sessions')
        .update({ last_active: now.toISOString() })
        .eq('admin_id', state.admin.id)
        .is('ended_at', null);

      setState(prev => ({
        ...prev,
        sessionInfo: {
          ...prev.sessionInfo,
          lastActive: now
        }
      }));
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  };

  const checkPermission = (permission: string): boolean => {
    return state.permissions.includes(permission);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        state,
        login: handleLogin,
        logout: handleLogout,
        verifyMFA: handleVerifyMFA,
        refreshSession: handleRefreshSession,
        updateSessionActivity: handleUpdateSessionActivity,
        checkPermission
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuthContext = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuthContext must be used within an AdminAuthProvider');
  }
  return context;
};