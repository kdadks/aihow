-- Assign admin role to existing admin users
-- Run this after applying the migration

-- Temporarily disable RLS to allow initial admin assignment
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- First, check if we have the admin role
DO $$
DECLARE
    admin_role_id INTEGER;
    admin_user_id UUID;
    assignment_count INTEGER := 0;
BEGIN
    -- Get the admin role ID
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin' LIMIT 1;
    
    IF admin_role_id IS NULL THEN
        RAISE NOTICE 'Admin role not found. Please run the migration first.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Admin role ID: %', admin_role_id;
    
    -- Find all users with email containing 'admin' or who should be admins
    -- Update this query to match your admin user(s)
    FOR admin_user_id IN 
        SELECT id FROM auth.users 
        WHERE email LIKE '%admin%' 
        OR email = 'prashantsinghkanyal@gmail.com'  -- Update with your admin email
    LOOP
        RAISE NOTICE 'Assigning admin role to user: %', admin_user_id;
        
        -- Insert role assignment if it doesn't exist
        INSERT INTO public.user_roles (user_id, role_id, assigned_at, created_at)
        VALUES (admin_user_id, admin_role_id, NOW(), NOW())
        ON CONFLICT (user_id, role_id) DO NOTHING;
        
        assignment_count := assignment_count + 1;
        RAISE NOTICE 'Admin role assigned successfully to user: %', admin_user_id;
    END LOOP;
    
    RAISE NOTICE 'Total admin roles assigned: %', assignment_count;
END $$;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Verify the assignments
SELECT 
    u.id,
    u.email,
    r.name as role_name,
    r.permissions,
    ur.assigned_at
FROM auth.users u
JOIN public.user_roles ur ON ur.user_id = u.id
JOIN public.roles r ON r.id = ur.role_id
WHERE r.name IN ('admin', 'system_admin')
ORDER BY ur.assigned_at DESC;
