-- Create Admin User Migration
-- This creates the missing admin user identified in the diagnostic report
-- and assigns proper admin role and permissions

-- ==================================================
-- SECTION 1: Create Admin User Function
-- ==================================================

-- Create a function to safely create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_email TEXT,
    admin_password TEXT,
    admin_name TEXT DEFAULT 'System Administrator'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    admin_role_id BIGINT;
BEGIN
    -- Get the admin role ID
    SELECT id INTO admin_role_id
    FROM public.roles 
    WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Admin role not found. Please run the schema migration first.';
    END IF;
    
    -- Note: In Supabase, user creation must be done through the auth API
    -- This function will be called after the user is created via auth.users
    -- For now, we'll prepare the profile and role assignment
    
    RETURN NULL; -- Will be updated with actual user_id when called
END;
$$;

-- ==================================================
-- SECTION 2: Admin User Profile Setup Function
-- ==================================================

-- Function to complete admin user setup (called after auth.users creation)
CREATE OR REPLACE FUNCTION setup_admin_user(
    user_id UUID,
    admin_name TEXT DEFAULT 'System Administrator'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_role_id BIGINT;
    profile_exists BOOLEAN;
BEGIN
    -- Check if user exists in auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
        RAISE EXCEPTION 'User with ID % does not exist in auth.users', user_id;
    END IF;
    
    -- Get the admin role ID
    SELECT id INTO admin_role_id
    FROM public.roles 
    WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Admin role not found. Please run the schema migration first.';
    END IF;
    
    -- Check if profile already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) INTO profile_exists;
    
    -- Create or update profile
    IF profile_exists THEN
        UPDATE public.profiles 
        SET full_name = admin_name,
            updated_at = NOW()
        WHERE id = user_id;
    ELSE
        INSERT INTO public.profiles (id, full_name, username, created_at, updated_at)
        VALUES (user_id, admin_name, 'admin', NOW(), NOW());
    END IF;
    
    -- Assign admin role (if not already assigned)
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = user_id AND role_id = admin_role_id
    ) THEN
        INSERT INTO public.user_roles (user_id, role_id, created_at)
        VALUES (user_id, admin_role_id, NOW());
    END IF;
    
    RETURN TRUE;
END;
$$;

-- ==================================================
-- SECTION 3: Admin Verification Functions
-- ==================================================

-- Function to verify admin user setup
CREATE OR REPLACE FUNCTION verify_admin_user(user_id UUID)
RETURNS TABLE(
    user_exists BOOLEAN,
    profile_exists BOOLEAN,
    has_admin_role BOOLEAN,
    admin_permissions_count BIGINT,
    setup_complete BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXISTS(SELECT 1 FROM auth.users WHERE id = user_id) as user_exists,
        EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) as profile_exists,
        EXISTS(
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = user_id AND r.name = 'admin'
        ) as has_admin_role,
        (
            SELECT COUNT(*)
            FROM public.user_roles ur
            JOIN public.role_permissions rp ON rp.role_id = ur.role_id
            WHERE ur.user_id = user_id
        ) as admin_permissions_count,
        (
            EXISTS(SELECT 1 FROM auth.users WHERE id = user_id) AND
            EXISTS(SELECT 1 FROM public.profiles WHERE id = user_id) AND
            EXISTS(
                SELECT 1 FROM public.user_roles ur
                JOIN public.roles r ON r.id = ur.role_id
                WHERE ur.user_id = user_id AND r.name = 'admin'
            )
        ) as setup_complete;
END;
$$;

-- Function to list all admin users
CREATE OR REPLACE FUNCTION list_admin_users()
RETURNS TABLE(
    user_id UUID,
    email TEXT,
    full_name TEXT,
    username TEXT,
    role_name TEXT,
    created_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email,
        p.full_name,
        p.username,
        r.name as role_name,
        u.created_at,
        u.last_sign_in_at
    FROM auth.users u
    JOIN public.profiles p ON p.id = u.id
    JOIN public.user_roles ur ON ur.user_id = u.id
    JOIN public.roles r ON r.id = ur.role_id
    WHERE r.name = 'admin'
    ORDER BY u.created_at;
END;
$$;

-- ==================================================
-- SECTION 4: Manual Admin User Creation (Fallback)
-- ==================================================

-- If no admin users exist, create a placeholder that can be activated
-- This is a safety measure - actual user creation should be done via Supabase Auth

DO $$
DECLARE
    admin_role_id BIGINT;
    existing_admin_count INTEGER;
BEGIN
    -- Check if any admin users already exist
    SELECT COUNT(*) INTO existing_admin_count
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE r.name = 'admin';
    
    -- Only proceed if no admin users exist
    IF existing_admin_count = 0 THEN
        -- Get admin role ID
        SELECT id INTO admin_role_id
        FROM public.roles 
        WHERE name = 'admin';
        
        -- Log that manual admin user creation is needed
        RAISE NOTICE 'No admin users found. Admin user must be created via Supabase Auth API.';
        RAISE NOTICE 'After creating user via Auth, call setup_admin_user(user_id) to complete setup.';
        RAISE NOTICE 'Recommended: Create user with email admin@aihow.org and call setup_admin_user(user_id, ''System Administrator'')';
    ELSE
        RAISE NOTICE 'Found % existing admin user(s). No action needed.', existing_admin_count;
    END IF;
END;
$$;

-- ==================================================
-- SECTION 5: Grant Permissions for Admin Functions
-- ==================================================

-- Grant execute permissions on admin functions to authenticated users
-- (These functions have SECURITY DEFINER so they run with elevated privileges)
GRANT EXECUTE ON FUNCTION setup_admin_user(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION list_admin_users() TO authenticated;

-- ==================================================
-- Migration Summary and Instructions
-- ==================================================

-- This migration creates functions to:
-- 1. ✅ Setup admin user profiles and role assignments
-- 2. ✅ Verify admin user configuration
-- 3. ✅ List all admin users in the system
-- 4. ✅ Provide safety checks for admin user creation

-- IMPORTANT: To create the missing admin user:
-- 1. Create user via Supabase Auth API (or Auth UI) with email: admin@aihow.org
-- 2. Get the user_id from the created user
-- 3. Call: SELECT setup_admin_user('<user_id>', 'System Administrator');
-- 4. Verify: SELECT * FROM verify_admin_user('<user_id>');

-- Example SQL to complete admin setup (replace <user_id> with actual UUID):
-- SELECT setup_admin_user('<user_id>', 'System Administrator');
-- SELECT * FROM verify_admin_user('<user_id>');

COMMENT ON FUNCTION setup_admin_user IS 'Completes admin user setup after auth.users creation - fixes missing admin user issue';
COMMENT ON FUNCTION verify_admin_user IS 'Verifies admin user has all required components (profile, role, permissions)';
COMMENT ON FUNCTION list_admin_users IS 'Lists all users with admin role - helps identify existing admin accounts';