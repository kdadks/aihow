-- FIXED UPDATE EXISTING ADMIN EMAIL AND PASSWORD
-- =============================================================
-- Simply updates the existing admin user's email and password
-- This keeps all relationships intact and avoids UUID conflicts
-- 
-- Existing UUID: ad40a2e1-8e34-4b90-aa7b-ef309def2d68
-- Old Email: admin@aihow.org (fake)
-- New Email: support@kdadks.com (working)
-- New Password: AIhow@NewAdmin2025
-- =============================================================

-- Step 1: Verify the existing admin user
SELECT 
    'EXISTING ADMIN USER TO UPDATE:' as info,
    au.id,
    au.email as current_email,
    p.username,
    p.full_name,
    au.email_confirmed_at,
    au.aud,
    au.role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Step 2: Update the email and password in auth.users
UPDATE auth.users 
SET 
    email = 'support@kdadks.com',
    encrypted_password = crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    email_confirmed_at = NOW(),
    updated_at = NOW(),
    aud = 'authenticated',
    role = 'authenticated',
    raw_app_meta_data = COALESCE(raw_app_meta_data, '{"provider": "email", "providers": ["email"]}'::jsonb),
    raw_user_meta_data = COALESCE(raw_user_meta_data, '{"full_name": "System Administrator"}'::jsonb)
WHERE id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Step 3: Verify the email update was successful
DO $$
DECLARE
    update_result INTEGER;
BEGIN
    -- Check if the user exists with the new email
    SELECT COUNT(*) INTO update_result
    FROM auth.users 
    WHERE id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID 
    AND email = 'support@kdadks.com';
    
    IF update_result > 0 THEN
        RAISE NOTICE '✅ Email and password updated successfully';
    ELSE
        RAISE NOTICE '❌ Email update failed - user not found or update failed';
    END IF;
END $$;

-- Step 4: Update the username in profiles table to match new email
UPDATE public.profiles 
SET 
    username = 'support@kdadks.com',
    full_name = 'System Administrator',
    updated_at = NOW()
WHERE id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Step 5: Clear any cached sessions for this user
DELETE FROM auth.sessions 
WHERE user_id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Step 6: Verify final state
SELECT 
    'UPDATED ADMIN USER STATUS:' as info,
    au.id,
    au.email as new_email,
    p.username as new_username,
    p.full_name,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMED'
        ELSE '❌ EMAIL NOT CONFIRMED'
    END as email_status,
    CASE 
        WHEN au.aud = 'authenticated' AND au.role = 'authenticated' THEN '✅ AUTH STATUS OK'
        ELSE '❌ AUTH STATUS PROBLEM'
    END as auth_status,
    au.updated_at as last_updated
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Step 7: Check if admin role is properly assigned
DO $$
DECLARE
    admin_user_id UUID := 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;
    role_status TEXT := 'No role assignment found';
BEGIN
    -- Check modern role assignment
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM public.user_role_assignments ura
            JOIN public.user_roles ur ON ura.role_id = ur.id
            WHERE ura.user_id = admin_user_id AND ur.name = 'admin'
        ) THEN
            role_status := '✅ Admin role assigned via user_role_assignments';
        END IF;
    END IF;
    
    -- Check legacy role assignment
    IF role_status = 'No role assignment found' AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM public.user_roles ur
            JOIN public.roles r ON ur.role_id = r.id
            WHERE ur.user_id = admin_user_id AND r.name = 'admin'
        ) THEN
            role_status := '✅ Admin role assigned via legacy user_roles';
        END IF;
    END IF;
    
    RAISE NOTICE 'Role assignment status: %', role_status;
END $$;

-- Step 8: Show audit log entries for this user (they are preserved)
SELECT 
    'AUDIT LOG ENTRIES FOR THIS USER:' as info,
    COUNT(*) as total_entries,
    'These entries are preserved with the updated user' as note
FROM audit_log 
WHERE user_id = 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID;

-- Step 9: Final success message
SELECT 
    '🎉 ADMIN EMAIL AND PASSWORD UPDATED!' as status,
    'UUID: ad40a2e1-8e34-4b90-aa7b-ef309def2d68' as user_id,
    'Email: support@kdadks.com' as new_login_email,
    'Password: AIhow@NewAdmin2025' as new_login_password,
    'URL: /admin/login' as login_url,
    'All existing data preserved!' as benefit;

-- Step 10: Show any other users that might still need attention
SELECT 
    'OTHER USERS IN SYSTEM:' as info,
    email,
    id,
    CASE 
        WHEN email LIKE '%aihow.org' THEN 'Fake email - consider updating'
        ELSE 'Real email'
    END as email_status
FROM auth.users
WHERE id != 'ad40a2e1-8e34-4b90-aa7b-ef309def2d68'::UUID
ORDER BY email;