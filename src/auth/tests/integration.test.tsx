import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import './setup';
import { User } from '@supabase/supabase-js';
import { AuthProvider } from '../providers/AuthProvider';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Mock Supabase user
const mockUser: User = {
  id: '1',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2025-05-28T20:00:00.000Z',
  confirmed_at: '2025-05-28T20:00:00.000Z',
  email: 'test@example.com',
  phone: '',
  role: 'authenticated',
  updated_at: '2025-05-28T20:00:00.000Z',
  identities: []
};

// Mock auth methods
const mockAuth = {
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn()
};

// Mock database methods
const mockDb = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn()
};

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: mockAuth,
    from: () => mockDb
  })
}));

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes the login -> protected route flow', async () => {
    const mockSession = { user: mockUser };
    
    // Mock successful login
    mockAuth.signInWithPassword.mockResolvedValueOnce({ 
      data: { session: mockSession }, 
      error: null 
    });

    // Mock session check
    mockAuth.getSession.mockResolvedValueOnce({ 
      data: { session: mockSession }, 
      error: null 
    });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <AuthProvider>
          <LoginForm />
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    // Fill and submit login form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    // Verify protected content is shown after login
    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('completes the registration -> onboarding flow', async () => {
    const mockSession = { user: mockUser };

    // Mock successful registration
    mockAuth.signUp.mockResolvedValueOnce({ 
      data: { session: mockSession, user: mockUser }, 
      error: null 
    });

    // Mock profile creation
    mockDb.insert.mockResolvedValueOnce({ 
      data: { id: 1, username: 'testuser' }, 
      error: null 
    });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <AuthProvider>
          <RegisterForm />
        </AuthProvider>
      </MemoryRouter>
    );

    // Fill and submit registration form
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

    // Verify navigation to onboarding
    await waitFor(() => {
      expect(window.location.pathname).toBe('/onboarding');
    });
  });

  it('handles role-based access control', async () => {
    const adminUser = {
      ...mockUser,
      user_metadata: { roles: ['admin'] }
    };
    const mockSession = { user: adminUser };

    // Mock session with admin role
    mockAuth.getSession.mockResolvedValueOnce({ 
      data: { session: mockSession }, 
      error: null 
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <ProtectedRoute requiredRole="admin">
            <div>Admin Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </MemoryRouter>
    );

    // Verify admin content is shown
    await waitFor(() => {
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });

  it('redirects on authentication errors', async () => {
    // Mock failed login
    mockAuth.signInWithPassword.mockResolvedValueOnce({ 
      data: { session: null }, 
      error: new Error('Invalid credentials') 
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>
    );

    // Attempt login
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});