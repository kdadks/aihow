-- SIMPLE ADMIN ROLE FIX
-- =============================================================
-- This script provides a simple, robust fix for admin role assignment
-- =============================================================

DO $$
DECLARE
    admin_user_id UUID;
    admin_role_id UUID;
    legacy_role_id INTEGER;
BEGIN
    RAISE NOTICE '🔍 Starting simple admin role fix...';
    
    -- Step 1: Get admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'prashant.srivastav@gmail.com';
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE '❌ User not found! Please create user via Supabase Dashboard first.';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Found user: %', admin_user_id;
    
    -- Step 2: Ensure profile exists
    INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
    VALUES (
        admin_user_id,
        'prashant.srivastav@gmail.com',
        'Prashant Srivastav',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        updated_at = EXCLUDED.updated_at;
    
    RAISE NOTICE '✅ Profile ensured';
    
    -- Step 3: Try legacy structure first (most common)
    BEGIN
        -- Create admin role in roles table
        INSERT INTO public.roles (name, description)
        VALUES ('admin', 'System Administrator')
        ON CONFLICT (name) DO NOTHING;
        
        -- Get role ID
        SELECT id INTO legacy_role_id FROM public.roles WHERE name = 'admin';
        
        -- Assign role
        INSERT INTO public.user_roles (user_id, role_id)
        VALUES (admin_user_id, legacy_role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
        
        RAISE NOTICE '✅ Admin role assigned via legacy structure (roles -> user_roles)';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '⚠️  Legacy structure failed: %', SQLERRM;
    END;
    
    -- Step 4: Try direct assignment in user_roles table (if it has name column)
    BEGIN
        INSERT INTO public.user_roles (user_id, name, description, permissions)
        VALUES (
            admin_user_id,
            'admin',
            'System Administrator',
            '{
                "canManageUsers": true,
                "canManageContent": true,
                "canModerateContent": true,
                "canManageSettings": true,
                "canViewMetrics": true
            }'::jsonb
        ) ON CONFLICT (user_id, name) DO UPDATE SET
            permissions = EXCLUDED.permissions,
            description = EXCLUDED.description;
        
        RAISE NOTICE '✅ Admin role assigned via direct user_roles assignment';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '⚠️  Direct assignment failed: %', SQLERRM;
    END;
    
    RAISE NOTICE '🎉 Admin role setup completed!';
    RAISE NOTICE '💡 Try logging in at /admin/login';
    
END $$;

-- Simple verification - show what we have
SELECT 
    '=== ADMIN USER STATUS ===' as info,
    au.email,
    au.email_confirmed_at IS NOT NULL as email_confirmed,
    p.full_name,
    p.username
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'prashant.srivastav@gmail.com';

-- Check for any role assignments (with error handling)
DO $$
BEGIN
    -- Try Legacy Structure Check
    BEGIN
        RAISE NOTICE '=== CHECKING LEGACY STRUCTURE ===';
        PERFORM r.name, r.description
        FROM auth.users au
        JOIN public.user_roles ur ON au.id = ur.user_id
        JOIN public.roles r ON ur.role_id = r.id
        WHERE au.email = 'prashant.srivastav@gmail.com';
        
        RAISE NOTICE '✅ Legacy structure accessible';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '⚠️  Legacy structure check failed: %', SQLERRM;
    END;
    
    -- Try Direct Assignment Check
    BEGIN
        RAISE NOTICE '=== CHECKING DIRECT ASSIGNMENT ===';
        PERFORM ur.name, ur.permissions
        FROM auth.users au
        JOIN public.user_roles ur ON au.id = ur.user_id
        WHERE au.email = 'prashant.srivastav@gmail.com'
        AND ur.name IS NOT NULL;
        
        RAISE NOTICE '✅ Direct assignment structure accessible';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '⚠️  Direct assignment check failed: %', SQLERRM;
    END;
    
    -- Try New Structure Check
    BEGIN
        RAISE NOTICE '=== CHECKING NEW STRUCTURE ===';
        PERFORM ur.name, ur.permissions
        FROM auth.users au
        JOIN public.user_role_assignments ura ON au.id = ura.user_id
        JOIN public.user_roles ur ON ura.role_id = ur.id
        WHERE au.email = 'prashant.srivastav@gmail.com';
        
        RAISE NOTICE '✅ New structure accessible';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '⚠️  New structure check failed: %', SQLERRM;
    END;
END $$;

-- Safe verification queries with error handling
SELECT '=== ROLE CHECK 1: Legacy Structure ===' as info;
DO $$
DECLARE
    rec RECORD;
    role_count INTEGER := 0;
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'roles'
    ) THEN
        RAISE NOTICE 'Legacy roles table exists, checking assignments...';
        
        FOR rec IN 
            SELECT r.name as role_name, r.description
            FROM auth.users au
            JOIN public.user_roles ur ON au.id = ur.user_id
            JOIN public.roles r ON ur.role_id = r.id
            WHERE au.email = 'prashant.srivastav@gmail.com'
        LOOP
            RAISE NOTICE 'Role found: % - %', rec.role_name, rec.description;
            role_count := role_count + 1;
        END LOOP;
        
        IF role_count = 0 THEN
            RAISE NOTICE 'No roles found for user in legacy structure';
        END IF;
    ELSE
        RAISE NOTICE 'Legacy roles table does not exist';
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Legacy structure error: %', SQLERRM;
END $$;

-- Final status with safe checking
DO $$
DECLARE
    admin_found BOOLEAN := FALSE;
    status_message TEXT;
BEGIN
    -- Check Legacy Structure
    IF EXISTS (
        SELECT 1 FROM auth.users au
        JOIN public.user_roles ur ON au.id = ur.user_id
        JOIN public.roles r ON ur.role_id = r.id
        WHERE au.email = 'prashant.srivastav@gmail.com' AND r.name = 'admin'
    ) THEN
        admin_found := TRUE;
        status_message := '✅ ADMIN ROLE FOUND (Legacy Structure)';
    END IF;
    
    -- Check Direct Assignment (only if legacy didn't work)
    IF NOT admin_found THEN
        BEGIN
            IF EXISTS (
                SELECT 1 FROM auth.users au
                JOIN public.user_roles ur ON au.id = ur.user_id
                WHERE au.email = 'prashant.srivastav@gmail.com' 
                AND ur.name = 'admin'
            ) THEN
                admin_found := TRUE;
                status_message := '✅ ADMIN ROLE FOUND (Direct Assignment)';
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- Column doesn't exist, skip this check
            NULL;
        END;
    END IF;
    
    -- Check New Structure (only if others didn't work)
    IF NOT admin_found THEN
        BEGIN
            IF EXISTS (
                SELECT 1 FROM auth.users au
                JOIN public.user_role_assignments ura ON au.id = ura.user_id
                JOIN public.user_roles ur ON ura.role_id = ur.id
                WHERE au.email = 'prashant.srivastav@gmail.com' AND ur.name = 'admin'
            ) THEN
                admin_found := TRUE;
                status_message := '✅ ADMIN ROLE FOUND (New Structure)';
            END IF;
        EXCEPTION WHEN OTHERS THEN
            -- Tables don't exist, skip this check
            NULL;
        END;
    END IF;
    
    IF NOT admin_found THEN
        status_message := '❌ NO ADMIN ROLE FOUND';
    END IF;
    
    RAISE NOTICE '%', status_message;
END $$;
