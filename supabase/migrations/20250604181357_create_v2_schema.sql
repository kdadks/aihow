-- ============================================================
-- Tools V2 Migration: Create V2 Schema
-- Phase 1 - Day 1
-- ============================================================

-- ============================================================
-- 1. updated_at trigger function (shared)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. tool_categories_v2
-- ============================================================
CREATE TABLE IF NOT EXISTS tool_categories_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tool_categories_v2_slug ON tool_categories_v2(slug);
CREATE INDEX IF NOT EXISTS idx_tool_categories_v2_display_order ON tool_categories_v2(display_order);

CREATE TRIGGER set_tool_categories_v2_updated_at
    BEFORE UPDATE ON tool_categories_v2
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. subcategories_v2
-- ============================================================
CREATE TABLE IF NOT EXISTS subcategories_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id UUID NOT NULL REFERENCES tool_categories_v2(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subcategories_v2_slug ON subcategories_v2(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_v2_parent ON subcategories_v2(parent_category_id);

CREATE TRIGGER set_subcategories_v2_updated_at
    BEFORE UPDATE ON subcategories_v2
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. tools_v2
-- ============================================================
CREATE TABLE IF NOT EXISTS tools_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    website_url VARCHAR(500),
    features JSONB DEFAULT '[]'::JSONB,
    limitations TEXT[] DEFAULT ARRAY[]::TEXT[],
    pricing JSONB DEFAULT '{}'::JSONB,
    integrations TEXT[] DEFAULT ARRAY[]::TEXT[],
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    trending BOOLEAN DEFAULT false,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    metadata JSONB DEFAULT '{}'::JSONB,
    last_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tools_v2_slug ON tools_v2(slug);
CREATE INDEX IF NOT EXISTS idx_tools_v2_status ON tools_v2(status);
CREATE INDEX IF NOT EXISTS idx_tools_v2_featured ON tools_v2(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_tools_v2_trending ON tools_v2(trending) WHERE trending = true;
CREATE INDEX IF NOT EXISTS idx_tools_v2_rating ON tools_v2(rating DESC);
CREATE INDEX IF NOT EXISTS idx_tools_v2_fts ON tools_v2 USING gin(
    to_tsvector('english', name || ' ' || COALESCE(short_description, '') || ' ' || COALESCE(description, ''))
);

CREATE TRIGGER set_tools_v2_updated_at
    BEFORE UPDATE ON tools_v2
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. tool_subcategories_v2 (junction table)
-- ============================================================
CREATE TABLE IF NOT EXISTS tool_subcategories_v2 (
    tool_id UUID NOT NULL REFERENCES tools_v2(id) ON DELETE CASCADE,
    subcategory_id UUID NOT NULL REFERENCES subcategories_v2(id) ON DELETE CASCADE,
    PRIMARY KEY (tool_id, subcategory_id)
);

CREATE INDEX IF NOT EXISTS idx_tool_subcategories_v2_tool ON tool_subcategories_v2(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_subcategories_v2_sub ON tool_subcategories_v2(subcategory_id);

-- ============================================================
-- 6. tool_bundles_v2
-- ============================================================
CREATE TABLE IF NOT EXISTS tool_bundles_v2 (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    implementation_steps TEXT[] DEFAULT ARRAY[]::TEXT[],
    total_cost VARCHAR(100),
    tools JSONB NOT NULL DEFAULT '[]'::JSONB,
    category VARCHAR(100),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tool_bundles_v2_slug ON tool_bundles_v2(slug);
CREATE INDEX IF NOT EXISTS idx_tool_bundles_v2_category ON tool_bundles_v2(category);
CREATE INDEX IF NOT EXISTS idx_tool_bundles_v2_featured ON tool_bundles_v2(featured) WHERE featured = true;

CREATE TRIGGER set_tool_bundles_v2_updated_at
    BEFORE UPDATE ON tool_bundles_v2
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. Row Level Security Policies
-- ============================================================

-- tool_categories_v2: public read, admin write
ALTER TABLE tool_categories_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories v2"
    ON tool_categories_v2 FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage categories v2"
    ON tool_categories_v2 FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- subcategories_v2: public read, admin write
ALTER TABLE subcategories_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read subcategories v2"
    ON subcategories_v2 FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage subcategories v2"
    ON subcategories_v2 FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- tools_v2: public read active tools, admin write
ALTER TABLE tools_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active tools v2"
    ON tools_v2 FOR SELECT
    USING (status = 'active');

CREATE POLICY "Admins can manage tools v2"
    ON tools_v2 FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- tool_subcategories_v2: public read, admin write
ALTER TABLE tool_subcategories_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read tool subcategories v2"
    ON tool_subcategories_v2 FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage tool subcategories v2"
    ON tool_subcategories_v2 FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- tool_bundles_v2: public read active bundles, admin write
ALTER TABLE tool_bundles_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active bundles v2"
    ON tool_bundles_v2 FOR SELECT
    USING (status = 'active');

CREATE POLICY "Admins can manage bundles v2"
    ON tool_bundles_v2 FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name = 'admin'
        )
    );

-- ============================================================
-- 8. Helpful view: tools with their subcategory + category info
-- ============================================================
CREATE OR REPLACE VIEW tools_v2_with_categories AS
SELECT
    t.*,
    COALESCE(
        json_agg(
            json_build_object(
                'id', s.id,
                'slug', s.slug,
                'name', s.name,
                'description', s.description,
                'parent_category_id', s.parent_category_id,
                'category_slug', c.slug,
                'category_name', c.name,
                'category_icon', c.icon
            )
        ) FILTER (WHERE s.id IS NOT NULL),
        '[]'::JSON
    ) AS subcategories
FROM tools_v2 t
LEFT JOIN tool_subcategories_v2 ts ON t.id = ts.tool_id
LEFT JOIN subcategories_v2 s ON ts.subcategory_id = s.id
LEFT JOIN tool_categories_v2 c ON s.parent_category_id = c.id
GROUP BY t.id;
