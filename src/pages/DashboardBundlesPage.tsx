import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { workflowBundles } from '../data/workflows';
import { EnterpriseWorkflow } from '../components/bundles/EnterpriseWorkflowCreator';
import { 
  GitBranch, 
  Calendar, 
  Eye, 
  Trash2, 
  Plus,
  Bookmark,
  MessageCircle,
  Settings
} from 'lucide-react';

interface SavedBundle {
  id: string;
  name: string;
  description: string;
  totalCost: string | number;
  savedAt: string;
  type: 'workflow' | 'bundle';
  isCustom?: boolean;
  tools?: any[];
  bundleData?: any; // Full bundle data for reference
}

const DashboardBundlesPage: React.FC = () => {
  const navigate = useNavigate();
  const [savedBundles, setSavedBundles] = useState<SavedBundle[]>([]);
  const [savedWorkflows, setSavedWorkflows] = useState<EnterpriseWorkflow[]>([]);
  const [activeTab, setActiveTab] = useState<'bundles' | 'workflows'>('bundles');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedItems();
  }, []);

  const loadSavedItems = () => {
    setLoading(true);
    try {
      // Load saved bundles from localStorage
      const bundlesData = JSON.parse(localStorage.getItem('savedBundles') || '[]');
      const workflowsData = JSON.parse(localStorage.getItem('savedWorkflows') || '[]');
      
      // Enhance bundles with full data from workflowBundles
      const enhancedBundles = bundlesData.map((saved: any) => {
        const fullBundle = workflowBundles.find(b => b.id === saved.id);
        return {
          ...saved,
          type: saved.type || 'bundle',
          bundleData: fullBundle,
          tools: fullBundle?.tools || saved.tools || []
        };
      });

      setSavedBundles(enhancedBundles);
      setSavedWorkflows(workflowsData);
    } catch (error) {
      console.error('Error loading saved items:', error);
      setSavedBundles([]);
      setSavedWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (bundle: SavedBundle) => {
    if (bundle.isCustom || !bundle.bundleData) {
      // For custom workflows, navigate to a custom bundle detail page
      navigate(`/dashboard/bundles/${bundle.id}`, { 
        state: { bundle } 
      });
    } else {
      // For saved bundles from the main collection, navigate to the original bundle page
      navigate(`/bundle/${bundle.id}`, {
        state: { fromSaved: true }
      });
    }
  };

  const handleViewWorkflowDetails = (workflow: EnterpriseWorkflow) => {
    navigate(`/dashboard/workflows/${workflow.id}`, { 
      state: { workflow } 
    });
  };

  const handleRemoveBundle = (bundleId: string) => {
    if (window.confirm('Are you sure you want to remove this bundle from your saved collection?')) {
      const updatedBundles = savedBundles.filter(b => b.id !== bundleId);
      setSavedBundles(updatedBundles);
      localStorage.setItem('savedBundles', JSON.stringify(updatedBundles));
    }
  };

  const handleRemoveWorkflow = (workflowId: string) => {
    if (window.confirm('Are you sure you want to remove this workflow from your saved collection?')) {
      const updatedWorkflows = savedWorkflows.filter(w => w.id !== workflowId);
      setSavedWorkflows(updatedWorkflows);
      localStorage.setItem('savedWorkflows', JSON.stringify(updatedWorkflows));
    }
  };

  const handleContactForImplementation = (bundle: SavedBundle) => {
    const params = new URLSearchParams({
      bundle: bundle.id,
      bundleName: bundle.name,
      inquiryType: 'implementation'
    });
    navigate(`/contact?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCost = (cost: string | number) => {
    if (typeof cost === 'number') {
      return `$${cost}/month`;
    }
    return cost.toString().includes('$') ? cost : `$${cost}/month`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your saved bundles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My AI Bundles</h1>
          <p className="mt-2 text-gray-600">
            Manage your saved workflow bundles and custom AI tool combinations
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => navigate('/workflows')}
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create/Browse Workflow
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('bundles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bundles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bookmark className="h-4 w-4" />
              <span>Saved Bundles ({savedBundles.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('workflows')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'workflows'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Custom Workflows ({savedWorkflows.length})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'bundles' && (
        <div>
          {savedBundles.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved bundles yet</h3>
              <p className="text-gray-600 mb-6">
                Start by creating or browsing our curated workflow bundles and save the ones that interest you.
              </p>
              <Button
                onClick={() => navigate('/workflows')}
                variant="primary"
                leftIcon={<GitBranch className="h-4 w-4" />}
              >
                Create/Browse Workflow
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedBundles.map((bundle) => (
                <Card key={bundle.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 line-clamp-2">{bundle.name}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Saved {formatDate(bundle.savedAt)}</span>
                          </div>
                          {bundle.isCustom && (
                            <Badge variant="secondary">Custom</Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBundle(bundle.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{bundle.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Cost:</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCost(bundle.totalCost)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Tools:</span>
                        <span className="text-sm font-semibold text-gray-900">{bundle.tools?.length || 0} tools</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => handleViewDetails(bundle)}
                        variant="primary"
                        size="sm"
                        className="w-full"
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleContactForImplementation(bundle)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                        leftIcon={<MessageCircle className="h-4 w-4" />}
                      >
                        Contact for Implementation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'workflows' && (
        <div>
          {savedWorkflows.length === 0 ? (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No custom workflows yet</h3>
              <p className="text-gray-600 mb-6">
                Create custom workflows using our Enterprise Workflow Creator to build tailored AI solutions.
              </p>
              <Button
                onClick={() => navigate('/workflows')}
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create Custom Workflow
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedWorkflows.map((workflow) => (
                <Card key={workflow.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2 line-clamp-2">{workflow.name}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Modified {formatDate(workflow.metadata.lastModified.toString())}</span>
                          </div>
                          <Badge variant={workflow.metadata.status === 'published' ? 'default' : 'secondary'}>
                            {workflow.metadata.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveWorkflow(workflow.id!)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{workflow.description || workflow.useCase}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Cost:</span>
                        <span className="text-sm font-semibold text-gray-900">${workflow.totalCost}/month</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Tools:</span>
                        <span className="text-sm font-semibold text-gray-900">{workflow.tools.length} tools</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Version:</span>
                        <span className="text-sm font-semibold text-gray-900">{workflow.metadata.version}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => handleViewWorkflowDetails(workflow)}
                        variant="primary"
                        size="sm"
                        className="w-full"
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => {
                          const params = new URLSearchParams({
                            bundleName: workflow.name,
                            inquiryType: 'implementation'
                          });
                          navigate(`/contact?${params.toString()}`);
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full"
                        leftIcon={<MessageCircle className="h-4 w-4" />}
                      >
                        Contact for Implementation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardBundlesPage;
