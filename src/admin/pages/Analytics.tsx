import { useAnalytics } from '../hooks/useAnalytics';
import { WidgetGrid } from '../components/dashboard/WidgetGrid';
import { MetricWidget } from '../components/dashboard/MetricWidget';
import { Widget } from '../components/dashboard/Widget';

function Analytics() {
  const {
    searchAnalytics,
    trafficMetrics,
    isLoading,
    error,
    refresh,
    queryOptions,
    updateFilters,
    updateGranularity
  } = useAnalytics({
    initialGranularity: 'day'
  });

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
                    How2doAI Analytics Center
                  </h1>
                  <p className="text-gray-600 font-medium">Real-time Data Intelligence</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={queryOptions.granularity}
                onChange={(e) => updateGranularity(e.target.value as any)}
                className="px-4 py-2 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="hour">Hourly</option>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
              </select>
              <button
                onClick={refresh}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Traffic Metrics */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Traffic Overview</h2>
          </div>
          <WidgetGrid columns={3}>
            <MetricWidget
              id="pageviews"
              title="Total Page Views"
              value={trafficMetrics.reduce((sum, day) => sum + day.pageViews, 0)}
              loading={isLoading}
            />
            <MetricWidget
              id="visitors"
              title="Unique Visitors"
              value={trafficMetrics.reduce((sum, day) => sum + day.uniqueVisitors, 0)}
              loading={isLoading}
            />
            <MetricWidget
              id="avg-duration"
              title="Avg. Session Duration"
              value={
                trafficMetrics.reduce((sum, day) => sum + day.averageSessionDuration, 0) / 
                (trafficMetrics.length || 1)
              }
              format="number"
              loading={isLoading}
            />
          </WidgetGrid>
        </section>

        {/* Search Analytics */}
        <section className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Search Analytics</h2>
          </div>
          <WidgetGrid columns={2}>
            <Widget
              id="search-trends"
              title="Top Search Terms"
              loading={isLoading}
            >
              <div className="space-y-4">
                {searchAnalytics
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map((item) => (
                    <div key={item.query} className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                      <span className="text-gray-700 font-medium">{item.query}</span>
                      <span className="text-blue-600 font-semibold">{item.count} searches</span>
                    </div>
                  ))}
              </div>
            </Widget>
            <MetricWidget
              id="abandonment"
              title="Search Abandonment Rate"
              value={
                searchAnalytics.reduce((sum, item) => sum + item.abandonmentRate, 0) /
                (searchAnalytics.length || 1)
              }
              format="percentage"
              loading={isLoading}
            />
          </WidgetGrid>
        </section>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-xl border border-red-200 text-red-700 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold">Error loading analytics data</p>
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;