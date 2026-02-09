import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { AdminLayoutNew } from '../components/AdminLayoutNew';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import PlaceholderPage from '../pages/PlaceholderPage';
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
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AuditLog = lazy(() => import('../pages/AuditLog'));

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
                element: <PlaceholderPage
                    title="Reports & Flags"
                    description="Review reported content and user flags"
                    color="amber"
                    icon={
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    }
                />
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
                element: <PlaceholderPage
                    title="System Health"
                    description="Monitor system performance and uptime"
                    color="green"
                    icon={
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                    }
                />
            }
        ]
    },
    {
        path: '/admin/login',
        element: <AdminLoginPage />
    }
];
