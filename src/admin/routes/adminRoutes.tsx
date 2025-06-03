import { Navigate, RouteObject } from 'react-router-dom';
import { AdminAuthGuard } from '../auth/components/AdminAuthGuard';
import AdminDashboard from '../pages/AdminDashboard';
import { AdminLayout } from '../components/AdminLayout';
import NotFoundPage from '../../pages/NotFoundPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminAuthProvider } from '../auth/context/AdminAuthContext';

// Custom route property interface
interface AdminRouteProps {
  public?: boolean;
}

// Extended route type that includes our custom properties
type AdminRouteObject = RouteObject & AdminRouteProps;

// Admin route configuration
export const adminRoutes: AdminRouteObject[] = [
  {
    path: '/admin/login',
    element: (
      <AdminAuthProvider>
        <AdminLoginPage />
      </AdminAuthProvider>
    ),
    public: true
  },
  {
    path: '/admin',
    element: (
      <AdminAuthProvider>
        <AdminAuthGuard>
          <AdminLayout />
        </AdminAuthGuard>
      </AdminAuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      { 
        path: 'dashboard', 
        element: <AdminDashboard />
      },
      { 
        path: 'settings', 
        element: <Navigate to="/admin/dashboard" replace /> // Temporarily redirect until Settings page is implemented
      },
      { 
        path: 'audit', 
        element: <Navigate to="/admin/dashboard" replace /> // Temporarily redirect until Audit page is implemented
      },
      {
        // Catch-all route for 404 handling
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
];
