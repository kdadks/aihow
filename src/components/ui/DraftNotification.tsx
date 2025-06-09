import React from 'react';
import { AlertCircle, Clock, FileText } from 'lucide-react';
import { Button } from '../ui/Button';

interface DraftNotificationProps {
  workflowName: string;
  age: string;
  onRestore: () => void;
  onDiscard: () => void;
  className?: string;
}

export const DraftNotification: React.FC<DraftNotificationProps> = ({
  workflowName,
  age,
  onRestore,
  onDiscard,
  className = ''
}) => {
  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <FileText className="h-5 w-5 text-amber-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-amber-800">
              Draft Found
            </h4>
            <div className="flex items-center text-xs text-amber-600">
              <Clock className="h-3 w-3 mr-1" />
              <span>{age}</span>
            </div>
          </div>
          
          <p className="text-sm text-amber-700 mb-3">
            You have an unsaved workflow: <span className="font-medium">"{workflowName}"</span>
          </p>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={onRestore}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Restore Draft
            </Button>
            <Button
              onClick={onDiscard}
              variant="outline"
              size="sm"
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              Discard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DraftRestoreModalProps {
  isOpen: boolean;
  workflowName: string;
  age: string;
  onRestore: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}

export const DraftRestoreModal: React.FC<DraftRestoreModalProps> = ({
  isOpen,
  workflowName,
  age,
  onRestore,
  onDiscard,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-amber-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">
              Restore Previous Work?
            </h3>
          </div>
          
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-600">
              We found an unsaved workflow from your previous session:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">"{workflowName}"</span>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{age}</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              Would you like to restore this draft or start fresh?
            </p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              onClick={onRestore}
              className="w-full"
            >
              Restore Draft
            </Button>
            <div className="flex space-x-2">
              <Button
                onClick={onDiscard}
                variant="outline"
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
              >
                Start Fresh
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
