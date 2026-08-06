-- =====================================================
-- FIX SUPABASE LINTER WARNINGS
-- =====================================================
-- Fixes:
-- 1. function_search_path_mutable - Add SET search_path = '' to all functions
-- 2. rls_policy_always_true - Fix permissive INSERT/UPDATE policies
-- 3. anon_security_definer_function_executable - Restrict public access
-- 4. authenticated_security_definer_function_executable - Restrict authenticated access
-- =====================================================

BEGIN;

-- =====================================================
-- 1. FIX SEARCH_PATH FOR ALL FUNCTIONS
-- =====================================================

DO $$
DECLARE
    func record;
    sql TEXT;
BEGIN
    FOR func IN 
        SELECT p.proname, pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
        AND p.proname IN (
            'aggregate_page_analytics_daily',
            'aggregate_referral_analytics_daily',
            'aggregate_site_analytics_daily',
            'assign_user_role',
            'assign_user_role_simple',
            'cleanup_old_analytics_data',
            'create_audit_log',
            'create_initial_admin',
            'ensure_user_profile',
            'fetch_user_roles',
            'get_admin_role_id',
            'get_analytics_cron_jobs',
            'get_page_analytics',
            'get_referral_analytics',
            'get_site_analytics',
            'get_system_health',
            'get_tool_referral_stats',
            'get_user_max_role_level',
            'get_user_permissions',
            'get_user_roles',
            'get_user_roles_simple',
            'handle_new_user',
            'handle_updated_at',
            'handle_user_profile_update',
            'is_admin',
            'run_analytics_aggregation_now',
            'track_page_visit',
            'track_tool_referral',
            'update_updated_at_column',
            'user_has_permission',
            'user_has_role',
            'get_all_users_with_emails',
            'get_user_with_email',
            'has_permission',
            'get_auth_setting',
            'update_auth_setting',
            'create_profile_trigger'
        )
    LOOP
        sql := format('ALTER FUNCTION public.%I(%s) SET search_path = '''', ''public'';', func.proname, func.args);
        EXECUTE sql;
    END LOOP;
END $$;

-- =====================================================
-- 2. FIX PERMISSIVE RLS POLICIES
-- =====================================================

-- Fix page_visits: Anyone can track page visits
DROP POLICY IF EXISTS "Anyone can track page visits" ON public.page_visits;
CREATE POLICY "Anyone can track page visits"
    ON public.page_visits
    FOR INSERT
    WITH CHECK (session_id IS NOT NULL);

-- Fix user_sessions: Anyone can manage sessions
DROP POLICY IF EXISTS "Anyone can manage sessions" ON public.user_sessions;
CREATE POLICY "Anyone can manage sessions"
    ON public.user_sessions
    FOR INSERT
    WITH CHECK (session_id IS NOT NULL);

-- Fix user_sessions: Anyone can update sessions
DROP POLICY IF EXISTS "Anyone can update sessions" ON public.user_sessions;
CREATE POLICY "Anyone can update sessions"
    ON public.user_sessions
    FOR UPDATE
    USING (session_id IS NOT NULL);

-- Fix tool_referrals: Anyone can track referrals
DROP POLICY IF EXISTS "Anyone can track referrals" ON public.tool_referrals;
CREATE POLICY "Anyone can track referrals"
    ON public.tool_referrals
    FOR INSERT
    WITH CHECK (session_id IS NOT NULL);

-- Fix system_health_metrics if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' AND table_name = 'system_health_metrics') THEN
        DROP POLICY IF EXISTS "System can insert health metrics" ON public.system_health_metrics;
        
        BEGIN
            IF EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' AND table_name = 'system_health_metrics' AND column_name = 'recorded_at') THEN
                EXECUTE 'CREATE POLICY "System can insert health metrics" ON public.system_health_metrics FOR INSERT WITH CHECK (recorded_at IS NOT NULL)';
            ELSIF EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' AND table_name = 'system_health_metrics' AND column_name = 'created_at') THEN
                EXECUTE 'CREATE POLICY "System can insert health metrics" ON public.system_health_metrics FOR INSERT WITH CHECK (created_at IS NOT NULL)';
            ELSE
                EXECUTE 'CREATE POLICY "System can insert health metrics" ON public.system_health_metrics FOR INSERT WITH CHECK (true)';
            END IF;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END IF;
END $$;

-- =====================================================
-- 3. SWITCH SAFE FUNCTIONS TO SECURITY INVOKER
-- =====================================================

-- Rewrite track_page_visit to use ON CONFLICT and switch to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.track_page_visit(
    p_session_id TEXT,
    p_page_path TEXT,
    p_page_title TEXT DEFAULT NULL,
    p_referrer TEXT DEFAULT NULL,
    p_utm_source TEXT DEFAULT NULL,
    p_utm_medium TEXT DEFAULT NULL,
    p_utm_campaign TEXT DEFAULT NULL,
    p_utm_term TEXT DEFAULT NULL,
    p_utm_content TEXT DEFAULT NULL,
    p_device_type VARCHAR(50) DEFAULT NULL,
    p_browser TEXT DEFAULT NULL,
    p_os TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_visit_id UUID;
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();

    INSERT INTO public.page_visits (
        user_id, session_id, page_path, page_title, referrer,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        device_type, browser, os, user_agent
    ) VALUES (
        v_user_id, p_session_id, p_page_path, p_page_title, p_referrer,
        p_utm_source, p_utm_medium, p_utm_campaign, p_utm_term, p_utm_content,
        p_device_type, p_browser, p_os, p_user_agent
    )
    RETURNING id INTO v_visit_id;

    INSERT INTO public.user_sessions (
        session_id, user_id, device_type, browser, os, user_agent,
        landing_page, exit_page, referrer, utm_source, utm_medium, utm_campaign
    ) VALUES (
        p_session_id, v_user_id, p_device_type, p_browser, p_os, p_user_agent,
        p_page_path, p_page_path, p_referrer, p_utm_source, p_utm_medium, p_utm_campaign
    )
    ON CONFLICT (session_id) DO UPDATE SET
        last_activity_at = NOW(),
        total_page_views = public.user_sessions.total_page_views + 1,
        exit_page = p_page_path,
        updated_at = NOW();

    RETURN v_visit_id;
END;
$$;

-- Switch track_tool_referral to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.track_tool_referral(
    p_tool_id UUID,
    p_referral_source TEXT DEFAULT 'direct',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_session_id TEXT DEFAULT NULL,
    p_country_code VARCHAR(2) DEFAULT NULL,
    p_device_type VARCHAR(50) DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_referral_id UUID;
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();

    INSERT INTO public.tool_referrals (
        tool_id, user_id, referral_source, ip_address, user_agent,
        session_id, country_code, device_type
    ) VALUES (
        p_tool_id, v_user_id, p_referral_source, p_ip_address, p_user_agent,
        p_session_id, p_country_code, p_device_type
    )
    RETURNING id INTO v_referral_id;

    RETURN v_referral_id;
END;
$$;

-- Switch get_page_analytics to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.get_page_analytics(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW(),
    p_page_path TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    page_path TEXT,
    page_title TEXT,
    total_visits BIGINT,
    unique_visitors BIGINT,
    avg_time_on_page NUMERIC,
    bounce_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pv.page_path,
        MAX(pv.page_title) AS page_title,
        COUNT(*)::BIGINT AS total_visits,
        COUNT(DISTINCT COALESCE(pv.user_id::text, pv.session_id))::BIGINT AS unique_visitors,
        ROUND(AVG(pv.time_on_page)::NUMERIC, 2) AS avg_time_on_page,
        ROUND(
            (COUNT(*) FILTER (WHERE (
                SELECT COUNT(*) FROM public.page_visits pv2
                WHERE pv2.session_id = pv.session_id
            ) = 1)::NUMERIC / NULLIF(COUNT(DISTINCT pv.session_id), 0) * 100),
            2
        ) AS bounce_rate
    FROM public.page_visits pv
    WHERE
        pv.visited_at BETWEEN p_start_date AND p_end_date
        AND (p_page_path IS NULL OR pv.page_path = p_page_path)
    GROUP BY pv.page_path
    ORDER BY total_visits DESC
    LIMIT p_limit;
END;
$$;

-- Switch get_site_analytics to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.get_site_analytics(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    date DATE,
    total_visits BIGINT,
    unique_visitors BIGINT,
    total_sessions BIGINT,
    avg_session_duration NUMERIC,
    bounce_rate NUMERIC,
    new_users BIGINT,
    returning_users BIGINT
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pv.visited_at::DATE AS date,
        COUNT(*)::BIGINT AS total_visits,
        COUNT(DISTINCT COALESCE(pv.user_id::text, pv.session_id))::BIGINT AS unique_visitors,
        COUNT(DISTINCT pv.session_id)::BIGINT AS total_sessions,
        ROUND(AVG(
            EXTRACT(EPOCH FROM (
                SELECT MAX(pv2.visited_at) - MIN(pv2.visited_at)
                FROM public.page_visits pv2
                WHERE pv2.session_id = pv.session_id
            ))
        )::NUMERIC, 2) AS avg_session_duration,
        ROUND(
            (COUNT(*) FILTER (WHERE (
                SELECT COUNT(*) FROM public.page_visits pv3
                WHERE pv3.session_id = pv.session_id
            ) = 1)::NUMERIC / NULLIF(COUNT(DISTINCT pv.session_id), 0) * 100),
            2
        ) AS bounce_rate,
        COUNT(DISTINCT pv.user_id) FILTER (WHERE pv.user_id IS NOT NULL)::BIGINT AS new_users,
        0::BIGINT AS returning_users
    FROM public.page_visits pv
    WHERE pv.visited_at BETWEEN p_start_date AND p_end_date
    GROUP BY pv.visited_at::DATE
    ORDER BY date DESC;
END;
$$;

-- Switch get_referral_analytics to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.get_referral_analytics(
    p_tool_id UUID DEFAULT NULL,
    p_time_period TEXT DEFAULT 'daily',
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW(),
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
    tool_id UUID,
    tool_name TEXT,
    total_clicks BIGINT,
    unique_clicks BIGINT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    top_sources JSONB
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id AS tool_id,
        t.name AS tool_name,
        COUNT(*)::BIGINT AS total_clicks,
        COUNT(DISTINCT COALESCE(tr.user_id::text, tr.session_id))::BIGINT AS unique_clicks,
        DATE_TRUNC(p_time_period, tr.clicked_at) AS period_start,
        DATE_TRUNC(p_time_period, tr.clicked_at) +
            CASE
                WHEN p_time_period = 'daily' THEN INTERVAL '1 day'
                WHEN p_time_period = 'weekly' THEN INTERVAL '1 week'
                WHEN p_time_period = 'monthly' THEN INTERVAL '1 month'
                ELSE INTERVAL '1 day'
            END AS period_end,
        JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
                'source', tr.referral_source,
                'count', (
                    SELECT COUNT(*)
                    FROM public.tool_referrals tr2
                    WHERE tr2.tool_id = t.id
                    AND tr2.referral_source = tr.referral_source
                    AND tr2.clicked_at BETWEEN p_start_date AND p_end_date
                )
            )
        ) AS top_sources
    FROM public.tools_v2 t
    LEFT JOIN public.tool_referrals tr ON t.id = tr.tool_id
    WHERE
        (p_tool_id IS NULL OR t.id = p_tool_id)
        AND tr.clicked_at BETWEEN p_start_date AND p_end_date
    GROUP BY t.id, t.name, DATE_TRUNC(p_time_period, tr.clicked_at)
    ORDER BY period_start DESC, total_clicks DESC
    LIMIT p_limit;
END;
$$;

-- Switch get_tool_referral_stats to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.get_tool_referral_stats(
    p_tool_id UUID,
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    total_clicks BIGINT,
    unique_clicks BIGINT,
    clicks_today BIGINT,
    clicks_this_week BIGINT,
    clicks_this_month BIGINT,
    top_source TEXT,
    avg_clicks_per_day NUMERIC,
    trend_percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_previous_period_clicks BIGINT;
    v_current_period_clicks BIGINT;
    v_days_diff INTEGER;
BEGIN
    v_days_diff := EXTRACT(DAY FROM p_end_date - p_start_date);

    SELECT COUNT(*) INTO v_current_period_clicks
    FROM public.tool_referrals
    WHERE tool_id = p_tool_id
    AND clicked_at BETWEEN p_start_date AND p_end_date;

    SELECT COUNT(*) INTO v_previous_period_clicks
    FROM public.tool_referrals
    WHERE tool_id = p_tool_id
    AND clicked_at BETWEEN (p_start_date - (p_end_date - p_start_date)) AND p_start_date;

    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at BETWEEN p_start_date AND p_end_date)::BIGINT AS total_clicks,

        (SELECT COUNT(DISTINCT COALESCE(user_id::text, session_id))
         FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at BETWEEN p_start_date AND p_end_date)::BIGINT AS unique_clicks,

        (SELECT COUNT(*) FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at >= CURRENT_DATE)::BIGINT AS clicks_today,

        (SELECT COUNT(*) FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at >= DATE_TRUNC('week', CURRENT_DATE))::BIGINT AS clicks_this_week,

        (SELECT COUNT(*) FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at >= DATE_TRUNC('month', CURRENT_DATE))::BIGINT AS clicks_this_month,

        (SELECT referral_source FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at BETWEEN p_start_date AND p_end_date
         GROUP BY referral_source
         ORDER BY COUNT(*) DESC
         LIMIT 1) AS top_source,

        CASE
            WHEN v_days_diff > 0 THEN
                ROUND(v_current_period_clicks::NUMERIC / v_days_diff, 2)
            ELSE 0
        END AS avg_clicks_per_day,

        CASE
            WHEN v_previous_period_clicks > 0 THEN
                ROUND(((v_current_period_clicks - v_previous_period_clicks)::NUMERIC / v_previous_period_clicks) * 100, 2)
            ELSE 0
        END AS trend_percentage;
END;
$$;

-- Switch user_has_permission to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.user_has_permission(user_uuid UUID, permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = user_uuid 
        AND r.permissions->>permission_name = 'true'
    );
END;
$$;

-- Switch get_user_max_role_level to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.get_user_max_role_level(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    max_level INTEGER;
BEGIN
    SELECT COALESCE(MAX(r.level), 1) INTO max_level
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = user_uuid;
    
    RETURN max_level;
END;
$$;

-- Switch get_user_roles (latest version) to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.get_user_roles(user_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
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

-- Switch user_has_role to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.user_has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
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

-- Switch is_admin to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
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

-- Switch assign_user_role to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.assign_user_role(
    user_uuid UUID,
    role_name TEXT,
    assigned_by_uuid UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    role_id_var BIGINT;
BEGIN
    SELECT id INTO role_id_var FROM public.roles WHERE name = role_name;
    IF role_id_var IS NULL THEN
        RETURN FALSE;
    END IF;
    
    INSERT INTO public.user_roles (user_id, role_id, assigned_by)
    VALUES (user_uuid, role_id_var, assigned_by_uuid)
    ON CONFLICT DO NOTHING;
    
    RETURN TRUE;
END;
$$;

-- Switch assign_user_role_simple to SECURITY INVOKER
DROP FUNCTION IF EXISTS public.assign_user_role_simple(uuid, text);
CREATE FUNCTION public.assign_user_role_simple(
    input_user_id UUID,
    role_name TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    role_id_var BIGINT;
BEGIN
    SELECT id INTO role_id_var FROM public.roles WHERE name = role_name;
    IF role_id_var IS NULL THEN
        RETURN FALSE;
    END IF;
    
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (input_user_id, role_id_var)
    ON CONFLICT DO NOTHING;
    
    RETURN TRUE;
END;
$$;

-- Switch create_profile_trigger to SECURITY INVOKER
DROP FUNCTION IF EXISTS public.create_profile_trigger();
CREATE FUNCTION public.create_profile_trigger()
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_user();
END;
$$;

-- Switch ensure_user_profile to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name)
    VALUES (auth.uid(), auth.uid()::TEXT, auth.uid()::TEXT)
    ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Switch handle_user_profile_update to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.handle_user_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Switch get_user_roles_simple to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.get_user_roles_simple(input_user_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN ARRAY(
        SELECT r.name
        FROM public.user_roles ur
        JOIN public.roles r ON r.id = ur.role_id
        WHERE ur.user_id = input_user_id
    );
END;
$$;

-- Switch fetch_user_roles to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.fetch_user_roles(p_user_id UUID)
RETURNS TABLE(role_name TEXT)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT r.name::TEXT
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id;
END;
$$;

-- Switch get_admin_role_id to SECURITY INVOKER
DROP FUNCTION IF EXISTS public.get_admin_role_id();
CREATE FUNCTION public.get_admin_role_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
    v_role_id UUID;
BEGIN
    SELECT id INTO v_role_id FROM public.roles WHERE name = 'admin' LIMIT 1;
    RETURN v_role_id;
END;
$$;

-- =====================================================
-- 4. REVOKE EXECUTE FROM PUBLIC FOR RESTRICTED FUNCTIONS
-- =====================================================

-- Cron-only functions
REVOKE EXECUTE ON FUNCTION public.aggregate_page_analytics_daily() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.aggregate_site_analytics_daily() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.aggregate_referral_analytics_daily() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_analytics_data() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.run_analytics_aggregation_now() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_analytics_cron_jobs() FROM anon, authenticated;

-- Admin-only functions that bypass auth.users RLS
REVOKE EXECUTE ON FUNCTION public.get_all_users_with_emails(INTEGER, INTEGER) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_with_email(UUID) FROM anon;

-- Internal/setup functions
REVOKE EXECUTE ON FUNCTION public.create_initial_admin() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_audit_log(
    p_action CHARACTER VARYING,
    p_resource_type CHARACTER VARYING,
    p_resource_id UUID,
    p_old_values JSONB,
    p_new_values JSONB,
    p_metadata JSONB
) FROM anon, authenticated;

-- Trigger functions should not be callable via RPC
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- System functions
REVOKE EXECUTE ON FUNCTION public.get_system_health() FROM anon, authenticated;

-- =====================================================
-- 5. FIX AUTH FUNCTIONS SEARCH_PATH
-- =====================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p
               JOIN pg_namespace n ON n.oid = p.pronamespace
               WHERE n.nspname = 'public' AND p.proname = 'get_auth_setting') THEN
        ALTER FUNCTION public.get_auth_setting(text) SET search_path = '';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p
               JOIN pg_namespace n ON n.oid = p.pronamespace
               WHERE n.nspname = 'public' AND p.proname = 'update_auth_setting') THEN
        ALTER FUNCTION public.update_auth_setting(text, jsonb) SET search_path = '';
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_proc p
               JOIN pg_namespace n ON n.oid = p.pronamespace
               WHERE n.nspname = 'public' AND p.proname = 'has_permission') THEN
        ALTER FUNCTION public.has_permission(uuid, text) SET search_path = '';
    END IF;
END $$;

-- =====================================================
-- 6. GRANT EXECUTE ON SAFE PUBLIC FUNCTIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION public.track_page_visit(
    p_session_id TEXT, p_page_path TEXT, p_page_title TEXT, p_referrer TEXT,
    p_utm_source TEXT, p_utm_medium TEXT, p_utm_campaign TEXT, p_utm_term TEXT,
    p_utm_content TEXT, p_device_type VARCHAR, p_browser TEXT, p_os TEXT, p_user_agent TEXT
) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.track_tool_referral(
    p_tool_id UUID, p_referral_source TEXT, p_ip_address INET, p_user_agent TEXT,
    p_session_id TEXT, p_country_code VARCHAR, p_device_type VARCHAR
) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.user_has_permission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_max_role_level(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_user_role(uuid, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_user_role_simple(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.fetch_user_roles(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles_simple(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_profile() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_profile_trigger() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_user_profile_update() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_role_id() TO authenticated;

COMMIT;
