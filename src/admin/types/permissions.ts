export type AdminPermission = 
    | 'canManageUsers'
    | 'canManageContent'
    | 'canModerateContent'
    | 'canManageSettings'
    | 'canViewMetrics';

export type AdminPermissions = Record<AdminPermission, boolean>;

export interface PermissionConfig {
    name: string;
    description: string;
    permission: AdminPermission;
}

export const ADMIN_PERMISSIONS: PermissionConfig[] = [
    {
        name: 'Manage Users',
        description: 'Create, update, and manage user accounts and roles',
        permission: 'canManageUsers'
    },
    {
        name: 'Manage Content',
        description: 'Create and manage site content and pages',
        permission: 'canManageContent'
    },
    {
        name: 'Moderate Content',
        description: 'Review and moderate user-generated content',
        permission: 'canModerateContent'
    },
    {
        name: 'Manage Settings',
        description: 'Configure system settings and feature flags',
        permission: 'canManageSettings'
    },
    {
        name: 'View Metrics',
        description: 'Access system metrics, logs, and analytics',
        permission: 'canViewMetrics'
    }
];
