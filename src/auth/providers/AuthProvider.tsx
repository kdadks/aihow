import { useState, useEffect, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { AuthContext, AUTH_ERRORS, logAuthError, hasValidSession } from '../context/AuthContext';
import {
  AuthState,
  AuthError,
  AuthErrorType,
  User,
  UserProfile,
  AuthResponse,
  isAuthError,
  AuthContextType
} from '../types';
import { supabase, getProfile, checkDatabaseAccess } from '../../lib/supabase';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    error: null,
    loading: true,
    isInitialized: false,
    isAuthenticated: false
  });

  // Track ongoing profile load to prevent duplicates
  const profileLoadRef = useRef<{
    promise: Promise<AuthResponse | null>;
    timestamp: number;
  } | null>(null);

  const createAuthError = (type: AuthErrorType, message?: string): AuthError => ({
    type,
    message: message || AUTH_ERRORS[type]
  });

  const setDefaultState = (error: AuthError | null = null) => {
    setState({
      user: null,
      session: null,
      error,
      loading: false,
      isInitialized: true,
      isAuthenticated: false
    });
  };

  const validateSession = async () => {
    console.log('Validating session...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !hasValidSession(session)) {
      console.log('Session invalid or expired');
      throw createAuthError('UNAUTHORIZED');
    }
    
    console.log('Session valid');
    return session;
  };

  const validateDatabaseAccess = async () => {
    console.log('Validating database access...');
    const { profilesAccess, error } = await checkDatabaseAccess();
    
    if (!profilesAccess) {
      console.log('Database access denied:', error?.message);
      throw createAuthError('DATABASE_ACCESS_ERROR', error?.message);
    }
    
    console.log('Database access granted');
    return true;
  };

  const completeProfileLoad = async (session: Session): Promise<AuthResponse | null> => {
    const now = Date.now();
    
    try {
      // If there's a recent profile load (within last 2s), return it
      if (profileLoadRef.current && now - profileLoadRef.current.timestamp < 2000) {
        return profileLoadRef.current.promise;
      }

      console.log('Loading profile for session:', session.user?.email);
      
      // Create new profile load promise
      const promise = (async () => {
        try {
          const profile = await getProfile(session.user.id);
          if (!profile) {
            throw createAuthError('PROFILE_FETCH_ERROR', 'Failed to load or create profile');
          }

          const user = {
            ...session.user,
            profile
          } as User;

          const response: AuthResponse = {
            user,
            session
          };

          setState(prev => ({
            ...prev,
            user,
            session,
            error: null,
            loading: false,
            isInitialized: true,
            isAuthenticated: true
          }));

          return response;
        } catch (error) {
          console.error('Profile load failed:', error);
          const authError = isAuthError(error) ? error : createAuthError('PROFILE_FETCH_ERROR');
          logAuthError(authError.type, error, 'completeProfileLoad');
          
          if (authError.type === 'DATABASE_ACCESS_ERROR') {
            await supabase.auth.signOut();
          }
          
          setDefaultState(authError);
          return null;
        }
      })();

      profileLoadRef.current = {
        promise,
        timestamp: now
      };

      // Set a timeout to clear the reference
      setTimeout(() => {
        if (profileLoadRef.current?.timestamp === now) {
          profileLoadRef.current = null;
        }
      }, 2000);

      return promise;
    } catch (error) {
      console.error('Profile load wrapper error:', error);
      return null;
    }
  };

  const handleAuthStateChange = async (event: string, session: any) => {
    console.log('Auth state changed:', event, session?.user?.email);

    if (event === 'SIGNED_IN' && session?.user && session?.access_token) {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null
      }));

      await completeProfileLoad(session);
    } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
      console.log('User signed out or deleted');
      setDefaultState();
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          setState(prev => ({
            ...prev,
            loading: true,
            error: null
          }));
          await completeProfileLoad(session);
        } else if (mounted) {
          setDefaultState();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setDefaultState(createAuthError('UNKNOWN', 'Failed to initialize auth'));
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setState(prev => ({
              ...prev,
              loading: true,
              error: null
            }));
            try {
              await completeProfileLoad(session);
            } catch (error) {
              console.error('Failed to load profile on sign in:', error);
              setDefaultState(
                isAuthError(error) ? error : createAuthError('PROFILE_FETCH_ERROR')
              );
            }
          }
          break;
        case 'SIGNED_OUT':
          setDefaultState();
          break;
        case 'USER_UPDATED':
          if (session?.user) {
            try {
              await completeProfileLoad(session);
            } catch (error) {
              console.error('Failed to update profile:', error);
              // Don't reset state on profile update failure
            }
          }
          break;
      }
    });

    authSubscription = subscription;
    initializeAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data?.user || !data.session) {
        throw new Error('Login failed - missing user data or session');
      }

      const response = await completeProfileLoad(data.session);
      if (!response) {
        throw new Error('Failed to load user profile');
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      const authError = isAuthError(error) ? error : createAuthError('INVALID_CREDENTIALS');
      setState(prev => ({ ...prev, loading: false, error: authError }));
      throw authError;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await supabase.auth.signOut();
      // State will be updated by auth change handler
    } catch (error) {
      console.error('Logout error:', error);
      setState(prev => ({
        ...prev,
        error: createAuthError('UNKNOWN', 'Logout failed'),
        loading: false
      }));
    }
  };

  const authContext: AuthContextType = {
    ...state,
    login,
    logout,
    register: async () => { throw new Error('Not implemented'); },
    forgotPassword: async () => { throw new Error('Not implemented'); },
    updateProfile: async (updates: Partial<UserProfile>) => {
      if (!state.user) {
        throw createAuthError('UNAUTHORIZED');
      }

      setState(prev => ({ ...prev, loading: true }));
      
      try {
        await validateDatabaseAccess();

        const { data: updatedProfile, error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', state.user.id)
          .select()
          .single();

        if (error) throw error;
        if (!updatedProfile) throw new Error('No profile returned after update');

        // Get roles
        const { data: roles } = await supabase
          .rpc('fetch_user_roles', { p_user_id: state.user.id });

        const finalProfile = {
          ...updatedProfile,
          roles: roles?.map((r: any) => r.role_name) || state.user.profile?.roles || ['user']
        };

        setState(prev => ({
          ...prev,
          user: prev.user ? {
            ...prev.user,
            profile: finalProfile
          } : null,
          loading: false
        }));

        return finalProfile;
      } catch (error) {
        console.error('Profile update error:', error);
        setState(prev => ({
          ...prev,
          error: createAuthError('UNKNOWN', 'Failed to update profile'),
          loading: false
        }));
        throw error;
      }
    },
    checkAuth: async () => {
      try {
        await validateSession();
        await validateDatabaseAccess();
        return true;
      } catch {
        return false;
      }
    },
    hasRole: (role: string): boolean => {
      return state.user?.profile?.roles?.includes(role) || false;
    },
    hasPermission: async () => false,
    isUser: () => !!state.user,
    clearError: () => setState(prev => ({ ...prev, error: null }))
  };

  if (!state.isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}
