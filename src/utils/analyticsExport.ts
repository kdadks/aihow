/**
 * Analytics Export Utilities
 * Functions to export analytics data to various formats
 */

import type { PageAnalytics } from '../services/api/pageAnalytics';
import type { ReferralSummary } from '../types/referral.types';

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[], headers: string[]): string {
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape commas and quotes
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Download data as CSV file
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Export page analytics to CSV
 */
export function exportPageAnalytics(data: PageAnalytics[], filename?: string): void {
  const headers = [
    'page_path',
    'page_title',
    'total_visits',
    'unique_visitors',
    'avg_time_on_page',
    'bounce_rate',
  ];

  const csvContent = convertToCSV(data, headers);
  const fileName = filename || `page-analytics-${new Date().toISOString().split('T')[0]}.csv`;

  downloadCSV(fileName, csvContent);
}

/**
 * Export referral analytics to CSV
 */
export function exportReferralAnalytics(data: ReferralSummary[], filename?: string): void {
  const headers = [
    'tool_name',
    'tool_slug',
    'total_clicks',
    'unique_visitors',
    'clicks_today',
    'clicks_this_week',
    'clicks_this_month',
  ];

  const csvContent = convertToCSV(data, headers);
  const fileName = filename || `referral-analytics-${new Date().toISOString().split('T')[0]}.csv`;

  downloadCSV(fileName, csvContent);
}

/**
 * Export data as JSON
 */
export function downloadJSON(filename: string, data: any): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Generate analytics report (text format)
 */
export function generateAnalyticsReport(data: {
  pageAnalytics?: PageAnalytics[];
  referralAnalytics?: ReferralSummary[];
  overallStats?: any;
}): string {
  const lines: string[] = [];
  const now = new Date().toLocaleString();

  lines.push('='.repeat(60));
  lines.push('ANALYTICS REPORT');
  lines.push(`Generated: ${now}`);
  lines.push('='.repeat(60));
  lines.push('');

  // Overall Stats
  if (data.overallStats) {
    lines.push('OVERALL STATISTICS');
    lines.push('-'.repeat(60));
    lines.push(`Total Visits: ${data.overallStats.total_visits?.toLocaleString() || 'N/A'}`);
    lines.push(`Unique Visitors: ${data.overallStats.unique_visitors?.toLocaleString() || 'N/A'}`);
    lines.push(`Total Sessions: ${data.overallStats.total_sessions?.toLocaleString() || 'N/A'}`);
    lines.push(
      `Avg Session Duration: ${data.overallStats.avg_session_duration || 'N/A'} seconds`
    );
    lines.push(`Bounce Rate: ${data.overallStats.bounce_rate || 'N/A'}%`);
    lines.push('');
  }

  // Page Analytics
  if (data.pageAnalytics && data.pageAnalytics.length > 0) {
    lines.push('TOP PAGES');
    lines.push('-'.repeat(60));
    data.pageAnalytics.slice(0, 10).forEach((page, index) => {
      lines.push(
        `${index + 1}. ${page.page_title || page.page_path} - ${page.total_visits} visits`
      );
    });
    lines.push('');
  }

  // Referral Analytics
  if (data.referralAnalytics && data.referralAnalytics.length > 0) {
    lines.push('TOP REFERRED TOOLS');
    lines.push('-'.repeat(60));
    data.referralAnalytics.slice(0, 10).forEach((tool, index) => {
      lines.push(`${index + 1}. ${tool.tool_name} - ${tool.total_clicks} clicks`);
    });
    lines.push('');
  }

  lines.push('='.repeat(60));
  lines.push('END OF REPORT');
  lines.push('='.repeat(60));

  return lines.join('\n');
}

/**
 * Download analytics report as text file
 */
export function downloadReport(reportContent: string, filename?: string): void {
  const fileName = filename || `analytics-report-${new Date().toISOString().split('T')[0]}.txt`;
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
