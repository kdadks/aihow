import { AdminRole, hasPermission } from '../roles/adminRoles';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | '*';
  conditions?: Record<string, any>;
}

type PermissionStore = Map<string, Set<Permission>>;

export class AdminPermissionManager {
  private permissions: PermissionStore = new Map();

  async checkPermission(adminId: string, permission: Permission): Promise<boolean> {
    const adminPermissions = this.permissions.get(adminId);
    
    if (!adminPermissions) {
      return false;
    }

    // Check for exact permission match
    const hasExactMatch = Array.from(adminPermissions).some(p => 
      p.resource === permission.resource &&
      p.action === permission.action &&
      this.checkConditions(p.conditions, permission.conditions)
    );

    if (hasExactMatch) {
      return true;
    }

    // Check for wildcard permissions
    return Array.from(adminPermissions).some(p =>
      p.resource === '*' &&
      (p.action === permission.action || p.action === '*')
    );
  }

  async grantPermission(adminId: string, permission: Permission): Promise<void> {
    if (!this.permissions.has(adminId)) {
      this.permissions.set(adminId, new Set());
    }

    const adminPermissions = this.permissions.get(adminId)!;
    adminPermissions.add(permission);
  }

  async revokePermission(adminId: string, permission: Permission): Promise<void> {
    const adminPermissions = this.permissions.get(adminId);
    if (!adminPermissions) {
      return;
    }

    adminPermissions.forEach(p => {
      if (p.resource === permission.resource &&
          p.action === permission.action &&
          this.checkConditions(p.conditions, permission.conditions)) {
        adminPermissions.delete(p);
      }
    });

    if (adminPermissions.size === 0) {
      this.permissions.delete(adminId);
    }
  }

  private checkConditions(
    existing?: Record<string, any>,
    requested?: Record<string, any>
  ): boolean {
    if (!existing && !requested) {
      return true;
    }
    if (!existing || !requested) {
      return false;
    }

    return Object.entries(requested).every(([key, value]) =>
      existing[key] === value || existing[key] === '*'
    );
  }
}