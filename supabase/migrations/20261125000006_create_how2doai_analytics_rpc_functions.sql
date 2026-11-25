-- Migration: 20261125000006_create_how2doai_analytics_rpc_functions.sql
-- Description: Creates get_site_analytics and get_referral_analytics in how2doai schema.

-- ==============================================================================
-- 1. Create get_site_analytics in how2doai schema
-- ==============================================================================
CREATE OR REPLACE FUNCTION how2doai.get_site_analytics(
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = how2doai, public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT
        DATE_TRUNC('day', pv.visited_at)::DATE AS period_date,
        COUNT(DISTINCT pv.id)::BIGINT AS total_visits,
        COUNT(DISTINCT pv.session_id)::BIGINT AS unique_visitors,
        COUNT(DISTINCT tr.id)::BIGINT AS total_referrals,
        COALESCE(ARRAY_AGG(DISTINCT pv.page_path ORDER BY pv.page_path) FILTER (WHERE pv.page_path IS NOT NULL), '{}'::TEXT[]) AS top_pages,
        COALESCE(ARRAY_AGG(DISTINCT tr.referral_source ORDER BY tr.referral_source) FILTER (WHERE tr.referral_source IS NOT NULL), '{}'::TEXT[]) AS top_referral_sources
    FROM how2doai.page_visits pv
    LEFT JOIN how2doai.tool_referrals tr ON pv.session_id = tr.session_id
    WHERE pv.visited_at BETWEEN p_start_date AND p_end_date
    GROUP BY DATE_TRUNC('day', pv.visited_at)
    ORDER BY period_date DESC;
END;
$$;

-- ==============================================================================
-- 2. Create get_referral_analytics in how2doai schema
-- ==============================================================================
CREATE OR REPLACE FUNCTION how2doai.get_referral_analytics(
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
SECURITY DEFINER
SET search_path = how2doai, public, pg_temp
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
        FROM how2doai.tools_v2 t
        JOIN how2doai.tool_referrals tr ON t.id = tr.tool_id
        WHERE
            (p_tool_id IS NULL OR t.id = p_tool_id)
            AND tr.clicked_at BETWEEN p_start_date AND p_end_date
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
        COALESCE(
            JSONB_AGG(
                JSONB_BUILD_OBJECT(
                    'source', tr2.referral_source,
                    'count', (
                        SELECT COUNT(*)::BIGINT
                        FROM how2doai.tool_referrals tr3
                        WHERE tr3.tool_id = cg.id
                        AND tr3.referral_source = tr2.referral_source
                        AND tr3.clicked_at BETWEEN p_start_date AND p_end_date
                    )
                )
            ) FILTER (WHERE tr2.referral_source IS NOT NULL),
            '[]'::JSONB
        ) AS top_sources
    FROM click_groups cg
    LEFT JOIN how2doai.tool_referrals tr2 ON cg.id = tr2.tool_id
    GROUP BY cg.id, cg.name, cg.period_start, cg.total_clicks, cg.unique_clicks
    ORDER BY cg.total_clicks DESC
    LIMIT p_limit;
END;
$$;

-- ==============================================================================
-- 3. Permissions & Grants
-- ==============================================================================
GRANT EXECUTE ON FUNCTION how2doai.get_site_analytics(TIMESTAMPTZ, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION how2doai.get_referral_analytics(UUID, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, INTEGER) TO authenticated;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
