-- Create user_role_assignments table
CREATE TABLE IF NOT EXISTS public.user_role_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_role_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own role assignments" 
    ON public.user_role_assignments
    FOR SELECT 
    TO authenticated 
    USING (user_id = auth.uid());

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_user_id 
    ON public.user_role_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_role_assignments_role_id 
    ON public.user_role_assignments(role_id);
