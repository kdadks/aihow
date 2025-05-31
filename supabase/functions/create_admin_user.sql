-- Function to create admin user with proper setup
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email text,
  admin_password text,
  admin_full_name text
) RETURNS void AS $$
DECLARE
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
    jsonb_build_object('full_name', admin_full_name)
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
    admin_full_name,
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

  -- Return success
  RAISE NOTICE 'Admin user created successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION create_admin_user TO service_role;