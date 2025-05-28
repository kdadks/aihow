# Authentication System Usage Guide

This guide provides practical examples of how to use the authentication system in your application.

## Setup

First, wrap your app with the `AuthProvider`:

```tsx
import { AuthProvider } from '@/auth/providers/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

## Using the Auth Hook

The `useAuth` hook provides access to all auth functionality:

```tsx
import { useAuth } from '@/auth/hooks/useAuth';

function YourComponent() {
  const { 
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    hasPermission
  } = useAuth();

  // Use auth state and methods
}
```

## Authentication Forms

### Login Form Example

```tsx
function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await login(
        formData.get('email') as string,
        formData.get('password') as string
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign In</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### Registration Form Example

```tsx
function RegisterPage() {
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      await register(
        formData.get('email') as string,
        formData.get('password') as string,
        formData.get('username') as string
      );
    } catch (err) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <input name="username" type="text" required />
      <button type="submit">Sign Up</button>
    </form>
  );
}
```

## Protected Routes

### Basic Protection

```tsx
import { ProtectedRoute } from '@/auth/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/public" element={<PublicPage />} />
      <Route
        path="/private"
        element={
          <ProtectedRoute>
            <PrivatePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

### Role-Based Protection

```tsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

## Auth State Management

### Checking Auth Status

```tsx
function Dashboard() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <DashboardContent />;
}
```

### User Profile Management

```tsx
function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    try {
      await updateProfile(data);
      // Show success message
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <pre>{JSON.stringify(user?.profile, null, 2)}</pre>
      {/* Profile update form */}
    </div>
  );
}
```

## Role and Permission Checks

### Role Checking

```tsx
function AdminAction() {
  const { hasRole } = useAuth();

  if (!hasRole('admin')) {
    return <div>Unauthorized</div>;
  }

  return <div>Admin Only Content</div>;
}
```

### Permission Checking

```tsx
function CreatePostButton() {
  const { hasPermission } = useAuth();

  if (!hasPermission('create:post')) {
    return null;
  }

  return <button>Create Post</button>;
}
```

## Form Integration

### With React Hook Form

```tsx
import { useForm } from 'react-hook-form';

function LoginForm() {
  const { login } = useAuth();
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email', { required: true })} />
      <input {...register('password', { required: true })} />
      <button type="submit">Login</button>
    </form>
  );
}
```

## Error Handling

```tsx
function AuthErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  const handleError = (err) => {
    setError(err);
    // Log error to monitoring service
  };

  if (error) {
    return (
      <div className="error-container">
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
        <button onClick={() => setError(null)}>Try Again</button>
      </div>
    );
  }

  return children;
}
```

## Best Practices

1. Always use the `useAuth` hook for auth operations
2. Implement proper error handling
3. Show loading states during auth operations
4. Use TypeScript for type safety
5. Implement proper form validation
6. Use error boundaries for auth errors
7. Follow security best practices
8. Test auth flows thoroughly

For more details on security and deployment, see:
- [Security Implementation](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)