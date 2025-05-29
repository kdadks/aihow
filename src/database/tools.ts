import { getDatabase } from './init';
import { Tool, ToolCategory, ToolReview, DatabaseError, NotFoundError, ValidationError } from './types';

// Tool Category Operations
export async function createToolCategory(category: Omit<ToolCategory, 'id' | 'created_at' | 'updated_at'>): Promise<ToolCategory> {
    try {
        const { data, error } = await getDatabase()
            .from('tool_categories')
            .insert(category)
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new ValidationError('Failed to create tool category');

        return data;
    } catch (error) {
        throw new DatabaseError('Error creating tool category', error as Error);
    }
}

export async function getToolCategories(): Promise<ToolCategory[]> {
    try {
        const { data, error } = await getDatabase()
            .from('tool_categories')
            .select('*');

        if (error) throw error;
        return data || [];
    } catch (error) {
        throw new DatabaseError('Error fetching tool categories', error as Error);
    }
}

// Tool Operations
export async function createTool(tool: Omit<Tool, 'id' | 'created_at' | 'updated_at'>): Promise<Tool> {
    try {
        const { data, error } = await getDatabase()
            .from('tools')
            .insert(tool)
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new ValidationError('Failed to create tool');

        return data;
    } catch (error) {
        throw new DatabaseError('Error creating tool', error as Error);
    }
}

export async function updateTool(id: string, updates: Partial<Omit<Tool, 'id' | 'created_at' | 'updated_at'>>): Promise<Tool> {
    try {
        const { data, error } = await getDatabase()
            .from('tools')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new NotFoundError('Tool', id);

        return data;
    } catch (error) {
        throw new DatabaseError('Error updating tool', error as Error);
    }
}

export async function getTool(id: string): Promise<Tool> {
    try {
        const { data, error } = await getDatabase()
            .from('tools')
            .select('*, tool_categories(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) throw new NotFoundError('Tool', id);

        return data;
    } catch (error) {
        throw new DatabaseError('Error fetching tool', error as Error);
    }
}

export async function getTools(params?: {
    category_id?: string;
    status?: string;
    limit?: number;
    offset?: number;
}): Promise<{ tools: Tool[]; count: number }> {
    try {
        let query = getDatabase()
            .from('tools')
            .select('*, tool_categories(*)', { count: 'exact' });

        if (params?.category_id) {
            query = query.eq('category_id', params.category_id);
        }
        if (params?.status) {
            query = query.eq('status', params.status);
        }
        if (params?.limit) {
            query = query.limit(params.limit);
        }
        if (params?.offset) {
            query = query.range(params.offset, (params.offset + (params.limit || 10)) - 1);
        }

        const { data, error, count } = await query;

        if (error) throw error;
        return { tools: data || [], count: count || 0 };
    } catch (error) {
        throw new DatabaseError('Error fetching tools', error as Error);
    }
}

// Tool Review Operations
export async function createToolReview(review: Omit<ToolReview, 'id' | 'created_at' | 'updated_at' | 'upvotes'>): Promise<ToolReview> {
    try {
        const { data, error } = await getDatabase()
            .from('tool_reviews')
            .insert(review)
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new ValidationError('Failed to create tool review');

        return data;
    } catch (error) {
        throw new DatabaseError('Error creating tool review', error as Error);
    }
}

export async function getToolReviews(toolId: string, params?: {
    status?: string;
    limit?: number;
    offset?: number;
}): Promise<{ reviews: ToolReview[]; count: number }> {
    try {
        let query = getDatabase()
            .from('tool_reviews')
            .select('*', { count: 'exact' })
            .eq('tool_id', toolId);

        if (params?.status) {
            query = query.eq('status', params.status);
        }
        if (params?.limit) {
            query = query.limit(params.limit);
        }
        if (params?.offset) {
            query = query.range(params.offset, (params.offset + (params.limit || 10)) - 1);
        }

        const { data, error, count } = await query;

        if (error) throw error;
        return { reviews: data || [], count: count || 0 };
    } catch (error) {
        throw new DatabaseError('Error fetching tool reviews', error as Error);
    }
}

export async function updateToolReview(
    id: string,
    updates: Partial<Omit<ToolReview, 'id' | 'created_at' | 'updated_at'>>
): Promise<ToolReview> {
    try {
        const { data, error } = await getDatabase()
            .from('tool_reviews')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        if (!data) throw new NotFoundError('Tool Review', id);

        return data;
    } catch (error) {
        throw new DatabaseError('Error updating tool review', error as Error);
    }
}

export async function searchTools(query: string): Promise<Tool[]> {
    try {
        const { data, error } = await getDatabase()
            .from('tools')
            .select('*, tool_categories(*)')
            .textSearch('name', query, {
                type: 'websearch',
                config: 'english'
            });

        if (error) throw error;
        return data || [];
    } catch (error) {
        throw new DatabaseError('Error searching tools', error as Error);
    }
}