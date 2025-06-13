import { createContext } from 'react';
import { AuthContextType, AuthErrorType } from '../types';

// Default values for context - all async methods throw errors by default
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  error: null,
  loading: true,
  isInitialized: false,
  isAuthenticated: false,
  login: async () => { throw new Error('AuthContext not initialized'); },
  register: async () => { throw new Error('AuthContext not initialized'); },
  logout: async () => { throw new Error('AuthContext not initialized'); },
  updateProfile: async () => { throw new Error('AuthContext not initialized'); },
  forgotPassword: async () => { throw new Error('AuthContext not initialized'); },
  checkAuth: async () => { throw new Error('AuthContext not initialized'); },
  hasRole: () => false,
  hasPermission: async () => false,
  isUser: () => false,
  clearError: () => {}
});

// Centralized error messages
export const AUTH_ERRORS: Record<AuthErrorType, string> = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'An account with this email already exists',
  UNAUTHORIZED: 'You must be logged in to access this resource',
  PROFILE_FETCH_ERROR: 'Failed to load user profile',
  PROFILE_CREATE_ERROR: 'Failed to create user profile',
  DATABASE_ACCESS_ERROR: 'Database access denied. Please try logging in again.',
  UNKNOWN: 'An unknown error occurred'
};

// Helper to collect and log errors
export const logAuthError = (
  type: AuthErrorType,
  error: any,
  context?: string
) => {
  const timestamp = new Date().toISOString();
  const message = error?.message || AUTH_ERRORS[type];
  const details = {
    type,
    message,
    context,
    timestamp,
    originalError: error
  };

  console.error('Auth Error:', details);

  // Return formatted error
  return {
    type,
    message: message || AUTH_ERRORS[type]
  };
};

// Helper to check if a session token is present and not expired
export const hasValidSession = (session: any): boolean => {
  if (!session?.access_token) return false;

  try {
    const tokenData = JSON.parse(atob(session.access_token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
  } catch (error) {
    console.error('Error parsing session token:', error);
    return false;
  }
};