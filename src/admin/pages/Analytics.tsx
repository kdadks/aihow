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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Center</h1>
        <div className="flex items-center space-x-4">
          <select
            value={queryOptions.granularity}
            onChange={(e) => updateGranularity(e.target.value as any)}
            className="rounded-md border-gray-300"
          >
            <option value="hour">Hourly</option>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Traffic Metrics */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Traffic Overview</h2>
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
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Analytics</h2>
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
                  <div key={item.query} className="flex justify-between items-center">
                    <span className="text-gray-700">{item.query}</span>
                    <span className="text-gray-500">{item.count} searches</span>
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
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">Error loading analytics data</p>
          <p className="text-sm">{error.message}</p>
        </div>
      )}
    </div>
  );
}

export default Analytics;