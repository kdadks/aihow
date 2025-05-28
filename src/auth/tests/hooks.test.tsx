import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../hooks/useAuth';
import * as AuthContext from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthError } from '../types';
import { AUTH_ERRORS } from '../context/AuthContext';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: vi.fn(() => ({
      search: '?returnTo=%2Fdashboard',
      pathname: '/login'
    }))
  };
});

// Mock auth context values
// Mock auth error
const mockAuthError: AuthError = {
  type: 'INVALID_CREDENTIALS',
  message: AUTH_ERRORS.INVALID_CREDENTIALS
};

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

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockImplementation(() => mockAuthContext);
    vi.clearAllMocks();
  });

  it('should expose auth state and methods', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: MemoryRouter
    });

    expect(result.current).toMatchObject({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      login: expect.any(Function),
      register: expect.any(Function),
      logout: expect.any(Function),
      updateProfile: expect.any(Function),
      hasRole: expect.any(Function),
      hasPermission: expect.any(Function),
      checkAuth: expect.any(Function)
    });
  });

  it('should handle login successfully', async () => {
    const navigate = vi.fn();
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: MemoryRouter
    });

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(mockAuthContext.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(navigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle login errors', async () => {
    mockAuthContext.login.mockRejectedValueOnce(mockAuthError);

    const { result } = renderHook(() => useAuth(), {
      wrapper: MemoryRouter
    });

    try {
      await act(async () => {
        await result.current.login('test@example.com', 'wrong-password');
      });
      expect(true).toBe(false); // This line should never be reached
    } catch (error) {
      expect(error).toEqual(mockAuthError);
    }
  });

  it('should handle registration successfully', async () => {
    const navigate = vi.fn();
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    const { result } = renderHook(() => useAuth(), {
      wrapper: MemoryRouter
    });

    await act(async () => {
      await result.current.register('test@example.com', 'password123', 'testuser');
    });

    expect(mockAuthContext.register).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'testuser'
    );
    expect(navigate).toHaveBeenCalledWith('/onboarding');
  });

  it('should handle logout successfully', async () => {
    const navigate = vi.fn();
    vi.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    const { result } = renderHook(() => useAuth(), {
      wrapper: MemoryRouter
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockAuthContext.logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('should handle profile updates', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: MemoryRouter
    });

    const profileUpdate = {
      username: 'newusername',
      full_name: 'New Name',
      avatar_url: 'https://example.com/avatar.jpg'
    };

    await act(async () => {
      await result.current.updateProfile(profileUpdate);
    });

    expect(mockAuthContext.updateProfile).toHaveBeenCalledWith(profileUpdate);
  });

  it('should handle profile update errors', async () => {
    const profileError: AuthError = {
      type: 'PROFILE_CREATE_ERROR',
      message: AUTH_ERRORS.PROFILE_CREATE_ERROR
    };

    mockAuthContext.updateProfile.mockRejectedValueOnce(profileError);

    const { result } = renderHook(() => useAuth(), {
      wrapper: MemoryRouter
    });

    try {
      await act(async () => {
        await result.current.updateProfile({ username: 'test' });
      });
      expect(true).toBe(false); // This line should never be reached
    } catch (error) {
      expect(error).toEqual(profileError);
    }
  });

  it('should check roles correctly', () => {
    mockAuthContext.hasRole.mockReturnValueOnce(true);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: MemoryRouter
    });

    expect(result.current.hasRole('admin')).toBe(true);
    expect(mockAuthContext.hasRole).toHaveBeenCalledWith('admin');
  });

  it('should check permissions correctly', () => {
    mockAuthContext.hasPermission.mockReturnValueOnce(true);
    
    const { result } = renderHook(() => useAuth(), {
      wrapper: MemoryRouter
    });

    expect(result.current.hasPermission('create:post')).toBe(true);
    expect(mockAuthContext.hasPermission).toHaveBeenCalledWith('create:post');
  });
});