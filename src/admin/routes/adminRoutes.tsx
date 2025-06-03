import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { useAuth } from '../../auth/hooks/useAuth';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const UserManagement = lazy(() => import('../pages/UserManagement'));
const ContentModeration = lazy(() => import('../pages/ContentModeration'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AuditLog = lazy(() => import('../pages/AuditLog'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" />;
    }

    return <>{children}</>;
}

export const adminRoutes: RouteObject[] = [
    {
        path: '/admin',
        element: (
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/admin/dashboard" replace />
            },
            {
                path: 'dashboard',
                element: <Dashboard />
            },
            {
                path: 'users',
                element: <UserManagement />
            },
            {
                path: 'moderation',
                element: <ContentModeration />
            },
            {
                path: 'settings',
                element: <SettingsPage />
            },
            {
                path: 'audit',
                element: <AuditLog />
            }
        ]
    },
    {
        path: '/admin/login',
        element: <AdminLoginPage />
    }
];
