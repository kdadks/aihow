import { useState, useEffect } from 'react';
import { useAuditAdmin } from '../context/AdminContext';
import { AuditLog, AuditLogFilters } from '../types/admin';

export default function AuditLogPage() {
    const { getLogs, exportLogs } = useAuditAdmin();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [filters, setFilters] = useState<AuditLogFilters>({});
    const pageSize = 20;

    useEffect(() => {
        fetchLogs();
    }, [page, filters]);

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const result = await getLogs(filters, page, pageSize);
            if (result.error) throw result.error;
            if (result.data) {
                setLogs(result.data.data);
                setTotalCount(result.data.count);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load audit logs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const result = await exportLogs(filters);
            if (result.error) throw result.error;
            if (result.data) {
                const url = window.URL.createObjectURL(result.data);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'audit-logs.csv';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Failed to export logs:', err);
        }
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                                Audit Log
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Review system activity and changes.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                onClick={handleExport}
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                            >
                                Export Logs
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mt-8 bg-white rounded-lg border border-gray-200 p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Action</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={filters.action || ''}
                                    onChange={(e) => setFilters({ ...filters, action: e.target.value || undefined })}
                                >
                                    <option value="">All Actions</option>
                                    <option value="create">Create</option>
                                    <option value="update">Update</option>
                                    <option value="delete">Delete</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Resource Type</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={filters.resourceType || ''}
                                    onChange={(e) => setFilters({ ...filters, resourceType: e.target.value || undefined })}
                                >
                                    <option value="">All Types</option>
                                    <option value="user">User</option>
                                    <option value="content">Content</option>
                                    <option value="setting">Setting</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date From</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={filters.startDate || ''}
                                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date To</label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={filters.endDate || ''}
                                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
                                />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="mt-8 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead>
                                            <tr>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Timestamp
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Action
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Resource Type
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Resource ID
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    User
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    IP Address
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {logs.map((log) => (
                                                <tr key={log.id}>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                        {log.action}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                        {log.resource_type}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {log.resource_id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {log.user_id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {log.ip_address}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={logs.length < pageSize}
                                className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="text-sm text-gray-500">
                            Page {page} of {Math.ceil(totalCount / pageSize)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
