import { useState, useEffect } from 'react';
import { AuthContext, AUTH_ERRORS } from '../context/AuthContext';
import {
  AuthState,
  AuthError,
  AuthErrorType,
  User,
  UserProfile,
  UserRoleRelation,
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

  const createUserProfile = (userId: string, username?: string): UserProfile => ({
    id: userId,
    username: username || userId,
    roles: [] // Initialize with empty roles array
  });

  const assignDefaultRole = async (userId: string) => {
    try {
      // Get the default user role ID
      const { data: roleData, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'user')
        .single();

      if (roleError) throw createAuthError('ROLE_ASSIGN_ERROR', roleError.message);
      if (!roleData) throw createAuthError('ROLE_NOT_FOUND', 'Default user role not found');

      // Assign the role to the user
      const { error: assignError } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role_id: roleData.id }]);

      if (assignError) throw createAuthError('ROLE_ASSIGN_ERROR', assignError.message);
    } catch (error) {
      throw createAuthError('ROLE_ASSIGN_ERROR', error instanceof Error ? error.message : 'Failed to assign default role');
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select(`
              *,
              user_roles (
                role:roles (
                  id,
                  name
                )
              )
            `)
            .eq('id', session.user.id)
            .single();

          const profile = profileData ? {
            ...profileData,
            roles: profileData.user_roles?.map((ur: UserRoleRelation) => ur.role) || []
          } : createUserProfile(session.user.id);

          const user: User = {
            ...session.user,
            profile
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
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw createAuthError('INVALID_CREDENTIALS', authError.message);
      if (!data?.user) throw createAuthError('UNKNOWN', 'Login failed - no user data');

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role:roles (
              id,
              name
            )
          )
        `)
        .eq('id', data.user.id)
        .single();

      const profile = profileData ? {
        ...profileData,
        roles: profileData.user_roles?.map((ur: UserRoleRelation) => ur.role) || []
      } : createUserProfile(data.user.id);

      const user: User = {
        ...data.user,
        profile
      };

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

  const register = async (email: string, password: string, username?: string): Promise<AuthResponse> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw createAuthError('EMAIL_EXISTS', authError.message);
      if (!data?.user) throw createAuthError('UNKNOWN', 'Registration failed - no user data');

      // Create user profile and assign default role
      const profile = createUserProfile(data.user.id, username);
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profile]);

      if (profileError) throw createAuthError('PROFILE_CREATE_ERROR', profileError.message);

      // Assign default role
      await assignDefaultRole(data.user.id);

      // Fetch the profile with roles
      const { data: updatedProfileData } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role:roles (
              id,
              name
            )
          )
        `)
        .eq('id', data.user.id)
        .single();

      if (updatedProfileData) {
        profile.roles = updatedProfileData.user_roles?.map((ur: UserRoleRelation) => ur.role) || [];
      }

      const user: User = {
        ...data.user,
        profile
      };

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

  const updateProfile = async (profileUpdate: Partial<Omit<UserProfile, 'id' | 'roles'>>) => {
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
    return state.user?.profile?.roles.some(r => r.name === role) || false;
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