-- Create roles and permissions tables (up)

-- Roles table
create table public.roles (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    description text,
    created_at timestamptz default now()
);

-- Permissions table
create table public.permissions (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    description text,
    created_at timestamptz default now()
);

-- Junction tables
create table public.user_roles (
    user_id uuid references public.profiles(id) on delete cascade,
    role_id uuid references public.roles(id) on delete cascade,
    created_at timestamptz default now(),
    primary key (user_id, role_id)
);

create table public.role_permissions (
    role_id uuid references public.roles(id) on delete cascade,
    permission_id uuid references public.permissions(id) on delete cascade,
    created_at timestamptz default now(),
    primary key (role_id, permission_id)
);

-- Enable RLS
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.role_permissions enable row level security;

-- Insert default roles
insert into public.roles (name, description) values
    ('admin', 'Full system access'),
    ('user', 'Standard user access');

-- Insert default permissions
insert into public.permissions (name, description) values
    ('create:any_profile', 'Can create any user profile'),
    ('read:any_profile', 'Can read any user profile'),
    ('update:any_profile', 'Can update any user profile'),
    ('delete:any_profile', 'Can delete any user profile'),
    ('manage:roles', 'Can manage roles and permissions');

-- Assign default permissions to admin role
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'admin';

-- Rollback
-- ROLLBACK SQL:
/*
drop table if exists public.role_permissions;
drop table if exists public.user_roles;
drop table if exists public.permissions;
drop table if exists public.roles;
*/