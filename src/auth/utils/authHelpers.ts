import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { User, UserProfile } from '../types';

/**
 * Checks if the current session is valid
 */
export const isSessionValid = (session: Session | null): boolean => {
  if (!session || !session.expires_at) return false;
  
  // Check if token is expired
  const expiryTime = new Date(session.expires_at * 1000);
  return expiryTime > new Date();
};

/**
 * Checks if a user has the required role
 */
export const checkUserRole = (user: User | null, requiredRole: string): boolean => {
  if (!user?.profile?.roles) return false;
  return user.profile.roles.some(role => role.name === requiredRole);
};

/**
 * Extracts role names from user profile
 */
export const getUserRoles = (user: User | null): string[] => {
  if (!user?.profile?.roles) return [];
  return user.profile.roles.map(role => role.name);
};

/**
 * Updates user profile data
 */
export const updateUserProfile = async (
  userId: string, 
  profile: Partial<UserProfile>
): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Profile not found');
  return data;
};

/**
 * Assigns a role to a user
 */
export const assignUserRole = async (userId: string, roleName: string): Promise<void> => {
  // First get the role ID
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', roleName)
    .single();

  if (roleError || !role) {
    throw new Error(`Role '${roleName}' not found`);
  }

  // Then assign the role to the user
  const { error } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role_id: role.id
    });

  if (error) throw error;
};

/**
 * Removes a role from a user
 */
export const removeUserRole = async (userId: string, roleName: string): Promise<void> => {
  // First get the role ID
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', roleName)
    .single();

  if (roleError || !role) {
    throw new Error(`Role '${roleName}' not found`);
  }

  // Then remove the role from the user
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .match({
      user_id: userId,
      role_id: role.id
    });

  if (error) throw error;
};

/**
 * Gets user profile by ID
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      full_name,
      avatar_url,
      user_roles (
        roles (
          id,
          name,
          description
        )
      )
    `)
    .eq('id', userId)
    .single();

  if (error) throw error;
  
  return data ? {
    ...data,
    roles: data.user_roles?.map((ur: any) => ur.roles) || []
  } : null;
};

/**
 * Formats error messages from Supabase
 */
export const formatAuthError = (error: any): string => {
  if (typeof error === 'string') return error;
  
  const message = error?.message || 'An unknown error occurred';
  
  // Handle specific error cases
  if (message.includes('Email not confirmed')) {
    return 'Please confirm your email address before logging in';
  }
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (message.includes('Email already registered')) {
    return 'An account with this email already exists';
  }
  
  return message;
};