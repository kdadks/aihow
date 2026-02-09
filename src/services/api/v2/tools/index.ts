/**
 * Tools V2 Migration - Tools API Service
 *
 * React Query hooks for fetching tools from the v2 Supabase tables.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ToolV2 } from '@/types/tool.types';

// ============================================================
// Query key factory
// ============================================================
export const toolKeys = {
  all: ['tools-v2'] as const,
  lists: () => [...toolKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...toolKeys.lists(), filters] as const,
  detail: (slug: string) => [...toolKeys.all, 'detail', slug] as const,
  featured: () => [...toolKeys.all, 'featured'] as const,
  trending: () => [...toolKeys.all, 'trending'] as const,
  search: (query: string) => [...toolKeys.all, 'search', query] as const,
  byCategory: (categorySlug: string) => [...toolKeys.all, 'category', categorySlug] as const,
  bySubcategory: (subcategorySlug: string) =>
    [...toolKeys.all, 'subcategory', subcategorySlug] as const,
};

// ============================================================
// Filter params type
// ============================================================
export interface ToolListParams {
  categorySlug?: string;
  subcategorySlug?: string;
  limit?: number;
  offset?: number;
  status?: 'active' | 'inactive' | 'pending';
}

// ============================================================
// Internal query builder helpers
// ============================================================

/** Base select — tool with all its subcategory/category info */
const TOOL_WITH_SUBCATEGORIES = `
  *,
  tool_subcategories_v2!left (
    subcategories_v2 (
      id,
      slug,
      name,
      description,
      parent_category_id,
      tool_categories_v2 (
        slug,
        name,
        icon
      )
    )
  )
`;

function mapSubcategories(raw: ToolV2 & Record<string, unknown>): ToolV2 {
  const junctionRows =
    (raw.tool_subcategories_v2 as Array<{ subcategories_v2: unknown }> | undefined) ?? [];

  const subcategories = junctionRows
    .map((row) => {
      const sub = row.subcategories_v2 as
        | (Record<string, unknown> & { tool_categories_v2?: Record<string, unknown> })
        | null;
      if (!sub) return null;
      return {
        id: sub.id as string,
        slug: sub.slug as string,
        name: sub.name as string,
        description: (sub.description as string) ?? null,
        parent_category_id: sub.parent_category_id as string,
        category_slug: (sub.tool_categories_v2?.slug as string) ?? '',
        category_name: (sub.tool_categories_v2?.name as string) ?? '',
        category_icon: (sub.tool_categories_v2?.icon as string) ?? null,
      };
    })
    .filter(Boolean);

  const { tool_subcategories_v2: _, ...tool } = raw as Record<string, unknown>;
  return { ...(tool as ToolV2), subcategories } as ToolV2;
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch a paginated list of tools with optional category/subcategory filtering.
 */
export function useTools(params: ToolListParams = {}) {
  const { categorySlug, subcategorySlug, limit = 24, offset = 0, status = 'active' } = params;

  return useQuery({
    queryKey: toolKeys.list(params),
    queryFn: async (): Promise<{ tools: ToolV2[]; count: number }> => {
      // If filtering by category or subcategory, we need to get IDs first
      if (subcategorySlug || categorySlug) {
        // Get subcategory/category IDs
        let subcategoryIds: string[] = [];

        if (subcategorySlug) {
          // Get specific subcategory - must also filter by category if provided
          // to avoid ambiguity (e.g., "coding-assistants" exists under multiple categories)
          if (categorySlug) {
            // Get category ID first
            const { data: categoryData } = await supabase
              .from('tool_categories_v2')
              .select('id')
              .eq('slug', categorySlug)
              .maybeSingle();

            if (categoryData) {
              // Get subcategory under this specific category
              const { data: subData } = await supabase
                .from('subcategories_v2')
                .select('id')
                .eq('slug', subcategorySlug)
                .eq('parent_category_id', categoryData.id)
                .maybeSingle();

              if (subData) subcategoryIds = [subData.id];
            }
          } else {
            // No category specified, get ALL subcategories with this slug
            const { data: subData } = await supabase
              .from('subcategories_v2')
              .select('id')
              .eq('slug', subcategorySlug);

            subcategoryIds = (subData ?? []).map(s => s.id);
          }
        } else if (categorySlug) {
          // Get all subcategories for this category
          const { data: categoryData } = await supabase
            .from('tool_categories_v2')
            .select('id')
            .eq('slug', categorySlug)
            .maybeSingle();

          if (categoryData) {
            const { data: subsData } = await supabase
              .from('subcategories_v2')
              .select('id')
              .eq('parent_category_id', categoryData.id);

            subcategoryIds = (subsData ?? []).map(s => s.id);
          }
        }

        // Get tool IDs that belong to these subcategories
        if (subcategoryIds.length > 0) {
          const { data: toolSubData } = await supabase
            .from('tool_subcategories_v2')
            .select('tool_id')
            .in('subcategory_id', subcategoryIds);

          const toolIds = [...new Set((toolSubData ?? []).map(ts => ts.tool_id))];

          if (toolIds.length === 0) {
            return { tools: [], count: 0 };
          }

          // Now fetch the tools
          const { data, error, count } = await supabase
            .from('tools_v2')
            .select(TOOL_WITH_SUBCATEGORIES, { count: 'exact' })
            .in('id', toolIds)
            .eq('status', status)
            .order('name', { ascending: true })
            .range(offset, offset + limit - 1);

          if (error) throw error;

          return {
            tools: (data ?? []).map(mapSubcategories),
            count: count ?? 0,
          };
        }
      }

      // No filters - get all tools
      const { data, error, count } = await supabase
        .from('tools_v2')
        .select(TOOL_WITH_SUBCATEGORIES, { count: 'exact' })
        .eq('status', status)
        .order('name', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        tools: (data ?? []).map(mapSubcategories),
        count: count ?? 0,
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Fetch a single tool by slug.
 */
export function useTool(slug: string) {
  return useQuery({
    queryKey: toolKeys.detail(slug),
    queryFn: async (): Promise<ToolV2 | null> => {
      const { data, error } = await supabase
        .from('tools_v2')
        .select(TOOL_WITH_SUBCATEGORIES)
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return mapSubcategories(data as ToolV2 & Record<string, unknown>);
    },
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch featured tools for the home page.
 * Cached for 10 minutes.
 */
export function useFeaturedTools(limit = 6) {
  return useQuery({
    queryKey: toolKeys.featured(),
    queryFn: async (): Promise<ToolV2[]> => {
      const { data, error } = await supabase
        .from('tools_v2')
        .select(TOOL_WITH_SUBCATEGORIES)
        .eq('status', 'active')
        .eq('featured', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []).map(mapSubcategories);
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Fetch trending tools.
 */
export function useTrendingTools(limit = 10) {
  return useQuery({
    queryKey: toolKeys.trending(),
    queryFn: async (): Promise<ToolV2[]> => {
      const { data, error } = await supabase
        .from('tools_v2')
        .select(TOOL_WITH_SUBCATEGORIES)
        .eq('status', 'active')
        .eq('trending', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []).map(mapSubcategories);
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Full-text search tools by name/description.
 * Only fires when query has 2+ characters.
 */
export function useSearchTools(query: string, limit = 20) {
  return useQuery({
    queryKey: toolKeys.search(query),
    queryFn: async (): Promise<ToolV2[]> => {
      const { data, error } = await supabase
        .from('tools_v2')
        .select('id, slug, name, short_description, rating, featured, trending, pricing')
        .eq('status', 'active')
        .textSearch('name', query, { type: 'websearch', config: 'english' })
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []) as ToolV2[];
    },
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
}

/**
 * Fetch tools belonging to a specific category slug.
 */
export function useToolsByCategory(categorySlug: string, limit = 24) {
  return useQuery({
    queryKey: toolKeys.byCategory(categorySlug),
    queryFn: async (): Promise<ToolV2[]> => {
      // Use the view for efficient category-based querying
      const { data, error } = await supabase
        .from('tools_v2_with_categories')
        .select('*')
        .eq('status', 'active')
        .filter('subcategories', 'cs', JSON.stringify([{ category_slug: categorySlug }]))
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data ?? []) as ToolV2[];
    },
    enabled: Boolean(categorySlug),
    staleTime: 2 * 60 * 1000,
  });
}
