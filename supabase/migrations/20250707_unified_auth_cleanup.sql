-- =====================================================
-- UNIFIED AUTH SCHEMA CLEANUP MIGRATION
-- =====================================================
-- This migration consolidates the authentication system into a single,
-- unified structure with role-based permissions

BEGIN;

-- =====================================================
-- 1. BACKUP EXISTING DATA (Create temporary tables)
-- =====================================================

-- Backup existing profiles data
CREATE TEMP TABLE temp_profiles_backup AS
SELECT * FROM profiles WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = profiles.id);

-- Backup existing roles data if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'roles') THEN
    CREATE TEMP TABLE temp_roles_backup AS SELECT * FROM roles;
  END IF;
END $$;

-- Backup user_roles associations if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    CREATE TEMP TABLE temp_user_roles_backup AS SELECT * FROM user_roles;
  ELSIF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_role_assignments') THEN
    CREATE TEMP TABLE temp_user_roles_backup AS 
    SELECT user_id, role_id, created_at FROM user_role_assignments;
  END IF;
END $$;

-- =====================================================
-- 2. DROP CONFLICTING AND REDUNDANT TABLES
-- =====================================================

-- Drop admin-specific tables
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS admin_roles CASCADE;

-- Drop redundant user tables
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;  -- This is redundant with auth.users
DROP TABLE IF EXISTS user_role_assignments CASCADE;

-- Drop existing role-related tables to recreate with consistent schema
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- =====================================================
-- 3. CREATE UNIFIED SCHEMA
-- =====================================================

-- Roles table with consistent structure
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 1, -- 1=user, 2=moderator, 3=admin, 4=super_admin
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Permissions table
CREATE TABLE permissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-role assignments (junction table)
CREATE TABLE user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- Role-permission assignments
CREATE TABLE role_permissions (
    role_id BIGINT REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. INSERT DEFAULT ROLES AND PERMISSIONS
-- =====================================================

-- Insert default roles
INSERT INTO roles (name, description, level) VALUES
('user', 'Basic user with standard permissions', 1),
('moderator', 'Moderator with content management permissions', 2),
('admin', 'Administrator with advanced permissions', 3),
('super_admin', 'Super administrator with full system access', 4)
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description, category) VALUES
-- General permissions
('read_content', 'View public content', 'general'),
('create_content', 'Create new content', 'general'),
('edit_own_content', 'Edit own content', 'general'),
('delete_own_content', 'Delete own content', 'general'),

-- User management
('view_users', 'View user profiles', 'user_management'),
('edit_users', 'Edit user profiles', 'user_management'),
('delete_users', 'Delete user accounts', 'user_management'),
('manage_roles', 'Assign and manage user roles', 'user_management'),

-- Content moderation
('moderate_content', 'Moderate user-generated content', 'moderation'),
('delete_any_content', 'Delete any content', 'moderation'),
('edit_any_content', 'Edit any content', 'moderation'),

-- System administration
('manage_system', 'System administration access', 'system'),
('view_analytics', 'View system analytics', 'system'),
('manage_settings', 'Manage system settings', 'system')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
WITH role_permission_mapping AS (
  SELECT 
    r.id as role_id,
    p.id as permission_id
  FROM roles r
  CROSS JOIN permissions p
  WHERE 
    -- User role permissions
    (r.name = 'user' AND p.name IN ('read_content', 'create_content', 'edit_own_content', 'delete_own_content'))
    OR 
    -- Moderator role permissions (includes user permissions)
    (r.name = 'moderator' AND p.name IN ('read_content', 'create_content', 'edit_own_content', 'delete_own_content', 'view_users', 'moderate_content', 'delete_any_content'))
    OR 
    -- Admin role permissions (includes moderator permissions)
    (r.name = 'admin' AND p.name IN ('read_content', 'create_content', 'edit_own_content', 'delete_own_content', 'view_users', 'moderate_content', 'delete_any_content', 'edit_any_content', 'edit_users', 'manage_roles', 'view_analytics', 'manage_settings'))
    OR 
    -- Super admin gets all permissions
    (r.name = 'super_admin')
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT role_id, permission_id FROM role_permission_mapping
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. RESTORE DATA AND ASSIGN DEFAULT ROLES
-- =====================================================

-- Restore profiles data
INSERT INTO profiles (id, username, full_name, avatar_url, created_at, updated_at)
SELECT id, username, full_name, avatar_url, created_at, updated_at
FROM temp_profiles_backup
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = NOW();

-- Assign default 'user' role to all existing users who don't have roles
INSERT INTO user_roles (user_id, role_id)
SELECT 
  au.id,
  r.id
FROM auth.users au
CROSS JOIN roles r
WHERE 
  r.name = 'user'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = au.id
  )
ON CONFLICT DO NOTHING;

-- Restore existing role assignments if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'temp_user_roles_backup') THEN
    -- Try to restore role assignments, mapping old role IDs to new ones if possible
    INSERT INTO user_roles (user_id, role_id, assigned_at)
    SELECT 
      trb.user_id,
      COALESCE(r.id, (SELECT id FROM roles WHERE name = 'user')), -- Default to user role if mapping fails
      trb.created_at
    FROM temp_user_roles_backup trb
    LEFT JOIN temp_roles_backup old_roles ON old_roles.id = trb.role_id
    LEFT JOIN roles r ON r.name = old_roles.name
    WHERE trb.user_id IS NOT NULL
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_roles_level ON roles(level);

-- =====================================================
-- 7. CREATE HELPFUL VIEWS
-- =====================================================

-- View to get user roles and permissions easily
CREATE OR REPLACE VIEW user_permissions AS
SELECT 
  u.id as user_id,
  u.email,
  p.username,
  r.name as role_name,
  r.level as role_level,
  perm.name as permission_name,
  perm.category as permission_category
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
LEFT JOIN role_permissions rp ON rp.role_id = r.id
LEFT JOIN permissions perm ON perm.id = rp.permission_id;

-- View to get user's highest role level
CREATE OR REPLACE VIEW user_max_role AS
SELECT 
  u.id as user_id,
  u.email,
  p.username,
  MAX(r.level) as max_role_level,
  STRING_AGG(r.name, ', ' ORDER BY r.level DESC) as roles
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
GROUP BY u.id, u.email, p.username;

-- =====================================================
-- 8. CREATE SECURITY POLICIES (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view user roles" ON user_roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage user roles" ON user_roles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_permissions 
    WHERE user_id = auth.uid() 
    AND permission_name = 'manage_roles'
  )
);

-- Roles and permissions are read-only for most users
CREATE POLICY "Users can view roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Users can view permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Users can view role permissions" ON role_permissions FOR SELECT USING (true);

-- =====================================================
-- 9. CREATE UTILITY FUNCTIONS
-- =====================================================

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(user_uuid UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_permissions 
    WHERE user_id = user_uuid 
    AND permission_name = permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's max role level
CREATE OR REPLACE FUNCTION get_user_max_role_level(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  max_level INTEGER;
BEGIN
  SELECT COALESCE(MAX(r.level), 1) INTO max_level
  FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE ur.user_id = user_uuid;
  
  RETURN max_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION assign_user_role(user_uuid UUID, role_name TEXT, assigned_by_uuid UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  role_id_var BIGINT;
BEGIN
  -- Get role ID
  SELECT id INTO role_id_var FROM roles WHERE name = role_name;
  
  IF role_id_var IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Insert role assignment
  INSERT INTO user_roles (user_id, role_id, assigned_by)
  VALUES (user_uuid, role_id_var, assigned_by_uuid)
  ON CONFLICT DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. UPDATE TRIGGER FOR PROFILES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- These will run after the transaction commits
DO $$
BEGIN
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Roles created: %', (SELECT COUNT(*) FROM roles);
  RAISE NOTICE 'Permissions created: %', (SELECT COUNT(*) FROM permissions);
  RAISE NOTICE 'Users with roles: %', (SELECT COUNT(DISTINCT user_id) FROM user_roles);
  RAISE NOTICE 'Total role assignments: %', (SELECT COUNT(*) FROM user_roles);
END $$;
