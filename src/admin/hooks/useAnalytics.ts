import { useState, useCallback, useEffect } from 'react';
import {
  AnalyticsFilters,
  AnalyticsQueryOptions,
  AnalyticsSummary,
  UserRegistration,
  TrafficMetric,
  SearchAnalytics,
  TimeGranularity
} from '../types/analytics';
import { api } from '../../services/api';

interface UseAnalyticsOptions {
  initialFilters?: AnalyticsFilters;
  initialGranularity?: TimeGranularity;
}

interface AnalyticsState {
  summary: AnalyticsSummary | null;
  userRegistrations: UserRegistration[];
  trafficMetrics: TrafficMetric[];
  searchAnalytics: SearchAnalytics[];
  isLoading: boolean;
  error: Error | null;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const [state, setState] = useState<AnalyticsState>({
    summary: null,
    userRegistrations: [],
    trafficMetrics: [],
    searchAnalytics: [],
    isLoading: false,
    error: null
  });

  const [queryOptions, setQueryOptions] = useState<AnalyticsQueryOptions>({
    filters: options.initialFilters || {
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    },
    granularity: options.initialGranularity || 'day'
  });

  const fetchAnalytics = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const [summary, registrations, traffic, search] = await Promise.all([
        api.analytics.getSummary(queryOptions),
        api.analytics.getUserRegistrations(queryOptions),
        api.analytics.getTrafficMetrics(queryOptions),
        api.analytics.getSearchAnalytics(queryOptions)
      ]);

      setState({
        summary,
        userRegistrations: registrations || [],
        trafficMetrics: traffic || [],
        searchAnalytics: search || [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error as Error
      }));
    }
  }, [queryOptions]);

  const updateFilters = useCallback((newFilters: Partial<AnalyticsFilters>) => {
    setQueryOptions(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters }
    }));
  }, []);

  const updateGranularity = useCallback((granularity: TimeGranularity) => {
    setQueryOptions(prev => ({ ...prev, granularity }));
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    ...state,
    queryOptions,
    updateFilters,
    updateGranularity,
    refresh: fetchAnalytics
  };
};