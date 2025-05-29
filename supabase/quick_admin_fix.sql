-- Simplified admin password fix script
-- This script focuses on just fixing the admin user password with proper hashing

-- Make sure pgcrypto is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admin credentials
DO $$
DECLARE
  admin_email text := 'admin@aihow.org';
  admin_password text := 'AIhow@Admin2025';
  admin_id uuid;
BEGIN
  -- Get admin user ID if it exists
  SELECT id INTO admin_id FROM auth.users WHERE email = admin_email;
  
  IF admin_id IS NULL THEN
    -- Create new admin user
    RAISE NOTICE 'Creating new admin user';
    
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    ) VALUES (
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      now(),
      now()
    )
    RETURNING id INTO admin_id;
    
    -- Create profile
    INSERT INTO public.profiles (id, username, full_name)
    VALUES (admin_id, admin_email, 'System Administrator');
    
    -- Get admin role ID
    DECLARE
      role_id uuid;
    BEGIN
      SELECT id INTO role_id FROM public.roles WHERE name = 'admin';
      
      IF role_id IS NULL THEN
        -- Create admin role
        INSERT INTO public.roles (name, description)
        VALUES ('admin', 'Full system access')
        RETURNING id INTO role_id;
      END IF;
      
      -- Assign role
      INSERT INTO public.user_roles (user_id, role_id)
      VALUES (admin_id, role_id);
    END;
    
  ELSE
    -- Update existing admin
    RAISE NOTICE 'Updating existing admin user with ID: %', admin_id;
    
    UPDATE auth.users
    SET 
      encrypted_password = crypt(admin_password, gen_salt('bf')),
      email_confirmed_at = now(),
      updated_at = now()
    WHERE id = admin_id;
  END IF;
  
  -- Verify the password works
  DECLARE
    verified_id uuid;
  BEGIN
    SELECT id INTO verified_id
    FROM auth.users
    WHERE 
      email = admin_email AND
      encrypted_password = crypt(admin_password, encrypted_password);
    
    IF verified_id IS NOT NULL THEN
      RAISE NOTICE 'Password verification successful';
    ELSE
      RAISE WARNING 'Password verification failed';
    END IF;
  END;
  
  -- Configure auth settings
  PERFORM set_config('auth.email.enable_signup', 'true', false);
  PERFORM set_config('auth.email.enable_confirmations', 'false', false);
  
  RAISE NOTICE 'Admin user setup completed';
END $$;
