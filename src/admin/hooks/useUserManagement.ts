import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { ExtendedUser, UserRole, UserFilters, BulkOperation, UserMetadata } from '../types/user-management';

export function useUserManagement() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (filters?: UserFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('profiles')
        .select('*');

      if (filters?.role) {
        query = query.eq('user_roles.name', filters.role);
      }
      if (filters?.status) {
        query = query.eq('metadata->>status', filters.status);
      }
      if (filters?.department) {
        query = query.eq('metadata->>department', filters.department);
      }
      if (filters?.search) {
        query = query.or(`
          email.ilike.%${filters.search}%,
          metadata->>'firstName'.ilike.%${filters.search}%,
          metadata->>'lastName'.ilike.%${filters.search}%
        `);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUsers(data as ExtendedUser[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred fetching users');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = useCallback(async (userId: string, roleId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_roles')
        .update({ role_id: roleId })
        .eq('user_id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred updating user role');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const updateUserMetadata = useCallback(async (userId: string, metadata: Partial<UserMetadata>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ metadata })
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred updating user metadata');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const performBulkOperation = useCallback(async (operation: BulkOperation) => {
    try {
      setLoading(true);
      switch (operation.action) {
        case 'delete':
          await Promise.all(
            operation.userIds.map(id =>
              supabase.from('profiles').delete().eq('id', id)
            )
          );
          break;
        case 'updateRole':
          if (!operation.payload?.roleId) throw new Error('Role ID required');
          await Promise.all(
            operation.userIds.map(id =>
              updateUserRole(id, operation.payload!.roleId!)
            )
          );
          break;
        case 'updateStatus':
          if (!operation.payload?.status) throw new Error('Status required');
          await Promise.all(
            operation.userIds.map(id =>
              updateUserMetadata(id, { status: operation.payload!.status! })
            )
          );
          break;
      }
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred performing bulk operation');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, updateUserRole, updateUserMetadata]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserRole,
    updateUserMetadata,
    performBulkOperation
  };
}