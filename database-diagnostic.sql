-- =====================================================
-- DATABASE DIAGNOSTIC SCRIPT
-- =====================================================
-- Run this to see what tables and views actually exist

-- Check all tables in public schema
SELECT 
    'TABLES' as object_type,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check all views in public schema
SELECT 
    'VIEWS' as object_type,
    table_name,
    'VIEW' as table_type
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check for specific tables that might be causing conflicts
SELECT 
    'TABLE_CHECK' as info_type,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN 'profiles table EXISTS'
        ELSE 'profiles table NOT FOUND'
    END as profiles_status,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN 'user_profiles table EXISTS'
        ELSE 'user_profiles table NOT FOUND'
    END as user_profiles_status,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN 'user_roles table EXISTS'
        ELSE 'user_roles table NOT FOUND'
    END as user_roles_status,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_role_assignments') THEN 'user_role_assignments table EXISTS'
        WHEN EXISTS (SELECT FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'user_role_assignments') THEN 'user_role_assignments view EXISTS'
        ELSE 'user_role_assignments NOT FOUND'
    END as user_role_assignments_status,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users') THEN 'admin_users table EXISTS'
        ELSE 'admin_users table NOT FOUND'
    END as admin_users_status,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_roles') THEN 'admin_roles table EXISTS'
        ELSE 'admin_roles table NOT FOUND'
    END as admin_roles_status,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN 'users table EXISTS'
        WHEN EXISTS (SELECT FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'users') THEN 'users view EXISTS'
        ELSE 'users NOT FOUND'
    END as users_status;

-- Check user_roles table structure to see if it's junction table or definition table
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        RAISE NOTICE 'USER_ROLES TABLE STRUCTURE:';
        PERFORM column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles'
        ORDER BY ordinal_position;
    END IF;
END $$;

-- Show user_roles columns
SELECT 
    'USER_ROLES_COLUMNS' as info_type,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'user_roles'
ORDER BY ordinal_position;

-- Check for any tables with 'role' in the name
SELECT 
    'ROLE_RELATED_TABLES' as info_type,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%role%'
ORDER BY table_name;

-- Check for any tables with 'user' in the name
SELECT 
    'USER_RELATED_TABLES' as info_type,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%user%'
ORDER BY table_name;

-- Check for any tables with 'admin' in the name
SELECT 
    'ADMIN_RELATED_TABLES' as info_type,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%admin%'
ORDER BY table_name;