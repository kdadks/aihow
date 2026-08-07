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
    try {
      console.log('[AdminAuthContext] Auth state change:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('[AdminAuthContext] Processing SIGNED_IN event for session:', session.user.id);
        
        // Get profile data with timeout to prevent hanging
        console.log('[AdminAuthContext] Fetching profile data...');
        
      console.log('[AdminAuthContext] Starting profile and role lookup for user:', session.user.id);
      
      let profile: any = null;
      let userRole = 'admin';

      // Try RPC function first (if migration is applied), fall back to direct query
      try {
        console.log('[AdminAuthContext] Attempting RPC function for profile...');
        const { data: rpcProfileData, error: rpcError } = await supabase.rpc('get_admin_profile', {
          user_id: session.user.id
        });

        if (!rpcError && rpcProfileData?.[0]) {
          profile = rpcProfileData[0];
          console.log('[AdminAuthContext] RPC profile fetch successful:', profile);
        } else if (rpcError) {
          console.warn('[AdminAuthContext] RPC profile fetch failed, falling back to direct query:', rpcError);
          // Fall back to direct query
          const { data: directProfile } = await supabase
            .from('profiles')
            .select('id, username, full_name')
            .eq('id', session.user.id)
            .single();
          profile = directProfile;
        }
      } catch (err: any) {
        console.warn('[AdminAuthContext] RPC call failed, using fallback:', err.message);
        // Use fallback
      }

      if (!profile) {
        console.log('[AdminAuthContext] Using fallback profile data from session');
        profile = {
          id: session.user.id,
          username: session.user.email?.split('@')[0],
          full_name: session.user.email?.split('@')[0] || 'Admin User',
          email: session.user.email
        };
      }

      console.log('[AdminAuthContext] Profile data resolved:', profile);

      // Try RPC for role lookup, fall back to direct query
      try {
        console.log('[AdminAuthContext] Attempting RPC function for role...');
        const { data: rpcRoleData, error: rpcError } = await supabase.rpc('get_admin_user_role', {
          user_id: session.user.id
        });

        if (!rpcError && rpcRoleData?.[0]) {
          userRole = rpcRoleData[0].role_name || 'admin';
          console.log('[AdminAuthContext] RPC role fetch successful:', userRole);
        } else if (rpcError) {
          console.warn('[AdminAuthContext] RPC role fetch failed, falling back to direct query:', rpcError);
          // Fall back to direct query
          const { data: roleAssignment } = await supabase
            .from('user_roles')
            .select('role_id')
            .eq('user_id', session.user.id)
            .single();

          if (roleAssignment?.role_id) {
            const { data: roleData } = await supabase
              .from('roles')
              .select('name')
              .eq('id', roleAssignment.role_id)
              .single();
            userRole = roleData?.name || 'admin';
          }
        }
      } catch (err: any) {
        console.warn('[AdminAuthContext] Role lookup failed, using fallback admin role:', err.message);
        userRole = 'admin';
      }

      console.log('[AdminAuthContext] User role determined:', userRole);

      // Validate that user has admin privileges
      const validAdminRoles = ['admin', 'system_admin', 'content_admin'];
      if (!validAdminRoles.includes(userRole)) {
        console.error('[AdminAuthContext] User does not have admin privileges, role:', userRole);
        await handleLogout();
        return;
      }

      const adminRole = userRole as AdminRole;
      
      console.log('[AdminAuthContext] User role determined:', adminRole);

      // Default permissions for admin
      const userPermissions = ['canManageUsers', 'canManageContent', 'canModerateContent', 'canManageSettings', 'canViewMetrics'];

      console.log('[AdminAuthContext] User permissions:', userPermissions);

      const adminUser: AdminUser = {
        id: profile.id,
        email: session.user.email!,
        firstName: profile.full_name?.split(' ')[0] || '',
        lastName: profile.full_name?.split(' ').slice(1).join(' ') || '',
        role: adminRole,
        permissions: userPermissions,
        lastLogin: new Date(session.user.last_sign_in_at || Date.now()),
        securityLevel: adminRole === 'admin' ? 2 : 1
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
      
      console.log('[AdminAuthContext] Admin state set successfully, isAuthenticated:', true);
    } else {
      console.log('[AdminAuthContext] Signing out or no session, event:', event, 'has session:', !!session);
      setState(defaultState);
    }
    } catch (error) {
      console.error('[AdminAuthContext] Error in handleAuthChange:', error);
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

      // Check if user has admin role using robust role checking
      console.log('[AdminAuthContext] Checking admin role for user:', authData.user?.id);
      
      let roleData: any = null;
      let userRoleName: string = '';

      console.log('[AdminAuthContext] Starting login role lookup...');

      // Try user_roles table
      const { data: roleAssignmentData, error: roleAssignmentError } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', authData.user?.id)
        .single();

      console.log('[AdminAuthContext] Login user_roles query result:', { roleAssignmentData, roleAssignmentError });

      if (!roleAssignmentError && roleAssignmentData) {
        const { data: newRoleData, error: newRoleError } = await supabase
          .from('roles')
          .select('name, permissions')
          .eq('id', roleAssignmentData.role_id)
          .single();

        console.log('[AdminAuthContext] Login new role data query result:', { newRoleData, newRoleError });

        if (!newRoleError && newRoleData) {
          roleData = newRoleData;
          userRoleName = newRoleData.name;
        }
      }

      // Try legacy schema if new schema failed
      if (!roleData) {
        console.log('[AdminAuthContext] Login trying legacy schema...');
        const { data: legacyRoleData, error: legacyRoleError } = await supabase
          .from('user_roles')
          .select('roles(name)')
          .eq('user_id', authData.user?.id)
          .single();

        console.log('[AdminAuthContext] Login legacy schema query result:', { legacyRoleData, legacyRoleError });

        if (!legacyRoleError && legacyRoleData?.roles) {
          const rolesArray = Array.isArray(legacyRoleData.roles) ? legacyRoleData.roles[0] : legacyRoleData.roles;
          userRoleName = rolesArray.name;
          roleData = { name: userRoleName };
        }
      }

      // Try direct role assignment
      if (!roleData) {
        console.log('[AdminAuthContext] Login trying direct role assignment...');
        const { data: directRoleData, error: directRoleError } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', authData.user?.id)
          .single();

        console.log('[AdminAuthContext] Login direct role assignment query result:', { directRoleData, directRoleError });

        if (!directRoleError && directRoleData && directRoleData.name) {
          userRoleName = directRoleData.name;
          roleData = directRoleData;
        }
      }

      console.log('[AdminAuthContext] Login final role determination:', { roleData, userRoleName });

      if (!roleData || !userRoleName) {
        console.error('[AdminAuthContext] Failed to fetch user role from any schema');
        throw new Error('Failed to fetch user role');
      }

      const validRoles = ['admin', 'system_admin', 'content_admin'];
      if (!validRoles.includes(userRoleName)) {
        console.error('[AdminAuthContext] User does not have admin privileges, role:', userRoleName);
        throw new Error('User does not have admin privileges');
      }

      console.log('[AdminAuthContext] User has valid admin role:', userRoleName);

      // Check if MFA is required for super admin
      if (userRoleName === 'admin' || userRoleName === 'system_admin') {
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

      // Note: handleAuthChange will be automatically called by the auth state listener
      // No need to call it explicitly here
      console.log('[AdminAuthContext] Login process completed, auth listener will handle state update');
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
    console.log('[AdminAuthContext] Logout initiated');
    try {
      // Sign out using Supabase native session management
      console.log('[AdminAuthContext] Calling Supabase signOut...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AdminAuthContext] Supabase signOut error:', error);
      } else {
        console.log('[AdminAuthContext] Supabase signOut successful');
      }
    } catch (error) {
      console.error('[AdminAuthContext] Logout error:', error);
    } finally {
      // Always reset state, even if signOut fails
      console.log('[AdminAuthContext] Resetting admin state');
      setState(defaultState);
      // Force a small delay to ensure state is cleared before any navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('[AdminAuthContext] Logout completed');
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
      // Update session activity in memory only
      // Supabase handles session persistence natively
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
