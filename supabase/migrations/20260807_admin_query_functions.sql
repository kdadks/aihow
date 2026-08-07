-- =====================================================
-- ADMIN QUERY HELPER FUNCTIONS - Bypass RLS
-- =====================================================
-- Create functions that admins can use to query data
-- These functions bypass RLS restrictions

BEGIN;

-- =====================================================
-- 1. GET ADMIN USER ROLES FUNCTION
-- =====================================================
-- Allow admins to quickly fetch their role
CREATE OR REPLACE FUNCTION get_admin_user_role(user_id UUID)
RETURNS TABLE (id UUID, role_id INT, role_name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT ur.id, ur.role_id, r.name as role_name
    FROM public.user_roles ur
    LEFT JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant to authenticated users
GRANT EXECUTE ON FUNCTION get_admin_user_role(UUID) TO authenticated;

-- =====================================================
-- 2. GET ADMIN PROFILE FUNCTION
-- =====================================================
-- Quick profile fetch without RLS timeout
CREATE OR REPLACE FUNCTION get_admin_profile(user_id UUID)
RETURNS TABLE (id UUID, username TEXT, full_name TEXT, email TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, 
        p.username, 
        p.full_name,
        u.email
    FROM public.profiles p
    LEFT JOIN auth.users u ON u.id = p.id
    WHERE p.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant to authenticated users
GRANT EXECUTE ON FUNCTION get_admin_profile(UUID) TO authenticated;

-- =====================================================
-- 3. VERIFY ADMIN STATUS FUNCTION
-- =====================================================
-- Quickly check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_admin BOOLEAN := FALSE;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = is_admin_user.user_id
        AND r.name = 'admin'
    ) INTO is_admin;
    
    RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant to authenticated users
GRANT EXECUTE ON FUNCTION is_admin_user(UUID) TO authenticated;

-- =====================================================
-- 4. FINAL RLS POLICY CLEANUP AND SIMPLIFICATION
-- =====================================================
-- Ensure all auth tables have simple, non-blocking policies

DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Clean roles table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roles') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.roles'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.roles', rec.polname);
        END LOOP;
        CREATE POLICY "anyone_read_roles" ON public.roles FOR SELECT USING (true);
    END IF;

    -- Clean user_roles table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.user_roles'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_roles', rec.polname);
        END LOOP;
        CREATE POLICY "authenticated_read_user_roles" ON public.user_roles FOR SELECT TO authenticated USING (true);
    END IF;

    -- Clean permissions table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'permissions') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.permissions'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.permissions', rec.polname);
        END LOOP;
        CREATE POLICY "anyone_read_permissions" ON public.permissions FOR SELECT USING (true);
    END IF;

    -- Clean role_permissions table
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'role_permissions') THEN
        FOR rec IN SELECT polname FROM pg_policy WHERE polrelid = 'public.role_permissions'::regclass
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.role_permissions', rec.polname);
        END LOOP;
        CREATE POLICY "anyone_read_role_permissions" ON public.role_permissions FOR SELECT USING (true);
    END IF;

END $$;

COMMIT;
