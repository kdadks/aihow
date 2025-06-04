-- Fix for admin complete setup migration
-- This migration transitions the legacy user_roles structure to the new structure

-- Step 1: Backup existing user_roles data if it exists
DO $$
BEGIN
    -- Check if we have the legacy structure (no 'name' column, has 'user_id' and 'role_id')
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        AND column_name = 'user_id'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        AND column_name = 'name'
    ) THEN
        -- We have legacy structure, need to transition
        RAISE NOTICE 'Found legacy user_roles structure, performing transition...';
        
        -- Create temporary backup table
        CREATE TEMP TABLE user_roles_legacy_backup AS 
        SELECT * FROM public.user_roles;
        
        -- Drop the legacy table
        DROP TABLE public.user_roles CASCADE;
        
        -- Create new user_roles table with correct structure
        CREATE TABLE public.user_roles (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR NOT NULL UNIQUE,
            description TEXT,
            permissions JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Enable RLS on new table
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Legacy user_roles table recreated with new structure';
    ELSE
        RAISE NOTICE 'user_roles table already has correct structure or does not exist';
    END IF;
END $$;

-- Default roles
INSERT INTO public.user_roles (name, description, permissions) VALUES
('admin', 'Super administrator with full access', '{
    "canManageUsers": true,
    "canManageContent": true,
    "canModerateContent": true,
    "canManageSettings": true,
    "canViewMetrics": true
}'::jsonb),
('system_admin', 'System administrator with elevated access', '{
    "canManageUsers": true,
    "canManageContent": true,
    "canModerateContent": true,
    "canManageSettings": true,
    "canViewMetrics": true
}'::jsonb),
('content_admin', 'Content administrator', '{
    "canManageContent": true,
    "canModerateContent": true,
    "canViewMetrics": true
}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- User Role Assignments Table
CREATE TABLE IF NOT EXISTS public.user_role_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.user_roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies that allow access
CREATE POLICY "Allow authenticated users to read roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read role assignments" ON public.user_role_assignments
    FOR SELECT TO authenticated
    USING (true);

-- Allow users to read their own role assignments
CREATE POLICY "Allow users to read own assignments" ON public.user_role_assignments
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());
