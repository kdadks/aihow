export interface AdminAuditEvent {
  adminId: string;
  action: string;
  resource: string;
  changes: Record<string, any>;
  metadata: {
    ip: string;
    userAgent: string;
    timestamp: Date;
  };
}

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'grant_permission'
  | 'revoke_permission'
  | 'change_role';

export interface AuditLogEntry extends AdminAuditEvent {
  id: string;
  correlationId?: string;
  status: 'success' | 'failure';
  error?: {
    message: string;
    code: string;
  };
}