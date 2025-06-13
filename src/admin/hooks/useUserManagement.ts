import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { ExtendedUser, UserRole, UserFilters, BulkOperation, UserMetadata } from '../types/user-management';
import { User } from '@supabase/supabase-js';

type DatabaseUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  profiles: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    department?: string;
    title?: string;
    status?: 'active' | 'inactive' | 'suspended';
  };
  user_roles: Array<{
    roles: {
      id: string;
      name: string;
      description: string;
    }
  }>;
}

export function useUserManagement() {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (filters?: UserFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('users')
        .select(`
          id,
          email,
          created_at,
          last_sign_in_at,
          profiles!profiles_id_fkey(*),
          user_roles(
            roles(
              id,
              name,
              description
            )
          )
        `);

      if (filters?.role) {
        query = query.eq('user_roles.roles.name', filters.role);
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

      const transformedUsers = ((data as unknown) as DatabaseUser[])?.map(user => {
        const userRole: UserRole = {
          id: user.user_roles?.[0]?.roles?.id || '',
          name: user.user_roles?.[0]?.roles?.name || '',
          description: user.user_roles?.[0]?.roles?.description || '',
          permissions: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const metadata: UserMetadata = {
          firstName: user.profiles?.firstName,
          lastName: user.profiles?.lastName,
          avatarUrl: user.profiles?.avatarUrl,
          department: user.profiles?.department,
          title: user.profiles?.title,
          status: user.profiles?.status || 'inactive'
        };

        const extendedUser: ExtendedUser = {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          userRole,
          metadata
        };

        return extendedUser;
      }) || [];

      setUsers(transformedUsers);
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
        .from('users')
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
              supabase.from('users').delete().eq('id', id)
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