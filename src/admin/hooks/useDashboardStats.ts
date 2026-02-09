import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTools: number;
  totalBundles: number;
  totalReviews: number;
  totalBlogPosts: number;
  pendingReviews: number;
  recentSignups: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Helper function to safely query tables
      const safeCount = async (table: string, filters?: any) => {
        try {
          let query = supabase.from(table).select('id', { count: 'exact', head: true });

          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              if (key === 'gte') {
                query = query.gte(value.field, value.value);
              } else {
                query = query.eq(key, value);
              }
            });
          }

          const result = await query;
          return result.count || 0;
        } catch (error) {
          console.warn(`Table ${table} query failed:`, error);
          return 0;
        }
      };

      // Run all queries in parallel with error handling
      const [
        totalUsers,
        activeUsers,
        totalTools,
        totalBundles,
        totalReviews,
        totalBlogPosts,
        pendingReviews,
        recentSignups,
      ] = await Promise.all([
        safeCount('profiles'),
        safeCount('profiles', {
          gte: {
            field: 'updated_at',
            value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        }),
        safeCount('tools_v2', { status: 'active' }),
        safeCount('tool_bundles_v2', { status: 'published' }),
        safeCount('tool_reviews_v2', { status: 'published' }),
        safeCount('blog_posts', { status: 'published' }),
        safeCount('tool_reviews_v2', { status: 'pending' }),
        safeCount('profiles', {
          gte: {
            field: 'created_at',
            value: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        }),
      ]);

      return {
        totalUsers,
        activeUsers,
        totalTools,
        totalBundles,
        totalReviews,
        totalBlogPosts,
        pendingReviews,
        recentSignups,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export interface RecentActivity {
  id: string;
  type: 'user' | 'tool' | 'review' | 'blog' | 'bundle';
  action: string;
  user_email?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: ['admin', 'recent-activity', limit],
    queryFn: async (): Promise<RecentActivity[]> => {
      const activities: RecentActivity[] = [];

      try {
        // Get recent profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        if (!profilesError && profiles) {
          profiles.forEach((profile) => {
            activities.push({
              id: profile.id,
              type: 'user',
              action: 'New user registered',
              user_email: profile.username,
              created_at: profile.created_at,
            });
          });
        }
      } catch (error) {
        console.warn('Failed to fetch recent profiles:', error);
      }

      try {
        // Get recent tools
        const { data: tools, error: toolsError } = await supabase
          .from('tools_v2')
          .select('id, name, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        if (!toolsError && tools) {
          tools.forEach((tool) => {
            activities.push({
              id: tool.id,
              type: 'tool',
              action: `New tool added: ${tool.name}`,
              created_at: tool.created_at,
            });
          });
        }
      } catch (error) {
        console.warn('Failed to fetch recent tools:', error);
      }

      try {
        // Get recent reviews (if table exists)
        const { data: reviews, error: reviewsError } = await supabase
          .from('tool_reviews_v2')
          .select('id, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        if (!reviewsError && reviews) {
          reviews.forEach((review) => {
            activities.push({
              id: review.id,
              type: 'review',
              action: 'New review submitted',
              created_at: review.created_at,
            });
          });
        }
      } catch (error) {
        console.warn('Failed to fetch recent reviews (table may not exist):', error);
      }

      // Sort by date and limit
      return activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export interface TopTool {
  id: string;
  name: string;
  slug: string;
  rating: number;
  review_count: number;
}

export function useTopTools(limit = 5) {
  return useQuery({
    queryKey: ['admin', 'top-tools', limit],
    queryFn: async (): Promise<TopTool[]> => {
      try {
        const { data, error } = await supabase
          .from('tools_v2')
          .select('id, name, slug, rating')
          .eq('status', 'active')
          .order('rating', { ascending: false })
          .limit(limit);

        if (error) {
          console.warn('Failed to fetch top tools:', error);
          return [];
        }

        // Get review counts for each tool (handle missing reviews table)
        const toolsWithCounts = await Promise.all(
          (data || []).map(async (tool) => {
            try {
              const { count } = await supabase
                .from('tool_reviews_v2')
                .select('id', { count: 'exact', head: true })
                .eq('tool_id', tool.id);

              return {
                ...tool,
                review_count: count || 0,
              };
            } catch (error) {
              // If reviews table doesn't exist, return 0
              return {
                ...tool,
                review_count: 0,
              };
            }
          })
        );

        return toolsWithCounts;
      } catch (error) {
        console.warn('Failed to fetch top tools:', error);
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
