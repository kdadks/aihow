import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Enable role claims in JWT payload
    storageKey: 'auth',
    // storage: {
    //   getItem: (key) => {
    //     const item = localStorage.getItem(key);
    //     if (item) {
    //       const data = JSON.parse(item);
    //       // Ensure role claim is included in session
    //       if (data.session?.user?.app_metadata) {
    //         data.session.user.app_metadata.claims_admin = true;
    //       }
    //       return JSON.stringify(data);
    //     }
    //     return null;
    //   },
    //   setItem: (key, value) => localStorage.setItem(key, value),
    //   removeItem: (key) => localStorage.removeItem(key)
    // }
  },
  // global: {
  //   fetch: (...args) => {
  //     // Add role claim headers to all requests
  //     const [url, config] = args;
  //     return fetch(url, {
  //       ...config,
  //       headers: {
  //         ...config?.headers,
  //         'x-claims-roles': 'true'
  //       }
  //     });
  //   }
  // }
});