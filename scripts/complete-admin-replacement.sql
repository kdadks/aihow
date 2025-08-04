-- COMPLETE ADMIN REPLACEMENT SCRIPT
-- =============================================================
-- 1. Removes the fake admin@aihow.org user completely
-- 2. Creates a fresh working admin: support@kdadks.com
-- 3. Uses timestamp-based UUID to ensure uniqueness
-- 
-- NEW ADMIN CREDENTIALS:
-- Email: support@kdadks.com
-- Password: AIhow@NewAdmin2025
-- =============================================================

-- Step 1: Show what we're removing
SELECT 
    'EXISTING FAKE ADMIN DATA TO REMOVE:' as info,
    au.email,
    au.id as user_id,
    p.username,
    p.full_name,
    'This fake admin will be completely removed' as action
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'admin@aihow.org';

-- Step 2: Remove ALL traces of fake admin users
-- Remove from role assignments first (foreign key constraints)
DO $$
BEGIN
    -- Remove from user_role_assignments if exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) THEN
        DELETE FROM public.user_role_assignments WHERE user_id IN (
            SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
        );
        RAISE NOTICE 'Removed role assignments for fake admins';
    END IF;
    
    -- Remove from legacy user_roles junction if exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
    ) THEN
        DELETE FROM public.user_roles WHERE user_id IN (
            SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
        );
        RAISE NOTICE 'Removed legacy role assignments for fake admins';
    END IF;
END $$;

-- Remove profiles for fake admins
DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
);

-- Remove sessions for fake admins
DELETE FROM auth.sessions WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
);

-- Remove fake admin users from auth.users
DELETE FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org');

-- Step 3: Also remove any existing support@kdadks.com (clean slate)
DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
);

DELETE FROM auth.sessions WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
);

DELETE FROM auth.users WHERE email = 'support@kdadks.com';

-- Step 4: Verify complete cleanup
SELECT 
    'CLEANUP VERIFICATION:' as info,
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org', 'support@kdadks.com'))
        THEN '❌ ERROR: Some users still exist'
        ELSE '✅ All target users removed'
    END as cleanup_status;

-- Step 5: Generate a unique UUID using current timestamp
-- This ensures we won't conflict with any existing UUIDs
DO $$
DECLARE
    unique_uuid UUID;
    timestamp_seed TEXT;
BEGIN
    -- Create a unique seed from current timestamp
    timestamp_seed := EXTRACT(EPOCH FROM NOW())::TEXT;
    
    -- Use md5 hash of timestamp to create a deterministic but unique UUID
    unique_uuid := (
        SELECT md5(timestamp_seed || 'admin-user')::UUID
    );
    
    RAISE NOTICE 'Generated unique UUID: %', unique_uuid;
    
    -- Store in a temporary table for use in next steps
    CREATE TEMP TABLE IF NOT EXISTS temp_admin_uuid (id UUID);
    DELETE FROM temp_admin_uuid;
    INSERT INTO temp_admin_uuid VALUES (unique_uuid);
END $$;

-- Step 6: Create the new admin user with unique UUID
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
)
SELECT 
    '00000000-0000-0000-0000-000000000000'::UUID,
    tau.id,
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
FROM temp_admin_uuid tau;

-- Step 7: Verify user creation
SELECT 
    'NEW USER CREATION RESULT:' as info,
    id as user_id,
    email,
    email_confirmed_at,
    aud,
    role,
    'Successfully created with unique UUID' as status
FROM auth.users 
WHERE email = 'support@kdadks.com';

-- Step 8: Create profile with the same unique UUID
INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
SELECT 
    tau.id,
    'support@kdadks.com',
    'System Administrator',
    NOW(),
    NOW()
FROM temp_admin_uuid tau;

-- Step 9: Verify profile creation
SELECT 
    'PROFILE CREATION RESULT:' as info,
    p.id,
    au.email,
    p.username,
    p.full_name,
    'Profile created successfully' as status
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'support@kdadks.com';

-- Step 10: Assign admin role
DO $$
DECLARE
    admin_user_id UUID;
    admin_role_id UUID;
    role_assigned BOOLEAN := FALSE;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'support@kdadks.com';
    
    -- Try modern structure first
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_roles'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name'
    ) THEN
        -- Create admin role
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
            
            role_assigned := TRUE;
            RAISE NOTICE 'Admin role assigned successfully';
        END IF;
    END IF;
    
    -- Try legacy structure if modern didn't work
    IF NOT role_assigned AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'roles'
    ) THEN
        INSERT INTO public.roles (name, description)
        VALUES ('admin', 'Full system access')
        ON CONFLICT (name) DO NOTHING;
        
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
        ) THEN
            SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
            
            INSERT INTO public.user_roles (user_id, role_id, created_at)
            VALUES (admin_user_id, admin_role_id, NOW());
            
            role_assigned := TRUE;
            RAISE NOTICE 'Admin role assigned via legacy structure';
        END IF;
    END IF;
    
    IF NOT role_assigned THEN
        RAISE NOTICE 'Role assignment skipped - check table structure';
    END IF;
END $$;

-- Step 11: Final verification
SELECT 
    'FINAL ADMIN USER STATUS:' as info,
    au.email,
    au.id as user_id,
    p.username,
    p.full_name,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMED'
        ELSE '❌ EMAIL NOT CONFIRMED'
    END as email_status,
    CASE 
        WHEN au.aud = 'authenticated' AND au.role = 'authenticated' THEN '✅ AUTH STATUS OK'
        ELSE '❌ AUTH STATUS PROBLEM'
    END as auth_status
FROM auth.users au
JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'support@kdadks.com';

-- Step 12: Cleanup temp table
DROP TABLE IF EXISTS temp_admin_uuid;

-- Step 13: Success message
SELECT 
    '🎉 ADMIN REPLACEMENT COMPLETED!' as status,
    'Fake admin@aihow.org removed' as cleanup_result,
    'Email: support@kdadks.com' as new_login_email,
    'Password: AIhow@NewAdmin2025' as new_login_password,
    'URL: /admin/login' as login_url,
    'Ready to test!' as next_step;