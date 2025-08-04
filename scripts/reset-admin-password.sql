-- Reset Admin Password Script
-- This script resets the password for admin users in the How2doAI system
-- 
-- IMPORTANT: This script should be run with database admin privileges
-- The default new password will be: AIhow@NewAdmin2025
-- 
-- Admin users that will be reset:
-- 1. admin@aihow.org (original admin)
-- 2. testadmin@aihow.org (test admin)

-- Function to reset admin password
CREATE OR REPLACE FUNCTION reset_admin_password(
    admin_email TEXT,
    new_password TEXT DEFAULT 'AIhow@NewAdmin2025'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    admin_user_id UUID;
    admin_role_exists BOOLEAN := FALSE;
    profile_exists BOOLEAN := FALSE;
    role_assignment_exists BOOLEAN := FALSE;
    result_message TEXT := '';
BEGIN
    -- Check if user exists in auth.users
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = admin_email;
    
    IF admin_user_id IS NULL THEN
        result_message := 'ERROR: Admin user with email ' || admin_email || ' not found in auth.users';
        RETURN result_message;
    END IF;
    
    result_message := 'Found admin user: ' || admin_email || ' (ID: ' || admin_user_id || ')' || E'\n';
    
    -- Reset password in auth.users
    UPDATE auth.users 
    SET 
        encrypted_password = crypt(new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = admin_user_id;
    
    result_message := result_message || 'Password updated in auth.users' || E'\n';
    
    -- Check if profile exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = admin_user_id) INTO profile_exists;
    
    IF NOT profile_exists THEN
        -- Create profile if it doesn't exist
        INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
        VALUES (
            admin_user_id,
            admin_email,
            'System Administrator',
            NOW(),
            NOW()
        );
        result_message := result_message || 'Created missing profile for admin user' || E'\n';
    ELSE
        result_message := result_message || 'Profile exists for admin user' || E'\n';
    END IF;
    
    -- Check if admin role assignment exists
    SELECT EXISTS(
        SELECT 1 
        FROM public.user_role_assignments ura
        JOIN public.user_roles ur ON ura.role_id = ur.id
        WHERE ura.user_id = admin_user_id 
        AND ur.name IN ('admin', 'system_admin')
    ) INTO role_assignment_exists;
    
    IF NOT role_assignment_exists THEN
        -- Get admin role ID and assign it
        DECLARE
            admin_role_id UUID;
        BEGIN
            SELECT id INTO admin_role_id
            FROM public.user_roles
            WHERE name = 'admin'
            LIMIT 1;
            
            IF admin_role_id IS NOT NULL THEN
                INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
                VALUES (admin_user_id, admin_role_id, admin_user_id, NOW())
                ON CONFLICT (user_id, role_id) DO NOTHING;
                result_message := result_message || 'Assigned admin role to user' || E'\n';
            ELSE
                result_message := result_message || 'WARNING: Admin role not found in user_roles table' || E'\n';
            END IF;
        END;
    ELSE
        result_message := result_message || 'Admin role already assigned to user' || E'\n';
    END IF;
    
    result_message := result_message || 'SUCCESS: Password reset completed for ' || admin_email;
    RETURN result_message;
    
EXCEPTION WHEN OTHERS THEN
    result_message := 'ERROR: Failed to reset password for ' || admin_email || ': ' || SQLERRM;
    RETURN result_message;
END;
$$;

-- Function to check admin users status
CREATE OR REPLACE FUNCTION check_admin_users_status()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result_text TEXT := 'Admin Users Status Report:' || E'\n' || E'\n';
    admin_record RECORD;
BEGIN
    -- Check all admin users
    FOR admin_record IN
        SELECT DISTINCT
            au.id,
            au.email,
            au.created_at as auth_created,
            au.last_sign_in_at,
            p.username,
            p.full_name,
            ur.name as role_name
        FROM auth.users au
        LEFT JOIN public.profiles p ON au.id = p.id
        LEFT JOIN public.user_role_assignments ura ON au.id = ura.user_id
        LEFT JOIN public.user_roles ur ON ura.role_id = ur.id
        WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org')
           OR ur.name IN ('admin', 'system_admin')
        ORDER BY au.email
    LOOP
        result_text := result_text || 'Email: ' || COALESCE(admin_record.email, 'N/A') || E'\n';
        result_text := result_text || '  ID: ' || admin_record.id || E'\n';
        result_text := result_text || '  Username: ' || COALESCE(admin_record.username, 'N/A') || E'\n';
        result_text := result_text || '  Full Name: ' || COALESCE(admin_record.full_name, 'N/A') || E'\n';
        result_text := result_text || '  Role: ' || COALESCE(admin_record.role_name, 'No role assigned') || E'\n';
        result_text := result_text || '  Created: ' || COALESCE(admin_record.auth_created::text, 'N/A') || E'\n';
        result_text := result_text || '  Last Sign In: ' || COALESCE(admin_record.last_sign_in_at::text, 'Never') || E'\n';
        result_text := result_text || E'\n';
    END LOOP;
    
    RETURN result_text;
END;
$$;

-- Main execution script
DO $$
DECLARE
    status_report TEXT;
    reset_result TEXT;
BEGIN
    RAISE NOTICE '=== ADMIN PASSWORD RESET SCRIPT ===';
    RAISE NOTICE '';
    
    -- First, show current status
    SELECT check_admin_users_status() INTO status_report;
    RAISE NOTICE 'BEFORE RESET:';
    RAISE NOTICE '%', status_report;
    
    -- Reset password for admin@aihow.org
    SELECT reset_admin_password('admin@aihow.org') INTO reset_result;
    RAISE NOTICE 'Reset Result for admin@aihow.org:';
    RAISE NOTICE '%', reset_result;
    RAISE NOTICE '';
    
    -- Reset password for testadmin@aihow.org
    SELECT reset_admin_password('testadmin@aihow.org') INTO reset_result;
    RAISE NOTICE 'Reset Result for testadmin@aihow.org:';
    RAISE NOTICE '%', reset_result;
    RAISE NOTICE '';
    
    -- Show status after reset
    SELECT check_admin_users_status() INTO status_report;
    RAISE NOTICE 'AFTER RESET:';
    RAISE NOTICE '%', status_report;
    
    RAISE NOTICE '=== RESET COMPLETED ===';
    RAISE NOTICE 'New admin password: AIhow@NewAdmin2025';
    RAISE NOTICE 'Please change this password after first login for security.';
END $$;

-- Clean up functions after use
-- DROP FUNCTION IF EXISTS reset_admin_password(TEXT, TEXT);
-- DROP FUNCTION IF EXISTS check_admin_users_status();