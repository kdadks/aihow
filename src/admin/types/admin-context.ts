import type {
    ContentItem,
    SystemSetting,
    FeatureFlag,
    APIResponse,
    APIErrorResponse
} from '../../services/api';
import type { AdminPermissions } from '../../hooks/useAdmin';

// Extended API Response type with error handling
export interface AdminAPIResponse<T> extends APIResponse<T> {
    error?: APIErrorResponse;
}

// Content Service Types
export interface ContentService {
    getContentItems: (page?: number, pageSize?: number, filters?: {
        status?: string;
        type?: string;
        createdBy?: string;
    }) => Promise<AdminAPIResponse<{ data: ContentItem[]; count: number }>>;
    getContentItem: (id: string) => Promise<AdminAPIResponse<ContentItem>>;
    updateContentItem: (id: string, data: Partial<ContentItem>) => Promise<AdminAPIResponse<ContentItem>>;
    deleteContentItem: (id: string) => Promise<AdminAPIResponse<ContentItem>>;
}

// Moderation Service Types
export interface ModerationService {
    getModerationQueue: (
        page?: number,
        pageSize?: number,
        status?: 'pending' | 'approved' | 'rejected'
    ) => Promise<AdminAPIResponse<{ data: ContentItem[]; count: number }>>;
    reviewContent: (
        id: string,
        status: 'approved' | 'rejected',
        notes?: string
    ) => Promise<AdminAPIResponse<ContentItem>>;
}

// Config Service Types
export interface ConfigService {
    getSystemSettings: () => Promise<AdminAPIResponse<SystemSetting[]>>;
    updateSystemSetting: <T extends SystemSetting['value']>(key: string, value: T) => Promise<AdminAPIResponse<SystemSetting>>;
    getFeatureFlags: () => Promise<AdminAPIResponse<FeatureFlag[]>>;
    updateFeatureFlag: (name: string, data: Partial<FeatureFlag>) => Promise<AdminAPIResponse<FeatureFlag>>;
}

// Analytics Service Types
export interface AnalyticsService {
    logActivity: (
        action: string,
        resourceType: string,
        resourceId?: string,
        metadata?: Record<string, unknown>
    ) => Promise<AdminAPIResponse<{ id: string; timestamp: string }>>;
    getActivityLogs: (
        page?: number,
        pageSize?: number,
        filters?: {
            userId?: string;
            action?: string;
            resourceType?: string;
            startDate?: string;
            endDate?: string;
        }
    ) => Promise<AdminAPIResponse<{ data: Array<{ 
        id: string;
        action: string;
        resourceType: string;
        resourceId?: string;
        timestamp: string;
        metadata?: Record<string, unknown>;
    }>; count: number }>>;
    queryMetrics: (query: {
        name: string;
        timeRange: 'day' | 'week' | 'month' | 'year';
        startDate?: string;
        endDate?: string;
        dimensions?: Record<string, string>;
        aggregation?: 'sum' | 'avg' | 'min' | 'max' | 'count';
    }) => Promise<AdminAPIResponse<Array<{
        timestamp: string;
        value: number;
        dimensions?: Record<string, string>;
    }>>>;
    getDashboardMetrics: () => Promise<AdminAPIResponse<Record<string, unknown>>>;
}

// Admin Context Value Type
export interface AdminContextValue {
    permissions: AdminPermissions;
    isLoading: boolean;
    contentService: ContentService;
    moderationService: ModerationService;
    configService: ConfigService;
    analyticsService: AnalyticsService;
}