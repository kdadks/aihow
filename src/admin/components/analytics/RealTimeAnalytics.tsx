import React, { useEffect, useState } from 'react';
import { pageAnalytics } from '../../../services/api/pageAnalytics';
import { MetricWidget } from '../dashboard/MetricWidget';
import { Widget } from '../dashboard/Widget';
import { Activity, Users, Eye, TrendingUp } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface RealTimeAnalyticsProps {
  className?: string;
}

export const RealTimeAnalytics: React.FC<RealTimeAnalyticsProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [realTimeStats, setRealTimeStats] = useState({
    active_users: 0,
    current_page_views: 0,
    top_pages: [] as { path: string; viewers: number }[],
  });

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadRealTimeStats();

    // Auto-refresh every 30 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(loadRealTimeStats, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadRealTimeStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const stats = await pageAnalytics.getRealTimeStats();
      setRealTimeStats(stats);
    } catch (err) {
      console.error('Error loading real-time stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load real-time stats');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadRealTimeStats();
  };

  const getActivityLevel = (count: number): { label: string; color: string } => {
    if (count >= 100) return { label: 'Very High', color: 'text-red-600 bg-red-50' };
    if (count >= 50) return { label: 'High', color: 'text-orange-600 bg-orange-50' };
    if (count >= 20) return { label: 'Medium', color: 'text-yellow-600 bg-yellow-50' };
    if (count >= 5) return { label: 'Low', color: 'text-green-600 bg-green-50' };
    return { label: 'Minimal', color: 'text-gray-600 bg-gray-50' };
  };

  const activityLevel = getActivityLevel(realTimeStats.active_users);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Auto-Refresh Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Real-Time Analytics</h3>
          <p className="text-sm text-gray-600 mt-1">
            Live data from the last hour • Updates every 30 seconds
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto-refresh</span>
          </label>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={cn(
              'px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
              loading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>

      {/* Activity Level Indicator */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Activity Level
            </h4>
            <div className="mt-2 flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex px-3 py-1 rounded-full text-sm font-semibold',
                  activityLevel.color
                )}
              >
                {activityLevel.label}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-2 h-8 rounded',
                      i < Math.min(5, Math.ceil(realTimeStats.active_users / 20))
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
          <Activity className="w-12 h-12 text-gray-400" />
        </div>
      </div>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricWidget
          id="active-users"
          title="Active Users"
          value={realTimeStats.active_users}
          format="number"
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend="neutral"
        />
        <MetricWidget
          id="current-views"
          title="Page Views (Last Hour)"
          value={realTimeStats.current_page_views}
          format="number"
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend="neutral"
        />
      </div>

      {/* Top Active Pages */}
      <Widget
        id="active-pages"
        title="Top Active Pages"
        loading={loading}
        error={error || undefined}
        onRefresh={handleRefresh}
        className="bg-white border border-gray-200 shadow-md"
      >
        <div className="space-y-3">
          {realTimeStats.top_pages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No active pages right now</p>
          ) : (
            realTimeStats.top_pages.map((page, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm',
                      index === 0
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-700'
                    )}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{page.path}</div>
                    <div className="text-xs text-gray-500">Active now</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">{page.viewers}</span>
                  <span className="text-sm text-gray-500">
                    {page.viewers === 1 ? 'viewer' : 'viewers'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Widget>

      {/* Live Activity Feed (Placeholder) */}
      <Widget
        id="activity-feed"
        title="Live Activity Feed"
        loading={loading}
        error={error || undefined}
        onRefresh={handleRefresh}
        className="bg-white border border-gray-200 shadow-md"
      >
        <div className="space-y-2">
          <p className="text-sm text-gray-500 text-center py-4">
            Real-time activity feed coming soon
          </p>
          {/* Future: Show live page views, clicks, conversions, etc. */}
        </div>
      </Widget>
    </div>
  );
};

export default RealTimeAnalytics;
