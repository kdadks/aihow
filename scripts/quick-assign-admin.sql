-- Quick admin role assignment for a specific user
-- Replace 'YOUR_EMAIL_HERE' with your actual admin email

-- Disable RLS temporarily
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Assign admin role to specific user
INSERT INTO public.user_roles (user_id, role_id, assigned_at, created_at)
SELECT 
    u.id,
    r.id,
    NOW(),
    NOW()
FROM auth.users u
CROSS JOIN public.roles r
WHERE u.email = 'prashantsinghkanyal@gmail.com'  -- Change this to your email
AND r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Verify assignment
SELECT 
    u.email,
    r.name as role,
    r.permissions
FROM auth.users u
JOIN public.user_roles ur ON ur.user_id = u.id
JOIN public.roles r ON r.id = ur.role_id
WHERE u.email = 'prashantsinghkanyal@gmail.com';
