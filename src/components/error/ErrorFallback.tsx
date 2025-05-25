import { useEffect } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    // Log error to your error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        <div className="flex justify-center">
          <Button onClick={resetErrorBoundary}>Try again</Button>
        </div>
      </div>
    </div>
  );
}