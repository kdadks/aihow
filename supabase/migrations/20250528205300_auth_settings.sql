-- Configure authentication settings and triggers (up)

-- Function to assign default role to new users
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
declare
    default_role_id uuid;
begin
    -- Create profile for new user
    insert into public.profiles (id, username, full_name)
    values (new.id, new.email, new.raw_user_meta_data->>'full_name');

    -- Get default 'user' role id
    select id into default_role_id
    from public.roles
    where name = 'user';

    -- Assign default role if found
    if default_role_id is not null then
        insert into public.user_roles (user_id, role_id)
        values (new.id, default_role_id);
    end if;

    return new;
end;
$$;

-- Trigger to handle new user registration
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function handle_new_user();

-- Create auth configuration table for app-level settings
create table if not exists public.auth_settings (
    id uuid primary key default gen_random_uuid(),
    setting_name text not null unique,
    setting_value jsonb not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Insert default auth settings
insert into public.auth_settings (setting_name, setting_value, description) values
    ('email_signup_enabled', 'true', 'Allow email signup'),
    ('email_confirmations_enabled', 'true', 'Require email confirmation'),
    ('double_confirm_changes', 'true', 'Require confirmation for email changes'),
    ('session_timeout_hours', '24', 'Session timeout in hours'),
    ('max_sessions_per_user', '5', 'Maximum concurrent sessions per user')
on conflict (setting_name) do nothing;

-- Enable RLS on auth_settings
alter table public.auth_settings enable row level security;

-- Create policies for auth_settings
create policy "Public read access to auth settings"
    on public.auth_settings for select
    using (true);

create policy "Admin only write access to auth settings"
    on public.auth_settings for all
    using (
        exists (
            select 1 from public.user_roles ur
            inner join public.roles r on r.id = ur.role_id
            where ur.user_id = auth.uid()
            and r.name = 'admin'
        )
    );

-- Helper function to get auth setting
create or replace function get_auth_setting(setting_name text)
returns jsonb
language plpgsql
security definer
as $$
declare
    result jsonb;
begin
    select setting_value into result
    from public.auth_settings
    where auth_settings.setting_name = get_auth_setting.setting_name;
    
    return coalesce(result, 'null'::jsonb);
end;
$$;

-- Function to update auth setting (admin only)
create or replace function update_auth_setting(setting_name text, setting_value jsonb)
returns boolean
language plpgsql
security definer
as $$
begin
    -- Check if user is admin
    if not exists (
        select 1 from public.user_roles ur
        inner join public.roles r on r.id = ur.role_id
        where ur.user_id = auth.uid()
        and r.name = 'admin'
    ) then
        raise exception 'Insufficient permissions to update auth settings';
    end if;
    
    -- Update or insert setting
    insert into public.auth_settings (setting_name, setting_value, updated_at)
    values (setting_name, setting_value, now())
    on conflict (setting_name)
    do update set
        setting_value = excluded.setting_value,
        updated_at = excluded.updated_at;
    
    return true;
end;
$$;

-- Rollback commands
/*
drop function if exists update_auth_setting(text, jsonb);
drop function if exists get_auth_setting(text);
drop policy if exists "Admin only write access to auth settings" on public.auth_settings;
drop policy if exists "Public read access to auth settings" on public.auth_settings;
drop table if exists public.auth_settings;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
*/