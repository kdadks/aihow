# Migration Guide: From Dual Auth to Unified Authentication

## Overview

This guide provides step-by-step instructions for migrating from the current conflicting dual authentication system to a unified, simplified authentication system.

## Current Issues Summary

### 1. **Table Redundancy**
- ❌ `user_profiles` (duplicate of `profiles`)
- ❌ `users` (duplicate of `auth.users`)
- ❌ `user_role_assignments` (duplicate of `user_roles`)
- ❌ `admin_users` (separate admin system)
- ❌ `admin_sessions` (separate session management)

### 2. **Schema Conflicts**
- ❌ `user_roles` table has conflicting schemas (junction vs definition)
- ❌ Mixed ID types (UUID vs BIGSERIAL)
- ❌ Inconsistent foreign key references

### 3. **Code Conflicts**
- ❌ Two separate auth contexts (`AuthContext` & `AdminAuthContext`)
- ❌ Different authentication flows
- ❌ Inconsistent role/permission checking

## Migration Steps

### Step 1: Database Schema Cleanup

1. **Apply the cleanup migration**:
   ```bash
   # Apply the cleanup migration
   npx supabase db push
   ```

2. **Verify the migration**:
   ```sql
   -- Check that redundant tables are gone
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('user_profiles', 'users', 'user_role_assignments', 'admin_users', 'admin_sessions');
   ```

3. **Verify helper functions**:
   ```sql
   -- Test helper functions
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name IN ('user_has_role', 'get_user_roles', 'get_user_permissions', 'is_admin');
   ```

### Step 2: Update Authentication Context

1. **Replace existing auth imports**:
   ```typescript
   // Old imports to replace
   import { useAuth } from '../auth/context/AuthContext';
   import { useAdminAuthContext } from '../admin/auth/context/AdminAuthContext';

   // New unified import
   import { useAuth } from '../auth/context/UnifiedAuthContext';
   ```

2. **Update App.tsx to use unified provider**:
   ```typescript
   // Replace existing providers
   import { UnifiedAuthProvider } from './auth/context/UnifiedAuthContext';

   function App() {
     return (
       <UnifiedAuthProvider>
         {/* Your app components */}
       </UnifiedAuthProvider>
     );
   }
   ```

### Step 3: Update Components

#### 3.1 Regular Authentication Components

Update components to use the unified auth context:

```typescript
// Before
const { user, login, logout } = useAuth();

// After (same interface, but unified)
const { user, login, logout, hasRole, hasPermission, isAdmin } = useAuth();
```

#### 3.2 Admin Components

Replace admin-specific auth calls:

```typescript
// Before
const { state, login, checkPermission } = useAdminAuthContext();

// After
const { user, login, hasPermission, isAdmin } = useAuth();

// Update permission checks
const canManageUsers = hasPermission('admin:user_management');
const isAdminUser = isAdmin();
```

### Step 4: Update Route Protection

#### 3.1 Protected Routes

Update protected route components:

```typescript
// src/components/auth/ProtectedRoute.tsx
import { useAuth } from '../../auth/context/UnifiedAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  adminOnly = false
}) => {
  const { user, loading, hasRole, hasPermission, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

#### 3.2 Admin Routes

Update admin route protection:

```typescript
// src/admin/routes/adminRoutes.tsx
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={
        <ProtectedRoute adminOnly>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute requiredPermission="admin:user_management">
          <UserManagement />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/content" element={
        <ProtectedRoute requiredPermission="admin:content_management">
          <ContentManagement />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
```

### Step 5: Update Database Queries

#### 5.1 Role and Permission Queries

Update components that query user roles/permissions:

```typescript
// Before (direct database queries)
const { data: userRoles } = await supabase
  .from('user_role_assignments')
  .select('role_id')
  .eq('user_id', userId);

// After (use helper functions)
const { data: userRoles } = await supabase
  .rpc('get_user_roles', { user_id: userId });

const { data: userPermissions } = await supabase
  .rpc('get_user_permissions', { user_id: userId });
```

#### 5.2 Admin User Management

Update admin user management queries:

```typescript
// Before (complex joins)
const { data: adminUsers } = await supabase
  .from('admin_users')
  .select(`
    *,
    admin_roles(name, permissions)
  `);

// After (simplified)
const { data: adminUsers } = await supabase
  .from('profiles')
  .select(`
    *,
    user_roles(
      roles(name, level, description)
    )
  `)
  .eq('user_roles.roles.level', 3); // Admin level or higher
```

### Step 6: Update Type Definitions

#### 6.1 Unified User Type

Replace multiple user types with unified type:

```typescript
// src/auth/types/auth.ts
export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  roles: string[];
  permissions: string[];
  lastLogin?: Date;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<void>;
  logout: () => Promise<void>;
  
  // Role/permission methods
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: () => boolean;
}
```

### Step 7: Clean Up Old Files

Remove old authentication files:

```bash
# Remove old auth files
rm -rf src/admin/auth/
rm src/auth/context/AuthContext.tsx
rm src/auth/providers/AuthProvider.tsx
```

### Step 8: Update Environment and Configuration

#### 8.1 Remove Admin-Specific Configuration

Remove admin-specific auth settings from your configuration files.

#### 8.2 Update Database Policies

Ensure RLS policies are working with the new unified system:

```sql
-- Test RLS policies
SELECT * FROM public.user_roles; -- Should only show your own roles
SELECT * FROM public.roles; -- Should show all roles (if you have permission)
SELECT * FROM public.permissions; -- Should show all permissions (if you have permission)
```

## Testing the Migration

### 1. Authentication Flow Testing

```typescript
// Test basic authentication
const testAuth = async () => {
  const { login, user, hasRole, hasPermission, isAdmin } = useAuth();
  
  // Test login
  await login('test@example.com', 'password');
  
  // Test role checking
  console.log('Has admin role:', hasRole('admin'));
  console.log('Has user management permission:', hasPermission('admin:user_management'));
  console.log('Is admin:', isAdmin());
};
```

### 2. Database Function Testing

```sql
-- Test database functions
SELECT public.user_has_role('user-uuid-here', 'admin');
SELECT public.get_user_roles('user-uuid-here');
SELECT public.get_user_permissions('user-uuid-here');
SELECT public.is_admin('user-uuid-here');
```

### 3. Component Testing

Test that all components work with the unified auth system:

1. Login/logout flows
2. Role-based navigation
3. Permission-based component rendering
4. Admin dashboard access
5. User management functions

## Rollback Plan

If issues arise during migration:

1. **Restore from backup** (if available)
2. **Revert to previous migration**:
   ```bash
   npx supabase db reset
   ```
3. **Re-apply old migrations** (excluding the cleanup migration)

## Benefits After Migration

1. ✅ **Simplified Architecture**: Single auth system
2. ✅ **Consistent Data Model**: No more schema conflicts
3. ✅ **Better Performance**: Fewer complex queries
4. ✅ **Easier Maintenance**: Single codebase for auth
5. ✅ **Scalable Permissions**: Role-based access control
6. ✅ **Type Safety**: Unified TypeScript types

## Support

If you encounter issues during migration:

1. Check the console for error messages
2. Verify database schema with the provided SQL queries
3. Test authentication flows in isolation
4. Review component implementations for missing imports

Remember to test thoroughly in a development environment before applying to production!