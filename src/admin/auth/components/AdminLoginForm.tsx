import React from 'react';
import { AdminAuthConfig } from '../types/adminAuth';
import { PasswordInput } from '../../../components/ui/PasswordInput';

interface AdminLoginFormProps {
  config: AdminAuthConfig;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ config, onSubmit }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [attempts, setAttempts] = React.useState(0);
  const [isLocked, setIsLocked] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      alert(`Login locked. Please try again after ${config.cooldownPeriod} seconds.`);
      return;
    }

    try {
      setError(null);
      await onSubmit(email, password);
      // Reset attempts on successful login
      setAttempts(0);
    } catch (error: any) {
      if (error.message === 'MFA_REQUIRED') {
        // Don't show error for MFA requirement
        return;
      }
      setError(error.message || 'Failed to sign in');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= config.maxAttempts) {
        setIsLocked(true);
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
        }, config.cooldownPeriod * 1000);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative shadow-sm" role="alert">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="block sm:inline font-medium">{error}</span>
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLocked}
            className={`block w-full pl-12 pr-4 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
              isLocked 
                ? 'bg-gray-50 border-gray-200 text-gray-500' 
                : attempts > 0 
                  ? 'border-amber-300 bg-amber-50/50 focus:border-amber-500' 
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:bg-blue-50/20'
            } text-base placeholder-gray-400`}
            placeholder="admin@how2doai.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLocked}
            placeholder="Enter your secure password"
            className={`block w-full pl-12 pr-12 py-3 border-2 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
              isLocked
                ? 'bg-gray-50 border-gray-200 text-gray-500'
                : attempts > 0
                  ? 'border-amber-300 bg-amber-50/50 focus:border-amber-500'
                  : 'border-gray-200 bg-white focus:border-blue-500 focus:bg-blue-50/20'
            } text-base placeholder-gray-400`}
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLocked || !email || !password}
          className={`w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white transition-all duration-200 transform ${
            isLocked
              ? 'bg-gray-400 cursor-not-allowed'
              : !email || !password
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:transform active:translate-y-0'
          }`}
        >
          {isLocked ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Account Locked ({config.cooldownPeriod}s)
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In Securely
            </>
          )}
        </button>
      </div>

      {attempts > 0 && !isLocked && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-sm">
              <span className="font-medium text-amber-800">Security Notice:</span>
              <span className="text-amber-700 ml-1">
                {config.maxAttempts - attempts} attempt{config.maxAttempts - attempts !== 1 ? 's' : ''} remaining before account lockout
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Additional Security Info */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center text-xs text-gray-500">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>This session is encrypted and monitored for security</span>
        </div>
      </div>
    </form>
  );
};