-- CREATE FRESH ADMIN USER SCRIPT
-- =============================================================
-- Creates a brand new admin user: support@kdadks.com
-- Since the user doesn't exist, this will create everything from scratch
-- 
-- ADMIN CREDENTIALS:
-- Email: support@kdadks.com
-- Password: AIhow@NewAdmin2025
-- =============================================================

-- Step 1: Verify user doesn't exist
SELECT 
    'VERIFICATION - USER SHOULD NOT EXIST:' as info,
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email = 'support@kdadks.com')
        THEN '❌ ERROR: User already exists!'
        ELSE '✅ CONFIRMED: User does not exist - ready to create'
    END as verification_result;

-- Step 2: Create the admin user in auth.users
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
    gen_random_uuid(),
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

-- Step 3: Verify user was created successfully
SELECT 
    'USER CREATION RESULT:' as info,
    id as user_id,
    email,
    email_confirmed_at,
    aud,
    role,
    created_at
FROM auth.users 
WHERE email = 'support@kdadks.com';

-- Step 4: Create profile for the new admin user
INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    'System Administrator',
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'support@kdadks.com';

-- Step 5: Verify profile was created
SELECT 
    'PROFILE CREATION RESULT:' as info,
    p.id,
    au.email,
    p.username,
    p.full_name,
    p.created_at
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'support@kdadks.com';

-- Step 6: Assign admin role (handle any table structure)
DO $$
DECLARE
    new_user_id UUID;
    admin_role_id UUID;
    role_assigned BOOLEAN := FALSE;
BEGIN
    -- Get the new user ID
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'support@kdadks.com';
    RAISE NOTICE 'Working with user ID: %', new_user_id;
    
    -- Try user_roles with name column (modern structure)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name'
    ) THEN
        RAISE NOTICE 'Found modern user_roles table with name column';
        
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
        
        -- Assign via user_role_assignments if it exists
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
        ) THEN
            SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';
            
            INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
            VALUES (new_user_id, admin_role_id, new_user_id, NOW());
            
            role_assigned := TRUE;
            RAISE NOTICE 'Admin role assigned via user_role_assignments';
        END IF;
        
    -- Try legacy roles table
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'roles'
    ) THEN
        RAISE NOTICE 'Found legacy roles table';
        
        -- Create admin role
        INSERT INTO public.roles (name, description)
        VALUES ('admin', 'Full system access')
        ON CONFLICT (name) DO NOTHING;
        
        -- Assign via user_roles junction table
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
        ) THEN
            SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
            
            INSERT INTO public.user_roles (user_id, role_id, created_at)
            VALUES (new_user_id, admin_role_id, NOW());
            
            role_assigned := TRUE;
            RAISE NOTICE 'Admin role assigned via legacy user_roles junction';
        END IF;
    ELSE
        RAISE NOTICE 'No recognized role tables found';
    END IF;
    
    IF NOT role_assigned THEN
        RAISE NOTICE 'WARNING: Could not assign admin role - user created without role';
    END IF;
END $$;

-- Step 7: Final verification of complete setup
SELECT 
    'FINAL SETUP VERIFICATION:' as info,
    au.email as login_email,
    au.id as user_id,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMED'
        ELSE '❌ EMAIL NOT CONFIRMED'
    END as email_status,
    CASE 
        WHEN au.aud = 'authenticated' AND au.role = 'authenticated' THEN '✅ AUTH STATUS OK'
        ELSE '❌ AUTH STATUS PROBLEM'
    END as auth_status,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅ PROFILE EXISTS'
        ELSE '❌ NO PROFILE'
    END as profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'support@kdadks.com';

-- Step 8: Show what role tables exist for reference
SELECT 
    'ROLE TABLES IN DATABASE:' as info,
    string_agg(table_name, ', ') as role_related_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%role%' OR table_name = 'profiles');

-- Step 9: Success message
SELECT 
    '🎉 NEW ADMIN USER CREATED SUCCESSFULLY!' as status,
    'Email: support@kdadks.com' as login_email,
    'Password: AIhow@NewAdmin2025' as login_password,
    'URL: /admin/login' as login_url,
    'Ready to test login!' as next_step;