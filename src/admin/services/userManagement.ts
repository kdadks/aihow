import { supabase } from '../../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { 
    AdminResponse,
    AdminUser,
    Role,
    RoleAssignment,
    UserUpdateRequest
} from '../types/admin';
import type { AdminPermissions } from '../types/permissions';

interface DatabaseRole {
    id: string;
    name: string;
    description: string | null;
    permissions: AdminPermissions;
    created_at: string;
    updated_at: string;
}

interface DatabaseUser {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    is_active: boolean;
    user_role_assignments: {
        role: DatabaseRole;
    }[];
}

class UserManagementService {
    async getUsers(page = 1, pageSize = 10): Promise<AdminResponse<AdminUser[]>> {
        try {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            const { data: users, error } = await supabase
                .from('users')
                .select(`
                    id,
                    email,
                    created_at,
                    last_sign_in_at,
                    is_active,
                    user_role_assignments!left (
                        role:user_roles (*)
                    )
                `)
                .range(from, to)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            if (!users) {
                return { data: [], error: null };
            }

            // Transform the nested data structure to match AdminUser type
            const transformedUsers: AdminUser[] = (users as unknown as DatabaseUser[]).map(user => {
                const role = user.user_role_assignments?.[0]?.role;
                return {
                    id: user.id,
                    email: user.email,
                    role: role ? {
                        id: role.id,
                        name: role.name,
                        description: role.description,
                        permissions: role.permissions,
                        created_at: role.created_at,
                        updated_at: role.updated_at
                    } : null,
                    created_at: user.created_at,
                    last_sign_in_at: user.last_sign_in_at,
                    is_active: user.is_active
                };
            });

            return { data: transformedUsers, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getUserById(id: string): Promise<AdminResponse<AdminUser>> {
        try {
            const { data: user, error } = await supabase
                .from('users')
                .select(`
                    id,
                    email,
                    created_at,
                    last_sign_in_at,
                    is_active,
                    user_role_assignments!left (
                        role:user_roles (*)
                    )
                `)
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            if (!user) {
                throw new Error('User not found');
            }

            const userData = user as unknown as DatabaseUser;
            const role = userData.user_role_assignments?.[0]?.role;

            const transformedUser: AdminUser = {
                id: userData.id,
                email: userData.email,
                role: role ? {
                    id: role.id,
                    name: role.name,
                    description: role.description,
                    permissions: role.permissions,
                    created_at: role.created_at,
                    updated_at: role.updated_at
                } : null,
                created_at: userData.created_at,
                last_sign_in_at: userData.last_sign_in_at,
                is_active: userData.is_active
            };

            return { data: transformedUser, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getRoles(): Promise<AdminResponse<Role[]>> {
        try {
            const { data: roles, error } = await supabase
                .from('user_roles')
                .select('*')
                .order('name');

            if (error) {
                throw error;
            }

            if (!roles) {
                return { data: [], error: null };
            }

            const typedRoles: Role[] = roles.map(role => ({
                id: role.id,
                name: role.name,
                description: role.description,
                permissions: role.permissions as AdminPermissions,
                created_at: role.created_at,
                updated_at: role.updated_at
            }));

            return { data: typedRoles, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async assignRole(userId: string, roleId: string): Promise<AdminResponse<RoleAssignment>> {
        try {
            // First, remove any existing role assignments
            await supabase
                .from('user_role_assignments')
                .delete()
                .eq('user_id', userId);

            // Then assign the new role
            const { data: assignment, error } = await supabase
                .from('user_role_assignments')
                .insert({
                    user_id: userId,
                    role_id: roleId,
                    assigned_by: (await supabase.auth.getUser()).data.user?.id
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            if (!assignment) {
                throw new Error('Failed to create role assignment');
            }

            const roleAssignment: RoleAssignment = {
                id: assignment.id,
                user_id: assignment.user_id,
                role_id: assignment.role_id,
                assigned_by: assignment.assigned_by,
                assigned_at: assignment.assigned_at
            };

            return { data: roleAssignment, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async removeRole(userId: string, roleId: string): Promise<AdminResponse<void>> {
        try {
            const { error } = await supabase
                .from('user_role_assignments')
                .delete()
                .match({ user_id: userId, role_id: roleId });

            if (error) {
                throw error;
            }

            return { data: null, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async updateUser(id: string, data: UserUpdateRequest): Promise<AdminResponse<AdminUser>> {
        try {
            const updates: Partial<{ is_active: boolean }> = {};

            if (data.is_active !== undefined) {
                updates.is_active = data.is_active;
            }

            // Update user data if there are any non-role updates
            if (Object.keys(updates).length > 0) {
                const { error: userError } = await supabase
                    .from('users')
                    .update(updates)
                    .eq('id', id);

                if (userError) {
                    throw userError;
                }
            }

            // Update role if specified
            if (data.role_id) {
                const roleResult = await this.assignRole(id, data.role_id);
                if (roleResult.error) {
                    throw roleResult.error;
                }
            }

            // Fetch and return the updated user
            return this.getUserById(id);
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }
}

export const userManagementService = new UserManagementService();
