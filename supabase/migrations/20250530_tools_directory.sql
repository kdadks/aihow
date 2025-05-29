-- Create tool_categories table
CREATE TABLE tool_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create tools table
CREATE TABLE tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    website_url VARCHAR(500),
    category_id UUID REFERENCES tool_categories(id),
    pricing_type VARCHAR(50),
    features JSONB,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create tool_reviews table
CREATE TABLE tool_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    upvotes INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tool_id, user_id)
);

-- Performance optimization indexes
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tool_reviews_tool ON tool_reviews(tool_id);
CREATE INDEX idx_tool_reviews_user ON tool_reviews(user_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_search ON tools USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- RLS Policies

-- Tool Categories Policies
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tool categories are viewable by everyone" 
    ON tool_categories FOR SELECT 
    USING (true);

CREATE POLICY "Tool categories can be created by admins" 
    ON tool_categories FOR INSERT 
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    ));

CREATE POLICY "Tool categories can be updated by admins" 
    ON tool_categories FOR UPDATE 
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    ));

-- Tools Policies
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tools are viewable by everyone" 
    ON tools FOR SELECT 
    USING (status = 'active');

CREATE POLICY "Tools can be created by admins" 
    ON tools FOR INSERT 
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    ));

CREATE POLICY "Tools can be updated by admins" 
    ON tools FOR UPDATE 
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.users.id = auth.uid()
        AND auth.users.role = 'admin'
    ));

-- Tool Reviews Policies
ALTER TABLE tool_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tool reviews are viewable by everyone" 
    ON tool_reviews FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Users can create their own reviews" 
    ON tool_reviews FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
    ON tool_reviews FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tool_categories_updated_at
    BEFORE UPDATE ON tool_categories
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tool_reviews_updated_at
    BEFORE UPDATE ON tool_reviews
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();