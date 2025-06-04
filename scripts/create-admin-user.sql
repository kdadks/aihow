-- Create admin user directly in auth.users table
-- This bypasses the normal signup flow for local development

-- First, let's check the current structure of auth.users
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'auth' AND table_name = 'users';

-- Insert admin user directly
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'testadmin@aihow.org',
    crypt('AIhow@Admin2025', gen_salt('bf')),
    NOW(),
    NULL,
    NULL,
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- Get the user ID for the admin user
SELECT id, email FROM auth.users WHERE email = 'testadmin@aihow.org';
