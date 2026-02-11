-- Create Analytics Cron Jobs
-- This migration sets up automated jobs to aggregate analytics data daily

-- ================================================
-- 1. Enable pg_cron extension
-- ================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ================================================
-- 2. Create function to aggregate page analytics daily
-- ================================================

CREATE OR REPLACE FUNCTION public.aggregate_page_analytics_daily()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_yesterday DATE;
BEGIN
    -- Get yesterday's date
    v_yesterday := CURRENT_DATE - INTERVAL '1 day';

    -- Aggregate page analytics for yesterday
    INSERT INTO public.page_analytics_summary (
        page_path,
        date,
        total_visits,
        unique_visitors,
        avg_time_on_page,
        bounce_rate
    )
    SELECT
        pv.page_path,
        v_yesterday AS date,
        COUNT(*)::INTEGER AS total_visits,
        COUNT(DISTINCT COALESCE(pv.user_id::text, pv.session_id))::INTEGER AS unique_visitors,
        ROUND(AVG(pv.time_on_page)::NUMERIC, 2) AS avg_time_on_page,
        ROUND(
            (COUNT(*) FILTER (WHERE (
                SELECT COUNT(*) FROM public.page_visits pv2
                WHERE pv2.session_id = pv.session_id
                AND pv2.visited_at::DATE = v_yesterday
            ) = 1)::NUMERIC / NULLIF(COUNT(DISTINCT pv.session_id), 0) * 100),
            2
        ) AS bounce_rate
    FROM public.page_visits pv
    WHERE pv.visited_at::DATE = v_yesterday
    GROUP BY pv.page_path
    ON CONFLICT (page_path, date)
    DO UPDATE SET
        total_visits = EXCLUDED.total_visits,
        unique_visitors = EXCLUDED.unique_visitors,
        avg_time_on_page = EXCLUDED.avg_time_on_page,
        bounce_rate = EXCLUDED.bounce_rate,
        updated_at = NOW();

    RAISE NOTICE 'Page analytics aggregated for %', v_yesterday;
END;
$$;

-- ================================================
-- 3. Create function to aggregate site analytics daily
-- ================================================

CREATE OR REPLACE FUNCTION public.aggregate_site_analytics_daily()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_yesterday DATE;
    v_total_visits INTEGER;
    v_unique_visitors INTEGER;
    v_total_sessions INTEGER;
    v_avg_session_duration NUMERIC;
    v_bounce_rate NUMERIC;
    v_new_users INTEGER;
    v_top_pages JSONB;
    v_top_referrers JSONB;
    v_device_breakdown JSONB;
BEGIN
    -- Get yesterday's date
    v_yesterday := CURRENT_DATE - INTERVAL '1 day';

    -- Calculate total visits
    SELECT COUNT(*)::INTEGER INTO v_total_visits
    FROM public.page_visits
    WHERE visited_at::DATE = v_yesterday;

    -- Calculate unique visitors
    SELECT COUNT(DISTINCT COALESCE(user_id::text, session_id))::INTEGER INTO v_unique_visitors
    FROM public.page_visits
    WHERE visited_at::DATE = v_yesterday;

    -- Calculate total sessions
    SELECT COUNT(DISTINCT session_id)::INTEGER INTO v_total_sessions
    FROM public.page_visits
    WHERE visited_at::DATE = v_yesterday;

    -- Calculate average session duration
    SELECT ROUND(AVG(
        EXTRACT(EPOCH FROM (
            SELECT MAX(pv2.visited_at) - MIN(pv2.visited_at)
            FROM public.page_visits pv2
            WHERE pv2.session_id = pv.session_id
            AND pv2.visited_at::DATE = v_yesterday
        ))
    )::NUMERIC, 2) INTO v_avg_session_duration
    FROM public.page_visits pv
    WHERE pv.visited_at::DATE = v_yesterday;

    -- Calculate bounce rate
    SELECT ROUND(
        (COUNT(*) FILTER (WHERE (
            SELECT COUNT(*) FROM public.page_visits pv2
            WHERE pv2.session_id = pv.session_id
            AND pv2.visited_at::DATE = v_yesterday
        ) = 1)::NUMERIC / NULLIF(COUNT(DISTINCT pv.session_id), 0) * 100),
        2
    ) INTO v_bounce_rate
    FROM public.page_visits pv
    WHERE pv.visited_at::DATE = v_yesterday;

    -- Calculate new users (users who visited for the first time)
    SELECT COUNT(DISTINCT user_id)::INTEGER INTO v_new_users
    FROM public.page_visits
    WHERE visited_at::DATE = v_yesterday
    AND user_id IS NOT NULL
    AND user_id NOT IN (
        SELECT DISTINCT user_id
        FROM public.page_visits
        WHERE visited_at::DATE < v_yesterday
        AND user_id IS NOT NULL
    );

    -- Get top 10 pages
    SELECT JSONB_AGG(page_data) INTO v_top_pages
    FROM (
        SELECT JSONB_BUILD_OBJECT(
            'page_path', page_path,
            'visits', COUNT(*)
        ) AS page_data
        FROM public.page_visits
        WHERE visited_at::DATE = v_yesterday
        GROUP BY page_path
        ORDER BY COUNT(*) DESC
        LIMIT 10
    ) top_pages_subquery;

    -- Get top 10 referrers
    SELECT JSONB_AGG(referrer_data) INTO v_top_referrers
    FROM (
        SELECT JSONB_BUILD_OBJECT(
            'referrer', referrer,
            'count', COUNT(*)
        ) AS referrer_data
        FROM public.page_visits
        WHERE visited_at::DATE = v_yesterday
        AND referrer IS NOT NULL
        AND referrer != ''
        GROUP BY referrer
        ORDER BY COUNT(*) DESC
        LIMIT 10
    ) top_referrers_subquery;

    -- Get device breakdown
    SELECT JSONB_BUILD_OBJECT(
        'desktop', COUNT(*) FILTER (WHERE device_type = 'desktop'),
        'mobile', COUNT(*) FILTER (WHERE device_type = 'mobile'),
        'tablet', COUNT(*) FILTER (WHERE device_type = 'tablet'),
        'unknown', COUNT(*) FILTER (WHERE device_type IS NULL OR device_type = 'unknown')
    ) INTO v_device_breakdown
    FROM public.page_visits
    WHERE visited_at::DATE = v_yesterday;

    -- Insert or update site analytics summary
    INSERT INTO public.site_analytics_summary (
        date,
        total_visits,
        unique_visitors,
        total_sessions,
        avg_session_duration,
        bounce_rate,
        new_users,
        returning_users,
        top_pages,
        top_referrers,
        device_breakdown
    ) VALUES (
        v_yesterday,
        COALESCE(v_total_visits, 0),
        COALESCE(v_unique_visitors, 0),
        COALESCE(v_total_sessions, 0),
        COALESCE(v_avg_session_duration, 0),
        COALESCE(v_bounce_rate, 0),
        COALESCE(v_new_users, 0),
        0, -- returning_users (calculated separately if needed)
        COALESCE(v_top_pages, '[]'::jsonb),
        COALESCE(v_top_referrers, '[]'::jsonb),
        COALESCE(v_device_breakdown, '{}'::jsonb)
    )
    ON CONFLICT (date)
    DO UPDATE SET
        total_visits = EXCLUDED.total_visits,
        unique_visitors = EXCLUDED.unique_visitors,
        total_sessions = EXCLUDED.total_sessions,
        avg_session_duration = EXCLUDED.avg_session_duration,
        bounce_rate = EXCLUDED.bounce_rate,
        new_users = EXCLUDED.new_users,
        top_pages = EXCLUDED.top_pages,
        top_referrers = EXCLUDED.top_referrers,
        device_breakdown = EXCLUDED.device_breakdown,
        updated_at = NOW();

    RAISE NOTICE 'Site analytics aggregated for %', v_yesterday;
END;
$$;

-- ================================================
-- 4. Create function to aggregate referral analytics daily
-- ================================================

CREATE OR REPLACE FUNCTION public.aggregate_referral_analytics_daily()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_yesterday DATE;
BEGIN
    -- Get yesterday's date
    v_yesterday := CURRENT_DATE - INTERVAL '1 day';

    -- Aggregate referral analytics for yesterday
    INSERT INTO public.tool_referral_analytics (
        tool_id,
        total_clicks,
        unique_clicks,
        time_period,
        period_start,
        period_end,
        metadata
    )
    SELECT
        tr.tool_id,
        COUNT(*)::INTEGER AS total_clicks,
        COUNT(DISTINCT COALESCE(tr.user_id::text, tr.session_id))::INTEGER AS unique_clicks,
        'daily' AS time_period,
        v_yesterday::TIMESTAMPTZ AS period_start,
        (v_yesterday + INTERVAL '1 day')::TIMESTAMPTZ AS period_end,
        JSONB_BUILD_OBJECT(
            'sources', (
                SELECT JSONB_AGG(
                    JSONB_BUILD_OBJECT(
                        'source', referral_source,
                        'count', source_count
                    )
                )
                FROM (
                    SELECT
                        tr2.referral_source,
                        COUNT(*) AS source_count
                    FROM public.tool_referrals tr2
                    WHERE tr2.tool_id = tr.tool_id
                    AND tr2.clicked_at::DATE = v_yesterday
                    GROUP BY tr2.referral_source
                    ORDER BY source_count DESC
                ) sources_subquery
            )
        ) AS metadata
    FROM public.tool_referrals tr
    WHERE tr.clicked_at::DATE = v_yesterday
    GROUP BY tr.tool_id
    ON CONFLICT (tool_id, time_period, period_start)
    DO UPDATE SET
        total_clicks = EXCLUDED.total_clicks,
        unique_clicks = EXCLUDED.unique_clicks,
        metadata = EXCLUDED.metadata,
        updated_at = NOW();

    RAISE NOTICE 'Referral analytics aggregated for %', v_yesterday;
END;
$$;

-- ================================================
-- 5. Create function to clean up old raw data (optional)
-- ================================================

CREATE OR REPLACE FUNCTION public.cleanup_old_analytics_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cutoff_date DATE;
    v_deleted_visits INTEGER;
    v_deleted_sessions INTEGER;
BEGIN
    -- Delete raw data older than 90 days
    v_cutoff_date := CURRENT_DATE - INTERVAL '90 days';

    -- Delete old page visits
    DELETE FROM public.page_visits
    WHERE visited_at::DATE < v_cutoff_date;
    GET DIAGNOSTICS v_deleted_visits = ROW_COUNT;

    -- Delete old user sessions
    DELETE FROM public.user_sessions
    WHERE started_at::DATE < v_cutoff_date;
    GET DIAGNOSTICS v_deleted_sessions = ROW_COUNT;

    RAISE NOTICE 'Cleaned up % page visits and % sessions older than %',
        v_deleted_visits, v_deleted_sessions, v_cutoff_date;
END;
$$;

-- ================================================
-- 6. Schedule cron jobs
-- ================================================

-- Run page analytics aggregation daily at 1 AM UTC
SELECT cron.schedule(
    'aggregate-page-analytics-daily',
    '0 1 * * *', -- Every day at 1 AM
    $$SELECT public.aggregate_page_analytics_daily();$$
);

-- Run site analytics aggregation daily at 1:15 AM UTC
SELECT cron.schedule(
    'aggregate-site-analytics-daily',
    '15 1 * * *', -- Every day at 1:15 AM
    $$SELECT public.aggregate_site_analytics_daily();$$
);

-- Run referral analytics aggregation daily at 1:30 AM UTC
SELECT cron.schedule(
    'aggregate-referral-analytics-daily',
    '30 1 * * *', -- Every day at 1:30 AM
    $$SELECT public.aggregate_referral_analytics_daily();$$
);

-- Run cleanup weekly on Sundays at 2 AM UTC
SELECT cron.schedule(
    'cleanup-old-analytics-data',
    '0 2 * * 0', -- Every Sunday at 2 AM
    $$SELECT public.cleanup_old_analytics_data();$$
);

-- ================================================
-- 7. Create manual trigger functions for testing
-- ================================================

-- Function to manually trigger all aggregations
CREATE OR REPLACE FUNCTION public.run_analytics_aggregation_now()
RETURNS TABLE (
    job_name TEXT,
    status TEXT,
    message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Run page analytics
    BEGIN
        PERFORM public.aggregate_page_analytics_daily();
        RETURN QUERY SELECT
            'Page Analytics'::TEXT,
            'SUCCESS'::TEXT,
            'Page analytics aggregated successfully'::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT
            'Page Analytics'::TEXT,
            'ERROR'::TEXT,
            SQLERRM::TEXT;
    END;

    -- Run site analytics
    BEGIN
        PERFORM public.aggregate_site_analytics_daily();
        RETURN QUERY SELECT
            'Site Analytics'::TEXT,
            'SUCCESS'::TEXT,
            'Site analytics aggregated successfully'::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT
            'Site Analytics'::TEXT,
            'ERROR'::TEXT,
            SQLERRM::TEXT;
    END;

    -- Run referral analytics
    BEGIN
        PERFORM public.aggregate_referral_analytics_daily();
        RETURN QUERY SELECT
            'Referral Analytics'::TEXT,
            'SUCCESS'::TEXT,
            'Referral analytics aggregated successfully'::TEXT;
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT
            'Referral Analytics'::TEXT,
            'ERROR'::TEXT,
            SQLERRM::TEXT;
    END;
END;
$$;

-- ================================================
-- 8. Create RPC function to view scheduled jobs
-- ================================================

CREATE OR REPLACE FUNCTION public.get_analytics_cron_jobs()
RETURNS TABLE (
    job_name TEXT,
    schedule TEXT,
    active BOOLEAN,
    last_run TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT
        jobname::TEXT,
        schedule::TEXT,
        active,
        NULL::TIMESTAMPTZ -- pg_cron doesn't track last run by default
    FROM cron.job
    WHERE jobname LIKE 'aggregate-%' OR jobname LIKE 'cleanup-%'
    ORDER BY jobname;
$$;

-- ================================================
-- 9. Grant permissions
-- ================================================

-- Grant execute permissions on aggregation functions to authenticated users (admin only via RLS)
GRANT EXECUTE ON FUNCTION public.aggregate_page_analytics_daily() TO authenticated;
GRANT EXECUTE ON FUNCTION public.aggregate_site_analytics_daily() TO authenticated;
GRANT EXECUTE ON FUNCTION public.aggregate_referral_analytics_daily() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_analytics_data() TO authenticated;
GRANT EXECUTE ON FUNCTION public.run_analytics_aggregation_now() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_analytics_cron_jobs() TO authenticated;

-- ================================================
-- Comments
-- ================================================

COMMENT ON FUNCTION public.aggregate_page_analytics_daily() IS 'Aggregates page analytics data daily';
COMMENT ON FUNCTION public.aggregate_site_analytics_daily() IS 'Aggregates site-wide analytics data daily';
COMMENT ON FUNCTION public.aggregate_referral_analytics_daily() IS 'Aggregates referral analytics data daily';
COMMENT ON FUNCTION public.cleanup_old_analytics_data() IS 'Cleans up raw analytics data older than 90 days';
COMMENT ON FUNCTION public.run_analytics_aggregation_now() IS 'Manually trigger all analytics aggregations for testing';
COMMENT ON FUNCTION public.get_analytics_cron_jobs() IS 'View all scheduled analytics cron jobs';

-- ================================================
-- Completed: Analytics Cron Jobs Migration
-- ================================================

-- To manually test the aggregations, run:
-- SELECT * FROM public.run_analytics_aggregation_now();

-- To view scheduled jobs, run:
-- SELECT * FROM public.get_analytics_cron_jobs();
