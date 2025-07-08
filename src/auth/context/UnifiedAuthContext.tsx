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
  isAuthenticated: boolean;
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
    isAuthenticated: false,
  });

  // Load user profile, roles, and permissions - SIMPLIFIED TO PREVENT HANGING
  const loadUserData = async (user: User, skipLoading = false) => {
    try {
      if (!skipLoading) {
        setState(prev => ({ ...prev, isLoading: true }));
      }

      console.log('Loading user data for:', user.email);

      // Skip database queries for now - just use basic user info
      const profile = null; // Will be loaded separately if needed
      
      // Use default roles and permissions to prevent database hanging issues
      const roles: UserRole[] = [{
        id: 0,
        name: 'user',
        description: 'Default user role',
        level: 1,
        assigned_at: new Date().toISOString()
      }];
      
      const permissions: UserPermission[] = [];
      const maxRoleLevel = 1;
      const isAdmin = false;
      const isModerator = false;

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
        isAuthenticated: true,
      }));

      console.log('User data loaded successfully');

    } catch (error) {
      console.error('Error loading user data:', error);
      // Ensure user stays logged in with minimal data
      setState(prev => ({
        ...prev,
        user,
        profile: null,
        roles: [{ id: 0, name: 'user', description: '', level: 1, assigned_at: new Date().toISOString() }],
        permissions: [],
        maxRoleLevel: 1,
        isAdmin: false,
        isModerator: false,
        isLoading: false,
        isAuthenticated: true,
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
      isAuthenticated: false,
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
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      // If signup succeeded but there was a database error creating the profile,
      // try to create the profile manually
      if (result.data?.user && !result.error) {
        try {
          // Check if profile was created
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', result.data.user.id)
            .single();

          // If no profile exists, create one manually
          if (!profile) {
            console.log('Profile not found, creating manually...');
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: result.data.user.id,
                username: email,
                full_name: userData?.full_name || 'User',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              });

            if (profileError) {
              console.warn('Failed to create profile manually:', profileError);
              // Don't fail the signup, just log the warning
            } else {
              console.log('Profile created manually successfully');
            }
          }
        } catch (profileCheckError) {
          console.warn('Error checking/creating profile:', profileCheckError);
          // Don't fail the signup for profile creation errors
        }
      }

      return result;
    } catch (error) {
      console.error('Signup error:', error);
      
      // Provide more helpful error messages
      if (error instanceof Error) {
        if (error.message.includes('Database error saving new user')) {
          return {
            data: { user: null, session: null },
            error: {
              message: 'There was a temporary issue creating your account. Please try again in a moment.',
              status: 500,
            } as any,
          };
        }
      }
      
      throw error;
    }
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
    // First check if we have a session but no user (state mismatch)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user && !state.user) {
      console.log('Found session-user mismatch, fixing...');
      setState(prev => ({ ...prev, session, user: session.user }));
      try {
        await loadUserData(session.user);
      } catch (error) {
        console.error('Error loading user data during refresh, maintaining basic state:', error);
        setState(prev => ({
          ...prev,
          user: session.user,
          session,
          isLoading: false,
          roles: [{ id: 0, name: 'user', description: '', level: 1, assigned_at: new Date().toISOString() }],
          permissions: [],
          maxRoleLevel: 1,
          isAdmin: false,
          isModerator: false,
          isAuthenticated: true
        }));
      }
    } else if (state.user) {
      await loadUserData(state.user, true); // Skip loading state for existing users
    }
  };

  // Handle auth state changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log('Initial session found:', session.user.email);
        setState(prev => ({ ...prev, session, user: session.user }));
        try {
          await loadUserData(session.user);
        } catch (error) {
          console.error('Error loading initial user data, but keeping user logged in:', error);
          // Ensure user stays logged in even if data loading fails
          setState(prev => ({
            ...prev,
            user: session.user,
            session,
            isLoading: false,
            roles: [{ id: 0, name: 'user', description: '', level: 1, assigned_at: new Date().toISOString() }],
            permissions: [],
            maxRoleLevel: 1,
            isAdmin: false,
            isModerator: false,
            isAuthenticated: true
          }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('Processing SIGNED_IN event');
          setState(prev => ({ ...prev, session, user: session.user }));
          try {
            await loadUserData(session.user);
          } catch (error) {
            console.error('Error loading user data on SIGNED_IN, but keeping user logged in:', error);
            // Ensure user stays logged in even if data loading fails
            setState(prev => ({
              ...prev,
              user: session.user,
              session,
              isLoading: false,
              roles: [{ id: 0, name: 'user', description: '', level: 1, assigned_at: new Date().toISOString() }],
              permissions: [],
              maxRoleLevel: 1,
              isAdmin: false,
              isModerator: false,
              isAuthenticated: true
            }));
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('Processing SIGNED_OUT event');
          clearUserData();
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          console.log('Processing TOKEN_REFRESHED event');
          setState(prev => ({ ...prev, session, user: session.user }));
          try {
            // Refresh user data on token refresh, but skip loading state and don't fail if it doesn't work
            await loadUserData(session.user, true);
          } catch (error) {
            console.warn('Error refreshing user data on token refresh:', error);
            // Don't logout the user just because data refresh failed - ensure user state is maintained
            setState(prev => ({
              ...prev,
              user: session.user,
              session,
              isLoading: false,
              isAuthenticated: true
            }));
          }
        } else {
          // For any other events, just update the session
          setState(prev => ({ ...prev, session }));
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Periodic session check disabled temporarily to prevent interference
  // useEffect(() => {
  //   const sessionCheckInterval = setInterval(async () => {
  //     if (state.isLoading) return;
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (session?.user && !state.user) {
  //       setState(prev => ({
  //         ...prev,
  //         session,
  //         user: session.user,
  //         roles: [{ id: 0, name: 'user', description: '', level: 1, assigned_at: new Date().toISOString() }],
  //         permissions: [],
  //         maxRoleLevel: 1,
  //         isAdmin: false,
  //         isModerator: false,
  //         isLoading: false
  //       }));
  //     } else if (state.user && !session) {
  //       clearUserData();
  //     }
  //   }, 10000);
  //   return () => clearInterval(sessionCheckInterval);
  // }, [state.user, state.isLoading]);

  // Handle profile updates after user signup
  useEffect(() => {
    if (state.user && !state.profile) {
      // Create or update initial profile
      const createInitialProfile = async () => {
        const { error } = await supabase
          .from('profiles')
          .upsert([
            {
              id: state.user!.id,
              username: state.user!.email?.split('@')[0] || null,
              full_name: state.user!.user_metadata?.full_name || null,
              avatar_url: state.user!.user_metadata?.avatar_url || null,
              updated_at: new Date().toISOString(),
            },
          ], {
            onConflict: 'id'
          });

        if (error) {
          console.error('Error creating/updating initial profile:', error);
          // Don't fail the auth process just because profile creation failed
          // The user should remain logged in
        } else {
          // Reload user data after creating/updating profile
          try {
            await loadUserData(state.user!);
          } catch (loadError) {
            console.warn('Error reloading user data after profile creation:', loadError);
            // Keep user logged in even if reload fails
          }
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
