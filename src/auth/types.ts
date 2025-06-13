import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface UserProfile {
  username: string;
  full_name: string;
  avatar_url: string;
  roles: string[];
}

export interface User extends Omit<SupabaseUser, 'role'> {
  profile: UserProfile | null;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
  loading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
}

export type AuthErrorType = 
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_EXISTS' 
  | 'UNAUTHORIZED'
  | 'UNKNOWN'
  | 'PROFILE_FETCH_ERROR'
  | 'PROFILE_CREATE_ERROR'
  | 'DATABASE_ACCESS_ERROR';

export interface AuthError {
  type: AuthErrorType;
  message: string;
}

export interface AuthResponse {
  user: User;
  session: Session | null;
  verificationNeeded?: boolean;
  message?: string;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => Promise<boolean>;
  isUser: () => boolean;
  clearError: () => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const isAuthError = (error: unknown): error is AuthError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    typeof (error as AuthError).type === 'string' &&
    typeof (error as AuthError).message === 'string'
  );
};