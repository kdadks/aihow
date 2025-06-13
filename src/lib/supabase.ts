import { createClient, PostgrestError } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey
    }
  }
});

interface DatabaseAccessResult {
  profilesAccess: boolean;
  rolesAccess: boolean;
  error: DatabaseAccessError | null;
}

interface DatabaseAccessError {
  message: string;
  code?: string;
  details?: string;
}

// Helper to convert PostgrestError to DatabaseAccessError
const formatError = (error: PostgrestError | null): DatabaseAccessError | null => {
  if (!error) return null;
  return {
    message: error.message,
    code: error.code,
    details: error.details
  };
};

// Helper to check database permissions
export const checkDatabaseAccess = async (): Promise<DatabaseAccessResult> => {
  console.log('Checking database access...');
  
  try {
    // First verify session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'Valid' : 'None');

    if (!session) {
      return {
        profilesAccess: false,
        rolesAccess: false,
        error: { message: 'No active session' }
      };
    }

    // Check profiles table access
    const profileCheck = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single();
    
    console.log('Profiles table access check:', {
      success: !profileCheck.error,
      error: profileCheck.error?.message
    });

    // Check user_roles table access
    const rolesCheck = await supabase
      .rpc('fetch_user_roles', { p_user_id: session.user.id })
      .limit(1);

    console.log('Roles table access check:', {
      success: !rolesCheck.error,
      error: rolesCheck.error?.message
    });

    return {
      profilesAccess: !profileCheck.error,
      rolesAccess: !rolesCheck.error,
      error: formatError(profileCheck.error || rolesCheck.error)
    };
  } catch (error) {
    console.error('Database access check failed:', error);
    return {
      profilesAccess: false,
      rolesAccess: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown database access error'
      }
    };
  }
};

// Get profile info
export const getProfile = async (userId: string) => {
  console.log('Fetching profile for:', userId);

  try {
    // Get basic profile
    const { data: initialProfile, error: profileError } = await supabase
      .from('profiles')
      .select('username, full_name, avatar_url, created_at, updated_at')
      .eq('id', userId)
      .single();

    let profileData = initialProfile;

    if (profileError && profileError.code === 'PGRST116') {
      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          username: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('Failed to create profile:', createError);
        return null;
      }
      profileData = newProfile;
    } else if (profileError) {
      console.error('Failed to fetch profile:', profileError);
      return null;
    }

    // Get roles in parallel with profile
    const [rolesResult, adminResult] = await Promise.all([
      supabase.rpc('fetch_user_roles', { p_user_id: userId }),
      supabase.rpc('is_admin', { checking_user_id: userId })
    ]);

    let roles = ['user'];
    if (!rolesResult.error && rolesResult.data?.length) {
      roles = rolesResult.data.map((r: { role_name: string }) => r.role_name);
    }
    if (adminResult.data) {
      if (!roles.includes('admin')) {
        roles.push('admin');
      }
    }

    return {
      ...profileData,
      roles
    };
  } catch (error) {
    console.error('Error in getProfile:', error);
    return null;
  }
};

// Update profile
export const updateProfile = async (userId: string, updates: Record<string, any>) => {
  console.log('Updating profile:', { userId, updates });

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    console.log('Update result:', {
      success: !error,
      data,
      error: error?.message
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Auth helper for fetch operations
export const getAuthorizedFetch = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const authHeaders = new Headers();
  if (session?.access_token) {
    authHeaders.set('Authorization', `Bearer ${session.access_token}`);
  }

  return async (input: RequestInfo | URL, init?: RequestInit) => {
    return fetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        ...Object.fromEntries(authHeaders)
      }
    });
  };
};

let currentAuthorizedFetch: typeof fetch | null = null;

supabase.auth.onAuthStateChange(async (event, session) => {
  console.log('Auth state changed:', event);
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    const access = await checkDatabaseAccess();
    console.log('Database access after auth change:', access);
    currentAuthorizedFetch = await getAuthorizedFetch();
  } else if (event === 'SIGNED_OUT') {
    currentAuthorizedFetch = null;
  }
});

export const authorizedFetch = async (...args: Parameters<typeof fetch>) => {
  if (!currentAuthorizedFetch) {
    currentAuthorizedFetch = await getAuthorizedFetch();
  }
  return currentAuthorizedFetch(...args);
};