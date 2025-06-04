-- Fix the conflicting user_roles table structure
-- This resolves the mismatch between legacy and new schema

-- First, check what structure we currently have
DO $$
BEGIN
    -- Check if we have the legacy structure (user_id, role_id columns)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        AND column_name = 'user_id'
    ) THEN
        -- We have legacy structure, need to migrate to new structure
        RAISE NOTICE 'Found legacy user_roles structure, migrating to new schema...';
        
        -- Rename the legacy table to preserve data
        ALTER TABLE public.user_roles RENAME TO user_roles_legacy;
        
        -- Create the new user_roles table with the correct structure
        CREATE TABLE public.user_roles (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name VARCHAR NOT NULL UNIQUE,
            description TEXT,
            permissions JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Insert the default roles for the new structure
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
        }'::jsonb);
        
        RAISE NOTICE 'Created new user_roles table with role definitions';
        
    ELSE
        RAISE NOTICE 'user_roles table already has correct structure';
    END IF;
END $$;

-- Create user_role_assignments table if it doesn't exist
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

-- Create basic RLS policies that allow access for testing (only if they don't exist)
DO $$
BEGIN
    -- Check if policy exists before creating
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_roles' 
        AND policyname = 'Allow authenticated users to read roles'
    ) THEN
        CREATE POLICY "Allow authenticated users to read roles" ON public.user_roles
            FOR SELECT TO authenticated
            USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_role_assignments' 
        AND policyname = 'Allow authenticated users to read role assignments'
    ) THEN
        CREATE POLICY "Allow authenticated users to read role assignments" ON public.user_role_assignments
            FOR SELECT TO authenticated
            USING (true);
    END IF;
END $$;

-- Allow users to read their own role assignments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_role_assignments' 
        AND policyname = 'Allow users to read own assignments'
    ) THEN
        CREATE POLICY "Allow users to read own assignments" ON public.user_role_assignments
            FOR SELECT TO authenticated
            USING (user_id = auth.uid());
    END IF;
END $$;
