-- Diagnose signup error: Database error saving new user
-- Run this in Supabase SQL Editor to identify the issue

-- 1. Check if handle_new_user function exists and is properly defined
SELECT 
    p.proname as function_name,
    p.prosrc as function_body,
    p.prorettype::regtype as return_type
FROM pg_proc p
WHERE p.proname = 'handle_new_user';

-- 2. Check if the trigger exists and is active
SELECT 
    t.tgname as trigger_name,
    t.tgenabled as enabled,
    c.relname as table_name,
    p.proname as function_name
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE t.tgname = 'on_auth_user_created';

-- 3. Check if profiles table exists and has correct structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Check if roles table exists and has 'user' role
SELECT 
    id,
    name,
    description,
    level
FROM public.roles
WHERE name = 'user';

-- 5. Check if user_roles table exists and has correct structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'user_roles'
ORDER BY ordinal_position;

-- 6. Check RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 7. Check if there are any constraint violations or foreign key issues
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
    AND tc.table_schema = ccu.table_schema
WHERE tc.table_schema = 'public' 
    AND tc.table_name IN ('profiles', 'user_roles', 'roles')
ORDER BY tc.table_name, tc.constraint_type;

-- 8. Test the handle_new_user function manually
-- This simulates what happens during signup
DO $$
DECLARE
    test_user_id uuid := gen_random_uuid();
    test_email text := 'test@example.com';
    test_name text := 'Test User';
    default_role_id bigint;
    error_msg text;
BEGIN
    -- Check if default role exists
    SELECT id INTO default_role_id
    FROM public.roles
    WHERE name = 'user';
    
    IF default_role_id IS NULL THEN
        RAISE NOTICE 'ERROR: Default user role does not exist in roles table';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Default user role found: %', default_role_id;
    
    -- Try to insert into profiles table
    BEGIN
        INSERT INTO public.profiles (id, username, full_name)
        VALUES (test_user_id, test_email, test_name);
        RAISE NOTICE 'SUCCESS: Profile insertion successful';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS error_msg = MESSAGE_TEXT;
        RAISE NOTICE 'ERROR inserting into profiles: %', error_msg;
        RETURN;
    END;
    
    -- Try to insert into user_roles table
    BEGIN
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (test_user_id, default_role_id);
        RAISE NOTICE 'SUCCESS: User role assignment successful';
    EXCEPTION WHEN OTHERS THEN
        GET STACKED DIAGNOSTICS error_msg = MESSAGE_TEXT;
        RAISE NOTICE 'ERROR inserting into user_roles: %', error_msg;
    END;
    
    -- Clean up test data
    DELETE FROM public.user_roles WHERE user_id = test_user_id;
    DELETE FROM public.profiles WHERE id = test_user_id;
    RAISE NOTICE 'Test data cleaned up';
    
END $$;

-- 9. Check for any recent errors in database logs (if accessible)
-- Note: This might not be accessible in hosted Supabase
-- But it's good to include for local development
SELECT 
    'Check database logs for recent errors related to trigger execution' as instruction;