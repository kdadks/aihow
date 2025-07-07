import { supabase } from '../../lib/supabase';

export interface UserRoleData {
  id: number;
  name: string;
  description?: string;
  level: number;
  assigned_at: string;
}

export interface UserPermissionData {
  name: string;
  category: string;
}

export interface UserProfileData {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export async function getUserProfile(userId: string): Promise<{ data: UserProfileData | null; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

export async function getUserRoles(userId: string): Promise<{ data: UserRoleData[]; error: any }> {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      assigned_at,
      roles!inner (
        id,
        name,
        description,
        level
      )
    `)
    .eq('user_id', userId);

  if (error) {
    return { data: [], error };
  }

  const roles = data?.map((item: any) => ({
    id: item.roles.id,
    name: item.roles.name,
    description: item.roles.description,
    level: item.roles.level,
    assigned_at: item.assigned_at
  })) || [];

  return { data: roles, error: null };
}

export async function getUserPermissions(userId: string): Promise<{ data: UserPermissionData[]; error: any }> {
  const { data, error } = await supabase
    .from('user_permissions')
    .select('permission_name, permission_category')
    .eq('user_id', userId);

  if (error) {
    return { data: [], error };
  }

  const permissions = data?.map((item: any) => ({
    name: item.permission_name,
    category: item.permission_category
  })) || [];

  return { data: permissions, error: null };
}

export async function createUserProfile(userId: string, profileData: Partial<UserProfileData>): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        ...profileData
      }
    ])
    .select()
    .single();

  return { data, error };
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfileData>): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

export async function assignUserRole(userId: string, roleName: string, assignedBy?: string): Promise<{ data: any; error: any }> {
  const { data, error } = await supabase.rpc('assign_user_role', {
    user_uuid: userId,
    role_name: roleName,
    assigned_by_uuid: assignedBy || null
  });

  return { data, error };
}

export async function checkUserPermission(userId: string, permission: string): Promise<{ data: boolean; error: any }> {
  const { data, error } = await supabase.rpc('user_has_permission', {
    user_uuid: userId,
    permission_name: permission
  });

  return { data: data || false, error };
}

export async function getUserMaxRoleLevel(userId: string): Promise<{ data: number; error: any }> {
  const { data, error } = await supabase.rpc('get_user_max_role_level', {
    user_uuid: userId
  });

  return { data: data || 1, error };
}
