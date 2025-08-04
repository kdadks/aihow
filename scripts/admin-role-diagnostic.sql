-- QUICK ADMIN ROLE DIAGNOSTIC AND FIX
-- =============================================================
-- This script checks and fixes admin role for prashant.srivastav@gmail.com
-- =============================================================

DO $$
DECLARE
    admin_user_id UUID;
    user_exists BOOLEAN := FALSE;
    profile_exists BOOLEAN := FALSE;
    new_structure_exists BOOLEAN := FALSE;
    legacy_structure_exists BOOLEAN := FALSE;
    admin_role_id UUID;
BEGIN
    RAISE NOTICE '🔍 Starting admin role diagnostic...';
    
    -- Step 1: Check if user exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'prashant.srivastav@gmail.com';
    
    IF admin_user_id IS NOT NULL THEN
        user_exists := TRUE;
        RAISE NOTICE '✅ User exists with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE '❌ User prashant.srivastav@gmail.com not found!';
        RAISE NOTICE '💡 Please create the user via Supabase Dashboard first';
        RETURN;
    END IF;
    
    -- Step 2: Check profile
    SELECT EXISTS(
        SELECT 1 FROM public.profiles WHERE id = admin_user_id
    ) INTO profile_exists;
    
    IF profile_exists THEN
        RAISE NOTICE '✅ Profile exists';
    ELSE
        RAISE NOTICE '⚠️  Creating profile...';
        INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
        VALUES (
            admin_user_id,
            'prashant.srivastav@gmail.com',
            'Prashant Srivastav',
            NOW(),
            NOW()
        );
        RAISE NOTICE '✅ Profile created';
    END IF;
    
    -- Step 3: Check which role structure exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name'
    ) THEN
        new_structure_exists := TRUE;
        RAISE NOTICE '✅ New role structure detected (user_role_assignments + user_roles with name column)';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'roles'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'role_id'
    ) THEN
        legacy_structure_exists := TRUE;
        RAISE NOTICE '✅ Legacy role structure detected (roles + user_roles with role_id column)';
    END IF;
    
    -- Step 4: Set up roles based on structure
    IF new_structure_exists THEN
        RAISE NOTICE '🔧 Setting up admin role in new structure...';
        
        -- Check if user_roles table has UUID or integer ID
        DECLARE
            id_type TEXT;
            role_uuid UUID;
        BEGIN
            SELECT data_type INTO id_type
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'user_roles' 
            AND column_name = 'id';
            
            IF id_type = 'uuid' THEN
                -- UUID-based ID system
                role_uuid := gen_random_uuid();
                
                INSERT INTO public.user_roles (id, name, description, permissions)
                VALUES (
                    role_uuid,
                    'admin',
                    'System Administrator',
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
                    description = EXCLUDED.description
                RETURNING id INTO admin_role_id;
                
                -- Use the UUID for assignment
                INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
                VALUES (admin_user_id, admin_role_id, admin_user_id, NOW())
                ON CONFLICT (user_id, role_id) DO NOTHING;
                
            ELSE
                -- Integer-based ID system - this is likely the issue
                RAISE NOTICE '⚠️  Detected integer ID in user_roles table, but user_role_assignments expects UUID';
                RAISE NOTICE '💡 This indicates a schema mismatch. Trying alternative approach...';
                
                -- Try to insert without specifying ID and let it auto-increment
                INSERT INTO public.user_roles (name, description, permissions)
                VALUES (
                    'admin',
                    'System Administrator',
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
                
                -- Get the integer ID
                SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';
                
                -- Check if user_role_assignments actually exists and what type its role_id is
                DECLARE
                    assignment_role_type TEXT;
                BEGIN
                    SELECT data_type INTO assignment_role_type
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' 
                    AND table_name = 'user_role_assignments' 
                    AND column_name = 'role_id';
                    
                    IF assignment_role_type = 'uuid' THEN
                        RAISE NOTICE '❌ Schema mismatch: user_roles.id is integer but user_role_assignments.role_id is UUID';
                        RAISE NOTICE '💡 Skipping user_role_assignments - will use legacy structure instead';
                    ELSE
                        -- Both are integers, proceed with assignment
                        INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
                        VALUES (admin_user_id, admin_role_id, admin_user_id, NOW())
                        ON CONFLICT (user_id, role_id) DO NOTHING;
                    END IF;
                EXCEPTION
                    WHEN OTHERS THEN
                        RAISE NOTICE '⚠️  Could not assign via user_role_assignments: %', SQLERRM;
                END;
            END IF;
        END;
        
        RAISE NOTICE '✅ Admin role setup attempted in new structure';
    END IF;
    
    IF legacy_structure_exists THEN
        RAISE NOTICE '🔧 Setting up admin role in legacy structure...';
        
        -- Create admin role in roles table
        INSERT INTO public.roles (name, description)
        VALUES ('admin', 'System Administrator')
        ON CONFLICT (name) DO NOTHING;
        
        SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
        
        -- Assign role via user_roles table
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (admin_user_id, admin_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
        
        RAISE NOTICE '✅ Admin role assigned in legacy structure';
    END IF;
    
    IF NOT new_structure_exists AND NOT legacy_structure_exists THEN
        RAISE NOTICE '❌ No recognized role structure found!';
        RAISE NOTICE '💡 Please run the database migration scripts first';
    END IF;
    
    RAISE NOTICE '🎉 Admin role setup completed!';
    RAISE NOTICE '💡 Try logging in at /admin/login with prashant.srivastav@gmail.com';
    
END $$;

-- Verification queries
SELECT 
    '=== USER VERIFICATION ===' as section,
    au.email,
    au.id as user_id,
    p.full_name
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'prashant.srivastav@gmail.com';

-- Check new structure assignments
SELECT 
    '=== NEW STRUCTURE ROLES ===' as section,
    ur.name as role_name,
    ur.permissions
FROM auth.users au
JOIN public.user_role_assignments ura ON au.id = ura.user_id
JOIN public.user_roles ur ON ura.role_id = ur.id
WHERE au.email = 'prashant.srivastav@gmail.com'
AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name'
);

-- Check legacy structure assignments
SELECT 
    '=== LEGACY STRUCTURE ROLES ===' as section,
    r.name as role_name
FROM auth.users au
JOIN public.user_roles ur ON au.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
WHERE au.email = 'prashant.srivastav@gmail.com'
AND EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'roles'
);
