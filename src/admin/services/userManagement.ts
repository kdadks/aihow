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

interface DatabasePermission {
    id: number;
    name: string;
    description: string;
    category: string;
    created_at: string;
}

interface DatabaseRole {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    permissions?: Array<{
        permission_name: {
            name: string;
        };
    }>;
}

interface DatabaseUser {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    is_active: boolean;
    profiles?: {
        username: string | null;
        full_name: string | null;
    }[];
    user_roles: {
        role: DatabaseRole;
        role_permissions: {
            permission: DatabasePermission;
        }[];
    }[];
}

/**
 * Maps an array of permission names to the AdminPermissions type
 */
function mapToAdminPermissions(permissions: string[]): AdminPermissions {
    const result = {
        canManageUsers: false,
        canManageContent: false,
        canModerateContent: false,
        canManageSettings: false,
        canViewMetrics: false
    };

    permissions.forEach(perm => {
        switch (perm) {
            case 'admin:manage_users':
                result.canManageUsers = true;
                break;
            case 'content:write':
                result.canManageContent = true;
                break;
            case 'content:moderate':
                result.canModerateContent = true;
                break;
            case 'system:settings':
                result.canManageSettings = true;
                break;
            case 'system:analytics':
                result.canViewMetrics = true;
                break;
        }
    });

    return result;
}

class UserManagementService {
    async getUsers(page = 1, pageSize = 10): Promise<AdminResponse<AdminUser[]>> {
        try {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            // First get users with basic role info
            const { data: users, error } = await supabase
                .from('users')
                .select(`
                    id,
                    email,
                    created_at,
                    last_sign_in_at,
                    user_roles(
                        roles(
                            id,
                            name,
                            description,
                            created_at,
                            updated_at
                        )
                    ),
                    profiles!profiles_id_fkey(
                        username,
                        full_name
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

            // Transform into AdminUser type
            const transformedUsers: AdminUser[] = users.map((user: any) => {
                const roleData = user.user_roles?.[0]?.roles?.[0];

                return {
                    id: user.id,
                    email: user.email,
                    role: roleData ? {
                        id: String(roleData.id),
                        name: roleData.name,
                        description: roleData.description,
                        permissions: {
                            canManageUsers: roleData.name === 'admin' || roleData.name === 'system_admin',
                            canManageContent: true, // All roles can manage content
                            canModerateContent: true,
                            canManageSettings: roleData.name === 'admin' || roleData.name === 'system_admin',
                            canViewMetrics: true
                        },
                        created_at: user.created_at,
                        updated_at: user.created_at // Using created_at since updated_at isn't in the query
                    } : null,
                    created_at: user.created_at,
                    last_sign_in_at: user.last_sign_in_at,
                    profile: user.profiles?.[0] ? {
                        username: user.profiles[0].username,
                        full_name: user.profiles[0].full_name
                    } : null,
                    is_active: true // Since auth.users doesn't have is_active, default to true
                };
            });

            return { data: transformedUsers, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getUserById(id: string): Promise<AdminResponse<AdminUser>> {
        try {
            // Get user data and profile in a single query
            const { data: user, error } = await supabase
                .from('users')
                .select(`
                    id,
                    email,
                    created_at,
                    last_sign_in_at,
                    user_roles(
                        roles(
                            id,
                            name, 
                            description,
                            role_permissions(
                                permissions(name)
                            )
                        )
                    ),
                    profiles!profiles_id_fkey(
                        username,
                        full_name
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

            const roleData = user.user_roles?.[0]?.roles?.[0];
            const role = roleData ? {
                id: String(roleData.id),
                name: roleData.name,
                description: roleData.description,
                permissions: mapToAdminPermissions(
                    roleData.role_permissions?.flatMap(rp => 
                        rp.permissions.map(p => p.name)
                    ) || []
                ),
                created_at: user.created_at,
                updated_at: user.created_at // Using created_at as updated_at since it's not in the query
            } : null;

            const transformedUser: AdminUser = {
                id: user.id,
                email: user.email,
                role,
                created_at: user.created_at,
                last_sign_in_at: user.last_sign_in_at,
                profile: user.profiles?.[0] ? {
                    username: user.profiles[0].username,
                    full_name: user.profiles[0].full_name
                } : null,
                is_active: true // Since auth.users doesn't have is_active, default to true
            };

            return { data: transformedUser, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getRoles(): Promise<AdminResponse<Role[]>> {
        try {
            const { data: roles, error } = await supabase
                .from('roles')
                .select(`
                    *,
                    role_permissions!left (
                        permission:permissions!inner (*)
                    )
                `)
                .order('name');

            if (error) {
                throw error;
            }

            if (!roles) {
                return { data: [], error: null };
            }

            interface RoleWithPermissions {
                id: number;
                name: string;
                description: string | null;
                created_at: string;
                updated_at: string;
                role_permissions?: {
                    permission: DatabasePermission;
                }[];
            }

            const typedRoles: Role[] = roles.map((role: RoleWithPermissions) => {
                const permissions = role.role_permissions?.map((rp: { permission: DatabasePermission }) => rp.permission.name) || [];
                const mappedPermissions = mapToAdminPermissions(permissions);
                
                return {
                    id: String(role.id), // Convert to string for interface compatibility
                    name: role.name,
                    description: role.description,
                    permissions: mappedPermissions,
                    created_at: role.created_at,
                    updated_at: role.updated_at
                };
            });

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
                    role_id: parseInt(roleId), // Convert to number for BIGSERIAL
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
                role_id: String(assignment.role_id), // Convert back to string for interface
                assigned_by: assignment.assigned_by,
                assigned_at: assignment.created_at // Using created_at as assigned_at
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
                .match({ 
                    user_id: userId,
                    role_id: parseInt(roleId) // Convert to number for BIGSERIAL
                });

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
