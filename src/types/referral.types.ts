/**
 * Tool Referral System Types
 * Types for tracking tool referrals and analytics
 */

export interface ToolReferral {
  id: string;
  tool_id: string;
  user_id: string | null;
  referral_source: string;
  clicked_at: string;
  ip_address: string | null;
  user_agent: string | null;
  session_id: string | null;
  country_code: string | null;
  device_type: string | null;
  created_at: string;
}

export interface ToolReferralAnalytics {
  id: string;
  tool_id: string;
  total_clicks: number;
  unique_clicks: number;
  time_period: 'daily' | 'weekly' | 'monthly';
  period_start: string;
  period_end: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ReferralSource {
  source: string;
  count: number;
}

export interface ReferralAnalyticsData {
  tool_id: string;
  tool_name: string;
  total_clicks: number;
  unique_clicks: number;
  period_start: string;
  period_end: string;
  top_sources: ReferralSource[];
}

export interface ToolReferralStats {
  total_clicks: number;
  unique_clicks: number;
  clicks_today: number;
  clicks_this_week: number;
  clicks_this_month: number;
  top_source: string | null;
  avg_clicks_per_day: number;
  trend_percentage: number;
}

export interface ReferralSummary {
  tool_id: string;
  tool_name: string;
  tool_slug: string;
  total_clicks: number;
  unique_visitors: number;
  clicks_today: number;
  clicks_this_week: number;
  clicks_this_month: number;
  last_click_at: string | null;
}

export interface TrackReferralParams {
  tool_id: string;
  referral_source?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  session_id?: string | null;
  country_code?: string | null;
  device_type?: string | null;
}

export interface GetReferralAnalyticsParams {
  tool_id?: string | null;
  time_period?: 'daily' | 'weekly' | 'monthly';
  start_date?: string;
  end_date?: string;
  limit?: number;
}

export interface GetToolReferralStatsParams {
  tool_id: string;
  start_date?: string;
  end_date?: string;
}

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown';
export type TimePeriod = 'daily' | 'weekly' | 'monthly';

export interface ReferralFilters {
  tool_id?: string;
  time_period?: TimePeriod;
  start_date?: Date;
  end_date?: Date;
  referral_source?: string;
  device_type?: DeviceType;
}

export interface ReferralChartData {
  date: string;
  clicks: number;
  unique_clicks: number;
}

export interface ReferralSourceBreakdown {
  source: string;
  clicks: number;
  percentage: number;
}

export interface TopReferredTool {
  tool_id: string;
  tool_name: string;
  tool_slug: string;
  total_clicks: number;
  unique_clicks: number;
  conversion_rate: number;
}
