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
import ProcessSection from '../components/bundles/ProcessSection';

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

  const processSectionRef = React.useRef<HTMLDivElement>(null);

  const handleScrollToProcess = () => {
    if (processSectionRef.current) {
      processSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // FAQ data for collapsible section
  const faqItems = [
    {
      question: 'What does "AI subscription cost" mean and how is it calculated?',
      answer: (
        <>
          <p className="text-gray-700 mb-2">
            The <span className="font-medium">AI subscription cost</span> shown for each workflow or bundle is an estimated monthly fee you might pay to use all the included tools and services. This estimate is based on the standard pricing of each tool at typical usage levels, but your actual cost may vary depending on your usage, selected plans, and any discounts or promotions.
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-2">
            <li>Each tool in the workflow may have its own subscription or pay-as-you-go pricing.</li>
            <li>The total cost is calculated by adding up the base subscription prices for all tools in the workflow.</li>
            <li>Some tools may offer free tiers, but advanced features or higher usage may require a paid plan.</li>
          </ul>
          <p className="text-gray-700">
            For the most accurate pricing, please visit the official websites of each tool or contact us for a detailed quote tailored to your needs.
          </p>
        </>
      )
    },
    {
      question: 'How is the total delivery cost calculated?',
      answer: (
        <>
          <p className="text-gray-700 mb-2">
            The <span className="font-medium">total delivery cost</span> for a workflow solution is made up of three main components:
          </p>
          <ul className="list-disc pl-6 text-gray-700 mb-2">
            <li><span className="font-medium">Ongoing Subscription Cost:</span> The recurring monthly or annual fees for the AI tools and services included in your workflow.</li>
            <li><span className="font-medium">Build Cost:</span> A one-time fee for the design, configuration, and implementation of your custom workflow solution.</li>
            <li><span className="font-medium">Support Cost:</span> Optional ongoing fees for maintenance, updates, and technical support after delivery.</li>
          </ul>
          <p className="text-gray-700">
            We provide a detailed breakdown of these costs in your proposal, so you can make an informed decision based on your needs and budget.
          </p>
        </>
      )
    }
    // Add more FAQ items here as needed
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8 sm:mb-12 px-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">AI Workflow Bundles</h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover pre-configured combinations of AI tools designed to work together to solve specific problems and streamline your workflow.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-6 mb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center">
          <div className="flex-1 mb-6 lg:mb-0 lg:mr-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">What are workflow bundles?</h2>
            <p className="text-gray-700 text-sm sm:text-base">
              Workflow bundles are carefully selected combinations of complementary AI tools that work together to solve specific problems. Each bundle provides a complete solution with implementation guides to help you get started quickly.
            </p>
            {/* FAQ Section */}
            <div className="mt-6 sm:mt-8">
              <div className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl shadow-sm divide-y">
                {faqItems.map((item, idx) => (
                  <div key={idx}>
                    <button
                      className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 focus:outline-none flex items-center justify-between group"
                      onClick={() => toggleFaq(idx)}
                      aria-expanded={openFaqIndex === idx}
                    >
                      <span className="text-sm sm:text-lg font-semibold text-blue-700 group-hover:underline pr-2">{item.question}</span>
                      <svg
                        className={`h-4 w-4 sm:h-5 sm:w-5 ml-2 flex-shrink-0 transition-transform duration-200 ${openFaqIndex === idx ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaqIndex === idx && (
                      <div className="px-4 sm:px-6 pb-3 sm:pb-4 animate-fade-in">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Button
                rightIcon={<MoveRight className="h-4 w-4" />}
                onClick={handleCreateNewWorkflow}
                size="lg"
                className="w-full sm:w-auto lg:w-full lg:min-w-[200px] shadow-md hover:shadow-lg transition-shadow"
              >
                Create Custom Workflow
              </Button>
              <Button
                variant="outline"
                onClick={handleScrollToProcess}
                size="lg"
                className="w-full sm:w-auto lg:w-full lg:min-w-[200px] border-2 hover:bg-blue-50 transition-colors"
              >
                Engagement Process
              </Button>
            </div>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
              <div className="text-xs sm:text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, workflowBundles.length)} of {workflowBundles.length} workflow bundles
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {currentBundles.map((workflow) => (
                <Card key={workflow.id} className="overflow-hidden flex flex-col h-full shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
                    <div className="flex items-start space-x-2">
                      <GitBranch className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <CardTitle className="text-lg sm:text-xl leading-tight">{workflow.name}</CardTitle>
                        <p className="mt-2 text-blue-100 text-sm sm:text-base">{workflow.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 sm:pt-6 flex-1 p-4 sm:p-6">
                    <p className="text-gray-700 font-medium mb-3 text-sm sm:text-base">Included Tools:</p>
                    <div className="space-y-3 sm:space-y-4">
                      {workflow.tools.map((tool) => (
                        <div key={tool.id} className="flex items-start space-x-3">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-xs sm:text-sm">
                              {tool.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base leading-tight">{tool.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed">{tool.shortDescription}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Implementation Steps:</h4>
                      <ol className="list-decimal pl-4 sm:pl-5 space-y-1 text-gray-700 text-xs sm:text-sm">
                        {workflow.implementationSteps.map((step, index) => (
                          <li key={index} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 pt-4 p-4 sm:p-6">
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Estimated subscription cost (Subject to usage)</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900">{workflow.totalCost}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          size="md"
                          variant="secondary"
                          onClick={() => handleCustomize(workflow)}
                          className="w-full sm:flex-1 sm:min-w-[140px]"
                        >
                          Customize Bundle
                        </Button>
                        <Button
                          size="md"
                          variant="outline"
                          onClick={() => navigate(`/contact#top?bundle=${workflow.id}&bundleName=${workflow.name}&inquiryType=implementation`)}
                          className="w-full sm:flex-1 sm:min-w-[120px]"
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

            {/* Process Section */}
            <div className="mt-16" ref={processSectionRef}>
              <ProcessSection />
            </div>

            <div className="text-center mt-8 sm:mt-12">
              <div className="max-w-3xl mx-auto bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Need a custom workflow?</h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                  Don't see a workflow bundle that fits your specific needs? We can help you create a custom workflow with the perfect combination of AI tools for your unique requirements.
                </p>
                <Button
                  size="lg"
                  onClick={handleCreateNewWorkflow}
                  className="w-full sm:w-auto shadow-md hover:shadow-lg transition-shadow"
                >
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
