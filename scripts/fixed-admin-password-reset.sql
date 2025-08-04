-- FIXED ADMIN PASSWORD RESET SCRIPT FOR SUPABASE DASHBOARD
-- =============================================================
-- This version works with the actual database schema
-- 
-- This script will:
-- 1. Check existing admin users
-- 2. Reset passwords for admin users
-- 3. Ensure proper role assignments using the correct schema
-- 
-- NEW ADMIN PASSWORD: AIhow@NewAdmin2025
-- PLEASE CHANGE THIS AFTER FIRST LOGIN!
-- =============================================================

-- Step 1: Check what tables actually exist
SELECT 
    'CHECKING DATABASE SCHEMA:' as info;

SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%role%' OR table_name LIKE '%user%'
ORDER BY table_name;

-- Step 2: Check current admin users status (simplified)
SELECT 
    'CURRENT ADMIN USERS STATUS:' as info;

SELECT 
    au.email,
    au.id as user_id,
    au.created_at as auth_created,
    au.last_sign_in_at
FROM auth.users au
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
ORDER BY au.email;

-- Step 3: Check if profiles table exists and show profiles
SELECT 
    'PROFILES TABLE STATUS:' as info;

SELECT 
    p.id,
    p.username,
    p.full_name
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org');

-- Step 4: Reset password for admin@aihow.org
UPDATE auth.users 
SET 
    encrypted_password = crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'admin@aihow.org';

-- Check if the update was successful
SELECT 
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@aihow.org') 
        THEN 'SUCCESS: Password updated for admin@aihow.org'
        ELSE 'ERROR: admin@aihow.org not found'
    END as result;

-- Step 5: Reset password for testadmin@aihow.org
UPDATE auth.users 
SET 
    encrypted_password = crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'testadmin@aihow.org';

-- Check if the update was successful
SELECT 
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'testadmin@aihow.org') 
        THEN 'SUCCESS: Password updated for testadmin@aihow.org'
        ELSE 'ERROR: testadmin@aihow.org not found'
    END as result;

-- Step 6: Ensure admin profiles exist
INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    'System Administrator',
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = au.id)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

-- Step 7: Check what role tables actually exist and handle accordingly
DO $$
DECLARE
    has_user_roles BOOLEAN := FALSE;
    has_roles BOOLEAN := FALSE;
    has_user_role_assignments BOOLEAN := FALSE;
    admin_role_id UUID;
BEGIN
    -- Check if user_roles table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_roles'
    ) INTO has_user_roles;
    
    -- Check if roles table exists  
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'roles'
    ) INTO has_roles;
    
    -- Check if user_role_assignments table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) INTO has_user_role_assignments;
    
    RAISE NOTICE 'user_roles table exists: %', has_user_roles;
    RAISE NOTICE 'roles table exists: %', has_roles;
    RAISE NOTICE 'user_role_assignments table exists: %', has_user_role_assignments;
    
    -- Handle role assignment based on what tables exist
    IF has_user_roles THEN
        -- Ensure admin role exists in user_roles
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
        
        IF has_user_role_assignments THEN
            -- Use user_role_assignments table
            INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
            SELECT DISTINCT
                au.id as user_id,
                ur.id as role_id,
                au.id as assigned_by,
                NOW() as assigned_at
            FROM auth.users au
            CROSS JOIN public.user_roles ur
            WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
              AND ur.name = 'admin'
            ON CONFLICT (user_id, role_id) DO NOTHING;
        END IF;
        
    ELSIF has_roles THEN
        -- Use legacy roles table
        INSERT INTO public.roles (name, description)
        VALUES ('admin', 'Full system access')
        ON CONFLICT (name) DO NOTHING;
        
        -- Check if user_roles junction table exists for legacy system
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_roles'
            AND EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
            )
        ) THEN
            -- This is the legacy user_roles junction table
            SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
            
            INSERT INTO public.user_roles (user_id, role_id, created_at)
            SELECT au.id, admin_role_id, NOW()
            FROM auth.users au
            WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
            ON CONFLICT (user_id, role_id) DO NOTHING;
        END IF;
    END IF;
END $$;

-- Step 8: Final verification - show updated admin users
SELECT 
    'FINAL VERIFICATION:' as info;

SELECT 
    au.email,
    au.id as user_id,
    p.username,
    p.full_name,
    au.updated_at as last_password_update
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
ORDER BY au.email;

-- Step 9: Show summary
SELECT 
    'ADMIN PASSWORD RESET COMPLETED' as status,
    'New Password: AIhow@NewAdmin2025' as new_password,
    'IMPORTANT: Change this password after first login!' as security_note;