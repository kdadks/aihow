-- This script creates a test user to verify authentication is working
-- If this user can log in, but admin cannot, then there's something specific wrong with the admin account

-- Ensure pgcrypto is available 
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a test user with a simple password
DO $$
DECLARE
  test_email text := 'test@example.com';
  test_password text := 'password123';
  user_id uuid;
BEGIN
  -- Create the test user
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) VALUES (
    test_email,
    crypt(test_password, gen_salt('bf')),
    now(),
    now(),
    now()
  )
  RETURNING id INTO user_id;
  
  -- Create a profile for the test user
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (user_id, test_email, 'Test User');
  
  -- Output the credentials
  RAISE NOTICE 'Test user created with email: % and password: %', test_email, test_password;
  RAISE NOTICE 'Try logging in with these credentials to verify auth is working';
END $$;
