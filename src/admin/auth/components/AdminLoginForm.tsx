import React from 'react';
import { AdminAuthConfig } from '../types/adminAuth';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
            className={`block w-full pl-10 pr-3 py-2 border ${isLocked ? 'bg-gray-100' : 'bg-white'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isLocked ? 'border-gray-300' : attempts > 0 ? 'border-yellow-300' : 'border-gray-300'}`}
            placeholder="admin@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLocked}
            className={`block w-full pl-10 pr-3 py-2 border ${isLocked ? 'bg-gray-100' : 'bg-white'} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${isLocked ? 'border-gray-300' : attempts > 0 ? 'border-yellow-300' : 'border-gray-300'}`}
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLocked}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${isLocked
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            } transition-colors duration-200`}
        >
          {isLocked ? `Locked (${config.cooldownPeriod}s)` : 'Sign In'}
        </button>
      </div>

      {attempts > 0 && !isLocked && (
        <div className="mt-2 text-sm text-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-md ${attempts >= config.maxAttempts - 1 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Attempts remaining: {config.maxAttempts - attempts}
          </span>
        </div>
      )}
    </form>
  );
};