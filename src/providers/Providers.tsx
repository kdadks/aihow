import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../components/errors/ErrorFallback';
import { AuthProvider as UnifiedAuthProvider } from '../auth/context/UnifiedAuthContext';
import { AdminProvider } from '../admin/context/AdminContext';
import { AdminAuthProvider } from '../admin/auth/context/AdminAuthContext';

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
            <UnifiedAuthProvider>
                <AdminAuthProvider>
                    <AdminProvider>
                        {children}
                    </AdminProvider>
                </AdminAuthProvider>
            </UnifiedAuthProvider>
        </ErrorBoundary>
    );
}

export { AppProviders as Providers };
