import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workflowBundles } from '../data/workflows';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { GitBranch, ArrowLeft, CheckCircle2, Layers } from 'lucide-react';

const BundleDetailPage: React.FC = () => {
  const { bundleId } = useParams();
  const navigate = useNavigate();
  const [bundle, setBundle] = useState(workflowBundles.find(b => b.id === bundleId));

  useEffect(() => {
    if (!bundle) {
      navigate('/bundle', { replace: true });
    }
  }, [bundle, navigate]);

  if (!bundle) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/bundle')}
          className="mb-4"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Bundles
        </Button>
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
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                  <Button className="w-full" size="lg" variant="secondary">
                    Customize Bundle
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
