import { FC, useState, useEffect } from 'react';
import { useAdminAuth } from '../auth/hooks/useAdminAuth';
import { ADMIN_API } from '../api';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userEmail: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'failure';
}

interface AuditFilters {
  startDate: string;
  endDate: string;
  action?: string;
  userId?: string;
  status?: 'success' | 'failure';
}

export const AdminAudit: FC = () => {
  const { hasPermission } = useAdminAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filters, setFilters] = useState<AuditFilters>({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!hasPermission('audit.view')) {
      setError('You do not have permission to view audit logs');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        ...(filters.action && { action: filters.action }),
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.status && { status: filters.status })
      });

      const response = await fetch(`${ADMIN_API.audit.logs}?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }

      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filters]); // Re-fetch when filters change

  const downloadReport = async () => {
    if (!hasPermission('audit.download')) {
      setError('You do not have permission to download audit reports');
      return;
    }

    try {
      const response = await fetch(ADMIN_API.audit.report, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-report-${filters.startDate}-${filters.endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download report');
    }
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-gray-600">View and export system audit logs</p>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div>
            <label className="block mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
              className="form-input"
            />
          </div>
          <div>
            <label className="block mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
              className="form-input"
            />
          </div>
          <div>
            <label className="block mb-2">Status</label>
            <select
              value={filters.status || ''}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value as 'success' | 'failure' | undefined }))}
              className="form-select"
            >
              <option value="">All</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
            </select>
          </div>
        </div>

        <button
          onClick={downloadReport}
          disabled={isLoading || !hasPermission('audit.download')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          Download Report
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">IP Address</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Loading...</td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">No audit logs found</td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2">{log.action}</td>
                  <td className="px-4 py-2">{log.userEmail}</td>
                  <td className="px-4 py-2">{log.ipAddress}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};