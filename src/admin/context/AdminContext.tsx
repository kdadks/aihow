import { createContext, useContext, useEffect, useState } from 'react';
import { settingsService } from '../services/settingsService';
import { userManagementService } from '../services/userManagement';
import { auditService } from '../services/auditService';
import { moderationService } from '../services/moderationService';
import { useAuth } from '../../auth/hooks/useAuth';
import type { 
    SystemSetting,
    FeatureFlag,
    AdminResponse,
    AdminUser,
    Role,
    RoleAssignment,
    AuditLog,
    AuditLogFilters,
    UserUpdateRequest
} from '../types/admin';
import type { ContentItem, ModerationFilters } from '../types/moderation';
import type { AdminPermissions } from '../types/permissions';

interface AdminContextValue {
    // Settings Management
    getSettings(): Promise<AdminResponse<SystemSetting[]>>;
    updateSetting(key: string, value: any): Promise<AdminResponse<SystemSetting>>;
    getFeatureFlags(): Promise<AdminResponse<FeatureFlag[]>>;
    updateFeatureFlag(id: string, data: Partial<FeatureFlag>): Promise<AdminResponse<FeatureFlag>>;
    
    // User Management
    getUsers(page?: number, pageSize?: number): Promise<AdminResponse<AdminUser[]>>;
    getUserById(id: string): Promise<AdminResponse<AdminUser>>;
    updateUser(id: string, data: UserUpdateRequest): Promise<AdminResponse<AdminUser>>;
    getRoles(): Promise<AdminResponse<Role[]>>;
    assignRole(userId: string, roleId: string): Promise<AdminResponse<RoleAssignment>>;
    removeRole(userId: string, roleId: string): Promise<AdminResponse<void>>;

    // Audit Management
    getLogs(filters: AuditLogFilters, page?: number, pageSize?: number): Promise<AdminResponse<{ data: AuditLog[]; count: number }>>;
    logActivity(action: string, resourceType: string, resourceId?: string, metadata?: Record<string, unknown>): Promise<AdminResponse<AuditLog>>;
    exportLogs(filters: AuditLogFilters): Promise<AdminResponse<Blob>>;
    getLogsByResourceId(resourceType: string, resourceId: string): Promise<AdminResponse<AuditLog[]>>;

    // Content Moderation
    getContent(
        filters: ModerationFilters,
        page?: number,
        pageSize?: number
    ): Promise<AdminResponse<{ data: ContentItem[]; count: number }>>;
    updateContentStatus(
        id: string,
        status: ContentItem['status'],
        reason?: string
    ): Promise<AdminResponse<ContentItem>>;
    getContentStats(): Promise<AdminResponse<{
        pending: number;
        approved: number;
        rejected: number;
    }>>;
    addToModerationQueue(
        type: string,
        content: Record<string, any>,
        userId: string
    ): Promise<AdminResponse<ContentItem>>;

    // User permissions (from current user's role)
    permissions: AdminPermissions;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [permissions, setPermissions] = useState<AdminPermissions>({
        canManageUsers: false,
        canManageContent: false,
        canModerateContent: false,
        canManageSettings: false,
        canViewMetrics: false
    });

    // Fetch user permissions on mount and when user changes
    useEffect(() => {
        const fetchUserPermissions = async () => {
            if (!user) {
                setPermissions({
                    canManageUsers: false,
                    canManageContent: false,
                    canModerateContent: false,
                    canManageSettings: false,
                    canViewMetrics: false
                });
                return;
            }

            try {
                const result = await userManagementService.getUserById(user.id);
                if (result.data?.role?.permissions) {
                    setPermissions(result.data.role.permissions);
                }
            } catch (error) {
                console.error('Failed to fetch user permissions:', error);
            }
        };

        fetchUserPermissions();
    }, [user]);

    const value: AdminContextValue = {
        // Settings Management
        getSettings: settingsService.getSettings.bind(settingsService),
        updateSetting: settingsService.updateSetting.bind(settingsService),
        getFeatureFlags: settingsService.getFeatureFlags.bind(settingsService),
        updateFeatureFlag: settingsService.updateFeatureFlag.bind(settingsService),

        // User Management
        getUsers: userManagementService.getUsers.bind(userManagementService),
        getUserById: userManagementService.getUserById.bind(userManagementService),
        updateUser: userManagementService.updateUser.bind(userManagementService),
        getRoles: userManagementService.getRoles.bind(userManagementService),
        assignRole: userManagementService.assignRole.bind(userManagementService),
        removeRole: userManagementService.removeRole.bind(userManagementService),

        // Audit Management
        getLogs: auditService.getLogs.bind(auditService),
        logActivity: auditService.logActivity.bind(auditService),
        exportLogs: auditService.exportLogs.bind(auditService),
        getLogsByResourceId: auditService.getLogsByResourceId.bind(auditService),

        // Content Moderation
        getContent: moderationService.getContent.bind(moderationService),
        updateContentStatus: moderationService.updateContentStatus.bind(moderationService),
        getContentStats: moderationService.getContentStats.bind(moderationService),
        addToModerationQueue: moderationService.addToModerationQueue.bind(moderationService),

        // Permissions
        permissions
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
}

// Main admin context hook
export function useAdminContext() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminContext must be used within an AdminProvider');
    }
    return context;
}

// Specialized hooks for different admin functionalities
export function useConfigAdmin() {
    const context = useAdminContext();
    return {
        getSettings: context.getSettings,
        updateSetting: context.updateSetting,
        getFeatureFlags: context.getFeatureFlags,
        updateFeatureFlag: context.updateFeatureFlag
    };
}

export function useUserAdmin() {
    const context = useAdminContext();
    return {
        getUsers: context.getUsers,
        getUserById: context.getUserById,
        updateUser: context.updateUser,
        getRoles: context.getRoles,
        assignRole: context.assignRole,
        removeRole: context.removeRole,
        permissions: context.permissions
    };
}

export function useAuditAdmin() {
    const context = useAdminContext();
    return {
        getLogs: context.getLogs,
        logActivity: context.logActivity,
        exportLogs: context.exportLogs,
        getLogsByResourceId: context.getLogsByResourceId
    };
}

export function useModerationAdmin() {
    const context = useAdminContext();
    return {
        getContent: context.getContent,
        updateContentStatus: context.updateContentStatus,
        getContentStats: context.getContentStats,
        addToModerationQueue: context.addToModerationQueue,
        permissions: {
            canModerate: context.permissions.canModerateContent
        }
    };
}
