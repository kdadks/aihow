import { useCallback, useMemo } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
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
    const { user } = useAuth();

    // Check admin permissions based on user roles
    const permissions = useMemo<AdminPermissions>(() => {
        if (!user?.profile?.roles) {
            return {
                canManageUsers: false,
                canManageContent: false,
                canModerateContent: false,
                canManageSettings: false,
                canViewMetrics: false
            };
        }

        const isAdmin = user.profile.roles.some(role => role.name === 'admin');
        const isModerator = user.profile.roles.some(role => role.name === 'moderator');

        return {
            canManageUsers: isAdmin,
            canManageContent: isAdmin || isModerator,
            canModerateContent: isAdmin || isModerator,
            canManageSettings: isAdmin,
            canViewMetrics: isAdmin
        };
    }, [user?.profile?.roles]);

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
        return api.content.getAll(page, pageSize);
    }, []);

    const getContentItem = useCallback(async (id: string) => {
        return api.content.getById(id);
    }, []);

    const updateContentItem = useCallback(async (id: string, data: Partial<ContentItem>) => {
        return api.content.update(id, data);
    }, []);

    const deleteContentItem = useCallback(async (id: string) => {
        return api.content.delete(id);
    }, []);

    // Content Moderation
    const getModerationQueue = useCallback(async (
        page: number = 1,
        pageSize: number = 10,
        status: 'pending' | 'approved' | 'rejected' = 'pending'
    ) => {
        return api.moderation.getQueue(page, pageSize, status);
    }, []);

    const reviewContent = useCallback(async (id: string, status: 'approved' | 'rejected', notes?: string) => {
        if (!user?.id) throw new Error('User not authenticated');
        return api.moderation.reviewItem(id, status, notes);
    }, [user?.id]);

    // System Configuration
    const getSystemSettings = useCallback(async () => {
        return api.config.getSettings();
    }, []);

    const updateSystemSetting = useCallback(async <T extends SystemSetting['value']>(key: string, value: T) => {
        if (!user?.id) throw new Error('User not authenticated');
        return api.config.updateSetting(key, { value });
    }, [user?.id]);

    const getFeatureFlags = useCallback(async () => {
        return api.config.getFeatureFlags();
    }, []);

    const updateFeatureFlag = useCallback(async (
        name: string,
        data: Partial<FeatureFlag>
    ) => {
        return api.config.updateFeatureFlag(name, data);
    }, []);

    // Analytics
    const logActivity = useCallback(async (
        action: string,
        resourceType: string,
        resourceId?: string,
        metadata?: Record<string, any>
    ) => {
        if (!user?.id) throw new Error('User not authenticated');
        const response = {
            data: {
                id: Date.now().toString(),
                timestamp: new Date().toISOString()
            },
            status: 200
        };
        return response;
    }, [user?.id]);

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
        const activityLogs = {
            data: {
                data: [],
                count: 0
            },
            status: 200
        };
        return activityLogs;
    }, []);


    const queryMetrics = useCallback(async (query: {
        name: string;
        timeRange: 'day' | 'week' | 'month' | 'year';
        startDate?: string;
        endDate?: string;
        dimensions?: Record<string, string>;
        aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
    }) => {
        const response = {
            data: [{
                timestamp: new Date().toISOString(),
                value: 0,
                dimensions: query.dimensions
            }],
            status: 200
        };
        return response;
    }, []);

    const getDashboardMetrics = useCallback(async () => {
        const response = {
            data: {} as Record<string, unknown>,
            status: 200
        };
        return response;
    }, []);

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