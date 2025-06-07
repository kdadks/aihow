// Environment variable validation
export function validateEnv() {
  const requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Log variables for debugging (don't do this in production)
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Environment variables loaded successfully');
}
