import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const WriteReviewPage = lazy(() => import('../pages/WriteReviewPage'));
const WriteArticlePage = lazy(() => import('../pages/WriteArticlePage'));
const MyContentPage = lazy(() => import('../pages/MyContentPage'));
const UserProfilePage = lazy(() => import('../pages/UserProfilePage'));
const UserSettingsPage = lazy(() => import('../pages/UserSettingsPage'));

export const protectedRoutes: RouteObject[] = [
    {
        path: '/dashboard',
        element: <ProtectedRoute><UserDashboard /></ProtectedRoute>
    },
    {
        path: '/write-review',
        element: <ProtectedRoute><WriteReviewPage /></ProtectedRoute>
    },
    {
        path: '/write-article',
        element: <ProtectedRoute><WriteArticlePage /></ProtectedRoute>
    },
    {
        path: '/my-content',
        element: <ProtectedRoute><MyContentPage /></ProtectedRoute>
    },
    {
        path: '/profile',
        element: <ProtectedRoute><UserProfilePage /></ProtectedRoute>
    },
    {
        path: '/settings',
        element: <ProtectedRoute><UserSettingsPage /></ProtectedRoute>
    }
];
