import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, PasswordInput } from '../../components/ui';
import { AuthResponse } from '../types';

interface RegisterFormProps {
  onSuccess?: (response: AuthResponse) => void;
  redirectPath?: string;
}

export function RegisterForm({
  onSuccess,
  redirectPath = '/onboarding'
}: RegisterFormProps) {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: null as string | null,
    loading: false,
    submitted: false
  });

  const { signUp } = useAuth();
  
  console.log('RegisterForm mounted');

  // Cleanup on unmount
  // Reset form state on mount and cleanup on unmount
  useEffect(() => {
    console.log('Initializing form state');
    setFormState(prev => ({...prev, loading: false, error: null}));
    
    return () => {
      console.log('Cleaning up form state');
      setFormState(prev => ({...prev, loading: false, error: null}));
    };
  }, []);

  // Reset error when form fields change
  useEffect(() => {
    if (formState.error) {
      console.log('Clearing error due to form field change');
      setFormState(prev => ({...prev, error: null}));
    }
  }, [formState.username, formState.email, formState.password, formState.confirmPassword]);

  const updateField = (field: keyof typeof formState, value: string) => {
    setFormState(prev => {
      console.log(`Updating ${field}:`, field === 'password' ? '********' : value);
      return {...prev, [field]: value};
    });
  };

  const isValidForm = () => {
    const { username, email, password, confirmPassword } = formState;
    const validations = {
      hasUsername: username.trim() !== '',
      hasEmail: email.trim() !== '',
      hasPassword: password.trim() !== '',
      hasConfirmPassword: confirmPassword.trim() !== '',
      passwordsMatch: password === confirmPassword,
      passwordLength: password.length >= 8
    };
    
    console.log('Form Validation State:', validations);
    return Object.values(validations).every(v => v);
  };
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { username, email, password, confirmPassword } = formState;

    // Reset form state
    setFormState(prev => ({
      ...prev,
      error: null,
      loading: true,
      submitted: true
    }));

    // Validate form inputs
    if (!email || !password || !username || !confirmPassword) {
      setFormState(prev => ({
        ...prev,
        loading: false,
        error: 'All fields are required'
      }));
      return;
    }

    if (password !== confirmPassword) {
      setFormState(prev => ({
        ...prev,
        loading: false,
        error: 'Passwords do not match'
      }));
      return;
    }

    if (password.length < 8) {
      setFormState(prev => ({
        ...prev,
        loading: false,
        error: 'Password must be at least 8 characters long'
      }));
      return;
    }

    try {
      const authResponse = await signUp(email, password, { username });
      if (authResponse.error) {
        throw new Error(authResponse.error.message);
      }
      
      if (authResponse.user) {
        // Registration successful
        if (onSuccess) {
          onSuccess(authResponse);
        } else {
          // Navigate to specified redirect path
          navigate(redirectPath);
        }
      } else {
        // Handle edge case where registration succeeds but no user returned
        throw new Error('Registration failed: No user data received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      let userError = 'Registration failed. Please try again.';

      // Enhanced error mapping
      if (errorMessage.includes('email')) {
        userError = 'This email is already registered or invalid';
      } else if (errorMessage.includes('profile')) {
        userError = 'Unable to create user profile. Please try again';
      } else if (errorMessage.includes('network')) {
        userError = 'Network error. Please check your connection';
      } else if (errorMessage.includes('weak password')) {
        userError = 'Password is too weak. Please choose a stronger password';
      } else if (errorMessage.includes('rate limit')) {
        userError = 'Too many attempts. Please try again later';
      }

      setFormState(prev => ({
        ...prev,
        loading: false,
        error: userError
      }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {formState.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {formState.error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            value={formState.username}
            onChange={(e) => updateField('username', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={formState.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <PasswordInput
            id="password"
            value={formState.password}
            onChange={(e) => updateField('password', e.target.value)}
            required
            minLength={8}
          />
          <p className="mt-1 text-sm text-gray-500">
            Must be at least 8 characters long
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <PasswordInput
            id="confirmPassword"
            value={formState.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            required
            minLength={8}
          />
        </div>

        <Button
          type="submit"
          disabled={formState.loading || !isValidForm()}
          className="w-full flex items-center justify-center"
        >
          {formState.loading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}