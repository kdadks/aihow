import { Navigate, useLocation, Location } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useEffect, useState, useMemo } from 'react';

// Auth-related paths that have special handling
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password', '/confirm-email'] as const;

interface NavigationState {
  from?: string;
  error?: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingTimeout?: number;
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
  loadingTimeout = 10000 // 10 seconds default timeout
}: ProtectedRouteProps) {
  const { user, loading, isInitialized, error } = useAuth();
  const location = useLocation();
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  // Memoize current path check
  const isAuthPath = useMemo(() =>
    AUTH_PATHS.includes(location.pathname as typeof AUTH_PATHS[number]),
    [location.pathname]
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Only start timeout during initial auth check
    if (loading && !sessionChecked && !isInitialized) {
      timeoutId = setTimeout(() => {
        setHasTimedOut(true);
      }, loadingTimeout);
    }

    // Mark session as checked when auth is initialized and not loading
    if (!loading && isInitialized && !sessionChecked) {
      setSessionChecked(true);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, loadingTimeout, sessionChecked, isInitialized]);

  // Create navigation state with current path
  const createNavigationState = (error?: string): NavigationState => ({
    from: location.pathname,
    ...(error && { error })
  });

  // Handle timeout
  if (hasTimedOut) {
    return (
      <Navigate
        to={redirectTo}
        state={createNavigationState('Authentication check timed out. Please try again.')}
        replace
      />
    );
  }

  // Handle auth errors
  if (error) {
    return (
      <Navigate
        to={redirectTo}
        state={createNavigationState(error.message)}
        replace
      />
    );
  }

  // Show loading state during initial auth check
  if ((loading && !sessionChecked) || !isInitialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Handle authenticated users on auth pages
  if (user && sessionChecked && isAuthPath) {
    const state = location.state as NavigationState;
    const returnTo = state?.from || '/';
    return <Navigate to={returnTo} replace />;
  }

  // Handle unauthenticated users on protected pages
  if (!user && sessionChecked && !isAuthPath) {
    return (
      <Navigate
        to={redirectTo}
        state={createNavigationState()}
        replace
      />
    );
  }

  return <>{children}</>;
}
