-- Fix RPC function type mismatch for get_referral_analytics
-- This fixes the "varchar does not match text" error

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
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    RETURN QUERY
    SELECT
        t.id AS tool_id,
        t.name::TEXT AS tool_name, -- Cast to TEXT to match return type
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
