-- =====================================================
-- FIX ANALYTICS RPC FUNCTIONS - REMOVE OVERLOADS & FIX GROUP BY
-- =====================================================
-- Addresses:
-- 1. Function overload ambiguity errors (PGRST203)
-- 2. GROUP BY violation in get_referral_analytics
-- 3. Ensure frontend calls match function signatures

BEGIN;

-- Drop all existing analytics functions to remove overloads
DROP FUNCTION IF EXISTS public.get_site_analytics(text, timestamptz, timestamptz, integer);
DROP FUNCTION IF EXISTS public.get_site_analytics(timestamptz, timestamptz);
DROP FUNCTION IF EXISTS public.get_page_analytics(text, timestamptz, timestamptz, integer);
DROP FUNCTION IF EXISTS public.get_page_analytics(timestamptz, timestamptz);
DROP FUNCTION IF EXISTS public.get_referral_analytics(uuid, text, timestamptz, timestamptz, integer);

-- =====================================================
-- 1. CREATE GET_SITE_ANALYTICS - SINGLE VERSION
-- =====================================================
CREATE FUNCTION public.get_site_analytics(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    period_date DATE,
    total_visits BIGINT,
    unique_visitors BIGINT,
    total_referrals BIGINT,
    top_pages TEXT[],
    top_referral_sources TEXT[]
)
SET search_path = '', 'public'
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        DATE_TRUNC('day', pv.visited_at)::DATE AS period_date,
        COUNT(DISTINCT pv.id)::BIGINT AS total_visits,
        COUNT(DISTINCT pv.session_id)::BIGINT AS unique_visitors,
        COUNT(DISTINCT tr.id)::BIGINT AS total_referrals,
        ARRAY_AGG(DISTINCT pv.page_path ORDER BY pv.page_path)::TEXT[] AS top_pages,
        ARRAY_AGG(DISTINCT tr.referral_source ORDER BY tr.referral_source)::TEXT[] AS top_referral_sources
    FROM public.page_visits pv
    LEFT JOIN public.tool_referrals tr ON pv.session_id = tr.session_id
    WHERE pv.visited_at BETWEEN p_start_date AND p_end_date
    GROUP BY DATE_TRUNC('day', pv.visited_at)
    ORDER BY period_date DESC;
END;
$$;

-- =====================================================
-- 2. CREATE GET_PAGE_ANALYTICS - SINGLE VERSION
-- =====================================================
CREATE FUNCTION public.get_page_analytics(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW(),
    p_page_path TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    page_path TEXT,
    total_visits BIGINT,
    unique_visitors BIGINT,
    avg_time_on_page INTERVAL,
    bounce_rate NUMERIC,
    last_visited TIMESTAMPTZ
)
SET search_path = '', 'public'
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pv.page_path::TEXT,
        COUNT(*)::BIGINT AS total_visits,
        COUNT(DISTINCT pv.session_id)::BIGINT AS unique_visitors,
        (AVG(EXTRACT(EPOCH FROM (pv.left_at - pv.visited_at))) * INTERVAL '1 second')::INTERVAL AS avg_time_on_page,
        (COUNT(CASE WHEN pv.left_at IS NULL THEN 1 END)::NUMERIC / NULLIF(COUNT(*)::NUMERIC, 0) * 100)::NUMERIC AS bounce_rate,
        MAX(pv.visited_at)::TIMESTAMPTZ AS last_visited
    FROM public.page_visits pv
    WHERE
        pv.visited_at BETWEEN p_start_date AND p_end_date
        AND (p_page_path IS NULL OR pv.page_path = p_page_path)
    GROUP BY pv.page_path
    ORDER BY total_visits DESC
    LIMIT p_limit;
END;
$$;

-- =====================================================
-- 3. CREATE GET_REFERRAL_ANALYTICS - FIXED GROUP BY
-- =====================================================
CREATE FUNCTION public.get_referral_analytics(
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
SET search_path = '', 'public'
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH click_groups AS (
        SELECT
            t.id,
            t.name,
            DATE_TRUNC(p_time_period, tr.clicked_at) AS period_start,
            COUNT(*)::BIGINT AS total_clicks,
            COUNT(DISTINCT COALESCE(tr.user_id::text, tr.session_id))::BIGINT AS unique_clicks
        FROM public.tools_v2 t
        LEFT JOIN public.tool_referrals tr ON t.id = tr.tool_id
        WHERE
            (p_tool_id IS NULL OR t.id = p_tool_id)
            AND (tr.clicked_at IS NULL OR tr.clicked_at BETWEEN p_start_date AND p_end_date)
        GROUP BY t.id, t.name, DATE_TRUNC(p_time_period, tr.clicked_at)
    )
    SELECT
        cg.id::UUID AS tool_id,
        cg.name::TEXT AS tool_name,
        cg.total_clicks,
        cg.unique_clicks,
        cg.period_start::TIMESTAMPTZ,
        (cg.period_start +
            CASE
                WHEN p_time_period = 'daily' THEN INTERVAL '1 day'
                WHEN p_time_period = 'weekly' THEN INTERVAL '1 week'
                WHEN p_time_period = 'monthly' THEN INTERVAL '1 month'
                ELSE INTERVAL '1 day'
            END)::TIMESTAMPTZ AS period_end,
        JSONB_AGG(
            JSONB_BUILD_OBJECT(
                'source', tr2.referral_source,
                'count', (
                    SELECT COUNT(*)::BIGINT
                    FROM public.tool_referrals tr3
                    WHERE tr3.tool_id = cg.id
                    AND tr3.referral_source = tr2.referral_source
                    AND tr3.clicked_at BETWEEN p_start_date AND p_end_date
                )
            )
        ) FILTER (WHERE tr2.referral_source IS NOT NULL) AS top_sources
    FROM click_groups cg
    LEFT JOIN public.tool_referrals tr2 ON cg.id = tr2.tool_id
    GROUP BY cg.id, cg.name, cg.period_start
    ORDER BY cg.total_clicks DESC
    LIMIT p_limit;
END;
$$;

-- =====================================================
-- 4. ENSURE GET_ADMIN_PROFILE DOESN'T CONFLICT
-- =====================================================
DROP FUNCTION IF EXISTS public.get_admin_profile(uuid);

CREATE FUNCTION public.get_admin_profile(user_id UUID)
RETURNS TABLE (
    id UUID,
    username TEXT,
    full_name TEXT,
    email TEXT
)
SET search_path = '', 'public'
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.username::TEXT,
        p.full_name::TEXT,
        au.email::TEXT
    FROM public.profiles p
    LEFT JOIN auth.users au ON au.id = p.id
    WHERE p.id = user_id;
END;
$$;

-- =====================================================
-- 5. ENSURE GET_ADMIN_USER_ROLE HAS SINGLE VERSION
-- =====================================================
DROP FUNCTION IF EXISTS public.get_admin_user_role(uuid);

CREATE FUNCTION public.get_admin_user_role(user_id UUID)
RETURNS TABLE (
    role_name TEXT
)
SET search_path = '', 'public'
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT ur.role_name::TEXT
    FROM public.user_roles ur
    WHERE ur.user_id = user_id
    LIMIT 1;
END;
$$;

COMMIT;
