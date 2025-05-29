import { client } from './client';
import type {
  AnalyticsQueryOptions,
  AnalyticsSummary,
  UserRegistration,
  TrafficMetric,
  SearchAnalytics
} from '../../admin/types/analytics';

export const analytics = {
  async getSummary(options: AnalyticsQueryOptions): Promise<AnalyticsSummary> {
    const response = await client.get<{ data: AnalyticsSummary }>('/analytics/summary', {
      params: options
    });
    return response.data.data;
  },

  async getUserRegistrations(options: AnalyticsQueryOptions): Promise<UserRegistration[]> {
    const response = await client.get<{ data: UserRegistration[] }>('/analytics/registrations', {
      params: options
    });
    return response.data.data;
  },

  async getTrafficMetrics(options: AnalyticsQueryOptions): Promise<TrafficMetric[]> {
    const response = await client.get<{ data: TrafficMetric[] }>('/analytics/traffic', {
      params: options
    });
    return response.data.data;
  },

  async getSearchAnalytics(options: AnalyticsQueryOptions): Promise<SearchAnalytics[]> {
    const response = await client.get<{ data: SearchAnalytics[] }>('/analytics/search', {
      params: options
    });
    return response.data.data;
  }
};