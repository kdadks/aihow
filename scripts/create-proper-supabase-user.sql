-- CREATE PROPER SUPABASE USER
-- =============================================================
-- The direct database updates aren't working with Supabase Auth API
-- This script creates a user in the format Supabase expects
-- =============================================================

-- Step 1: Remove the problematic user completely first
DELETE FROM public.profiles WHERE id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Remove from role assignments
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) THEN
        DELETE FROM public.user_role_assignments 
        WHERE user_id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
    ) THEN
        DELETE FROM public.user_roles 
        WHERE user_id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;
    END IF;
END $$;

-- Remove sessions and refresh tokens
DELETE FROM auth.sessions WHERE user_id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;
DELETE FROM auth.refresh_tokens WHERE user_id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Remove from audit_log to avoid foreign key issues
DELETE FROM audit_log WHERE user_id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Remove the user from auth.users
DELETE FROM auth.users WHERE id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Step 2: Create user in the exact format Supabase Auth expects
-- Use a simpler, more compatible approach
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'support@kdadks.com',
    crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    NOW(),
    NULL,
    '',
    NULL,
    '',
    NULL,
    '',
    '',
    NULL,
    NULL,
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL
);

-- Step 3: Get the new user ID
DO $$
DECLARE
    new_user_id UUID;
BEGIN
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'support@kdadks.com';
    RAISE NOTICE 'New user created with ID: %', new_user_id;
END $$;

-- Step 4: Create profile
INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
SELECT 
    au.id,
    'support@kdadks.com',
    'System Administrator',
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'support@kdadks.com';

-- Step 5: Assign admin role
DO $$
DECLARE
    admin_user_id UUID;
    admin_role_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'support@kdadks.com';
    
    -- Try modern role assignment
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_roles'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name'
    ) THEN
        -- Create admin role if needed
        INSERT INTO public.user_roles (name, description, permissions)
        VALUES (
            'admin',
            'Super administrator with full access',
            '{
                "canManageUsers": true,
                "canManageContent": true,
                "canModerateContent": true,
                "canManageSettings": true,
                "canViewMetrics": true
            }'::jsonb
        ) ON CONFLICT (name) DO NOTHING;
        
        -- Assign role
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
        ) THEN
            SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';
            
            INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
            VALUES (admin_user_id, admin_role_id, admin_user_id, NOW());
            
            RAISE NOTICE 'Admin role assigned successfully';
        END IF;
    END IF;
END $$;

-- Step 6: Verify the user was created correctly
SELECT 
    'NEW SUPABASE-COMPATIBLE USER:' as info,
    au.id,
    au.email,
    au.aud,
    au.role,
    au.email_confirmed_at,
    au.is_super_admin,
    au.raw_app_meta_data,
    LENGTH(au.encrypted_password) as password_length,
    p.username,
    p.full_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'support@kdadks.com';

-- Step 7: Test password verification
DO $$
DECLARE
    test_password TEXT := 'AIhow@NewAdmin2025';
    stored_hash TEXT;
    auth_result BOOLEAN;
BEGIN
    SELECT encrypted_password INTO stored_hash 
    FROM auth.users 
    WHERE email = 'support@kdadks.com';
    
    SELECT (stored_hash = crypt(test_password, stored_hash)) INTO auth_result;
    
    IF auth_result THEN
        RAISE NOTICE '✅ Password verification: SUCCESS';
    ELSE
        RAISE NOTICE '❌ Password verification: FAILED';
    END IF;
END $$;

-- Step 8: Final status
SELECT 
    '🎉 SUPABASE-COMPATIBLE ADMIN USER CREATED!' as status,
    'Email: support@kdadks.com' as login_email,
    'Password: AIhow@NewAdmin2025' as login_password,
    'This user should work with Supabase Auth API' as note,
    'Try logging in now at /admin/login' as action;

-- Step 9: Additional verification - show all required fields
SELECT 
    'SUPABASE AUTH FIELDS VERIFICATION:' as info,
    CASE WHEN email IS NOT NULL THEN '✅' ELSE '❌' END || ' email',
    CASE WHEN encrypted_password IS NOT NULL THEN '✅' ELSE '❌' END || ' password',
    CASE WHEN email_confirmed_at IS NOT NULL THEN '✅' ELSE '❌' END || ' confirmed',
    CASE WHEN aud = 'authenticated' THEN '✅' ELSE '❌' END || ' audience',
    CASE WHEN role = 'authenticated' THEN '✅' ELSE '❌' END || ' role',
    CASE WHEN raw_app_meta_data ? 'provider' THEN '✅' ELSE '❌' END || ' metadata'
FROM auth.users 
WHERE email = 'support@kdadks.com';