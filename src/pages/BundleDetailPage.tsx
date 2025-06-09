import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { workflowBundles } from '../data/workflows';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { ArrowLeft, CheckCircle2, Settings, MessageCircle, Bookmark } from 'lucide-react';
import { BundleCreator } from '../components/bundles/BundleCreator';

const BundleDetailPage: React.FC = () => {
  const { bundleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bundle] = useState(workflowBundles.find(b => b.id === bundleId));
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [bundleSaved, setBundleSaved] = useState(false);
  
  // Check if user came from recommendation
  const isFromRecommendation = searchParams.get('source') === 'recommendation';

  useEffect(() => {
    if (!bundle) {
      navigate('/bundle', { replace: true });
    }
  }, [bundle, navigate]);

  const handleSaveBundle = () => {
    if (bundle) {
      try {
        // Save bundle to localStorage
        const savedBundles = JSON.parse(localStorage.getItem('savedBundles') || '[]');
        const bundleExists = savedBundles.some((saved: any) => saved.id === bundle.id);
        
        if (!bundleExists) {
          const bundleToSave = {
            id: bundle.id,
            name: bundle.name,
            description: bundle.description,
            totalCost: bundle.totalCost,
            savedAt: new Date().toISOString(),
            type: 'bundle',
            isCustom: false,
            tools: bundle.tools,
            bundleData: bundle // Store full bundle data for reference
          };
          
          savedBundles.push(bundleToSave);
          localStorage.setItem('savedBundles', JSON.stringify(savedBundles));
          setBundleSaved(true);
          
          // Show success message
          alert(`Bundle "${bundle.name}" has been saved to your collection!\n\nYou can view and manage your saved bundles from the Dashboard.`);
        } else {
          alert(`Bundle "${bundle.name}" is already in your saved collection!`);
        }
      } catch (error) {
        console.error('Error saving bundle:', error);
        alert('Failed to save bundle. Please try again.');
      }
    }
  };

  const handleCustomizeBundle = () => {
    setShowCustomizer(true);
  };

  const handleContactForImplementation = () => {
    if (!bundle) return;
    
    // Navigate to contact page with bundle reference
    const params = new URLSearchParams({
      bundle: bundle.id,
      bundleName: bundle.name,
      inquiryType: 'implementation'
    });
    navigate(`/contact?${params.toString()}`);
  };

  const handleSaveCustomizedBundle = (customBundle: { name: string; tools: any[]; totalCost: number }) => {
    // For now, just show success message and close customizer
    alert(`Custom bundle "${customBundle.name}" created successfully!`);
    setShowCustomizer(false);
  };

  if (!bundle) {
    return null;
  }

  if (showCustomizer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setShowCustomizer(false)}
            className="mb-4"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back to Bundle Details
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Customize {bundle.name}</h1>
          <p className="mt-2 text-lg text-gray-600">Modify this bundle to fit your specific needs</p>
        </div>
        <BundleCreator
          initialBundle={bundle}
          onSave={handleSaveCustomizedBundle}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(isFromRecommendation ? '/recommendation' : '/bundle')}
          className="mb-4"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          {isFromRecommendation ? 'Back to Recommendations' : 'Back to Bundles'}
        </Button>
        
        {isFromRecommendation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">Recommended Bundle Selected</span>
            </div>
            <p className="text-blue-700 mt-1 text-sm">
              This bundle was recommended based on your AI assessment. Review the details below and save it to your collection when ready.
            </p>
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{bundle.name}</h1>
        <p className="mt-2 text-lg text-gray-600">{bundle.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Implementation Steps</h2>
              <ol className="space-y-4">
                {bundle.implementationSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Included Tools</h2>
              <div className="space-y-6">
                {bundle.tools.map((tool) => (
                  <div key={tool.id} className="flex items-start border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img src={tool.logo} alt={tool.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{tool.shortDescription}</p>
                      {tool.features && (
                        <ul className="mt-2 list-disc list-inside text-sm text-gray-600 space-y-1">
                          {tool.features.slice(0, 2).map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Bundle Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Estimated subscription cost (Subject to usage)</label>
                  <p className="text-2xl font-bold text-gray-900">{bundle.totalCost}</p>
                </div>
                <div className="space-y-3">
                  {isFromRecommendation && !bundleSaved && (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleSaveBundle}
                      leftIcon={<Bookmark className="h-4 w-4" />}
                    >
                      Save This Bundle
                    </Button>
                  )}
                  
                  {bundleSaved && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-green-800 text-sm font-medium">Bundle saved successfully!</span>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    className="w-full"
                    size="lg"
                    variant="secondary"
                    onClick={handleCustomizeBundle}
                    leftIcon={<Settings className="h-4 w-4" />}
                  >
                    Customize Bundle
                  </Button>
                  <Button
                    className="w-full"
                    size="lg"
                    variant="outline"
                    onClick={handleContactForImplementation}
                    leftIcon={<MessageCircle className="h-4 w-4" />}
                  >
                    Contact Us for Implementation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BundleDetailPage;
