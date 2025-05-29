import { supabase } from '../lib/supabase';
import { DatabaseError, NotFoundError, ValidationError } from './types';
import type { ForumCategory, ForumTopic, ForumReply } from './types';

// Category Operations
export async function createCategory(data: Omit<ForumCategory, 'id' | 'created_at' | 'updated_at'>): Promise<ForumCategory> {
    const { data: category, error } = await supabase
        .from('forum_categories')
        .insert(data)
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to create forum category', error);
    return category;
}

export async function getCategory(id: string): Promise<ForumCategory> {
    const { data: category, error } = await supabase
        .from('forum_categories')
        .select()
        .eq('id', id)
        .single();

    if (error) throw new DatabaseError('Failed to fetch forum category', error);
    if (!category) throw new NotFoundError('Forum category', id);
    return category;
}

export async function updateCategory(id: string, data: Partial<ForumCategory>): Promise<ForumCategory> {
    const { data: category, error } = await supabase
        .from('forum_categories')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to update forum category', error);
    if (!category) throw new NotFoundError('Forum category', id);
    return category;
}

export async function deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
        .from('forum_categories')
        .delete()
        .eq('id', id);

    if (error) throw new DatabaseError('Failed to delete forum category', error);
}

export async function listCategories(): Promise<ForumCategory[]> {
    const { data: categories, error } = await supabase
        .from('forum_categories')
        .select()
        .order('display_order', { ascending: true });

    if (error) throw new DatabaseError('Failed to fetch forum categories', error);
    return categories;
}

// Topic Operations
export async function createTopic(data: Omit<ForumTopic, 'id' | 'views' | 'created_at' | 'updated_at'>): Promise<ForumTopic> {
    const { data: topic, error } = await supabase
        .from('forum_topics')
        .insert(data)
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to create forum topic', error);
    return topic;
}

export async function getTopic(id: string): Promise<ForumTopic> {
    const { data: topic, error } = await supabase
        .from('forum_topics')
        .select()
        .eq('id', id)
        .single();

    if (error) throw new DatabaseError('Failed to fetch forum topic', error);
    if (!topic) throw new NotFoundError('Forum topic', id);
    return topic;
}

export async function updateTopic(id: string, data: Partial<ForumTopic>): Promise<ForumTopic> {
    const { data: topic, error } = await supabase
        .from('forum_topics')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to update forum topic', error);
    if (!topic) throw new NotFoundError('Forum topic', id);
    return topic;
}

export async function deleteTopic(id: string): Promise<void> {
    const { error } = await supabase
        .from('forum_topics')
        .delete()
        .eq('id', id);

    if (error) throw new DatabaseError('Failed to delete forum topic', error);
}

export async function listTopics(categoryId?: string): Promise<ForumTopic[]> {
    let query = supabase
        .from('forum_topics')
        .select()
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data: topics, error } = await query;

    if (error) throw new DatabaseError('Failed to fetch forum topics', error);
    return topics;
}

// Topic Management Operations
export async function pinTopic(id: string, isPinned: boolean): Promise<ForumTopic> {
    return updateTopic(id, { is_pinned: isPinned });
}

export async function lockTopic(id: string, isLocked: boolean): Promise<ForumTopic> {
    return updateTopic(id, { is_locked: isLocked });
}

export async function moveTopic(id: string, newCategoryId: string): Promise<ForumTopic> {
    return updateTopic(id, { category_id: newCategoryId });
}

export async function incrementTopicViews(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_topic_views', { topic_id: id });
    if (error) throw new DatabaseError('Failed to increment topic views', error);
}

// Reply Operations
export async function createReply(data: Omit<ForumReply, 'id' | 'created_at' | 'updated_at'>): Promise<ForumReply> {
    // Verify topic exists and isn't locked
    const { data: topic } = await supabase
        .from('forum_topics')
        .select('is_locked')
        .eq('id', data.topic_id)
        .single();

    if (!topic) throw new NotFoundError('Forum topic', data.topic_id);
    if (topic.is_locked) throw new ValidationError('Cannot reply to locked topic');

    const { data: reply, error } = await supabase
        .from('forum_replies')
        .insert(data)
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to create forum reply', error);
    return reply;
}

export async function getReply(id: string): Promise<ForumReply> {
    const { data: reply, error } = await supabase
        .from('forum_replies')
        .select()
        .eq('id', id)
        .single();

    if (error) throw new DatabaseError('Failed to fetch forum reply', error);
    if (!reply) throw new NotFoundError('Forum reply', id);
    return reply;
}

export async function updateReply(id: string, data: Partial<ForumReply>): Promise<ForumReply> {
    const { data: reply, error } = await supabase
        .from('forum_replies')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to update forum reply', error);
    if (!reply) throw new NotFoundError('Forum reply', id);
    return reply;
}

export async function deleteReply(id: string): Promise<void> {
    const { error } = await supabase
        .from('forum_replies')
        .delete()
        .eq('id', id);

    if (error) throw new DatabaseError('Failed to delete forum reply', error);
}

export async function listReplies(topicId: string): Promise<ForumReply[]> {
    const { data: replies, error } = await supabase
        .from('forum_replies')
        .select()
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

    if (error) throw new DatabaseError('Failed to fetch forum replies', error);
    return replies;
}

// Reply Threading Operations
export async function markAsSolution(id: string, isSolution: boolean): Promise<ForumReply> {
    return updateReply(id, { is_solution: isSolution });
}

export async function getThreadedReplies(topicId: string): Promise<ForumReply[]> {
    const { data: replies, error } = await supabase
        .from('forum_replies')
        .select()
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true });

    if (error) throw new DatabaseError('Failed to fetch threaded replies', error);
    return replies;
}

// Admin Moderation Functions
export async function moderateContent(type: 'topic' | 'reply', id: string, action: 'delete'): Promise<void> {
    if (type === 'topic') {
        await deleteTopic(id);
    } else {
        await deleteReply(id);
    }
}