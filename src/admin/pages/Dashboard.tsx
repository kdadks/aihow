import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { WidgetGrid } from '../components/dashboard/WidgetGrid';
import { MetricWidget } from '../components/dashboard/MetricWidget';

function Dashboard() {
  const {
    summary,
    userRegistrations,
    trafficMetrics,
    searchAnalytics,
    isLoading,
    error,
    refresh,
    queryOptions,
    updateFilters,
    updateGranularity
  } = useAnalytics();

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-lg font-semibold mb-2">Error Loading Dashboard</h2>
        <p>{error.message}</p>
        <button 
          onClick={refresh}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Core Metrics */}
      <WidgetGrid columns={4}>
        <MetricWidget
          id="total-users"
          title="Total Users"
          value={summary?.totalUsers || 0}
          change={20}
          trend="up"
          loading={isLoading}
        />
        <MetricWidget
          id="active-users"
          title="Active Users"
          value={summary?.activeUsers || 0}
          change={5}
          trend="up"
          loading={isLoading}
        />
        <MetricWidget
          id="avg-session"
          title="Avg. Session Duration"
          value={summary?.averageSessionDuration || 0}
          format="number"
          loading={isLoading}
        />
        <MetricWidget
          id="search-abandonment"
          title="Search Abandonment"
          value={summary?.searchAbandonmentRate || 0}
          format="percentage"
          change={-2}
          trend="down"
          loading={isLoading}
        />
      </WidgetGrid>

      {/* User Registration Trends */}
      <WidgetGrid columns={2}>
        <MetricWidget
          id="registrations-today"
          title="Today's Registrations"
          value={userRegistrations[0]?.count || 0}
          change={userRegistrations[0]?.conversionRate || 0}
          trend="up"
          loading={isLoading}
        />
        <MetricWidget
          id="registrations-monthly"
          title="Monthly Registrations"
          value={
            userRegistrations
              .slice(0, 30)
              .reduce((sum, day) => sum + day.count, 0)
          }
          loading={isLoading}
        />
      </WidgetGrid>

      {/* Traffic Overview */}
      <WidgetGrid columns={2}>
        <MetricWidget
          id="page-views"
          title="Page Views (Today)"
          value={trafficMetrics[0]?.pageViews || 0}
          loading={isLoading}
        />
        <MetricWidget
          id="unique-visitors"
          title="Unique Visitors (Today)"
          value={trafficMetrics[0]?.uniqueVisitors || 0}
          loading={isLoading}
        />
      </WidgetGrid>

      {/* Search Analytics */}
      <WidgetGrid columns={2}>
        <MetricWidget
          id="top-search"
          title="Top Search Term"
          value={summary?.topSearchTerms[0]?.term || 'N/A'}
          loading={isLoading}
        />
        <MetricWidget
          id="search-volume"
          title="Search Volume (Today)"
          value={searchAnalytics[0]?.count || 0}
          loading={isLoading}
        />
      </WidgetGrid>
    </div>
  );
}

export default Dashboard;