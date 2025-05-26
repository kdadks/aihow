import React, { useState } from 'react';
import { BundleCreator } from '../components/bundles/BundleCreator';
import { workflowBundles } from '../data/workflows';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { GitBranch, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

const BundlePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'create' | 'browse'>('create');
  const [selectedBundle, setSelectedBundle] = useState<typeof workflowBundles[0] | null>(null);
  const [showBundleDetails, setShowBundleDetails] = useState(false);

  const handleSaveBundle = (bundle: any) => {
    // Handle saving the bundle (would typically involve API call)
    console.log('Saving bundle:', bundle);
  };

  const handleUseBundle = (bundle: typeof workflowBundles[0]) => {
    setSelectedBundle(bundle);
    setActiveView('create');
  };

  const handleViewDetails = (bundle: typeof workflowBundles[0]) => {
    setSelectedBundle(bundle);
    setShowBundleDetails(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">AI Tool Bundles</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            {activeView === 'create' 
              ? 'Create your custom bundle by describing your needs or browsing tools'
              : 'Discover pre-configured tool combinations for different use cases'}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => setActiveView(activeView === 'create' ? 'browse' : 'create')}
          className="ml-4"
        >
          {activeView === 'create' ? 'Browse Bundles' : 'Create Bundle'}
        </Button>
      </div>

      {activeView === 'create' ? (
        <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          <BundleCreator onSave={handleSaveBundle} initialBundle={selectedBundle} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {workflowBundles.map((bundle) => (
            <Card key={bundle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5" />
                    <CardTitle>{bundle.name}</CardTitle>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUseBundle(bundle)}
                    className="bg-white/10 hover:bg-white/20"
                  >
                    Use Bundle
                  </Button>
                </div>
                <p className="mt-2 text-blue-100">{bundle.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Included Tools</span>
                </div>
                <div className="space-y-4 mb-6">
                  {bundle.tools.map((tool) => (
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

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Cost</p>
                      <p className="text-lg font-bold text-gray-900">{bundle.totalCost}</p>
                    </div>
                    <Button
                      onClick={() => handleViewDetails(bundle)}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog 
        open={showBundleDetails}
        onClose={() => setShowBundleDetails(false)}
        className="max-w-3xl"
      >
        {selectedBundle && (
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedBundle.name}</h2>
                <p className="text-gray-600 mt-1">{selectedBundle.description}</p>
              </div>
              <Button
                onClick={() => {
                  handleUseBundle(selectedBundle);
                  setShowBundleDetails(false);
                }}
              >
                Use This Bundle
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Implementation Steps</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ol className="list-decimal list-inside space-y-3">
                    {selectedBundle.implementationSteps.map((step, index) => (
                      <li key={index} className="text-gray-700">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Included Tools</h3>
                <div className="grid gap-4">
                  {selectedBundle.tools.map((tool) => (
                    <div key={tool.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start space-x-4">
                        <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                          <img src={tool.logo} alt={tool.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{tool.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">{tool.description || tool.shortDescription}</p>
                          {tool.features && (
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {tool.features.slice(0, 2).map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default BundlePage;