import { FC, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AdminLoginForm } from '../auth/components/AdminLoginForm';
import { useAuth } from '../../auth/hooks/useAuth';
import { AdminAuthConfig } from '../auth/types/adminAuth';
import { ADMIN_API } from '../api';

const defaultConfig: AdminAuthConfig = {
  loginEndpoint: ADMIN_API.auth.login,
  sessionDuration: 3600, // 1 hour in seconds
  maxAttempts: 5,
  cooldownPeriod: 300 // 5 minutes in seconds
};

export const AdminLoginPage: FC = () => {
  const { user, isAdmin, signIn } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = user && isAdmin;

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
      const result = await signIn(email, password);
      if (result.error) {
        throw new Error(result.error.message);
      }
      console.log('[AdminLoginPage] Login successful');
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error('[AdminLoginPage] Login failed:', error);
      // Re-throw error to propagate to form component
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enterprise Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center space-x-4">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  How2doAI
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide">ENTERPRISE PLATFORM</p>
              </div>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 font-medium">System Online</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg">
          {/* Card Container */}
          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Admin Portal</h2>
              <p className="text-blue-100 text-sm font-medium">Secure Administrative Access</p>
            </div>

            {/* Form Container */}
            <div className="px-8 py-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h3>
                <p className="text-gray-600">Please authenticate to access the admin dashboard</p>
              </div>

              <AdminLoginForm
                config={defaultConfig}
                onSubmit={handleLogin}
              />
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50/80 backdrop-blur-sm px-8 py-6 border-t border-gray-200/50">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Enterprise Security</span>
                </div>
                <div className="text-gray-400">
                  Powered by <span className="font-semibold text-blue-600">How2doAI</span>
                </div>
              </div>
              
              {/* Security Badges */}
              <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200/50">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <span>Multi-Factor Auth</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Audit Logging</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Need assistance? Contact IT Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};