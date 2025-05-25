import React, { useState } from 'react';
import { BundleCreator } from '../components/bundles/BundleCreator';
import { workflowBundles } from '../data/workflows';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GitBranch, ArrowRight } from 'lucide-react';

const BundlePage: React.FC = () => {
  const [showCreator, setShowCreator] = useState(false);

  const handleSaveBundle = (bundle: any) => {
    // Handle saving the bundle (would typically involve API call)
    console.log('Saving bundle:', bundle);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">AI Tool Bundles</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Discover pre-configured tool combinations or create your own custom bundle tailored to your needs.
        </p>
        <div className="mt-6">
          <Button
            size="lg"
            onClick={() => setShowCreator(!showCreator)}
          >
            {showCreator ? 'View Existing Bundles' : 'Create Custom Bundle'}
          </Button>
        </div>
      </div>

      {showCreator ? (
        <BundleCreator onSave={handleSaveBundle} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {workflowBundles.map((bundle) => (
            <Card key={bundle.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center space-x-2">
                  <GitBranch className="h-5 w-5" />
                  <CardTitle>{bundle.name}</CardTitle>
                </div>
                <p className="mt-2 text-blue-100">{bundle.description}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
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

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Total Cost</p>
                      <p className="text-lg font-bold text-gray-900">{bundle.totalCost}</p>
                    </div>
                    <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                      View Details
                    </Button>
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

export default BundlePage