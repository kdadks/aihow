import React, { useEffect, useState } from 'react';
import { referralAnalytics } from '../../../services/api/referralAnalytics';
import type {
  ReferralSummary,
  ReferralSourceBreakdown,
} from '../../../types/referral.types';
import { MetricWidget } from '../dashboard/MetricWidget';
import { Widget } from '../dashboard/Widget';
import { ExternalLink, TrendingUp, Users, MousePointerClick } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface ReferralAnalyticsProps {
  className?: string;
}

export const ReferralAnalytics: React.FC<ReferralAnalyticsProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Overall stats
  const [overallStats, setOverallStats] = useState({
    total_clicks: 0,
    unique_visitors: 0,
    total_tools_clicked: 0,
    avg_clicks_per_tool: 0,
  });

  // Top tools
  const [topTools, setTopTools] = useState<ReferralSummary[]>([]);

  // Source breakdown
  const [sourceBreakdown, setSourceBreakdown] = useState<
    { source: string; clicks: number; percentage: number }[]
  >([]);

  // Trends data
  const [trends, setTrends] = useState<
    { date: string; clicks: number; unique_clicks: number }[]
  >([]);

  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('month');
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [days]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const [stats, tools, sources, trendsData] = await Promise.all([
        referralAnalytics.getOverallStats(days),
        referralAnalytics.getTopReferredTools(10, timePeriod),
        referralAnalytics.getReferralSourceBreakdown(null, days),
        referralAnalytics.getReferralTrends(null, days),
      ]);

      setOverallStats(stats);
      setTopTools(tools);
      setSourceBreakdown(sources);
      setTrends(trendsData);
    } catch (err) {
      console.error('Error loading referral analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAnalytics();
  };

  const handleTimePeriodChange = (period: 'today' | 'week' | 'month') => {
    setTimePeriod(period);
    switch (period) {
      case 'today':
        setDays(1);
        break;
      case 'week':
        setDays(7);
        break;
      case 'month':
        setDays(30);
        break;
    }
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

      {/* Header with time period selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Referral Analytics</h2>
          <p className="text-gray-600 mt-1">Track tool clicks and referral performance</p>
        </div>
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => handleTimePeriodChange(period)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                timePeriod === period
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              )}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricWidget
          id="total-clicks"
          title="Total Clicks"
          value={overallStats.total_clicks}
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
          id="tools-clicked"
          title="Tools Clicked"
          value={overallStats.total_tools_clicked}
          format="number"
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend="neutral"
        />
        <MetricWidget
          id="avg-clicks"
          title="Avg Clicks/Tool"
          value={overallStats.avg_clicks_per_tool}
          format="number"
          loading={loading}
          error={error || undefined}
          onRefresh={handleRefresh}
          trend="neutral"
        />
      </div>

      {/* Top Referred Tools */}
      <Widget
        id="top-tools"
        title="Top Referred Tools"
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
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tool
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Clicks
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unique Visitors
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks {timePeriod === 'today' ? 'Today' : `This ${timePeriod}`}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topTools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No referral data available yet
                  </td>
                </tr>
              ) : (
                topTools.map((tool, index) => (
                  <tr key={tool.tool_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={cn(
                          'inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm',
                          index === 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : index === 1
                            ? 'bg-gray-100 text-gray-700'
                            : index === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-50 text-blue-600'
                        )}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">{tool.tool_name}</div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {tool.total_clicks.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {tool.unique_visitors.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {timePeriod === 'today'
                        ? tool.clicks_today
                        : timePeriod === 'week'
                        ? tool.clicks_this_week
                        : tool.clicks_this_month}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Widget>

      {/* Source Breakdown */}
      <Widget
        id="source-breakdown"
        title="Referral Sources"
        loading={loading}
        error={error || undefined}
        onRefresh={handleRefresh}
        className="bg-white border border-gray-200 shadow-md"
      >
        <div className="space-y-4">
          {sourceBreakdown.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No source data available</p>
          ) : (
            sourceBreakdown.slice(0, 10).map((source) => (
              <div key={source.source} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900 capitalize">
                      {source.source.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {source.clicks.toLocaleString()} clicks
                    </span>
                    <span className="text-sm font-semibold text-blue-600 min-w-[3rem] text-right">
                      {source.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Widget>

      {/* Click Trends */}
      <Widget
        id="click-trends"
        title="Click Trends"
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
                  const maxClicks = Math.max(...trends.map((t) => t.clicks));
                  const height = maxClicks > 0 ? (trend.clicks / maxClicks) * 100 : 0;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="w-full flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-400 cursor-pointer relative"
                          style={{ height: `${height}%`, minHeight: trend.clicks > 0 ? '4px' : '0' }}
                          title={`${trend.date}: ${trend.clicks} clicks (${trend.unique_clicks} unique)`}
                        >
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                            {trend.clicks} clicks
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 transform rotate-0 text-center">
                        {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Total Clicks</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Widget>
    </div>
  );
};

export default ReferralAnalytics;
