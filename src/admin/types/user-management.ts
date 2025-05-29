import { User } from '@supabase/supabase-js'

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface UserMetadata {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  department?: string;
  title?: string;
  lastLogin?: Date;
  status: 'active' | 'inactive' | 'suspended';
}

export interface ExtendedUser extends Omit<User, 'role'> {
  userRole: UserRole;
  metadata: UserMetadata;
}

export interface UserFilters {
  role?: string;
  status?: UserMetadata['status'];
  search?: string;
  department?: string;
}

export interface BulkOperation {
  userIds: string[];
  action: 'delete' | 'updateRole' | 'updateStatus';
  payload?: {
    roleId?: string;
    status?: UserMetadata['status'];
  };
}