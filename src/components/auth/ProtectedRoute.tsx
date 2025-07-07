import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({ 
    children, 
    redirectTo = '/login' 
}: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    // Don't redirect until auth is initialized
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Only redirect after auth is initialized and user is not present
    if (!user) {
        return <Navigate to={redirectTo} state={{ from: window.location.pathname }} replace />;
    }

    return <>{children}</>;
}
