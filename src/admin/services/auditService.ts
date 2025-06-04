import { supabase } from '../../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { 
    AdminResponse,
    AuditLog,
    AuditLogFilters
} from '../types/admin';

class AuditService {
    async getLogs(
        filters: AuditLogFilters,
        page = 1,
        pageSize = 50
    ): Promise<AdminResponse<{ data: AuditLog[]; count: number }>> {
        try {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            let query = supabase
                .from('audit_logs')
                .select('*', { count: 'exact' });

            // Apply filters
            if (filters.userId) {
                query = query.eq('user_id', filters.userId);
            }
            if (filters.action) {
                query = query.eq('action', filters.action);
            }
            if (filters.resourceType) {
                query = query.eq('resource_type', filters.resourceType);
            }
            if (filters.startDate) {
                query = query.gte('created_at', filters.startDate);
            }
            if (filters.endDate) {
                query = query.lte('created_at', filters.endDate);
            }

            // Add pagination and ordering
            query = query
                .order('created_at', { ascending: false })
                .range(from, to);

            const { data: logs, error, count } = await query;

            if (error) {
                throw error;
            }

            if (!logs) {
                return { data: { data: [], count: 0 }, error: null };
            }

            const typedLogs: AuditLog[] = logs.map(log => ({
                id: log.id,
                user_id: log.user_id,
                action: log.action,
                resource_type: log.resource_type,
                resource_id: log.resource_id,
                metadata: log.metadata,
                ip_address: log.ip_address,
                user_agent: log.user_agent,
                created_at: log.created_at
            }));

            return { 
                data: {
                    data: typedLogs,
                    count: count || 0
                },
                error: null
            };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async logActivity(
        action: string,
        resourceType: string,
        resourceId?: string,
        metadata?: Record<string, unknown>
    ): Promise<AdminResponse<AuditLog>> {
        try {
            const user = await supabase.auth.getUser();
            if (!user.data.user) {
                throw new Error('No authenticated user found');
            }

            const { data: log, error } = await supabase
                .from('audit_logs')
                .insert({
                    user_id: user.data.user.id,
                    action,
                    resource_type: resourceType,
                    resource_id: resourceId,
                    metadata,
                    // Get client IP and user agent if available
                    ip_address: null, // This should be set by RLS policy or middleware
                    user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            if (!log) {
                throw new Error('Failed to create audit log');
            }

            const typedLog: AuditLog = {
                id: log.id,
                user_id: log.user_id,
                action: log.action,
                resource_type: log.resource_type,
                resource_id: log.resource_id,
                metadata: log.metadata,
                ip_address: log.ip_address,
                user_agent: log.user_agent,
                created_at: log.created_at
            };

            return { data: typedLog, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async exportLogs(filters: AuditLogFilters): Promise<AdminResponse<Blob>> {
        try {
            let query = supabase
                .from('audit_logs')
                .select('*');

            // Apply filters
            if (filters.userId) {
                query = query.eq('user_id', filters.userId);
            }
            if (filters.action) {
                query = query.eq('action', filters.action);
            }
            if (filters.resourceType) {
                query = query.eq('resource_type', filters.resourceType);
            }
            if (filters.startDate) {
                query = query.gte('created_at', filters.startDate);
            }
            if (filters.endDate) {
                query = query.lte('created_at', filters.endDate);
            }

            // Order by created_at
            query = query.order('created_at', { ascending: false });

            const { data: logs, error } = await query;

            if (error) {
                throw error;
            }

            if (!logs) {
                throw new Error('No logs found');
            }

            // Convert logs to CSV format
            const headers = ['ID', 'User ID', 'Action', 'Resource Type', 'Resource ID', 'Metadata', 'IP Address', 'User Agent', 'Created At'];
            const rows = logs.map(log => [
                log.id,
                log.user_id,
                log.action,
                log.resource_type,
                log.resource_id,
                JSON.stringify(log.metadata),
                log.ip_address,
                log.user_agent,
                log.created_at
            ]);

            const csv = [
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell || ''}"`).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            return { data: blob, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getLogsByResourceId(resourceType: string, resourceId: string): Promise<AdminResponse<AuditLog[]>> {
        try {
            const { data: logs, error } = await supabase
                .from('audit_logs')
                .select('*')
                .eq('resource_type', resourceType)
                .eq('resource_id', resourceId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            if (!logs) {
                return { data: [], error: null };
            }

            const typedLogs: AuditLog[] = logs.map(log => ({
                id: log.id,
                user_id: log.user_id,
                action: log.action,
                resource_type: log.resource_type,
                resource_id: log.resource_id,
                metadata: log.metadata,
                ip_address: log.ip_address,
                user_agent: log.user_agent,
                created_at: log.created_at
            }));

            return { data: typedLogs, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }
}

export const auditService = new AuditService();
