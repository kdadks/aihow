-- Migration: 20261125000004_fix_tool_bundles_and_admin_tables_grants.sql
-- Description: Fixes 42501 permission denied errors for tool_bundles_v2 and related how2doai tables, with strict RLS policies.

-- ==============================================================================
-- 1. Schema-Level SQL Grants for how2doai
-- Note: SQL Grants do NOT bypass RLS. Tables with RLS enabled are still strictly filtered.
-- ==============================================================================
GRANT USAGE ON SCHEMA how2doai TO anon, authenticated;

-- Grant permissions on all current tables and sequences in how2doai
GRANT SELECT ON ALL TABLES IN SCHEMA how2doai TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA how2doai TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA how2doai TO authenticated;

-- Ensure future tables also inherit these permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA how2doai GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA how2doai GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA how2doai GRANT ALL ON SEQUENCES TO authenticated;

-- ==============================================================================
-- 2. RLS Policies for tool_bundles_v2
-- ==============================================================================
ALTER TABLE how2doai.tool_bundles_v2 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Strict read active tool bundles" ON how2doai.tool_bundles_v2;
CREATE POLICY "Strict read active tool bundles"
ON how2doai.tool_bundles_v2 FOR SELECT
TO anon, authenticated
USING (
    (status = 'active' OR shared.is_project_admin('how2doai'))
    AND (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'))
);

DROP POLICY IF EXISTS "Strict manage tool bundles for admins" ON how2doai.tool_bundles_v2;
CREATE POLICY "Strict manage tool bundles for admins"
ON how2doai.tool_bundles_v2 FOR ALL
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
-- 3. RLS Policies for tool_reviews_v2
-- ==============================================================================
ALTER TABLE how2doai.tool_reviews_v2 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Strict read published tool reviews" ON how2doai.tool_reviews_v2;
CREATE POLICY "Strict read published tool reviews"
ON how2doai.tool_reviews_v2 FOR SELECT
TO anon, authenticated
USING (
    (status = 'published' OR shared.is_project_admin('how2doai'))
    AND (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'))
);

DROP POLICY IF EXISTS "Strict manage tool reviews" ON how2doai.tool_reviews_v2;
CREATE POLICY "Strict manage tool reviews"
ON how2doai.tool_reviews_v2 FOR ALL
TO authenticated
USING (
    shared.is_user_bound_to('how2doai')
    AND (auth.uid() = user_id OR shared.is_project_admin('how2doai'))
)
WITH CHECK (
    shared.is_user_bound_to('how2doai')
    AND (auth.uid() = user_id OR shared.is_project_admin('how2doai'))
);

-- ==============================================================================
-- 4. Reload PostgREST schema cache
-- ==============================================================================
NOTIFY pgrst, 'reload schema';
