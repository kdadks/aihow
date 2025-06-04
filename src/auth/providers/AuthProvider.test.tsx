import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider } from './AuthProvider';
import { useAuth } from '../hooks/useAuth';
import { BrowserRouter } from 'react-router-dom';
import type { AuthError, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn(),
        single: vi.fn(),
      }),
      upsert: vi.fn(),
    }),
  },
}));

beforeEach(() => {
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: { session: null },
    error: null,
  });
  
  vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
    return {
      data: {
        subscription: {
          id: '123',
          unsubscribe: vi.fn(),
          callback,
        },
      },
    };
  });
});

// Test component that uses auth context
const TestComponent = () => {
  const { user, loading, login, register, logout } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{JSON.stringify(user)}</div>
      <button onClick={() => login('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => register('test@example.com', 'password')}>
        Sign Up
      </button>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides authentication context to children', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
  });

  it('initializes with no user', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });
  });

  it('updates loading state after initialization', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  // Add more test cases for sign in, sign up, and sign out functionality
  it('handles login flow', async () => {
    const mockSignInWithPassword = vi.fn().mockResolvedValue({
      data: {
        user: { id: '123', email: 'test@example.com' },
        session: { access_token: 'token' }
      },
      error: null,
    });

    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(mockSignInWithPassword);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await act(async () => {
      screen.getByText('Sign In').click();
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('handles register flow', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({
      data: {
        user: { id: '123', email: 'test@example.com' },
        session: null
      },
      error: null,
    });

    vi.mocked(supabase.auth.signUp).mockImplementation(mockSignUp);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await act(async () => {
      screen.getByText('Sign Up').click();
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('handles logout flow', async () => {
    const mockSignOut = vi.fn().mockResolvedValue({
      error: null
    });

    vi.mocked(supabase.auth.signOut).mockImplementation(mockSignOut);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await act(async () => {
      screen.getByText('Sign Out').click();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it('handles login error', async () => {
    const mockSignInWithPassword = vi.fn().mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials', status: 401 }
    });

    vi.mocked(supabase.auth.signInWithPassword).mockImplementation(mockSignInWithPassword);

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    await act(async () => {
      screen.getByText('Sign In').click();
    });

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });
});
