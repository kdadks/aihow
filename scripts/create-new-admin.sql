-- CREATE NEW ADMIN USER SCRIPT
-- =============================================================
-- Creates a fresh admin user: support@kdadks.com
-- This will have proper Supabase Auth integration and work correctly
-- 
-- NEW ADMIN CREDENTIALS:
-- Email: support@kdadks.com
-- Password: AIhow@NewAdmin2025
-- =============================================================

-- Step 1: Remove any existing user with this email (clean slate)
DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
);

-- Remove from role assignments if they exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) THEN
        DELETE FROM public.user_role_assignments WHERE user_id IN (
            SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
        );
    END IF;
END $$;

-- Remove from legacy user_roles if they exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
    ) THEN
        DELETE FROM public.user_roles WHERE user_id IN (
            SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
        );
    END IF;
END $$;

-- Remove from auth.users
DELETE FROM auth.users WHERE email = 'support@kdadks.com';

-- Step 2: Create the new admin user in auth.users
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

-- Step 3: Get the new user ID and show it
SELECT 
    'NEW ADMIN USER CREATED:' as info,
    id as user_id,
    email,
    created_at,
    email_confirmed_at as confirmed_at
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

-- Step 5: Check what role tables exist and assign admin role accordingly
DO $$
DECLARE
    new_user_id UUID;
    admin_role_id UUID;
BEGIN
    -- Get the new user ID
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'support@kdadks.com';
    
    -- Check if modern user_roles table exists (with name column)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name'
    ) THEN
        RAISE NOTICE 'Using modern user_roles table structure';
        
        -- Create admin role if it doesn't exist
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
        
        -- Assign role via user_role_assignments
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
        ) THEN
            SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';
            
            INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
            VALUES (new_user_id, admin_role_id, new_user_id, NOW());
            
            RAISE NOTICE 'Admin role assigned via user_role_assignments table';
        END IF;
        
    -- Check if legacy roles table exists
    ELSIF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'roles'
    ) THEN
        RAISE NOTICE 'Using legacy roles table structure';
        
        -- Create admin role if it doesn't exist
        INSERT INTO public.roles (name, description)
        VALUES ('admin', 'Full system access')
        ON CONFLICT (name) DO NOTHING;
        
        -- Check if user_roles is a junction table
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
        ) THEN
            SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
            
            INSERT INTO public.user_roles (user_id, role_id, created_at)
            VALUES (new_user_id, admin_role_id, NOW());
            
            RAISE NOTICE 'Admin role assigned via legacy user_roles junction table';
        END IF;
        
    ELSE
        RAISE NOTICE 'No recognizable role tables found - user created without role assignment';
    END IF;
END $$;

-- Step 6: Show final status
SELECT 
    'FINAL STATUS FOR NEW ADMIN:' as info,
    '' as spacer;

SELECT 
    au.email,
    au.id as user_id,
    p.username,
    p.full_name,
    au.email_confirmed_at as confirmed_at,
    au.aud as audience,
    au.role as auth_role,
    '✅ READY TO LOGIN' as status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'support@kdadks.com';

-- Step 7: Show role assignment status
SELECT 
    'ROLE ASSIGNMENT STATUS:' as info,
    '' as spacer;

-- Try to show role assignment from any table that exists
DO $$
BEGIN
    -- Check user_role_assignments table
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) THEN
        RAISE NOTICE 'Checking user_role_assignments table...';
        -- Note: We can't SELECT in a DO block, so just confirm it exists
    END IF;
    
    -- Check legacy user_roles junction table
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
    ) THEN
        RAISE NOTICE 'Checking legacy user_roles junction table...';
    END IF;
END $$;

-- Step 8: Final summary
SELECT 
    'NEW ADMIN USER READY!' as status,
    'Email: support@kdadks.com' as login_email,
    'Password: AIhow@NewAdmin2025' as login_password,
    'URL: /admin/login' as login_url,
    'This user should work with Supabase Auth' as note;

-- Step 9: Cleanup old problematic admin users (optional)
SELECT 
    'OLD ADMIN USERS (can be removed):' as info,
    email,
    id,
    'These have fake IDs and cause auth issues' as problem
FROM auth.users 
WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org');