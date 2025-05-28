import { createContext, useContext } from 'react';
import { AuthContextType, AuthState, AuthError, AuthErrorType } from '../types';

// Define specific auth error types
export const AUTH_ERRORS: Record<AuthErrorType, string> = {
  NOT_INITIALIZED: 'Authentication context not initialized',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  WEAK_PASSWORD: 'Password is too weak',
  NETWORK_ERROR: 'Network connection error',
  PROFILE_CREATE_ERROR: 'Failed to create user profile',
  UNAUTHORIZED: 'User not authenticated',
  RATE_LIMIT: 'Too many attempts, please try again later',
  UNKNOWN: 'An unexpected error occurred'
};

const createAuthError = (type: AuthErrorType, message?: string): AuthError => ({
  type,
  message: message || AUTH_ERRORS[type]
});

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
  isInitialized: false,
  isAuthenticated: false
};

// Default context implementation
const defaultContext: AuthContextType = {
  ...initialState,
  login: async () => { 
    throw createAuthError('NOT_INITIALIZED');
  },
  register: async () => {
    throw createAuthError('NOT_INITIALIZED');
  },
  logout: async () => {
    throw createAuthError('NOT_INITIALIZED');
  },
  updateProfile: async () => {
    throw createAuthError('NOT_INITIALIZED');
  },
  checkAuth: async () => {
    throw createAuthError('NOT_INITIALIZED');
  },
  hasRole: () => false,
  hasPermission: () => false,
  clearError: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw createAuthError('NOT_INITIALIZED', 'useAuth must be used within AuthProvider');
  }
  return context;
};