-- Function to safely get auth user information
CREATE OR REPLACE FUNCTION auth_user_info(user_email text)
RETURNS json
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (
        SELECT json_build_object(
            'id', au.id,
            'email', au.email,
            'email_confirmed_at', au.email_confirmed_at,
            'last_sign_in_at', au.last_sign_in_at,
            'raw_user_meta_data', au.raw_user_meta_data,
            'created_at', au.created_at
        )
        FROM auth.users au
        WHERE au.email = user_email
    );
END;
$$;

-- Grant execute permission to the service_role
GRANT EXECUTE ON FUNCTION auth_user_info TO service_role;