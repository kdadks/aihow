import { User as SupabaseUser, Session, WeakPassword } from '@supabase/supabase-js';

// Auth Error Types
export type AuthErrorType =
  | 'NOT_INITIALIZED'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_EXISTS'
  | 'WEAK_PASSWORD'
  | 'NETWORK_ERROR'
  | 'PROFILE_CREATE_ERROR'
  | 'UNAUTHORIZED'
  | 'RATE_LIMIT'
  | 'ROLE_ASSIGN_ERROR'
  | 'ROLE_NOT_FOUND'
  | 'EMAIL_VERIFICATION'
  | 'EMAIL_NOT_VERIFIED'
  | 'UNKNOWN';

export interface AuthError {
  type: AuthErrorType;
  message: string;
}

export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    'message' in error &&
    typeof (error as AuthError).type === 'string' &&
    typeof (error as AuthError).message === 'string'
  );
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
}

export interface UserRoleRelation {
  user_id: string;
  role_id: string;
  role: UserRole;
}

export interface UserProfile {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: 'admin' | 'moderator' | 'user';
}

// Type guard for UserProfile
export function isUserProfile(value: any): value is UserProfile {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.username === 'string' &&
    Array.isArray(value.roles)
  );
}

// Helper type for transforming Supabase user to our User type
export type UserWithProfile = Omit<SupabaseUser, 'role'> & {
  profile: UserProfile | null;
};

// Ensure User type is compatible with Supabase but includes our profile
export type User = UserWithProfile;

// Type guard to check if a value is our User type
export function isUser(value: any): value is User {
  return (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    'profile' in value
  );
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
  loading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  session: Session | null;
  weakPassword?: WeakPassword;
  verificationNeeded?: boolean;
  message?: string;
}

// Type guard for AuthResponse
export function isAuthResponse(value: any): value is AuthResponse {
  return (
    value &&
    typeof value === 'object' &&
    'user' in value &&
    'session' in value &&
    isUser(value.user)
  );
}

export interface AuthContextType {
  // State
  user: User | null;
  session: Session | null;
  error: AuthError | null;
  loading: boolean;
  isInitialized: boolean;
  isAuthenticated: boolean;
  
  // Methods
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, password: string, username?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<Omit<UserProfile, 'id' | 'roles'>>) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  clearError: () => void;
}

// Helper type for profile updates
export type ProfileUpdate = Partial<Omit<UserProfile, 'id' | 'roles'>>;

// Type guard for auth state updates
export function assertValidAuthState(state: Partial<AuthState>): asserts state is AuthState {
  if (
    !('user' in state) ||
    !('session' in state) ||
    !('loading' in state) ||
    !('isInitialized' in state) ||
    !('isAuthenticated' in state)
  ) {
    throw new Error('Invalid auth state');
  }
}