-- Create Page Analytics System
-- This migration creates tables for tracking page visits, sessions, and user behavior

-- ================================================
-- 1. Create page_visits table
-- ================================================
CREATE TABLE IF NOT EXISTS public.page_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    page_title TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    device_type VARCHAR(50),
    browser TEXT,
    os TEXT,
    country_code VARCHAR(2),
    city TEXT,
    ip_address INET,
    user_agent TEXT,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    time_on_page INTEGER, -- seconds
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.page_visits IS 'Tracks individual page visits and user navigation';
COMMENT ON COLUMN public.page_visits.time_on_page IS 'Time spent on page in seconds';
COMMENT ON COLUMN public.page_visits.session_id IS 'Browser session identifier';

-- ================================================
-- 2. Create user_sessions table
-- ================================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    total_page_views INTEGER DEFAULT 1,
    device_type VARCHAR(50),
    browser TEXT,
    os TEXT,
    country_code VARCHAR(2),
    city TEXT,
    ip_address INET,
    user_agent TEXT,
    landing_page TEXT,
    exit_page TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.user_sessions IS 'Tracks user sessions and browsing behavior';
COMMENT ON COLUMN public.user_sessions.landing_page IS 'First page visited in session';
COMMENT ON COLUMN public.user_sessions.exit_page IS 'Last page visited in session';

-- ================================================
-- 3. Create page_analytics_summary table
-- ================================================
CREATE TABLE IF NOT EXISTS public.page_analytics_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT NOT NULL,
    date DATE NOT NULL,
    total_visits INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    avg_time_on_page NUMERIC(10, 2) DEFAULT 0,
    bounce_rate NUMERIC(5, 2) DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(page_path, date)
);

-- Add comments
COMMENT ON TABLE public.page_analytics_summary IS 'Daily aggregated analytics per page';
COMMENT ON COLUMN public.page_analytics_summary.bounce_rate IS 'Percentage of single-page sessions';

-- ================================================
-- 4. Create site_analytics_summary table
-- ================================================
CREATE TABLE IF NOT EXISTS public.site_analytics_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL UNIQUE,
    total_visits INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    avg_session_duration NUMERIC(10, 2) DEFAULT 0,
    bounce_rate NUMERIC(5, 2) DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    returning_users INTEGER DEFAULT 0,
    top_pages JSONB DEFAULT '[]'::jsonb,
    top_referrers JSONB DEFAULT '[]'::jsonb,
    top_countries JSONB DEFAULT '[]'::jsonb,
    device_breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE public.site_analytics_summary IS 'Daily aggregated site-wide analytics';

-- ================================================
-- 5. Create indexes for performance
-- ================================================

-- Indexes for page_visits
CREATE INDEX IF NOT EXISTS idx_page_visits_session_id
    ON public.page_visits(session_id);

CREATE INDEX IF NOT EXISTS idx_page_visits_user_id
    ON public.page_visits(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at
    ON public.page_visits(visited_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_visits_page_path
    ON public.page_visits(page_path);

CREATE INDEX IF NOT EXISTS idx_page_visits_composite
    ON public.page_visits(page_path, visited_at DESC);

-- Indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id
    ON public.user_sessions(session_id);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id
    ON public.user_sessions(user_id) WHERE user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at
    ON public.user_sessions(started_at DESC);

-- Indexes for page_analytics_summary
CREATE INDEX IF NOT EXISTS idx_page_analytics_summary_date
    ON public.page_analytics_summary(date DESC);

CREATE INDEX IF NOT EXISTS idx_page_analytics_summary_page_path
    ON public.page_analytics_summary(page_path);

-- Index for site_analytics_summary
CREATE INDEX IF NOT EXISTS idx_site_analytics_summary_date
    ON public.site_analytics_summary(date DESC);

-- ================================================
-- 6. Row Level Security (RLS) Policies
-- ================================================

-- Enable RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_analytics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics_summary ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert page visits
CREATE POLICY "Anyone can track page visits"
    ON public.page_visits
    FOR INSERT
    WITH CHECK (true);

-- Policy: Only admins can view page visits
CREATE POLICY "Only admins can view page visits"
    ON public.page_visits
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- Policy: Anyone can insert/update sessions
CREATE POLICY "Anyone can manage sessions"
    ON public.user_sessions
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update sessions"
    ON public.user_sessions
    FOR UPDATE
    USING (true);

-- Policy: Only admins can view sessions
CREATE POLICY "Only admins can view sessions"
    ON public.user_sessions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- Policy: Admins can view analytics summaries
CREATE POLICY "Admins can view page analytics"
    ON public.page_analytics_summary
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

CREATE POLICY "Admins can view site analytics"
    ON public.site_analytics_summary
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- ================================================
-- 7. Create updated_at triggers
-- ================================================

CREATE TRIGGER update_user_sessions_updated_at
    BEFORE UPDATE ON public.user_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_analytics_summary_updated_at
    BEFORE UPDATE ON public.page_analytics_summary
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_analytics_summary_updated_at
    BEFORE UPDATE ON public.site_analytics_summary
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- 8. Create RPC function to track page visit
-- ================================================

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
SECURITY DEFINER
AS $$
DECLARE
    v_visit_id UUID;
    v_user_id UUID;
    v_session_exists BOOLEAN;
BEGIN
    -- Get current user ID if authenticated
    v_user_id := auth.uid();

    -- Insert page visit
    INSERT INTO public.page_visits (
        user_id,
        session_id,
        page_path,
        page_title,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        device_type,
        browser,
        os,
        user_agent
    ) VALUES (
        v_user_id,
        p_session_id,
        p_page_path,
        p_page_title,
        p_referrer,
        p_utm_source,
        p_utm_medium,
        p_utm_campaign,
        p_utm_term,
        p_utm_content,
        p_device_type,
        p_browser,
        p_os,
        p_user_agent
    )
    RETURNING id INTO v_visit_id;

    -- Check if session exists
    SELECT EXISTS(SELECT 1 FROM public.user_sessions WHERE session_id = p_session_id)
    INTO v_session_exists;

    IF v_session_exists THEN
        -- Update existing session
        UPDATE public.user_sessions
        SET
            last_activity_at = NOW(),
            total_page_views = total_page_views + 1,
            exit_page = p_page_path,
            updated_at = NOW()
        WHERE session_id = p_session_id;
    ELSE
        -- Create new session
        INSERT INTO public.user_sessions (
            session_id,
            user_id,
            device_type,
            browser,
            os,
            user_agent,
            landing_page,
            exit_page,
            referrer,
            utm_source,
            utm_medium,
            utm_campaign
        ) VALUES (
            p_session_id,
            v_user_id,
            p_device_type,
            p_browser,
            p_os,
            p_user_agent,
            p_page_path,
            p_page_path,
            p_referrer,
            p_utm_source,
            p_utm_medium,
            p_utm_campaign
        );
    END IF;

    RETURN v_visit_id;
END;
$$;

-- ================================================
-- 9. Create RPC function to get page analytics
-- ================================================

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

-- ================================================
-- 10. Create RPC function to get site analytics
-- ================================================

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
        0::BIGINT AS returning_users -- Placeholder for now
    FROM public.page_visits pv
    WHERE pv.visited_at BETWEEN p_start_date AND p_end_date
    GROUP BY pv.visited_at::DATE
    ORDER BY date DESC;
END;
$$;

-- ================================================
-- 11. Create permission for page analytics
-- ================================================

INSERT INTO public.permissions (name, description)
VALUES ('view_page_analytics', 'Can view page visit analytics and user behavior data')
ON CONFLICT (name) DO NOTHING;

-- Grant permission to admin role
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r, public.permissions p
WHERE r.name = 'admin' AND p.name = 'view_page_analytics'
ON CONFLICT DO NOTHING;

-- ================================================
-- Completed: Page Analytics Migration
-- ================================================
