import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { withAuth } from '../auth/components/withAuth';

// Lazy load admin pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ContentManagement = React.lazy(() => import('./pages/ContentManagement'));
const ContentModeration = React.lazy(() => import('./pages/ContentModeration'));
const SystemSettings = React.lazy(() => import('./pages/SystemSettings'));
const Analytics = React.lazy(() => import('./pages/Analytics'));

// Wrap components with role-based protection and loading boundaries
const ProtectedDashboard = withAuth(Dashboard, { requiredRole: 'admin' });
const ProtectedContentManagement = withAuth(ContentManagement, { requiredRole: 'canManageContent' });
const ProtectedContentModeration = withAuth(ContentModeration, { requiredRole: 'canModerateContent' });
const ProtectedSystemSettings = withAuth(SystemSettings, { requiredRole: 'canManageSettings' });
const ProtectedAnalytics = withAuth(Analytics, { requiredRole: 'canViewMetrics' });

// Add loading fallback for lazy-loaded components
const withSuspense = (Component: React.ComponentType) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      }
    >
      <Component />
    </React.Suspense>
  );
};

// Define admin routes with layout wrapper
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: withSuspense(ProtectedDashboard)
      },
      {
        path: 'content',
        element: withSuspense(ProtectedContentManagement),
        children: [
          {
            path: ':id',
            element: withSuspense(ProtectedContentManagement)
          }
        ]
      },
      {
        path: 'moderation',
        element: withSuspense(ProtectedContentModeration),
        children: [
          {
            path: ':id',
            element: withSuspense(ProtectedContentModeration)
          }
        ]
      },
      {
        path: 'settings',
        element: withSuspense(ProtectedSystemSettings)
      },
      {
        path: 'analytics',
        element: withSuspense(ProtectedAnalytics),
        children: [
          {
            path: ':metric',
            element: withSuspense(ProtectedAnalytics)
          }
        ]
      }
    ]
  }
];