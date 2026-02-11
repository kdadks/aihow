/**
 * Referral Analytics API Service
 * Handles fetching and processing tool referral analytics data
 */

import { supabase } from '../../lib/supabase';
import type {
  ReferralAnalyticsData,
  ToolReferralStats,
  ReferralSummary,
  GetReferralAnalyticsParams,
  GetToolReferralStatsParams,
} from '../../types/referral.types';

export const referralAnalytics = {
  /**
   * Get aggregated referral analytics data
   */
  async getReferralAnalytics(
    params: GetReferralAnalyticsParams = {}
  ): Promise<ReferralAnalyticsData[]> {
    const {
      tool_id = null,
      time_period = 'daily',
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date = new Date().toISOString(),
      limit = 100,
    } = params;

    const { data, error } = await supabase.rpc('get_referral_analytics', {
      p_tool_id: tool_id,
      p_time_period: time_period,
      p_start_date: start_date,
      p_end_date: end_date,
      p_limit: limit,
    });

    if (error) {
      console.error('Error fetching referral analytics:', error);
      throw new Error(`Failed to fetch referral analytics: ${error.message}`);
    }

    return (data || []) as ReferralAnalyticsData[];
  },

  /**
   * Get detailed stats for a specific tool
   */
  async getToolReferralStats(
    params: GetToolReferralStatsParams
  ): Promise<ToolReferralStats> {
    const {
      tool_id,
      start_date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end_date = new Date().toISOString(),
    } = params;

    const { data, error } = await supabase.rpc('get_tool_referral_stats', {
      p_tool_id: tool_id,
      p_start_date: start_date,
      p_end_date: end_date,
    });

    if (error) {
      console.error('Error fetching tool referral stats:', error);
      throw new Error(`Failed to fetch tool referral stats: ${error.message}`);
    }

    // RPC function returns an array with a single record
    const stats = Array.isArray(data) ? data[0] : data;

    if (!stats) {
      throw new Error('No stats returned for the specified tool');
    }

    return stats as ToolReferralStats;
  },

  /**
   * Get referral summary for all tools
   */
  async getReferralSummary(): Promise<ReferralSummary[]> {
    const { data, error } = await supabase
      .from('tool_referrals_summary')
      .select('*')
      .order('total_clicks', { ascending: false });

    if (error) {
      console.error('Error fetching referral summary:', error);
      throw new Error(`Failed to fetch referral summary: ${error.message}`);
    }

    return (data || []) as ReferralSummary[];
  },

  /**
   * Get top referred tools
   */
  async getTopReferredTools(
    limit: number = 10,
    time_period: 'today' | 'week' | 'month' = 'month'
  ): Promise<ReferralSummary[]> {
    const summary = await this.getReferralSummary();

    // Filter based on time period
    let filtered: ReferralSummary[];
    switch (time_period) {
      case 'today':
        filtered = summary.sort((a, b) => b.clicks_today - a.clicks_today);
        break;
      case 'week':
        filtered = summary.sort((a, b) => b.clicks_this_week - a.clicks_this_week);
        break;
      case 'month':
        filtered = summary.sort((a, b) => b.clicks_this_month - a.clicks_this_month);
        break;
      default:
        filtered = summary;
    }

    return filtered.slice(0, limit);
  },

  /**
   * Get referral trends for chart visualization
   */
  async getReferralTrends(
    tool_id: string | null = null,
    days: number = 30
  ): Promise<{ date: string; clicks: number; unique_clicks: number }[]> {
    const start_date = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const end_date = new Date().toISOString();

    const analytics = await this.getReferralAnalytics({
      tool_id,
      time_period: 'daily',
      start_date,
      end_date,
      limit: days,
    });

    // Transform data for chart
    return analytics.map((item) => ({
      date: new Date(item.period_start).toLocaleDateString(),
      clicks: item.total_clicks,
      unique_clicks: item.unique_clicks,
    }));
  },

  /**
   * Get referral source breakdown
   */
  async getReferralSourceBreakdown(
    tool_id: string | null = null,
    days: number = 30
  ): Promise<{ source: string; clicks: number; percentage: number }[]> {
    const start_date = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const end_date = new Date().toISOString();

    const analytics = await this.getReferralAnalytics({
      tool_id,
      time_period: 'daily',
      start_date,
      end_date,
      limit: 1000,
    });

    // Aggregate by source
    const sourceMap = new Map<string, number>();
    let totalClicks = 0;

    analytics.forEach((item) => {
      if (item.top_sources && Array.isArray(item.top_sources)) {
        item.top_sources.forEach((sourceData) => {
          const { source, count } = sourceData;
          const currentCount = sourceMap.get(source) || 0;
          sourceMap.set(source, currentCount + count);
          totalClicks += count;
        });
      }
    });

    // Convert to array and calculate percentages
    const breakdown = Array.from(sourceMap.entries())
      .map(([source, clicks]) => ({
        source,
        clicks,
        percentage: totalClicks > 0 ? (clicks / totalClicks) * 100 : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks);

    return breakdown;
  },

  /**
   * Get overall referral statistics
   */
  async getOverallStats(days: number = 30): Promise<{
    total_clicks: number;
    unique_visitors: number;
    total_tools_clicked: number;
    avg_clicks_per_tool: number;
  }> {
    const summary = await this.getReferralSummary();

    const total_clicks = summary.reduce((sum, item) => sum + item.total_clicks, 0);
    const unique_visitors = summary.reduce((sum, item) => sum + item.unique_visitors, 0);
    const total_tools_clicked = summary.filter((item) => item.total_clicks > 0).length;
    const avg_clicks_per_tool =
      total_tools_clicked > 0 ? total_clicks / total_tools_clicked : 0;

    return {
      total_clicks,
      unique_visitors,
      total_tools_clicked,
      avg_clicks_per_tool: Math.round(avg_clicks_per_tool * 100) / 100,
    };
  },
};

export default referralAnalytics;
