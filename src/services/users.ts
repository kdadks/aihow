import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserResponse {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_active: boolean;
}

interface ProfileResponse {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

type SupabaseUser = User & {
  last_sign_in_at?: string;
  created_at: string;
}

interface UserProfile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export const usersService = {
  async getUserDetails(userId: string): Promise<UserResponse> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser(userId);
      if (userError) throw userError;
      if (!user) throw new Error('User not found');

      return {
        id: user.id,
        email: user.email ?? '',
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at ?? null,
        is_active: true
      };
    } catch (error) {
      console.error('Error in getUserDetails:', error);
      throw error;
    }
  },

  async getUserProfile(userId: string): Promise<ProfileResponse> {
    try {
      // Get user data first to ensure it exists
      const { data: { user }, error: userError } = await supabase.auth.getUser(userId);
      if (userError) throw userError;
      if (!user) throw new Error('User not found');

      // Get only the fields that exist in profiles table
      // Query only the fields that exist in profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Profile doesn't exist - create it
          const defaultUsername = user.email?.split('@')[0] || userId;
          // Create new profile
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              username: defaultUsername,
              full_name: null,
              avatar_url: null
            })
            .select()
            .single();

          if (createError) throw createError;
          if (!newProfile) throw new Error('Failed to create profile');

          return {
            username: defaultUsername,
            full_name: null,
            avatar_url: null
          };
        }
        throw profileError;
      }

      // Ensure username exists
      if (!profile.username) {
        const defaultUsername = user.email?.split('@')[0] || userId;
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ username: defaultUsername })
          .eq('id', userId);

        if (updateError) throw updateError;
        profile.username = defaultUsername;
      }

      // Get user email from auth.users, not profiles table
      return {
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url
      };
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw error;
    }
  }
};