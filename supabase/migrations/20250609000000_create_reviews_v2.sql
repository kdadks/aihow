-- ============================================================
-- Create tool_reviews_v2 table for V2 schema
-- ============================================================

CREATE TABLE IF NOT EXISTS tool_reviews_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID NOT NULL REFERENCES tools_v2(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name VARCHAR(200) NOT NULL,
    user_email VARCHAR(255),
    user_avatar TEXT,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    title VARCHAR(200),
    content TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    unhelpful_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('published', 'pending', 'rejected')),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tool_reviews_v2_tool ON tool_reviews_v2(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_v2_user ON tool_reviews_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_v2_rating ON tool_reviews_v2(rating DESC);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_v2_status ON tool_reviews_v2(status);
CREATE INDEX IF NOT EXISTS idx_tool_reviews_v2_created ON tool_reviews_v2(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER set_tool_reviews_v2_updated_at
    BEFORE UPDATE ON tool_reviews_v2
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE tool_reviews_v2 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Reviews are viewable by everyone"
    ON tool_reviews_v2 FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authenticated users can create reviews"
    ON tool_reviews_v2 FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own reviews"
    ON tool_reviews_v2 FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON tool_reviews_v2 FOR DELETE
    USING (auth.uid() = user_id);

-- Note: Admin management can be handled via Supabase Dashboard or service role
-- For now, authenticated users can manage their own reviews via the policies above
