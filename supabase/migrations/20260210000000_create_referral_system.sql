-- Create Tool Referral System
-- This migration creates tables for tracking tool referrals and analytics

-- ================================================
-- 1. Create tool_referrals table
-- ================================================
CREATE TABLE IF NOT EXISTS public.tool_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES public.tools_v2(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    referral_source TEXT NOT NULL DEFAULT 'direct',
    clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    country_code VARCHAR(2),
    device_type VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.tool_referrals IS 'Tracks individual tool referral clicks and visits';
COMMENT ON COLUMN public.tool_referrals.referral_source IS 'Source of the referral (e.g., search, category_page, home_featured, direct)';
COMMENT ON COLUMN public.tool_referrals.device_type IS 'Type of device used (mobile, tablet, desktop)';

-- ================================================
-- 2. Create tool_referral_analytics table
-- ================================================
CREATE TABLE IF NOT EXISTS public.tool_referral_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id UUID NOT NULL REFERENCES public.tools_v2(id) ON DELETE CASCADE,
    total_clicks INTEGER NOT NULL DEFAULT 0,
    unique_clicks INTEGER NOT NULL DEFAULT 0,
    time_period VARCHAR(20) NOT NULL CHECK (time_period IN ('daily', 'weekly', 'monthly')),
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tool_id, time_period, period_start)
);

-- Add comments
COMMENT ON TABLE public.tool_referral_analytics IS 'Aggregated analytics for tool referrals by time period';
COMMENT ON COLUMN public.tool_referral_analytics.metadata IS 'Additional analytics data (top sources, conversion rates, etc.)';

-- ================================================
-- 3. Create indexes for performance
-- ================================================

-- Indexes for tool_referrals
CREATE INDEX IF NOT EXISTS idx_tool_referrals_tool_id
    ON public.tool_referrals(tool_id);

CREATE INDEX IF NOT EXISTS idx_tool_referrals_clicked_at
    ON public.tool_referrals(clicked_at DESC);

CREATE INDEX IF NOT EXISTS idx_tool_referrals_user_id
    ON public.tool_referrals(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tool_referrals_source
    ON public.tool_referrals(referral_source);

CREATE INDEX IF NOT EXISTS idx_tool_referrals_session_id
    ON public.tool_referrals(session_id) WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tool_referrals_composite
    ON public.tool_referrals(tool_id, clicked_at DESC);

-- Indexes for tool_referral_analytics
CREATE INDEX IF NOT EXISTS idx_tool_referral_analytics_tool_id
    ON public.tool_referral_analytics(tool_id);

CREATE INDEX IF NOT EXISTS idx_tool_referral_analytics_period
    ON public.tool_referral_analytics(time_period, period_start DESC);

CREATE INDEX IF NOT EXISTS idx_tool_referral_analytics_composite
    ON public.tool_referral_analytics(tool_id, time_period, period_start DESC);

-- ================================================
-- 4. Row Level Security (RLS) Policies
-- ================================================

-- Enable RLS
ALTER TABLE public.tool_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_referral_analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert referral tracking data
CREATE POLICY "Anyone can track referrals"
    ON public.tool_referrals
    FOR INSERT
    WITH CHECK (true);

-- Policy: Only admins can view raw referral data
CREATE POLICY "Only admins can view referral data"
    ON public.tool_referrals
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- Policy: Only admins can delete referral data
CREATE POLICY "Only admins can delete referral data"
    ON public.tool_referrals
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- Policy: Only system can insert analytics (via RPC functions)
CREATE POLICY "System can insert analytics"
    ON public.tool_referral_analytics
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- Policy: Admins can view analytics
CREATE POLICY "Admins can view analytics"
    ON public.tool_referral_analytics
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- Policy: Admins can update analytics
CREATE POLICY "Admins can update analytics"
    ON public.tool_referral_analytics
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- ================================================
-- 5. Create updated_at trigger for analytics
-- ================================================

CREATE TRIGGER update_tool_referral_analytics_updated_at
    BEFORE UPDATE ON public.tool_referral_analytics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- 6. Create RPC function to track tool referral
-- ================================================

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
SECURITY DEFINER
AS $$
DECLARE
    v_referral_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user ID if authenticated
    v_user_id := auth.uid();

    -- Insert referral record
    INSERT INTO public.tool_referrals (
        tool_id,
        user_id,
        referral_source,
        ip_address,
        user_agent,
        session_id,
        country_code,
        device_type
    ) VALUES (
        p_tool_id,
        v_user_id,
        p_referral_source,
        p_ip_address,
        p_user_agent,
        p_session_id,
        p_country_code,
        p_device_type
    )
    RETURNING id INTO v_referral_id;

    RETURN v_referral_id;
END;
$$;

-- ================================================
-- 7. Create RPC function to get referral analytics
-- ================================================

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

-- ================================================
-- 8. Create RPC function to get tool referral stats
-- ================================================

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
SECURITY DEFINER
AS $$
DECLARE
    v_previous_period_clicks BIGINT;
    v_current_period_clicks BIGINT;
    v_days_diff INTEGER;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin privileges required.';
    END IF;

    -- Calculate days difference
    v_days_diff := EXTRACT(DAY FROM p_end_date - p_start_date);

    -- Get current period clicks
    SELECT COUNT(*) INTO v_current_period_clicks
    FROM public.tool_referrals
    WHERE tool_id = p_tool_id
    AND clicked_at BETWEEN p_start_date AND p_end_date;

    -- Get previous period clicks for trend
    SELECT COUNT(*) INTO v_previous_period_clicks
    FROM public.tool_referrals
    WHERE tool_id = p_tool_id
    AND clicked_at BETWEEN (p_start_date - (p_end_date - p_start_date)) AND p_start_date;

    RETURN QUERY
    SELECT
        -- Total clicks in period
        (SELECT COUNT(*) FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at BETWEEN p_start_date AND p_end_date)::BIGINT AS total_clicks,

        -- Unique clicks (by user or session)
        (SELECT COUNT(DISTINCT COALESCE(user_id::text, session_id))
         FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at BETWEEN p_start_date AND p_end_date)::BIGINT AS unique_clicks,

        -- Clicks today
        (SELECT COUNT(*) FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at >= CURRENT_DATE)::BIGINT AS clicks_today,

        -- Clicks this week
        (SELECT COUNT(*) FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at >= DATE_TRUNC('week', CURRENT_DATE))::BIGINT AS clicks_this_week,

        -- Clicks this month
        (SELECT COUNT(*) FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at >= DATE_TRUNC('month', CURRENT_DATE))::BIGINT AS clicks_this_month,

        -- Top source
        (SELECT referral_source FROM public.tool_referrals
         WHERE tool_id = p_tool_id
         AND clicked_at BETWEEN p_start_date AND p_end_date
         GROUP BY referral_source
         ORDER BY COUNT(*) DESC
         LIMIT 1) AS top_source,

        -- Average clicks per day
        CASE
            WHEN v_days_diff > 0 THEN
                ROUND(v_current_period_clicks::NUMERIC / v_days_diff, 2)
            ELSE 0
        END AS avg_clicks_per_day,

        -- Trend percentage (compared to previous period)
        CASE
            WHEN v_previous_period_clicks > 0 THEN
                ROUND(((v_current_period_clicks - v_previous_period_clicks)::NUMERIC / v_previous_period_clicks) * 100, 2)
            ELSE 0
        END AS trend_percentage;
END;
$$;

-- ================================================
-- 9. Create view for quick analytics access
-- ================================================

CREATE OR REPLACE VIEW public.tool_referrals_summary AS
SELECT
    t.id AS tool_id,
    t.name AS tool_name,
    t.slug AS tool_slug,
    COUNT(tr.id) AS total_clicks,
    COUNT(DISTINCT COALESCE(tr.user_id::text, tr.session_id)) AS unique_visitors,
    COUNT(CASE WHEN tr.clicked_at >= CURRENT_DATE THEN 1 END) AS clicks_today,
    COUNT(CASE WHEN tr.clicked_at >= DATE_TRUNC('week', CURRENT_DATE) THEN 1 END) AS clicks_this_week,
    COUNT(CASE WHEN tr.clicked_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) AS clicks_this_month,
    MAX(tr.clicked_at) AS last_click_at
FROM public.tools_v2 t
LEFT JOIN public.tool_referrals tr ON t.id = tr.tool_id
GROUP BY t.id, t.name, t.slug;

-- Note: Views inherit RLS policies from underlying tables (tool_referrals, tools_v2)
-- No need to create separate RLS policy for the view

-- ================================================
-- 10. Create permission for referral analytics
-- ================================================

INSERT INTO public.permissions (name, description)
VALUES ('view_referral_analytics', 'Can view and analyze tool referral data')
ON CONFLICT (name) DO NOTHING;

-- Grant permission to admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'admin' AND p.name = 'view_referral_analytics'
ON CONFLICT DO NOTHING;

-- ================================================
-- Completed: Referral System Migration
-- ================================================
