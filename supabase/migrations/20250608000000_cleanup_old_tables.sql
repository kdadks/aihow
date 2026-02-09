-- ============================================================
-- Cleanup Migration: Remove Old V1 Tables
-- ============================================================
-- This migration removes the old V1 tables that have been replaced by V2
-- Run this ONLY after confirming V2 tables are working correctly

-- Drop old tool-related tables and their dependencies
-- Order matters: drop dependent objects first

-- Drop policies first
DROP POLICY IF EXISTS "Tool reviews are viewable by everyone" ON tool_reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON tool_reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON tool_reviews;

DROP POLICY IF EXISTS "Tools are viewable by everyone" ON tools;
DROP POLICY IF EXISTS "Tools can be created by admins" ON tools;
DROP POLICY IF EXISTS "Tools can be updated by admins" ON tools;

DROP POLICY IF EXISTS "Tool categories are viewable by everyone" ON tool_categories;
DROP POLICY IF EXISTS "Tool categories can be created by admins" ON tool_categories;
DROP POLICY IF EXISTS "Tool categories can be updated by admins" ON tool_categories;

DROP POLICY IF EXISTS "Public bundles are viewable by everyone" ON tool_bundles;
DROP POLICY IF EXISTS "Users can view their own bundles" ON tool_bundles;
DROP POLICY IF EXISTS "Users can create their own bundles" ON tool_bundles;
DROP POLICY IF EXISTS "Users can update their own bundles" ON tool_bundles;
DROP POLICY IF EXISTS "Users can delete their own bundles" ON tool_bundles;
DROP POLICY IF EXISTS "Admins have full access to tool bundles" ON tool_bundles;

-- Drop triggers
DROP TRIGGER IF EXISTS update_tools_updated_at ON tools;
DROP TRIGGER IF EXISTS update_tool_categories_updated_at ON tool_categories;
DROP TRIGGER IF EXISTS update_tool_reviews_updated_at ON tool_reviews;
DROP TRIGGER IF EXISTS update_tool_bundles_updated_at ON tool_bundles;

-- Drop indexes
DROP INDEX IF EXISTS idx_tools_category;
DROP INDEX IF EXISTS idx_tool_reviews_tool;
DROP INDEX IF EXISTS idx_tool_reviews_user;
DROP INDEX IF EXISTS idx_tools_status;
DROP INDEX IF EXISTS idx_tools_search;
DROP INDEX IF EXISTS idx_bundles_creator;
DROP INDEX IF EXISTS idx_bundles_public;
DROP INDEX IF EXISTS idx_bundles_category;
DROP INDEX IF EXISTS idx_bundles_tags;

-- Drop old tables (in correct order to respect foreign keys)
DROP TABLE IF EXISTS tool_reviews CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS tool_categories CASCADE;
DROP TABLE IF EXISTS tool_bundles CASCADE;

-- Note: We're keeping the following tables as they may still be in use:
-- - workflows (user-created workflows)
-- - user_saved_items (user bookmarks)

-- Add a comment to track this cleanup
COMMENT ON TABLE tool_categories_v2 IS 'V2 schema - old tool_categories table removed in migration 20250608000000';
COMMENT ON TABLE tools_v2 IS 'V2 schema - old tools table removed in migration 20250608000000';
COMMENT ON TABLE tool_bundles_v2 IS 'V2 schema - old tool_bundles table removed in migration 20250608000000';
