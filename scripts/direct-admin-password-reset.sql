-- DIRECT ADMIN PASSWORD RESET SCRIPT FOR SUPABASE DASHBOARD
-- =============================================================
-- Run this script directly in the Supabase Dashboard SQL Editor
-- 
-- This script will:
-- 1. Check existing admin users
-- 2. Reset passwords for admin users
-- 3. Ensure proper role assignments
-- 
-- NEW ADMIN PASSWORD: AIhow@NewAdmin2025
-- PLEASE CHANGE THIS AFTER FIRST LOGIN!
-- =============================================================

-- Step 1: Check current admin users status
SELECT 
    'CURRENT ADMIN USERS STATUS:' as info,
    '' as spacer;

SELECT 
    au.email,
    au.id as user_id,
    au.created_at as auth_created,
    au.last_sign_in_at,
    p.username,
    p.full_name,
    ur.name as role_name,
    CASE 
        WHEN ur.name IN ('admin', 'system_admin') THEN 'ADMIN USER'
        ELSE 'REGULAR USER'
    END as user_type
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.user_role_assignments ura ON au.id = ura.user_id
LEFT JOIN public.user_roles ur ON ura.role_id = ur.id
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
   OR ur.name IN ('admin', 'system_admin')
ORDER BY au.email;

-- Step 2: Reset password for admin@aihow.org
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

-- Step 3: Reset password for testadmin@aihow.org
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

-- Step 4: Ensure admin profiles exist
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

-- Step 5: Ensure admin role exists and get its ID
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

-- Step 6: Assign admin role to admin users
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

-- Step 7: Final verification - show updated admin users
SELECT 
    'UPDATED ADMIN USERS STATUS:' as info,
    '' as spacer;

SELECT 
    au.email,
    au.id as user_id,
    p.username,
    p.full_name,
    ur.name as role_name,
    au.updated_at as last_password_update,
    CASE 
        WHEN ur.name IN ('admin', 'system_admin') THEN '✓ ADMIN ACCESS'
        ELSE '✗ NO ADMIN ROLE'
    END as admin_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.user_role_assignments ura ON au.id = ura.user_id
LEFT JOIN public.user_roles ur ON ura.role_id = ur.id
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
ORDER BY au.email;

-- Step 8: Show summary
SELECT 
    'ADMIN PASSWORD RESET COMPLETED' as status,
    'New Password: AIhow@NewAdmin2025' as new_password,
    'IMPORTANT: Change this password after first login!' as security_note;

-- Step 9: Show login URLs for testing
SELECT 
    'Admin Login Page: /admin/login' as login_url,
    'Test with: admin@aihow.org or testadmin@aihow.org' as test_users;