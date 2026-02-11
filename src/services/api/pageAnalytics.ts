/**
 * Page Analytics API Service
 * Handles fetching and processing page visit analytics data
 */

import { supabase } from '../../lib/supabase';

export interface PageAnalytics {
  page_path: string;
  page_title: string;
  total_visits: number;
  unique_visitors: number;
  avg_time_on_page: number;
  bounce_rate: number;
}

export interface SiteAnalytics {
  date: string;
  total_visits: number;
  unique_visitors: number;
  total_sessions: number;
  avg_session_duration: number;
  bounce_rate: number;
  new_users: number;
  returning_users: number;
}

export interface GetPageAnalyticsParams {
  start_date?: string;
  end_date?: string;
  page_path?: string;
  limit?: number;
}

export interface GetSiteAnalyticsParams {
  start_date?: string;
  end_date?: string;
}

export const pageAnalytics = {
  /**
   * Get page-level analytics
   */
  async getPageAnalytics(
    params: GetPageAnalyticsParams = {}
  ): Promise<PageAnalytics[]> {
    const {
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date = new Date().toISOString(),
      page_path = null,
      limit = 100,
    } = params;

    const { data, error } = await supabase.rpc('get_page_analytics', {
      p_start_date: start_date,
      p_end_date: end_date,
      p_page_path: page_path,
      p_limit: limit,
    });

    if (error) {
      console.error('Error fetching page analytics:', error);
      throw new Error(`Failed to fetch page analytics: ${error.message}`);
    }

    return (data || []) as PageAnalytics[];
  },

  /**
   * Get site-wide analytics
   */
  async getSiteAnalytics(
    params: GetSiteAnalyticsParams = {}
  ): Promise<SiteAnalytics[]> {
    const {
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date = new Date().toISOString(),
    } = params;

    const { data, error } = await supabase.rpc('get_site_analytics', {
      p_start_date: start_date,
      p_end_date: end_date,
    });

    if (error) {
      console.error('Error fetching site analytics:', error);
      throw new Error(`Failed to fetch site analytics: ${error.message}`);
    }

    return (data || []) as SiteAnalytics[];
  },

  /**
   * Get top pages by visits
   */
  async getTopPages(days: number = 30, limit: number = 10): Promise<PageAnalytics[]> {
    const start_date = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const end_date = new Date().toISOString();

    const pages = await this.getPageAnalytics({
      start_date,
      end_date,
      limit,
    });

    return pages.sort((a, b) => b.total_visits - a.total_visits);
  },

  /**
   * Get overall site statistics
   */
  async getOverallStats(days: number = 30): Promise<{
    total_visits: number;
    unique_visitors: number;
    total_sessions: number;
    avg_session_duration: number;
    bounce_rate: number;
    pages_per_session: number;
  }> {
    const start_date = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const end_date = new Date().toISOString();

    const siteStats = await this.getSiteAnalytics({
      start_date,
      end_date,
    });

    if (siteStats.length === 0) {
      return {
        total_visits: 0,
        unique_visitors: 0,
        total_sessions: 0,
        avg_session_duration: 0,
        bounce_rate: 0,
        pages_per_session: 0,
      };
    }

    const total_visits = siteStats.reduce((sum, day) => sum + day.total_visits, 0);
    const unique_visitors = siteStats.reduce((sum, day) => sum + day.unique_visitors, 0);
    const total_sessions = siteStats.reduce((sum, day) => sum + day.total_sessions, 0);
    const avg_session_duration =
      siteStats.reduce((sum, day) => sum + day.avg_session_duration, 0) / siteStats.length;
    const bounce_rate =
      siteStats.reduce((sum, day) => sum + day.bounce_rate, 0) / siteStats.length;
    const pages_per_session = total_sessions > 0 ? total_visits / total_sessions : 0;

    return {
      total_visits,
      unique_visitors,
      total_sessions,
      avg_session_duration: Math.round(avg_session_duration),
      bounce_rate: Math.round(bounce_rate * 100) / 100,
      pages_per_session: Math.round(pages_per_session * 100) / 100,
    };
  },

  /**
   * Get analytics trends for chart visualization
   */
  async getAnalyticsTrends(days: number = 30): Promise<{
    date: string;
    visits: number;
    unique_visitors: number;
    sessions: number;
    bounce_rate: number;
  }[]> {
    const start_date = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const end_date = new Date().toISOString();

    const siteStats = await this.getSiteAnalytics({
      start_date,
      end_date,
    });

    return siteStats.map((stat) => ({
      date: new Date(stat.date).toLocaleDateString(),
      visits: stat.total_visits,
      unique_visitors: stat.unique_visitors,
      sessions: stat.total_sessions,
      bounce_rate: stat.bounce_rate,
    }));
  },

  /**
   * Get real-time stats (last hour)
   */
  async getRealTimeStats(): Promise<{
    active_users: number;
    current_page_views: number;
    top_pages: { path: string; viewers: number }[];
  }> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    try {
      // Get sessions active in last hour
      const { data: sessions, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('session_id')
        .gte('last_activity_at', oneHourAgo)
        .lte('last_activity_at', now);

      if (sessionsError) throw sessionsError;

      // Get page views in last hour
      const { data: visits, error: visitsError } = await supabase
        .from('page_visits')
        .select('page_path, session_id')
        .gte('visited_at', oneHourAgo)
        .lte('visited_at', now);

      if (visitsError) throw visitsError;

      // Calculate top pages
      const pageViewCounts = new Map<string, Set<string>>();
      (visits || []).forEach((visit) => {
        if (!pageViewCounts.has(visit.page_path)) {
          pageViewCounts.set(visit.page_path, new Set());
        }
        pageViewCounts.get(visit.page_path)!.add(visit.session_id);
      });

      const topPages = Array.from(pageViewCounts.entries())
        .map(([path, sessions]) => ({
          path,
          viewers: sessions.size,
        }))
        .sort((a, b) => b.viewers - a.viewers)
        .slice(0, 5);

      return {
        active_users: sessions?.length || 0,
        current_page_views: visits?.length || 0,
        top_pages: topPages,
      };
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      return {
        active_users: 0,
        current_page_views: 0,
        top_pages: [],
      };
    }
  },
};

export default pageAnalytics;
