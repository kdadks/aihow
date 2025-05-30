import { createContext, useContext, ReactNode } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import type {
    AdminContextValue,
    ContentService,
    ModerationService,
    ConfigService,
    AnalyticsService
} from '../types/admin-context';

const AdminContext = createContext<AdminContextValue | null>(null);

interface AdminProviderProps {
    children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps): JSX.Element {
    const admin = useAdmin();
    const { permissions } = admin;

    const value: AdminContextValue = {
        permissions,
        isLoading: false,
        contentService: {
            getContentItems: admin.getContentItems,
            getContentItem: admin.getContentItem,
            updateContentItem: admin.updateContentItem,
            deleteContentItem: admin.deleteContentItem
        },
        moderationService: {
            getModerationQueue: admin.getModerationQueue,
            reviewContent: admin.reviewContent
        },
        configService: {
            getSystemSettings: admin.getSystemSettings,
            updateSystemSetting: admin.updateSystemSetting,
            getFeatureFlags: admin.getFeatureFlags,
            updateFeatureFlag: admin.updateFeatureFlag
        },
        analyticsService: {
            logActivity: admin.logActivity,
            getActivityLogs: admin.getActivityLogs,
            queryMetrics: admin.queryMetrics,
            getDashboardMetrics: admin.getDashboardMetrics
        }
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext(): AdminContextValue {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminContext must be used within an AdminProvider');
    }
    return context;
}

export function useContentAdmin(): ContentService {
    const { permissions, contentService } = useAdminContext();
    if (!permissions.canManageContent) {
        throw new Error(
            'Access Denied: Current user does not have content management permissions. ' +
            'Please contact your administrator if you believe this is a mistake.'
        );
    }
    return contentService;
}

export function useModerationAdmin(): ModerationService {
    const { permissions, moderationService } = useAdminContext();
    if (!permissions.canModerateContent) {
        throw new Error(
            'Access Denied: Current user does not have content moderation permissions. ' +
            'This action requires elevated privileges to review and moderate content.'
        );
    }
    return moderationService;
}

export function useConfigAdmin(): ConfigService {
    const { permissions, configService } = useAdminContext();
    if (!permissions.canManageSettings) {
        throw new Error(
            'Access Denied: Current user does not have system configuration permissions. ' +
            'System settings can only be modified by administrators with proper authorization.'
        );
    }
    return configService;
}

export function useAnalyticsAdmin(): AnalyticsService {
    const { permissions, analyticsService } = useAdminContext();
    if (!permissions.canViewMetrics) {
        throw new Error(
            'Access Denied: Current user does not have analytics access permissions. ' +
            'Analytics data is restricted to authorized personnel only.'
        );
    }
    return analyticsService;
}