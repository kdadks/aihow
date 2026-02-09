#!/usr/bin/env node

/**
 * Apply the user email migration using Supabase client
 */

import { config } from 'dotenv';
import pg from 'pg';

// Load environment variables
config();

const { Client } = pg;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  process.exit(1);
}

// Extract database connection details from Supabase URL
// Supabase URL format: https://xxxxx.supabase.co
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

// Construct database connection string
// For direct database access, we need the database password
// This might not work directly - better to use Supabase dashboard
console.log('\n📋 To apply the migration, please follow these steps:\n');
console.log('1. Open your Supabase Dashboard: https://supabase.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to "SQL Editor" in the left menu');
console.log('4. Copy and paste the following SQL:\n');
console.log('=' .repeat(80));
console.log(`
-- Function to get all users with their real email addresses
CREATE OR REPLACE FUNCTION public.get_all_users_with_emails(
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10
)
RETURNS TABLE(
    id UUID,
    email TEXT,
    username TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    offset_value INTEGER;
BEGIN
    offset_value := (page_number - 1) * page_size;
    
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        COALESCE(p.username, '') as username,
        COALESCE(p.full_name, '') as full_name,
        u.created_at,
        COALESCE(p.updated_at, u.created_at) as updated_at,
        u.last_sign_in_at,
        true as is_active
    FROM auth.users u
    LEFT JOIN public.profiles p ON p.id = u.id
    ORDER BY u.created_at DESC
    LIMIT page_size
    OFFSET offset_value;
END;
$$;

-- Function to get a single user by ID with real email
CREATE OR REPLACE FUNCTION public.get_user_with_email(user_id UUID)
RETURNS TABLE(
    id UUID,
    email TEXT,
    username TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        COALESCE(p.username, '') as username,
        COALESCE(p.full_name, '') as full_name,
        u.created_at,
        COALESCE(p.updated_at, u.created_at) as updated_at,
        u.last_sign_in_at,
        true as is_active
    FROM auth.users u
    LEFT JOIN public.profiles p ON p.id = u.id
    WHERE u.id = user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_all_users_with_emails(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_with_email(UUID) TO authenticated;

-- Add comments
COMMENT ON FUNCTION public.get_all_users_with_emails IS 'Returns all users with their real email addresses from auth.users - for admin panel';
COMMENT ON FUNCTION public.get_user_with_email IS 'Returns a single user with real email address from auth.users - for admin panel';
`);
console.log('=' .repeat(80));
console.log('\n5. Click "Run" to execute the SQL');
console.log('\n✅ After running the SQL, the admin panel will show correct email addresses!');
console.log('\nAlternatively, you can access the migration file at:');
console.log('   supabase/migrations/20260209000001_add_get_all_users_function.sql\n');
