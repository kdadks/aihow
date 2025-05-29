import { ComponentType, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../../components/ui/Loading';

interface WithAuthProps {
  requiredRole?: string;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthProps = {}
) {
  return function WithAuthComponent(props: P) {
    const { loading, isAuthenticated, hasRole } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          // Redirect to login if not authenticated
          navigate('/login', { 
            replace: true,
            state: { from: window.location.pathname }
          });
          return;
        }

        if (options.requiredRole) {
          // Check for required role
          const authorized = hasRole(options.requiredRole);
          setIsAuthorized(authorized);
          
          if (!authorized) {
            // Redirect to home if lacking required role
            navigate('/', { 
              replace: true,
              state: { 
                error: `Access denied. Required role: ${options.requiredRole}`
              }
            });
          }
        } else {
          // No role required, just authentication
          setIsAuthorized(true);
        }
      }
    }, [loading, isAuthenticated, hasRole, navigate, options.requiredRole]);

    if (loading) {
      return <Loading />;
    }

    if (!isAuthenticated || (options.requiredRole && !isAuthorized)) {
      return null; // Component will unmount during redirect
    }

    // Pass all props to wrapped component
    return <WrappedComponent {...props} />;
  };
}

// Helper for admin-only routes
export const withAdminAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  return withAuth(WrappedComponent, { requiredRole: 'admin' });
};

// Example usage:
// const ProtectedComponent = withAuth(MyComponent);
// const AdminComponent = withAdminAuth(MyComponent);