import { FC, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdminLoginForm } from '../auth/components/AdminLoginForm';
import { useAdminAuth } from '../auth/hooks/useAdminAuth';
import { AdminAuthConfig } from '../auth/types/adminAuth';
import { ADMIN_API } from '../api';

const defaultConfig: AdminAuthConfig = {
  loginEndpoint: ADMIN_API.auth.login,
  sessionDuration: 3600, // 1 hour in seconds
  maxAttempts: 5,
  cooldownPeriod: 300 // 5 minutes in seconds
};

export const AdminLoginPage: FC = () => {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      console.log('[AdminLoginPage] User authenticated, navigating to dashboard');
      // Force navigation to dashboard
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    console.log('[AdminLoginPage] Already authenticated, redirecting to dashboard');
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('[AdminLoginPage] Attempting login...');
      await login(email, password);
      console.log('[AdminLoginPage] Login successful');
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error('[AdminLoginPage] Login failed:', error);
      // Re-throw error to propagate to form component
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-md w-full transform transition-all duration-300 hover:scale-[1.01]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white mb-4 shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in to access the admin dashboard</p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg ring-1 ring-gray-900/5">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-center text-gray-900">Sign In</h1>
          </div>
          <AdminLoginForm
            config={defaultConfig}
            onSubmit={handleLogin}
          />
          <div className="mt-6 text-center text-xs text-gray-600">
            Protected by advanced security protocols
          </div>
        </div>
      </div>
    </div>
  );
};