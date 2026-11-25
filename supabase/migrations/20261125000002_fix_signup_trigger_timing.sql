-- Migration: 20261125000002_fix_signup_trigger_timing.sql
-- Description: Switches registration trigger to AFTER INSERT so foreign key constraint succeeds.

CREATE OR REPLACE FUNCTION shared.handle_strict_user_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = shared, auth, pg_temp
AS $$
DECLARE
    assigned_project TEXT;
BEGIN
    assigned_project := NEW.raw_user_meta_data->>'project_id';

    IF assigned_project IS NULL OR assigned_project NOT IN ('how2doai', 'nirchal') THEN
        assigned_project := 'how2doai';
    END IF;

    -- 1. Insert binding (succeeds because row is already present in auth.users)
    INSERT INTO shared.user_project_binding (user_id, project_id, role)
    VALUES (NEW.id, assigned_project, 'user')
    ON CONFLICT (user_id) DO NOTHING;

    -- 2. Stamp project_id into raw_app_meta_data
    UPDATE auth.users
    SET raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{project_id}',
        to_jsonb(assigned_project)
    )
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_project_binding ON auth.users;
CREATE TRIGGER on_auth_user_created_project_binding
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION shared.handle_strict_user_registration();
