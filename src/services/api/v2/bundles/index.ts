/**
 * Tools V2 Migration - Bundles API Service
 *
 * React Query hooks for fetching tool bundles from the v2 Supabase tables.
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BundleV2 } from '@/types/bundle.types';

// ============================================================
// Query key factory
// ============================================================
export const bundleKeys = {
  all: ['bundles-v2'] as const,
  lists: () => [...bundleKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...bundleKeys.lists(), filters] as const,
  detail: (slug: string) => [...bundleKeys.all, 'detail', slug] as const,
  featured: () => [...bundleKeys.all, 'featured'] as const,
  byCategory: (category: string) => [...bundleKeys.all, 'category', category] as const,
};

// ============================================================
// Filter params type
// ============================================================
export interface BundleListParams {
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch a paginated list of bundles.
 */
export function useBundles(params: BundleListParams = {}) {
  const { category, featured, limit = 20, offset = 0 } = params;

  return useQuery({
    queryKey: bundleKeys.list(params),
    queryFn: async (): Promise<{ bundles: BundleV2[]; count: number }> => {
      let query = supabase
        .from('tool_bundles_v2')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .order('name', { ascending: true })
        .range(offset, offset + limit - 1);

      if (category) {
        query = query.eq('category', category);
      }

      if (featured !== undefined) {
        query = query.eq('featured', featured);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        bundles: (data ?? []) as BundleV2[],
        count: count ?? 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch a single bundle by slug.
 */
export function useBundle(slug: string) {
  return useQuery({
    queryKey: bundleKeys.detail(slug),
    queryFn: async (): Promise<BundleV2 | null> => {
      const { data, error } = await supabase
        .from('tool_bundles_v2')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return (data as BundleV2) ?? null;
    },
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch featured bundles for the home page WorkflowSection.
 */
export function useFeaturedBundles(limit = 6) {
  return useQuery({
    queryKey: bundleKeys.featured(),
    queryFn: async (): Promise<BundleV2[]> => {
      const { data, error } = await supabase
        .from('tool_bundles_v2')
        .select('*')
        .eq('status', 'active')
        .eq('featured', true)
        .order('name', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return (data ?? []) as BundleV2[];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Fetch bundles by category.
 */
export function useBundlesByCategory(category: string) {
  return useQuery({
    queryKey: bundleKeys.byCategory(category),
    queryFn: async (): Promise<BundleV2[]> => {
      const { data, error } = await supabase
        .from('tool_bundles_v2')
        .select('*')
        .eq('status', 'active')
        .eq('category', category)
        .order('name', { ascending: true });

      if (error) throw error;
      return (data ?? []) as BundleV2[];
    },
    enabled: Boolean(category),
    staleTime: 5 * 60 * 1000,
  });
}
