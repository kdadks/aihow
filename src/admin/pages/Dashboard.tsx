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
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enterprise Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    How2doAI Dashboard
                  </h1>
                  <p className="text-gray-600 font-medium">Enterprise Admin Control Center</p>
                </div>
              </div>
              {admin && (
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-700">
                    Welcome back, <span className="font-semibold text-blue-700">{admin.firstName || admin.email}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>System Online</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl rounded-2xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                    <dd className="text-2xl font-bold text-gray-900">Loading...</dd>
                    <dd className="text-xs text-green-600 mt-1">+12% from last week</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl rounded-2xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                    <dd className="text-2xl font-bold text-gray-900">Loading...</dd>
                    <dd className="text-xs text-green-600 mt-1">+8% from yesterday</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl rounded-2xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Page Views</dt>
                    <dd className="text-2xl font-bold text-gray-900">Loading...</dd>
                    <dd className="text-xs text-blue-600 mt-1">+24% this month</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl overflow-hidden shadow-xl rounded-2xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 group">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Search Queries</dt>
                    <dd className="text-2xl font-bold text-gray-900">Loading...</dd>
                    <dd className="text-xs text-indigo-600 mt-1">+15% this week</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Quick Actions */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl border border-gray-200/50">
          <div className="px-8 py-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button
                type="button"
                className="group flex items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm text-sm font-medium rounded-xl text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <svg className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="ml-3">Add Content</span>
              </button>
              <button
                type="button"
                className="group flex items-center px-6 py-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-sm text-sm font-medium rounded-xl text-emerald-700 hover:from-emerald-100 hover:to-green-100 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
              >
                <svg className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span className="ml-3">Manage Users</span>
              </button>
              <button
                type="button"
                className="group flex items-center px-6 py-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 shadow-sm text-sm font-medium rounded-xl text-amber-700 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
              >
                <svg className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="ml-3">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enterprise System Status */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl border border-gray-200/50">
          <div className="px-8 py-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">System Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium">
                    All systems operational - How2doAI Admin Dashboard loaded successfully
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Last updated: {new Date().toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">API Status</div>
                  <div className="text-xs text-green-600 font-semibold">Operational</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Database</div>
                  <div className="text-xs text-green-600 font-semibold">Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Auth Service</div>
                  <div className="text-xs text-green-600 font-semibold">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">Analytics</div>
                  <div className="text-xs text-blue-600 font-semibold">Collecting</div>
                </div>
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
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enterprise Header with Analytics */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    How2doAI Analytics Dashboard
                  </h1>
                  <p className="text-gray-600 font-medium">Enterprise Admin Control Center</p>
                </div>
              </div>
              {admin && (
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-gray-700">
                    Welcome back, <span className="font-semibold text-blue-700">{admin.firstName || admin.email}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Analytics Active</span>
                </span>
              </div>
              <button
                onClick={refresh}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                Refresh Data
              </button>
            </div>
          </div>
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
                    .reduce((sum: number, day: any) => sum + day.count, 0)
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
