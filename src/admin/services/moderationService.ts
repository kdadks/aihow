import { supabase } from '../../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { AdminResponse } from '../types/admin';
import type {
    ContentItem,
    ModerationFilters,
    ModerationStats,
    ModerationService as IModerationService
} from '../types/moderation';

class ModerationService implements IModerationService {
    async getContent(
        filters: ModerationFilters,
        page = 1,
        pageSize = 20
    ): Promise<AdminResponse<{ data: ContentItem[]; count: number }>> {
        try {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            let query = supabase
                .from('moderation_queue')
                .select('*', { count: 'exact' });

            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.type) {
                query = query.eq('type', filters.type);
            }
            if (filters.userId) {
                query = query.eq('user_id', filters.userId);
            }
            if (filters.startDate) {
                query = query.gte('created_at', filters.startDate);
            }
            if (filters.endDate) {
                query = query.lte('created_at', filters.endDate);
            }

            query = query
                .order('created_at', { ascending: false })
                .range(from, to);

            const { data, error, count } = await query;

            if (error) {
                throw error;
            }

            return {
                data: {
                    data: data as ContentItem[],
                    count: count || 0
                },
                error: null
            };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async updateContentStatus(
        id: string,
        status: ContentItem['status'],
        reason?: string
    ): Promise<AdminResponse<ContentItem>> {
        try {
            const user = await supabase.auth.getUser();
            if (!user.data.user) {
                throw new Error('No authenticated user found');
            }

            const { data, error } = await supabase
                .from('moderation_queue')
                .update({
                    status,
                    reason,
                    reviewed_by: user.data.user.id,
                    reviewed_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return { data: data as ContentItem, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getContentStats(): Promise<AdminResponse<ModerationStats>> {
        try {
            const { data, error } = await supabase
                .from('moderation_queue')
                .select('status')
                .in('status', ['pending', 'approved', 'rejected']);

            if (error) {
                throw error;
            }

            const stats = data.reduce(
                (acc, item) => {
                    acc[item.status as keyof ModerationStats]++;
                    return acc;
                },
                { pending: 0, approved: 0, rejected: 0 } as ModerationStats
            );

            return { data: stats, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async addToModerationQueue(
        type: string,
        content: Record<string, any>,
        userId: string
    ): Promise<AdminResponse<ContentItem>> {
        try {
            const { data, error } = await supabase
                .from('moderation_queue')
                .insert({
                    type,
                    content,
                    user_id: userId,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            return { data: data as ContentItem, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }
}

export const moderationService = new ModerationService();
