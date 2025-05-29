import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

/**
 * Temporary direct admin access utility
 * 
 * IMPORTANT: This is a temporary solution while the main auth system is being fixed.
 * This bypass should be removed once normal admin authentication is restored.
 * 
 * The temporary secret key should be shared only with authorized administrators
 * and should be rotated frequently.
 * 
 * @see docs/auth/SECURITY.md for proper authentication implementation once restored
 */

// Temporary direct admin access implementation
export const directAdminAccess = {
  /**
   * Login directly as an admin user using email and a temporary secret key
   * 
   * @param email Admin user's email address
   * @param secretKey Temporary admin access key 
   * @returns Session object if login successful
   */
  loginAsAdmin: async (email: string, secretKey: string) => {
    try {
      // Verify the secret key against a hardcoded value
      // This is a temporary solution - in production we would use a more secure approach
      // such as a time-limited token stored in a secure database
      if (secretKey !== process.env.VITE_ADMIN_SECRET_KEY) {
        throw new Error('Invalid secret key');
      }

      // If valid, create an admin session directly
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: secretKey,
      });
      
      if (error) {
        console.error('Admin login error:', error);
        throw new Error('Admin authentication failed');
      }
      
      if (!data.session) {
        throw new Error('Failed to create admin session');
      }
      
      return { session: data.session as Session };
    } catch (error) {
      console.error('Direct admin login error:', error);
      throw error;
    }
  },
  
  /**
   * Log out the current admin user
   */
  logoutAdmin: async () => {
    return await supabase.auth.signOut();
  }
};
