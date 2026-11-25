-- Migration: 20261125000003_fix_how2doai_grants_rpc_and_blog_policies.sql
-- Description: Adds missing grants, blog categories RLS policies, and RPC functions in how2doai schema.

-- ==============================================================================
-- 1. Ensure User Project Binding (Fixes RLS for Profiles & Admin checks)
-- ==============================================================================
INSERT INTO shared.user_project_binding (user_id, project_id, role)
SELECT id, 'how2doai', 'admin'
FROM auth.users
WHERE email = 'kdadks@outlook.com'
ON CONFLICT (user_id) DO UPDATE SET project_id = 'how2doai', role = 'admin';

INSERT INTO shared.user_project_binding (user_id, project_id, role)
SELECT id, 'how2doai', 'user'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ==============================================================================
-- 2. SQL Grants for how2doai Schema Tables
-- ==============================================================================
GRANT USAGE ON SCHEMA how2doai TO anon, authenticated;

-- Profiles & User Settings
GRANT SELECT, INSERT, UPDATE ON TABLE how2doai.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE how2doai.user_settings TO authenticated;

-- Roles & Permissions
GRANT SELECT ON TABLE how2doai.roles TO anon, authenticated;
GRANT SELECT ON TABLE how2doai.user_roles TO anon, authenticated;

-- Blog & Categories
GRANT SELECT ON TABLE how2doai.blog_categories TO anon, authenticated;
GRANT ALL ON TABLE how2doai.blog_categories TO authenticated;
GRANT SELECT ON TABLE how2doai.blog_post_categories TO anon, authenticated;
GRANT ALL ON TABLE how2doai.blog_post_categories TO authenticated;
GRANT SELECT ON TABLE how2doai.forum_categories TO anon, authenticated;

-- ==============================================================================
-- 3. RLS Policies for Blog Categories
-- ==============================================================================
ALTER TABLE how2doai.blog_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view blog categories" ON how2doai.blog_categories;
CREATE POLICY "Public can view blog categories"
ON how2doai.blog_categories FOR SELECT
TO anon, authenticated
USING (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'));

DROP POLICY IF EXISTS "Admins can manage blog categories" ON how2doai.blog_categories;
CREATE POLICY "Admins can manage blog categories"
ON how2doai.blog_categories FOR ALL
TO authenticated
USING (
    shared.is_user_bound_to('how2doai') 
    AND shared.is_project_admin('how2doai')
)
WITH CHECK (
    shared.is_user_bound_to('how2doai') 
    AND shared.is_project_admin('how2doai')
);

-- ==============================================================================
-- 4. RPC Functions in how2doai Schema
-- ==============================================================================
CREATE OR REPLACE FUNCTION how2doai.get_admin_profile(user_id UUID)
RETURNS TABLE (
    id UUID,
    username TEXT,
    full_name TEXT,
    email TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = how2doai, auth, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, 
        p.username, 
        p.full_name,
        u.email::TEXT
    FROM how2doai.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
    WHERE p.id = user_id;
END;
$$;

CREATE OR REPLACE FUNCTION how2doai.get_admin_user_role(user_id UUID)
RETURNS TABLE (
    role_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = how2doai, shared, auth, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(
            (SELECT b.role FROM shared.user_project_binding b WHERE b.user_id = get_admin_user_role.user_id),
            (SELECT r.name FROM how2doai.user_roles ur JOIN how2doai.roles r ON r.id = ur.role_id WHERE ur.user_id = get_admin_user_role.user_id LIMIT 1),
            'admin'
        )::TEXT AS role_name;
END;
$$;

GRANT EXECUTE ON FUNCTION how2doai.get_admin_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION how2doai.get_admin_user_role(UUID) TO authenticated;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
