import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { workflowBundles } from '../data/workflows';
import { GitBranch, MoveRight, X } from 'lucide-react';
import { EnterpriseWorkflowCreator, type EnterpriseWorkflow } from '../components/bundles/EnterpriseWorkflowCreator';
import { useWorkflowDraftRestore } from '../hooks/useWorkflowDraftRestore';
import { DraftRestoreModal } from '../components/bundles/DraftRestoreModal';

const WorkflowsPage: React.FC = () => {
  const [showBundleCreator, setShowBundleCreator] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<typeof workflowBundles[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [restoredWorkflow, setRestoredWorkflow] = useState<EnterpriseWorkflow | null>(null);
  
  // Draft restoration hook
  const {
    showRestorePrompt,
    restoreDraft,
    discardDraft,
    dismissRestorePrompt,
    workflowName,
    draftAge
  } = useWorkflowDraftRestore();
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(workflowBundles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBundles = workflowBundles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the page when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveBundle = (bundle: any) => {
    try {
      // Check if it's an Enterprise Workflow or a regular bundle
      if (bundle.metadata && bundle.tools) {
        // It's an Enterprise Workflow - save to savedWorkflows
        const workflowToSave = {
          ...bundle,
          id: bundle.id || `workflow_${Date.now()}`,
          metadata: {
            ...bundle.metadata,
            lastModified: new Date()
          }
        };

        const existingWorkflows = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
        const updatedWorkflows = [...existingWorkflows, workflowToSave];
        localStorage.setItem('savedWorkflows', JSON.stringify(updatedWorkflows));

        alert(`Workflow "${bundle.name}" has been saved to your collection!`);
      } else {
        // It's a regular bundle - this shouldn't happen in WorkflowsPage
        console.log('Regular bundle save not handled in WorkflowsPage');
      }
      
      setShowBundleCreator(false);
      setRestoredWorkflow(null); // Clear restored workflow after save
    } catch (error) {
      console.error('Error saving bundle:', error);
      alert('Failed to save bundle. Please try again.');
    }
  };

  const handleRestoreDraft = () => {
    const draftWorkflow = restoreDraft();
    if (draftWorkflow) {
      setRestoredWorkflow(draftWorkflow);
      setSelectedBundle(null); // Clear any selected bundle
      setShowBundleCreator(true);
    }
  };

  const handleDiscardDraft = () => {
    discardDraft();
    setRestoredWorkflow(null);
  };

  const handleCreateNewWorkflow = () => {
    setRestoredWorkflow(null);
    setSelectedBundle(null);
    setShowBundleCreator(true);
  };

  const navigate = useNavigate();

  // Convert WorkflowBundle to EnterpriseWorkflow format
  const convertBundleToEnterpriseWorkflow = (bundle: typeof workflowBundles[0] | null): EnterpriseWorkflow | null => {
    if (!bundle) return null;
    
    return {
      name: bundle.name,
      description: bundle.description,
      useCase: bundle.description, // Use description as use case
      tools: bundle.tools,
      totalCost: parseFloat(bundle.totalCost.replace(/[^0-9.-]+/g, '')) || 0,
      metadata: {
        version: '1.0.0',
        lastModified: new Date(),
        createdBy: 'current-user',
        status: 'draft',
        tags: []
      },
      collaboration: {
        isShared: false,
        permissions: 'view',
        sharedWith: [],
        allowComments: false,
        requireApproval: false
      },
      approvalWorkflow: {
        isEnabled: false,
        approvers: [],
        status: 'none'
      },
      auditLog: [],
      versionControl: {
        currentVersion: '1.0.0',
        previousVersions: [],
        changeLog: ['Initial workflow creation from bundle template'],
        autoSave: true,
        backupEnabled: true
      }
    };
  };

  const handleCustomize = (bundle: typeof workflowBundles[0]) => {
    setSelectedBundle(bundle);
    setShowBundleCreator(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">AI Workflow Bundles</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Discover pre-configured combinations of AI tools designed to work together to solve specific problems and streamline your workflow.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 mb-6 md:mb-0 md:mr-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">What are workflow bundles?</h2>
            <p className="text-gray-700">
              Workflow bundles are carefully selected combinations of complementary AI tools that work together to solve specific problems. Each bundle provides a complete solution with implementation guides to help you get started quickly.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button 
              rightIcon={<MoveRight className="h-4 w-4" />}
              onClick={handleCreateNewWorkflow}
            >
              Create Custom Workflow
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {showBundleCreator ? (
          <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden mb-12">
            <div className="flex justify-between items-center p-4 bg-white border-b border-blue-100">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedBundle ? `Customize: ${selectedBundle.name}` : 'Create Custom Workflow'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowBundleCreator(false);
                  setSelectedBundle(null);
                }}
                leftIcon={<X className="h-4 w-4" />}
              >
                Close
              </Button>
            </div>
            <EnterpriseWorkflowCreator
              onSave={handleSaveBundle}
              initialWorkflow={restoredWorkflow || convertBundleToEnterpriseWorkflow(selectedBundle)}
            />
          </div>
        ) : (
          <>
            {/* Pagination Info */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, workflowBundles.length)} of {workflowBundles.length} workflow bundles
              </div>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {currentBundles.map((workflow) => (
                <Card key={workflow.id} className="overflow-hidden flex flex-col h-full">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <div className="flex items-center space-x-2">
                      <GitBranch className="h-5 w-5" />
                      <CardTitle>{workflow.name}</CardTitle>
                    </div>
                    <p className="mt-2 text-blue-100">{workflow.description}</p>
                  </CardHeader>
                  <CardContent className="pt-6 flex-1">
                    <p className="text-gray-700 font-medium mb-3">Included Tools:</p>
                    <div className="space-y-4">
                      {workflow.tools.map((tool) => (
                        <div key={tool.id} className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                            <img src={tool.logo} alt={tool.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{tool.name}</h4>
                            <p className="text-sm text-gray-500">{tool.shortDescription}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-3">Implementation Steps:</h4>
                      <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                        {workflow.implementationSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 pt-4">
                    <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">Estimated subscription cost (Subject to usage)</p>
                        <p className="text-lg font-bold text-gray-900">{workflow.totalCost}</p>
                      </div>
                      <div className="flex gap-3 flex-shrink-0">
                        <Button
                          size="md"
                          variant="secondary"
                          onClick={() => handleCustomize(workflow)}
                          className="min-w-[140px]"
                        >
                          Customize Bundle
                        </Button>
                        <Button
                          size="md"
                          variant="outline"
                          onClick={() => navigate(`/contact?bundle=${workflow.id}&bundleName=${workflow.name}&inquiryType=implementation`)}
                          className="min-w-[120px]"
                        >
                          Contact Us
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            <div className="text-center mt-12">
              <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Need a custom workflow?</h2>
                <p className="text-gray-700 mb-6">
                  Don't see a workflow bundle that fits your specific needs? We can help you create a custom workflow with the perfect combination of AI tools for your unique requirements.
                </p>
                <Button size="lg" onClick={handleCreateNewWorkflow}>
                  Create Custom Workflow
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Draft Restore Modal */}
      <DraftRestoreModal
        isOpen={showRestorePrompt}
        onClose={dismissRestorePrompt}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
        workflowName={workflowName}
        draftAge={draftAge}
      />
    </div>
  );
};

export default WorkflowsPage;
