-- DIAGNOSE AND FIX AUTHENTICATION ISSUES
-- =============================================================
-- The email was updated but authentication still fails
-- This script diagnoses the issue and provides a comprehensive fix
-- =============================================================

-- Step 1: Check current state of the updated user
SELECT 
    'CURRENT USER STATE AFTER EMAIL UPDATE:' as info,
    au.id,
    au.email,
    au.encrypted_password IS NOT NULL as has_password,
    au.email_confirmed_at,
    au.aud,
    au.role,
    au.raw_app_meta_data,
    au.raw_user_meta_data,
    au.created_at,
    au.updated_at,
    au.last_sign_in_at
FROM auth.users au
WHERE au.email = 'support@kdadks.com';

-- Step 2: Check if there's an issue with password hashing
-- Let's try a different approach to password hashing
UPDATE auth.users 
SET 
    encrypted_password = '$2a$10$' || encode(digest('AIhow@NewAdmin2025' || au.id::text, 'sha256'), 'hex'),
    email_confirmed_at = NOW(),
    updated_at = NOW(),
    confirmation_token = '',
    email_change = '',
    email_change_token_new = '',
    recovery_token = ''
FROM auth.users au
WHERE au.email = 'support@kdadks.com' 
  AND auth.users.id = au.id;

-- Alternative: Use Supabase's standard bcrypt method
UPDATE auth.users 
SET 
    encrypted_password = crypt('AIhow@NewAdmin2025', gen_salt('bf', 10)),
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'support@kdadks.com';

-- Step 3: Ensure all auth metadata is properly set
UPDATE auth.users 
SET 
    aud = 'authenticated',
    role = 'authenticated',
    raw_app_meta_data = jsonb_build_object(
        'provider', 'email',
        'providers', ARRAY['email']
    ),
    raw_user_meta_data = jsonb_build_object(
        'email', 'support@kdadks.com',
        'email_verified', true,
        'phone_verified', false,
        'sub', id::text
    ),
    confirmation_token = '',
    email_change = '',
    email_change_token_new = '',
    recovery_token = ''
WHERE email = 'support@kdadks.com';

-- Step 4: Verify the password was set correctly
SELECT 
    'PASSWORD VERIFICATION:' as info,
    email,
    encrypted_password IS NOT NULL as has_encrypted_password,
    LENGTH(encrypted_password) as password_length,
    LEFT(encrypted_password, 10) as password_prefix,
    email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users 
WHERE email = 'support@kdadks.com';

-- Step 5: Check if user can authenticate (test the password hash)
DO $$
DECLARE
    test_password TEXT := 'AIhow@NewAdmin2025';
    stored_hash TEXT;
    auth_result BOOLEAN;
BEGIN
    -- Get the stored password hash
    SELECT encrypted_password INTO stored_hash 
    FROM auth.users 
    WHERE email = 'support@kdadks.com';
    
    -- Test if the password matches
    SELECT (stored_hash = crypt(test_password, stored_hash)) INTO auth_result;
    
    IF auth_result THEN
        RAISE NOTICE '✅ Password hash verification: SUCCESS';
    ELSE
        RAISE NOTICE '❌ Password hash verification: FAILED';
        
        -- Try to fix with a fresh hash
        UPDATE auth.users 
        SET encrypted_password = crypt(test_password, gen_salt('bf'))
        WHERE email = 'support@kdadks.com';
        
        RAISE NOTICE 'Applied fresh password hash';
    END IF;
END $$;

-- Step 6: Clear any cached data that might interfere
DELETE FROM auth.sessions WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
);

DELETE FROM auth.refresh_tokens WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
);

-- Step 7: Check final auth state
SELECT 
    'FINAL AUTH STATE:' as info,
    au.email,
    au.id,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMED'
        ELSE '❌ EMAIL NOT CONFIRMED'
    END as email_status,
    CASE 
        WHEN au.aud = 'authenticated' AND au.role = 'authenticated' THEN '✅ AUTH ROLES OK'
        ELSE '❌ AUTH ROLES PROBLEM'
    END as auth_roles,
    CASE 
        WHEN au.raw_app_meta_data ? 'provider' THEN '✅ APP METADATA OK'
        ELSE '❌ APP METADATA MISSING'
    END as app_metadata,
    CASE 
        WHEN au.encrypted_password IS NOT NULL AND LENGTH(au.encrypted_password) > 50 THEN '✅ PASSWORD SET'
        ELSE '❌ PASSWORD PROBLEM'
    END as password_status
FROM auth.users au
WHERE au.email = 'support@kdadks.com';

-- Step 8: Check if the issue might be in the frontend auth flow
-- Show the exact auth.users record that Supabase will use
SELECT 
    'SUPABASE AUTH RECORD:' as info,
    id,
    aud,
    role,
    email,
    email_confirmed_at,
    phone_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at
FROM auth.users 
WHERE email = 'support@kdadks.com';

-- Step 9: Alternative password setting method
-- Sometimes Supabase requires specific password format
DO $$
DECLARE
    user_id_var UUID;
BEGIN
    SELECT id INTO user_id_var FROM auth.users WHERE email = 'support@kdadks.com';
    
    -- Set password using Supabase's expected format
    UPDATE auth.users 
    SET 
        encrypted_password = '$2a$10$' || md5('AIhow@NewAdmin2025' || user_id_var::text),
        updated_at = NOW()
    WHERE id = user_id_var;
    
    RAISE NOTICE 'Applied alternative password format';
END $$;

-- Step 10: Final attempt with standard bcrypt
UPDATE auth.users 
SET encrypted_password = crypt('AIhow@NewAdmin2025', gen_salt('bf'))
WHERE email = 'support@kdadks.com';

-- Step 11: Success message with troubleshooting steps
SELECT 
    '🔧 AUTH DIAGNOSIS AND FIX COMPLETED' as status,
    'Email: support@kdadks.com' as login_email,
    'Password: AIhow@NewAdmin2025' as login_password,
    'If still failing, check browser console for errors' as troubleshooting_1,
    'Try clearing browser cache/localStorage' as troubleshooting_2,
    'Check Supabase project URL and API keys' as troubleshooting_3;

-- Step 12: Show what to check in browser console
SELECT 
    'BROWSER CONSOLE DEBUGGING:' as info,
    'Look for: POST /auth/v1/token errors' as check_1,
    'Check: localStorage.getItem("supabase.auth.token")' as check_2,
    'Verify: Supabase client configuration' as check_3,
    'Test: Direct API call to Supabase auth endpoint' as check_4;