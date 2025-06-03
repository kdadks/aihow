import { useState, useEffect } from 'react';
import { useModerationAdmin } from '../context/AdminContext';
import type { ContentItem, ModerationFilters, ModerationStats } from '../types/moderation';

export default function ContentModeration() {
    const moderation = useModerationAdmin();
    const [items, setItems] = useState<ContentItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<ModerationStats>({
        pending: 0,
        approved: 0,
        rejected: 0
    });

    const [filters, setFilters] = useState<ModerationFilters>({
        status: 'pending'
    });

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 20;

    useEffect(() => {
        fetchContent();
        fetchStats();
    }, [currentPage, filters]);

    const fetchContent = async () => {
        try {
            setIsLoading(true);
            const result = await moderation.getContent(filters, currentPage, pageSize);
            if (result.error) throw result.error;
            if (result.data) {
                setItems(result.data.data);
                setTotalCount(result.data.count);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load content');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const result = await moderation.getContentStats();
            if (result.error) throw result.error;
            if (result.data) {
                setStats(result.data);
            }
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const handleStatusUpdate = async (id: string, status: ContentItem['status'], reason?: string) => {
        try {
            const result = await moderation.updateContentStatus(id, status, reason);
            if (result.error) throw result.error;
            await fetchContent();
            await fetchStats();
        } catch (err) {
            console.error('Failed to update status:', err);
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
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                        <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-500">Approved</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
                        <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
                    <div className="flex space-x-4">
                        <select
                            value={filters.status || ''}
                            onChange={(e) => setFilters({
                                ...filters,
                                status: e.target.value as ContentItem['status'] || undefined
                            })}
                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Content List */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium">{item.type}</h3>
                                        <p className="text-sm text-gray-500">By: {item.user_id}</p>
                                        <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                                            {JSON.stringify(item.content, null, 2)}
                                        </pre>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        {item.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(item.id, 'approved')}
                                                    className="px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const reason = window.prompt('Reason for rejection:');
                                                        if (reason) {
                                                            handleStatusUpdate(item.id, 'rejected', reason);
                                                        }
                                                    }}
                                                    className="px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {item.status !== 'pending' && (
                                            <span className={`px-3 py-1 rounded-md ${
                                                item.status === 'approved'
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-red-50 text-red-700'
                                            }`}>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {item.reason && (
                                    <p className="mt-2 text-sm text-red-600">
                                        Reason: {item.reason}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {Math.ceil(totalCount / pageSize)}
                    </span>
                    <button
                        onClick={() => setCurrentPage(page => page + 1)}
                        disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
