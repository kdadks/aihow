import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../../components/ui/Button';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as { from?: string };
      const returnTo = state?.from || '/';
      navigate(decodeURIComponent(returnTo), { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);
  
  // Handle error messages passed from ProtectedRoute
  useEffect(() => {
    const state = location.state as { error?: string };
    if (state?.error) {
      setError(state.error);
      // Clear the error from location state to prevent it from persisting
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      
      // Handle redirect after successful login
      const state = location.state as { from?: string };
      const params = new URLSearchParams(location.search);
      const returnTo = state?.from || params.get('returnTo') || '/';
      
      if (onSuccess) {
        onSuccess();
      } else if (returnTo) {
        navigate(decodeURIComponent(returnTo));
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <div className="text-center text-sm">
          <a 
            href="/forgot-password" 
            className="text-blue-600 hover:text-blue-800"
          >
            Forgot your password?
          </a>
        </div>

        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:text-blue-800"
            type="button"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}