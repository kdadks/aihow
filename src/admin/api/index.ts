export const ADMIN_API = {
  auth: {
    login: '/api/admin/auth/login',
    mfa: '/api/admin/auth/mfa',
    validate: '/api/admin/auth/validate',
    refresh: '/api/admin/auth/refresh'
  },
  audit: {
    logs: '/api/admin/audit/logs',
    report: '/api/admin/audit/report'
  },
  settings: {
    get: '/api/admin/settings',
    update: '/api/admin/settings/update'
  }
} as const;

// Type for the admin API endpoints
export type AdminApiEndpoints = typeof ADMIN_API;