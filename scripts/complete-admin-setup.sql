-- ALL-IN-ONE ADMIN SETUP SCRIPT
-- This script will completely set up the admin portal tables and assign your admin role
-- Run this entire script in Supabase SQL Editor

-- ============================================================================
-- STEP 1: CLEAN UP OLD TABLES
-- ============================================================================

DROP TABLE IF EXISTS public.user_role_assignments CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;

-- ============================================================================
-- STEP 2: CREATE ROLES TABLE
-- ============================================================================

CREATE TABLE public.roles (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default roles
INSERT INTO public.roles (name, description, permissions) VALUES
    ('admin', 'Super administrator with full access', '{
        "canManageUsers": true,
        "canManageContent": true,
        "canModerateContent": true,
        "canManageSettings": true,
        "canViewMetrics": true
    }'::jsonb),
    ('system_admin', 'System administrator with elevated access', '{
        "canManageUsers": true,
        "canManageContent": true,
        "canModerateContent": true,
        "canManageSettings": true,
        "canViewMetrics": true
    }'::jsonb),
    ('content_admin', 'Content administrator', '{
        "canManageContent": true,
        "canModerateContent": true,
        "canViewMetrics": true
    }'::jsonb),
    ('user', 'Standard user with basic access', '{
        "canManageUsers": false,
        "canManageContent": false,
        "canModerateContent": false,
        "canManageSettings": false,
        "canViewMetrics": false
    }'::jsonb);

-- ============================================================================
-- STEP 3: CREATE USER_ROLES TABLE
-- ============================================================================

CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- ============================================================================
-- STEP 4: ASSIGN ADMIN ROLE TO YOUR USER
-- ============================================================================

-- ** IMPORTANT: Update the email below to your actual admin email **
INSERT INTO public.user_roles (user_id, role_id, assigned_at, created_at)
SELECT 
    u.id,
    r.id,
    NOW(),
    NOW()
FROM auth.users u
CROSS JOIN public.roles r
WHERE u.email = 'prashantsinghkanyal@gmail.com'  -- ⚠️ CHANGE THIS TO YOUR EMAIL
AND r.name = 'admin';

-- ============================================================================
-- STEP 5: ENABLE RLS AND CREATE POLICIES
-- ============================================================================

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Roles policies - Anyone authenticated can view roles
DROP POLICY IF EXISTS "Anyone can view roles" ON public.roles;
CREATE POLICY "Anyone can view roles"
    ON public.roles
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;
CREATE POLICY "Admins can manage roles"
    ON public.roles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    );

-- User roles policies - Users can always see their own role assignments
-- This is critical for login to work!
DROP POLICY IF EXISTS "Users can read their roles" ON public.user_roles;
CREATE POLICY "Users can read their roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (true);  -- Allow all authenticated users to read all role assignments for now

-- Restrict other operations to admins only
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    );

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
    ON public.user_roles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    );

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
    ON public.user_roles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    );

-- ============================================================================
-- STEP 6: CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_roles_name ON public.roles(name);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON public.user_roles(role_id);

-- ============================================================================
-- STEP 7: VERIFY SETUP
-- ============================================================================

-- Show all roles
SELECT 'ROLES:' as section;
SELECT id, name, description FROM public.roles ORDER BY id;

-- Show all role assignments  
SELECT 'ROLE ASSIGNMENTS:' as section;
SELECT 
    u.email,
    r.name as role,
    r.permissions,
    ur.assigned_at
FROM auth.users u
JOIN public.user_roles ur ON ur.user_id = u.id
JOIN public.roles r ON r.id = ur.role_id
ORDER BY u.email;

-- Success message
SELECT '✅ SETUP COMPLETE!' as status;
SELECT 'You can now login to the admin portal with: ' || email as message
FROM auth.users 
WHERE email = 'prashantsinghkanyal@gmail.com'  -- Your email
LIMIT 1;
