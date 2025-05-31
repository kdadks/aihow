import { useCallback, useMemo } from 'react';
import { useAdminAuthContext } from '../admin/auth/context/AdminAuthContext';
import { api } from '../services/api';
import type { ContentItem, SystemSetting, FeatureFlag } from '../services/api';
import type {
    AnalyticsQueryOptions,
    AnalyticsSummary,
    TrafficMetric,
    TimeGranularity,
    DateRange
} from '../admin/types/analytics';

export interface AdminPermissions {
    canManageUsers: boolean;
    canManageContent: boolean;
    canModerateContent: boolean;
    canManageSettings: boolean;
    canViewMetrics: boolean;
}

export function useAdmin() {
    const { state } = useAdminAuthContext();
    const { admin, isAuthenticated } = state;

    // Check admin permissions based on admin user role
    const permissions = useMemo<AdminPermissions>(() => {
        if (!isAuthenticated || !admin) {
            return {
                canManageUsers: false,
                canManageContent: false,
                canModerateContent: false,
                canManageSettings: false,
                canViewMetrics: false
            };
        }

        const isSuperAdmin = admin.role === 'admin';
        const isSystemAdmin = admin.role === 'system_admin';
        const isContentAdmin = admin.role === 'content_admin';

        return {
            canManageUsers: isSuperAdmin || isSystemAdmin,
            canManageContent: isSuperAdmin || isSystemAdmin || isContentAdmin,
            canModerateContent: isSuperAdmin || isSystemAdmin || isContentAdmin,
            canManageSettings: isSuperAdmin || isSystemAdmin,
            canViewMetrics: isSuperAdmin || isSystemAdmin
        };
    }, [isAuthenticated, admin]);

    // Content Management
    const getContentItems = useCallback(async (
        page: number = 1,
        pageSize: number = 10,
        filters?: {
            status?: string;
            type?: string;
            createdBy?: string;
        }
    ) => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canManageContent) throw new Error('Insufficient permissions');
        return api.content.getAll(page, pageSize);
    }, [isAuthenticated, permissions.canManageContent]);

    const getContentItem = useCallback(async (id: string) => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canManageContent) throw new Error('Insufficient permissions');
        return api.content.getById(id);
    }, [isAuthenticated, permissions.canManageContent]);

    const updateContentItem = useCallback(async (id: string, data: Partial<ContentItem>) => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canManageContent) throw new Error('Insufficient permissions');
        return api.content.update(id, data);
    }, [isAuthenticated, permissions.canManageContent]);

    const deleteContentItem = useCallback(async (id: string) => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canManageContent) throw new Error('Insufficient permissions');
        return api.content.delete(id);
    }, [isAuthenticated, permissions.canManageContent]);

    // Content Moderation
    const getModerationQueue = useCallback(async (
        page: number = 1,
        pageSize: number = 10,
        status: 'pending' | 'approved' | 'rejected' = 'pending'
    ) => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canModerateContent) throw new Error('Insufficient permissions');
        return api.moderation.getQueue(page, pageSize, status);
    }, [isAuthenticated, permissions.canModerateContent]);

    const reviewContent = useCallback(async (id: string, status: 'approved' | 'rejected', notes?: string) => {
        if (!isAuthenticated || !admin?.id) throw new Error('Not authenticated');
        if (!permissions.canModerateContent) throw new Error('Insufficient permissions');
        return api.moderation.reviewItem(id, status, notes);
    }, [isAuthenticated, admin?.id, permissions.canModerateContent]);

    // System Configuration
    const getSystemSettings = useCallback(async () => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canManageSettings) throw new Error('Insufficient permissions');
        return api.config.getSettings();
    }, [isAuthenticated, permissions.canManageSettings]);

    const updateSystemSetting = useCallback(async <T extends SystemSetting['value']>(key: string, value: T) => {
        if (!isAuthenticated || !admin?.id) throw new Error('Not authenticated');
        if (!permissions.canManageSettings) throw new Error('Insufficient permissions');
        return api.config.updateSetting(key, { value });
    }, [isAuthenticated, admin?.id, permissions.canManageSettings]);

    const getFeatureFlags = useCallback(async () => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canManageSettings) throw new Error('Insufficient permissions');
        return api.config.getFeatureFlags();
    }, [isAuthenticated, permissions.canManageSettings]);

    const updateFeatureFlag = useCallback(async (
        name: string,
        data: Partial<FeatureFlag>
    ) => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canManageSettings) throw new Error('Insufficient permissions');
        return api.config.updateFeatureFlag(name, data);
    }, [isAuthenticated, permissions.canManageSettings]);

    // Analytics
    const logActivity = useCallback(async (
        action: string,
        resourceType: string,
        resourceId?: string,
        metadata?: Record<string, any>
    ) => {
        if (!isAuthenticated || !admin?.id) throw new Error('Not authenticated');
        const response = {
            data: {
                id: Date.now().toString(),
                timestamp: new Date().toISOString()
            },
            status: 200
        };
        return response;
    }, [isAuthenticated, admin?.id]);

    const getActivityLogs = useCallback(async (
        page: number = 1,
        pageSize: number = 50,
        filters?: {
            userId?: string;
            action?: string;
            resourceType?: string;
            startDate?: string;
            endDate?: string;
        }
    ) => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canViewMetrics) throw new Error('Insufficient permissions');
        const activityLogs = {
            data: {
                data: [],
                count: 0
            },
            status: 200
        };
        return activityLogs;
    }, [isAuthenticated, permissions.canViewMetrics]);

    const queryMetrics = useCallback(async (query: {
        name: string;
        timeRange: 'day' | 'week' | 'month' | 'year';
        startDate?: string;
        endDate?: string;
        dimensions?: Record<string, string>;
        aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
    }) => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canViewMetrics) throw new Error('Insufficient permissions');
        const response = {
            data: [{
                timestamp: new Date().toISOString(),
                value: 0,
                dimensions: query.dimensions
            }],
            status: 200
        };
        return response;
    }, [isAuthenticated, permissions.canViewMetrics]);

    const getDashboardMetrics = useCallback(async () => {
        if (!isAuthenticated) throw new Error('Not authenticated');
        if (!permissions.canViewMetrics) throw new Error('Insufficient permissions');
        const response = {
            data: {} as Record<string, unknown>,
            status: 200
        };
        return response;
    }, [isAuthenticated, permissions.canViewMetrics]);

    return {
        // Permissions
        permissions,

        // Content Management
        getContentItems,
        getContentItem,
        updateContentItem,
        deleteContentItem,

        // Content Moderation
        getModerationQueue,
        reviewContent,

        // System Configuration
        getSystemSettings,
        updateSystemSetting,
        getFeatureFlags,
        updateFeatureFlag,

        // Analytics
        logActivity,
        getActivityLogs,
        queryMetrics,
        getDashboardMetrics
    };
}