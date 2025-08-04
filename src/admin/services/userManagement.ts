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
    user_roles: {
        role: DatabaseRole;
    }[];
}

class UserManagementService {
    async getUsers(page = 1, pageSize = 10): Promise<AdminResponse<AdminUser[]>> {
        try {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            // Query profiles table and get roles separately using helper functions
            const { data: users, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    username,
                    full_name,
                    created_at,
                    updated_at
                `)
                .range(from, to)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            if (!users) {
                return { data: [], error: null };
            }

            // Transform users and get roles using helper functions
            const transformedUsers: AdminUser[] = await Promise.all(
                users.map(async (user: any) => {
                    // Try to get user roles using helper function, fallback if not available
                    let primaryRole = 'user';
                    
                    try {
                        const { data: userRoles, error } = await supabase
                            .rpc('get_user_roles', { user_id: user.id });
                        
                        if (!error && userRoles && userRoles.length > 0) {
                            primaryRole = userRoles[0];
                        }
                    } catch (error) {
                        console.warn('Helper function get_user_roles not available for user:', user.id);
                        // Use default role
                    }
                    
                    return {
                        id: user.id,
                        email: `${user.username}@example.com`, // Generate email from username
                        role: {
                            id: '1', // Simplified for admin view
                            name: primaryRole,
                            description: `${primaryRole} role`,
                            permissions: {
                                canManageUsers: primaryRole === 'admin' || primaryRole === 'super_admin',
                                canManageContent: primaryRole === 'admin' || primaryRole === 'super_admin' || primaryRole === 'content_admin',
                                canModerateContent: primaryRole === 'admin' || primaryRole === 'super_admin' || primaryRole === 'moderator',
                                canManageSettings: primaryRole === 'admin' || primaryRole === 'super_admin',
                                canViewMetrics: primaryRole === 'admin' || primaryRole === 'super_admin'
                            },
                            created_at: user.created_at,
                            updated_at: user.updated_at
                        },
                        created_at: user.created_at,
                        last_sign_in_at: user.updated_at, // Use updated_at as fallback
                        is_active: true // Default to active
                    };
                })
            );

            return { data: transformedUsers, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getUserById(id: string): Promise<AdminResponse<AdminUser>> {
        try {
            const { data: user, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    username,
                    full_name,
                    created_at,
                    updated_at
                `)
                .eq('id', id)
                .single();

            if (error) {
                throw error;
            }

            if (!user) {
                throw new Error('User not found');
            }

            // Try to get user roles using helper function, fallback if not available
            let primaryRole = 'user';
            
            try {
                const { data: userRoles, error } = await supabase
                    .rpc('get_user_roles', { user_id: user.id });
                
                if (!error && userRoles && userRoles.length > 0) {
                    primaryRole = userRoles[0];
                }
            } catch (error) {
                console.warn('Helper function get_user_roles not available for user:', user.id);
                // Use default role
            }

            const transformedUser: AdminUser = {
                id: user.id,
                email: `${user.username}@example.com`, // Generate email from username
                role: {
                    id: '1',
                    name: primaryRole,
                    description: `${primaryRole} role`,
                    permissions: {
                        canManageUsers: primaryRole === 'admin' || primaryRole === 'super_admin',
                        canManageContent: primaryRole === 'admin' || primaryRole === 'super_admin' || primaryRole === 'content_admin',
                        canModerateContent: primaryRole === 'admin' || primaryRole === 'super_admin' || primaryRole === 'moderator',
                        canManageSettings: primaryRole === 'admin' || primaryRole === 'super_admin',
                        canViewMetrics: primaryRole === 'admin' || primaryRole === 'super_admin'
                    },
                    created_at: user.created_at,
                    updated_at: user.updated_at
                },
                created_at: user.created_at,
                last_sign_in_at: user.updated_at, // Use updated_at as fallback
                is_active: true // Default to active
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
                .from('user_roles')
                .delete()
                .eq('user_id', userId);

            // Then assign the new role
            const { data: assignment, error } = await supabase
                .from('user_roles')
                .insert({
                    user_id: userId,
                    role_id: roleId
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
                id: `${assignment.user_id}-${assignment.role_id}`, // Composite ID since user_roles doesn't have a separate ID
                user_id: assignment.user_id,
                role_id: assignment.role_id,
                assigned_by: (await supabase.auth.getUser()).data.user?.id || '',
                assigned_at: new Date().toISOString()
            };

            return { data: roleAssignment, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async removeRole(userId: string, roleId: string): Promise<AdminResponse<void>> {
        try {
            const { error } = await supabase
                .from('user_roles')
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
                    .from('profiles')
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
