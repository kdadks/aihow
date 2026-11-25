import { supabase } from './supabase';
import { ProjectRole } from '../types/multiProject';

export const APP_PROJECT_ID = 'how2doai';

/**
 * Verifies if the currently authenticated user is bound to this project ('how2doai').
 * If a user logged in with credentials belonging to another project (e.g. Nirchal),
 * this returns false to prevent any unauthorized actions.
 */
export async function verifyCurrentProjectBinding(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_user_bound_to', {
      target_project: APP_PROJECT_ID,
    });

    if (error) {
      console.warn('[multiProject] Binding verification failed:', error.message);
      return false;
    }

    return Boolean(data);
  } catch (err) {
    console.error('[multiProject] Error verifying project binding:', err);
    return false;
  }
}

/**
 * Retrieves the project ID the current authenticated user belongs to.
 */
export async function getCurrentUserProject(): Promise<string | null> {
  try {
    const { data, error } = await supabase.rpc('current_user_project');

    if (error || !data) {
      return null;
    }

    return data as string;
  } catch (err) {
    console.error('[multiProject] Error fetching current user project:', err);
    return null;
  }
}

/**
 * Checks if the currently authenticated user is an administrator of How2doAI.
 */
export async function isHow2doaiAdmin(): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('is_project_admin', {
      target_project: APP_PROJECT_ID,
    });

    if (error) {
      return false;
    }

    return Boolean(data);
  } catch (err) {
    return false;
  }
}
