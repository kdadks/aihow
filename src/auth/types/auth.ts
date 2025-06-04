export interface User {
  id: string;
  email: string;
  role?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signIn: (credentials: AuthCredentials) => Promise<void>;
  signUp: (credentials: AuthCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}
