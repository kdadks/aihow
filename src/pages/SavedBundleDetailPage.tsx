import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { workflowBundles } from '../data/workflows';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  MessageCircle,
  Settings,
  CheckCircle2,
  Trash2
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
  bundleData?: any;
}

const SavedBundleDetailPage: React.FC = () => {
  const { bundleId } = useParams<{ bundleId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [bundle, setBundle] = useState<SavedBundle | null>(null);
  const [originalBundle, setOriginalBundle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBundleDetails();
  }, [bundleId]);

  const loadBundleDetails = () => {
    if (!bundleId) {
      navigate('/dashboard/bundles');
      return;
    }

    try {
      // Check if bundle was passed via state (for custom workflows)
      if (location.state?.bundle) {
        setBundle(location.state.bundle);
        setLoading(false);
        return;
      }

      // Load from localStorage
      const savedBundles = JSON.parse(localStorage.getItem('savedBundles') || '[]');
      const savedBundle = savedBundles.find((b: SavedBundle) => b.id === bundleId);
      
      if (savedBundle) {
        setBundle(savedBundle);
        
        // Load original bundle data if it exists
        if (!savedBundle.isCustom) {
          const original = workflowBundles.find(b => b.id === bundleId);
          setOriginalBundle(original);
        }
      } else {
        // Bundle not found in saved items, redirect
        navigate('/dashboard/bundles');
        return;
      }
    } catch (error) {
      console.error('Error loading bundle details:', error);
      navigate('/dashboard/bundles');
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleContactForImplementation = () => {
    if (!bundle) return;
    
    const params = new URLSearchParams({
      bundle: bundle.id,
      bundleName: bundle.name,
      inquiryType: 'implementation'
    });
    navigate(`/contact?${params.toString()}`);
  };

  const handleRemoveFromSaved = () => {
    if (!bundle) return;
    
    if (window.confirm('Are you sure you want to remove this bundle from your saved collection?')) {
      const savedBundles = JSON.parse(localStorage.getItem('savedBundles') || '[]');
      const updatedBundles = savedBundles.filter((b: SavedBundle) => b.id !== bundle.id);
      localStorage.setItem('savedBundles', JSON.stringify(updatedBundles));
      navigate('/dashboard/bundles');
    }
  };

  const handleCustomizeBundle = () => {
    if (!bundle) return;
    
    // Navigate to workflows page with bundle pre-selected for customization
    navigate('/workflows', { 
      state: { 
        selectedBundle: originalBundle || bundle.bundleData,
        customizeMode: true
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
            <p className="mt-4 text-gray-600">Loading bundle details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bundle Not Found</h2>
          <p className="text-gray-600 mb-6">The requested bundle could not be found in your saved collection.</p>
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
            <h1 className="text-3xl font-bold text-gray-900">{bundle.name}</h1>
            {bundle.isCustom && (
              <Badge variant="secondary">Custom</Badge>
            )}
          </div>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Saved on {formatDate(bundle.savedAt)}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{formatCost(bundle.totalCost)}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
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
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{bundle.description}</p>
            </CardContent>
          </Card>

          {/* Tools Included */}
          <Card>
            <CardHeader>
              <CardTitle>Included Tools ({bundle.tools?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {bundle.tools && bundle.tools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bundle.tools.map((tool: any) => (
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
                        <p className="text-sm text-gray-500 truncate">{tool.shortDescription || tool.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No tools information available</p>
              )}
            </CardContent>
          </Card>

          {/* Implementation Steps (if available from original bundle) */}
          {originalBundle?.implementationSteps && (
            <Card>
              <CardHeader>
                <CardTitle>Implementation Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {originalBundle.implementationSteps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
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
              
              {!bundle.isCustom && originalBundle && (
                <Button
                  onClick={handleCustomizeBundle}
                  variant="outline"
                  className="w-full"
                  leftIcon={<Settings className="h-4 w-4" />}
                >
                  Customize Bundle
                </Button>
              )}

              {!bundle.isCustom && originalBundle && (
                <Button
                  onClick={() => navigate(`/bundle/${bundle.id}`)}
                  variant="outline"
                  className="w-full"
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                >
                  View Original Bundle
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Bundle Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Bundle Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Monthly Cost:</span>
                <span className="text-sm font-semibold text-gray-900">{formatCost(bundle.totalCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Tools Included:</span>
                <span className="text-sm font-semibold text-gray-900">{bundle.tools?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Bundle Type:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {bundle.isCustom ? 'Custom' : 'Pre-built'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Saved Date:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(bundle.savedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle2 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Our team can help you implement this bundle in your organization.
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

export default SavedBundleDetailPage;
