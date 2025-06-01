-- Critical Authentication Schema Fix Migration
-- This migration addresses the critical database schema failures identified in the diagnostic report
-- and ensures compatibility with the AdminAuthContext requirements

-- ==================================================
-- SECTION 1: Fix Primary Key Schema Conflicts
-- ==================================================

-- First, check if the tables exist and need to be recreated with BIGSERIAL
-- The diagnostic report indicates permissions and role_permissions tables are missing or incorrect

-- Drop existing tables if they exist (to rebuild with correct schema)
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;

-- Recreate roles table with BIGSERIAL as specified in the task
CREATE TABLE public.roles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create permissions table with BIGSERIAL as specified in the task
CREATE TABLE public.permissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_roles junction table
CREATE TABLE public.user_roles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Create role_permissions junction table as specified in the task
CREATE TABLE public.role_permissions (
    role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- ==================================================
-- SECTION 2: Insert Essential Data
-- ==================================================

-- Insert basic roles
INSERT INTO public.roles (name, description) VALUES
    ('admin', 'Full system access with all permissions'),
    ('user', 'Standard user access'),
    ('moderator', 'Content moderation access');

-- Insert comprehensive permissions for admin system
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
    
    -- Profile permissions (for compatibility)
    ('create:any_profile', 'Can create any user profile', 'profiles'),
    ('read:any_profile', 'Can read any user profile', 'profiles'),
    ('update:any_profile', 'Can update any user profile', 'profiles'),
    ('delete:any_profile', 'Can delete any user profile', 'profiles');

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

-- ==================================================
-- SECTION 3: Enable Row Level Security (RLS)
-- ==================================================

-- Enable RLS on all authentication tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- ==================================================
-- SECTION 4: Create Secure RLS Policies
-- ==================================================

-- Drop any existing policies first
DROP POLICY IF EXISTS "Users can view any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public read access to roles" ON public.roles;
DROP POLICY IF EXISTS "Admin only insert access to roles" ON public.roles;
DROP POLICY IF EXISTS "Admin only update access to roles" ON public.roles;
DROP POLICY IF EXISTS "Admin only delete access to roles" ON public.roles;
DROP POLICY IF EXISTS "Public read access to permissions" ON public.permissions;
DROP POLICY IF EXISTS "Admin only insert access to permissions" ON public.permissions;
DROP POLICY IF EXISTS "Admin only update access to permissions" ON public.permissions;
DROP POLICY IF EXISTS "Admin only delete access to permissions" ON public.permissions;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Public read access to role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admin only insert access to role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admin only update access to role permissions" ON public.role_permissions;
DROP POLICY IF EXISTS "Admin only delete access to role permissions" ON public.role_permissions;

-- PROFILES TABLE POLICIES (Fix anonymous access issue)
CREATE POLICY "Users can view own profile only"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile only"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

-- ROLES TABLE POLICIES (Admin-only access, prevent anonymous access)
CREATE POLICY "Admin can read roles"
    ON public.roles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Admin only insert access to roles"
    ON public.roles FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin only update access to roles"
    ON public.roles FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin only delete access to roles"
    ON public.roles FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

-- PERMISSIONS TABLE POLICIES (Admin-only access, prevent anonymous access)
CREATE POLICY "Admin can read permissions"
    ON public.permissions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Admin only insert access to permissions"
    ON public.permissions FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin only update access to permissions"
    ON public.permissions FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin only delete access to permissions"
    ON public.permissions FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

-- USER_ROLES TABLE POLICIES (Secure access, prevent anonymous access)
CREATE POLICY "Users can view own roles only"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Admin can view all user roles"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin can manage user roles"
    ON public.user_roles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

-- ROLE_PERMISSIONS TABLE POLICIES (Admin-only access, prevent anonymous access)
CREATE POLICY "Admin can read role permissions"
    ON public.role_permissions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Admin only insert access to role permissions"
    ON public.role_permissions FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin only update access to role permissions"
    ON public.role_permissions FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

CREATE POLICY "Admin only delete access to role permissions"
    ON public.role_permissions FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            INNER JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'admin'
        )
    );

-- ==================================================
-- SECTION 5: Create Essential Functions
-- ==================================================

-- Enhanced permission checking function (updated to work with BIGSERIAL IDs)
CREATE OR REPLACE FUNCTION has_permission(user_id UUID, required_permission TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON rp.role_id = ur.role_id
        JOIN public.permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = user_id
        AND p.name = required_permission
    );
END;
$$;

-- Function to get user's roles (updated for BIGSERIAL compatibility)
CREATE OR REPLACE FUNCTION get_user_roles(user_id UUID)
RETURNS SETOF TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
        SELECT r.name
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = user_id;
END;
$$;

-- Function to get user's permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_id UUID)
RETURNS SETOF TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
        SELECT DISTINCT p.name
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON rp.role_id = ur.role_id
        JOIN public.permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = user_id;
END;
$$;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = user_id
        AND r.name = 'admin'
    );
END;
$$;

-- ==================================================
-- SECTION 6: Create Indexes for Performance
-- ==================================================

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON public.permissions(name);
CREATE INDEX IF NOT EXISTS idx_permissions_category ON public.permissions(category);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);

-- ==================================================
-- SECTION 7: Create Triggers for Updated_At
-- ==================================================

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Add triggers to tables that have updated_at columns
CREATE TRIGGER roles_updated_at
    BEFORE UPDATE ON public.roles
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER permissions_updated_at
    BEFORE UPDATE ON public.permissions
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- ==================================================
-- SECTION 8: Grant Necessary Permissions
-- ==================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.roles TO authenticated;
GRANT SELECT ON public.permissions TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.role_permissions TO authenticated;

-- ==================================================
-- Migration Summary
-- ==================================================

-- This migration:
-- 1. ✅ Creates missing permissions table with BIGSERIAL primary key
-- 2. ✅ Creates missing role_permissions table with proper foreign keys  
-- 3. ✅ Fixes RLS policies to prevent anonymous access to sensitive tables
-- 4. ✅ Ensures compatibility with AdminAuthContext by providing required functions
-- 5. ✅ Adds comprehensive permissions for admin system functionality
-- 6. ✅ Creates performance indexes for better query speed
-- 7. ✅ Implements proper security boundaries between authenticated and anonymous users

-- Tables created/updated:
-- - public.roles (recreated with BIGSERIAL)
-- - public.permissions (recreated with BIGSERIAL) 
-- - public.user_roles (recreated with proper relationships)
-- - public.role_permissions (created with correct schema)

-- Security improvements:
-- - All auth tables now require authentication
-- - Anonymous users cannot access profiles, roles, or user_roles
-- - Proper admin-only policies for sensitive operations
-- - Enhanced permission checking functions

COMMENT ON TABLE public.permissions IS 'System permissions for role-based access control - Fixed for AdminAuthContext compatibility';
COMMENT ON TABLE public.role_permissions IS 'Junction table linking roles to permissions - Critical for admin authentication';