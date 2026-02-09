-- ============================================================
-- CORRECTED VERSION - Run this in your Supabase SQL Editor
-- This fixes the type mismatch error (42804)
-- ============================================================

-- Function to get all users with their real email addresses
CREATE OR REPLACE FUNCTION public.get_all_users_with_emails(
    page_number INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10
)
RETURNS TABLE(
    id UUID,
    email TEXT,
    username TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    offset_value INTEGER;
BEGIN
    offset_value := (page_number - 1) * page_size;
    
    RETURN QUERY
    SELECT 
        u.id,
        u.email::TEXT,
        COALESCE(p.username, '')::TEXT as username,
        COALESCE(p.full_name, '')::TEXT as full_name,
        u.created_at,
        COALESCE(p.updated_at, u.created_at) as updated_at,
        u.last_sign_in_at,
        true as is_active
    FROM auth.users u
    LEFT JOIN public.profiles p ON p.id = u.id
    ORDER BY u.created_at DESC
    LIMIT page_size
    OFFSET offset_value;
END;
$$;

-- Function to get a single user by ID with real email
CREATE OR REPLACE FUNCTION public.get_user_with_email(user_id UUID)
RETURNS TABLE(
    id UUID,
    email TEXT,
    username TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email::TEXT,
        COALESCE(p.username, '')::TEXT as username,
        COALESCE(p.full_name, '')::TEXT as full_name,
        u.created_at,
        COALESCE(p.updated_at, u.created_at) as updated_at,
        u.last_sign_in_at,
        true as is_active
    FROM auth.users u
    LEFT JOIN public.profiles p ON p.id = u.id
    WHERE u.id = user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_all_users_with_emails(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_with_email(UUID) TO authenticated;

-- Add comments
COMMENT ON FUNCTION public.get_all_users_with_emails IS 'Returns all users with their real email addresses from auth.users - for admin panel';
COMMENT ON FUNCTION public.get_user_with_email IS 'Returns a single user with real email address from auth.users - for admin panel';
