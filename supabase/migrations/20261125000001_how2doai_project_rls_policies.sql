-- Migration: 20261125000001_how2doai_project_rls_policies.sql
-- Description: Airtight, Zero-Trust RLS Policies for how2doai Schema.
-- Nirchal users and unauthorized callers are completely locked out.

-- ==============================================================================
-- 1. Tools Directory & Public Content
-- ==============================================================================
ALTER TABLE how2doai.tools_v2 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Strict read access for active tools" ON how2doai.tools_v2;
DROP POLICY IF EXISTS "Public can read active tools" ON how2doai.tools_v2;
CREATE POLICY "Strict read access for active tools"
ON how2doai.tools_v2 FOR SELECT
TO anon, authenticated
USING (
    status = 'active'
    AND (
        auth.role() = 'anon'
        OR shared.is_user_bound_to('how2doai')
    )
);

DROP POLICY IF EXISTS "Strict modify tools for how2doai admins" ON how2doai.tools_v2;
CREATE POLICY "Strict modify tools for how2doai admins"
ON how2doai.tools_v2 FOR ALL
TO authenticated
USING (
    shared.is_user_bound_to('how2doai') 
    AND shared.is_project_admin('how2doai')
)
WITH CHECK (
    shared.is_user_bound_to('how2doai') 
    AND shared.is_project_admin('how2doai')
);

-- Categories & Subcategories
ALTER TABLE how2doai.tool_categories_v2 ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict read tool categories" ON how2doai.tool_categories_v2;
CREATE POLICY "Strict read tool categories"
ON how2doai.tool_categories_v2 FOR SELECT
TO anon, authenticated
USING (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'));

ALTER TABLE how2doai.subcategories_v2 ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict read subcategories" ON how2doai.subcategories_v2;
CREATE POLICY "Strict read subcategories"
ON how2doai.subcategories_v2 FOR SELECT
TO anon, authenticated
USING (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'));

ALTER TABLE how2doai.tool_subcategories_v2 ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict read tool subcategories" ON how2doai.tool_subcategories_v2;
CREATE POLICY "Strict read tool subcategories"
ON how2doai.tool_subcategories_v2 FOR SELECT
TO anon, authenticated
USING (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'));

-- Blog Posts & Case Studies
ALTER TABLE how2doai.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict read published blog posts" ON how2doai.blog_posts;
CREATE POLICY "Strict read published blog posts"
ON how2doai.blog_posts FOR SELECT
TO anon, authenticated
USING (
    status = 'published'
    AND (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'))
);

ALTER TABLE how2doai.case_studies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict read published case studies" ON how2doai.case_studies;
CREATE POLICY "Strict read published case studies"
ON how2doai.case_studies FOR SELECT
TO anon, authenticated
USING (
    status = 'published'
    AND (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'))
);

-- ==============================================================================
-- 2. User Profiles & User Settings in how2doai
-- ==============================================================================
ALTER TABLE how2doai.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Strict view how2doai profiles" ON how2doai.profiles;
CREATE POLICY "Strict view how2doai profiles"
ON how2doai.profiles FOR SELECT
TO authenticated
USING (shared.is_user_bound_to('how2doai'));

DROP POLICY IF EXISTS "Strict update how2doai profile" ON how2doai.profiles;
CREATE POLICY "Strict update how2doai profile"
ON how2doai.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id AND shared.is_user_bound_to('how2doai'))
WITH CHECK (auth.uid() = id AND shared.is_user_bound_to('how2doai'));

DROP POLICY IF EXISTS "Strict insert how2doai profile" ON how2doai.profiles;
CREATE POLICY "Strict insert how2doai profile"
ON how2doai.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id AND shared.is_user_bound_to('how2doai'));

ALTER TABLE how2doai.user_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict manage how2doai user settings" ON how2doai.user_settings;
CREATE POLICY "Strict manage how2doai user settings"
ON how2doai.user_settings FOR ALL
TO authenticated
USING (auth.uid() = id AND shared.is_user_bound_to('how2doai'))
WITH CHECK (auth.uid() = id AND shared.is_user_bound_to('how2doai'));

-- ==============================================================================
-- 3. Community Forum (topics, replies)
-- ==============================================================================
ALTER TABLE how2doai.forum_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict read how2doai forum topics" ON how2doai.forum_topics;
CREATE POLICY "Strict read how2doai forum topics"
ON how2doai.forum_topics FOR SELECT
TO anon, authenticated
USING (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'));

DROP POLICY IF EXISTS "Strict manage how2doai forum topics" ON how2doai.forum_topics;
CREATE POLICY "Strict manage how2doai forum topics"
ON how2doai.forum_topics FOR ALL
TO authenticated
USING (auth.uid() = author_id AND shared.is_user_bound_to('how2doai'))
WITH CHECK (auth.uid() = author_id AND shared.is_user_bound_to('how2doai'));

ALTER TABLE how2doai.forum_replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Strict read how2doai forum replies" ON how2doai.forum_replies;
CREATE POLICY "Strict read how2doai forum replies"
ON how2doai.forum_replies FOR SELECT
TO anon, authenticated
USING (auth.role() = 'anon' OR shared.is_user_bound_to('how2doai'));

DROP POLICY IF EXISTS "Strict manage how2doai forum replies" ON how2doai.forum_replies;
CREATE POLICY "Strict manage how2doai forum replies"
ON how2doai.forum_replies FOR ALL
TO authenticated
USING (auth.uid() = author_id AND shared.is_user_bound_to('how2doai'))
WITH CHECK (auth.uid() = author_id AND shared.is_user_bound_to('how2doai'));

-- ==============================================================================
-- 4. Audit Log
-- ==============================================================================
ALTER TABLE how2doai.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Strict read how2doai audit_log" ON how2doai.audit_log;
CREATE POLICY "Strict read how2doai audit_log"
ON how2doai.audit_log FOR SELECT
TO authenticated
USING (
    shared.is_user_bound_to('how2doai') 
    AND shared.is_project_admin('how2doai')
);

DROP POLICY IF EXISTS "Strict insert how2doai audit_log" ON how2doai.audit_log;
CREATE POLICY "Strict insert how2doai audit_log"
ON how2doai.audit_log FOR INSERT
TO authenticated
WITH CHECK (shared.is_user_bound_to('how2doai'));
