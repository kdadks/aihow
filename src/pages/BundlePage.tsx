import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { BundleCreator } from '../components/bundles/BundleCreator';
import { workflowBundles } from '../data/workflows';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GitBranch, ArrowRight, CheckCircle2, Layers } from 'lucide-react';

const BundlePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'create' | 'browse'>('create');
  const location = useLocation();
  const [selectedBundle, setSelectedBundle] = useState<typeof workflowBundles[0] | null>(null);

  useEffect(() => {
    const state = location.state as { customizeBundle?: typeof workflowBundles[0] };
    if (state?.customizeBundle) {
      setSelectedBundle(state.customizeBundle);
      setActiveView('create');
    }
  }, [location.state]);

  const handleSaveBundle = (bundle: any) => {
    // Handle saving the bundle (would typically involve API call)
    console.log('Saving bundle:', bundle);
  };

  const handleUseBundle = (bundle: typeof workflowBundles[0]) => {
    setSelectedBundle(bundle);
    setActiveView('create');
  };

  const handleGetStarted = (bundle: typeof workflowBundles[0]) => {
    navigate(`/bundle/${bundle.id}`);
  };

  const handleViewDetails = (bundle: typeof workflowBundles[0]) => {
    navigate(`/bundle/${bundle.id}`);
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
            <Card key={bundle.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5" />
                    <CardTitle>{bundle.name}</CardTitle>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleGetStarted(bundle)}
                      className="bg-white/10 hover:bg-white/20 min-w-[100px]"
                    >
                      Get Started
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUseBundle(bundle)}
                      className="bg-white/10 hover:bg-white/20 min-w-[90px]"
                    >
                      Customize
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-blue-100">{bundle.description}</p>
              </CardHeader>
              <CardContent className="pt-6 flex-1">
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
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Estimated subscription cost (Subject to usage)</p>
                      <p className="text-lg font-bold text-gray-900">{bundle.totalCost}</p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <Button
                        size="md"
                        onClick={() => handleGetStarted(bundle)}
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                        className="min-w-[120px]"
                      >
                        Get Started
                      </Button>
                      <Button
                        size="md"
                        variant="secondary"
                        onClick={() => handleUseBundle(bundle)}
                        className="min-w-[100px]"
                      >
                        Customize
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BundlePage;
