import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminAuthState, AdminUser, AdminRole } from '../types/adminAuth';
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

      // Get user's role and permissions using the new schema
      const { data: roleAssignmentData, error: roleAssignmentError } = await supabase
        .from('user_role_assignments')
        .select('role_id')
        .eq('user_id', session.user.id)
        .single();

      if (roleAssignmentError || !roleAssignmentData) {
        console.error('[AdminAuthContext] Failed to fetch user role assignment:', roleAssignmentError);
        await handleLogout();
        return;
      }

      // Now fetch the actual role data from user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('id, name, permissions')
        .eq('id', roleAssignmentData.role_id)
        .single();

      if (roleError || !roleData) {
        console.error('[AdminAuthContext] Failed to fetch role data:', roleError);
        await handleLogout();
        return;
      }

      console.log('[AdminAuthContext] User role data:', roleData);

      const userRole = roleData.name as AdminRole;
      
      console.log('[AdminAuthContext] User role determined:', userRole);

      // Get permissions from the role's permissions JSON
      let userPermissions: string[] = [];
      const permissions = roleData.permissions as Record<string, boolean>;
      
      // Convert permissions object to array of enabled permissions
      userPermissions = Object.entries(permissions)
        .filter(([_, enabled]) => enabled)
        .map(([permission]) => permission);

      console.log('[AdminAuthContext] User permissions:', userPermissions);

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
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        console.error('[AdminAuthContext] Login error:', authError);
        throw authError;
      }

      console.log('[AdminAuthContext] Login successful, user ID:', authData.user?.id);

      // Check if user has admin role using the new schema
      console.log('[AdminAuthContext] Checking admin role for user:', authData.user?.id);
      
      // First get the role assignment
      const { data: roleAssignmentData, error: roleAssignmentError } = await supabase
        .from('user_role_assignments')
        .select('role_id')
        .eq('user_id', authData.user?.id)
        .single();

      if (roleAssignmentError || !roleAssignmentData) {
        console.error('[AdminAuthContext] Failed to fetch user role assignment:', roleAssignmentError);
        throw new Error('Failed to fetch user role assignment');
      }

      // Then get the actual role data
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('name, permissions')
        .eq('id', roleAssignmentData.role_id)
        .single();

      if (roleError || !roleData) {
        console.error('[AdminAuthContext] Failed to fetch role data:', roleError);
        throw new Error('Failed to fetch role data');
      }

      const validRoles = ['admin', 'system_admin', 'content_admin'];
      if (!validRoles.includes(roleData.name)) {
        console.error('[AdminAuthContext] User does not have admin privileges, role:', roleData.name);
        throw new Error('User does not have admin privileges');
      }

      console.log('[AdminAuthContext] User has valid admin role:', roleData.name);

      // Check if MFA is required for super admin
      if (roleData.name === 'admin' || roleData.name === 'system_admin') {
        const factorId = authData.user?.factors?.[0]?.id;
        
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
      if (authData.session) {
        console.log('[AdminAuthContext] Processing session after login');
        await handleAuthChange('SIGNED_IN', authData.session);
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
