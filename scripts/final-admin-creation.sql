-- FINAL ADMIN CREATION SCRIPT
-- =============================================================
-- This script works with Unified Auth changes and uses a fixed UUID
-- to avoid random generation conflicts with orphaned profiles
-- 
-- ADMIN CREDENTIALS:
-- Email: support@kdadks.com
-- Password: AIhow@NewAdmin2025
-- =============================================================

-- Use a fixed UUID to avoid conflicts
-- This UUID will be consistent across runs
DO $$
DECLARE
    fixed_admin_uuid UUID := 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::UUID;
    email_to_create TEXT := 'support@kdadks.com';
BEGIN
    RAISE NOTICE 'Starting admin creation with fixed UUID: %', fixed_admin_uuid;
    RAISE NOTICE 'Email to create: %', email_to_create;
END $$;

-- Step 1: Complete cleanup - remove ANY trace of the email or conflicting UUIDs
DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
);

-- Remove any role assignments if they exist
DO $$
BEGIN
    -- Check for user_role_assignments table
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) THEN
        DELETE FROM public.user_role_assignments WHERE user_id IN (
            SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
        );
        RAISE NOTICE 'Cleaned user_role_assignments';
    END IF;
    
    -- Check for legacy user_roles junction table
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
    ) THEN
        DELETE FROM public.user_roles WHERE user_id IN (
            SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
        );
        RAISE NOTICE 'Cleaned legacy user_roles';
    END IF;
END $$;

-- Remove from auth.users
DELETE FROM auth.users WHERE email = 'support@kdadks.com';

-- Step 2: Also clean up any orphaned profiles that might conflict with our fixed UUID
DELETE FROM public.profiles WHERE id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::UUID;

-- Step 3: Verify complete cleanup
SELECT 
    'CLEANUP VERIFICATION:' as info,
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'support@kdadks.com')
        THEN '❌ ERROR: User still exists in auth.users'
        ELSE '✅ No user in auth.users'
    END as auth_users_status,
    CASE 
        WHEN EXISTS(SELECT 1 FROM public.profiles WHERE id = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::UUID)
        THEN '❌ ERROR: Profile with fixed UUID still exists'
        ELSE '✅ Fixed UUID is clean'
    END as fixed_uuid_status;

-- Step 4: Create admin user with fixed UUID
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
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::UUID,
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

-- Step 5: Verify user creation
SELECT 
    'USER CREATION RESULT:' as info,
    id as user_id,
    email,
    email_confirmed_at,
    aud,
    role,
    'Successfully created' as status
FROM auth.users 
WHERE email = 'support@kdadks.com';

-- Step 6: Create profile with the same fixed UUID
INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
VALUES (
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::UUID,
    'support@kdadks.com',
    'System Administrator',
    NOW(),
    NOW()
);

-- Step 7: Verify profile creation
SELECT 
    'PROFILE CREATION RESULT:' as info,
    p.id,
    au.email,
    p.username,
    p.full_name,
    'Successfully created' as status
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'support@kdadks.com';

-- Step 8: Try to assign admin role (adapted for Unified Auth changes)
DO $$
DECLARE
    admin_user_id UUID := 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'::UUID;
    admin_role_id UUID;
    role_assigned BOOLEAN := FALSE;
BEGIN
    -- Try different role assignment approaches based on available tables
    
    -- Approach 1: Modern user_roles with user_role_assignments
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_roles'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name'
    ) THEN
        RAISE NOTICE 'Using modern user_roles structure';
        
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
        
        -- Assign via user_role_assignments
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
        ) THEN
            SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';
            
            INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
            VALUES (admin_user_id, admin_role_id, admin_user_id, NOW());
            
            role_assigned := TRUE;
            RAISE NOTICE 'Admin role assigned via user_role_assignments';
        END IF;
    END IF;
    
    -- Approach 2: Legacy structure
    IF NOT role_assigned AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'roles'
    ) THEN
        RAISE NOTICE 'Using legacy roles structure';
        
        INSERT INTO public.roles (name, description)
        VALUES ('admin', 'Full system access')
        ON CONFLICT (name) DO NOTHING;
        
        -- Check if user_roles is junction table
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
        RAISE NOTICE 'Could not assign role - check table structure after Unified Auth changes';
    END IF;
END $$;

-- Step 9: Final verification
SELECT 
    'FINAL VERIFICATION:' as info,
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

-- Step 10: Success message
SELECT 
    '🎉 ADMIN USER CREATED WITH FIXED UUID!' as status,
    'Email: support@kdadks.com' as login_email,
    'Password: AIhow@NewAdmin2025' as login_password,
    'UUID: aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' as user_id,
    'URL: /admin/login' as login_url;