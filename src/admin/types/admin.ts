import { PostgrestError } from '@supabase/supabase-js';
import type { AdminPermissions } from './permissions';

// Basic response type for API calls
export type AdminResponse<T> = {
    data: T | null;
    error: PostgrestError | null;
};

// Role types
export interface Role {
    id: string;
    name: string;
    description: string | null;
    permissions: AdminPermissions;
    created_at: string;
    updated_at: string;
}

export interface RoleAssignment {
    id: string;
    user_id: string;
    role_id: string;
    assigned_by: string;
    assigned_at: string;
}

// User management types
export interface AdminUser {
    id: string;
    email: string;
    role: Role | null;
    created_at: string;
    last_sign_in_at: string | null;
    is_active: boolean;
}

export interface UserUpdateRequest {
    role_id?: string;
    is_active?: boolean;
}

// Audit types
export interface AuditLog {
    id: string;
    user_id: string;
    action: string;
    resource_type: string;
    resource_id: string;
    metadata: Record<string, any>;
    ip_address: string;
    user_agent: string;
    created_at: string;
}

export interface AuditLogFilters {
    userId?: string;
    action?: string;
    resourceType?: string;
    startDate?: string;
    endDate?: string;
}

// Settings types
export interface SystemSetting {
    key: string;
    value: any;
    description: string | null;
    category: string;
    is_public: boolean;
    updated_at: string;
    updated_by: string;
}

export interface FeatureFlag {
    id: string;
    name: string;
    description: string | null;
    enabled: boolean;
    config: Record<string, any>;
    created_at: string;
    updated_at: string;
    updated_by: string;
}

// Service interfaces
export interface UserManagementService {
    getUsers(page?: number, pageSize?: number): Promise<AdminResponse<AdminUser[]>>;
    getUserById(id: string): Promise<AdminResponse<AdminUser>>;
    updateUser(id: string, data: UserUpdateRequest): Promise<AdminResponse<AdminUser>>;
    getRoles(): Promise<AdminResponse<Role[]>>;
    assignRole(userId: string, roleId: string): Promise<AdminResponse<RoleAssignment>>;
    removeRole(userId: string, roleId: string): Promise<AdminResponse<void>>;
}

export interface AuditService {
    getLogs(filters: AuditLogFilters, page?: number, pageSize?: number): Promise<AdminResponse<AuditLog[]>>;
    exportLogs(filters: AuditLogFilters): Promise<AdminResponse<Blob>>;
}

export interface SettingsService {
    getSettings(): Promise<AdminResponse<SystemSetting[]>>;
    updateSetting(key: string, value: any): Promise<AdminResponse<SystemSetting>>;
    getFeatureFlags(): Promise<AdminResponse<FeatureFlag[]>>;
    updateFeatureFlag(id: string, data: Partial<FeatureFlag>): Promise<AdminResponse<FeatureFlag>>;
}

// Component prop types
export interface AdminPageProps {
    title: string;
    description?: string;
}

export interface AdminTableProps<T> {
    data: T[];
    columns: {
        key: keyof T;
        header: string;
        render?: (value: T[keyof T], item: T) => React.ReactNode;
    }[];
    isLoading?: boolean;
    error?: string | null;
    onRowClick?: (item: T) => void;
}

export interface AdminFormProps<T> {
    initialData?: Partial<T>;
    onSubmit: (data: T) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export interface AdminConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
}
