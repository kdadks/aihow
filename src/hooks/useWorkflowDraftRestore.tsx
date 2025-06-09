import { useEffect, useState } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { draftManager } from '../utils/workflowDraftManager';
import { EnterpriseWorkflow } from '../components/bundles/EnterpriseWorkflowCreator';

interface DraftState {
  hasDraft: boolean;
  draftWorkflow: EnterpriseWorkflow | null;
  draftAge?: string;
  workflowName?: string;
}

export const useWorkflowDraftRestore = () => {
  const { isAuthenticated, user } = useAuth();
  const [draftState, setDraftState] = useState<DraftState>({
    hasDraft: false,
    draftWorkflow: null
  });
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  useEffect(() => {
    // Check for draft when component mounts or auth state changes
    const checkForDraft = () => {
      const draftInfo = draftManager.getDraftInfo();
      
      if (draftInfo?.exists) {
        const draftWorkflow = draftManager.loadDraft();
        setDraftState({
          hasDraft: true,
          draftWorkflow,
          draftAge: draftInfo.age,
          workflowName: draftInfo.workflowName
        });

        // Show restore prompt if user just logged in and we have a draft
        if (isAuthenticated && draftWorkflow) {
          setShowRestorePrompt(true);
        }
      } else {
        setDraftState({
          hasDraft: false,
          draftWorkflow: null
        });
      }
    };

    checkForDraft();
  }, [isAuthenticated, user]);

  const restoreDraft = (): EnterpriseWorkflow | null => {
    const workflow = draftManager.loadDraft();
    setShowRestorePrompt(false);
    return workflow;
  };

  const discardDraft = () => {
    draftManager.clearDraft();
    setDraftState({
      hasDraft: false,
      draftWorkflow: null
    });
    setShowRestorePrompt(false);
  };

  const dismissRestorePrompt = () => {
    setShowRestorePrompt(false);
  };

  return {
    ...draftState,
    showRestorePrompt,
    restoreDraft,
    discardDraft,
    dismissRestorePrompt
  };
};
