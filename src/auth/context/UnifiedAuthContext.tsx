import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

// Types
interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: number;
  name: string;
  description?: string;
  level: number;
  assigned_at: string;
}

interface UserPermission {
  name: string;
  category: string;
  description?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  roles: UserRole[];
  permissions: UserPermission[];
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  maxRoleLevel: number;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ data: any; error: any }>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roleName: string) => boolean;
  hasMinimumRoleLevel: (level: number) => boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    roles: [],
    permissions: [],
    session: null,
    isLoading: true,
    isAdmin: false,
    isModerator: false,
    maxRoleLevel: 1,
  });

  // Load user profile, roles, and permissions
  const loadUserData = async (user: User) => {
    let profile: any = null;
    
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError);
      } else {
        profile = profileData;
      }

      // Try to use database helper functions, fallback to basic setup if they don't exist
      let userRoleNames: string[] = [];
      let userPermissionNames: string[] = [];

      try {
        const { data: roleData, error: rolesError } = await supabase
          .rpc('get_user_roles', { user_id: user.id });

        if (!rolesError && roleData) {
          userRoleNames = roleData;
        } else {
          console.warn('Helper function get_user_roles not available, using default role');
          userRoleNames = ['user']; // Default role
        }
      } catch (error) {
        console.warn('Helper function get_user_roles failed, using default role:', error);
        userRoleNames = ['user']; // Default role
      }

      try {
        const { data: permissionData, error: permissionsError } = await supabase
          .rpc('get_user_permissions', { user_id: user.id });

        if (!permissionsError && permissionData) {
          userPermissionNames = permissionData;
        } else {
          console.warn('Helper function get_user_permissions not available, using default permissions');
          userPermissionNames = []; // Default empty permissions
        }
      } catch (error) {
        console.warn('Helper function get_user_permissions failed, using default permissions:', error);
        userPermissionNames = []; // Default empty permissions
      }

      // Process roles - helper function returns array of role names
      const roles: UserRole[] = (userRoleNames || []).map((roleName: string) => ({
        id: 0, // We don't need the ID for the simplified version
        name: roleName,
        description: '',
        level: roleName === 'super_admin' ? 5 : roleName === 'admin' ? 4 : roleName === 'system_admin' ? 4 : roleName === 'content_admin' ? 3 : roleName === 'moderator' ? 2 : 1,
        assigned_at: new Date().toISOString()
      }));

      // Process permissions - helper function returns array of permission names
      const permissions: UserPermission[] = (userPermissionNames || []).map((permissionName: string) => ({
        name: permissionName,
        category: permissionName.split(':')[0] || 'general'
      }));

      // Calculate derived values
      const maxRoleLevel = roles.length > 0 ? Math.max(...roles.map(r => r.level)) : 1;
      const isAdmin = maxRoleLevel >= 3; // admin or super_admin
      const isModerator = maxRoleLevel >= 2; // moderator, admin, or super_admin

      setState(prev => ({
        ...prev,
        user,
        profile,
        roles,
        permissions,
        maxRoleLevel,
        isAdmin,
        isModerator,
        isLoading: false,
      }));

    } catch (error) {
      console.error('Error loading user data:', error);
      // Set basic user data even if role/permission loading fails
      setState(prev => ({
        ...prev,
        user,
        profile: profile || null,
        roles: [{ id: 0, name: 'user', description: '', level: 1, assigned_at: new Date().toISOString() }],
        permissions: [],
        maxRoleLevel: 1,
        isAdmin: false,
        isModerator: false,
        isLoading: false,
      }));
    }
  };

  // Clear user data
  const clearUserData = () => {
    setState({
      user: null,
      profile: null,
      roles: [],
      permissions: [],
      session: null,
      isLoading: false,
      isAdmin: false,
      isModerator: false,
      maxRoleLevel: 1,
    });
  };

  // Auth functions
  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return result;
  };

  const signUp = async (email: string, password: string, userData?: Partial<UserProfile>) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return result;
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      // Clear user data immediately for better UX
      clearUserData();
      
      console.log('Successfully signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      // Clear user data even if signOut fails to ensure user is logged out locally
      clearUserData();
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const resetPassword = async (email: string) => {
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return result;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) {
      return { data: null, error: { message: 'No user logged in' } };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.user.id)
      .select()
      .single();

    if (!error && data) {
      setState(prev => ({ ...prev, profile: data }));
    }

    return { data, error };
  };

  const hasPermission = (permission: string): boolean => {
    return state.permissions.some(p => p.name === permission);
  };

  const hasRole = (roleName: string): boolean => {
    return state.roles.some(r => r.name === roleName);
  };

  const hasMinimumRoleLevel = (level: number): boolean => {
    return state.maxRoleLevel >= level;
  };

  const refreshAuth = async () => {
    if (state.user) {
      await loadUserData(state.user);
    }
  };

  // Handle auth state changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setState(prev => ({ ...prev, session }));
        await loadUserData(session.user);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setState(prev => ({ ...prev, session }));

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Processing SIGNED_IN event');
          try {
            await loadUserData(session.user);
          } catch (error) {
            console.error('Error loading user data on SIGNED_IN:', error);
            // Don't clear user data, just log the error
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('Processing SIGNED_OUT event');
          clearUserData();
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Processing TOKEN_REFRESHED event');
          try {
            // Refresh user data on token refresh, but don't fail if it doesn't work
            await loadUserData(session.user);
          } catch (error) {
            console.warn('Error refreshing user data on token refresh:', error);
            // Don't logout the user just because data refresh failed
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Handle profile updates after user signup
  useEffect(() => {
    if (state.user && !state.profile) {
      // Create initial profile if it doesn't exist
      const createInitialProfile = async () => {
        const { error } = await supabase
          .from('profiles')
          .insert([
            {
              id: state.user!.id,
              username: state.user!.email?.split('@')[0] || null,
              full_name: state.user!.user_metadata?.full_name || null,
              avatar_url: state.user!.user_metadata?.avatar_url || null,
            },
          ]);

        if (error) {
          console.error('Error creating initial profile:', error);
        } else {
          // Reload user data after creating profile
          await loadUserData(state.user!);
        }
      };

      createInitialProfile();
    }
  }, [state.user, state.profile]);

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    hasPermission,
    hasRole,
    hasMinimumRoleLevel,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Higher-order component for role-based access control
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requireAuth?: boolean;
    requireRole?: string;
    requirePermission?: string;
    minimumRoleLevel?: number;
    fallback?: React.ComponentType;
  } = {}
) => {
  const {
    requireAuth = true,
    requireRole,
    requirePermission,
    minimumRoleLevel,
    fallback: Fallback,
  } = options;

  return (props: P) => {
    const auth = useAuth();

    if (auth.isLoading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (requireAuth && !auth.user) {
      return Fallback ? <Fallback {...props} /> : <div>Please log in to access this page.</div>;
    }

    if (requireRole && !auth.hasRole(requireRole)) {
      return Fallback ? <Fallback {...props} /> : <div>You don't have permission to access this page.</div>;
    }

    if (requirePermission && !auth.hasPermission(requirePermission)) {
      return Fallback ? <Fallback {...props} /> : <div>You don't have permission to access this page.</div>;
    }

    if (minimumRoleLevel && !auth.hasMinimumRoleLevel(minimumRoleLevel)) {
      return Fallback ? <Fallback {...props} /> : <div>You don't have sufficient privileges to access this page.</div>;
    }

    return <Component {...props} />;
  };
};

// Hook for checking permissions
export const usePermissions = () => {
  const auth = useAuth();
  
  return {
    hasPermission: auth.hasPermission,
    hasRole: auth.hasRole,
    hasMinimumRoleLevel: auth.hasMinimumRoleLevel,
    permissions: auth.permissions,
    roles: auth.roles,
    maxRoleLevel: auth.maxRoleLevel,
    isAdmin: auth.isAdmin,
    isModerator: auth.isModerator,
  };
};

export default AuthContext;
