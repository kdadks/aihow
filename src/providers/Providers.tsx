import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../components/errors/ErrorFallback';
import { AuthProvider } from '../auth/hooks/useAuth';
import { AdminProvider } from '../admin/context/AdminContext';

interface ProvidersProps {
    children: React.ReactNode;
}

function AppProviders({ children }: ProvidersProps) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Reset the app state here
                window.location.reload();
            }}
        >
            <AuthProvider>
                <AdminProvider>
                    {children}
                </AdminProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export { AppProviders as Providers };
