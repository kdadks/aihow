-- =====================================================
-- FINAL SAFE AUTHENTICATION SCHEMA CLEANUP
-- =====================================================
-- This migration safely resolves table redundancy and conflicts
-- Date: 2025-07-07
-- Purpose: Simplify authentication system by removing redundant tables

-- ==================================================
-- SECTION 1: BACKUP EXISTING DATA
-- ==================================================

-- Create temporary backup tables for important data
DO $$
BEGIN
    -- Backup user_roles data if table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        CREATE TABLE IF NOT EXISTS temp_user_role_backup AS
        SELECT DISTINCT user_id, role_id FROM public.user_roles 
        WHERE user_id IS NOT NULL AND role_id IS NOT NULL;
        RAISE NOTICE 'Backed up user_roles data';
    END IF;

    -- Backup user_role_assignments data if table or view exists
    IF EXISTS (SELECT FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'user_role_assignments') THEN
        CREATE TABLE IF NOT EXISTS temp_role_assignments_backup AS
        SELECT DISTINCT user_id, role_id FROM public.user_role_assignments 
        WHERE user_id IS NOT NULL AND role_id IS NOT NULL;
        RAISE NOTICE 'Backed up user_role_assignments (view) data';
    ELSIF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_role_assignments') THEN
        CREATE TABLE IF NOT EXISTS temp_role_assignments_backup AS
        SELECT DISTINCT user_id, role_id FROM public.user_role_assignments 
        WHERE user_id IS NOT NULL AND role_id IS NOT NULL;
        RAISE NOTICE 'Backed up user_role_assignments (table) data';
    END IF;
END $$;

-- ==================================================
-- SECTION 2: SAFE DROP REDUNDANT OBJECTS
-- ==================================================

-- Drop redundant tables and views safely
DO $$
BEGIN
    -- Drop user_profiles table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        DROP TABLE public.user_profiles CASCADE;
        RAISE NOTICE 'Dropped user_profiles table';
    END IF;

    -- Drop users view if it exists
    IF EXISTS (SELECT FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'users') THEN
        DROP VIEW public.users CASCADE;
        RAISE NOTICE 'Dropped users view';
    END IF;

    -- Drop admin_users table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users') THEN
        DROP TABLE public.admin_users CASCADE;
        RAISE NOTICE 'Dropped admin_users table';
    END IF;

    -- Drop admin_sessions table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_sessions') THEN
        DROP TABLE public.admin_sessions CASCADE;
        RAISE NOTICE 'Dropped admin_sessions table';
    END IF;

    -- Drop admin_roles table if it exists (we'll use the main roles table)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_roles') THEN
        DROP TABLE public.admin_roles CASCADE;
        RAISE NOTICE 'Dropped admin_roles table';
    END IF;

    -- Drop user_role_assignments (check view first, then table)
    IF EXISTS (SELECT FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'user_role_assignments') THEN
        DROP VIEW public.user_role_assignments CASCADE;
        RAISE NOTICE 'Dropped user_role_assignments view';
    ELSIF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_role_assignments') THEN
        DROP TABLE public.user_role_assignments CASCADE;
        RAISE NOTICE 'Dropped user_role_assignments table';
    END IF;
END $$;

-- ==================================================
-- SECTION 3: ENSURE CLEAN SCHEMA
-- ==================================================

-- Drop and recreate user_roles as proper junction table
DO $$
BEGIN
    -- Drop user_roles if it exists (to recreate with correct schema)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        DROP TABLE public.user_roles CASCADE;
        RAISE NOTICE 'Dropped existing user_roles table for recreation';
    END IF;
END $$;

-- Recreate user_roles as a proper junction table
CREATE TABLE public.user_roles (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- Ensure roles table has proper structure
DO $$
BEGIN
    -- Add level column if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'roles' AND column_name = 'level') THEN
        ALTER TABLE public.roles ADD COLUMN level INTEGER DEFAULT 1;
        RAISE NOTICE 'Added level column to roles table';
    END IF;
END $$;

-- Update role levels for hierarchy
UPDATE public.roles SET level = 4 WHERE name = 'admin';
UPDATE public.roles SET level = 3 WHERE name = 'moderator';
UPDATE public.roles SET level = 1 WHERE name = 'user';

-- Add admin-specific roles if they don't exist
INSERT INTO public.roles (name, description, level) VALUES
    ('super_admin', 'Super administrator with full system access', 5),
    ('system_admin', 'System administrator with elevated privileges', 4),
    ('content_admin', 'Content administrator with content management privileges', 3)
ON CONFLICT (name) DO UPDATE SET
    level = EXCLUDED.level,
    description = EXCLUDED.description;

-- ==================================================
-- SECTION 4: MIGRATE DATA BACK
-- ==================================================

-- Restore user role assignments from backup
DO $$
BEGIN
    -- Restore from user_role_backup if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'temp_user_role_backup') THEN
        INSERT INTO public.user_roles (user_id, role_id, created_at)
        SELECT DISTINCT user_id, role_id, NOW()
        FROM temp_user_role_backup
        WHERE user_id IS NOT NULL 
          AND role_id IS NOT NULL
          AND EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id)
          AND EXISTS (SELECT 1 FROM public.roles WHERE id = role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
        RAISE NOTICE 'Restored user roles from backup';
    END IF;

    -- Restore from role_assignments_backup if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'temp_role_assignments_backup') THEN
        INSERT INTO public.user_roles (user_id, role_id, created_at)
        SELECT DISTINCT user_id, role_id, NOW()
        FROM temp_role_assignments_backup
        WHERE user_id IS NOT NULL 
          AND role_id IS NOT NULL
          AND EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id)
          AND EXISTS (SELECT 1 FROM public.roles WHERE id = role_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
        RAISE NOTICE 'Restored role assignments from backup';
    END IF;
END $$;

-- ==================================================
-- SECTION 5: ENSURE ADMIN PERMISSIONS
-- ==================================================

-- Ensure all admin-related permissions exist
INSERT INTO public.permissions (name, description, category) VALUES
    ('admin:full_access', 'Full system administration access', 'admin'),
    ('admin:user_management', 'Manage user accounts and roles', 'admin'),
    ('admin:content_management', 'Manage all content and moderation', 'admin'),
    ('admin:system_settings', 'Configure system settings', 'admin'),
    ('admin:analytics', 'View system analytics and reports', 'admin'),
    ('moderator:content', 'Moderate content and users', 'moderation'),
    ('user:basic', 'Basic user access', 'user')
ON CONFLICT (name) DO NOTHING;

-- Assign all permissions to admin roles
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name IN ('admin', 'super_admin', 'system_admin')
  AND NOT EXISTS (
    SELECT 1 FROM public.role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

-- Assign content permissions to content_admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'content_admin'
  AND p.category IN ('content', 'moderation')
  AND NOT EXISTS (
    SELECT 1 FROM public.role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

-- Assign basic permissions to user role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'user'
  AND p.name = 'user:basic'
  AND NOT EXISTS (
    SELECT 1 FROM public.role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission_id = p.id
  );

-- ==================================================
-- SECTION 6: ENABLE RLS AND CREATE POLICIES
-- ==================================================

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admin can manage user roles" ON public.user_roles;

-- Create secure RLS policies
CREATE POLICY "Users can view own roles"
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
            AND r.name IN ('admin', 'super_admin', 'system_admin')
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
            AND r.name IN ('admin', 'super_admin', 'system_admin')
        )
    );

-- ==================================================
-- SECTION 7: CREATE HELPER FUNCTIONS
-- ==================================================

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = user_has_role.user_id
        AND r.name = role_name
    );
END;
$$;

-- Function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(user_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN ARRAY(
        SELECT r.name
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = get_user_roles.user_id
    );
END;
$$;

-- Drop and recreate get_user_permissions to avoid return type error
DROP FUNCTION IF EXISTS public.get_user_permissions(UUID);

-- Function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN ARRAY(
        SELECT DISTINCT p.name
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON rp.role_id = ur.role_id
        JOIN public.permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = get_user_permissions.user_id
    );
END;
$$;

-- Drop and recreate is_admin to avoid parameter name error
DROP FUNCTION IF EXISTS public.is_admin(UUID);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = is_admin.user_id
        AND r.name IN ('admin', 'super_admin', 'system_admin')
    );
END;
$$;

-- ==================================================
-- SECTION 8: CREATE INDEXES FOR PERFORMANCE
-- ==================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
CREATE INDEX IF NOT EXISTS idx_roles_level ON public.roles(level);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON public.permissions(name);
CREATE INDEX IF NOT EXISTS idx_permissions_category ON public.permissions(category);

-- ==================================================
-- SECTION 9: CLEANUP TEMPORARY TABLES
-- ==================================================

-- Drop temporary backup tables
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'temp_user_role_backup') THEN
        DROP TABLE temp_user_role_backup;
        RAISE NOTICE 'Cleaned up temp_user_role_backup table';
    END IF;

    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'temp_role_assignments_backup') THEN
        DROP TABLE temp_role_assignments_backup;
        RAISE NOTICE 'Cleaned up temp_role_assignments_backup table';
    END IF;
END $$;

-- ==================================================
-- SECTION 10: GRANT PERMISSIONS
-- ==================================================

-- Grant necessary permissions to authenticated users
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.roles TO authenticated;
GRANT SELECT ON public.permissions TO authenticated;
GRANT SELECT ON public.role_permissions TO authenticated;

-- Grant function execution permissions
GRANT EXECUTE ON FUNCTION public.user_has_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;

-- ==================================================
-- MIGRATION COMPLETE
-- ==================================================

-- Log completion
DO $$
BEGIN
    RAISE NOTICE '=== AUTHENTICATION SCHEMA CLEANUP COMPLETED ===';
    RAISE NOTICE 'Redundant objects removed:';
    RAISE NOTICE '  - user_profiles table';
    RAISE NOTICE '  - users view';
    RAISE NOTICE '  - admin_users table';
    RAISE NOTICE '  - admin_sessions table';
    RAISE NOTICE '  - user_role_assignments table/view';
    RAISE NOTICE '  - admin_roles table';
    RAISE NOTICE '';
    RAISE NOTICE 'Simplified schema now uses:';
    RAISE NOTICE '  - profiles (user data)';
    RAISE NOTICE '  - roles (role definitions)';
    RAISE NOTICE '  - permissions (permission definitions)';
    RAISE NOTICE '  - user_roles (user-role assignments)';
    RAISE NOTICE '  - role_permissions (role-permission assignments)';
    RAISE NOTICE '';
    RAISE NOTICE 'Helper functions created:';
    RAISE NOTICE '  - user_has_role(user_id, role_name)';
    RAISE NOTICE '  - get_user_roles(user_id)';
    RAISE NOTICE '  - get_user_permissions(user_id)';
    RAISE NOTICE '  - is_admin(user_id)';
    RAISE NOTICE '';
    RAISE NOTICE 'Migration completed successfully!';
END $$;