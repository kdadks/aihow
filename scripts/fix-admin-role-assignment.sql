-- FIX ADMIN ROLE ASSIGNMENT FOR prashant.srivastav@gmail.com
-- =============================================================
-- This script ensures the admin user has proper role assignments
-- that work with the AdminAuthContext frontend code
-- =============================================================

-- Step 1: Get the admin user ID
DO $$
DECLARE
    admin_user_id UUID;
    admin_role_id UUID;
    profile_exists BOOLEAN := FALSE;
    role_assignment_exists BOOLEAN := FALSE;
BEGIN
    -- Find the admin user by email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'prashant.srivastav@gmail.com';
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE '❌ Admin user prashant.srivastav@gmail.com not found in auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Found admin user with ID: %', admin_user_id;
    
    -- Step 2: Ensure profile exists
    SELECT EXISTS(
        SELECT 1 FROM public.profiles WHERE id = admin_user_id
    ) INTO profile_exists;
    
    IF NOT profile_exists THEN
        INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
        VALUES (
            admin_user_id,
            'prashant.srivastav@gmail.com',
            'Prashant Srivastav',
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Created profile for admin user';
    ELSE
        RAISE NOTICE '✅ Profile already exists for admin user';
    END IF;
    
    -- Step 3: Ensure admin role exists in user_roles table
    -- Check if user_roles table has 'name' column (new structure)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles' 
        AND column_name = 'name'
    ) THEN
        -- New structure: user_roles has name and permissions columns
        INSERT INTO public.user_roles (name, description, permissions)
        VALUES (
            'admin',
            'System Administrator with full access',
            '{
                "canManageUsers": true,
                "canManageContent": true,
                "canModerateContent": true,
                "canManageSettings": true,
                "canViewMetrics": true,
                "canManageRoles": true,
                "canViewAnalytics": true
            }'::jsonb
        ) ON CONFLICT (name) DO UPDATE SET
            permissions = EXCLUDED.permissions,
            description = EXCLUDED.description;
        
        SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';
        RAISE NOTICE '✅ Admin role created/updated in user_roles table with ID: %', admin_role_id;
        
        -- Step 4: Assign role using user_role_assignments table
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
        ) THEN
            INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
            VALUES (admin_user_id, admin_role_id, admin_user_id, NOW())
            ON CONFLICT (user_id, role_id) DO NOTHING;
            
            RAISE NOTICE '✅ Admin role assigned via user_role_assignments table';
        END IF;
        
    ELSE
        -- Legacy structure: user_roles is the assignment table
        -- Ensure roles table has admin role
        INSERT INTO public.roles (name, description)
        VALUES ('admin', 'System Administrator')
        ON CONFLICT (name) DO NOTHING;
        
        SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
        
        -- Direct assignment in user_roles table
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (admin_user_id, admin_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
        
        RAISE NOTICE '✅ Admin role assigned via legacy user_roles table';
    END IF;
    
    RAISE NOTICE '🎉 Admin role assignment completed successfully!';
    
END $$;

-- Step 5: Verify the setup
SELECT 
    '=== ADMIN USER VERIFICATION ===' as section,
    au.email,
    au.id as user_id,
    p.full_name,
    p.username
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'prashant.srivastav@gmail.com';

-- Check role assignments (new structure)
SELECT 
    '=== ROLE ASSIGNMENTS (NEW STRUCTURE) ===' as section,
    ur.name as role_name,
    ur.permissions,
    ura.assigned_at
FROM auth.users au
JOIN public.user_role_assignments ura ON au.id = ura.user_id
JOIN public.user_roles ur ON ura.role_id = ur.id
WHERE au.email = 'prashant.srivastav@gmail.com';

-- Check role assignments (legacy structure)
SELECT 
    '=== ROLE ASSIGNMENTS (LEGACY STRUCTURE) ===' as section,
    r.name as role_name,
    r.description
FROM auth.users au
JOIN public.user_roles ur ON au.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
WHERE au.email = 'prashant.srivastav@gmail.com';

-- Final confirmation
SELECT 
    '🎉 SETUP COMPLETE!' as status,
    'User: prashant.srivastav@gmail.com' as admin_email,
    'Try logging in at /admin/login' as next_step,
    'AdminAuthContext should now recognize admin permissions' as note;
