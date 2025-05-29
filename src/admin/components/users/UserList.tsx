import React, { useEffect, useState } from 'react';
import { useUserManagement } from '../../hooks/useUserManagement';
import { UserFilters, ExtendedUser, BulkOperation } from '../../types/user-management';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';
import UserListItem from './UserListItem';
import UserFiltersPanel from './UserFiltersPanel';

export default function UserList() {
  const {
    users,
    loading,
    error,
    fetchUsers,
    performBulkOperation
  } = useUserManagement();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserFilters>({});

  useEffect(() => {
    fetchUsers(filters);
  }, [fetchUsers, filters]);

  const handleSelectUser = (userId: string, selected: boolean) => {
    setSelectedUsers(prev =>
      selected
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedUsers(selected ? users.map(user => user.id) : []);
  };

  const handleBulkOperation = async (action: BulkOperation['action'], payload?: BulkOperation['payload']) => {
    if (!selectedUsers.length) return;

    await performBulkOperation({
      userIds: selectedUsers,
      action,
      payload
    });

    setSelectedUsers([]);
  };

  if (error) {
    return (
      <Card className="p-4 text-red-600">
        Error: {error}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex gap-2">
          <Button
            disabled={selectedUsers.length === 0}
            onClick={() => handleBulkOperation('delete')}
            variant="ghost"
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Delete Selected
          </Button>
          <Button
            disabled={selectedUsers.length === 0}
            onClick={() => handleBulkOperation('updateStatus', { status: 'active' })}
            variant="primary"
          >
            Activate Selected
          </Button>
          <Button
            disabled={selectedUsers.length === 0}
            onClick={() => handleBulkOperation('updateStatus', { status: 'suspended' })}
            variant="outline"
            className="text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
          >
            Suspend Selected
          </Button>
        </div>
      </div>

      <UserFiltersPanel
        filters={filters}
        onFiltersChange={setFilters}
      />

      {loading ? (
        <Loading />
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={selectedUsers.length === users.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="form-checkbox"
            />
            <span className="font-medium">Select All</span>
            <span className="ml-auto">
              {selectedUsers.length} of {users.length} selected
            </span>
          </div>

          <div className="space-y-2">
            {users.map(user => (
              <UserListItem
                key={user.id}
                user={user}
                selected={selectedUsers.includes(user.id)}
                onSelect={handleSelectUser}
              />
            ))}
          </div>

          {users.length === 0 && (
            <Card className="p-4 text-center text-gray-500">
              No users found matching the current filters
            </Card>
          )}
        </div>
      )}
    </div>
  );
}