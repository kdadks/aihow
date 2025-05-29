import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminGuard } from '../../auth/hooks/useAuthGuard';
import { useAuth } from '../../auth/context/AuthContext';
import { Loading } from '../../components/ui/Loading';
import { AdminProvider } from '../context/AdminContext';
import { Breadcrumb } from './Breadcrumb';
import { AdminNavigation } from './AdminNavigation';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthorized, isLoading, error } = useAdminGuard({
    redirectTo: '/login',
    onUnauthorized: () => {
      // Optional: Log unauthorized access attempts
      console.warn('Unauthorized access attempt to admin portal');
    }
  });

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  // Redirect unauthorized users
  if (!isAuthorized) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ 
          error: error || 'You must be an admin to access this area',
          returnTo: window.location.pathname
        }} 
      />
    );
  }

  // Render admin portal layout
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-100">
        {/* Admin Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 mr-8">
                  Admin Portal
                </h1>
                <AdminNavigation />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          <div className="bg-white shadow-sm rounded-lg p-6">
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <Loading />
                </div>
              }
            >
              {children || <Outlet />}
            </React.Suspense>
          </div>
        </main>

        {/* Admin Footer */}
        <footer className="bg-white shadow-sm mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center text-sm text-gray-500">
              Admin Portal • {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>
    </AdminProvider>
  );
}

// HOC for protecting admin routes with permissions
export function withAdminProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  permission?: string
) {
  return function WithAdminProtection(props: P) {
    const { isAuthorized, isLoading, error } = useAdminGuard({
      redirectTo: '/login',
      onUnauthorized: () => {
        console.warn(`Unauthorized access attempt to admin route${permission ? ` requiring ${permission}` : ''}`);
      }
    });

    // Additional permission check if specified
    const auth = useAuth();
    const hasRequiredPermission = permission 
      ? auth.hasPermission(permission)
      : true;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loading />
        </div>
      );
    }

    if (!isAuthorized || !hasRequiredPermission) {
      const errorMessage = !isAuthorized
        ? 'You must be an admin to access this area'
        : `You don't have the required permission: ${permission}`;

      return (
        <Navigate 
          to="/login" 
          replace 
          state={{ 
            error: error || errorMessage,
            returnTo: window.location.pathname
          }} 
        />
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// Error Boundary for admin routes
export class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Admin Portal Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              An error occurred in the admin portal. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}