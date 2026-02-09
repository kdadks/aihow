/**
 * Blog API Service - V2
 *
 * React Query hooks for fetching blog posts from Supabase
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// ============================================================
// Types
// ============================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Metadata fields
  read_time: string | null;
  category: string | null;
  author_name: string | null;
  author_image: string | null;
  author_credential: string | null;
  featured_image: string | null;
  date: string | null;
}

export interface BlogListParams extends Record<string, unknown> {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  limit?: number;
  offset?: number;
}

// ============================================================
// Query key factory
// ============================================================
export const blogKeys = {
  all: ['blog-posts'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...blogKeys.lists(), filters] as const,
  detail: (slug: string) => [...blogKeys.all, 'detail', slug] as const,
};

// ============================================================
// Hooks
// ============================================================

/**
 * Fetch a paginated list of blog posts
 */
export function useBlogPosts(params: BlogListParams = {}) {
  const { status = 'published', limit = 20, offset = 0 } = params;

  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: async (): Promise<{ posts: BlogPost[]; count: number }> => {
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .eq('status', status)
        .order('published_at', { ascending: false, nullsFirst: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }

      return {
        posts: (data as BlogPost[]) || [],
        count: count || 0,
      };
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

/**
 * Fetch a single blog post by slug
 */
export function useBlogPost(slug: string | undefined) {
  return useQuery({
    queryKey: blogKeys.detail(slug || ''),
    queryFn: async (): Promise<BlogPost | null> => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        console.error('Error fetching blog post:', error);
        throw error;
      }

      return data as BlogPost;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
  });
}

/**
 * Fetch all published blog posts (for search/filtering)
 */
export function useAllBlogPosts() {
  return useQuery({
    queryKey: blogKeys.lists(),
    queryFn: async (): Promise<BlogPost[]> => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false, nullsFirst: false });

      if (error) {
        console.error('Error fetching all blog posts:', error);
        throw error;
      }

      return (data as BlogPost[]) || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
