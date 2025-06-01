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
    console.log('[AdminAuthContext] Checking existing session...');
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log('[AdminAuthContext] Found existing session, processing...');
      await handleAuthChange('SIGNED_IN', session);
    } else {
      console.log('[AdminAuthContext] No existing session found');
    }
  };

  const handleAuthChange = async (event: string, session: Session | null): Promise<void> => {
    console.log('[AdminAuthContext] Auth state change:', event, session?.user?.id);
    
    if (event === 'SIGNED_IN' && session) {
      // Get profile data first
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profileData) {
        console.error('[AdminAuthContext] Failed to fetch user profile:', profileError);
        await handleLogout();
        return;
      }

      console.log('[AdminAuthContext] Profile data fetched:', profileData);

      // Get user roles with simplified query
      const { data: userRolesData, error: userRolesError } = await supabase
        .from('user_roles')
        .select(`
          roles (
            id,
            name
          )
        `)
        .eq('user_id', session.user.id);

      if (userRolesError) {
        console.error('[AdminAuthContext] Failed to fetch user roles:', userRolesError);
        await handleLogout();
        return;
      }

      console.log('[AdminAuthContext] User roles data:', userRolesData);

      // Extract role data
      const firstRole = userRolesData?.[0]?.roles;
      const userRole = (firstRole as any)?.name as AdminRole || 'content_admin';
      
      console.log('[AdminAuthContext] User role determined:', userRole);

      // Get permissions separately if role exists - simplified approach
      let userPermissions: string[] = [];
      
      // Use fallback permissions based on role for now
      if (userRole === 'admin') {
        userPermissions = ['admin_access', 'user_management', 'content_management', 'system_settings'];
      } else if (userRole === 'content_admin') {
        userPermissions = ['content_management'];
      } else if (userRole === 'system_admin') {
        userPermissions = ['admin_access', 'user_management', 'content_management', 'system_settings', 'system_admin'];
      }

      console.log('[AdminAuthContext] User permissions:', userPermissions);

      const adminUser: AdminUser = {
        id: profileData.id,
        email: session.user.email!,
        firstName: profileData.full_name?.split(' ')[0] || '',
        lastName: profileData.full_name?.split(' ').slice(1).join(' ') || '',
        role: userRole,
        permissions: userPermissions,
        lastLogin: new Date(session.user.last_sign_in_at || Date.now()),
        securityLevel: userRole === 'admin' ? 2 : 1
      };

      console.log('[AdminAuthContext] Setting admin user state:', adminUser);

      setState({
        admin: adminUser,
        isAuthenticated: true,
        permissions: userPermissions,
        sessionInfo: {
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          lastActive: new Date()
        }
      });
    } else {
      console.log('[AdminAuthContext] Signing out or no session');
      setState(defaultState);
    }
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      console.log('[AdminAuthContext] Starting login process for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('[AdminAuthContext] Login error:', error);
        throw error;
      }

      console.log('[AdminAuthContext] Login successful, user ID:', data.user?.id);

      // Check if user has admin role
      console.log('[AdminAuthContext] Checking admin role for user:', data.user?.id);
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', data.user?.id)
        .single();
      
      console.log('[AdminAuthContext] Role query result:', { roleData, roleError });

      if (roleError || !roleData || !roleData.roles) {
        console.error('[AdminAuthContext] Failed to fetch user role or user has no role');
        throw new Error('Failed to fetch user role');
      }

      const validRoles = ['admin', 'system_admin', 'content_admin'];
      if (!validRoles.includes((roleData.roles as any).name)) {
        console.error('[AdminAuthContext] User does not have admin privileges, role:', (roleData.roles as any).name);
        throw new Error('User does not have admin privileges');
      }

      console.log('[AdminAuthContext] User has valid admin role:', (roleData.roles as any).name);

      // Check if MFA is required for super admin
      if ((roleData.roles as any).name === 'admin' || (roleData.roles as any).name === 'system_admin') {
        const factorId = data.user?.factors?.[0]?.id;
        
        // Only require MFA if it's set up for the user
        if (factorId) {
          console.log('[AdminAuthContext] MFA required, setting up challenge');
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
        } else {
          // Log warning but allow login without MFA for development/testing
          console.warn('[AdminAuthContext] MFA not configured for admin user. Consider setting up MFA for enhanced security.');
        }
      }

      // Ensure the auth state change handler gets called
      // This is important for proper state management
      if (data.session) {
        console.log('[AdminAuthContext] Processing session after login');
        await handleAuthChange('SIGNED_IN', data.session);
      }
      
      console.log('[AdminAuthContext] Login process completed successfully');
    } catch (error) {
      console.error('[AdminAuthContext] Login error:', error);
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