/**
 * Tools V2 Migration - Categories API Service
 *
 * React Query hooks for fetching tool categories and subcategories
 * from the v2 Supabase tables.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { CategoryV2, SubcategoryV2 } from '@/types/category.types';

// ============================================================
// Query key factory
// ============================================================
export const categoryKeys = {
  all: ['categories-v2'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
  subcategories: (categorySlug: string) =>
    [...categoryKeys.all, 'subcategories', categorySlug] as const,
};

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch all categories with their subcategories.
 * Cached for 5 minutes — category data changes rarely.
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: async (): Promise<CategoryV2[]> => {
      const { data, error } = await supabase
        .from('tool_categories_v2')
        .select(
          `
          *,
          subcategories_v2 (*)
        `
        )
        .order('display_order', { ascending: true });

      if (error) throw error;

      // Rename subcategories_v2 → subcategories to match the type
      return (data ?? []).map((cat) => ({
        ...cat,
        subcategories: (cat.subcategories_v2 as SubcategoryV2[] | undefined) ?? [],
      }));
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch a single category by slug, including its subcategories.
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: async (): Promise<CategoryV2 | null> => {
      const { data, error } = await supabase
        .from('tool_categories_v2')
        .select(
          `
          *,
          subcategories_v2 (*)
        `
        )
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        subcategories: (data.subcategories_v2 as SubcategoryV2[] | undefined) ?? [],
      };
    },
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch subcategories for a given parent category slug.
 */
export function useSubcategories(categorySlug: string) {
  return useQuery({
    queryKey: categoryKeys.subcategories(categorySlug),
    queryFn: async (): Promise<SubcategoryV2[]> => {
      const { data, error } = await supabase
        .from('subcategories_v2')
        .select(
          `
          *,
          tool_categories_v2!inner (slug)
        `
        )
        .eq('tool_categories_v2.slug', categorySlug)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(categorySlug),
    staleTime: 5 * 60 * 1000,
  });
}
