import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { EnterpriseWorkflowCreator } from '../components/bundles/EnterpriseWorkflowCreator';
import { BundleCreator } from '../components/bundles/BundleCreator';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { 
  Workflow, 
  Building2, 
  Users, 
  Shield, 
  Star, 
  Clock, 
  TrendingUp,
  Settings,
  Plus,
  Eye,
  Edit,
  Share2,
  Download
} from 'lucide-react';
import { enterpriseWorkflowService } from '../services/enterpriseWorkflowService';
import type { EnterpriseWorkflow } from '../components/bundles/EnterpriseWorkflowCreator';

interface WorkflowSummary {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  toolCount: number;
  totalCost: number;
  lastModified: Date;
  isShared: boolean;
  tags: string[];
  department?: string;
}

export const EnhancedBundlePage: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'create' | 'enterprise-create' | 'my-workflows' | 'shared-workflows'>('create');
  const [myWorkflows, setMyWorkflows] = useState<WorkflowSummary[]>([]);
  const [sharedWorkflows, setSharedWorkflows] = useState<WorkflowSummary[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<EnterpriseWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    preferEnterpriseFeatures: true,
    showComplianceTools: true,
    defaultDepartment: '',
    organizationId: 'demo-org'
  });

  // Load user workflows on component mount
  useEffect(() => {
    if (user) {
      loadUserWorkflows();
      loadSharedWorkflows();
    }
  }, [user]);

  const loadUserWorkflows = async () => {
    try {
      setIsLoading(true);
      // Mock data for demonstration - in real app, this would call the service
      setMyWorkflows([
        {
          id: '1',
          name: 'AI Development Pipeline',
          description: 'Complete AI-powered development workflow',
          status: 'published',
          toolCount: 5,
          totalCost: 89.99,
          lastModified: new Date('2024-01-15'),
          isShared: true,
          tags: ['development', 'ai', 'automation'],
          department: 'Engineering'
        },
        {
          id: '2',
          name: 'Marketing Content Creation',
          description: 'Automated marketing content generation workflow',
          status: 'draft',
          toolCount: 3,
          totalCost: 45.50,
          lastModified: new Date('2024-01-10'),
          isShared: false,
          tags: ['marketing', 'content', 'automation'],
          department: 'Marketing'
        }
      ]);
    } catch (error) {
      console.error('Error loading user workflows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSharedWorkflows = async () => {
    try {
      // Mock data for demonstration
      setSharedWorkflows([
        {
          id: '3',
          name: 'Enterprise Security Compliance',
          description: 'Security-focused workflow for enterprise compliance',
          status: 'published',
          toolCount: 7,
          totalCost: 150.00,
          lastModified: new Date('2024-01-12'),
          isShared: true,
          tags: ['security', 'compliance', 'enterprise'],
          department: 'Security'
        }
      ]);
    } catch (error) {
      console.error('Error loading shared workflows:', error);
    }
  };

  // Handle workflow save
  const handleSaveWorkflow = async (workflow: EnterpriseWorkflow) => {
    try {
      setIsLoading(true);
      
      if (user) {
        if (workflow.id) {
          await enterpriseWorkflowService.updateEnterpriseWorkflow(workflow.id, workflow, user.id);
        } else {
          await enterpriseWorkflowService.createEnterpriseWorkflow(workflow, user.id);
        }
        
        await loadUserWorkflows();
        setActiveView('my-workflows');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to save workflow. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle workflow export
  const handleExportWorkflow = async (workflow: EnterpriseWorkflow) => {
    try {
      const exportData = await enterpriseWorkflowService.exportWorkflow(workflow, 'json');
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${workflow.name.replace(/\s+/g, '_')}_workflow.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting workflow:', error);
      alert('Failed to export workflow.');
    }
  };

  // Handle workflow sharing
  const handleShareWorkflow = (workflow: EnterpriseWorkflow) => {
    // In a real app, this would open a sharing modal
    alert('Sharing functionality would open a modal to select users and permissions.');
  };

  // Render workflow summary card
  const renderWorkflowCard = (workflowSummary: WorkflowSummary, isShared = false) => (
    <Card key={workflowSummary.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold">{workflowSummary.name}</CardTitle>
            <p className="text-sm text-gray-600">{workflowSummary.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              className={
                workflowSummary.status === 'published' ? 'bg-green-100 text-green-800' :
                workflowSummary.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }
            >
              {workflowSummary.status.charAt(0).toUpperCase() + workflowSummary.status.slice(1)}
            </Badge>
            {workflowSummary.isShared && (
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Share2 className="h-3 w-3 mr-1" />
                Shared
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {workflowSummary.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Tools:</span>
            <div className="font-semibold">{workflowSummary.toolCount}</div>
          </div>
          <div>
            <span className="text-gray-500">Cost:</span>
            <div className="font-semibold">${workflowSummary.totalCost}/mo</div>
          </div>
          <div>
            <span className="text-gray-500">Department:</span>
            <div className="font-semibold">{workflowSummary.department || 'General'}</div>
          </div>
          <div>
            <span className="text-gray-500">Modified:</span>
            <div className="font-semibold">{workflowSummary.lastModified.toLocaleDateString()}</div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Eye className="h-4 w-4" />}
            onClick={() => {
              // In real app, this would load the full workflow and set it as selected
              setActiveView('enterprise-create');
            }}
          >
            View
          </Button>
          {!isShared && (
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => {
                // In real app, this would load the workflow for editing
                setActiveView('enterprise-create');
              }}
            >
              Edit
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => {
              // Mock export
              alert('Export functionality would download the workflow');
            }}
          >
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Workflow className="h-8 w-8 text-blue-600 mr-3" />
                Enterprise Workflow Studio
              </h1>
              <p className="mt-2 text-gray-600">
                Create, manage, and share AI-powered workflows with enterprise-grade features
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setActiveView('create')}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Quick Create
              </Button>
              <Button
                onClick={() => setActiveView('enterprise-create')}
                leftIcon={<Building2 className="h-4 w-4" />}
              >
                Enterprise Creator
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'enterprise-create', name: 'Create Workflow', icon: Plus },
                { id: 'my-workflows', name: 'My Workflows', icon: Workflow },
                { id: 'shared-workflows', name: 'Shared Workflows', icon: Users },
                { id: 'create', name: 'Quick Create', icon: Star }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`${
                    activeView === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeView === 'enterprise-create' && (
          <EnterpriseWorkflowCreator
            onSave={handleSaveWorkflow}
            onExport={handleExportWorkflow}
            onShare={handleShareWorkflow}
            initialWorkflow={selectedWorkflow}
            showComplianceFeatures={userPreferences.showComplianceTools}
          />
        )}

        {activeView === 'create' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Workflow Creator</h2>
              <p className="text-gray-600 mt-1">
                Simple workflow creation with basic features
              </p>
            </div>
            <div className="p-6">
              <BundleCreator
                onSave={(bundle) => {
                  // Convert basic bundle to enterprise workflow
                  const enterpriseWorkflow: EnterpriseWorkflow = {
                    name: bundle.name,
                    description: `Quick workflow created with ${bundle.tools.length} tools`,
                    useCase: 'Quick workflow creation',
                    tools: bundle.tools,
                    totalCost: bundle.totalCost,
                    metadata: {
                      version: '1.0.0',
                      lastModified: new Date(),
                      createdBy: user?.id || 'anonymous',
                      status: 'draft',
                      tags: ['quick-create']
                    },
                    collaboration: {
                      isShared: false,
                      permissions: 'view',
                      sharedWith: [],
                      allowComments: false,
                      requireApproval: false
                    }
                  };
                  handleSaveWorkflow(enterpriseWorkflow);
                }}
              />
            </div>
          </div>
        )}

        {activeView === 'my-workflows' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">My Workflows</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Workflow className="h-4 w-4 mr-1" />
                  {myWorkflows.length} workflows
                </span>
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  ${myWorkflows.reduce((sum, w) => sum + w.totalCost, 0).toFixed(2)}/mo total
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading workflows...</p>
              </div>
            ) : myWorkflows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myWorkflows.map(workflow => renderWorkflowCard(workflow))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No workflows yet</h3>
                <p className="text-gray-500 mb-6">Create your first workflow to get started</p>
                <Button
                  onClick={() => setActiveView('enterprise-create')}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Create Workflow
                </Button>
              </div>
            )}
          </div>
        )}

        {activeView === 'shared-workflows' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Shared Workflows</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {sharedWorkflows.length} shared workflows
                </span>
              </div>
            </div>

            {sharedWorkflows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedWorkflows.map(workflow => renderWorkflowCard(workflow, true))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No shared workflows</h3>
                <p className="text-gray-500">Workflows shared with you will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Enterprise Features Info Panel */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900">Compliance & Governance</h4>
                  <p className="text-gray-600">GDPR, HIPAA, SOX compliance tracking with audit logs</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Collaboration</h4>
                  <p className="text-gray-600">Team sharing, approval workflows, and comments</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Advanced Analytics</h4>
                  <p className="text-gray-600">ROI tracking, cost optimization, and usage analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedBundlePage;