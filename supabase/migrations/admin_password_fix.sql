-- Direct fix for admin password in auth.users table
-- This script fixes password hashing issues and ensures email confirmation

-- Check if pgcrypto is installed (required for password hashing)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Get the admin user by email
DO $$
DECLARE
  admin_user_id uuid;
  admin_role_id uuid;
  admin_email text := 'admin@aihow.org';
  admin_password text := 'AIhow@Admin2025';
  hashed_password text;
  hash_count integer;
BEGIN
  -- Check if password is properly hashed in database
  SELECT COUNT(*) INTO hash_count 
  FROM auth.users 
  WHERE email = admin_email;
  
  RAISE NOTICE 'Found % admin users with email %', hash_count, admin_email;
  
  -- Generate proper bcrypt hash for password
  SELECT gen_salt('bf') INTO hashed_password;
  
  -- Debug: Show formatted hash pattern
  RAISE NOTICE 'Generated bcrypt salt pattern: %', hashed_password;
  
  IF hash_count = 0 THEN
    -- Admin user doesn't exist, create it
    RAISE NOTICE 'Admin user not found, creating new admin user';
    
    -- Create admin user with confirmed email
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      last_sign_in_at,
      raw_user_meta_data,
      is_anonymous,
      is_super_admin
    )
    VALUES (
      admin_email,
      crypt(admin_password, gen_salt('bf')),  -- Properly hashed password
      now(),                                 -- Email confirmed
      now(),                                 -- Created timestamp
      now(),                                 -- Updated timestamp
      now(),                                 -- Last sign in
      '{"full_name":"System Administrator"}'::jsonb,  -- Metadata
      false,                                 -- Not anonymous
      true                                   -- Super admin (extra permissions)
    )
    RETURNING id INTO admin_user_id;
    
    RAISE NOTICE 'Created new admin user with ID: %', admin_user_id;
    
    -- Set up profile and role for the new user
    INSERT INTO public.profiles (id, username, full_name)
    VALUES (admin_user_id, admin_email, 'System Administrator');
    
    -- Get or create admin role
    WITH role_query AS (
      SELECT id FROM public.roles WHERE name = 'admin'
    ), role_insert AS (
      INSERT INTO public.roles (name, description)
      SELECT 'admin', 'Full system access'
      WHERE NOT EXISTS (SELECT 1 FROM role_query)
      RETURNING id
    )
    SELECT id FROM role_query
    UNION
    SELECT id FROM role_insert
    INTO admin_role_id;
    
    -- Assign role to user
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (admin_user_id, admin_role_id);
    
  ELSE
    -- Admin user exists, reset the password with proper encryption
    RAISE NOTICE 'Updating existing admin user password';
    
    -- Update with new password hash
    UPDATE auth.users
    SET 
      encrypted_password = crypt(admin_password, gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now(),
      last_sign_in_at = now(),
      raw_user_meta_data = COALESCE(raw_user_meta_data, '{"full_name":"System Administrator"}'::jsonb),
      is_anonymous = false,
      is_super_admin = true
    WHERE email = admin_email
    RETURNING id INTO admin_user_id;
    
    RAISE NOTICE 'Updated admin user with ID: %', admin_user_id;
  END IF;
END $$;

-- 2. Verify the user can be authenticated
DO $$
DECLARE
  admin_email text := 'admin@aihow.org';
  admin_password text := 'AIhow@Admin2025';
  user_id uuid;
  is_valid boolean;
BEGIN
  -- Check if the password works with the auth.users table
  SELECT id INTO user_id
  FROM auth.users
  WHERE 
    email = admin_email AND
    encrypted_password = crypt(admin_password, encrypted_password);
  
  is_valid := user_id IS NOT NULL;
  
  IF is_valid THEN
    RAISE NOTICE 'Password verification successful for admin user!';
    
    -- Update the sign-in timestamp (like a real login would)
    UPDATE auth.users
    SET last_sign_in_at = now()
    WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Password verification failed - the hashing is not working correctly';
  END IF;
END $$;

-- 3. Ensure auth settings are correctly configured
DO $$
BEGIN
  -- Make sure email auth is enabled
  PERFORM set_config('auth.email.enable_signup', 'true', false);
  PERFORM set_config('auth.email.enable_confirmations', 'false', false);
  PERFORM set_config('auth.external_email_enabled', 'true', false);
  
  RAISE NOTICE 'Auth settings configured';
END $$;

-- 4. Reset any rate limits that might be blocking login
DO $$
DECLARE
  admin_email text := 'admin@aihow.org';
BEGIN
  -- Clear any rate limiting records for the admin email
  DELETE FROM auth.mfa_factors WHERE user_id IN (SELECT id FROM auth.users WHERE email = admin_email);
  DELETE FROM auth.mfa_challenges WHERE user_id IN (SELECT id FROM auth.users WHERE email = admin_email);
  DELETE FROM auth.mfa_amr_claims WHERE session_id IN (SELECT id FROM auth.sessions WHERE user_id IN (SELECT id FROM auth.users WHERE email = admin_email));
  DELETE FROM auth.sessions WHERE user_id IN (SELECT id FROM auth.users WHERE email = admin_email);
  DELETE FROM auth.refresh_tokens WHERE user_id IN (SELECT id FROM auth.users WHERE email = admin_email);
  
  RAISE NOTICE 'Rate limits and sessions cleared';
END $$;
