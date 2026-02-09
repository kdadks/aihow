import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: 'active' | 'inactive' | 'draft';
  tools: any[];
  tool_count: number;
  created_at: string;
  updated_at: string;
}

export default function BundlesManagementPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: bundles, isLoading } = useQuery({
    queryKey: ['admin', 'bundles', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('tool_bundles_v2')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Calculate tool count from the tools JSONB field
      return (data || []).map((bundle: any) => ({
        ...bundle,
        tool_count: Array.isArray(bundle.tools) ? bundle.tools.length : 0,
      }));
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Bundle['status'] }) => {
      const { data, error } = await supabase
        .from('tool_bundles_v2')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bundles'] });
    },
  });

  const deleteBundleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tool_bundles_v2')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bundles'] });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteBundleMutation.mutate(id);
    }
  };

  const filteredBundles = bundles?.filter(bundle =>
    bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bundle.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: bundles?.length || 0,
    active: bundles?.filter(b => b.status === 'active').length || 0,
    draft: bundles?.filter(b => b.status === 'draft').length || 0,
    inactive: bundles?.filter(b => b.status === 'inactive').length || 0,
    totalTools: bundles?.reduce((sum, b) => sum + b.tool_count, 0) || 0,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-600 to-rose-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-700 bg-clip-text text-transparent">
                Bundles Management
              </h1>
              <p className="text-gray-600 mt-1">Manage AI tool bundles and collections</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Bundle</span>
            </div>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Total Bundles</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Drafts</p>
          <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Inactive</p>
          <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Total Tools</p>
          <p className="text-2xl font-bold text-pink-600">{stats.totalTools}</p>
        </div>
      </div>

      {/* Bundles List */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl">
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">All Bundles</h2>
            <div className="flex items-center space-x-3">
              <input
                type="search"
                placeholder="Search bundles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading bundles...</p>
          </div>
        ) : filteredBundles && filteredBundles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Bundle</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tools</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredBundles.map((bundle) => (
                  <tr key={bundle.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <div className="max-w-md">
                          <p className="font-medium text-gray-900 line-clamp-1">{bundle.name}</p>
                          {bundle.description && (
                            <p className="text-sm text-gray-500 line-clamp-2">{bundle.description}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">/{bundle.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                        {bundle.tool_count} tools
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={bundle.status}
                        onChange={(e) => updateStatusMutation.mutate({
                          id: bundle.id,
                          status: e.target.value as Bundle['status']
                        })}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bundle.status === 'active' ? 'bg-green-100 text-green-800' :
                          bundle.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(bundle.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-2 text-gray-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors" title="Edit">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(bundle.id, bundle.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">No bundles found</p>
          </div>
        )}
      </div>
    </div>
  );
}
