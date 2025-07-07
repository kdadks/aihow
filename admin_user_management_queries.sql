-- =====================================================
-- ADMIN USER MANAGEMENT QUERIES
-- =====================================================
-- Additional queries for admin user management and verification
-- Use these queries individually as needed

-- =====================================================
-- QUERY 1: VERIFY CURRENT DATABASE STATE
-- =====================================================
-- Run this to check what users and data currently exist

-- Check all users in auth.users
SELECT 
    'Current Auth Users' as info_type,
    id,
    email,
    is_super_admin,
    created_at,
    raw_user_meta_data->>'role' as metadata_role
FROM auth.users
ORDER BY created_at DESC;

-- Check all profiles
SELECT 
    'Current Profiles' as info_type,
    id,
    username,
    full_name,
    created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Check role assignments
SELECT 
    'Role Assignments' as info_type,
    p.username,
    p.full_name,
    r.name as role_name,
    ur.created_at
FROM public.profiles p
JOIN public.user_roles ur ON p.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
ORDER BY ur.created_at DESC;

-- Count records in each table
SELECT 
    'Table Record Counts' as info_type,
    'auth.users' as table_name,
    COUNT(*) as record_count
FROM auth.users
UNION ALL
SELECT 'Table Record Counts', 'public.profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'Table Record Counts', 'public.user_roles', COUNT(*) FROM public.user_roles
UNION ALL
SELECT 'Table Record Counts', 'public.blog_posts', COUNT(*) FROM public.blog_posts
UNION ALL
SELECT 'Table Record Counts', 'public.forum_topics', COUNT(*) FROM public.forum_topics
UNION ALL
SELECT 'Table Record Counts', 'public.forum_replies', COUNT(*) FROM public.forum_replies
UNION ALL
SELECT 'Table Record Counts', 'public.tool_reviews', COUNT(*) FROM public.tool_reviews
UNION ALL
SELECT 'Table Record Counts', 'public.workflows', COUNT(*) FROM public.workflows
UNION ALL
SELECT 'Table Record Counts', 'public.tool_bundles', COUNT(*) FROM public.tool_bundles
UNION ALL
SELECT 'Table Record Counts', 'public.content_items', COUNT(*) FROM public.content_items
UNION ALL
SELECT 'Table Record Counts', 'public.activity_logs', COUNT(*) FROM public.activity_logs;

-- =====================================================
-- QUERY 2: SELECTIVE USER CLEANUP (PRESERVE ADMIN)
-- =====================================================
-- Use this if you want to keep existing admin but remove other users

-- First, identify the admin user
SELECT 
    u.id as admin_user_id,
    u.email,
    p.username,
    r.name as role_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
WHERE r.name = 'admin'
   OR u.is_super_admin = true
   OR u.email LIKE '%admin%';

-- Delete non-admin users (uncomment to execute)
/*
-- Delete user content first
DELETE FROM public.user_saved_items 
WHERE user_id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);

DELETE FROM public.forum_replies 
WHERE author_id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);

DELETE FROM public.forum_topics 
WHERE author_id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);

DELETE FROM public.blog_posts 
WHERE author_id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);

DELETE FROM public.tool_reviews 
WHERE user_id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);

DELETE FROM public.workflows 
WHERE creator_id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);

DELETE FROM public.tool_bundles 
WHERE creator_id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);

-- Delete non-admin user role assignments
DELETE FROM public.user_roles 
WHERE user_id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);

-- Delete non-admin profiles
DELETE FROM public.profiles 
WHERE id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);

-- Delete non-admin auth users
DELETE FROM auth.users 
WHERE id NOT IN (
    SELECT u.id FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
);
*/

-- =====================================================
-- QUERY 3: CREATE ADMIN USER (STANDALONE)
-- =====================================================
-- Use this to create just an admin user without full cleanup

DO $$
DECLARE
    admin_user_id UUID;
    admin_role_id BIGINT;
    admin_exists BOOLEAN := FALSE;
BEGIN
    -- Check if admin already exists
    SELECT EXISTS(
        SELECT 1 FROM auth.users u
        JOIN public.user_roles ur ON u.id = ur.user_id
        JOIN public.roles r ON ur.role_id = r.id
        WHERE r.name = 'admin'
    ) INTO admin_exists;
    
    IF admin_exists THEN
        RAISE NOTICE 'Admin user already exists. Skipping creation.';
        RETURN;
    END IF;

    -- Ensure admin role exists
    INSERT INTO public.roles (name, description) VALUES
        ('admin', 'Full system access with all permissions')
    ON CONFLICT (name) DO NOTHING;

    -- Get admin role id
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Failed to find or create admin role';
    END IF;

    -- Create admin user
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        raw_app_meta_data,
        created_at,
        updated_at,
        is_super_admin,
        is_anonymous,
        role
    )
    VALUES (
        gen_random_uuid(),
        'admin@aihow.org',
        crypt('AIhowAdmin2025!', gen_salt('bf', 10)),
        NOW(),
        '{"full_name": "System Administrator", "role": "admin"}'::jsonb,
        '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
        NOW(),
        NOW(),
        true,
        false,
        'admin'
    )
    RETURNING id INTO admin_user_id;

    -- Create admin profile
    INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
    VALUES (admin_user_id, 'admin', 'System Administrator', NOW(), NOW());

    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role_id, created_at)
    VALUES (admin_user_id, admin_role_id, NOW());

    RAISE NOTICE 'New admin user created successfully!';
    RAISE NOTICE 'Email: admin@aihow.org';
    RAISE NOTICE 'Password: AIhowAdmin2025!';
    RAISE NOTICE 'User ID: %', admin_user_id;

EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Failed to create admin user: %', SQLERRM;
END $$;

-- =====================================================
-- QUERY 4: UPDATE ADMIN PASSWORD
-- =====================================================
-- Use this to change admin password

DO $$
DECLARE
    admin_user_id UUID;
    new_password TEXT := 'NewAdminPassword2025!';
BEGIN
    -- Find admin user
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@aihow.org';
    
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Admin user not found';
    END IF;
    
    -- Update password
    UPDATE auth.users 
    SET encrypted_password = crypt(new_password, gen_salt('bf', 10)),
        updated_at = NOW()
    WHERE id = admin_user_id;
    
    RAISE NOTICE 'Admin password updated successfully!';
    RAISE NOTICE 'New password: %', new_password;
    
EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Failed to update admin password: %', SQLERRM;
END $$;

-- =====================================================
-- QUERY 5: VERIFY ADMIN PERMISSIONS
-- =====================================================
-- Check what permissions the admin has

SELECT 
    'Admin Permissions' as info_type,
    u.email,
    r.name as role_name,
    p.name as permission_name,
    p.description as permission_description,
    p.category as permission_category
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
JOIN public.role_permissions rp ON r.id = rp.role_id
JOIN public.permissions p ON rp.permission_id = p.id
WHERE u.email = 'admin@aihow.org'
ORDER BY p.category, p.name;

-- =====================================================
-- QUERY 6: GRANT SPECIFIC PERMISSIONS TO ADMIN
-- =====================================================
-- Use this to ensure admin has all necessary permissions

DO $$
DECLARE
    admin_role_id BIGINT;
    missing_permissions TEXT[];
BEGIN
    -- Get admin role id
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Admin role not found';
    END IF;
    
    -- Ensure all permissions exist
    INSERT INTO public.permissions (name, description, category) VALUES
        ('admin:full_access', 'Complete system access', 'admin'),
        ('users:manage_all', 'Manage all user accounts', 'users'),
        ('content:manage_all', 'Manage all content', 'content'),
        ('system:configure', 'Configure system settings', 'system'),
        ('analytics:view_all', 'View all analytics', 'analytics')
    ON CONFLICT (name) DO NOTHING;
    
    -- Grant all permissions to admin role
    INSERT INTO public.role_permissions (role_id, permission_id)
    SELECT admin_role_id, p.id
    FROM public.permissions p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.role_permissions rp
        WHERE rp.role_id = admin_role_id AND rp.permission_id = p.id
    );
    
    -- Get list of permissions that were missing
    SELECT array_agg(p.name) INTO missing_permissions
    FROM public.permissions p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.role_permissions rp
        WHERE rp.role_id = admin_role_id AND rp.permission_id = p.id
    );
    
    IF missing_permissions IS NOT NULL THEN
        RAISE NOTICE 'Granted missing permissions to admin: %', missing_permissions;
    ELSE
        RAISE NOTICE 'Admin already has all permissions';
    END IF;
    
EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Failed to grant permissions: %', SQLERRM;
END $$;

-- =====================================================
-- QUERY 7: EMERGENCY ADMIN RESET
-- =====================================================
-- Use this as a last resort to reset admin access

DO $$
DECLARE
    admin_user_id UUID;
    admin_role_id BIGINT;
BEGIN
    -- Find or create admin role
    INSERT INTO public.roles (name, description) VALUES
        ('admin', 'Full system access with all permissions')
    ON CONFLICT (name) DO NOTHING;
    
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
    
    -- Find admin user
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@aihow.org'
    LIMIT 1;
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE 'Admin user not found, creating new one...';
        
        -- Create new admin user
        INSERT INTO auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_user_meta_data,
            raw_app_meta_data,
            created_at,
            updated_at,
            is_super_admin,
            is_anonymous,
            role
        )
        VALUES (
            gen_random_uuid(),
            'admin@aihow.org',
            crypt('EmergencyAdmin2025!', gen_salt('bf', 10)),
            NOW(),
            '{"full_name": "Emergency Administrator", "role": "admin"}'::jsonb,
            '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
            NOW(),
            NOW(),
            true,
            false,
            'admin'
        )
        RETURNING id INTO admin_user_id;
        
        -- Create profile if it doesn't exist
        INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
        VALUES (admin_user_id, 'emergency_admin', 'Emergency Administrator', NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
            username = EXCLUDED.username,
            full_name = EXCLUDED.full_name,
            updated_at = NOW();
    ELSE
        RAISE NOTICE 'Found existing admin user, resetting...';
        
        -- Reset admin user
        UPDATE auth.users 
        SET encrypted_password = crypt('EmergencyAdmin2025!', gen_salt('bf', 10)),
            is_super_admin = true,
            updated_at = NOW()
        WHERE id = admin_user_id;
    END IF;
    
    -- Ensure admin role assignment
    INSERT INTO public.user_roles (user_id, role_id, created_at)
    VALUES (admin_user_id, admin_role_id, NOW())
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    RAISE NOTICE 'Emergency admin reset completed!';
    RAISE NOTICE 'Email: admin@aihow.org';
    RAISE NOTICE 'Password: EmergencyAdmin2025!';
    RAISE NOTICE 'User ID: %', admin_user_id;
    
EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Emergency admin reset failed: %', SQLERRM;
END $$;

-- =====================================================
-- QUERY 8: CLEANUP AUDIT LOGS
-- =====================================================
-- Use this to clean up old audit logs (optional)

-- Delete audit logs older than 30 days (uncomment to execute)
/*
DELETE FROM public.audit_logs 
WHERE created_at < NOW() - INTERVAL '30 days';

DELETE FROM public.activity_logs 
WHERE created_at < NOW() - INTERVAL '30 days';
*/

-- Show recent audit activity
SELECT 
    'Recent Audit Activity' as info_type,
    al.action,
    al.resource_type,
    al.created_at,
    u.email as user_email,
    al.metadata
FROM public.activity_logs al
LEFT JOIN auth.users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 10;

-- =====================================================
-- EXECUTION INSTRUCTIONS
-- =====================================================
-- 1. Run QUERY 1 first to understand current state
-- 2. Use the main cleanup script for complete reset
-- 3. Use QUERY 3 for standalone admin creation
-- 4. Use QUERY 4 to change admin password
-- 5. Use QUERY 7 for emergency admin reset
-- 6. Use QUERY 8 for maintenance cleanup
-- =====================================================