-- =====================================================
-- COMPREHENSIVE RLS FIX AND PERMISSIONS MIGRATION
-- =====================================================
-- Removes all explicit anon references
-- Enables RLS on every table in public schema
-- Creates proper policies for all tables
-- Grants permissions to authenticated role only
-- =====================================================

BEGIN;

-- =====================================================
-- 1. ENABLE RLS ON ALL TABLES THAT DON'T HAVE IT
-- =====================================================

DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT t.oid, t.relname
        FROM pg_class t
        JOIN pg_namespace n ON n.oid = t.relnamespace
        WHERE n.nspname = 'public'
          AND t.relkind = 'r'
          AND t.relrowsecurity = false
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', rec.relname);
        RAISE NOTICE 'Enabled RLS on %', rec.relname;
    END LOOP;
END $$;

-- =====================================================
-- 2. DROP OLD POLICIES THAT REFERENCE anon
-- =====================================================

DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT p.polname, p.polrelid::regclass AS table_name
        FROM pg_policy p
        JOIN pg_namespace n ON n.oid = p.polrelid
        WHERE n.nspname = 'public'
          AND p.polroles IS NOT NULL
          AND 'anon'::regrole = ANY (p.polroles)
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', rec.polname, rec.table_name);
        RAISE NOTICE 'Dropped policy % on %', rec.polname, rec.table_name;
    END LOOP;
END $$;

-- =====================================================
-- 3. CREATE POLICIES FOR ALL TABLES (CONDITIONAL)
-- =====================================================

DO $$
BEGIN
    -- PROFILES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
        CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
        DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
        CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
        DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
        CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
        DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
        CREATE POLICY "Admin can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- ROLES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roles') THEN
        DROP POLICY IF EXISTS "Authenticated can read roles" ON public.roles;
        CREATE POLICY "Authenticated can read roles" ON public.roles FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can insert roles" ON public.roles;
        CREATE POLICY "Admin can insert roles" ON public.roles FOR INSERT TO authenticated WITH CHECK (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "Admin can update roles" ON public.roles;
        CREATE POLICY "Admin can update roles" ON public.roles FOR UPDATE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "Admin can delete roles" ON public.roles;
        CREATE POLICY "Admin can delete roles" ON public.roles FOR DELETE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- PERMISSIONS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'permissions') THEN
        DROP POLICY IF EXISTS "Authenticated can read permissions" ON public.permissions;
        CREATE POLICY "Authenticated can read permissions" ON public.permissions FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can insert permissions" ON public.permissions;
        CREATE POLICY "Admin can insert permissions" ON public.permissions FOR INSERT TO authenticated WITH CHECK (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "Admin can update permissions" ON public.permissions;
        CREATE POLICY "Admin can update permissions" ON public.permissions FOR UPDATE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "Admin can delete permissions" ON public.permissions;
        CREATE POLICY "Admin can delete permissions" ON public.permissions FOR DELETE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- USER_ROLES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
        CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Admin can view all user roles" ON public.user_roles;
        CREATE POLICY "Admin can view all user roles" ON public.user_roles FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "Admin can manage user roles" ON public.user_roles;
        CREATE POLICY "Admin can manage user roles" ON public.user_roles FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- ROLE_PERMISSIONS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'role_permissions') THEN
        DROP POLICY IF EXISTS "Authenticated can read role permissions" ON public.role_permissions;
        CREATE POLICY "Authenticated can read role permissions" ON public.role_permissions FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can insert role permissions" ON public.role_permissions;
        CREATE POLICY "Admin can insert role permissions" ON public.role_permissions FOR INSERT TO authenticated WITH CHECK (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "Admin can update role permissions" ON public.role_permissions;
        CREATE POLICY "Admin can update role permissions" ON public.role_permissions FOR UPDATE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "Admin can delete role permissions" ON public.role_permissions;
        CREATE POLICY "Admin can delete role permissions" ON public.role_permissions FOR DELETE TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- USER_ROLE_ASSIGNMENTS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_role_assignments') THEN
        DROP POLICY IF EXISTS "Users can view own assignments" ON public.user_role_assignments;
        CREATE POLICY "Users can view own assignments" ON public.user_role_assignments FOR SELECT USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Admin can view all assignments" ON public.user_role_assignments;
        CREATE POLICY "Admin can view all assignments" ON public.user_role_assignments FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "Admin can manage assignments" ON public.user_role_assignments;
        CREATE POLICY "Admin can manage assignments" ON public.user_role_assignments FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- AUDIT_LOGS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audit_logs') THEN
        DROP POLICY IF EXISTS "Admin can read audit logs" ON public.audit_logs;
        CREATE POLICY "Admin can read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
        CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
    END IF;

    -- AUDIT_LOG (singular variant)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'audit_log') THEN
        DROP POLICY IF EXISTS "Admin can read audit_log" ON public.audit_log;
        CREATE POLICY "Admin can read audit_log" ON public.audit_log FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "System can insert audit_log" ON public.audit_log;
        CREATE POLICY "System can insert audit_log" ON public.audit_log FOR INSERT WITH CHECK (true);
    END IF;

    -- SYSTEM_SETTINGS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_settings') THEN
        DROP POLICY IF EXISTS "Public can read system settings" ON public.system_settings;
        CREATE POLICY "Public can read system settings" ON public.system_settings FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage system settings" ON public.system_settings;
        CREATE POLICY "Admin can manage system settings" ON public.system_settings FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- FEATURE_FLAGS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'feature_flags') THEN
        DROP POLICY IF EXISTS "Public can read feature flags" ON public.feature_flags;
        CREATE POLICY "Public can read feature flags" ON public.feature_flags FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage feature flags" ON public.feature_flags;
        CREATE POLICY "Admin can manage feature flags" ON public.feature_flags FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- CONTENT_ITEMS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'content_items') THEN
        DROP POLICY IF EXISTS "Public can read published content" ON public.content_items;
        CREATE POLICY "Public can read published content" ON public.content_items FOR SELECT USING (status = 'published');
        DROP POLICY IF EXISTS "Admin can manage content items" ON public.content_items;
        CREATE POLICY "Admin can manage content items" ON public.content_items FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- MODERATION_QUEUE
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'moderation_queue') THEN
        DROP POLICY IF EXISTS "Admin can manage moderation queue" ON public.moderation_queue;
        CREATE POLICY "Admin can manage moderation queue" ON public.moderation_queue FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- AUTH_SETTINGS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'auth_settings') THEN
        DROP POLICY IF EXISTS "Public can read auth settings" ON public.auth_settings;
        CREATE POLICY "Public can read auth settings" ON public.auth_settings FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage auth settings" ON public.auth_settings;
        CREATE POLICY "Admin can manage auth settings" ON public.auth_settings FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- USER_SETTINGS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') THEN
        DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
        CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = id);
        DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
        CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = id);
        DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
        CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = id);
        DROP POLICY IF EXISTS "Users can delete own settings" ON public.user_settings;
        CREATE POLICY "Users can delete own settings" ON public.user_settings FOR DELETE USING (auth.uid() = id);
    END IF;

    -- TOOLS (legacy)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools') THEN
        DROP POLICY IF EXISTS "Public can read tools" ON public.tools;
        CREATE POLICY "Public can read tools" ON public.tools FOR SELECT USING (status = 'published');
        DROP POLICY IF EXISTS "Admin can manage tools" ON public.tools;
        CREATE POLICY "Admin can manage tools" ON public.tools FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- TOOL_CATEGORIES (legacy)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_categories') THEN
        DROP POLICY IF EXISTS "Public can read tool categories" ON public.tool_categories;
        CREATE POLICY "Public can read tool categories" ON public.tool_categories FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage tool categories" ON public.tool_categories;
        CREATE POLICY "Admin can manage tool categories" ON public.tool_categories FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- TOOL_REVIEWS (legacy)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_reviews') THEN
        DROP POLICY IF EXISTS "Public can read tool reviews" ON public.tool_reviews;
        CREATE POLICY "Public can read tool reviews" ON public.tool_reviews FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Users can create reviews" ON public.tool_reviews;
        CREATE POLICY "Users can create reviews" ON public.tool_reviews FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can update own reviews" ON public.tool_reviews;
        CREATE POLICY "Users can update own reviews" ON public.tool_reviews FOR UPDATE TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can delete own reviews" ON public.tool_reviews;
        CREATE POLICY "Users can delete own reviews" ON public.tool_reviews FOR DELETE TO authenticated USING (user_id = auth.uid());
    END IF;

    -- TOOLS_V2
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools_v2') THEN
        DROP POLICY IF EXISTS "Public can read tools_v2" ON public.tools_v2;
        CREATE POLICY "Public can read tools_v2" ON public.tools_v2 FOR SELECT USING (status = 'published');
        DROP POLICY IF EXISTS "Admin can manage tools_v2" ON public.tools_v2;
        CREATE POLICY "Admin can manage tools_v2" ON public.tools_v2 FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- TOOL_CATEGORIES_V2
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_categories_v2') THEN
        DROP POLICY IF EXISTS "Public can read tool categories v2" ON public.tool_categories_v2;
        CREATE POLICY "Public can read tool categories v2" ON public.tool_categories_v2 FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage tool categories v2" ON public.tool_categories_v2;
        CREATE POLICY "Admin can manage tool categories v2" ON public.tool_categories_v2 FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- SUBCATEGORIES_V2
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subcategories_v2') THEN
        DROP POLICY IF EXISTS "Public can read subcategories" ON public.subcategories_v2;
        CREATE POLICY "Public can read subcategories" ON public.subcategories_v2 FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage subcategories" ON public.subcategories_v2;
        CREATE POLICY "Admin can manage subcategories" ON public.subcategories_v2 FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- TOOL_SUBCATEGORIES_V2
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_subcategories_v2') THEN
        DROP POLICY IF EXISTS "Public can read tool subcategories" ON public.tool_subcategories_v2;
        CREATE POLICY "Public can read tool subcategories" ON public.tool_subcategories_v2 FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage tool subcategories" ON public.tool_subcategories_v2;
        CREATE POLICY "Admin can manage tool subcategories" ON public.tool_subcategories_v2 FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- TOOL_BUNDLES_V2
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_bundles_v2') THEN
        DROP POLICY IF EXISTS "Public can read bundles" ON public.tool_bundles_v2;
        CREATE POLICY "Public can read bundles" ON public.tool_bundles_v2 FOR SELECT USING (status = 'active');
        DROP POLICY IF EXISTS "Admin can manage all bundles" ON public.tool_bundles_v2;
        CREATE POLICY "Admin can manage all bundles" ON public.tool_bundles_v2 FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- TOOL_REVIEWS_V2
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_reviews_v2') THEN
        DROP POLICY IF EXISTS "Public can read reviews" ON public.tool_reviews_v2;
        CREATE POLICY "Public can read reviews" ON public.tool_reviews_v2 FOR SELECT USING (status = 'approved');
        DROP POLICY IF EXISTS "Users can create reviews" ON public.tool_reviews_v2;
        CREATE POLICY "Users can create reviews" ON public.tool_reviews_v2 FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can update own reviews" ON public.tool_reviews_v2;
        CREATE POLICY "Users can update own reviews" ON public.tool_reviews_v2 FOR UPDATE TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Admin can manage reviews" ON public.tool_reviews_v2;
        CREATE POLICY "Admin can manage reviews" ON public.tool_reviews_v2 FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- CASE_STUDIES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'case_studies') THEN
        DROP POLICY IF EXISTS "Public can read published case studies" ON public.case_studies;
        CREATE POLICY "Public can read published case studies" ON public.case_studies FOR SELECT USING (status = 'published');
        DROP POLICY IF EXISTS "Admin can manage case studies" ON public.case_studies;
        CREATE POLICY "Admin can manage case studies" ON public.case_studies FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- BLOG_CATEGORIES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_categories') THEN
        DROP POLICY IF EXISTS "Public can read blog categories" ON public.blog_categories;
        CREATE POLICY "Public can read blog categories" ON public.blog_categories FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage blog categories" ON public.blog_categories;
        CREATE POLICY "Admin can manage blog categories" ON public.blog_categories FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.permissions->>'canManageContent' = 'true')
        );
    END IF;

    -- BLOG_POSTS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') THEN
        DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
        CREATE POLICY "Public can read published posts" ON public.blog_posts FOR SELECT USING (status = 'published');
        DROP POLICY IF EXISTS "Authors can manage own posts" ON public.blog_posts;
        CREATE POLICY "Authors can manage own posts" ON public.blog_posts FOR ALL TO authenticated USING (author_id = auth.uid());
        DROP POLICY IF EXISTS "Admin can manage all posts" ON public.blog_posts;
        CREATE POLICY "Admin can manage all posts" ON public.blog_posts FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.permissions->>'canManageContent' = 'true')
        );
    END IF;

    -- BLOG_POST_CATEGORIES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_post_categories') THEN
        DROP POLICY IF EXISTS "Public can read post categories" ON public.blog_post_categories;
        CREATE POLICY "Public can read post categories" ON public.blog_post_categories FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Authors can manage own post categories" ON public.blog_post_categories;
        CREATE POLICY "Authors can manage own post categories" ON public.blog_post_categories FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.blog_posts bp WHERE bp.id = blog_post_categories.post_id AND bp.author_id = auth.uid())
        );
        DROP POLICY IF EXISTS "Admin can manage all post categories" ON public.blog_post_categories;
        CREATE POLICY "Admin can manage all post categories" ON public.blog_post_categories FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.permissions->>'canManageContent' = 'true')
        );
    END IF;

    -- FORUM_CATEGORIES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'forum_categories') THEN
        DROP POLICY IF EXISTS "Public can read forum categories" ON public.forum_categories;
        CREATE POLICY "Public can read forum categories" ON public.forum_categories FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage forum categories" ON public.forum_categories;
        CREATE POLICY "Admin can manage forum categories" ON public.forum_categories FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- FORUM_TOPICS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'forum_topics') THEN
        DROP POLICY IF EXISTS "Public can read topics" ON public.forum_topics;
        CREATE POLICY "Public can read topics" ON public.forum_topics FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Authenticated can create topics" ON public.forum_topics;
        CREATE POLICY "Authenticated can create topics" ON public.forum_topics FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
        DROP POLICY IF EXISTS "Authors can update topics" ON public.forum_topics;
        CREATE POLICY "Authors can update topics" ON public.forum_topics FOR UPDATE TO authenticated USING (auth.uid() = author_id);
        DROP POLICY IF EXISTS "Authors can delete topics" ON public.forum_topics;
        CREATE POLICY "Authors can delete topics" ON public.forum_topics FOR DELETE TO authenticated USING (auth.uid() = author_id);
    END IF;

    -- FORUM_REPLIES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'forum_replies') THEN
        DROP POLICY IF EXISTS "Public can read replies" ON public.forum_replies;
        CREATE POLICY "Public can read replies" ON public.forum_replies FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Authenticated can create replies" ON public.forum_replies;
        CREATE POLICY "Authenticated can create replies" ON public.forum_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
        DROP POLICY IF EXISTS "Authors can update replies" ON public.forum_replies;
        CREATE POLICY "Authors can update replies" ON public.forum_replies FOR UPDATE TO authenticated USING (auth.uid() = author_id);
        DROP POLICY IF EXISTS "Authors can delete replies" ON public.forum_replies;
        CREATE POLICY "Authors can delete replies" ON public.forum_replies FOR DELETE TO authenticated USING (auth.uid() = author_id);
    END IF;

    -- WORKFLOWS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workflows') THEN
        DROP POLICY IF EXISTS "Public workflows are viewable" ON public.workflows;
        CREATE POLICY "Public workflows are viewable" ON public.workflows FOR SELECT USING (is_public = true);
        DROP POLICY IF EXISTS "Users can view own workflows" ON public.workflows;
        CREATE POLICY "Users can view own workflows" ON public.workflows FOR SELECT TO authenticated USING (creator_id = auth.uid());
        DROP POLICY IF EXISTS "Users can create workflows" ON public.workflows;
        CREATE POLICY "Users can create workflows" ON public.workflows FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid());
        DROP POLICY IF EXISTS "Users can update own workflows" ON public.workflows;
        CREATE POLICY "Users can update own workflows" ON public.workflows FOR UPDATE TO authenticated USING (creator_id = auth.uid());
        DROP POLICY IF EXISTS "Users can delete own workflows" ON public.workflows;
        CREATE POLICY "Users can delete own workflows" ON public.workflows FOR DELETE TO authenticated USING (creator_id = auth.uid());
        DROP POLICY IF EXISTS "Admin can manage all workflows" ON public.workflows;
        CREATE POLICY "Admin can manage all workflows" ON public.workflows FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- TOOL_BUNDLES (legacy)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_bundles') THEN
        DROP POLICY IF EXISTS "Public bundles are viewable" ON public.tool_bundles;
        CREATE POLICY "Public bundles are viewable" ON public.tool_bundles FOR SELECT USING (is_public = true);
        DROP POLICY IF EXISTS "Users can view own bundles" ON public.tool_bundles;
        CREATE POLICY "Users can view own bundles" ON public.tool_bundles FOR SELECT TO authenticated USING (creator_id = auth.uid());
        DROP POLICY IF EXISTS "Users can create bundles" ON public.tool_bundles;
        CREATE POLICY "Users can create bundles" ON public.tool_bundles FOR INSERT TO authenticated WITH CHECK (creator_id = auth.uid());
        DROP POLICY IF EXISTS "Users can update own bundles" ON public.tool_bundles;
        CREATE POLICY "Users can update own bundles" ON public.tool_bundles FOR UPDATE TO authenticated USING (creator_id = auth.uid());
        DROP POLICY IF EXISTS "Users can delete own bundles" ON public.tool_bundles;
        CREATE POLICY "Users can delete own bundles" ON public.tool_bundles FOR DELETE TO authenticated USING (creator_id = auth.uid());
        DROP POLICY IF EXISTS "Admin can manage all bundles" ON public.tool_bundles;
        CREATE POLICY "Admin can manage all bundles" ON public.tool_bundles FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- USER_SAVED_ITEMS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_saved_items') THEN
        DROP POLICY IF EXISTS "Users can view own saved items" ON public.user_saved_items;
        CREATE POLICY "Users can view own saved items" ON public.user_saved_items FOR SELECT TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can save items" ON public.user_saved_items;
        CREATE POLICY "Users can save items" ON public.user_saved_items FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can update saved items" ON public.user_saved_items;
        CREATE POLICY "Users can update saved items" ON public.user_saved_items FOR UPDATE TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can delete saved items" ON public.user_saved_items;
        CREATE POLICY "Users can delete saved items" ON public.user_saved_items FOR DELETE TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Admin can manage all saved items" ON public.user_saved_items;
        CREATE POLICY "Admin can manage all saved items" ON public.user_saved_items FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- SAVED_BUNDLES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'saved_bundles') THEN
        DROP POLICY IF EXISTS "Users can view own saved bundles" ON public.saved_bundles;
        CREATE POLICY "Users can view own saved bundles" ON public.saved_bundles FOR SELECT TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can insert saved bundles" ON public.saved_bundles;
        CREATE POLICY "Users can insert saved bundles" ON public.saved_bundles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can update saved bundles" ON public.saved_bundles;
        CREATE POLICY "Users can update saved bundles" ON public.saved_bundles FOR UPDATE TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can delete saved bundles" ON public.saved_bundles;
        CREATE POLICY "Users can delete saved bundles" ON public.saved_bundles FOR DELETE TO authenticated USING (user_id = auth.uid());
    END IF;

    -- SAVED_WORKFLOWS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'saved_workflows') THEN
        DROP POLICY IF EXISTS "Users can view own saved workflows" ON public.saved_workflows;
        CREATE POLICY "Users can view own saved workflows" ON public.saved_workflows FOR SELECT TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can insert saved workflows" ON public.saved_workflows;
        CREATE POLICY "Users can insert saved workflows" ON public.saved_workflows FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can update saved workflows" ON public.saved_workflows;
        CREATE POLICY "Users can update saved workflows" ON public.saved_workflows FOR UPDATE TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can delete saved workflows" ON public.saved_workflows;
        CREATE POLICY "Users can delete saved workflows" ON public.saved_workflows FOR DELETE TO authenticated USING (user_id = auth.uid());
    END IF;

    -- WORKFLOW_DRAFTS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'workflow_drafts') THEN
        DROP POLICY IF EXISTS "Users can view own workflow drafts" ON public.workflow_drafts;
        CREATE POLICY "Users can view own workflow drafts" ON public.workflow_drafts FOR SELECT TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can insert workflow drafts" ON public.workflow_drafts;
        CREATE POLICY "Users can insert workflow drafts" ON public.workflow_drafts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can update workflow drafts" ON public.workflow_drafts;
        CREATE POLICY "Users can update workflow drafts" ON public.workflow_drafts FOR UPDATE TO authenticated USING (user_id = auth.uid());
        DROP POLICY IF EXISTS "Users can delete workflow drafts" ON public.workflow_drafts;
        CREATE POLICY "Users can delete workflow drafts" ON public.workflow_drafts FOR DELETE TO authenticated USING (user_id = auth.uid());
    END IF;

    -- PAGE_VISITS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'page_visits') THEN
        DROP POLICY IF EXISTS "Public can insert page visits" ON public.page_visits;
        CREATE POLICY "Public can insert page visits" ON public.page_visits FOR INSERT WITH CHECK (session_id IS NOT NULL);
    END IF;

    -- USER_SESSIONS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_sessions') THEN
        DROP POLICY IF EXISTS "Public can create sessions" ON public.user_sessions;
        CREATE POLICY "Public can create sessions" ON public.user_sessions FOR INSERT WITH CHECK (session_id IS NOT NULL);
        DROP POLICY IF EXISTS "Public can update sessions" ON public.user_sessions;
        CREATE POLICY "Public can update sessions" ON public.user_sessions FOR UPDATE USING (session_id IS NOT NULL);
    END IF;

    -- PAGE_ANALYTICS_SUMMARY
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'page_analytics_summary') THEN
        DROP POLICY IF EXISTS "Authenticated can read analytics" ON public.page_analytics_summary;
        CREATE POLICY "Authenticated can read analytics" ON public.page_analytics_summary FOR SELECT TO authenticated USING (true);
    END IF;

    -- SITE_ANALYTICS_SUMMARY
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_analytics_summary') THEN
        DROP POLICY IF EXISTS "Authenticated can read analytics" ON public.site_analytics_summary;
        CREATE POLICY "Authenticated can read analytics" ON public.site_analytics_summary FOR SELECT TO authenticated USING (true);
    END IF;

    -- TOOL_REFERRALS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_referrals') THEN
        DROP POLICY IF EXISTS "Public can track referrals" ON public.tool_referrals;
        CREATE POLICY "Public can track referrals" ON public.tool_referrals FOR INSERT WITH CHECK (session_id IS NOT NULL);
    END IF;

    -- TOOL_REFERRAL_ANALYTICS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_referral_analytics') THEN
        DROP POLICY IF EXISTS "Authenticated can read analytics" ON public.tool_referral_analytics;
        CREATE POLICY "Authenticated can read analytics" ON public.tool_referral_analytics FOR SELECT TO authenticated USING (true);
    END IF;

    -- ADMIN_ROLES
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_roles') THEN
        DROP POLICY IF EXISTS "Admin can manage admin roles" ON public.admin_roles;
        CREATE POLICY "Admin can manage admin roles" ON public.admin_roles FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin'))
        );
    END IF;

    -- ADMIN_USERS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_users') THEN
        DROP POLICY IF EXISTS "Admin can view own profile" ON public.admin_users;
        CREATE POLICY "Admin can view own profile" ON public.admin_users FOR SELECT TO authenticated USING (id = auth.uid());
        DROP POLICY IF EXISTS "Super admins can view all admin profiles" ON public.admin_users;
        CREATE POLICY "Super admins can view all admin profiles" ON public.admin_users FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'super_admin'))
        );
    END IF;

    -- ADMIN_SESSIONS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_sessions') THEN
        DROP POLICY IF EXISTS "Admins can manage own sessions" ON public.admin_sessions;
        CREATE POLICY "Admins can manage own sessions" ON public.admin_sessions FOR ALL TO authenticated USING (admin_id = auth.uid());
    END IF;

    -- MYSTERY TABLES FROM LINTER
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'default_role_id') THEN
        DROP POLICY IF EXISTS "Admin can read default_role_id" ON public.default_role_id;
        CREATE POLICY "Admin can read default_role_id" ON public.default_role_id FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "Admin can manage default_role_id" ON public.default_role_id;
        CREATE POLICY "Admin can manage default_role_id" ON public.default_role_id FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'limitations') THEN
        DROP POLICY IF EXISTS "Public can read limitations" ON public.limitations;
        CREATE POLICY "Public can read limitations" ON public.limitations FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage limitations" ON public.limitations;
        CREATE POLICY "Admin can manage limitations" ON public.limitations FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pricing_types') THEN
        DROP POLICY IF EXISTS "Public can read pricing_types" ON public.pricing_types;
        CREATE POLICY "Public can read pricing_types" ON public.pricing_types FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage pricing_types" ON public.pricing_types;
        CREATE POLICY "Admin can manage pricing_types" ON public.pricing_types FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pricing_tier_features') THEN
        DROP POLICY IF EXISTS "Public can read pricing_tier_features" ON public.pricing_tier_features;
        CREATE POLICY "Public can read pricing_tier_features" ON public.pricing_tier_features FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage pricing_tier_features" ON public.pricing_tier_features;
        CREATE POLICY "Admin can manage pricing_tier_features" ON public.pricing_tier_features FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tool_versions') THEN
        DROP POLICY IF EXISTS "Public can read tool_versions" ON public.tool_versions;
        CREATE POLICY "Public can read tool_versions" ON public.tool_versions FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage tool_versions" ON public.tool_versions;
        CREATE POLICY "Admin can manage tool_versions" ON public.tool_versions FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'support_option_types') THEN
        DROP POLICY IF EXISTS "Public can read support_option_types" ON public.support_option_types;
        CREATE POLICY "Public can read support_option_types" ON public.support_option_types FOR SELECT USING (true);
        DROP POLICY IF EXISTS "Admin can manage support_option_types" ON public.support_option_types;
        CREATE POLICY "Admin can manage support_option_types" ON public.support_option_types FOR ALL TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
    END IF;

    -- SYSTEM_HEALTH_METRICS (if exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_health_metrics') THEN
        DROP POLICY IF EXISTS "Admin can read health metrics" ON public.system_health_metrics;
        CREATE POLICY "Admin can read health metrics" ON public.system_health_metrics FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.user_roles ur JOIN public.roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name = 'admin')
        );
        DROP POLICY IF EXISTS "System can insert health metrics" ON public.system_health_metrics;
        CREATE POLICY "System can insert health metrics" ON public.system_health_metrics FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- =====================================================
-- 4. GRANT PERMISSIONS TO AUTHENTICATED ROLE
-- =====================================================

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- =====================================================
-- 5. ENSURE DEFAULT PRIVILEGES FOR FUTURE TABLES
-- =====================================================

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO authenticated;

-- =====================================================
-- 6. REVOKE ANON ACCESS WHERE INAPPROPRIATE
-- =====================================================

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;

-- =====================================================
-- 7. ENSURE PUBLIC-SAFE ACCESS WITHOUT anon ROLE
-- =====================================================

-- Public read access is granted via policies with USING (true) or
-- FOR SELECT without role restriction. No explicit anon grants needed.
-- RLS policy "TO authenticated" covers signed-in users.
-- Anonymous access is allowed only where explicitly intended by policy.

COMMIT;


