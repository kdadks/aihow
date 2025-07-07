import React, { useState, useCallback } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import { LoginModal } from '../modals/LoginModal';
import { draftManager } from '../../utils/workflowDraftManager';
import { EnterpriseWorkflow } from './EnterpriseWorkflowCreator';
import { createWorkflow } from '../../database/workflows';
import { userDataService } from '../../services/userDataService';
import { Button } from '../ui/Button';
import { Save, AlertCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthenticatedSaveButtonProps {
  workflow: EnterpriseWorkflow;
  isValid: boolean;
  onSuccess?: (workflow: EnterpriseWorkflow) => void;
  className?: string;
  children?: React.ReactNode;
}

export const AuthenticatedSaveButton: React.FC<AuthenticatedSaveButtonProps> = ({
  workflow,
  isValid,
  onSuccess,
  className,
  children
}) => {
  const { isAuthenticated, user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    setSaveError(null);

    // If user is not authenticated, save as draft and show login modal
    if (!isAuthenticated) {
      // Save to draft storage
      draftManager.saveDraft(workflow);
      
      // Show login modal with message about saving the workflow
      setShowLoginModal(true);
      return;
    }

    // User is authenticated, proceed with actual save
    try {
      setIsSaving(true);

      // Generate a unique ID for the workflow if it doesn't have one
      const workflowId = workflow.id || `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // 1. Save to main workflows table (for admin/backend access)
      try {
        const dbWorkflow = {
          creator_id: user?.id || '',
          title: workflow.name,
          description: workflow.description || null,
          is_public: false, // Default to private
          tags: workflow.metadata.tags || [],
          metadata: {
            ...workflow.metadata,
            tools: workflow.tools,
            totalCost: workflow.totalCost,
            useCase: workflow.useCase,
            collaboration: workflow.collaboration,
            approvalWorkflow: workflow.approvalWorkflow,
            versionControl: workflow.versionControl
          },
          version: 1, // Start with version 1
          status: workflow.metadata.status || 'draft'
        };

        await createWorkflow(dbWorkflow);
        console.log('Workflow saved to main workflows table');
      } catch (workflowError) {
        console.warn('Failed to save to workflows table, continuing with user table:', workflowError);
      }

      // 2. Save to saved_workflows table (for user dashboard)
      const savedWorkflowData = {
        id: workflowId,
        name: workflow.name,
        description: workflow.description || '',
        useCase: workflow.useCase || '',
        totalCost: workflow.totalCost || 0,
        tools: workflow.tools || [],
        metadata: workflow.metadata || {},
        workflowData: {
          ...workflow,
          id: workflowId
        }
      };

      await userDataService.saveWorkflowToCollection(savedWorkflowData);
      console.log('Workflow saved to user collection');
      
      // Clear draft since it's now saved
      draftManager.clearDraft();
      
      // Update workflow with saved ID
      const updatedWorkflow: EnterpriseWorkflow = {
        ...workflow,
        id: workflowId,
        metadata: {
          ...workflow.metadata,
          lastModified: new Date()
        }
      };

      if (onSuccess) {
        onSuccess(updatedWorkflow);
      }

    } catch (error) {
      console.error('Failed to save workflow:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  }, [workflow, isAuthenticated, user, onSuccess]);

  const handleLoginSuccess = useCallback(async () => {
    console.log('AuthenticatedSaveButton: Login success callback triggered');
    setShowLoginModal(false);
    
    // Wait for auth state to properly update and then retry save
    setTimeout(async () => {
      console.log('AuthenticatedSaveButton: Checking auth state after login');
      
      // Force a re-check of auth state
      const { data: { session } } = await supabase.auth.getSession();
      console.log('AuthenticatedSaveButton: Session check result:', session?.user?.email || 'No user');
      
      if (session?.user) {
        console.log('AuthenticatedSaveButton: User found, checking for draft');
        // Check if we still have the draft
        const savedDraft = draftManager.loadDraft();
        if (savedDraft) {
          console.log('AuthenticatedSaveButton: Draft found, re-triggering save');
          // Re-trigger save with the draft data
          await handleSave();
        } else {
          console.log('AuthenticatedSaveButton: No draft found after login');
        }
      } else {
        console.error('AuthenticatedSaveButton: Login success but no session found');
        setSaveError('Login successful but session not found. Please try saving again.');
      }
    }, 500); // Increased timeout to ensure state updates
  }, [handleSave]);

  const hasDraft = draftManager.hasDraft();

  return (
    <>
      <div className="space-y-2">
        <Button
          onClick={handleSave}
          disabled={!isValid || isSaving}
          leftIcon={isSaving ? <Clock className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          className={className}
        >
          {children || (isSaving ? 'Saving...' : 'Save Workflow')}
        </Button>

        {/* Draft status indicator */}
        {!isAuthenticated && hasDraft && (
          <div className="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
            <Clock className="h-4 w-4 mr-2" />
            <span>Draft saved locally. Sign in to save permanently.</span>
          </div>
        )}

        {/* Error display */}
        {saveError && (
          <div className="flex items-center text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>{saveError}</span>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        title="Sign in to Save Workflow"
        message="Your workflow has been saved as a draft. Please sign in to save it permanently and access it from any device."
      />
    </>
  );
};
