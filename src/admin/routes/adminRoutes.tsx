import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { AdminLayoutNew } from '../components/AdminLayoutNew';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { useAdminAuth } from '../auth/hooks/useAdminAuth';

const Dashboard = lazy(() => import('../pages/AdminDashboardNew'));
const Analytics = lazy(() => import('../pages/AnalyticsPage'));
const ToolsManagement = lazy(() => import('../pages/ToolsManagementPage'));
const ToolFormPage = lazy(() => import('../pages/ToolFormPage'));
const CategoriesManagement = lazy(() => import('../pages/CategoriesManagementPage'));
const BlogManagement = lazy(() => import('../pages/BlogManagementPage'));
const BundlesManagement = lazy(() => import('../pages/BundlesManagementPage'));
const ReviewsManagement = lazy(() => import('../pages/ReviewsManagementPage'));
const UserManagement = lazy(() => import('../pages/UserManagement'));
const RolesManagement = lazy(() => import('../pages/RolesManagementPage'));
const ContentModeration = lazy(() => import('../pages/ContentModeration'));
const SettingsPage = lazy(() => import('../pages/SettingsPageNew'));
const AuditLog = lazy(() => import('../pages/AuditLogPage'));
const ReportsPage = lazy(() => import('../pages/ReportsPage'));
const SystemHealthPage = lazy(() => import('../pages/SystemHealthPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { admin, isAuthenticated, state } = useAdminAuth();

    // Show loading while checking authentication
    if (state && typeof state === 'object' && 'admin' in state && state.admin === null && isAuthenticated === false) {
        // Still loading
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!admin || !isAuthenticated) {
        console.log('[ProtectedRoute] No admin or not authenticated, redirecting to login');
        return <Navigate to="/admin/login" />;
    }

    console.log('[ProtectedRoute] Admin authenticated, allowing access');
    return <>{children}</>;
}

export const adminRoutes: RouteObject[] = [
    {
        path: '/admin',
        element: (
            <ProtectedRoute>
                <AdminLayoutNew />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />
            },
            // Overview
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'analytics',
                element: <Analytics />
            },
            // Content
            {
                path: 'tools',
                element: <ToolsManagement />
            },
            {
                path: 'tools/new',
                element: <ToolFormPage />
            },
            {
                path: 'tools/:toolId',
                element: <ToolFormPage />
            },
            {
                path: 'categories',
                element: <CategoriesManagement />
            },
            {
                path: 'blog',
                element: <BlogManagement />
            },
            {
                path: 'bundles',
                element: <BundlesManagement />
            },
            {
                path: 'reviews',
                element: <ReviewsManagement />
            },
            // Users
            {
                path: 'users',
                element: <UserManagement />
            },
            {
                path: 'roles',
                element: <RolesManagement />
            },
            // Moderation
            {
                path: 'moderation',
                element: <ContentModeration />
            },
            {
                path: 'reports',
                element: <ReportsPage />
            },
            // System
            {
                path: 'settings',
                element: <SettingsPage />
            },
            {
                path: 'audit',
                element: <AuditLog />
            },
            {
                path: 'health',
                element: <SystemHealthPage />
            }
        ]
    },
    {
        path: '/admin/login',
        element: <AdminLoginPage />
    }
];
