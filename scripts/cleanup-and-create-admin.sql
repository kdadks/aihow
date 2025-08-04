-- CLEANUP AND CREATE ADMIN USER SCRIPT
-- =============================================================
-- 1. Cleans up orphaned profiles that don't have auth.users entries
-- 2. Creates a fresh admin user: support@kdadks.com
-- 
-- ADMIN CREDENTIALS:
-- Email: support@kdadks.com
-- Password: AIhow@NewAdmin2025
-- =============================================================

-- Step 1: Check for orphaned profiles (profiles without auth.users)
SELECT 
    'CHECKING FOR ORPHANED PROFILES:' as info,
    '' as spacer;

SELECT 
    p.id as orphaned_profile_id,
    p.username,
    p.full_name,
    'This profile has no auth.users entry' as issue
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.id IS NULL;

-- Step 2: Clean up orphaned profiles
DELETE FROM public.profiles 
WHERE id NOT IN (
    SELECT id FROM auth.users
);

-- Step 3: Show cleanup result
SELECT 
    'CLEANUP COMPLETED:' as info,
    'Orphaned profiles removed' as result;

-- Step 4: Verify support@kdadks.com doesn't exist anywhere
SELECT 
    'VERIFICATION - SUPPORT EMAIL STATUS:' as info,
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'support@kdadks.com')
        THEN '❌ ERROR: User exists in auth.users'
        ELSE '✅ No user in auth.users'
    END as auth_users_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM public.profiles p JOIN auth.users au ON p.id = au.id WHERE au.email = 'support@kdadks.com')
        THEN '❌ ERROR: Profile exists'
        ELSE '✅ No profile exists'
    END as profile_status;

-- Step 5: Create the admin user in auth.users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data
) VALUES (
    '00000000-0000-0000-0000-000000000000'::UUID,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'support@kdadks.com',
    crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "System Administrator"}'::jsonb
);

-- Step 6: Show created user
SELECT 
    'USER CREATED SUCCESSFULLY:' as info,
    id as user_id,
    email,
    email_confirmed_at,
    aud,
    role,
    created_at
FROM auth.users 
WHERE email = 'support@kdadks.com';

-- Step 7: Create profile for the new admin user
INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    'System Administrator',
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'support@kdadks.com';

-- Step 8: Show created profile
SELECT 
    'PROFILE CREATED SUCCESSFULLY:' as info,
    p.id,
    au.email,
    p.username,
    p.full_name,
    p.created_at
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'support@kdadks.com';

-- Step 9: Assign admin role (flexible approach)
DO $$
DECLARE
    new_user_id UUID;
    admin_role_id UUID;
    role_assigned BOOLEAN := FALSE;
BEGIN
    -- Get the new user ID
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'support@kdadks.com';
    
    -- Try to assign admin role based on existing table structure
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_roles'
    ) THEN
        -- Check if it's modern structure with name column
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name'
        ) THEN
            -- Modern structure
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
            
            -- Assign via user_role_assignments if exists
            IF EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
            ) THEN
                SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';
                
                INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
                VALUES (new_user_id, admin_role_id, new_user_id, NOW());
                
                role_assigned := TRUE;
                RAISE NOTICE 'Admin role assigned via user_role_assignments';
            END IF;
        ELSE
            -- Legacy junction table structure
            IF EXISTS (
                SELECT 1 FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = 'roles'
            ) THEN
                INSERT INTO public.roles (name, description)
                VALUES ('admin', 'Full system access')
                ON CONFLICT (name) DO NOTHING;
                
                SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
                
                INSERT INTO public.user_roles (user_id, role_id, created_at)
                VALUES (new_user_id, admin_role_id, NOW());
                
                role_assigned := TRUE;
                RAISE NOTICE 'Admin role assigned via legacy structure';
            END IF;
        END IF;
    END IF;
    
    IF NOT role_assigned THEN
        RAISE NOTICE 'No role assigned - user created without admin privileges';
    END IF;
END $$;

-- Step 10: Final complete verification
SELECT 
    'FINAL VERIFICATION - COMPLETE SETUP:' as info,
    au.email as login_email,
    au.id as user_id,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMED'
        ELSE '❌ EMAIL NOT CONFIRMED'
    END as email_status,
    CASE 
        WHEN au.aud = 'authenticated' AND au.role = 'authenticated' THEN '✅ AUTH STATUS OK'
        ELSE '❌ AUTH STATUS PROBLEM'
    END as auth_status,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ PROFILE EXISTS'
        ELSE '❌ NO PROFILE'
    END as profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = au.id
WHERE au.email = 'support@kdadks.com';

-- Step 11: Show database structure for reference
SELECT 
    'DATABASE STRUCTURE REFERENCE:' as info,
    string_agg(table_name, ', ') as available_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%role%' OR table_name = 'profiles');

-- Step 12: Success message
SELECT 
    '🎉 ADMIN USER READY!' as status,
    'Email: support@kdadks.com' as login_email,
    'Password: AIhow@NewAdmin2025' as login_password,
    'URL: /admin/login' as login_url,
    'Test login now!' as action;