-- Combined admin user setup script that properly handles auth and profiles
-- Based on tested working create_test_user.sql structure

-- Ensure pgcrypto is available 
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  admin_email text := 'admin@aihow.org';
  admin_password text := 'AIhow@Admin2025';
  admin_id uuid;
  role_id uuid;
BEGIN
  -- Clean up existing admin (if any)
  DELETE FROM auth.users WHERE email = admin_email;
  
  -- Create admin user in auth.users with proper password encryption
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "System Administrator"}'
  )
  RETURNING id INTO admin_id;

  -- Create admin profile
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    updated_at
  ) VALUES (
    admin_id,
    admin_email,
    'System Administrator',
    now()
  );

  -- Get or create admin role
  SELECT id INTO role_id FROM public.roles WHERE name = 'admin';
  IF role_id IS NULL THEN
    INSERT INTO public.roles (name, description)
    VALUES ('admin', 'Full system access')
    RETURNING id INTO role_id;
  END IF;

  -- Assign admin role
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (admin_id, role_id);

  -- Verify setup
  RAISE NOTICE 'Admin user created:';
  RAISE NOTICE '  Email: %', admin_email;
  RAISE NOTICE '  Password: %', admin_password;
  RAISE NOTICE '  User ID: %', admin_id;
  RAISE NOTICE '  Role ID: %', role_id;
  RAISE NOTICE E'\nTry logging in with these credentials';
END $$;