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

    -- Assign default role
    insert into public.user_roles (user_id, role_id)
    values (new.id, default_role_id);

    return new;
end;
$$;

-- Trigger to handle new user registration
create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function handle_new_user();

-- Update auth settings
-- Note: These are examples and should be configured per your requirements
alter system set session_preload_libraries = 'supabase_vault';

-- Configure auth.email settings
comment on table auth.users is 'Auth: Enforces email verification';

-- Add email configuration
create or replace function set_email_config()
returns void
language plpgsql
security definer
as $$
begin
    perform set_config(
        'auth.email.enable_signup',
        'true',
        false
    );
    
    perform set_config(
        'auth.email.double_confirm_changes',
        'true',
        false
    );
    
    perform set_config(
        'auth.email.enable_confirmations',
        'true',
        false
    );
end;
$$;

-- Execute email configuration
select set_email_config();

-- Rollback
-- ROLLBACK SQL:
/*
drop function if exists set_email_config();
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();
*/