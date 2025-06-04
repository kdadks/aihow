import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  requiredPermissions = []
}) => {
  const { isAuthenticated, hasPermission, admin } = useAdminAuth();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for auth state to load, but don't wait indefinitely
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 200); // Reduced from 500ms for better UX

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Log auth state changes for debugging
    console.log('[AdminAuthGuard] Auth state:', { 
      isAuthenticated, 
      hasAdmin: !!admin,
      adminEmail: admin?.email,
      isReady 
    });
  }, [isAuthenticated, admin, isReady]);

  // Show loading spinner while checking authentication state
  // Check if we're still determining auth state (admin is null but we haven't waited long enough)
  if (!isReady && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after ready state, redirect to login page
  if (!isAuthenticated) {
    console.log('[AdminAuthGuard] Not authenticated, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check required permissions if specified
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission =>
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      console.log('[AdminAuthGuard] Missing required permissions:', requiredPermissions);
      // Redirect to dashboard if user doesn't have required permissions
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  console.log('[AdminAuthGuard] Authentication successful, rendering children');
  // If authenticated and has required permissions, render children
  return <>{children}</>;
};