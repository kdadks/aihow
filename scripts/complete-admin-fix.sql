-- COMPLETE ADMIN FIX SCRIPT
-- =============================================================
-- This script fixes the "Invalid login credentials" error by:
-- 1. Resetting passwords
-- 2. Confirming email addresses
-- 3. Fixing auth metadata
-- 4. Ensuring proper user status
-- 
-- NEW ADMIN PASSWORD: AIhow@NewAdmin2025
-- =============================================================

-- Step 1: Check current admin user status in auth.users
SELECT 
    'CURRENT AUTH STATUS:' as info,
    '' as spacer;

SELECT 
    email,
    id,
    email_confirmed_at,
    created_at,
    updated_at,
    last_sign_in_at,
    aud,
    role,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'EMAIL NOT CONFIRMED'
        ELSE 'EMAIL CONFIRMED'
    END as email_status
FROM auth.users 
WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
ORDER BY email;

-- Step 2: Fix admin@aihow.org
UPDATE auth.users 
SET 
    encrypted_password = crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW(),
    aud = 'authenticated',
    role = 'authenticated',
    raw_app_meta_data = COALESCE(raw_app_meta_data, '{"provider": "email", "providers": ["email"]}'::jsonb),
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
WHERE email = 'admin@aihow.org';

-- Check result
SELECT 
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'admin@aihow.org') 
        THEN 'SUCCESS: admin@aihow.org updated and confirmed'
        ELSE 'ERROR: admin@aihow.org not found'
    END as admin_result;

-- Step 3: Fix testadmin@aihow.org  
UPDATE auth.users 
SET 
    encrypted_password = crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW(),
    aud = 'authenticated',
    role = 'authenticated',
    raw_app_meta_data = COALESCE(raw_app_meta_data, '{"provider": "email", "providers": ["email"]}'::jsonb),
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
WHERE email = 'testadmin@aihow.org';

-- Check result
SELECT 
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'testadmin@aihow.org') 
        THEN 'SUCCESS: testadmin@aihow.org updated and confirmed'
        ELSE 'ERROR: testadmin@aihow.org not found'
    END as testadmin_result;

-- Step 4: If admin users don't exist, create them
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
    raw_app_meta_data,
    raw_user_meta_data
)
SELECT 
    '00000000-0000-0000-0000-000000000000'::UUID,
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    admin_email,
    crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "System Administrator"}'::jsonb
FROM (VALUES ('admin@aihow.org'), ('testadmin@aihow.org')) AS t(admin_email)
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = admin_email
);

-- Step 5: Create/update profiles for admin users
INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    'System Administrator',
    COALESCE(au.created_at, NOW()),
    NOW()
FROM auth.users au
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    updated_at = EXCLUDED.updated_at;

-- Step 6: Show final auth status
SELECT 
    'FINAL AUTH STATUS AFTER FIX:' as info,
    '' as spacer;

SELECT 
    email,
    id,
    email_confirmed_at,
    aud,
    role,
    CASE 
        WHEN email_confirmed_at IS NULL THEN '❌ EMAIL NOT CONFIRMED'
        ELSE '✅ EMAIL CONFIRMED'
    END as email_status,
    CASE 
        WHEN aud = 'authenticated' AND role = 'authenticated' THEN '✅ AUTH STATUS OK'
        ELSE '❌ AUTH STATUS INCORRECT'
    END as auth_status,
    updated_at as last_updated
FROM auth.users 
WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
ORDER BY email;

-- Step 7: Show profiles status
SELECT 
    'PROFILES STATUS:' as info,
    '' as spacer;

SELECT 
    p.id,
    au.email,
    p.username,
    p.full_name,
    '✅ PROFILE EXISTS' as profile_status
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
ORDER BY au.email;

-- Step 8: Clear any auth sessions that might be cached
DELETE FROM auth.sessions WHERE user_id IN (
    SELECT id FROM auth.users 
    WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
);

-- Step 9: Summary
SELECT 
    'COMPLETE ADMIN FIX APPLIED!' as status,
    'Email: admin@aihow.org or testadmin@aihow.org' as login_email,
    'Password: AIhow@NewAdmin2025' as login_password,
    'URL: /admin/login' as login_url,
    'All auth issues should be resolved' as result;

-- Step 10: Troubleshooting info
SELECT 
    'TROUBLESHOOTING INFO:' as info,
    '' as spacer;

SELECT 
    'If login still fails:' as step_1,
    '1. Clear browser cache/localStorage' as step_2,
    '2. Try incognito/private browsing' as step_3,
    '3. Check Supabase project URL in frontend' as step_4,
    '4. Verify API keys are correct' as step_5;