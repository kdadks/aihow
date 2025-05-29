export interface DateRange {
  start: string;
  end: string;
}

export interface GeoLocation {
  country: string;
  city?: string;
  count: number;
}

export interface UserRegistration {
  date: string;
  count: number;
  conversionRate: number;
}

export interface TrafficMetric {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
}

export interface SearchAnalytics {
  query: string;
  count: number;
  averageResultCount: number;
  abandonmentRate: number;
  date: string;
}

export interface AnalyticsFilters {
  dateRange: DateRange;
  geography?: string[];
  searchTerms?: string[];
}

export type TimeGranularity = 'hour' | 'day' | 'week' | 'month';

export interface AnalyticsQueryOptions {
  filters: AnalyticsFilters;
  granularity: TimeGranularity;
  limit?: number;
}

export interface AnalyticsSummary {
  totalUsers: number;
  activeUsers: number;
  userGrowth: number;
  averageSessionDuration: number;
  searchAbandonmentRate: number;
  topLocations: GeoLocation[];
  topSearchTerms: Array<{
    term: string;
    count: number;
  }>;
}