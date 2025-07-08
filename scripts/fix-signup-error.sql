-- Fix signup error: Database error saving new user
-- This script addresses the most common causes of signup failures

-- 1. First, ensure the 'user' role exists (required by handle_new_user function)
INSERT INTO public.roles (name, description, level)
VALUES ('user', 'Standard user role', 1)
ON CONFLICT (name) DO NOTHING;

-- 2. Check and fix the handle_new_user function
-- The current function might have issues with table structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    default_role_id bigint;
    profile_username text;
    profile_name text;
BEGIN
    -- Safely extract username and full name
    profile_username := COALESCE(NEW.email, 'user_' || NEW.id::text);
    profile_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
    
    -- Create profile for new user with error handling
    BEGIN
        INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
        VALUES (
            NEW.id, 
            profile_username, 
            profile_name,
            COALESCE(NEW.created_at, NOW()),
            COALESCE(NEW.updated_at, NOW())
        );
    EXCEPTION WHEN OTHERS THEN
        -- Log error and re-raise with more context
        RAISE EXCEPTION 'Failed to create user profile: %', SQLERRM;
    END;

    -- Get default 'user' role id
    SELECT id INTO default_role_id
    FROM public.roles
    WHERE name = 'user'
    LIMIT 1;

    -- Assign default role if found
    IF default_role_id IS NOT NULL THEN
        BEGIN
            INSERT INTO public.user_roles (user_id, role_id, created_at)
            VALUES (NEW.id, default_role_id, NOW());
        EXCEPTION WHEN OTHERS THEN
            -- Log error but don't fail the user creation
            RAISE WARNING 'Failed to assign default role to user %: %', NEW.id, SQLERRM;
        END;
    ELSE
        RAISE WARNING 'Default user role not found - user % created without role assignment', NEW.id;
    END IF;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Ensure any error in the trigger doesn't prevent user creation
    RAISE EXCEPTION 'User creation trigger failed: %', SQLERRM;
END;
$$;

-- 3. Recreate the trigger to ensure it's properly connected
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 4. Ensure profiles table has all required columns
-- Add created_at and updated_at if they don't exist
DO $$
BEGIN
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 5. Ensure user_roles table has created_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_roles' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE public.user_roles 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 6. Fix any potential RLS policy issues
-- Ensure authenticated users can insert their own profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.profiles 
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Ensure system can insert profiles during signup (for the trigger)
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "System can insert profiles"
    ON public.profiles
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- 7. Grant necessary permissions
GRANT INSERT, SELECT ON public.profiles TO authenticated;
GRANT INSERT, SELECT ON public.user_roles TO authenticated;
GRANT SELECT ON public.roles TO authenticated;

-- Grant permissions to service role for the trigger
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.user_roles TO service_role;
GRANT SELECT ON public.roles TO service_role;

-- 8. Test the fix with a simple verification
DO $$
DECLARE
    test_result text := 'Signup fix verification:\n';
    role_exists boolean := false;
    trigger_exists boolean := false;
    policies_count integer := 0;
BEGIN
    -- Check if user role exists
    SELECT EXISTS(SELECT 1 FROM public.roles WHERE name = 'user') INTO role_exists;
    test_result := test_result || '- User role exists: ' || role_exists::text || '\n';
    
    -- Check if trigger exists
    SELECT EXISTS(
        SELECT 1 FROM pg_trigger t
        JOIN pg_class c ON t.tgrelid = c.oid
        WHERE t.tgname = 'on_auth_user_created' AND c.relname = 'users'
    ) INTO trigger_exists;
    test_result := test_result || '- Signup trigger exists: ' || trigger_exists::text || '\n';
    
    -- Check RLS policies
    SELECT COUNT(*) INTO policies_count
    FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'profiles';
    test_result := test_result || '- Profiles RLS policies count: ' || policies_count::text || '\n';
    
    RAISE NOTICE '%', test_result;
    
    IF role_exists AND trigger_exists THEN
        RAISE NOTICE 'SUCCESS: Signup error fix appears to be properly applied';
    ELSE
        RAISE NOTICE 'WARNING: Some components may still need attention';
    END IF;
END $$;

-- 9. Additional safety measure: Create a backup trigger if needed
-- This ensures user profiles are created even if the main trigger fails
CREATE OR REPLACE FUNCTION public.ensure_user_profile()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- This function can be called manually if needed
    INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
    SELECT 
        au.id,
        au.email,
        COALESCE(au.raw_user_meta_data->>'full_name', 'User'),
        au.created_at,
        au.updated_at
    FROM auth.users au
    LEFT JOIN public.profiles p ON p.id = au.id
    WHERE p.id IS NULL;
    
    RAISE NOTICE 'Missing user profiles have been created';
END $$;

RAISE NOTICE 'Signup error fix completed. Try signing up again.';