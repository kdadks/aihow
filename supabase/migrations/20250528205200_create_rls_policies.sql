-- Create RLS policies for auth tables (up)

-- Roles table policies
create policy "Public read access to roles"
    on public.roles for select
    using (true);

-- Fix: Create separate policies for each operation
create policy "Admin only insert access to roles"
    on public.roles for insert
    with check (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

create policy "Admin only update access to roles"
    on public.roles for update
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    )
    with check (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

create policy "Admin only delete access to roles"
    on public.roles for delete
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- Permissions table policies
create policy "Public read access to permissions"
    on public.permissions for select
    using (true);

-- Fix: Create separate policies for permissions table
create policy "Admin only insert access to permissions"
    on public.permissions for insert
    with check (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

create policy "Admin only update access to permissions"
    on public.permissions for update
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    )
    with check (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

create policy "Admin only delete access to permissions"
    on public.permissions for delete
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- User roles table policies
create policy "Users can view own roles"
    on public.user_roles for select
    using (user_id = auth.uid());

create policy "Admin can manage user roles"
    on public.user_roles for all
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- Role permissions table policies
create policy "Public read access to role permissions"
    on public.role_permissions for select
    using (true);

-- Fix: Create separate policies for role_permissions table
create policy "Admin only insert access to role permissions"
    on public.role_permissions for insert
    with check (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

create policy "Admin only update access to role permissions"
    on public.role_permissions for update
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    )
    with check (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

create policy "Admin only delete access to role permissions"
    on public.role_permissions for delete
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- Helper function to check if user has specific permission
create or replace function has_permission(user_id uuid, required_permission text)
returns boolean
language plpgsql
security definer
as $$
begin
    return exists (
        select 1
        from public.user_roles ur
        join public.role_permissions rp on rp.role_id = ur.role_id
        join public.permissions p on p.id = rp.permission_id
        where ur.user_id = user_id
        and p.name = required_permission
    );
end;
$$;

-- Helper function to get user's roles
create or replace function get_user_roles(user_id uuid)
returns setof text
language plpgsql
security definer
as $$
begin
    return query
        select r.name
        from public.user_roles ur
        join public.roles r on r.id = ur.role_id
        where ur.user_id = user_id;
end;
$$;

-- Rollback
-- ROLLBACK SQL:
/*
drop function if exists get_user_roles(uuid);
drop function if exists has_permission(uuid, text);
drop policy if exists "Admin only delete access to role permissions" on public.role_permissions;
drop policy if exists "Admin only update access to role permissions" on public.role_permissions;
drop policy if exists "Admin only insert access to role permissions" on public.role_permissions;
drop policy if exists "Public read access to role permissions" on public.role_permissions;
drop policy if exists "Admin can manage user roles" on public.user_roles;
drop policy if exists "Users can view own roles" on public.user_roles;
drop policy if exists "Admin only delete access to permissions" on public.permissions;
drop policy if exists "Admin only update access to permissions" on public.permissions;
drop policy if exists "Admin only insert access to permissions" on public.permissions;
drop policy if exists "Public read access to permissions" on public.permissions;
drop policy if exists "Admin only delete access to roles" on public.roles;
drop policy if exists "Admin only update access to roles" on public.roles;
drop policy if exists "Admin only insert access to roles" on public.roles;
drop policy if exists "Public read access to roles" on public.roles;
*/