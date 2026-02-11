import React, { useState, useEffect } from 'react';
import { PageAnalytics } from './PageAnalytics';
import { ReferralAnalytics } from './ReferralAnalytics';
import { RealTimeAnalytics } from './RealTimeAnalytics';
import { cn } from '../../../utils/cn';
import { Activity, Eye, ExternalLink, Download, FileText } from 'lucide-react';
import { pageAnalytics } from '../../../services/api/pageAnalytics';
import { referralAnalytics } from '../../../services/api/referralAnalytics';
import {
  exportPageAnalytics,
  exportReferralAnalytics,
  generateAnalyticsReport,
  downloadReport,
} from '../../../utils/analyticsExport';

type AnalyticsTab = 'overview' | 'pages' | 'referrals' | 'realtime';

interface AnalyticsWorkflowProps {
  className?: string;
}

/**
 * Comprehensive Analytics Workflow Component
 * Provides a unified interface for monitoring site and referral analytics
 */
export const AnalyticsWorkflow: React.FC<AnalyticsWorkflowProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Activity },
    { id: 'pages' as const, label: 'Page Analytics', icon: Eye },
    { id: 'referrals' as const, label: 'Referral Analytics', icon: ExternalLink },
    { id: 'realtime' as const, label: 'Real-Time', icon: Activity },
  ];

  const handleExport = async () => {
    try {
      const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;

      // Show loading state
      console.log('Exporting analytics data...');

      // Fetch data based on active tab
      if (activeTab === 'pages' || activeTab === 'overview') {
        const pages = await pageAnalytics.getTopPages(days, 100);
        exportPageAnalytics(pages);
      } else if (activeTab === 'referrals') {
        const referrals = await referralAnalytics.getReferralSummary();
        exportReferralAnalytics(referrals);
      } else if (activeTab === 'overview') {
        // Export comprehensive report
        const [pages, referrals, stats] = await Promise.all([
          pageAnalytics.getTopPages(days, 100),
          referralAnalytics.getReferralSummary(),
          pageAnalytics.getOverallStats(days),
        ]);

        const report = generateAnalyticsReport({
          pageAnalytics: pages,
          referralAnalytics: referrals,
          overallStats: stats,
        });

        downloadReport(report);
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
      alert('Failed to export analytics data. Please try again.');
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Analytics Workflow</h2>
            <p className="text-gray-600 mt-1">
              Monitor site performance, user behavior, and referral metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Analytics Overview
              </h3>
              <p className="text-gray-600">
                This dashboard provides comprehensive insights into your site's performance,
                including page views, user behavior, and referral tracking. Use the tabs
                above to explore specific analytics categories.
              </p>
            </div>

            {/* Page Analytics */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Page Analytics Summary
              </h4>
              <PageAnalytics />
            </div>

            {/* Referral Analytics */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-purple-600" />
                Referral Analytics Summary
              </h4>
              <ReferralAnalytics />
            </div>
          </div>
        )}

        {activeTab === 'pages' && <PageAnalytics />}

        {activeTab === 'referrals' && <ReferralAnalytics />}

        {activeTab === 'realtime' && <RealTimeAnalytics />}
      </div>
    </div>
  );
};

export default AnalyticsWorkflow;
