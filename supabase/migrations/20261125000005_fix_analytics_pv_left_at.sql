-- Migration: 20261125000005_fix_analytics_pv_left_at.sql
-- Description: Fixes 42703 column pv.left_at does not exist by adding left_at column and updating get_page_analytics.

-- ==============================================================================
-- 1. Add left_at column to page_visits if missing
-- ==============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'how2doai' AND table_name = 'page_visits') THEN
        ALTER TABLE how2doai.page_visits ADD COLUMN IF NOT EXISTS left_at TIMESTAMPTZ;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'page_visits') THEN
        ALTER TABLE public.page_visits ADD COLUMN IF NOT EXISTS left_at TIMESTAMPTZ;
    END IF;
END $$;

-- ==============================================================================
-- 2. Update get_page_analytics in how2doai and public schemas
-- ==============================================================================
CREATE OR REPLACE FUNCTION how2doai.get_page_analytics(
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = how2doai, public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pv.page_path::TEXT,
        COUNT(*)::BIGINT AS total_visits,
        COUNT(DISTINCT pv.session_id)::BIGINT AS unique_visitors,
        (COALESCE(AVG(COALESCE(pv.time_on_page, EXTRACT(EPOCH FROM (pv.left_at - pv.visited_at)), 0)), 0) * INTERVAL '1 second')::INTERVAL AS avg_time_on_page,
        (COUNT(CASE WHEN COALESCE(pv.time_on_page, 0) = 0 AND pv.left_at IS NULL THEN 1 END)::NUMERIC / NULLIF(COUNT(*)::NUMERIC, 0) * 100)::NUMERIC AS bounce_rate,
        MAX(pv.visited_at)::TIMESTAMPTZ AS last_visited
    FROM how2doai.page_visits pv
    WHERE
        pv.visited_at BETWEEN p_start_date AND p_end_date
        AND (p_page_path IS NULL OR pv.page_path = p_page_path)
    GROUP BY pv.page_path
    ORDER BY total_visits DESC
    LIMIT p_limit;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_page_analytics(
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
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, how2doai, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pv.page_path::TEXT,
        COUNT(*)::BIGINT AS total_visits,
        COUNT(DISTINCT pv.session_id)::BIGINT AS unique_visitors,
        (COALESCE(AVG(COALESCE(pv.time_on_page, EXTRACT(EPOCH FROM (pv.left_at - pv.visited_at)), 0)), 0) * INTERVAL '1 second')::INTERVAL AS avg_time_on_page,
        (COUNT(CASE WHEN COALESCE(pv.time_on_page, 0) = 0 AND pv.left_at IS NULL THEN 1 END)::NUMERIC / NULLIF(COUNT(*)::NUMERIC, 0) * 100)::NUMERIC AS bounce_rate,
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

GRANT EXECUTE ON FUNCTION how2doai.get_page_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_page_analytics(TIMESTAMPTZ, TIMESTAMPTZ, TEXT, INTEGER) TO authenticated;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
