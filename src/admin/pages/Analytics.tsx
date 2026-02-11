import { useAnalytics } from '../hooks/useAnalytics';
import { WidgetGrid } from '../components/dashboard/WidgetGrid';
import { MetricWidget } from '../components/dashboard/MetricWidget';
import { Widget } from '../components/dashboard/Widget';
import { AnalyticsWorkflow } from '../components/analytics/AnalyticsWorkflow';

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
        {/* Analytics Workflow - Main Feature */}
        <AnalyticsWorkflow />

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