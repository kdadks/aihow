-- Diagnostic script to check admin portal database state
-- Run this in Supabase SQL Editor to diagnose the issue

RAISE NOTICE '=== DIAGNOSTIC REPORT ===';

-- 1. Check if roles table exists and has data
DO $$
DECLARE
    role_count INTEGER;
BEGIN
    RAISE NOTICE '1. Checking roles table...';
    SELECT COUNT(*) INTO role_count FROM public.roles;
    RAISE NOTICE '   Roles found: %', role_count;
    
    IF role_count > 0 THEN
        RAISE NOTICE '   Role details:';
        FOR role_record IN SELECT id, name, permissions FROM public.roles LOOP
            RAISE NOTICE '     - ID: %, Name: %, Has Permissions: %', 
                role_record.id, 
                role_record.name, 
                (role_record.permissions IS NOT NULL);
        END LOOP;
    ELSE
        RAISE NOTICE '   ❌ NO ROLES FOUND! Run the migration first.';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '   ❌ ERROR: roles table may not exist - %', SQLERRM;
END $$;

-- 2. Check if user_roles table exists
DO $$
DECLARE
    assignment_count INTEGER;
BEGIN
    RAISE NOTICE '2. Checking user_roles table...';
    SELECT COUNT(*) INTO assignment_count FROM public.user_roles;
    RAISE NOTICE '   Role assignments found: %', assignment_count;
    
    IF assignment_count = 0 THEN
        RAISE NOTICE '   ⚠️  NO ROLE ASSIGNMENTS! You need to run assign-admin-role.sql';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '   ❌ ERROR: user_roles table may not exist - %', SQLERRM;
END $$;

-- 3. Check auth.users
DO $$
DECLARE
    user_count INTEGER;
BEGIN
    RAISE NOTICE '3. Checking auth.users...';
    SELECT COUNT(*) INTO user_count FROM auth.users;
    RAISE NOTICE '   Users found: %', user_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '   ❌ ERROR checking users - %', SQLERRM;
END $$;

-- 4. Show all users and their roles (if any)
RAISE NOTICE '4. Current user role assignments:';

SELECT 
    u.email,
    u.id as user_id,
    r.name as role_name,
    r.id as role_id,
    ur.assigned_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON ur.user_id = u.id
LEFT JOIN public.roles r ON r.id = ur.role_id
ORDER BY u.email;

-- 5. Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('roles', 'user_roles')
ORDER BY tablename;

-- 6. List policies on user_roles
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'user_roles'
ORDER BY policyname;

RAISE NOTICE '=== END DIAGNOSTIC REPORT ===';
