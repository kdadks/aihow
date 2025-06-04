-- Create admin user for testadmin@aihow.org
-- This migration creates the admin user directly in the auth system

-- First check if user already exists
DO $$
DECLARE
    user_exists BOOLEAN;
    admin_user_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::UUID;
BEGIN
    -- Check if user exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'testadmin@aihow.org') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Insert admin user into auth.users
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000'::UUID,
            admin_user_id,
            'authenticated',
            'authenticated',
            'testadmin@aihow.org',
            crypt('AIhow@Admin2025', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}'::JSONB,
            '{}'::JSONB,
            '',
            '',
            '',
            ''
        );
        
        RAISE NOTICE 'Admin user created in auth.users';
    ELSE
        RAISE NOTICE 'Admin user already exists in auth.users';
    END IF;
END $$;

-- Create admin profile
INSERT INTO public.profiles (
    id,
    email,
    display_name,
    first_name,
    last_name,
    role,
    avatar_url,
    created_at,
    updated_at
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::UUID,
    'testadmin@aihow.org',
    'Test Admin',
    'Test',
    'Admin',
    'admin',
    NULL,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Assign admin role
DO $$
DECLARE
    admin_role_id UUID;
BEGIN
    -- Get the admin role ID
    SELECT id INTO admin_role_id 
    FROM public.user_roles 
    WHERE name = 'admin' 
    LIMIT 1;
    
    IF admin_role_id IS NOT NULL THEN
        -- Insert role assignment
        INSERT INTO public.user_role_assignments (
            user_id,
            role_id,
            assigned_by,
            assigned_at
        ) VALUES (
            'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::UUID,
            admin_role_id,
            'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::UUID,
            NOW()
        ) ON CONFLICT (user_id, role_id) DO NOTHING;
        
        RAISE NOTICE 'Admin user assigned admin role';
    ELSE
        RAISE NOTICE 'Admin role not found, user created without role assignment';
    END IF;
END $$;
