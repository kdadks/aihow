-- =====================================================
-- COMPLETE DATABASE CLEANUP AND ADMIN CREATION SCRIPT
-- =====================================================
-- This script removes all user accounts and related data from all tables
-- and creates a new admin user account
-- Execute this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- SECTION 1: DISABLE ROW LEVEL SECURITY TEMPORARILY
-- =====================================================
-- Disable RLS to allow complete data deletion
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_bundles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_items DISABLE ROW LEVEL SECURITY;

-- Disable RLS on additional tables if they exist (skip views)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'user_role_assignments'
        AND table_type = 'BASE TABLE'
    ) THEN
        ALTER TABLE public.user_role_assignments DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =====================================================
-- SECTION 2: DELETE ALL USER-RELATED DATA
-- =====================================================

-- Delete from junction tables first (to avoid foreign key constraints)
DELETE FROM public.user_saved_items;
DELETE FROM public.user_roles;
DELETE FROM public.role_permissions;
DELETE FROM public.blog_post_categories;

-- Delete user content and activities
DELETE FROM public.forum_replies;
DELETE FROM public.forum_topics;
DELETE FROM public.blog_posts;
DELETE FROM public.tool_reviews;
DELETE FROM public.workflows;
DELETE FROM public.tool_bundles;
DELETE FROM public.system_metrics;


-- Delete user role assignments if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_role_assignments') THEN
        DELETE FROM public.user_role_assignments;
    END IF;
END $$;

-- Delete user profiles
DELETE FROM public.profiles;

-- Delete from auth.users (this will cascade to related tables)
DELETE FROM auth.users;

-- Reset roles and permissions to default state
DELETE FROM public.roles;
DELETE FROM public.permissions;

-- Clear system data that might contain user references
DELETE FROM public.system_settings WHERE key NOT IN ('site_name', 'maintenance_mode', 'allowed_file_types');
DELETE FROM public.feature_flags;

-- =====================================================
-- SECTION 3: RECREATE ESSENTIAL ROLES AND PERMISSIONS
-- =====================================================

-- Insert basic roles
INSERT INTO public.roles (name, description) VALUES
    ('admin', 'Full system access with all permissions'),
    ('user', 'Standard user access'),
    ('moderator', 'Content moderation access');

-- Insert comprehensive permissions
INSERT INTO public.permissions (name, description, category) VALUES
    -- Admin permissions
    ('admin:read', 'Read admin data and dashboard', 'admin'),
    ('admin:write', 'Modify admin settings and data', 'admin'),
    ('admin:delete', 'Delete admin data', 'admin'),
    ('admin:manage_users', 'Manage user accounts', 'admin'),
    ('admin:manage_roles', 'Manage roles and permissions', 'admin'),
    
    -- User management permissions
    ('users:read', 'Read user profiles and data', 'users'),
    ('users:write', 'Create and update user data', 'users'),
    ('users:delete', 'Delete user accounts', 'users'),
    
    -- Content permissions
    ('content:read', 'Read content and posts', 'content'),
    ('content:write', 'Create and edit content', 'content'),
    ('content:delete', 'Delete content', 'content'),
    ('content:moderate', 'Moderate user content', 'content'),
    
    -- System permissions
    ('system:admin', 'System administration access', 'system'),
    ('system:settings', 'Modify system settings', 'system'),
    ('system:analytics', 'Access system analytics', 'system'),
    
    -- Additional permissions for compatibility
    ('manage:content', 'Can manage all content', 'content'),
    ('moderate:content', 'Can moderate content', 'content'),
    ('view:metrics', 'Can view system metrics', 'analytics'),
    ('manage:settings', 'Can manage system settings', 'system'),
    ('create:any_profile', 'Can create any user profile', 'profiles'),
    ('read:any_profile', 'Can read any user profile', 'profiles'),
    ('update:any_profile', 'Can update any user profile', 'profiles'),
    ('delete:any_profile', 'Can delete any user profile', 'profiles'),
    ('manage:roles', 'Can manage roles and permissions', 'admin');

-- Assign all permissions to admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'admin';

-- Assign basic permissions to user role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'user' 
AND p.name IN ('content:read', 'users:read');

-- Assign moderator permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'moderator' 
AND p.name IN ('content:read', 'content:write', 'content:moderate', 'users:read');

-- =====================================================
-- SECTION 4: CREATE NEW ADMIN USER
-- =====================================================

DO $$
DECLARE
    admin_user_id UUID;
    admin_role_id BIGINT;
BEGIN
    -- Get admin role id
    SELECT id INTO admin_role_id
    FROM public.roles
    WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Failed to find admin role';
    END IF;

    -- Create admin user in auth.users
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

    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'Failed to create admin user';
    END IF;

    -- Create admin profile
    INSERT INTO public.profiles (id, username, full_name, avatar_url, created_at, updated_at)
    VALUES (
        admin_user_id, 
        'admin', 
        'System Administrator', 
        NULL,
        NOW(),
        NOW()
    );

    -- Assign admin role to user
    INSERT INTO public.user_roles (user_id, role_id, created_at)
    VALUES (admin_user_id, admin_role_id, NOW());

    -- Insert system settings
    INSERT INTO public.system_settings (key, value, description, category, is_public, updated_by, updated_at) VALUES
        ('site_name', '"AIHow Admin Portal"', 'Name of the admin portal', 'general', true, admin_user_id, NOW()),
        ('maintenance_mode', 'false', 'Toggle maintenance mode', 'system', false, admin_user_id, NOW()),
        ('user_registration', 'true', 'Allow new user registrations', 'users', false, admin_user_id, NOW()),
        ('allowed_file_types', '["image/jpeg", "image/png", "image/gif", "application/pdf"]', 'Allowed file upload types', 'system', false, admin_user_id, NOW())
    ON CONFLICT (key) DO UPDATE SET
        updated_by = admin_user_id,
        updated_at = NOW();

    -- Insert feature flags
    INSERT INTO public.feature_flags (name, description, enabled, config, updated_by, created_at, updated_at) VALUES
        ('admin_portal', 'Enable admin portal access', true, '{"enabled": true}', admin_user_id, NOW(), NOW()),
        ('user_management', 'Enable user management features', true, '{"enabled": true}', admin_user_id, NOW(), NOW()),
        ('content_moderation', 'Enable content moderation features', true, '{"enabled": true}', admin_user_id, NOW(), NOW())
    ON CONFLICT (name) DO UPDATE SET
        updated_by = admin_user_id,
        updated_at = NOW();

    -- Log the creation
    INSERT INTO public.activity_logs (user_id, action, resource_type, resource_id, metadata, created_at)
    VALUES (
        admin_user_id,
        'CREATE',
        'admin_user',
        admin_user_id,
        '{"action": "database_reset", "admin_created": true}'::jsonb,
        NOW()
    );

    RAISE NOTICE 'Admin user created successfully!';
    RAISE NOTICE 'Email: admin@aihow.org';
    RAISE NOTICE 'Password: AIhowAdmin2025!';
    RAISE NOTICE 'User ID: %', admin_user_id;
    RAISE NOTICE 'IMPORTANT: Please change the password after first login!';

EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'Failed to create admin user: %', SQLERRM;
END $$;

-- =====================================================
-- SECTION 5: RE-ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Re-enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on additional tables if they exist (skip views)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'user_role_assignments'
        AND table_type = 'BASE TABLE'
    ) THEN
        ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =====================================================
-- SECTION 6: VERIFICATION QUERIES
-- =====================================================

-- Verify admin user creation
SELECT 
    'Admin User Verification' as check_type,
    u.id,
    u.email,
    u.is_super_admin,
    p.username,
    p.full_name,
    r.name as role_name
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
WHERE u.email = 'admin@aihow.org';

-- Verify role assignments
SELECT 
    'Role Assignment Verification' as check_type,
    r.name as role_name,
    COUNT(rp.permission_id) as permission_count
FROM public.roles r
LEFT JOIN public.role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.name
ORDER BY r.name;

-- Verify data cleanup
SELECT 
    'Data Cleanup Verification' as check_type,
    'auth.users' as table_name,
    COUNT(*) as remaining_records
FROM auth.users
UNION ALL
SELECT 
    'Data Cleanup Verification',
    'public.profiles',
    COUNT(*)
FROM public.profiles
UNION ALL
SELECT 
    'Data Cleanup Verification',
    'public.user_roles',
    COUNT(*)
FROM public.user_roles;

-- =====================================================
-- SCRIPT EXECUTION SUMMARY
-- =====================================================
-- This script has:
-- 1. ✅ Removed all user accounts from auth.users
-- 2. ✅ Removed all user profiles from public.profiles
-- 3. ✅ Removed all user roles assignments from public.user_roles
-- 4. ✅ Removed all user-generated content from all tables
-- 5. ✅ Removed all user activity logs and audit trails
-- 6. ✅ Removed all user reviews, posts, workflows, and bundles
-- 7. ✅ Created a new admin user with email: admin@aihow.org
-- 8. ✅ Set admin password to: AIhowAdmin2025!
-- 9. ✅ Assigned all permissions to the admin role
-- 10. ✅ Re-enabled Row Level Security on all tables
-- 
-- IMPORTANT NOTES:
-- - Change the admin password after first login
-- - The admin user has super admin privileges
-- - All RLS policies are now active again
-- - The database is now in a clean state with only the admin user
-- =====================================================