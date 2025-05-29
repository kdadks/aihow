import { supabase } from '../lib/supabase';
import { DatabaseError, NotFoundError, ValidationError } from './types';
import type { Workflow, ToolBundle, UserSavedItem, WorkflowStatus } from './types';

// Workflow CRUD Operations
export async function createWorkflow(workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>): Promise<Workflow> {
    const { data, error } = await supabase
        .from('workflows')
        .insert([workflow])
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to create workflow', error);
    return data;
}

export async function getWorkflow(id: string): Promise<Workflow> {
    const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new DatabaseError('Failed to fetch workflow', error);
    if (!data) throw new NotFoundError('Workflow', id);
    return data;
}

export async function updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    const { data, error } = await supabase
        .from('workflows')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to update workflow', error);
    if (!data) throw new NotFoundError('Workflow', id);
    return data;
}

export async function deleteWorkflow(id: string): Promise<void> {
    const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', id);

    if (error) throw new DatabaseError('Failed to delete workflow', error);
}

// Version Management
export async function createWorkflowVersion(workflowId: string): Promise<Workflow> {
    const currentWorkflow = await getWorkflow(workflowId);
    const newVersion = {
        ...currentWorkflow,
        id: undefined,
        version: currentWorkflow.version + 1
    };
    
    return createWorkflow(newVersion);
}

export async function listWorkflowVersions(workflowId: string): Promise<Workflow[]> {
    const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('creator_id', workflowId)
        .order('version', { ascending: false });

    if (error) throw new DatabaseError('Failed to fetch workflow versions', error);
    return data;
}

// Tool Bundle Operations
export async function createToolBundle(bundle: Omit<ToolBundle, 'id' | 'created_at' | 'updated_at'>): Promise<ToolBundle> {
    const { data, error } = await supabase
        .from('tool_bundles')
        .insert([bundle])
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to create tool bundle', error);
    return data;
}

export async function getToolBundle(id: string): Promise<ToolBundle> {
    const { data, error } = await supabase
        .from('tool_bundles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new DatabaseError('Failed to fetch tool bundle', error);
    if (!data) throw new NotFoundError('Tool bundle', id);
    return data;
}

export async function updateToolBundle(id: string, updates: Partial<ToolBundle>): Promise<ToolBundle> {
    const { data, error } = await supabase
        .from('tool_bundles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to update tool bundle', error);
    if (!data) throw new NotFoundError('Tool bundle', id);
    return data;
}

export async function deleteToolBundle(id: string): Promise<void> {
    const { error } = await supabase
        .from('tool_bundles')
        .delete()
        .eq('id', id);

    if (error) throw new DatabaseError('Failed to delete tool bundle', error);
}

// User Saved Items Operations
export async function saveItem(item: Omit<UserSavedItem, 'id' | 'saved_at'>): Promise<UserSavedItem> {
    const { data, error } = await supabase
        .from('user_saved_items')
        .insert([item])
        .select()
        .single();

    if (error) throw new DatabaseError('Failed to save item', error);
    return data;
}

export async function unsaveItem(userId: string, itemId: string): Promise<void> {
    const { error } = await supabase
        .from('user_saved_items')
        .delete()
        .eq('user_id', userId)
        .eq('item_id', itemId);

    if (error) throw new DatabaseError('Failed to unsave item', error);
}

export async function getUserSavedItems(userId: string, itemType?: 'workflow' | 'bundle'): Promise<UserSavedItem[]> {
    let query = supabase
        .from('user_saved_items')
        .select('*')
        .eq('user_id', userId);

    if (itemType) {
        query = query.eq('item_type', itemType);
    }

    const { data, error } = await query;
    if (error) throw new DatabaseError('Failed to fetch saved items', error);
    return data;
}

// Visibility Control
export async function updateWorkflowVisibility(id: string, isPublic: boolean): Promise<Workflow> {
    return updateWorkflow(id, { is_public: isPublic });
}

export async function updateBundleVisibility(id: string, isPublic: boolean): Promise<ToolBundle> {
    return updateToolBundle(id, { is_public: isPublic });
}

// List Operations
export async function listPublicWorkflows(): Promise<Workflow[]> {
    const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) throw new DatabaseError('Failed to fetch public workflows', error);
    return data;
}

export async function listUserWorkflows(userId: string, status?: WorkflowStatus): Promise<Workflow[]> {
    let query = supabase
        .from('workflows')
        .select('*')
        .eq('creator_id', userId);

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error) throw new DatabaseError('Failed to fetch user workflows', error);
    return data;
}

export async function listPublicBundles(): Promise<ToolBundle[]> {
    const { data, error } = await supabase
        .from('tool_bundles')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

    if (error) throw new DatabaseError('Failed to fetch public bundles', error);
    return data;
}

export async function listUserBundles(userId: string): Promise<ToolBundle[]> {
    const { data, error } = await supabase
        .from('tool_bundles')
        .select('*')
        .eq('creator_id', userId)
        .order('updated_at', { ascending: false });

    if (error) throw new DatabaseError('Failed to fetch user bundles', error);
    return data;
}