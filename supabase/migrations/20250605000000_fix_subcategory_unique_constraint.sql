-- Fix subcategory slug to be unique per parent category instead of globally unique
-- This allows the same subcategory name (e.g., "video-editing") to exist in multiple categories

-- Drop the existing unique constraint on slug
ALTER TABLE subcategories_v2 DROP CONSTRAINT IF EXISTS subcategories_v2_slug_key;

-- Add a unique constraint on the combination of slug and parent_category_id
ALTER TABLE subcategories_v2
  ADD CONSTRAINT subcategories_v2_slug_parent_key
  UNIQUE (slug, parent_category_id);

-- Update the tools_v2_with_categories view to ensure it still works
DROP VIEW IF EXISTS tools_v2_with_categories;

CREATE VIEW tools_v2_with_categories AS
SELECT
  t.*,
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
  ) FILTER (WHERE s.id IS NOT NULL) as subcategories
FROM tools_v2 t
LEFT JOIN tool_subcategories_v2 ts ON t.id = ts.tool_id
LEFT JOIN subcategories_v2 s ON ts.subcategory_id = s.id
LEFT JOIN tool_categories_v2 c ON s.parent_category_id = c.id
GROUP BY t.id;
