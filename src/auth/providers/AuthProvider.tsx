import { useState, useEffect } from 'react';
import { AuthContext, AUTH_ERRORS } from '../context/AuthContext';
import {
  AuthState,
  AuthError,
  AuthErrorType,
  User,
  UserProfile,
  AuthResponse,
  isAuthError
} from '../types';
import { supabase } from '../../lib/supabase';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    error: null,
    loading: false,
    isInitialized: false,
    isAuthenticated: false
  });

  const createAuthError = (type: AuthErrorType, message?: string): AuthError => ({
    type,
    message: message || AUTH_ERRORS[type]
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        
        // Check if we're in the email verification flow
        const hasVerifyParams = window.location.hash.includes('type=email_verification');
        if (hasVerifyParams) {
          // Clear any existing session for clean verification
          await supabase.auth.signOut();
          setState({
            user: null,
            session: null,
            error: null,
            loading: false,
            isInitialized: true,
            isAuthenticated: false
          });
          return;
        }
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, created_at, updated_at, role, full_name, avatar_url')
            .eq('id', session.user.id)
            .single();

          const user: User = {
            ...session.user,
            profile: profileData || null
          };

          setState({
            user,
            session,
            error: null,
            loading: false,
            isInitialized: true,
            isAuthenticated: true
          });
        } else {
          setState({
            user: null,
            session: null,
            error: null,
            loading: false,
            isInitialized: true,
            isAuthenticated: false
          });
        }
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: createAuthError('UNKNOWN', error instanceof Error ? error.message : 'Failed to initialize auth'),
          loading: false,
          isInitialized: true,
          isAuthenticated: false
        }));
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Handle successful sign in
        if (session?.user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setState({
            user: {
              ...session.user,
              profile: profileData || null
            },
            session,
            error: null,
            loading: false,
            isInitialized: true,
            isAuthenticated: true
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          session: null,
          error: null,
          loading: false,
          isInitialized: true,
          isAuthenticated: false
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // First authenticate the user
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw createAuthError('INVALID_CREDENTIALS', authError.message);
      if (!data?.user) throw createAuthError('UNKNOWN', 'Login failed - no user data');

      // Create initial user state
      const user: User = {
        ...data.user,
        profile: null
      };

      try {
        // Try to get existing profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile) {
          user.profile = profile;
        } else {
          // Create new profile if none exists
          const now = new Date().toISOString();
          const newProfile: UserProfile = {
            id: data.user.id,
            username: data.user.email?.split('@')[0] || data.user.id,
            created_at: now,
            updated_at: now,
            role: 'user',
            full_name: null,
            avatar_url: null
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (createError) {
            console.error('Failed to create profile:', createError);
          } else if (createdProfile) {
            user.profile = createdProfile;
          }
        }
      } catch (error) {
        console.error('Error handling profile:', error);
      }

      setState(prev => ({
        ...prev,
        user,
        session: data.session,
        loading: false,
        error: null,
        isAuthenticated: true
      }));

      return { user, session: data.session };
    } catch (error) {
      const authError = isAuthError(error) ? error : createAuthError('UNKNOWN', 'Login failed');
      setState(prev => ({
        ...prev,
        loading: false,
        error: authError
      }));
      throw authError;
    }
  };

  const register = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login'
        }
      });

      if (authError) throw createAuthError('EMAIL_EXISTS', authError.message);
      if (!data?.user) throw createAuthError('UNKNOWN', 'Registration failed - no user data');

      setState(prev => ({ ...prev, loading: false }));
      return {
        user: {
          ...data.user,
          profile: null
        },
        session: null,
        verificationNeeded: true,
        message: 'Please check your email to verify your account, then sign in'
      };
    } catch (error) {
      const authError = isAuthError(error) ? error : createAuthError('UNKNOWN', 'Registration failed');
      setState(prev => ({
        ...prev,
        loading: false,
        error: authError
      }));
      throw authError;
    }
  };

  const logout = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      if (error) throw createAuthError('UNKNOWN', error.message);

      setState({
        user: null,
        session: null,
        error: null,
        loading: false,
        isInitialized: true,
        isAuthenticated: false
      });
    } catch (error) {
      const authError = isAuthError(error) ? error : createAuthError('UNKNOWN', 'Logout failed');
      setState(prev => ({
        ...prev,
        loading: false,
        error: authError
      }));
      throw authError;
    }
  };

  const updateProfile = async (profileUpdate: Partial<Omit<UserProfile, 'id' | 'role'>>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      if (!state.user) throw createAuthError('UNAUTHORIZED');

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', state.user.id);

      if (error) throw createAuthError('PROFILE_CREATE_ERROR', error.message);

      setState(prev => ({
        ...prev,
        loading: false,
        user: prev.user ? {
          ...prev.user,
          profile: {
            ...prev.user.profile!,
            ...profileUpdate
          }
        } : null
      }));
    } catch (error) {
      const authError = isAuthError(error) ? error : createAuthError('UNKNOWN', 'Profile update failed');
      setState(prev => ({
        ...prev,
        loading: false,
        error: authError
      }));
      throw authError;
    }
  };

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch {
      return false;
    }
  };

  const hasRole = (role: string) => {
    return state.user?.profile?.role === role;
  };

  const hasPermission = (_permission: string) => {
    // This is a placeholder - implement actual permission logic based on your needs
    return false;
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const authContext = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
    hasRole,
    hasPermission,
    clearError
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}
