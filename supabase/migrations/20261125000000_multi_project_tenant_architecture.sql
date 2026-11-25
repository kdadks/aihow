-- Migration: 20261125000000_multi_project_tenant_architecture.sql
-- Description: STRICT ZERO-TRUST Multi-Project Isolation Architecture.
-- Projects:
--   1. 'how2doai' (schema: how2doai) - AI Tools & Workflow Directory
--   2. 'nirchal'  (schema: public)   - E-Commerce Application

BEGIN;

-- ==============================================================================
-- 1. Create Dedicated 'shared' Schema for Tenant Isolation Infrastructure
-- ==============================================================================
CREATE SCHEMA IF NOT EXISTS shared;
GRANT USAGE ON SCHEMA shared TO anon, authenticated;

-- Cleanup any previous shared views to ensure absolute isolation
DROP VIEW IF EXISTS public.shared_tools CASCADE;

-- ==============================================================================
-- 2. Projects Registry
-- ==============================================================================
CREATE TABLE IF NOT EXISTS shared.projects (
    id TEXT PRIMARY KEY,                       -- 'how2doai', 'nirchal'
    name TEXT NOT NULL,
    schema_name TEXT NOT NULL,                 -- 'how2doai', 'public'
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE shared.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Projects viewable by authenticated users" ON shared.projects;
CREATE POLICY "Projects viewable by authenticated users" ON shared.projects FOR SELECT TO authenticated USING (is_active = true);

INSERT INTO shared.projects (id, name, schema_name) VALUES ('how2doai', 'How2doAI Directory', 'how2doai') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, schema_name = EXCLUDED.schema_name;
INSERT INTO shared.projects (id, name, schema_name) VALUES ('nirchal', 'Nirchal E-Commerce', 'public') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, schema_name = EXCLUDED.schema_name;

-- ==============================================================================
-- 3. Strict 1-to-1 User-to-Project Binding
-- A user can belong to EXACTLY ONE project. user_id is the primary key.
-- ==============================================================================
CREATE TABLE IF NOT EXISTS shared.user_project_binding (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES shared.projects(id) ON DELETE RESTRICT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_project_binding_project ON shared.user_project_binding (project_id, role);

ALTER TABLE shared.user_project_binding ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view only their own binding" ON shared.user_project_binding;
CREATE POLICY "Users can view only their own binding" ON shared.user_project_binding FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. Fast Security Definer Functions for Row-Level Security
-- ==============================================================================

-- Returns the project ID the current logged-in user is strictly bound to
CREATE OR REPLACE FUNCTION shared.current_user_project()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = shared, auth, pg_temp
AS $$
    SELECT project_id 
    FROM shared.user_project_binding 
    WHERE user_id = auth.uid()
    LIMIT 1;
$$;

-- Returns true ONLY IF the current logged-in user is bound to the target project
CREATE OR REPLACE FUNCTION shared.is_user_bound_to(target_project TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = shared, auth, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM shared.user_project_binding
        WHERE user_id = auth.uid() 
          AND project_id = target_project
    );
$$;

-- Returns true if user is an admin of the specified project
CREATE OR REPLACE FUNCTION shared.is_project_admin(target_project TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = shared, auth, pg_temp
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM shared.user_project_binding
        WHERE user_id = auth.uid() 
          AND project_id = target_project
          AND role = 'admin'
    );
$$;

-- Convenience aliases in public
CREATE OR REPLACE FUNCTION public.current_user_project()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT shared.current_user_project();
$$;

CREATE OR REPLACE FUNCTION public.is_user_bound_to(target_project TEXT)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT shared.is_user_bound_to(target_project);
$$;

-- ==============================================================================
-- 5. Strict User Signup Trigger: Irreversible Project Attribution
-- ==============================================================================
CREATE OR REPLACE FUNCTION shared.handle_strict_user_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = shared, auth, pg_temp
AS $$
DECLARE
    assigned_project TEXT;
BEGIN
    assigned_project := NEW.raw_user_meta_data->>'project_id';

    IF assigned_project IS NULL OR assigned_project NOT IN ('how2doai', 'nirchal') THEN
        assigned_project := 'how2doai';
    END IF;

    -- 1. Insert binding (AFTER INSERT ensures NEW.id exists in auth.users)
    INSERT INTO shared.user_project_binding (user_id, project_id, role)
    VALUES (NEW.id, assigned_project, 'user')
    ON CONFLICT (user_id) DO NOTHING;

    -- 2. Stamp project_id into raw_app_meta_data
    UPDATE auth.users
    SET raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{project_id}',
        to_jsonb(assigned_project)
    )
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_project_binding ON auth.users;
CREATE TRIGGER on_auth_user_created_project_binding
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION shared.handle_strict_user_registration();

-- ==============================================================================
-- 6. Backfill Existing Users to 'how2doai'
-- ==============================================================================
INSERT INTO shared.user_project_binding (user_id, project_id, role)
SELECT id, 'how2doai', 'user'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

UPDATE auth.users u
SET raw_app_meta_data = jsonb_set(
    COALESCE(u.raw_app_meta_data, '{}'::jsonb),
    '{project_id}',
    to_jsonb(b.project_id)
)
FROM shared.user_project_binding b
WHERE u.id = b.user_id;

UPDATE shared.user_project_binding b
SET role = 'admin'
FROM how2doai.user_roles ur
JOIN how2doai.roles r ON r.id = ur.role_id
WHERE b.user_id = ur.user_id
  AND b.project_id = 'how2doai'
  AND LOWER(r.name) IN ('admin', 'super_admin');

-- ==============================================================================
-- 7. Permissions & Grants
-- ==============================================================================
GRANT SELECT ON TABLE shared.projects TO anon, authenticated;
GRANT SELECT ON TABLE shared.user_project_binding TO authenticated;
GRANT EXECUTE ON FUNCTION shared.current_user_project() TO authenticated;
GRANT EXECUTE ON FUNCTION shared.is_user_bound_to(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION shared.is_project_admin(TEXT) TO authenticated;

GRANT EXECUTE ON FUNCTION public.current_user_project() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_bound_to(TEXT) TO authenticated;

COMMIT;
