import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import './setup';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { ProtectedRoute } from '../components/ProtectedRoute';
import * as AuthContext from '../context/AuthContext';
import { User, AuthError, UserProfile } from '../types';
import { AUTH_ERRORS } from '../context/AuthContext';

// Mock user profile
const mockProfile: UserProfile = {
  id: '1',
  username: 'testuser',
  roles: []
};

// Mock authenticated user
const mockUser: User = {
  id: '1',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2025-05-28T20:00:00.000Z',
  confirmed_at: '2025-05-28T20:00:00.000Z',
  email: 'test@example.com',
  phone: '',
  updated_at: '2025-05-28T20:00:00.000Z',
  identities: [],
  profile: mockProfile
};

// Mock auth error
const mockAuthError: AuthError = {
  type: 'INVALID_CREDENTIALS',
  message: AUTH_ERRORS.INVALID_CREDENTIALS
};

// Mock auth context
const mockAuthContext = {
  user: null,
  session: null,
  loading: false,
  error: null,
  isInitialized: true,
  isAuthenticated: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateProfile: vi.fn(),
  hasRole: vi.fn(),
  hasPermission: vi.fn(),
  checkAuth: vi.fn(),
  clearError: vi.fn()
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockImplementation(() => mockAuthContext);
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockAuthContext.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });
  });

  it('shows error message on invalid submission', async () => {
    mockAuthContext.login.mockRejectedValueOnce(mockAuthError);

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockImplementation(() => mockAuthContext);
    vi.clearAllMocks();
  });

  it('renders register form correctly', () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('handles registration submission correctly', async () => {
    render(
      <MemoryRouter>
        <RegisterForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'testuser' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockAuthContext.register).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'testuser'
      );
    });
  });
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockImplementation(() => mockAuthContext);
    vi.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    const authenticatedContext = {
      ...mockAuthContext,
      user: mockUser,
      isAuthenticated: true
    };
    vi.spyOn(AuthContext, 'useAuth').mockImplementation(() => authenticatedContext);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    const navigate = vi.fn();
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(navigate).toHaveBeenCalledWith('/login?returnTo=%2F');
  });

  it('shows loading state when auth is loading', () => {
    const loadingContext = { ...mockAuthContext, loading: true };
    vi.spyOn(AuthContext, 'useAuth').mockImplementation(() => loadingContext);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('respects role requirements', () => {
    const authenticatedContext = {
      ...mockAuthContext,
      user: mockUser,
      isAuthenticated: true,
      hasRole: vi.fn().mockReturnValue(false)
    };
    vi.spyOn(AuthContext, 'useAuth').mockImplementation(() => authenticatedContext);

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="admin">
          <div>Admin Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(authenticatedContext.hasRole).toHaveBeenCalledWith('admin');
    expect(screen.getByText(/unauthorized/i)).toBeInTheDocument();
  });
});