import React, { useEffect, useState } from 'react';
import { pageAnalytics, type PageAnalytics as PageAnalyticsType } from '../../../services/api/pageAnalytics';
import { MetricWidget } from '../dashboard/MetricWidget';
import { Widget } from '../dashboard/Widget';
import { Eye, Clock, TrendingUp, Users } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface PageAnalyticsProps {
  className?: string;
}

export const PageAnalytics: React.FC<PageAnalyticsProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Overall stats
  const [overallStats, setOverallStats] = useState({
    total_visits: 0,
    unique_visitors: 0,
    total_sessions: 0,
    avg_session_duration: 0,
    bounce_rate: 0,
    pages_per_session: 0,
  });

  // Top pages
  const [topPages, setTopPages] = useState<PageAnalyticsType[]>([]);

  // Trends data
  const [trends, setTrends] = useState<
    { date: string; visits: number; unique_visitors: number; sessions: number }[]
  >([]);

  const [days, setDays] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const [stats, pages, trendsData] = await Promise.all([
        pageAnalytics.getOverallStats(days),
        pageAnalytics.getTopPages(days, 10),
        pageAnalytics.getAnalyticsTrends(days),
      ]);

      setOverallStats(stats);
      setTopPages(pages);
      setTrends(trendsData);
    } catch (err) {
      console.error('Error loading page analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAnalytics();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return minutes > 0 ? `${minutes}m ${secs}s` : `${secs}s`;
  };

  // Show migration notice if analytics RPC functions error
  const isMigrationNeeded = error?.includes('Could not choose the best candidate function') || 
                           error?.includes('GROUP BY clause');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Migration Notice */}
      {isMigrationNeeded && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">⚙️ Database Maintenance Required</h3>
          <p className="text-blue-800 text-sm mb-3">
            Analytics functions need to be updated. Please apply the database migration:
          </p>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside mb-3">
            <li>Go to <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Supabase Dashboard</a></li>
            <li>Navigate to SQL Editor</li>
            <li>Create new query and paste the migration SQL</li>
            <li>Click RUN and wait for completion</li>
            <li>Refresh this page</li>
          </ol>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-medium transition"
          >
            Retry Loading Analytics
          </button>
        </div>
      )}

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricWidget
          id="total-visits"
          title="Total Page Views"
          value={overallStats.total_visits}
          format="number"
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend="neutral"
        />
        <MetricWidget
          id="unique-visitors"
          title="Unique Visitors"
          value={overallStats.unique_visitors}
          format="number"
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend="neutral"
        />
        <MetricWidget
          id="total-sessions"
          title="Total Sessions"
          value={overallStats.total_sessions}
          format="number"
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend="neutral"
        />
        <MetricWidget
          id="avg-session"
          title="Avg Session Duration"
          value={`${Math.round(overallStats.avg_session_duration)}s`}
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend="neutral"
        />
        <MetricWidget
          id="bounce-rate"
          title="Bounce Rate"
          value={overallStats.bounce_rate}
          format="percentage"
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend={overallStats.bounce_rate > 50 ? 'down' : 'up'}
        />
        <MetricWidget
          id="pages-per-session"
          title="Pages per Session"
          value={overallStats.pages_per_session}
          format="number"
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend="neutral"
        />
      </div>

      {/* Top Pages */}
      <Widget
        id="top-pages"
        title="Top Pages"
        loading={loading}
        error={error || undefined}
        onRefresh={handleRefresh}
        className="bg-white border border-gray-200 shadow-md"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unique
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bounce Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No page data available yet
                  </td>
                </tr>
              ) : (
                topPages.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {page.page_title || page.page_path}
                          </div>
                          {page.page_title && (
                            <div className="text-xs text-gray-500">{page.page_path}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {page.total_visits.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {page.unique_visitors.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {page.avg_time_on_page ? formatDuration(Math.round(page.avg_time_on_page)) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          page.bounce_rate > 70
                            ? 'bg-red-100 text-red-700'
                            : page.bounce_rate > 50
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        )}
                      >
                        {page.bounce_rate ? `${Math.round(page.bounce_rate)}%` : '-'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Widget>

      {/* Traffic Trends */}
      <Widget
        id="traffic-trends"
        title="Traffic Trends"
        loading={loading}
        error={error || undefined}
        onRefresh={handleRefresh}
        className="bg-white border border-gray-200 shadow-md"
      >
        <div className="space-y-4">
          {trends.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No trend data available</p>
          ) : (
            <div className="space-y-2">
              {/* Simple bar chart visualization */}
              <div className="flex items-end justify-between gap-1 h-48 border-l border-b border-gray-200 pl-4 pb-4">
                {trends.map((trend, index) => {
                  const maxVisits = Math.max(...trends.map((t) => t.visits));
                  const height = maxVisits > 0 ? (trend.visits / maxVisits) * 100 : 0;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t transition-all duration-300 hover:from-purple-600 hover:to-purple-400 cursor-pointer relative"
                          style={{ height: `${height}%`, minHeight: trend.visits > 0 ? '4px' : '0' }}
                          title={`${trend.date}: ${trend.visits} visits (${trend.unique_visitors} unique)`}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {trend.visits} visits
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 transform rotate-0 text-center">
                        {new Date(trend.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-sm text-gray-600">Page Views</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Widget>
    </div>
  );
};

export default PageAnalytics;
