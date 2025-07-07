-- Create saved_bundles table for user's saved bundle collections
CREATE TABLE IF NOT EXISTS public.saved_bundles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    bundle_id TEXT NOT NULL,
    bundle_name TEXT NOT NULL,
    bundle_description TEXT,
    total_cost TEXT,
    bundle_type TEXT DEFAULT 'bundle' CHECK (bundle_type IN ('bundle', 'workflow')),
    is_custom BOOLEAN DEFAULT false,
    tools JSONB,
    bundle_data JSONB,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create saved_workflows table for user's custom workflows
CREATE TABLE IF NOT EXISTS public.saved_workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workflow_id TEXT NOT NULL,
    workflow_name TEXT NOT NULL,
    workflow_description TEXT,
    use_case TEXT,
    total_cost NUMERIC DEFAULT 0,
    tools JSONB NOT NULL DEFAULT '[]',
    metadata JSONB NOT NULL DEFAULT '{}',
    workflow_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create workflow_drafts table for draft management
CREATE TABLE IF NOT EXISTS public.workflow_drafts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    draft_name TEXT NOT NULL,
    workflow_data JSONB NOT NULL DEFAULT '{}',
    auto_saved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.saved_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_drafts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for saved_bundles
CREATE POLICY "Users can view their own saved bundles" ON public.saved_bundles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved bundles" ON public.saved_bundles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved bundles" ON public.saved_bundles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved bundles" ON public.saved_bundles
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for saved_workflows
CREATE POLICY "Users can view their own saved workflows" ON public.saved_workflows
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved workflows" ON public.saved_workflows
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved workflows" ON public.saved_workflows
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved workflows" ON public.saved_workflows
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for workflow_drafts
CREATE POLICY "Users can view their own workflow drafts" ON public.workflow_drafts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workflow drafts" ON public.workflow_drafts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflow drafts" ON public.workflow_drafts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflow drafts" ON public.workflow_drafts
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at triggers
CREATE TRIGGER handle_updated_at_saved_bundles
    BEFORE UPDATE ON public.saved_bundles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_saved_workflows
    BEFORE UPDATE ON public.saved_workflows
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_workflow_drafts
    BEFORE UPDATE ON public.workflow_drafts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_bundles_user_id ON public.saved_bundles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_bundles_bundle_id ON public.saved_bundles(bundle_id);
CREATE INDEX IF NOT EXISTS idx_saved_workflows_user_id ON public.saved_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_workflows_workflow_id ON public.saved_workflows(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_drafts_user_id ON public.workflow_drafts(user_id);