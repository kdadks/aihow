-- Create user_role_assignments table with proper structure
DO $$ 
BEGIN
    CREATE TABLE IF NOT EXISTS public.user_role_assignments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL,
        role_id INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT user_role_unique UNIQUE(user_id, role_id),
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
        CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE
    );
EXCEPTION
    WHEN duplicate_table THEN
        NULL;
END $$;

-- Enable Row Level Security
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read their own role assignments" ON public.user_role_assignments;
    
    CREATE POLICY "Users can read their own role assignments" 
        ON public.user_role_assignments
        FOR SELECT 
        TO authenticated 
        USING (user_id = auth.uid());

    DROP POLICY IF EXISTS "Allow admins to manage role assignments" ON public.user_role_assignments;
        
    CREATE POLICY "Allow admins to manage role assignments" 
        ON public.user_role_assignments
        FOR ALL
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM public.roles r
                INNER JOIN public.user_role_assignments ura ON ura.role_id = r.id
                WHERE ura.user_id = auth.uid()
                AND r.name = 'admin'
            )
        );
END $$;
