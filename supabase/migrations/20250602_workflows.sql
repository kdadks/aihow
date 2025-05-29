-- Create workflows table
CREATE TABLE workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    tags TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb,
    version INTEGER DEFAULT 1,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Create tool_bundles table
CREATE TABLE tool_bundles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    tools JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    tags TEXT[],
    category TEXT,
    version INTEGER DEFAULT 1
);

-- Create user_saved_items table for bookmarking workflows and bundles
CREATE TABLE user_saved_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('workflow', 'bundle')),
    saved_at TIMESTAMPTZ DEFAULT now(),
    notes TEXT,
    UNIQUE(user_id, item_id, item_type)
);

-- Create indexes for performance optimization

-- Workflows indexes
CREATE INDEX idx_workflows_creator ON workflows(creator_id);
CREATE INDEX idx_workflows_public ON workflows(is_public) WHERE is_public = true;
CREATE INDEX idx_workflows_status ON workflows(status, is_public);
CREATE INDEX idx_workflows_tags ON workflows USING gin(tags);

-- Tool bundles indexes
CREATE INDEX idx_bundles_creator ON tool_bundles(creator_id);
CREATE INDEX idx_bundles_public ON tool_bundles(is_public) WHERE is_public = true;
CREATE INDEX idx_bundles_category ON tool_bundles(category);
CREATE INDEX idx_bundles_tags ON tool_bundles USING gin(tags);

-- User saved items indexes
CREATE INDEX idx_saved_items_user ON user_saved_items(user_id);
CREATE INDEX idx_saved_items_type ON user_saved_items(item_type);
CREATE INDEX idx_saved_items_lookup ON user_saved_items(user_id, item_type);

-- Enable Row Level Security
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_items ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Workflows policies
CREATE POLICY "Public workflows are viewable by everyone"
    ON workflows FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can view their own workflows"
    ON workflows FOR SELECT
    USING (creator_id = auth.uid());

CREATE POLICY "Users can create their own workflows"
    ON workflows FOR INSERT
    WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own workflows"
    ON workflows FOR UPDATE
    USING (creator_id = auth.uid())
    WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can delete their own workflows"
    ON workflows FOR DELETE
    USING (creator_id = auth.uid());

-- Tool bundles policies
CREATE POLICY "Public bundles are viewable by everyone"
    ON tool_bundles FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can view their own bundles"
    ON tool_bundles FOR SELECT
    USING (creator_id = auth.uid());

CREATE POLICY "Users can create their own bundles"
    ON tool_bundles FOR INSERT
    WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own bundles"
    ON tool_bundles FOR UPDATE
    USING (creator_id = auth.uid())
    WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can delete their own bundles"
    ON tool_bundles FOR DELETE
    USING (creator_id = auth.uid());

-- User saved items policies
CREATE POLICY "Users can view their own saved items"
    ON user_saved_items FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can save items"
    ON user_saved_items FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their saved items"
    ON user_saved_items FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their saved items"
    ON user_saved_items FOR DELETE
    USING (user_id = auth.uid());

-- Admin policies for all tables
CREATE POLICY "Admins have full access to workflows"
    ON workflows
    AS PERMISSIVE
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles WHERE role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM user_roles WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins have full access to tool bundles"
    ON tool_bundles
    AS PERMISSIVE
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles WHERE role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM user_roles WHERE role = 'admin'
        )
    );

CREATE POLICY "Admins have full access to saved items"
    ON user_saved_items
    AS PERMISSIVE
    FOR ALL
    USING (
        auth.uid() IN (
            SELECT user_id FROM user_roles WHERE role = 'admin'
        )
    )
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM user_roles WHERE role = 'admin'
        )
    );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workflows_updated_at
    BEFORE UPDATE ON workflows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tool_bundles_updated_at
    BEFORE UPDATE ON tool_bundles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();