import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function EmailConfirmationPage() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            try {
                // Get the token from URL params
                const token_hash = searchParams.get('token_hash');
                const type = searchParams.get('type');

                if (type === 'email' && token_hash) {
                    // Verify the email confirmation token
                    const { error } = await supabase.auth.verifyOtp({
                        token_hash,
                        type: 'email'
                    });

                    if (error) {
                        throw error;
                    }

                    setStatus('success');
                } else {
                    // If no token or wrong type, just show success (user might have already confirmed)
                    setStatus('success');
                }
            } catch (err) {
                console.error('Email confirmation error:', err);
                setError(err instanceof Error ? err.message : 'Failed to confirm email');
                setStatus('error');
            }
        };

        handleEmailConfirmation();
    }, [searchParams]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Confirming your email...
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we verify your email address.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Email Confirmation Failed
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {error || 'We were unable to confirm your email address. The link may have expired or already been used.'}
                        </p>
                        <div className="space-y-3">
                            <Link
                                to="/signup"
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Try signing up again
                            </Link>
                            <Link
                                to="/login"
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Go to sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success state
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Email Confirmed!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your email has been confirmed and your account has been activated.
                    </p>
                    <Link
                        to="/login"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Please sign in
                    </Link>
                    <p className="mt-4 text-xs text-gray-500">
                        You can now access all features of your account.
                    </p>
                </div>
            </div>
        </div>
    );
}