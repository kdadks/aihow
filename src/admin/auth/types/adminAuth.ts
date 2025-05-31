import { Database } from '../../../types/database';

interface AdminAuthConfig {
  loginEndpoint: string;
  sessionDuration: number;
  maxAttempts: number;
  cooldownPeriod: number;
}

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  permissions: string[];
  sessionInfo: AdminSessionInfo;
}

interface AdminUser extends BaseUser {
  role: AdminRole;
  permissions: string[];
  lastLogin: Date;
  securityLevel: number;
}

interface AdminSessionInfo {
  expiresAt: Date;
  lastActive: Date;
}

interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

type AdminRole = 'admin' | 'system_admin' | 'content_admin';

type ProfileWithRoles = Database['public']['Tables']['profiles']['Row'] & {
  roles: Array<{
    role: {
      name: string;
      permissions: Array<{
        permission: {
          name: string;
        };
      }>;
    };
  }>;
};

type RoleData = {
  roles: {
    name: string;
  };
};

export type {
  AdminAuthConfig,
  AdminAuthState,
  AdminUser,
  AdminSessionInfo,
  BaseUser,
  AdminRole,
  ProfileWithRoles,
  RoleData
};