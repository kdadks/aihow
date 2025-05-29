-- Admin Portal Schema (up)

-- Content Management Tables
create table public.content_items (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    content text,
    status text not null default 'draft',
    type text not null,
    metadata jsonb,
    created_by uuid references auth.users(id),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    published_at timestamptz,
    version integer default 1
);

create table public.content_versions (
    id uuid primary key default gen_random_uuid(),
    content_id uuid references public.content_items(id) on delete cascade,
    content text,
    metadata jsonb,
    created_by uuid references auth.users(id),
    created_at timestamptz default now(),
    version integer not null
);

create table public.moderation_queue (
    id uuid primary key default gen_random_uuid(),
    content_id uuid references public.content_items(id) on delete cascade,
    status text not null default 'pending',
    moderator_id uuid references auth.users(id),
    moderated_at timestamptz,
    notes text,
    created_at timestamptz default now()
);

-- Analytics Tables
create table public.activity_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete set null,
    action text not null,
    resource_type text not null,
    resource_id uuid,
    metadata jsonb,
    created_at timestamptz default now()
);

create table public.system_metrics (
    id uuid primary key default gen_random_uuid(),
    metric_name text not null,
    metric_value numeric not null,
    dimensions jsonb,
    recorded_at timestamptz default now()
);

-- Configuration Tables
create table public.system_settings (
    id uuid primary key default gen_random_uuid(),
    key text unique not null,
    value jsonb not null,
    description text,
    updated_by uuid references auth.users(id),
    updated_at timestamptz default now()
);

create table public.feature_flags (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    description text,
    enabled boolean default false,
    conditions jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.content_items enable row level security;
alter table public.content_versions enable row level security;
alter table public.moderation_queue enable row level security;
alter table public.activity_logs enable row level security;
alter table public.system_metrics enable row level security;
alter table public.system_settings enable row level security;
alter table public.feature_flags enable row level security;

-- Row Level Security Policies

-- Content Items
create policy "Admins can do everything with content"
    on public.content_items
    as permissive
    for all
    to authenticated
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- Content Versions
create policy "Admins can do everything with content versions"
    on public.content_versions
    as permissive
    for all
    to authenticated
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- Moderation Queue
create policy "Admins can do everything with moderation queue"
    on public.moderation_queue
    as permissive
    for all
    to authenticated
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- Activity Logs
create policy "Admins can view all activity logs"
    on public.activity_logs
    as permissive
    for select
    to authenticated
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

create policy "Users can create activity logs"
    on public.activity_logs
    as permissive
    for insert
    to authenticated
    with check (true);

-- System Metrics
create policy "Admins can do everything with system metrics"
    on public.system_metrics
    as permissive
    for all
    to authenticated
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- System Settings
create policy "Admins can do everything with system settings"
    on public.system_settings
    as permissive
    for all
    to authenticated
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- Feature Flags
create policy "Everyone can view feature flags"
    on public.feature_flags
    as permissive
    for select
    to authenticated
    using (true);

create policy "Admins can manage feature flags"
    on public.feature_flags
    as permissive
    for all
    to authenticated
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- Insert default system settings
insert into public.system_settings (key, value, description) values
    ('site_name', '"Admin Portal"', 'Name of the site'),
    ('maintenance_mode', 'false', 'Toggle maintenance mode'),
    ('allowed_file_types', '["image/jpeg", "image/png", "image/gif", "application/pdf"]', 'Allowed file upload types');

-- Add admin permissions for new features
insert into public.permissions (name, description) values
    ('manage:content', 'Can manage all content'),
    ('moderate:content', 'Can moderate content'),
    ('view:metrics', 'Can view system metrics'),
    ('manage:settings', 'Can manage system settings');

-- Assign new permissions to admin role
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin'
and p.name in ('manage:content', 'moderate:content', 'view:metrics', 'manage:settings');

-- Rollback SQL
/*
drop policy if exists "Admins can do everything with content" on public.content_items;
drop policy if exists "Admins can do everything with content versions" on public.content_versions;
drop policy if exists "Admins can do everything with moderation queue" on public.moderation_queue;
drop policy if exists "Admins can view all activity logs" on public.activity_logs;
drop policy if exists "Users can create activity logs" on public.activity_logs;
drop policy if exists "Admins can do everything with system metrics" on public.system_metrics;
drop policy if exists "Admins can do everything with system settings" on public.system_settings;
drop policy if exists "Everyone can view feature flags" on public.feature_flags;
drop policy if exists "Admins can manage feature flags" on public.feature_flags;

drop table if exists public.feature_flags;
drop table if exists public.system_settings;
drop table if exists public.system_metrics;
drop table if exists public.activity_logs;
drop table if exists public.moderation_queue;
drop table if exists public.content_versions;
drop table if exists public.content_items;

delete from public.role_permissions where permission_id in (
    select id from public.permissions 
    where name in ('manage:content', 'moderate:content', 'view:metrics', 'manage:settings')
);
delete from public.permissions 
where name in ('manage:content', 'moderate:content', 'view:metrics', 'manage:settings');
*/