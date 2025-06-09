import { EnterpriseWorkflow } from '../components/bundles/EnterpriseWorkflowCreator';

const DRAFT_STORAGE_KEY = 'enterprise_workflow_draft';
const DRAFT_EXPIRY_HOURS = 24;

export interface WorkflowDraft {
  id: string;
  workflow: EnterpriseWorkflow;
  timestamp: number;
  expiresAt: number;
  userAgent?: string;
}

export class WorkflowDraftManager {
  private static instance: WorkflowDraftManager;

  static getInstance(): WorkflowDraftManager {
    if (!WorkflowDraftManager.instance) {
      WorkflowDraftManager.instance = new WorkflowDraftManager();
    }
    return WorkflowDraftManager.instance;
  }

  /**
   * Save workflow to draft state
   */
  saveDraft(workflow: EnterpriseWorkflow): void {
    try {
      const draft: WorkflowDraft = {
        id: this.generateDraftId(),
        workflow: {
          ...workflow,
          metadata: {
            ...workflow.metadata,
            status: 'draft',
            lastModified: new Date()
          }
        },
        timestamp: Date.now(),
        expiresAt: Date.now() + (DRAFT_EXPIRY_HOURS * 60 * 60 * 1000),
        userAgent: navigator.userAgent
      };

      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      
      console.log('Workflow draft saved:', {
        id: draft.id,
        workflowName: workflow.name,
        timestamp: new Date(draft.timestamp).toISOString()
      });
    } catch (error) {
      console.error('Failed to save workflow draft:', error);
      // Fail silently to not interrupt user workflow
    }
  }

  /**
   * Load workflow from draft state
   */
  loadDraft(): EnterpriseWorkflow | null {
    try {
      const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!draftJson) {
        return null;
      }

      const draft: WorkflowDraft = JSON.parse(draftJson);
      
      // Check if draft has expired
      if (Date.now() > draft.expiresAt) {
        this.clearDraft();
        console.log('Workflow draft expired and removed');
        return null;
      }

      // Convert date strings back to Date objects
      const workflow = {
        ...draft.workflow,
        metadata: {
          ...draft.workflow.metadata,
          lastModified: new Date(draft.workflow.metadata.lastModified)
        },
        auditLog: draft.workflow.auditLog?.map(entry => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        })) || []
      };

      console.log('Workflow draft loaded:', {
        id: draft.id,
        workflowName: workflow.name,
        savedAt: new Date(draft.timestamp).toISOString(),
        age: this.getDraftAge(draft.timestamp)
      });

      return workflow;
    } catch (error) {
      console.error('Failed to load workflow draft:', error);
      this.clearDraft(); // Clear corrupted draft
      return null;
    }
  }

  /**
   * Check if a draft exists
   */
  hasDraft(): boolean {
    try {
      const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!draftJson) {
        return false;
      }

      const draft: WorkflowDraft = JSON.parse(draftJson);
      
      // Check if draft has expired
      if (Date.now() > draft.expiresAt) {
        this.clearDraft();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to check draft existence:', error);
      this.clearDraft();
      return false;
    }
  }

  /**
   * Clear workflow draft
   */
  clearDraft(): void {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      console.log('Workflow draft cleared');
    } catch (error) {
      console.error('Failed to clear workflow draft:', error);
    }
  }

  /**
   * Get draft metadata without loading the full workflow
   */
  getDraftInfo(): { exists: boolean; age?: string; workflowName?: string } | null {
    try {
      const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!draftJson) {
        return { exists: false };
      }

      const draft: WorkflowDraft = JSON.parse(draftJson);
      
      // Check if draft has expired
      if (Date.now() > draft.expiresAt) {
        this.clearDraft();
        return { exists: false };
      }

      return {
        exists: true,
        age: this.getDraftAge(draft.timestamp),
        workflowName: draft.workflow.name || 'Untitled Workflow'
      };
    } catch (error) {
      console.error('Failed to get draft info:', error);
      this.clearDraft();
      return { exists: false };
    }
  }

  /**
   * Auto-save workflow (throttled)
   */
  private autoSaveTimeout: NodeJS.Timeout | null = null;
  
  autoSave(workflow: EnterpriseWorkflow): void {
    // Clear existing timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    // Set new timeout to save after 2 seconds of inactivity
    this.autoSaveTimeout = setTimeout(() => {
      this.saveDraft(workflow);
    }, 2000);
  }

  /**
   * Update workflow in draft state if it exists
   */
  updateDraft(updates: Partial<EnterpriseWorkflow>): void {
    const existingDraft = this.loadDraft();
    if (existingDraft) {
      const updatedWorkflow = {
        ...existingDraft,
        ...updates,
        metadata: {
          ...existingDraft.metadata,
          ...updates.metadata,
          lastModified: new Date()
        }
      };
      this.saveDraft(updatedWorkflow);
    }
  }

  private generateDraftId(): string {
    return `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDraftAge(timestamp: number): string {
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 1) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
  }
}

// Export singleton instance
export const draftManager = WorkflowDraftManager.getInstance();
