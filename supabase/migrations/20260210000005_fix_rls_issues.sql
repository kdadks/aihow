-- =====================================================
-- FIX RLS ISSUES FROM SUPABASE LINTER
-- =====================================================
-- Fixes:
-- 1. policy_exists_rls_disabled - Enable RLS on tables with existing policies
-- 2. rls_disabled_in_public - Enable RLS on public tables missing it
-- 3. rls_references_user_metadata - Fix blog policies to use role-based checks
-- =====================================================

BEGIN;

-- =====================================================
-- 1. Enable RLS on tables that have policies but RLS is disabled
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'role_permissions') THEN
        ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =====================================================
-- 2. Enable RLS on public tables that are missing it
-- =====================================================

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'audit_log') THEN
        ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'default_role_id') THEN
        ALTER TABLE public.default_role_id ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'limitations') THEN
        ALTER TABLE public.limitations ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'pricing_types') THEN
        ALTER TABLE public.pricing_types ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'pricing_tier_features') THEN
        ALTER TABLE public.pricing_tier_features ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'tool_versions') THEN
        ALTER TABLE public.tool_versions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'support_option_types') THEN
        ALTER TABLE public.support_option_types ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =====================================================
-- 3. Fix blog RLS policies to not reference user_metadata
-- =====================================================

-- Drop insecure policies that reference user_metadata
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.blog_categories;
DROP POLICY IF EXISTS "Admins can manage all post categories" ON public.blog_post_categories;

-- Blog Posts: Admins can manage all posts (using role-based check)
CREATE POLICY "Admins can manage all posts"
    ON public.blog_posts FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageContent' = 'true'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageContent' = 'true'
        )
    );

-- Blog Categories: Admins can manage categories (using role-based check)
CREATE POLICY "Admins can manage categories"
    ON public.blog_categories FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageContent' = 'true'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageContent' = 'true'
        )
    );

-- Blog Post Categories: Admins can manage all post categories (using role-based check)
CREATE POLICY "Admins can manage all post categories"
    ON public.blog_post_categories FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageContent' = 'true'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageContent' = 'true'
        )
    );

COMMIT;
