-- Complete rebuild of the admin user from scratch
-- This script drops and recreates the admin user completely to ensure clean state

-- Create extension for UUID generation and password hashing if they don't exist
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Create tables if they don't exist
-- Roles table
create table if not exists public.roles (
    id uuid primary key default gen_random_uuid(),
    name text unique not null,
    description text,
    created_at timestamptz default now()
);

-- Check if profiles table exists, if not create it with minimal required columns
do $$
begin
    if not exists (select from information_schema.tables where table_schema = 'public' and table_name = 'profiles') then
        create table public.profiles (
            id uuid references auth.users(id) primary key,
            username text unique,
            full_name text,
            avatar_url text
            -- Intentionally not adding timestamp columns to match existing schema
        );
    end if;
end$$;

-- Check if user_roles table exists, if not create it with minimal required columns
do $$
begin
    if not exists (select from information_schema.tables where table_schema = 'public' and table_name = 'user_roles') then
        create table public.user_roles (
            user_id uuid references public.profiles(id) on delete cascade,
            role_id uuid references public.roles(id) on delete cascade,
            primary key (user_id, role_id)
            -- Intentionally not adding timestamp column to match existing schema
        );
    end if;
end$$;

-- Insert admin role if it doesn't exist
insert into public.roles (name, description)
values ('admin', 'Full system access')
on conflict (name) do nothing;

-- Get admin role ID
do $$
declare
    admin_user_id uuid;
    admin_role_id uuid;
begin
    -- Get admin role id
    select id into admin_role_id
    from public.roles
    where name = 'admin';
    
    if admin_role_id is null then
        raise exception 'Failed to create admin role';
    end if;

    -- Delete any existing admin user to avoid conflicts
    delete from auth.users where email = 'admin@aihow.org';
    
    -- Create the salt explicitly to ensure proper hashing
    declare 
        password_salt text := gen_salt('bf', 10);
        hashed_password text := crypt('AIhow@Admin2025', password_salt);
    begin
        raise notice 'Generated password salt: %', password_salt;
        raise notice 'Generated hashed password: %', hashed_password;
    end;
    
    -- Create admin user in auth.users with explicit UUID
    insert into auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        raw_app_meta_data,
        created_at,
        updated_at,
        is_super_admin,
        is_anonymous
    )
    values (
        uuid_generate_v4(), -- Generate UUID explicitly
        'admin@aihow.org',
        -- Default password: AIhow@Admin2025 (should be changed on first login)
        crypt('AIhow@Admin2025', gen_salt('bf', 10)),
        now(),
        '{"full_name": "System Administrator"}'::jsonb,
        '{"provider": "email", "providers": ["email"]}'::jsonb,
        now(),
        now(),
        true,
        false
    )
    returning id into admin_user_id;

    if admin_user_id is null then
        raise exception 'Failed to create admin user';
    end if;

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

    raise notice 'Admin user created successfully with id: %', admin_user_id;
exception
    when others then
        raise exception 'Failed to create admin user: %', SQLERRM;
end $$;
