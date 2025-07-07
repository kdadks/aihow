# Database Schema Analysis: Authentication Table Redundancy

## Current Table Structure Issues

### 1. **Redundant and Conflicting Tables**

You currently have the following tables that are creating conflicts:

#### **Regular User Authentication Tables:**
- `profiles` - User profile information
- `roles` - Role definitions (BIGSERIAL ID)
- `permissions` - Permission definitions (BIGSERIAL ID)
- `user_roles` - Junction table (user_id, role_id) - **CONFLICTING SCHEMA**
- `role_permissions` - Junction table (role_id, permission_id)

#### **Admin Authentication Tables:**
- `admin_roles` - Admin role definitions (UUID ID)
- `admin_users` - Admin user information (UUID ID)
- `admin_sessions` - Admin session tracking

#### **Additional Conflicting Tables:**
- `user_profiles` - **REDUNDANT** (same as `profiles`)
- `user_role_assignments` - **REDUNDANT** (same as `user_roles`)
- `users` - **REDUNDANT** (already have `auth.users`)

### 2. **Schema Conflicts Identified**

#### **Problem 1: Multiple `user_roles` Table Definitions**
- **Legacy Schema**: Junction table with `user_id` and `role_id` columns
- **New Schema**: Role definition table with `name`, `description`, `permissions` (JSONB)
- **Conflict**: Code expects both schemas simultaneously

#### **Problem 2: ID Type Mismatches**
- `roles` table uses `BIGSERIAL` (integer) IDs
- `admin_roles` table uses `UUID` IDs
- Foreign key references are inconsistent

#### **Problem 3: Duplicate Functionality**
- Regular auth system vs Admin auth system doing similar things
- Multiple tables storing user-role relationships

### 3. **Authentication Context Conflicts**

#### **AdminAuthContext Issues:**
```typescript
// Code tries to use conflicting schema:
// 1. Queries user_role_assignments (expecting integer role_id)
// 2. Then queries user_roles (expecting UUID id)
// 3. These tables have incompatible schemas
```

#### **Regular AuthContext Issues:**
```typescript
// Code expects role information in user metadata
// But also tries to use database role tables
```

## Recommended Solution: Simplified Schema

### **Step 1: Eliminate Redundant Tables**

#### **Tables to Remove:**
1. `user_profiles` (redundant with `profiles`)
2. `users` (redundant with `auth.users`)
3. `user_role_assignments` (redundant with `user_roles`)
4. `admin_users` (can be handled with regular user system)
5. `admin_sessions` (can use regular session management)

#### **Tables to Keep:**
1. `profiles` - User profile information
2. `roles` - Role definitions
3. `permissions` - Permission definitions
4. `user_roles` - User-role assignments (fix schema)
5. `role_permissions` - Role-permission assignments

### **Step 2: Unified Authentication System**

#### **Single Role System:**
- Use one `roles` table for both regular and admin users
- Roles: `user`, `moderator`, `admin`, `super_admin`
- Use permissions for fine-grained access control

#### **Simplified Schema:**
```sql
-- profiles: User profile info
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- roles: Role definitions
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 1, -- 1=user, 2=moderator, 3=admin, 4=super_admin
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- permissions: Permission definitions
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_roles: User-role assignments (junction table)
CREATE TABLE user_roles (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- role_permissions: Role-permission assignments
CREATE TABLE role_permissions (
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);
```

### **Step 3: Unified Authentication Context**

#### **Single Auth System:**
- Remove separate AdminAuthContext
- Extend regular AuthContext with admin capabilities
- Use role-based access control throughout

#### **Implementation:**
```typescript
// Extended AuthContext
interface AuthContextType {
  user: User | null;
  session: Session | null;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  getUserRoles: () => string[];
  getUserPermissions: () => string[];
  isAdmin: () => boolean;
  // ... other methods
}
```

## Migration Strategy

### **Phase 1: Schema Cleanup**
1. Drop redundant tables
2. Standardize remaining tables
3. Migrate data to unified schema

### **Phase 2: Code Refactoring**
1. Remove AdminAuthContext
2. Extend regular AuthContext
3. Update components to use unified auth

### **Phase 3: Testing & Validation**
1. Test authentication flows
2. Verify permission checks
3. Ensure admin functionality works

## Benefits of This Approach

1. **Simplified Architecture**: Single auth system instead of dual systems
2. **Consistent Data Model**: All tables use consistent ID types and relationships
3. **Easier Maintenance**: Fewer tables and contexts to manage
4. **Better Performance**: Reduced query complexity
5. **Scalable Permissions**: Fine-grained control through permissions system

## Next Steps

1. Create migration script to clean up schema
2. Implement unified authentication context
3. Update all components to use new system
4. Test thoroughly before deploying