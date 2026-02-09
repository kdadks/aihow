import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorFallback from '../components/errors/ErrorFallback';
import { AuthProvider as UnifiedAuthProvider } from '../auth/context/UnifiedAuthContext';
import { AdminProvider } from '../admin/context/AdminContext';
import { AdminAuthProvider } from '../admin/auth/context/AdminAuthContext';

interface ProvidersProps {
    children: React.ReactNode;
}

// Create a QueryClient instance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function AppProviders({ children }: ProvidersProps) {
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                // Reset the app state here
                window.location.reload();
            }}
        >
            <QueryClientProvider client={queryClient}>
                <UnifiedAuthProvider>
                    <AdminAuthProvider>
                        <AdminProvider>
                            {children}
                        </AdminProvider>
                    </AdminAuthProvider>
                </UnifiedAuthProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export { AppProviders as Providers };
