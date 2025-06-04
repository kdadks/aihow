-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: auth.users RLS is managed by Supabase and cannot be modified

-- Check if user_roles table has the correct structure, if not skip this migration
-- as it will be handled by the fix migration
DO $$
BEGIN
    -- Check if user_roles has the new structure (name column)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        AND column_name = 'name'
    ) THEN
        RAISE NOTICE 'user_roles table has legacy structure, skipping entire role setup (will be handled by fix migration)';
        RETURN;
    END IF;

    -- User Roles Table (only if it doesn't exist or has correct structure)
    CREATE TABLE IF NOT EXISTS public.user_roles (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR NOT NULL UNIQUE,
        description TEXT,
        permissions JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );

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
END $$;

-- Only create user_role_assignments if user_roles has the correct structure
DO $$
BEGIN
    -- Check if user_roles has the new structure (name column)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        AND column_name = 'name'
    ) THEN
        RAISE NOTICE 'Skipping user_role_assignments creation due to legacy user_roles structure';
        RETURN;
    END IF;

    -- User Role Assignments Table
    CREATE TABLE IF NOT EXISTS public.user_role_assignments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        role_id UUID REFERENCES public.user_roles(id) ON DELETE CASCADE,
        assigned_by UUID REFERENCES auth.users(id),
        assigned_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, role_id)
    );
END $$;

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR NOT NULL,
    resource_type VARCHAR,
    resource_id UUID,
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings Table (modify existing table to add missing columns)
-- The table already exists from 20250529_admin_portal_schema.sql with structure:
-- id (uuid), key (text unique), value (jsonb), description (text), updated_by (uuid), updated_at (timestamptz)

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'system_settings'
        AND column_name = 'category'
    ) THEN
        ALTER TABLE public.system_settings ADD COLUMN category VARCHAR DEFAULT 'general';
        -- Update existing rows to have a default category
        UPDATE public.system_settings SET category = 'general' WHERE category IS NULL;
        -- Make category NOT NULL after setting defaults
        ALTER TABLE public.system_settings ALTER COLUMN category SET NOT NULL;
    END IF;

    -- Add is_public column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'system_settings'
        AND column_name = 'is_public'
    ) THEN
        ALTER TABLE public.system_settings ADD COLUMN is_public BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Feature Flags Table (modify existing table to add missing columns)
-- The table already exists from 20250529_admin_portal_schema.sql with structure:
-- id (uuid), name (text unique), description (text), enabled (boolean), conditions (jsonb), created_at (timestamptz), updated_at (timestamptz)

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add updated_by column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'feature_flags'
        AND column_name = 'updated_by'
    ) THEN
        ALTER TABLE public.feature_flags ADD COLUMN updated_by UUID REFERENCES auth.users(id);
    END IF;
    
    -- Rename conditions to config if conditions exists and config doesn't
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'feature_flags'
        AND column_name = 'conditions'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'feature_flags'
        AND column_name = 'config'
    ) THEN
        ALTER TABLE public.feature_flags RENAME COLUMN conditions TO config;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only enable RLS on user_role_assignments if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'user_role_assignments') THEN
        ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Roles Policies - Check if we have new or legacy structure
DO $$
BEGIN
    -- Check if user_roles has the new structure (name column) and user_role_assignments exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        AND column_name = 'name'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_role_assignments'
    ) THEN
        -- New structure policies
        EXECUTE 'CREATE POLICY "Allow admin read access to roles" ON public.user_roles
            FOR SELECT TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_role_assignments ura
                    WHERE ura.user_id = auth.uid()
                    AND EXISTS (
                        SELECT 1 FROM public.user_roles ur
                        WHERE ur.id = ura.role_id
                        AND ur.permissions->>''canManageUsers'' = ''true''
                    )
                )
            )';

        EXECUTE 'CREATE POLICY "Allow admin write access to roles" ON public.user_roles
            FOR ALL TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_role_assignments ura
                    WHERE ura.user_id = auth.uid()
                    AND EXISTS (
                        SELECT 1 FROM public.user_roles ur
                        WHERE ur.id = ura.role_id
                        AND ur.permissions->>''canManageUsers'' = ''true''
                    )
                )
            )';
    ELSE
        -- Legacy structure - temporarily allow authenticated users to read roles
        -- (This will be fixed when the schema transition migration runs)
        EXECUTE 'CREATE POLICY "Temporary read access to legacy roles" ON public.user_roles
            FOR SELECT TO authenticated
            USING (true)';
        
        EXECUTE 'CREATE POLICY "Temporary admin write access to legacy roles" ON public.user_roles
            FOR ALL TO authenticated
            USING (auth.uid() IS NOT NULL)';
    END IF;
END $$;

-- Role Assignments Policies (only if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'user_role_assignments') THEN
        
        EXECUTE 'CREATE POLICY "Allow admin read access to role assignments" ON public.user_role_assignments
            FOR SELECT TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_role_assignments ura
                    WHERE ura.user_id = auth.uid()
                    AND EXISTS (
                        SELECT 1 FROM public.user_roles ur
                        WHERE ur.id = ura.role_id
                        AND ur.permissions->>''canManageUsers'' = ''true''
                    )
                )
            )';

        EXECUTE 'CREATE POLICY "Allow admin write access to role assignments" ON public.user_role_assignments
            FOR ALL TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_role_assignments ura
                    WHERE ura.user_id = auth.uid()
                    AND EXISTS (
                        SELECT 1 FROM public.user_roles ur
                        WHERE ur.id = ura.role_id
                        AND ur.permissions->>''canManageUsers'' = ''true''
                    )
                )
            )';
    END IF;
END $$;

-- Audit Logs Policies
DO $$
BEGIN
    -- Check if we have the new structure
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        AND column_name = 'name'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_role_assignments'
    ) THEN
        -- New structure policies
        EXECUTE 'CREATE POLICY "Allow read access to audit logs for admins" ON public.audit_logs
            FOR SELECT TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_role_assignments ura
                    WHERE ura.user_id = auth.uid()
                    AND EXISTS (
                        SELECT 1 FROM public.user_roles ur
                        WHERE ur.id = ura.role_id
                        AND (ur.permissions->>''canManageUsers'' = ''true'' OR ur.permissions->>''canViewMetrics'' = ''true'')
                    )
                )
            )';
    ELSE
        -- Legacy structure - temporarily allow authenticated users to read audit logs
        EXECUTE 'CREATE POLICY "Temporary read access to audit logs" ON public.audit_logs
            FOR SELECT TO authenticated
            USING (auth.uid() IS NOT NULL)';
    END IF;
END $$;

CREATE POLICY "Allow insert to audit logs" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- System Settings Policies
CREATE POLICY "Allow public read access to public settings" ON public.system_settings
    FOR SELECT TO authenticated
    USING (is_public = true);

DO $$
BEGIN
    -- Check if we have the new structure
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        AND column_name = 'name'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_role_assignments'
    ) THEN
        -- New structure policies
        EXECUTE 'CREATE POLICY "Allow admin read access to all settings" ON public.system_settings
            FOR SELECT TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_role_assignments ura
                    WHERE ura.user_id = auth.uid()
                    AND EXISTS (
                        SELECT 1 FROM public.user_roles ur
                        WHERE ur.id = ura.role_id
                        AND ur.permissions->>''canManageSettings'' = ''true''
                    )
                )
            )';

        EXECUTE 'CREATE POLICY "Allow admin write access to settings" ON public.system_settings
            FOR ALL TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_role_assignments ura
                    WHERE ura.user_id = auth.uid()
                    AND EXISTS (
                        SELECT 1 FROM public.user_roles ur
                        WHERE ur.id = ura.role_id
                        AND ur.permissions->>''canManageSettings'' = ''true''
                    )
                )
            )';
    ELSE
        -- Legacy structure - temporarily allow authenticated users to manage settings
        EXECUTE 'CREATE POLICY "Temporary admin read access to all settings" ON public.system_settings
            FOR SELECT TO authenticated
            USING (auth.uid() IS NOT NULL)';
        
        EXECUTE 'CREATE POLICY "Temporary admin write access to settings" ON public.system_settings
            FOR ALL TO authenticated
            USING (auth.uid() IS NOT NULL)';
    END IF;
END $$;

-- Feature Flags Policies
CREATE POLICY "Allow read access to feature flags" ON public.feature_flags
    FOR SELECT TO authenticated
    USING (true);

DO $$
BEGIN
    -- Check if we have the new structure
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles'
        AND column_name = 'name'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_role_assignments'
    ) THEN
        -- New structure policies
        EXECUTE 'CREATE POLICY "Allow admin write access to feature flags" ON public.feature_flags
            FOR ALL TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_role_assignments ura
                    WHERE ura.user_id = auth.uid()
                    AND EXISTS (
                        SELECT 1 FROM public.user_roles ur
                        WHERE ur.id = ura.role_id
                        AND ur.permissions->>''canManageSettings'' = ''true''
                    )
                )
            )';
    ELSE
        -- Legacy structure - temporarily allow authenticated users to manage feature flags
        EXECUTE 'CREATE POLICY "Temporary admin write access to feature flags" ON public.feature_flags
            FOR ALL TO authenticated
            USING (auth.uid() IS NOT NULL)';
    END IF;
END $$;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Only create user_role_assignments indexes if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'user_role_assignments') THEN
        CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON public.user_role_assignments(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_id ON public.user_role_assignments(role_id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON public.feature_flags(name);

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description, category, is_public) VALUES
('site_name', '"How2doAI"', 'Site name displayed in various locations', 'general', true),
('maintenance_mode', 'false', 'Toggle site maintenance mode', 'system', false),
('user_registration', 'true', 'Allow new user registrations', 'users', false)
ON CONFLICT (key) DO NOTHING;

-- Insert some default feature flags
INSERT INTO public.feature_flags (name, description, enabled, config) VALUES
('dark_mode', 'Enable dark mode theme', true, '{"default": true}'),
('beta_features', 'Enable beta features', false, '{"requires_subscription": true}')
ON CONFLICT (name) DO NOTHING;

-- Function to record audit logs
CREATE OR REPLACE FUNCTION public.fn_record_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        metadata
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id 
        END,
        CASE
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
            ELSE row_to_json(NEW)
        END
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers
DROP TRIGGER IF EXISTS tr_audit_user_roles ON public.user_roles;
CREATE TRIGGER tr_audit_user_roles
    AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
    FOR EACH ROW EXECUTE FUNCTION public.fn_record_audit_log();

-- Only create user_role_assignments trigger if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'user_role_assignments') THEN
        DROP TRIGGER IF EXISTS tr_audit_user_role_assignments ON public.user_role_assignments;
        CREATE TRIGGER tr_audit_user_role_assignments
            AFTER INSERT OR UPDATE OR DELETE ON public.user_role_assignments
            FOR EACH ROW EXECUTE FUNCTION public.fn_record_audit_log();
    END IF;
END $$;

DROP TRIGGER IF EXISTS tr_audit_system_settings ON public.system_settings;
CREATE TRIGGER tr_audit_system_settings
    AFTER INSERT OR UPDATE OR DELETE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION public.fn_record_audit_log();

DROP TRIGGER IF EXISTS tr_audit_feature_flags ON public.feature_flags;
CREATE TRIGGER tr_audit_feature_flags
    AFTER INSERT OR UPDATE OR DELETE ON public.feature_flags
    FOR EACH ROW EXECUTE FUNCTION public.fn_record_audit_log();
