import React from 'react';
import { useAdminContext } from '../context/AdminContext';
import type { ModerationItem } from '../../services/api';

export default function ContentModeration() {
    const { moderationService } = useAdminContext();
    const [items, setItems] = React.useState<ModerationItem[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [activeTab, setActiveTab] = React.useState<'pending' | 'approved' | 'rejected'>('pending');

    const pageSize = 10;

    // Fetch moderation queue
    React.useEffect(() => {
        const fetchQueue = async () => {
            try {
                setLoading(true);
                const response = await moderationService.getModerationQueue(
                    currentPage,
                    pageSize,
                    activeTab
                );

                if (response.error) {
                    throw new Error(response.error.message);
                }

                if (response.data) {
                    setItems(response.data.data);
                    setTotalCount(response.data.count);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load moderation queue');
            } finally {
                setLoading(false);
            }
        };

        fetchQueue();
    }, [currentPage, activeTab, moderationService]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleReview = async (id: string, status: 'approved' | 'rejected', notes?: string) => {
        try {
            const response = await moderationService.reviewContent(id, status, notes);
            if (response.error) {
                throw new Error(response.error.message);
            }

            // Remove the item from the list if it was in the pending queue
            if (activeTab === 'pending') {
                setItems(prev => prev.filter(item => item.id !== id));
                setTotalCount(prev => prev - 1);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to review content');
        }
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Content Moderation</h1>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'pending'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Review
                    </button>
                    <button
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'approved'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('approved')}
                    >
                        Approved
                    </button>
                    <button
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'rejected'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                        onClick={() => setActiveTab('rejected')}
                    >
                        Rejected
                    </button>
                </nav>
            </div>

            {/* Content List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Content ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Notes
                                    </th>
                                    {activeTab === 'pending' && (
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {item.content_id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {item.notes || '-'}
                                        </td>
                                        {activeTab === 'pending' && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-green-600 hover:text-green-900 mr-4"
                                                    onClick={() => handleReview(item.id, 'approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => handleReview(item.id, 'rejected', 'Content violates guidelines')}
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalCount > pageSize && (
                    <div className="bg-white px-4 py-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                            </div>
                            <div className="flex space-x-2">
                                {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, i) => (
                                    <button
                                        key={i}
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === i + 1
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}