import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Flag, CheckCircle, XCircle, Eye, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Report {
  id: string;
  reported_item_type: string;
  reported_item_id: string;
  reporter_user_id: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  reviewed_by: string | null;
  reviewed_at: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
}

type StatusFilter = 'all' | 'pending' | 'reviewing' | 'resolved' | 'dismissed';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (
    reportId: string,
    newStatus: 'reviewing' | 'resolved' | 'dismissed'
  ) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: newStatus,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString(),
          resolution_notes: resolutionNotes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) throw error;

      // Log audit
      await supabase.rpc('create_audit_log', {
        p_action: 'update_report_status',
        p_resource_type: 'report',
        p_resource_id: reportId,
        p_new_values: { status: newStatus },
      });

      setSelectedReport(null);
      setResolutionNotes('');
      loadReports();
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const getReasonBadge = (reason: string) => {
    const colors: Record<string, string> = {
      spam: 'bg-yellow-100 text-yellow-800',
      inappropriate: 'bg-red-100 text-red-800',
      misleading: 'bg-orange-100 text-orange-800',
      copyright: 'bg-purple-100 text-purple-800',
      harassment: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };

    return colors[reason] || colors.other;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewing':
        return <Eye className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'dismissed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Flag className="w-8 h-8 text-amber-600" />
              Reports & Flags
              {pendingCount > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  {pendingCount} Pending
                </span>
              )}
            </h1>
            <p className="text-gray-600 mt-1">Review reported content and user flags</p>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mt-6 flex gap-2">
          {(['all', 'pending', 'reviewing', 'resolved', 'dismissed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-sm opacity-75">
                  ({reports.filter((r) => r.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No reports found</p>
            <p className="text-sm mt-1">
              {statusFilter === 'all'
                ? 'No reports have been submitted yet'
                : `No ${statusFilter} reports`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={cn(
                          'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                          getReasonBadge(report.reason)
                        )}
                      >
                        {getStatusIcon(report.status)}
                        {report.reason}
                      </span>
                      <span className="text-sm text-gray-500">
                        {report.reported_item_type}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{report.description || 'No description provided'}</p>
                    <p className="text-xs text-gray-500">
                      Reported {new Date(report.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateReportStatus(report.id, 'reviewing');
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
                        >
                          Review
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateReportStatus(report.id, 'resolved');
                          }}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateReportStatus(report.id, 'dismissed');
                          }}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Report Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="text-gray-900">{selectedReport.reported_item_type}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Reason</label>
                  <span className={cn('inline-block px-3 py-1 rounded-full text-sm font-medium', getReasonBadge(selectedReport.reason))}>
                    {selectedReport.reason}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-gray-900">{selectedReport.description || 'No description provided'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Notes</label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Add notes about this report..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {selectedReport.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateReportStatus(selectedReport.id, 'dismissed')}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => updateReportStatus(selectedReport.id, 'resolved')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
