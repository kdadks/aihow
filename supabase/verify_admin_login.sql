-- Script to verify admin credentials and diagnose login issues

do $$
declare
    admin_email text := 'admin@aihow.org';
    admin_exists boolean;
    admin_confirmed boolean;
    admin_user_id uuid;
    admin_profile_exists boolean;
    admin_role_assigned boolean;
    admin_role_id uuid;
begin
    -- Check if admin exists in auth.users
    select exists(select 1 from auth.users where email = admin_email) into admin_exists;
    
    if not admin_exists then
        raise notice 'ISSUE: Admin user does not exist in auth.users table';
        return;
    end if;
    
    -- Get admin user ID
    select id from auth.users where email = admin_email into admin_user_id;
    
    -- Check if email is confirmed
    select email_confirmed_at is not null into admin_confirmed
    from auth.users 
    where email = admin_email;
    
    if not admin_confirmed then
        raise notice 'ISSUE: Admin email is not confirmed, which will prevent login';
    end if;
    
    -- Check if admin profile exists
    select exists(select 1 from public.profiles where id = admin_user_id) into admin_profile_exists;
    
    if not admin_profile_exists then
        raise notice 'ISSUE: Admin profile does not exist in public.profiles table';
    end if;
    
    -- Check if admin role exists
    select id from public.roles where name = 'admin' into admin_role_id;
    
    if admin_role_id is null then
        raise notice 'ISSUE: Admin role does not exist in public.roles table';
        return;
    end if;
    
    -- Check if admin role is assigned
    select exists(
        select 1 
        from public.user_roles 
        where user_id = admin_user_id and role_id = admin_role_id
    ) into admin_role_assigned;
    
    if not admin_role_assigned then
        raise notice 'ISSUE: Admin role is not assigned to admin user';
    end if;
    
    -- Check auth settings
    if current_setting('auth.email.enable_signup', true) = 'false' then
        raise notice 'ISSUE: auth.email.enable_signup is set to false';
    end if;
    
    if current_setting('auth.email.enable_confirmations', true) = 'false' then
        raise notice 'ISSUE: auth.email.enable_confirmations is set to false';
    end if;
    
    -- Print admin account details
    raise notice 'Admin account status:';
    raise notice '- User ID: %', admin_user_id;
    raise notice '- Email confirmed: %', admin_confirmed;
    raise notice '- Profile exists: %', admin_profile_exists;
    raise notice '- Admin role assigned: %', admin_role_assigned;
    
    -- Check if everything is OK
    if admin_exists and admin_confirmed and admin_profile_exists and admin_role_assigned then
        raise notice 'All checks passed. If login is still failing, run the fix_admin_login.sql script or check for other issues like password mismatch.';
    else
        raise notice 'Issues detected. Run the fix_admin_login.sql script to resolve these problems.';
    end if;
exception
    when others then
        raise notice 'Error verifying admin account: %', SQLERRM;
end $$;
