type AdminPermission = 'manage_admins' | 'manage_systems' | 'manage_content' | '*';
type AdminRoute = '/admin/system/*' | '/admin/content/*' | '*';

interface AdminRoleConfig {
  level: number;
  permissions: AdminPermission[];
  allowedRoutes: AdminRoute[];
}

export const ADMIN_ROLES: Record<string, AdminRoleConfig> = {
  SUPER_ADMIN: {
    level: 100,
    permissions: ['*'],
    allowedRoutes: ['*']
  },
  SYSTEM_ADMIN: {
    level: 90,
    permissions: ['manage_admins', 'manage_systems'],
    allowedRoutes: ['/admin/system/*']
  },
  CONTENT_ADMIN: {
    level: 80,
    permissions: ['manage_content'],
    allowedRoutes: ['/admin/content/*']
  }
} as const;

export type AdminRole = keyof typeof ADMIN_ROLES;

export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  const roleConfig = ADMIN_ROLES[role];
  return roleConfig.permissions.includes('*') || roleConfig.permissions.includes(permission);
}

export function canAccessRoute(role: AdminRole, route: string): boolean {
  const roleConfig = ADMIN_ROLES[role];
  if (roleConfig.allowedRoutes.includes('*')) return true;
  
  return roleConfig.allowedRoutes.some(allowedRoute => {
    const pattern = allowedRoute.replace('*', '.*');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(route);
  });
}