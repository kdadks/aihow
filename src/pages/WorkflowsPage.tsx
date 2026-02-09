import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useBundles } from '../services/api/v2/bundles';
import { BundleV2 } from '../types/bundle.types';
import { GitBranch, MoveRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { EnterpriseWorkflowCreator, type EnterpriseWorkflow } from '../components/bundles/EnterpriseWorkflowCreator';
import { useWorkflowDraftRestore } from '../hooks/useWorkflowDraftRestore';
import { DraftRestoreModal } from '../components/bundles/DraftRestoreModal';
import { userDataService } from '../services/userDataService';
import ProcessSection from '../components/bundles/ProcessSection';

// Compact bundle card for marquee rows
interface BundleCardProps {
  workflow: BundleV2;
  onCustomize: (w: BundleV2) => void;
  onContact: (w: BundleV2) => void;
}

const BundleCard: React.FC<BundleCardProps> = ({ workflow, onCustomize, onContact }) => (
  <div className="w-80 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-md shadow-gray-100/80 border border-gray-100 flex flex-col hover:shadow-xl hover:shadow-violet-100/40 transition-all duration-300">
    {/* Gradient header */}
    <div className="bg-gradient-to-r from-violet-600 to-blue-600 p-4 text-white">
      <div className="flex items-start gap-2">
        <GitBranch className="h-4 w-4 mt-0.5 flex-shrink-0 opacity-80" />
        <div className="min-w-0">
          <h3 className="font-bold text-sm leading-tight">{workflow.name}</h3>
          <p className="mt-1 text-violet-100 text-xs leading-relaxed line-clamp-2">{workflow.description}</p>
        </div>
      </div>
    </div>

    {/* Tools list (compact) */}
    <div className="p-4 flex-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Included Tools</p>
      <div className="space-y-2">
        {workflow.tools.slice(0, 3).map((tool) => (
          <div key={tool.id} className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">{tool.name.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 leading-tight truncate">{tool.name}</p>
              <p className="text-xs text-gray-400 truncate">{tool.short_description}</p>
            </div>
          </div>
        ))}
        {workflow.tools.length > 3 && (
          <p className="text-xs text-violet-600 font-medium pl-9">+{workflow.tools.length - 3} more tools</p>
        )}
      </div>
    </div>

    {/* Footer */}
    <div className="border-t border-gray-100 p-4">
      <div className="mb-3">
        <p className="text-xs text-gray-400">Est. subscription cost</p>
        <p className="text-base font-bold text-gray-900">{workflow.total_cost ?? 'Contact for pricing'}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onCustomize(workflow)}
          className="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 transition-all"
        >
          Customize
        </button>
        <button
          onClick={() => onContact(workflow)}
          className="flex-1 text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 text-gray-700 hover:border-violet-200 hover:text-violet-700 transition-all"
        >
          Contact Us
        </button>
      </div>
    </div>
  </div>
);

const WorkflowsPage: React.FC = () => {
  const [showBundleCreator, setShowBundleCreator] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<BundleV2 | null>(null);
  const [restoredWorkflow, setRestoredWorkflow] = useState<EnterpriseWorkflow | null>(null);
  const { data: { bundles: workflowBundles = [] } = {}, isLoading } = useBundles({ limit: 50 });

  // Draft restoration hook
  const {
    showRestorePrompt,
    restoreDraft,
    discardDraft,
    dismissRestorePrompt,
    workflowName,
    draftAge
  } = useWorkflowDraftRestore();

  // Drag-to-scroll refs
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const dragState = React.useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragState.current.isDown = true;
    dragState.current.startX = e.pageX - (scrollContainerRef.current?.offsetLeft ?? 0);
    dragState.current.scrollLeft = scrollContainerRef.current?.scrollLeft ?? 0;
  };
  const onMouseLeave = () => { dragState.current.isDown = false; };
  const onMouseUp = () => { dragState.current.isDown = false; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.isDown || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollContainerRef.current.offsetLeft ?? 0);
    const walk = (x - dragState.current.startX) * 1.5;
    scrollContainerRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };
  const onTouchStart = (e: React.TouchEvent) => {
    dragState.current.isDown = true;
    dragState.current.startX = e.touches[0].pageX;
    dragState.current.scrollLeft = scrollContainerRef.current?.scrollLeft ?? 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragState.current.isDown || !scrollContainerRef.current) return;
    const walk = (e.touches[0].pageX - dragState.current.startX) * 1.5;
    scrollContainerRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };
  const onTouchEnd = () => { dragState.current.isDown = false; };
  const scrollBy = (amount: number) => {
    scrollContainerRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleSaveBundle = async (bundle: any) => {
    try {
      // Check if it's an Enterprise Workflow or a regular bundle
      if (bundle.metadata && bundle.tools) {
        // It's an Enterprise Workflow - save to savedWorkflows
        const workflowToSave = {
          id: bundle.id || `workflow_${Date.now()}`,
          name: bundle.name,
          description: bundle.description,
          useCase: bundle.useCase,
          totalCost: bundle.total_cost || 0,
          tools: bundle.tools,
          metadata: {
            ...bundle.metadata,
            lastModified: new Date()
          },
          workflowData: bundle
        };

        await userDataService.saveWorkflowToCollection(workflowToSave);
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
      description: bundle.description || '',
      useCase: bundle.description || '', // Use description as use case
      tools: bundle.tools,
      totalCost: bundle.total_cost ? parseFloat(bundle.total_cost.replace(/[^0-9.-]+/g, '')) : 0,
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

  const handleScrollToWhyUs = () => {
    document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' });
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
              <Button
                variant="outline"
                onClick={handleScrollToWhyUs}
                size="lg"
                className="w-full sm:w-auto lg:w-full lg:min-w-[200px] border-2 hover:bg-violet-50 hover:border-violet-300 hover:text-violet-700 transition-colors"
              >
                Why Us
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
            {/* Scroll controls */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 select-none">Drag or swipe to browse bundles</span>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollBy(-340)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-violet-50 hover:text-violet-600 transition-all"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollBy(340)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-violet-50 hover:text-violet-600 transition-all"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Swipeable 2-row scroll container */}
            <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
              {/* Left fade */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              {/* Right fade */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

              <div
                ref={scrollContainerRef}
                className="overflow-x-auto cursor-grab active:cursor-grabbing select-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="flex flex-col gap-4 w-max px-4 py-2">
                  {/* Row 1 */}
                  <div className="flex gap-4">
                    {workflowBundles.map((workflow) => (
                      <BundleCard
                        key={`r1-${workflow.id}`}
                        workflow={workflow}
                        onCustomize={handleCustomize}
                        onContact={(w) => navigate(`/contact#top?bundle=${w.id}&bundleName=${w.name}&inquiryType=implementation`)}
                      />
                    ))}
                  </div>
                  {/* Row 2 */}
                  <div className="flex gap-4">
                    {workflowBundles.map((workflow) => (
                      <BundleCard
                        key={`r2-${workflow.id}`}
                        workflow={workflow}
                        onCustomize={handleCustomize}
                        onContact={(w) => navigate(`/contact#top?bundle=${w.id}&bundleName=${w.name}&inquiryType=implementation`)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
