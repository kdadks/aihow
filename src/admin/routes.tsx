import React from 'react';
import { RouteObject } from 'react-router-dom';
import { AdminLayout, withAdminProtection } from './components/AdminLayout';

// Lazy load admin pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ContentManagement = React.lazy(() => import('./pages/ContentManagement'));
const ContentModeration = React.lazy(() => import('./pages/ContentModeration'));
const SystemSettings = React.lazy(() => import('./pages/SystemSettings'));
const Analytics = React.lazy(() => import('./pages/Analytics'));

// Wrap components with role-based protection and loading boundaries
const ProtectedDashboard = withAdminProtection(Dashboard);
const ProtectedContentManagement = withAdminProtection(ContentManagement, 'canManageContent');
const ProtectedContentModeration = withAdminProtection(ContentModeration, 'canModerateContent');
const ProtectedSystemSettings = withAdminProtection(SystemSettings, 'canManageSettings');
const ProtectedAnalytics = withAdminProtection(Analytics, 'canViewMetrics');

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