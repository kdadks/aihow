-- First block: Create all tables
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_roles table
CREATE TABLE admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  level INTEGER NOT NULL,
  permissions TEXT[] DEFAULT '{}',
  allowed_routes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role_id UUID REFERENCES admin_roles(id),
  security_level INTEGER NOT NULL,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_sessions table
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admin_users(id),
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Second block: Insert default data
-- Insert default admin roles
INSERT INTO admin_roles (name, level, permissions, allowed_routes) VALUES
  ('SUPER_ADMIN', 100, ARRAY['*'], ARRAY['*']),
  ('SYSTEM_ADMIN', 90, ARRAY['manage_admins', 'manage_systems'], ARRAY['/admin/system/*']),
  ('CONTENT_ADMIN', 80, ARRAY['manage_content'], ARRAY['/admin/content/*']);

-- Third block: Create indexes
-- Create indexes for admin_roles
CREATE INDEX idx_admin_roles_name ON admin_roles(name);
CREATE INDEX idx_admin_roles_level ON admin_roles(level);

-- Create indexes for admin_users
CREATE INDEX idx_admin_users_role_id ON admin_users(role_id);
CREATE INDEX idx_admin_users_security_level ON admin_users(security_level);

-- Create indexes for admin_sessions
CREATE INDEX idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Fourth block: Enable RLS and create policies
-- Enable RLS for all tables
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin_roles table
CREATE POLICY "Super admins can manage roles"
  ON admin_roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() 
      AND au.security_level >= 100
    )
  );

CREATE POLICY "System admins can view roles"
  ON admin_roles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() 
      AND au.security_level >= 90
    )
  );

-- Create RLS policies for admin_users table
CREATE POLICY "Admin users can view their own profile"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Super admins can view all admin profiles"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users au 
      WHERE au.id = auth.uid() 
      AND au.security_level >= 90
    )
  );

-- Create RLS policies for admin_sessions table
CREATE POLICY "Admins can view their own sessions"
  ON admin_sessions
  FOR SELECT
  TO authenticated
  USING (admin_id = auth.uid());

CREATE POLICY "Admins can create their own sessions"
  ON admin_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (admin_id = auth.uid());

CREATE POLICY "Admins can delete their own sessions"
  ON admin_sessions
  FOR DELETE
  TO authenticated
  USING (admin_id = auth.uid());

-- Final block: Create triggers
-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to tables
CREATE TRIGGER update_admin_roles_updated_at
  BEFORE UPDATE ON admin_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();