-- Create initial admin user (up)

-- Function to create admin user
-- Ensure auth.users has UUID generation
create extension if not exists "uuid-ossp";

create or replace function create_initial_admin()
returns void
language plpgsql
security definer
as $$
declare
    admin_user_id uuid;
    admin_role_id uuid;
    has_profiles_table boolean;
    has_user_roles_table boolean;
    existing_user_id uuid;
begin
    -- Check if required tables exist
    select exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles') into has_profiles_table;
    select exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'user_roles') into has_user_roles_table;
    
    if not has_profiles_table then
        raise exception 'Required table public.profiles does not exist';
    end if;
    
    if not has_user_roles_table then
        raise exception 'Required table public.user_roles does not exist';
    end if;

    -- Get admin role id
    select id into admin_role_id
    from public.roles
    where name = 'admin';
    
    if admin_role_id is null then
        raise exception 'Admin role not found';
    end if;

    -- Check if admin user already exists
    select id into existing_user_id
    from auth.users
    where email = 'admin@aihow.org';

    if existing_user_id is not null then
        raise notice 'Admin user already exists with id: %', existing_user_id;
        admin_user_id := existing_user_id;
    else
        -- Create admin user in auth.users with explicit UUID
        insert into auth.users (
            id,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_user_meta_data,
            created_at,
            updated_at
        )
        values (
            uuid_generate_v4(), -- Generate UUID explicitly
            'admin@aihow.org',
            -- Default password: AIhow@Admin2025 (should be changed on first login)
            crypt('AIhow@Admin2025', gen_salt('bf')),
            now(),
            '{"full_name": "System Administrator"}'::jsonb,
            now(),
            now()
        )
        returning id into admin_user_id;

        if admin_user_id is null then
            raise exception 'Failed to create admin user';
        end if;
    end if;

    -- Check if profile already exists
    if not exists (select 1 from public.profiles where id = admin_user_id) then
        -- Check if profiles table has created_at and updated_at columns
        if exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'profiles'
            and column_name = 'created_at'
        ) then
            -- Create admin profile with timestamp columns
            insert into public.profiles (id, username, full_name, created_at, updated_at)
            values (admin_user_id, 'admin@aihow.org', 'System Administrator', now(), now());
        else
            -- Create admin profile without timestamp columns
            insert into public.profiles (id, username, full_name)
            values (admin_user_id, 'admin@aihow.org', 'System Administrator');
        end if;
    else
        raise notice 'Admin profile already exists';
    end if;

    -- Check if user role assignment already exists
    if not exists (select 1 from public.user_roles where user_id = admin_user_id and role_id = admin_role_id) then
        -- Check if user_roles table has created_at column
        if exists (
            select 1 from information_schema.columns 
            where table_schema = 'public' 
            and table_name = 'user_roles'
            and column_name = 'created_at'
        ) then
            -- Assign admin role with timestamp
            insert into public.user_roles (user_id, role_id, created_at)
            values (admin_user_id, admin_role_id, now());
        else
            -- Assign admin role without timestamp
            insert into public.user_roles (user_id, role_id)
            values (admin_user_id, admin_role_id);
        end if;
    else
        raise notice 'Admin role already assigned';
    end if;

    raise notice 'Admin user setup completed with id: %', admin_user_id;
exception
    when others then
        raise exception 'Failed to create admin user: %', SQLERRM;
end;
$$;

-- Make sure admin role exists before creating admin user
do $$
begin
    -- Check if admin role exists, create if it doesn't
    if not exists (select 1 from public.roles where name = 'admin') then
        insert into public.roles (name, description) 
        values ('admin', 'Full system access');
        
        -- Add default permissions if both tables exist
        if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'role_permissions') 
        and exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'permissions') then
            insert into public.role_permissions (role_id, permission_id)
            select r.id, p.id
            from public.roles r
            cross join public.permissions p
            where r.name = 'admin'
            on conflict do nothing;
        end if;
    end if;
end $$;

-- Execute admin user creation
select create_initial_admin();

-- Drop the function after use
drop function create_initial_admin();

-- Rollback
-- ROLLBACK SQL:
/*
do $$
begin
    -- Delete in correct order to handle foreign key constraints
    delete from public.user_roles where user_id = (
        select id from auth.users where email = 'admin@aihow.org'
    );
    
    delete from public.profiles where username = 'admin@aihow.org';
    
    delete from auth.users where email = 'admin@aihow.org';
    
    -- Drop the UUID extension if it was newly added
    -- drop extension if exists "uuid-ossp";
end;
$$;
*/