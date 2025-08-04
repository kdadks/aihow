-- DIAGNOSTIC SCRIPT FOR DATABASE STATE
-- =============================================================
-- This script helps diagnose the current database state
-- to understand the Unified Auth changes and table structure
-- =============================================================

-- Step 1: Check what users exist in auth.users
SELECT 
    'AUTH.USERS TABLE CONTENTS:' as info,
    '' as spacer;

SELECT 
    email,
    id,
    created_at,
    email_confirmed_at,
    aud,
    role
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Step 2: Check profiles table contents
SELECT 
    'PUBLIC.PROFILES TABLE CONTENTS:' as info,
    '' as spacer;

SELECT 
    p.id,
    p.username,
    p.full_name,
    p.created_at,
    CASE 
        WHEN au.id IS NOT NULL THEN 'HAS AUTH USER'
        ELSE 'ORPHANED PROFILE'
    END as auth_status
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Step 3: Find orphaned profiles (profiles without auth.users)
SELECT 
    'ORPHANED PROFILES (NO AUTH USER):' as info,
    '' as spacer;

SELECT 
    p.id as orphaned_id,
    p.username,
    p.full_name,
    'This profile has no auth.users entry' as issue
FROM public.profiles p
LEFT JOIN auth.users au ON p.id = au.id
WHERE au.id IS NULL;

-- Step 4: Check what role-related tables exist
SELECT 
    'ROLE-RELATED TABLES:' as info,
    '' as spacer;

SELECT 
    table_name,
    CASE 
        WHEN table_name LIKE '%role%' THEN 'Role table'
        WHEN table_name = 'profiles' THEN 'Profile table'
        ELSE 'Other'
    END as table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%role%' OR table_name = 'profiles')
ORDER BY table_name;

-- Step 5: Check structure of user_roles table
SELECT 
    'USER_ROLES TABLE STRUCTURE:' as info,
    '' as spacer;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_roles'
ORDER BY ordinal_position;

-- Step 6: Check if user_role_assignments exists and its structure
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) THEN
        RAISE NOTICE 'user_role_assignments table exists';
    ELSE
        RAISE NOTICE 'user_role_assignments table does NOT exist';
    END IF;
END $$;

-- Step 7: Check profiles table structure
SELECT 
    'PROFILES TABLE STRUCTURE:' as info,
    '' as spacer;

SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Step 8: Check for specific email we're trying to create
SELECT 
    'SUPPORT EMAIL CHECK:' as info,
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'support@kdadks.com')
        THEN 'Found in auth.users'
        ELSE 'NOT found in auth.users'
    END as auth_status,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM public.profiles p 
            JOIN auth.users au ON p.id = au.id 
            WHERE au.email = 'support@kdadks.com'
        )
        THEN 'Found in profiles (with auth)'
        ELSE 'NOT found in profiles (with auth)'
    END as profile_status;

-- Step 9: Show recent activity/changes
SELECT 
    'RECENT ACTIVITY:' as info,
    '' as spacer;

-- Show recent auth.users entries
SELECT 
    'Recent auth.users:' as type,
    email,
    id,
    created_at
FROM auth.users
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- Show recent profiles entries
SELECT 
    'Recent profiles:' as type,
    username,
    id,
    created_at
FROM public.profiles
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;