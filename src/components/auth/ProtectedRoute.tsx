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
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to={redirectTo} state={{ from: window.location.pathname }} />;
    }

    return <>{children}</>;
}
