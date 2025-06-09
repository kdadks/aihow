import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Clock, FileText, Trash2, X } from 'lucide-react';

interface DraftRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: () => void;
  onDiscard: () => void;
  workflowName?: string;
  draftAge?: string;
}

export const DraftRestoreModal: React.FC<DraftRestoreModalProps> = ({
  isOpen,
  onClose,
  onRestore,
  onDiscard,
  workflowName,
  draftAge
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Draft Found
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  We found a workflow draft from your previous session
                </p>
                {workflowName && (
                  <p className="text-xs text-blue-700 mt-1">
                    Workflow: "{workflowName}"
                  </p>
                )}
                {draftAge && (
                  <p className="text-xs text-blue-600 mt-1">
                    Saved {draftAge}
                  </p>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Would you like to restore your draft and continue working on it, or start fresh?
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onRestore}
              className="flex-1"
              leftIcon={<FileText className="h-4 w-4" />}
            >
              Restore Draft
            </Button>
            <Button
              variant="outline"
              onClick={onDiscard}
              className="flex-1"
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Start Fresh
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-sm"
          >
            Keep both (decide later)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
