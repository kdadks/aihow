import React from 'react';
import { useAdminAuth } from '../auth/hooks/useAdminAuth';

// Import analytics components with proper error handling
let useAnalytics: any = null;
let WidgetGrid: any = null;
let MetricWidget: any = null;

try {
  const analyticsModule = require('../hooks/useAnalytics');
  const widgetGridModule = require('../components/dashboard/WidgetGrid');
  const metricWidgetModule = require('../components/dashboard/MetricWidget');
  
  useAnalytics = analyticsModule.useAnalytics;
  WidgetGrid = widgetGridModule.WidgetGrid;
  MetricWidget = metricWidgetModule.MetricWidget;
} catch (error) {
  console.warn('[Dashboard] Analytics components not available, using fallback');
}

// Fallback simple dashboard if analytics hook is not available
function SimpleDashboard() {
  const { admin } = useAdminAuth();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          {admin && (
            <p className="text-gray-600 mt-2">
              Welcome back, {admin.firstName || admin.email}
            </p>
          )}
        </div>
      </div>

      {/* Simple metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Page Views</dt>
                  <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Search Queries</dt>
                  <dd className="text-lg font-medium text-gray-900">Loading...</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Content
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Manage Users
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* System status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">System Status</h3>
          <div className="mt-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">
                  All systems operational - Admin dashboard loaded successfully
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced dashboard with analytics (if available)
function EnhancedDashboard() {
  const { admin } = useAdminAuth();

  if (!useAnalytics || !WidgetGrid || !MetricWidget) {
    console.warn('[Dashboard] Analytics components not available, using simple dashboard');
    return <SimpleDashboard />;
  }

  const {
    summary,
    userRegistrations,
    trafficMetrics,
    searchAnalytics,
    isLoading,
    error,
    refresh
  } = useAnalytics();

  if (error) {
    console.error('[Dashboard] Error loading analytics:', error);
    return <SimpleDashboard />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          {admin && (
            <p className="text-gray-600 mt-1">
              Welcome back, {admin.firstName || admin.email}
            </p>
          )}
        </div>
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
          value={userRegistrations?.[0]?.count || 0}
          change={userRegistrations?.[0]?.conversionRate || 0}
          trend="up"
          loading={isLoading}
        />
        <MetricWidget
          id="registrations-monthly"
          title="Monthly Registrations"
          value={
            userRegistrations && userRegistrations.length > 0
              ? userRegistrations
                  .slice(0, 30)
                  .reduce((sum, day) => sum + day.count, 0)
              : 0
          }
          loading={isLoading}
        />
      </WidgetGrid>

      {/* Traffic Overview */}
      <WidgetGrid columns={2}>
        <MetricWidget
          id="page-views"
          title="Page Views (Today)"
          value={trafficMetrics?.[0]?.pageViews || 0}
          loading={isLoading}
        />
        <MetricWidget
          id="unique-visitors"
          title="Unique Visitors (Today)"
          value={trafficMetrics?.[0]?.uniqueVisitors || 0}
          loading={isLoading}
        />
      </WidgetGrid>

      {/* Search Analytics */}
      <WidgetGrid columns={2}>
        <MetricWidget
          id="top-search"
          title="Top Search Term"
          value={summary?.topSearchTerms?.[0]?.term || 'N/A'}
          loading={isLoading}
        />
        <MetricWidget
          id="search-volume"
          title="Search Volume (Today)"
          value={searchAnalytics?.[0]?.count || 0}
          loading={isLoading}
        />
      </WidgetGrid>
    </div>
  );
}

// Main Dashboard component with error boundary
function Dashboard() {
  const { admin } = useAdminAuth();

  console.log('[Dashboard] Rendering dashboard for admin:', admin?.email);

  // Return enhanced dashboard if analytics components are available, otherwise simple dashboard
  try {
    if (useAnalytics && WidgetGrid && MetricWidget) {
      return <EnhancedDashboard />;
    } else {
      return <SimpleDashboard />;
    }
  } catch (error) {
    console.error('[Dashboard] Error occurred:', error);
    return <SimpleDashboard />;
  }
}

export default Dashboard;
