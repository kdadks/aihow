-- =====================================================
-- EMERGENCY RLS FIX - Infinite Recursion in roles table
-- =====================================================
-- Complete cleanup: drop all auth-related policies
-- Create only simple, non-recursive policies

BEGIN;

-- =====================================================
-- 1. DROP ALL POLICIES ON AUTH TABLES
-- =====================================================

DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Drop all policies from roles table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roles') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.roles'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.roles', rec.polname);
            RAISE NOTICE 'Dropped policy % from roles', rec.polname;
        END LOOP;
    END IF;

    -- Drop all policies from user_roles table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.user_roles'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles', rec.polname);
            RAISE NOTICE 'Dropped policy % from user_roles', rec.polname;
        END LOOP;
    END IF;

    -- Drop all policies from permissions table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'permissions') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.permissions'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.permissions', rec.polname);
            RAISE NOTICE 'Dropped policy % from permissions', rec.polname;
        END LOOP;
    END IF;

    -- Drop all policies from role_permissions table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'role_permissions') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.role_permissions'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.role_permissions', rec.polname);
            RAISE NOTICE 'Dropped policy % from role_permissions', rec.polname;
        END LOOP;
    END IF;

END $$;

-- =====================================================
-- 2. CREATE SIMPLE, NON-RECURSIVE POLICIES
-- =====================================================

DO $$
BEGIN
    -- ROLES: All authenticated users can read
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roles') THEN
        CREATE POLICY "Authenticated users can read roles" ON public.roles 
            FOR SELECT TO authenticated USING (true);
        RAISE NOTICE 'Created read policy for roles';
    END IF;

    -- USER_ROLES: All authenticated users can read
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        CREATE POLICY "Authenticated users can read user_roles" ON public.user_roles 
            FOR SELECT TO authenticated USING (true);
        RAISE NOTICE 'Created read policy for user_roles';
    END IF;

    -- PERMISSIONS: All authenticated users can read
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'permissions') THEN
        CREATE POLICY "Authenticated users can read permissions" ON public.permissions 
            FOR SELECT TO authenticated USING (true);
        RAISE NOTICE 'Created read policy for permissions';
    END IF;

    -- ROLE_PERMISSIONS: All authenticated users can read
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'role_permissions') THEN
        CREATE POLICY "Authenticated users can read role_permissions" ON public.role_permissions 
            FOR SELECT TO authenticated USING (true);
        RAISE NOTICE 'Created read policy for role_permissions';
    END IF;

END $$;

-- =====================================================
-- 3. SIMPLIFY CONTENT TABLE POLICIES
-- =====================================================

DO $$
DECLARE
    rec RECORD;
BEGIN
    -- TOOLS_V2: Drop all, recreate simple
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tools_v2') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.tools_v2'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.tools_v2', rec.polname);
        END LOOP;
        
        CREATE POLICY "Public can read published tools_v2" ON public.tools_v2 
            FOR SELECT USING (status = 'published');
        CREATE POLICY "Authenticated can read all tools_v2" ON public.tools_v2 
            FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Authenticated can modify tools_v2" ON public.tools_v2 
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
        RAISE NOTICE 'Recreated policies for tools_v2';
    END IF;

    -- BLOG_POSTS: Drop all, recreate simple
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'blog_posts') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.blog_posts'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.blog_posts', rec.polname);
        END LOOP;
        
        CREATE POLICY "Public can read published blog_posts" ON public.blog_posts 
            FOR SELECT USING (status = 'published');
        CREATE POLICY "Authenticated can read all blog_posts" ON public.blog_posts 
            FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Authenticated can modify blog_posts" ON public.blog_posts 
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
        RAISE NOTICE 'Recreated policies for blog_posts';
    END IF;

    -- PROFILES: Drop old complex ones, keep simple
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.profiles'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', rec.polname);
        END LOOP;
        
        CREATE POLICY "Users can read own profile" ON public.profiles 
            FOR SELECT USING (id = auth.uid());
        CREATE POLICY "Authenticated can read all profiles" ON public.profiles 
            FOR SELECT TO authenticated USING (true);
        CREATE POLICY "Users can modify own profile" ON public.profiles 
            FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());
        RAISE NOTICE 'Recreated policies for profiles';
    END IF;

END $$;

COMMIT;

-- =====================================================
-- RESULTS
-- =====================================================
-- This migration:
-- 1. Removes ALL existing policies that might cause recursion
-- 2. Creates only simple policies: "USING (true)" or "USING (status = 'published')"
-- 3. No policies reference other tables (eliminates recursion)
-- 4. Authenticated users can read all auth tables
-- 5. Frontend handles authorization via role checking
