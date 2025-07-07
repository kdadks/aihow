import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    redirectTo = '/login'
}: ProtectedRouteProps) {
    const { user, isLoading, session } = useAuth();
    const location = useLocation();

    // Don't redirect until auth is initialized
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Only redirect after auth is initialized and both user and session are not present
    // This prevents false redirects during token refresh or temporary auth state issues
    if (!user || !session) {
        return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
    }

    return <>{children}</>;
}
