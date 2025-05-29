import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { User } from '../types';

interface UseAuthGuardOptions {
  role?: string;
  roles?: string[];
  redirectTo?: string;
  onUnauthorized?: () => void;
}

interface AuthGuardResult {
  isAuthorized: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}): AuthGuardResult {
  const auth = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!auth.isAuthenticated) {
        setError('Not authenticated');
        setIsAuthorized(false);
        if (options.redirectTo) {
          // Handle redirect in parent component
          options.onUnauthorized?.();
        }
        return;
      }

      // Check for single role
      if (options.role) {
        const authorized = auth.hasRole(options.role);
        setIsAuthorized(authorized);
        if (!authorized) {
          setError(`Missing required role: ${options.role}`);
          options.onUnauthorized?.();
        }
        return;
      }

      // Check for multiple roles
      if (options.roles?.length) {
        const authorized = options.roles.some(role => auth.hasRole(role));
        setIsAuthorized(authorized);
        if (!authorized) {
          setError(`Missing one of required roles: ${options.roles.join(', ')}`);
          options.onUnauthorized?.();
        }
        return;
      }

      // No role requirements, just need authentication
      setIsAuthorized(true);
      setError(null);
    };

    if (!auth.loading) {
      checkAuthorization();
    }
  }, [
    auth.loading,
    auth.isAuthenticated,
    auth.hasRole,
    options.role,
    options.roles,
    options.redirectTo,
    options.onUnauthorized
  ]);

  return {
    isAuthorized,
    isLoading: auth.loading,
    error
  };
}

// Helper hook for admin routes
export function useAdminGuard(
  options: Omit<UseAuthGuardOptions, 'role' | 'roles'> = {}
): AuthGuardResult {
  return useAuthGuard({
    ...options,
    role: 'admin'
  });
}

// Helper hook for checking multiple roles
export function useRoleGuard(
  roles: string[],
  options: Omit<UseAuthGuardOptions, 'role' | 'roles'> = {}
): AuthGuardResult {
  return useAuthGuard({
    ...options,
    roles
  });
}

// Auth state utilities
interface AuthInfo {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export function useAuthState(): AuthInfo {
  const { user, loading, isAuthenticated } = useAuth();
  
  return {
    isAuthenticated,
    isLoading: loading,
    user
  };
}