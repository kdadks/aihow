-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- User Roles Table
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

-- User Role Assignments Table
CREATE TABLE IF NOT EXISTS public.user_role_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.user_roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

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

-- System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR PRIMARY KEY,
    value JSONB,
    description TEXT,
    category VARCHAR NOT NULL,
    is_public BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Feature Flags Table
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Roles Policies
CREATE POLICY "Allow admin read access to roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.user_roles ur
                WHERE ur.id = ura.role_id
                AND ur.permissions->>'canManageUsers' = 'true'
            )
        )
    );

CREATE POLICY "Allow admin write access to roles" ON public.user_roles
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.user_roles ur
                WHERE ur.id = ura.role_id
                AND ur.permissions->>'canManageUsers' = 'true'
            )
        )
    );

-- Role Assignments Policies
CREATE POLICY "Allow admin read access to role assignments" ON public.user_role_assignments
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.user_roles ur
                WHERE ur.id = ura.role_id
                AND ur.permissions->>'canManageUsers' = 'true'
            )
        )
    );

CREATE POLICY "Allow admin write access to role assignments" ON public.user_role_assignments
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.user_roles ur
                WHERE ur.id = ura.role_id
                AND ur.permissions->>'canManageUsers' = 'true'
            )
        )
    );

-- Audit Logs Policies
CREATE POLICY "Allow read access to audit logs for admins" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.user_roles ur
                WHERE ur.id = ura.role_id
                AND (ur.permissions->>'canManageUsers' = 'true' OR ur.permissions->>'canViewMetrics' = 'true')
            )
        )
    );

CREATE POLICY "Allow insert to audit logs" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- System Settings Policies
CREATE POLICY "Allow public read access to public settings" ON public.system_settings
    FOR SELECT TO authenticated
    USING (is_public = true);

CREATE POLICY "Allow admin read access to all settings" ON public.system_settings
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.user_roles ur
                WHERE ur.id = ura.role_id
                AND ur.permissions->>'canManageSettings' = 'true'
            )
        )
    );

CREATE POLICY "Allow admin write access to settings" ON public.system_settings
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.user_roles ur
                WHERE ur.id = ura.role_id
                AND ur.permissions->>'canManageSettings' = 'true'
            )
        )
    );

-- Feature Flags Policies
CREATE POLICY "Allow read access to feature flags" ON public.feature_flags
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow admin write access to feature flags" ON public.feature_flags
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            WHERE ura.user_id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM public.user_roles ur
                WHERE ur.id = ura.role_id
                AND ur.permissions->>'canManageSettings' = 'true'
            )
        )
    );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id ON public.user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_id ON public.user_role_assignments(role_id);
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

DROP TRIGGER IF EXISTS tr_audit_user_role_assignments ON public.user_role_assignments;
CREATE TRIGGER tr_audit_user_role_assignments
    AFTER INSERT OR UPDATE OR DELETE ON public.user_role_assignments
    FOR EACH ROW EXECUTE FUNCTION public.fn_record_audit_log();

DROP TRIGGER IF EXISTS tr_audit_system_settings ON public.system_settings;
CREATE TRIGGER tr_audit_system_settings
    AFTER INSERT OR UPDATE OR DELETE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION public.fn_record_audit_log();

DROP TRIGGER IF EXISTS tr_audit_feature_flags ON public.feature_flags;
CREATE TRIGGER tr_audit_feature_flags
    AFTER INSERT OR UPDATE OR DELETE ON public.feature_flags
    FOR EACH ROW EXECUTE FUNCTION public.fn_record_audit_log();
