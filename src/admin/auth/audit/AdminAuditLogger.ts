import { v4 as uuidv4 } from 'uuid';
import { AdminAuditEvent, AuditLogEntry, AuditAction } from './types';

export class AdminAuditLogger {
  private static instance: AdminAuditLogger;
  private auditLogs: AuditLogEntry[] = [];

  private constructor() {}

  static getInstance(): AdminAuditLogger {
    if (!AdminAuditLogger.instance) {
      AdminAuditLogger.instance = new AdminAuditLogger();
    }
    return AdminAuditLogger.instance;
  }

  async logEvent(event: AdminAuditEvent, status: 'success' | 'failure' = 'success', error?: Error): Promise<void> {
    try {
      const logEntry: AuditLogEntry = {
        ...event,
        id: uuidv4(),
        correlationId: this.getCurrentCorrelationId(),
        status,
        ...(error && {
          error: {
            message: error.message,
            code: error.name
          }
        })
      };

      this.auditLogs.push(logEntry);
      await this.persistAuditLog(logEntry);
    } catch (err) {
      console.error('Failed to log audit event:', err);
      throw new Error('Audit logging failed');
    }
  }

  async getAuditLogs(
    filters?: {
      adminId?: string;
      action?: AuditAction;
      resource?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<AuditLogEntry[]> {
    return this.auditLogs.filter(log => {
      if (filters?.adminId && log.adminId !== filters.adminId) return false;
      if (filters?.action && log.action !== filters.action) return false;
      if (filters?.resource && log.resource !== filters.resource) return false;
      if (filters?.startDate && log.metadata.timestamp < filters.startDate) return false;
      if (filters?.endDate && log.metadata.timestamp > filters.endDate) return false;
      return true;
    });
  }

  async clearAuditLogs(): Promise<void> {
    this.auditLogs = [];
  }

  private getCurrentCorrelationId(): string {
    // In a real implementation, this would get the correlation ID from the current request context
    return uuidv4();
  }

  private async persistAuditLog(logEntry: AuditLogEntry): Promise<void> {
    // In a real implementation, this would persist to a database or external logging service
    // For now, we'll just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Audit Log:', JSON.stringify(logEntry, null, 2));
    }
  }

  // Helper method to create standardized audit events
  static createAuditEvent(
    adminId: string,
    action: AuditAction,
    resource: string,
    changes: Record<string, any>,
    request: Request
  ): AdminAuditEvent {
    return {
      adminId,
      action,
      resource,
      changes,
      metadata: {
        ip: AdminAuditLogger.extractIpAddress(request),
        userAgent: request.headers.get('user-agent') || 'unknown',
        timestamp: new Date()
      }
    };
  }

  private static extractIpAddress(request: Request): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    return 'unknown';
  }
}