import React, { useState, useEffect } from 'react';
import { Tool } from '../../types';
import { tools } from '../../data/tools';
import { workflowBundles } from '../../data/workflows';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Plus, X, Calculator, Save, Wand2 } from 'lucide-react';

interface BundleCreatorProps {
  onSave?: (bundle: { name: string; tools: Tool[]; totalCost: number }) => void;
  initialBundle?: typeof workflowBundles[0] | null;
}

export const BundleCreator: React.FC<BundleCreatorProps> = ({ onSave, initialBundle }) => {
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [bundleName, setBundleName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [useCase, setUseCase] = useState('');
  const [recommendedBundle, setRecommendedBundle] = useState<typeof workflowBundles[0] | null>(initialBundle || null);

  useEffect(() => {
    if (initialBundle) {
      setBundleName(initialBundle.name);
      setSelectedTools(initialBundle.tools);
    }
  }, [initialBundle]);

  const calculateTotalCost = (tools: Tool[]): number => {
    return tools.reduce((total, tool) => {
      const price = tool.pricing.startingPrice
        ? parseFloat(tool.pricing.startingPrice.replace(/[^0-9.]/g, ''))
        : 0;
      return total + price;
    }, 0);
  };

  const filteredTools = tools.filter(tool => 
    !selectedTools.includes(tool) &&
    (tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.categoryId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddTool = (tool: Tool) => {
    setSelectedTools([...selectedTools, tool]);
  };

  const handleRemoveTool = (tool: Tool) => {
    setSelectedTools(selectedTools.filter(t => t.id !== tool.id));
  };

  const handleSaveBundle = () => {
    if (onSave && bundleName && selectedTools.length > 0) {
      onSave({
        name: bundleName,
        tools: selectedTools,
        totalCost: calculateTotalCost(selectedTools)
      });
    }
  };

  const findRecommendedBundle = (useCaseText: string) => {
    const useCaseMap = {
      'healthcare': ['medical', 'health', 'patient', 'clinical', 'doctor'],
      'education': ['teach', 'learn', 'course', 'student', 'education'],
      'automation': ['automate', 'workflow', 'process', 'integrate'],
      'data': ['analysis', 'data', 'insight', 'visualization', 'report'],
      'agent': ['agent', 'autonomous', 'agentic', 'automate', 'bot'],
      'research': ['research', 'study', 'analyze', 'literature'],
      'content': ['content', 'create', 'write', 'blog', 'article'],
      'visual': ['presentation', 'diagram', 'visual', 'design', 'image']
    };

    const text = useCaseText.toLowerCase();
    
    // Find matching categories based on keywords
    const matchingCategories = Object.entries(useCaseMap).filter(([category, keywords]) =>
      keywords.some(keyword => text.includes(keyword))
    ).map(([category]) => category);

    if (matchingCategories.length === 0) {
      // If no direct category match, try finding bundle by text similarity
      return workflowBundles.find(bundle => {
        const bundleText = (bundle.description + ' ' + bundle.name).toLowerCase();
        return bundleText.includes(text) || text.includes(bundleText);
      }) || null;
    }

    // Map categories to specific bundles
    const categoryToBundleMap: { [key: string]: string } = {
      'healthcare': 'Healthcare AI Assistant',
      'education': 'AI Education Platform',
      'automation': 'Workflow Automation Suite',
      'data': 'Data Analysis & Presentation',
      'agent': 'Autonomous Agent Workflow',
      'research': 'AI Research Assistant',
      'content': 'Content Creator Suite',
      'visual': 'Visual Content Production'
    };

    // Find matching bundle
    const recommendedBundleName = categoryToBundleMap[matchingCategories[0]];
    return workflowBundles.find(bundle => bundle.name === recommendedBundleName) || null;
  };

  const handleUseCaseChange = (text: string) => {
    setUseCase(text);
    if (text.length > 5) {
      const recommended = findRecommendedBundle(text);
      if (recommended) {
        setRecommendedBundle(recommended);
        
        // Also find alternative recommendations
        const alternatives = workflowBundles
          .filter(bundle => bundle.id !== recommended.id)
          .filter(bundle => {
            const bundleText = (bundle.description + ' ' + bundle.name).toLowerCase();
            return text.toLowerCase().split(' ').some(word =>
              word.length > 3 && bundleText.includes(word)
            );
          })
          .slice(0, 2);
        
        setAlternativeRecommendations(alternatives);
      } else {
        setRecommendedBundle(null);
        setAlternativeRecommendations([]);
      }
    } else {
      setRecommendedBundle(null);
      setAlternativeRecommendations([]);
    }
  };

  const [alternativeRecommendations, setAlternativeRecommendations] = useState<typeof workflowBundles>([]);

  const applyRecommendedBundle = () => {
    if (recommendedBundle) {
      setBundleName(recommendedBundle.name);
      setSelectedTools(recommendedBundle.tools);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Custom Bundle</h2>
        
        <div className="mb-6">
          <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-2">
            Describe Your Use Case
          </label>
          <textarea
            id="useCase"
            value={useCase}
            onChange={(e) => handleUseCaseChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us what you're trying to accomplish..."
            rows={3}
          />
        </div>

        {recommendedBundle && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-medium text-blue-900">Best Match: {recommendedBundle.name}</h3>
                  <p className="text-sm text-blue-700">{recommendedBundle.description}</p>
                </div>
                <Button
                  onClick={applyRecommendedBundle}
                  className="bg-blue-500 hover:bg-blue-600"
                  leftIcon={<Wand2 className="h-4 w-4" />}
                >
                  Use This Bundle
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-blue-900">Implementation Steps:</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  {recommendedBundle.implementationSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            {alternativeRecommendations.length > 0 && (
              <div className="border rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Alternative Suggestions:</h4>
                <div className="space-y-4">
                  {alternativeRecommendations.map((bundle) => (
                    <div key={bundle.id} className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium text-gray-900">{bundle.name}</h5>
                        <p className="text-sm text-gray-500">{bundle.description}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRecommendedBundle(bundle);
                          applyRecommendedBundle();
                        }}
                      >
                        Use Instead
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="bundleName" className="block text-sm font-medium text-gray-700 mb-2">
            Bundle Name
          </label>
          <input
            type="text"
            id="bundleName"
            value={bundleName}
            onChange={(e) => setBundleName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a name for your bundle"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="toolSearch" className="block text-sm font-medium text-gray-700 mb-2">
            Search Tools
          </label>
          <input
            type="text"
            id="toolSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by name or category"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredTools.map(tool => (
            <Card key={tool.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{tool.name}</CardTitle>
                <Button
                  size="sm"
                  onClick={() => handleAddTool(tool)}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{tool.shortDescription}</p>
                <div className="mt-2">
                  <Badge variant="outline">{tool.pricing.startingPrice || 'Free'}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTools.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Bundle Details</h3>
            
            {/* Tools Overview */}
            <div className="space-y-6 mb-8">
              {selectedTools.map(tool => (
                <div
                  key={tool.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 text-xl mb-2">{tool.name}</h4>
                      <Badge className="mb-2" variant="outline">
                        {tool.pricing.startingPrice || 'Free'}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTool(tool)}
                      leftIcon={<X className="h-4 w-4" />}
                      className="text-gray-500 hover:text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{tool.description || tool.shortDescription}</p>
                  
                  <div className="space-y-4">
                    {tool.features && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h5>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {tool.features.slice(0, 3).map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {tool.integrations && (
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Integrations:</h5>
                        <div className="flex flex-wrap gap-2">
                          {tool.integrations.map((integration, index) => (
                            <Badge key={index} variant="secondary">{integration}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Integration Tips */}
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-green-900 mb-3">Integration Tips</h4>
              <ul className="list-disc list-inside text-sm text-green-700 space-y-2">
                <li>Connect your tools using their respective APIs when available</li>
                <li>Set up automation workflows between tools using Zapier or similar platforms</li>
                <li>Consider using single sign-on (SSO) when supported</li>
                <li>Regular sync and backup of data between tools is recommended</li>
              </ul>
            </div>

            {/* Cost Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h4>
                  <div className="space-y-2">
                    {selectedTools.map(tool => (
                      <div key={tool.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{tool.name}</span>
                        <span className="font-medium">{tool.pricing.startingPrice || 'Free'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5 text-gray-500" />
                      <span className="text-lg font-semibold text-gray-900">
                        Total Monthly Cost: ${calculateTotalCost(selectedTools)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveBundle}
                      disabled={!bundleName || selectedTools.length === 0}
                      leftIcon={<Save className="h-4 w-4" />}
                      className="w-full sm:w-auto"
                    >
                      Save Bundle
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};