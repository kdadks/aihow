-- Create missing admin portal tables
-- This migration ensures moderation_queue and system_settings tables exist

-- First, ensure the roles tables exist

-- Roles Table (using 'roles' as the canonical table name)
CREATE TABLE IF NOT EXISTS public.roles (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add permissions column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'roles'
        AND column_name = 'permissions'
    ) THEN
        ALTER TABLE public.roles ADD COLUMN permissions JSONB NOT NULL DEFAULT '{}';
    END IF;
END $$;

-- User Roles Table (role assignments)
-- This table is queried by AdminAuthContext as 'user_roles'
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Insert default roles if they don't exist
INSERT INTO public.roles (name, description, permissions) VALUES
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
    }'::jsonb),
    ('user', 'Standard user with basic access', '{
        "canManageUsers": false,
        "canManageContent": false,
        "canModerateContent": false,
        "canManageSettings": false,
        "canViewMetrics": false
    }'::jsonb)
ON CONFLICT (name) DO UPDATE SET
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- Enable RLS on roles tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles
DROP POLICY IF EXISTS "Anyone can view roles" ON public.roles;
CREATE POLICY "Anyone can view roles"
    ON public.roles
    FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;
CREATE POLICY "Admins can manage roles"
    ON public.roles
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur_assign
            JOIN public.roles r ON r.id = ur_assign.role_id
            WHERE ur_assign.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur_assign
            JOIN public.roles r ON r.id = ur_assign.role_id
            WHERE ur_assign.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    );

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view their own role assignments" ON public.user_roles;
CREATE POLICY "Users can view their own role assignments"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all role assignments" ON public.user_roles;
CREATE POLICY "Admins can view all role assignments"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1
        FROM public.user_roles ur_check
        JOIN public.roles r ON r.id = ur_check.role_id
        WHERE ur_check.user_id = auth.uid()
        AND r.permissions->>'canManageUsers' = 'true'
    ));

DROP POLICY IF EXISTS "Admins can insert role assignments" ON public.user_roles;
CREATE POLICY "Admins can insert role assignments"
    ON public.user_roles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur_admin
            JOIN public.roles r ON r.id = ur_admin.role_id
            WHERE ur_admin.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    );

DROP POLICY IF EXISTS "Admins can update role assignments" ON public.user_roles;
CREATE POLICY "Admins can update role assignments"
    ON public.user_roles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur_admin
            JOIN public.roles r ON r.id = ur_admin.role_id
            WHERE ur_admin.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur_admin
            JOIN public.roles r ON r.id = ur_admin.role_id
            WHERE ur_admin.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    );

DROP POLICY IF EXISTS "Admins can delete role assignments" ON public.user_roles;
CREATE POLICY "Admins can delete role assignments"
    ON public.user_roles
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur_admin
            JOIN public.roles r ON r.id = ur_admin.role_id
            WHERE ur_admin.user_id = auth.uid()
            AND r.permissions->>'canManageUsers' = 'true'
        )
    );

-- System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR NOT NULL DEFAULT 'general',
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feature Flags Table
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    config JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Content Items Table (for moderation)
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    type TEXT NOT NULL,
    metadata JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    version INTEGER DEFAULT 1
);

-- Moderation Queue Table
CREATE TABLE IF NOT EXISTS public.moderation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    type TEXT NOT NULL DEFAULT 'content',
    status TEXT NOT NULL DEFAULT 'pending',
    reason TEXT,
    moderator_id UUID REFERENCES auth.users(id),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    moderated_at TIMESTAMPTZ,
    notes TEXT,
    content JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table (if not exists)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR NOT NULL,
    resource_type VARCHAR,
    resource_id UUID,
    metadata JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can manage feature flags" ON public.feature_flags;
DROP POLICY IF EXISTS "Admins can view all content items" ON public.content_items;
DROP POLICY IF EXISTS "Admins can manage moderation queue" ON public.moderation_queue;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;

-- Row Level Security Policies for System Settings
CREATE POLICY "Admins can manage system settings"
    ON public.system_settings
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageSettings' = 'true'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageSettings' = 'true'
        )
    );

-- Row Level Security Policies for Feature Flags
CREATE POLICY "Admins can manage feature flags"
    ON public.feature_flags
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageSettings' = 'true'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canManageSettings' = 'true'
        )
    );

-- Row Level Security Policies for Content Items
CREATE POLICY "Admins can view all content items"
    ON public.content_items
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND (
                r.permissions->>'canManageContent' = 'true'
                OR r.permissions->>'canModerateContent' = 'true'
            )
        )
    );

-- Row Level Security Policies for Moderation Queue
CREATE POLICY "Admins can manage moderation queue"
    ON public.moderation_queue
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canModerateContent' = 'true'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canModerateContent' = 'true'
        )
    );

-- Row Level Security Policies for Audit Logs
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1
            FROM public.user_roles ur
            JOIN public.roles r ON r.id = ur.role_id
            WHERE ur.user_id = auth.uid()
            AND r.permissions->>'canViewMetrics' = 'true'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);
CREATE INDEX IF NOT EXISTS idx_feature_flags_name ON public.feature_flags(name);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON public.feature_flags(enabled);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON public.moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_created_at ON public.moderation_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- Insert some default system settings
INSERT INTO public.system_settings (key, value, description, category, is_public)
VALUES
    ('site_name', '"AIhow"'::jsonb, 'The name of the website', 'general', true),
    ('site_description', '"AI Tools Directory"'::jsonb, 'Site description for SEO', 'general', true),
    ('maintenance_mode', 'false'::jsonb, 'Enable maintenance mode', 'system', false),
    ('allow_registration', 'true'::jsonb, 'Allow new user registration', 'users', false),
    ('max_upload_size', '10485760'::jsonb, 'Maximum file upload size in bytes (10MB)', 'content', false),
    ('items_per_page', '20'::jsonb, 'Default items per page for pagination', 'general', false)
ON CONFLICT (key) DO NOTHING;

-- Insert some default feature flags
INSERT INTO public.feature_flags (name, description, enabled, config)
VALUES
    ('new_search', 'Enable new search functionality', false, '{}'::jsonb),
    ('beta_features', 'Enable beta features for testing', false, '{}'::jsonb),
    ('advanced_analytics', 'Enable advanced analytics dashboard', false, '{}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Add comment to explain the purpose of this migration
COMMENT ON TABLE public.roles IS 'Stores user roles and their permissions';
COMMENT ON TABLE public.user_roles IS 'Maps users to their assigned roles';
COMMENT ON TABLE public.system_settings IS 'Stores system-wide configuration settings';
COMMENT ON TABLE public.feature_flags IS 'Stores feature flags for gradual rollout';
COMMENT ON TABLE public.moderation_queue IS 'Stores content pending moderation';
COMMENT ON TABLE public.audit_logs IS 'Stores audit trail of admin actions';
