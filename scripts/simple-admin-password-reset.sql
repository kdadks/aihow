-- SIMPLE ADMIN PASSWORD RESET SCRIPT
-- =============================================================
-- This version only resets passwords and ensures profiles exist
-- No role management to avoid schema conflicts
-- 
-- NEW ADMIN PASSWORD: AIhow@NewAdmin2025
-- PLEASE CHANGE THIS AFTER FIRST LOGIN!
-- =============================================================

-- Step 1: Check what tables actually exist
SELECT 
    'CHECKING DATABASE SCHEMA:' as info,
    '' as spacer;

SELECT 
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%role%' OR table_name LIKE '%user%' OR table_name = 'profiles')
ORDER BY table_name;

-- Step 2: Check current admin users
SELECT 
    'CURRENT ADMIN USERS:' as info,
    '' as spacer;

SELECT 
    au.email,
    au.id as user_id,
    au.created_at as auth_created,
    au.last_sign_in_at,
    au.updated_at as last_update
FROM auth.users au
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
ORDER BY au.email;

-- Step 3: Check profiles (if table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN
        RAISE NOTICE 'Profiles table exists - checking admin profiles...';
    ELSE
        RAISE NOTICE 'Profiles table does not exist';
    END IF;
END $$;

-- Show existing profiles for admin users
SELECT 
    'EXISTING PROFILES:' as info,
    '' as spacer;

SELECT 
    p.id,
    p.username,
    p.full_name,
    au.email
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org');

-- Step 4: Reset password for admin@aihow.org
UPDATE auth.users 
SET 
    encrypted_password = crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'admin@aihow.org';

-- Check result
SELECT 
    CASE 
        WHEN ROW_COUNT > 0 THEN 'SUCCESS: Password updated for admin@aihow.org'
        ELSE 'INFO: admin@aihow.org not found (may not exist)'
    END as admin_result;

-- Step 5: Reset password for testadmin@aihow.org  
UPDATE auth.users 
SET 
    encrypted_password = crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    updated_at = NOW()
WHERE email = 'testadmin@aihow.org';

-- Check result
SELECT 
    CASE 
        WHEN ROW_COUNT > 0 THEN 'SUCCESS: Password updated for testadmin@aihow.org'
        ELSE 'INFO: testadmin@aihow.org not found (may not exist)'
    END as testadmin_result;

-- Step 6: Create/update profiles for admin users (if profiles table exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN
        -- Insert or update profiles for admin users
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
            updated_at = EXCLUDED.updated_at;
        
        RAISE NOTICE 'Admin profiles created/updated successfully';
    ELSE
        RAISE NOTICE 'Profiles table does not exist - skipping profile creation';
    END IF;
END $$;

-- Step 7: Show final status
SELECT 
    'FINAL STATUS AFTER PASSWORD RESET:' as info,
    '' as spacer;

SELECT 
    au.email,
    au.id as user_id,
    CASE 
        WHEN p.id IS NOT NULL THEN p.full_name
        ELSE 'No profile'
    END as profile_name,
    au.updated_at as password_last_updated
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
ORDER BY au.email;

-- Step 8: Summary
SELECT 
    'PASSWORD RESET COMPLETED!' as status,
    'New Password: AIhow@NewAdmin2025' as credentials,
    'Login URL: /admin/login' as login_page,
    'CHANGE PASSWORD AFTER FIRST LOGIN' as important_note;

-- Step 9: Check what columns the user_roles table actually has (for reference)
SELECT 
    'USER_ROLES TABLE STRUCTURE:' as info,
    '' as spacer;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_roles'
ORDER BY ordinal_position;