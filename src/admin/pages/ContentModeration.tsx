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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="pt-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-red-50/80 backdrop-blur-xl border border-red-200 rounded-2xl p-6 text-red-700 shadow-xl">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error Loading Content</h3>
                                    <div className="mt-2 text-sm text-red-700">{error}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="pt-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header with How2doAI Branding */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    How2doAI Content Moderation
                                </h1>
                                <p className="mt-2 text-lg text-gray-600">
                                    Review and moderate community content to maintain quality standards
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-600">Live Monitoring</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                        <div className="border-b border-gray-200/50">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                                        activeTab === 'pending'
                                            ? 'border-blue-500 text-blue-600 bg-blue-50/50 rounded-t-lg px-4'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50 rounded-t-lg px-4'
                                    }`}
                                    onClick={() => setActiveTab('pending')}
                                >
                                    <span className="flex items-center space-x-2">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>Pending Review</span>
                                    </span>
                                </button>
                                <button
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                                        activeTab === 'approved'
                                            ? 'border-green-500 text-green-600 bg-green-50/50 rounded-t-lg px-4'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50 rounded-t-lg px-4'
                                    }`}
                                    onClick={() => setActiveTab('approved')}
                                >
                                    <span className="flex items-center space-x-2">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Approved</span>
                                    </span>
                                </button>
                                <button
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                                        activeTab === 'rejected'
                                            ? 'border-red-500 text-red-600 bg-red-50/50 rounded-t-lg px-4'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50 rounded-t-lg px-4'
                                    }`}
                                    onClick={() => setActiveTab('rejected')}
                                >
                                    <span className="flex items-center space-x-2">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span>Rejected</span>
                                    </span>
                                </button>
                            </nav>
                        </div>

                        {/* Content List */}
                        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/30">
                            {loading ? (
                                <div className="flex items-center justify-center h-64">
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
                                        <span className="text-sm font-medium text-gray-600">Loading content...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200/50">
                                        <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Content ID
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Submitted
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Notes
                                                </th>
                                                {activeTab === 'pending' && (
                                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white/40 backdrop-blur-sm divide-y divide-gray-200/30">
                                            {items.map((item, index) => (
                                                <tr key={item.id} className={`hover:bg-white/60 transition-colors duration-200 ${
                                                    index % 2 === 0 ? 'bg-white/20' : 'bg-transparent'
                                                }`}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.content_id}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm
                                                            ${item.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' :
                                                            item.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                                                            'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {item.notes || <span className="text-gray-400 italic">No notes</span>}
                                                    </td>
                                                    {activeTab === 'pending' && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end space-x-3">
                                                                <button
                                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm"
                                                                    onClick={() => handleReview(item.id, 'approved')}
                                                                >
                                                                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm"
                                                                    onClick={() => handleReview(item.id, 'rejected', 'Content violates guidelines')}
                                                                >
                                                                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                    Reject
                                                                </button>
                                                            </div>
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
                                <div className="bg-white/60 backdrop-blur-sm px-6 py-4 border-t border-gray-200/50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-700">
                                            Showing <span className="font-semibold text-blue-600">{((currentPage - 1) * pageSize) + 1}</span> to <span className="font-semibold text-blue-600">{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="font-semibold text-blue-600">{totalCount}</span> results
                                        </div>
                                        <div className="flex space-x-2">
                                            {Array.from({ length: Math.ceil(totalCount / pageSize) }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                                                        currentPage === i + 1
                                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                                                            : 'bg-white/80 text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md border border-gray-200/50'
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
                </div>
            </div>
        </div>
    );
}