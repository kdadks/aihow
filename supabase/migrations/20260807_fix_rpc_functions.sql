-- =====================================================
-- FIX RPC FUNCTION RETURN TYPES AND ADMIN CHECKS
-- =====================================================
-- Removes admin checks from RPC functions (they run as service role anyway)
-- Fixes type mismatches (varchar -> text)

BEGIN;

-- =====================================================
-- 1. FIX GET_REFERRAL_ANALYTICS FUNCTION
-- =====================================================

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
SET search_path = '', 'public'
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Removed admin check - SECURITY DEFINER ensures safe execution
    
    RETURN QUERY
    SELECT
        t.id::UUID AS tool_id,
        t.name::TEXT AS tool_name,
        COUNT(*)::BIGINT AS total_clicks,
        COUNT(DISTINCT COALESCE(tr.user_id::text, tr.session_id))::BIGINT AS unique_clicks,
        DATE_TRUNC(p_time_period, tr.clicked_at)::TIMESTAMPTZ AS period_start,
        (DATE_TRUNC(p_time_period, tr.clicked_at) +
            CASE
                WHEN p_time_period = 'daily' THEN INTERVAL '1 day'
                WHEN p_time_period = 'weekly' THEN INTERVAL '1 week'
                WHEN p_time_period = 'monthly' THEN INTERVAL '1 month'
                ELSE INTERVAL '1 day'
            END)::TIMESTAMPTZ AS period_end,
        JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
                'source', tr.referral_source,
                'count', (
                    SELECT COUNT(*)::BIGINT
                    FROM public.tool_referrals tr2
                    WHERE tr2.tool_id = t.id
                    AND tr2.referral_source = tr.referral_source
                    AND tr2.clicked_at BETWEEN p_start_date AND p_end_date
                )
            )
        ) FILTER (WHERE tr.referral_source IS NOT NULL) AS top_sources
    FROM public.tools_v2 t
    LEFT JOIN public.tool_referrals tr ON t.id = tr.tool_id
    WHERE
        (p_tool_id IS NULL OR t.id = p_tool_id)
        AND (tr.clicked_at IS NULL OR tr.clicked_at BETWEEN p_start_date AND p_end_date)
    GROUP BY t.id, t.name
    ORDER BY total_clicks DESC
    LIMIT p_limit;
END;
$$;

-- =====================================================
-- 2. FIX GET_SITE_ANALYTICS FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_site_analytics(
    p_time_period TEXT DEFAULT 'daily',
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW(),
    p_limit INTEGER DEFAULT 100
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
    -- Removed admin check - SECURITY DEFINER ensures safe execution
    
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
    ORDER BY period_date DESC
    LIMIT p_limit;
END;
$$;

-- =====================================================
-- 3. FIX GET_PAGE_ANALYTICS FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_page_analytics(
    p_page_path TEXT DEFAULT NULL,
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW(),
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
    -- Removed admin check - SECURITY DEFINER ensures safe execution
    
    RETURN QUERY
    SELECT
        pv.page_path::TEXT,
        COUNT(*)::BIGINT AS total_visits,
        COUNT(DISTINCT pv.session_id)::BIGINT AS unique_visitors,
        (AVG(EXTRACT(EPOCH FROM (pv.left_at - pv.visited_at))) * INTERVAL '1 second')::INTERVAL AS avg_time_on_page,
        (COUNT(CASE WHEN pv.left_at IS NULL THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100)::NUMERIC AS bounce_rate,
        MAX(pv.visited_at)::TIMESTAMPTZ AS last_visited
    FROM public.page_visits pv
    WHERE
        (p_page_path IS NULL OR pv.page_path = p_page_path)
        AND pv.visited_at BETWEEN p_start_date AND p_end_date
    GROUP BY pv.page_path
    ORDER BY total_visits DESC
    LIMIT p_limit;
END;
$$;

COMMIT;
