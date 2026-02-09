import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: {
    canManageUsers: boolean;
    canManageContent: boolean;
    canModerateContent: boolean;
    canManageSettings: boolean;
    canViewMetrics: boolean;
  };
  created_at: string;
  updated_at: string;
  user_count?: number;
}

export default function RolesManagementPage() {
  const queryClient = useQueryClient();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    permissions: Role['permissions'];
  }>({
    name: '',
    description: '',
    permissions: {
      canManageUsers: false,
      canManageContent: false,
      canModerateContent: false,
      canManageSettings: false,
      canViewMetrics: false,
    },
  });

  const { data: roles, isLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*, user_roles(count)')
        .order('name', { ascending: true });

      if (error) throw error;

      return data.map((role: any) => ({
        ...role,
        permissions: role.permissions || {
          canManageUsers: false,
          canManageContent: false,
          canModerateContent: false,
          canManageSettings: false,
          canViewMetrics: false,
        },
        user_count: role.user_roles?.[0]?.count || 0,
      }));
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Role> }) => {
      const { data, error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      setEditingRole(null);
      setIsAddingNew(false);
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: async (newRole: Omit<Role, 'id' | 'created_at' | 'updated_at' | 'user_count'>) => {
      const { data, error } = await supabase
        .from('roles')
        .insert(newRole)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      setIsAddingNew(false);
      resetForm();
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: {
        canManageUsers: false,
        canManageContent: false,
        canModerateContent: false,
        canManageSettings: false,
        canViewMetrics: false,
      },
    });
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || {
        canManageUsers: false,
        canManageContent: false,
        canModerateContent: false,
        canManageSettings: false,
        canViewMetrics: false,
      },
    });
    setIsAddingNew(false);
  };

  const handleSave = () => {
    if (editingRole) {
      updateRoleMutation.mutate({
        id: editingRole.id,
        updates: formData,
      });
    } else if (isAddingNew) {
      createRoleMutation.mutate(formData as any);
    }
  };

  const handleDelete = (id: number, name: string, userCount: number) => {
    if (userCount > 0) {
      alert(`Cannot delete role "${name}" because it has ${userCount} assigned user(s). Please reassign users first.`);
      return;
    }
    if (confirm(`Are you sure you want to delete the role "${name}"?`)) {
      deleteRoleMutation.mutate(id);
    }
  };

  const handlePermissionToggle = (permission: keyof Role['permissions']) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: !formData.permissions[permission],
      },
    });
  };

  const permissionLabels = {
    canManageUsers: { label: 'Manage Users', description: 'Create, edit, and delete user accounts' },
    canManageContent: { label: 'Manage Content', description: 'Manage tools, categories, and bundles' },
    canModerateContent: { label: 'Moderate Content', description: 'Review and approve user submissions' },
    canManageSettings: { label: 'Manage Settings', description: 'Access and modify system settings' },
    canViewMetrics: { label: 'View Metrics', description: 'Access analytics and reports' },
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
                Roles & Permissions
              </h1>
              <p className="text-gray-600 mt-1">Manage user roles and their permissions</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAddingNew(true);
              setEditingRole(null);
              resetForm();
            }}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Role</span>
            </div>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Total Roles</p>
          <p className="text-2xl font-bold text-gray-900">{roles?.length || 0}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">Total Assigned Users</p>
          <p className="text-2xl font-bold text-amber-600">
            {roles?.reduce((sum, role) => sum + (role.user_count || 0), 0) || 0}
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-6">
          <p className="text-sm text-gray-500 mb-1">System Roles</p>
          <p className="text-2xl font-bold text-orange-600">
            {roles?.filter(r => ['admin', 'system_admin'].includes(r.name)).length || 0}
          </p>
        </div>
      </div>

      {/* Roles List */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl">
        <div className="p-6 border-b border-gray-200/50">
          <h2 className="text-xl font-bold text-gray-900">All Roles</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading roles...</p>
          </div>
        ) : roles && roles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-200/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Role Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Permissions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Users</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          role.name === 'admin' ? 'bg-red-100' :
                          role.name === 'system_admin' ? 'bg-orange-100' :
                          role.name === 'content_admin' ? 'bg-amber-100' :
                          'bg-gray-100'
                        }`}>
                          <svg className={`w-5 h-5 ${
                            role.name === 'admin' ? 'text-red-600' :
                            role.name === 'system_admin' ? 'text-orange-600' :
                            role.name === 'content_admin' ? 'text-amber-600' :
                            'text-gray-600'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{role.name.replace('_', ' ')}</p>
                          {role.description && (
                            <p className="text-sm text-gray-500">{role.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 max-w-xs line-clamp-2">
                        {role.description || 'No description'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions && Object.entries(role.permissions).filter(([_, enabled]) => enabled).map(([key]) => (
                          <span key={key} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                            {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        ))}
                        {!role.permissions && (
                          <span className="text-xs text-gray-400">No permissions</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {role.user_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(role)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {role.name !== 'admin' && role.name !== 'system_admin' && (
                          <button
                            onClick={() => handleDelete(role.id, role.name, role.user_count || 0)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">No roles found</p>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {(editingRole || isAddingNew) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingRole ? 'Edit Role' : 'Add New Role'}
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., moderator, editor"
                  disabled={editingRole?.name === 'admin' || editingRole?.name === 'system_admin'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Brief description of this role and its responsibilities"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                <div className="space-y-3">
                  {Object.entries(permissionLabels).map(([key, { label, description }]) => (
                    <div key={key} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={key}
                        checked={formData.permissions[key as keyof Role['permissions']]}
                        onChange={() => handlePermissionToggle(key as keyof Role['permissions'])}
                        className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <div className="flex-1">
                        <label htmlFor={key} className="font-medium text-gray-900 cursor-pointer">
                          {label}
                        </label>
                        <p className="text-sm text-gray-500">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => {
                  setEditingRole(null);
                  setIsAddingNew(false);
                  resetForm();
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name}
                className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingRole ? 'Save Changes' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
