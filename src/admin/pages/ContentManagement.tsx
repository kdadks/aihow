import React from 'react';
import { useAdminContext } from '../context/AdminContext';
import { ContentEditor } from '../components/ContentEditor';
import type { ContentItem } from '../../services/api';

export default function ContentManagement() {
    const { contentService } = useAdminContext();
    const [items, setItems] = React.useState<ContentItem[]>([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedItem, setSelectedItem] = React.useState<ContentItem | null>(null);
    const [showEditor, setShowEditor] = React.useState(false);
    const [filters, setFilters] = React.useState({
        status: 'all',
        type: 'all'
    });

    const pageSize = 10;

    // Fetch content items
    React.useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const response = await contentService.getContentItems(
                    currentPage,
                    pageSize,
                    {
                        status: filters.status !== 'all' ? filters.status : undefined,
                        type: filters.type !== 'all' ? filters.type : undefined
                    }
                );

                if (response.error) {
                    throw new Error(response.error.message);
                }

                if (response.data) {
                    setItems(response.data.data);
                    setTotalCount(response.data.count);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load content');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [currentPage, filters, contentService]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            const response = await contentService.deleteContentItem(id);
            if (response.error) {
                throw new Error(response.error.message);
            }
            
            // Remove item from list
            setItems(prev => prev.filter(item => item.id !== id));
            setTotalCount(prev => prev - 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete content');
        }
    };

    const handleEdit = (item: ContentItem) => {
        setSelectedItem(item);
        setShowEditor(true);
    };

    const handleCreate = () => {
        setSelectedItem(null);
        setShowEditor(true);
    };

    const handleEditorClose = () => {
        setShowEditor(false);
        setSelectedItem(null);
    };

    const handleEditorSuccess = () => {
        // Refresh the content list
        const fetchContent = async () => {
            try {
                const response = await contentService.getContentItems(
                    currentPage,
                    pageSize,
                    {
                        status: filters.status !== 'all' ? filters.status : undefined,
                        type: filters.type !== 'all' ? filters.type : undefined
                    }
                );

                if (response.error) {
                    throw new Error(response.error.message);
                }

                if (response.data) {
                    setItems(response.data.data);
                    setTotalCount(response.data.count);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load content');
            }
        };

        fetchContent();
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
                <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={handleCreate}
                >
                    Create New
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={filters.status}
                            onChange={e => handleFilterChange('status', e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={filters.type}
                            onChange={e => handleFilterChange('type', e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="article">Article</option>
                            <option value="page">Page</option>
                            <option value="post">Post</option>
                        </select>
                    </div>
                </div>
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
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Updated
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.title}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {item.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                ${item.status === 'published' ? 'bg-green-100 text-green-800' :
                                                item.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(item.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
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

            {/* Content Editor Modal */}
            {showEditor && (
                <ContentEditor
                    item={selectedItem || undefined}
                    onClose={handleEditorClose}
                    onSuccess={handleEditorSuccess}
                />
            )}
        </div>
    );
}