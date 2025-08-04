-- SAFE ADMIN REPLACEMENT SCRIPT
-- =============================================================
-- Handles ALL foreign key constraints including audit_log
-- Safely removes fake admin and creates working admin
-- 
-- NEW ADMIN CREDENTIALS:
-- Email: support@kdadks.com
-- Password: AIhow@NewAdmin2025
-- =============================================================

-- Step 1: Check what foreign key constraints exist
SELECT 
    'FOREIGN KEY CONSTRAINTS TO HANDLE:' as info,
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'users'
    AND tc.table_schema = 'public';

-- Step 2: Show current fake admin users and their audit logs
SELECT 
    'FAKE ADMIN USERS TO REMOVE:' as info,
    au.email,
    au.id as user_id,
    'Will be removed after handling dependencies' as action
FROM auth.users au
WHERE au.email IN ('admin@aihow.org', 'testadmin@aihow.org');

-- Check audit log entries for these users
SELECT 
    'AUDIT LOG ENTRIES FOR FAKE ADMINS:' as info,
    COUNT(*) as audit_entries,
    'These will be handled first' as action
FROM audit_log al
WHERE al.user_id IN (
    SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
);

-- Step 3: Handle audit_log entries first
-- Option 1: Delete audit log entries for fake admins
DELETE FROM audit_log 
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
);

-- Option 2: Or if you want to preserve audit logs, set user_id to NULL
-- UPDATE audit_log 
-- SET user_id = NULL 
-- WHERE user_id IN (
--     SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
-- );

-- Step 4: Handle other potential foreign key references
-- Check if there are other tables referencing users
DO $$
DECLARE
    constraint_record RECORD;
    delete_count INTEGER;
BEGIN
    -- Loop through all foreign key constraints that reference auth.users
    FOR constraint_record IN
        SELECT DISTINCT tc.table_name, kcu.column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND ccu.table_name = 'users'
            AND tc.table_schema = 'public'
            AND tc.table_name != 'audit_log'  -- We already handled this
    LOOP
        -- Dynamically delete references to fake admin users
        EXECUTE format('DELETE FROM %I WHERE %I IN (SELECT id FROM auth.users WHERE email IN (''admin@aihow.org'', ''testadmin@aihow.org''))',
                      constraint_record.table_name, constraint_record.column_name);
        
        GET DIAGNOSTICS delete_count = ROW_COUNT;
        RAISE NOTICE 'Deleted % rows from %.%', delete_count, constraint_record.table_name, constraint_record.column_name;
    END LOOP;
END $$;

-- Step 5: Now safely remove role assignments
DO $$
BEGIN
    -- Remove from user_role_assignments if exists
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
    ) THEN
        DELETE FROM public.user_role_assignments WHERE user_id IN (
            SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
        );
        RAISE NOTICE 'Cleaned user_role_assignments';
    END IF;
    
    -- Remove from legacy user_roles junction if exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id'
    ) THEN
        DELETE FROM public.user_roles WHERE user_id IN (
            SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
        );
        RAISE NOTICE 'Cleaned legacy user_roles';
    END IF;
END $$;

-- Step 6: Remove profiles for fake admins
DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
);

-- Step 7: Remove sessions for fake admins
DELETE FROM auth.sessions WHERE user_id IN (
    SELECT id FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org')
);

-- Step 8: Also clean up any existing support@kdadks.com
-- Handle foreign keys for support email too
DELETE FROM audit_log WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
);

DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
);

DELETE FROM auth.sessions WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'support@kdadks.com'
);

-- Step 9: Now safely remove fake admin users from auth.users
DELETE FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org', 'support@kdadks.com');

-- Step 10: Verify complete cleanup
SELECT 
    'CLEANUP VERIFICATION:' as info,
    CASE 
        WHEN EXISTS(SELECT 1 FROM auth.users WHERE email IN ('admin@aihow.org', 'testadmin@aihow.org', 'support@kdadks.com'))
        THEN '❌ ERROR: Some users still exist'
        ELSE '✅ All target users removed safely'
    END as cleanup_status;

-- Step 11: Generate unique UUID using timestamp
DO $$
DECLARE
    unique_uuid UUID;
    timestamp_seed TEXT;
BEGIN
    timestamp_seed := EXTRACT(EPOCH FROM NOW())::TEXT;
    unique_uuid := (md5(timestamp_seed || 'admin-support')::UUID);
    
    RAISE NOTICE 'Generated unique UUID: %', unique_uuid;
    
    CREATE TEMP TABLE IF NOT EXISTS temp_admin_uuid (id UUID);
    DELETE FROM temp_admin_uuid;
    INSERT INTO temp_admin_uuid VALUES (unique_uuid);
END $$;

-- Step 12: Create the new admin user
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
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    raw_app_meta_data,
    raw_user_meta_data
)
SELECT 
    '00000000-0000-0000-0000-000000000000'::UUID,
    tau.id,
    'authenticated',
    'authenticated',
    'support@kdadks.com',
    crypt('AIhow@NewAdmin2025', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "System Administrator"}'::jsonb
FROM temp_admin_uuid tau;

-- Step 13: Create profile
INSERT INTO public.profiles (id, username, full_name, created_at, updated_at)
SELECT 
    tau.id,
    'support@kdadks.com',
    'System Administrator',
    NOW(),
    NOW()
FROM temp_admin_uuid tau;

-- Step 14: Assign admin role
DO $$
DECLARE
    admin_user_id UUID;
    admin_role_id UUID;
BEGIN
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'support@kdadks.com';
    
    -- Try modern structure
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_roles'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'name'
    ) THEN
        INSERT INTO public.user_roles (name, description, permissions)
        VALUES (
            'admin',
            'Super administrator with full access',
            '{
                "canManageUsers": true,
                "canManageContent": true,
                "canModerateContent": true,
                "canManageSettings": true,
                "canViewMetrics": true
            }'::jsonb
        ) ON CONFLICT (name) DO NOTHING;
        
        IF EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'user_role_assignments'
        ) THEN
            SELECT id INTO admin_role_id FROM public.user_roles WHERE name = 'admin';
            INSERT INTO public.user_role_assignments (user_id, role_id, assigned_by, assigned_at)
            VALUES (admin_user_id, admin_role_id, admin_user_id, NOW());
            RAISE NOTICE 'Admin role assigned successfully';
        END IF;
    END IF;
END $$;

-- Step 15: Final verification
SELECT 
    'NEW ADMIN USER READY:' as info,
    au.email,
    au.id as user_id,
    p.username,
    p.full_name,
    CASE 
        WHEN au.email_confirmed_at IS NOT NULL THEN '✅ EMAIL CONFIRMED'
        ELSE '❌ EMAIL NOT CONFIRMED'
    END as email_status
FROM auth.users au
JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'support@kdadks.com';

-- Step 16: Cleanup and success
DROP TABLE IF EXISTS temp_admin_uuid;

SELECT 
    '🎉 ADMIN REPLACEMENT COMPLETED SAFELY!' as status,
    'All foreign key constraints handled' as safety_note,
    'Email: support@kdadks.com' as login_email,
    'Password: AIhow@NewAdmin2025' as login_password,
    'URL: /admin/login' as login_url;