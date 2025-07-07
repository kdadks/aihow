import { supabase } from '../lib/supabase';

export interface SavedBundle {
  id: string;
  name: string;
  description: string;
  totalCost: string | number;
  savedAt: string;
  type: 'workflow' | 'bundle';
  isCustom?: boolean;
  tools?: any[];
  bundleData?: any;
}

export interface SavedWorkflow {
  id: string;
  name: string;
  description?: string;
  useCase?: string;
  totalCost: number;
  tools: any[];
  metadata: any;
  workflowData?: any;
}

export interface WorkflowDraft {
  id?: string;
  name: string;
  workflowData: any;
  autoSaved?: boolean;
}

class UserDataService {
  private async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // ===== SAVED BUNDLES =====
  async getSavedBundles(): Promise<SavedBundle[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    try {
      // Try database first
      const { data: bundles, error } = await supabase
        .from('saved_bundles')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.warn('saved_bundles table not found, using localStorage');
          return this.getSavedBundlesFromLocalStorage();
        }
        throw error;
      }

      // Transform database format to app format
      const transformedBundles = bundles.map(bundle => ({
        id: bundle.bundle_id,
        name: bundle.bundle_name,
        description: bundle.bundle_description || '',
        totalCost: bundle.total_cost || '',
        savedAt: bundle.saved_at,
        type: bundle.bundle_type as 'workflow' | 'bundle',
        isCustom: bundle.is_custom || false,
        tools: bundle.tools || [],
        bundleData: bundle.bundle_data
      }));

      // Sync to localStorage as backup
      localStorage.setItem('savedBundles', JSON.stringify(transformedBundles));
      return transformedBundles;

    } catch (error) {
      console.warn('Database error, falling back to localStorage:', error);
      return this.getSavedBundlesFromLocalStorage();
    }
  }

  private getSavedBundlesFromLocalStorage(): SavedBundle[] {
    try {
      const bundlesData = localStorage.getItem('savedBundles');
      return bundlesData ? JSON.parse(bundlesData) : [];
    } catch (error) {
      console.error('Error parsing localStorage bundles:', error);
      return [];
    }
  }

  async saveBundleToCollection(bundle: SavedBundle): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // Try database first
      const { error } = await supabase
        .from('saved_bundles')
        .insert({
          user_id: user.id,
          bundle_id: bundle.id,
          bundle_name: bundle.name,
          bundle_description: bundle.description,
          total_cost: bundle.totalCost.toString(),
          bundle_type: bundle.type,
          is_custom: bundle.isCustom || false,
          tools: bundle.tools || [],
          bundle_data: bundle.bundleData
        });

      if (error && error.code !== '42P01') {
        throw error;
      }

      if (error?.code === '42P01') {
        console.warn('Database table not found, saving to localStorage only');
      }
    } catch (error) {
      console.warn('Database save failed, using localStorage fallback:', error);
    }

    // Always save to localStorage as backup
    const existing = this.getSavedBundlesFromLocalStorage();
    const updated = [...existing, { ...bundle, savedAt: new Date().toISOString() }];
    localStorage.setItem('savedBundles', JSON.stringify(updated));
  }

  async removeBundleFromCollection(bundleId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // Try database first
      const { error } = await supabase
        .from('saved_bundles')
        .delete()
        .eq('user_id', user.id)
        .eq('bundle_id', bundleId);

      if (error && error.code !== '42P01') {
        throw error;
      }
    } catch (error) {
      console.warn('Database delete failed, using localStorage only:', error);
    }

    // Always update localStorage
    const existing = this.getSavedBundlesFromLocalStorage();
    const updated = existing.filter(b => b.id !== bundleId);
    localStorage.setItem('savedBundles', JSON.stringify(updated));
  }

  // ===== SAVED WORKFLOWS =====
  async getSavedWorkflows(): Promise<SavedWorkflow[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    try {
      // Try database first
      const { data: workflows, error } = await supabase
        .from('saved_workflows')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.warn('saved_workflows table not found, using localStorage');
          return this.getSavedWorkflowsFromLocalStorage();
        }
        throw error;
      }

      // Transform database format to app format
      const transformedWorkflows = workflows.map(workflow => ({
        id: workflow.workflow_id,
        name: workflow.workflow_name,
        description: workflow.workflow_description,
        useCase: workflow.use_case,
        totalCost: workflow.total_cost || 0,
        tools: workflow.tools || [],
        metadata: workflow.metadata || {},
        workflowData: workflow.workflow_data
      }));

      // Sync to localStorage as backup
      localStorage.setItem('savedWorkflows', JSON.stringify(transformedWorkflows));
      return transformedWorkflows;

    } catch (error) {
      console.warn('Database error, falling back to localStorage:', error);
      return this.getSavedWorkflowsFromLocalStorage();
    }
  }

  private getSavedWorkflowsFromLocalStorage(): SavedWorkflow[] {
    try {
      const workflowsData = localStorage.getItem('savedWorkflows');
      return workflowsData ? JSON.parse(workflowsData) : [];
    } catch (error) {
      console.error('Error parsing localStorage workflows:', error);
      return [];
    }
  }

  async saveWorkflowToCollection(workflow: SavedWorkflow): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // Try database first
      const { error } = await supabase
        .from('saved_workflows')
        .insert({
          user_id: user.id,
          workflow_id: workflow.id,
          workflow_name: workflow.name,
          workflow_description: workflow.description,
          use_case: workflow.useCase,
          total_cost: workflow.totalCost,
          tools: workflow.tools,
          metadata: workflow.metadata,
          workflow_data: workflow.workflowData
        });

      if (error && error.code !== '42P01') {
        throw error;
      }

      if (error?.code === '42P01') {
        console.warn('Database table not found, saving to localStorage only');
      }
    } catch (error) {
      console.warn('Database save failed, using localStorage fallback:', error);
    }

    // Always save to localStorage as backup
    const existing = this.getSavedWorkflowsFromLocalStorage();
    const updated = [...existing, workflow];
    localStorage.setItem('savedWorkflows', JSON.stringify(updated));
  }

  async removeWorkflowFromCollection(workflowId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    try {
      // Try database first
      const { error } = await supabase
        .from('saved_workflows')
        .delete()
        .eq('user_id', user.id)
        .eq('workflow_id', workflowId);

      if (error && error.code !== '42P01') {
        throw error;
      }
    } catch (error) {
      console.warn('Database delete failed, using localStorage only:', error);
    }

    // Always update localStorage
    const existing = this.getSavedWorkflowsFromLocalStorage();
    const updated = existing.filter(w => w.id !== workflowId);
    localStorage.setItem('savedWorkflows', JSON.stringify(updated));
  }

  // ===== WORKFLOW DRAFTS =====
  async saveWorkflowDraft(draft: WorkflowDraft): Promise<string> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    let draftId = draft.id || `draft_${Date.now()}`;

    try {
      // Try database first
      const { data, error } = await supabase
        .from('workflow_drafts')
        .upsert({
          id: draftId,
          user_id: user.id,
          draft_name: draft.name,
          workflow_data: draft.workflowData,
          auto_saved: draft.autoSaved || true
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error && error.code !== '42P01') {
        throw error;
      }

      if (data) {
        draftId = data.id;
      }

      if (error?.code === '42P01') {
        console.warn('Database table not found, saving to localStorage only');
      }
    } catch (error) {
      console.warn('Database save failed, using localStorage fallback:', error);
    }

    // Always save to localStorage as backup
    const DRAFT_STORAGE_KEY = `workflow_draft_${user.id}`;
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ ...draft, id: draftId }));
    
    return draftId;
  }

  async getWorkflowDraft(): Promise<WorkflowDraft | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    try {
      // Try database first
      const { data: drafts, error } = await supabase
        .from('workflow_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          console.warn('workflow_drafts table not found, using localStorage');
          return this.getWorkflowDraftFromLocalStorage();
        }
        throw error;
      }

      if (drafts && drafts.length > 0) {
        const draft = drafts[0];
        return {
          id: draft.id,
          name: draft.draft_name,
          workflowData: draft.workflow_data,
          autoSaved: draft.auto_saved
        };
      }

      return this.getWorkflowDraftFromLocalStorage();

    } catch (error) {
      console.warn('Database error, falling back to localStorage:', error);
      return this.getWorkflowDraftFromLocalStorage();
    }
  }

  private getWorkflowDraftFromLocalStorage(): WorkflowDraft | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    try {
      const DRAFT_STORAGE_KEY = `workflow_draft_${(user as any).id}`;
      const draftData = localStorage.getItem(DRAFT_STORAGE_KEY);
      return draftData ? JSON.parse(draftData) : null;
    } catch (error) {
      console.error('Error parsing localStorage draft:', error);
      return null;
    }
  }

  async clearWorkflowDraft(): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;

    try {
      // Try database first
      const { error } = await supabase
        .from('workflow_drafts')
        .delete()
        .eq('user_id', user.id);

      if (error && error.code !== '42P01') {
        throw error;
      }
    } catch (error) {
      console.warn('Database clear failed, using localStorage only:', error);
    }

    // Always clear localStorage
    const DRAFT_STORAGE_KEY = `workflow_draft_${user.id}`;
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  }
}

export const userDataService = new UserDataService();