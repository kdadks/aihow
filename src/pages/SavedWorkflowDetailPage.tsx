import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EnterpriseWorkflow } from '../components/bundles/EnterpriseWorkflowCreator';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  MessageCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  GitBranch,
  Users,
  Shield,
  Clock
} from 'lucide-react';
import { userDataService, SavedWorkflow } from '../services/userDataService';

const SavedWorkflowDetailPage: React.FC = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [workflow, setWorkflow] = useState<SavedWorkflow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflowDetails();
  }, [workflowId]);

  const loadWorkflowDetails = async () => {
    if (!workflowId) {
      navigate('/dashboard/bundles');
      return;
    }

    try {
      // Check if workflow was passed via state
      if (location.state?.workflow) {
        setWorkflow(location.state.workflow);
        setLoading(false);
        return;
      }

      // Load from userDataService
      const savedWorkflows = await userDataService.getSavedWorkflows();
      const savedWorkflow = savedWorkflows.find((w: SavedWorkflow) => w.id === workflowId);
      
      if (savedWorkflow) {
        setWorkflow(savedWorkflow);
      } else {
        // Workflow not found in saved items, redirect
        navigate('/dashboard/bundles');
        return;
      }
    } catch (error) {
      console.error('Error loading workflow details:', error);
      navigate('/dashboard/bundles');
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleContactForImplementation = () => {
    if (!workflow) return;
    
    const params = new URLSearchParams({
      bundleName: workflow.name,
      inquiryType: 'implementation'
    });
    navigate(`/contact?${params.toString()}`);
  };

  const handleRemoveFromSaved = async () => {
    if (!workflow) return;
    
    if (window.confirm('Are you sure you want to remove this workflow from your saved collection?')) {
      try {
        await userDataService.removeWorkflowFromCollection(workflow.id);
        navigate('/dashboard/bundles');
      } catch (error) {
        console.error('Error removing workflow:', error);
        // Fallback to navigate anyway
        navigate('/dashboard/bundles');
      }
    }
  };

  const handleEditWorkflow = () => {
    if (!workflow) return;
    
    // Navigate to workflows page with workflow pre-loaded for editing
    navigate('/workflows', { 
      state: { 
        editWorkflow: workflow,
        editMode: true
      }
    });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading workflow details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Workflow Not Found</h2>
          <p className="text-gray-600 mb-6">The requested workflow could not be found in your saved collection.</p>
          <Button onClick={() => navigate('/dashboard/bundles')} variant="primary">
            Back to My Bundles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard/bundles')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          className="mr-4"
        >
          Back to My Bundles
        </Button>
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">{workflow.name}</h1>
            <Badge className={getStatusColor(workflow.metadata?.status || 'draft')}>
              {workflow.metadata?.status || 'draft'}
            </Badge>
          </div>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Modified {formatDate(workflow.metadata?.lastModified || new Date())}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>${workflow.totalCost}/month</span>
            </div>
            <div className="flex items-center">
              <GitBranch className="h-4 w-4 mr-1" />
              <span>v{workflow.metadata?.version || '1.0'}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleEditWorkflow}
            leftIcon={<Edit3 className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={handleRemoveFromSaved}
            leftIcon={<Trash2 className="h-4 w-4" />}
            className="text-red-600 hover:text-red-700"
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description & Use Case */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflow.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{workflow.description}</p>
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Use Case</h4>
                <p className="text-gray-700 leading-relaxed">{workflow.useCase}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tools Included */}
          <Card>
            <CardHeader>
              <CardTitle>Included Tools ({workflow.tools.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workflow.tools.map((tool: any) => (
                  <div key={tool.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={tool.logo} 
                        alt={tool.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzM3NDE1MSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BSTwvdGV4dD4KPC9zdmc+';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{tool.name}</h4>
                      <p className="text-sm text-gray-500 truncate">{tool.shortDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metadata & Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Collaboration Settings */}
            {(workflow as any).collaboration && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Collaboration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Shared:</span>
                      <span className={(workflow as any).collaboration?.isShared ? 'text-green-600' : 'text-gray-500'}>
                        {(workflow as any).collaboration?.isShared ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Permissions:</span>
                      <span className="capitalize">{(workflow as any).collaboration?.permissions || 'view'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Comments:</span>
                      <span className={(workflow as any).collaboration?.allowComments ? 'text-green-600' : 'text-gray-500'}>
                        {(workflow as any).collaboration?.allowComments ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Approval Status */}
            {(workflow as any).approvalWorkflow && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Approval Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={`text-xs ${
                        (workflow as any).approvalWorkflow?.status === 'approved' ? 'bg-green-100 text-green-800' :
                        (workflow as any).approvalWorkflow?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        (workflow as any).approvalWorkflow?.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {(workflow as any).approvalWorkflow?.status || 'draft'}
                      </Badge>
                    </div>
                    {(workflow as any).approvalWorkflow?.approvedAt && (
                      <div className="flex justify-between">
                        <span>Approved:</span>
                        <span>{formatDate((workflow as any).approvalWorkflow?.approvedAt)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tags */}
          {workflow.metadata?.tags && workflow.metadata.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {workflow.metadata.tags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleContactForImplementation}
                variant="primary"
                className="w-full"
                leftIcon={<MessageCircle className="h-4 w-4" />}
              >
                Contact for Implementation
              </Button>
              
              <Button
                onClick={handleEditWorkflow}
                variant="outline"
                className="w-full"
                leftIcon={<Edit3 className="h-4 w-4" />}
              >
                Edit Workflow
              </Button>
            </CardContent>
          </Card>

          {/* Workflow Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Monthly Cost:</span>
                <span className="text-sm font-semibold text-gray-900">${workflow.totalCost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Tools Included:</span>
                <span className="text-sm font-semibold text-gray-900">{workflow.tools.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Version:</span>
                <span className="text-sm font-semibold text-gray-900">{workflow.metadata?.version || '1.0'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <Badge className={`text-xs ${getStatusColor(workflow.metadata?.status || 'draft')}`}>
                  {workflow.metadata?.status || 'draft'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Created By:</span>
                <span className="text-sm font-semibold text-gray-900">{workflow.metadata?.createdBy || 'Unknown'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Version Control */}
          {(workflow as any).versionControl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Version History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Current:</span>
                    <span>v{(workflow as any).versionControl?.currentVersion || '1.0'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Previous Versions:</span>
                    <span>{(workflow as any).versionControl?.previousVersions?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">Auto-save:</span>
                    <span className={(workflow as any).versionControl?.autoSave ? 'text-green-600' : 'text-gray-500'}>
                      {(workflow as any).versionControl?.autoSave ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium text-blue-900 mb-2">Need Implementation Help?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Our team can help you implement this custom workflow in your organization.
                </p>
                <Button
                  onClick={handleContactForImplementation}
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  Get Implementation Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SavedWorkflowDetailPage;
