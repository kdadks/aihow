import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Save, Redo, GitBranch, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Recommendation } from '../../types';
import { useTools } from '../../services/api/v2/tools';
import { useBundles } from '../../services/api/v2/bundles';
import type { ToolV2 } from '../../types/tool.types';
import type { BundleV2 } from '../../types/bundle.types';

interface RecommendationResultsProps {
  recommendations: Recommendation[];
  onReset: () => void;
}

export const RecommendationResults: React.FC<RecommendationResultsProps> = ({ 
  recommendations, 
  onReset 
}) => {
  const { data: toolsData } = useTools();
  const { data: bundlesData } = useBundles();
  const tools = toolsData?.tools || [];
  const workflowBundles = bundlesData?.bundles || [];
  // Get the full tool data for each recommendation
  const recommendedTools = recommendations.map(rec => {
    const tool = tools.find(t => t.id === rec.toolId);
    return {
      ...rec,
      tool
    };
  }).filter(rec => rec.tool) as (Recommendation & { tool: ToolV2 })[];

  // Get relevant workflow bundles based on recommended tools
  const getRelevantBundles = () => {
    // Extract subcategory slugs from tools
    const toolSubcategories = recommendedTools.flatMap(rec => 
      rec.tool.subcategories?.map(sc => sc.slug) || []
    );
    const toolIds = recommendedTools.map(rec => rec.tool.id);
    
    let relevantBundles: BundleV2[] = [];
    
    // Check for General AI tools and recommend new AI bundles
    const hasReasoningTools = toolSubcategories.includes('reasoning-math') ||
                             toolIds.some(id => ['o1-preview', 'claude-3-5-sonnet', 'wolfram-alpha'].includes(id));
    const hasResearchTools = toolSubcategories.includes('research-analysis') ||
                            toolIds.some(id => ['elicit', 'consensus-ai', 'mem-ai'].includes(id));
    const hasOpenSourceTools = toolSubcategories.includes('open-source-models') ||
                              toolIds.some(id => ['llama-3-2', 'hugging-chat', 'mistral-ai'].includes(id));
    const hasCodingTools = toolSubcategories.includes('coding-assistants') ||
                          toolIds.some(id => ['openai-codex', 'github-copilot', 'cursor-ai'].includes(id));
    
    // Advanced AI Reasoning Suite (ID 53)
    if (hasReasoningTools) {
      const bundle = workflowBundles.find(b => b.id === '53');
      if (bundle) relevantBundles.push(bundle);
    }
    
    // Academic Research Intelligence Platform (ID 54)
    if (hasResearchTools) {
      const bundle = workflowBundles.find(b => b.id === '54');
      if (bundle) relevantBundles.push(bundle);
    }
    
    // Open Source AI Development Suite (ID 56)
    if (hasOpenSourceTools) {
      const bundle = workflowBundles.find(b => b.id === '56');
      if (bundle) relevantBundles.push(bundle);
    }
    
    // AI-Powered Code Generation Suite (ID 59)
    if (hasCodingTools) {
      const bundle = workflowBundles.find(b => b.id === '59');
      if (bundle) relevantBundles.push(bundle);
    }
    
    // Filter out undefined and limit to top 3 most relevant
    return relevantBundles.slice(0, 3);
  };

  const suggestedBundles = getRelevantBundles();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Recommended AI Tools</h2>
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<Redo className="h-4 w-4" />}
            onClick={onReset}
          >
            Start Over
          </Button>
        </div>
        
        <p className="text-gray-600 mb-8">
          Based on your needs, we've identified these tools as the best matches for you. 
          Each recommendation includes a match score showing how well it aligns with your requirements.
        </p>
        
        <div className="space-y-6">
          {recommendedTools.map(({ tool, score, matchReason }, index) => (
            <Card key={tool.id} className={index === 0 ? 'border-2 border-blue-500' : ''}>
              <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between pb-2">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                  </div>
                  <div>
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                    <div className="mt-1 flex items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-gray-700">{tool.rating}</span>
                      </div>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-gray-500 text-sm">{tool.review_count} reviews</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col items-center">
                  <div className="text-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                    <span className="text-lg font-bold">{Math.round(score)}%</span>
                    <span className="text-sm ml-1">match</span>
                  </div>
                  {index === 0 && (
                    <Badge variant="primary" className="mt-2">Best Match</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 mb-4">{tool.short_description}</p>
                
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Why it's a good match:</h4>
                  <p className="text-gray-700">{matchReason}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {tool.features.slice(0, 3).map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Limitations</h4>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {tool.limitations.slice(0, 2).map((limitation, i) => (
                        <li key={i}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <span className="font-medium text-gray-900">Pricing: </span>
                  <span className="text-gray-700">
                    {tool.pricing.starting_price || 'Free'}
                    {tool.pricing.has_free_option && " (Free option available)"}
                  </span>
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Save
                  </Button>
                  <Link to={`/tools/${tool.slug}`}>
                    <Button size="sm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Workflow Bundles Section */}
        {suggestedBundles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">Recommended Workflow Bundles</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Consider these curated workflow bundles that combine multiple tools for complete solutions:
            </p>
            
            <div className="grid gap-6">
              {suggestedBundles.map((bundle) => (
                <Card key={bundle.id} className="border-l-4 border-l-purple-500">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <GitBranch className="h-5 w-5 text-purple-600" />
                        <div>
                          <CardTitle className="text-lg">{bundle.name}</CardTitle>
                          <p className="text-purple-700 mt-1">{bundle.description}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Bundle
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Included Tools ({bundle.tools.length})</h4>
                        <div className="space-y-2">
                          {bundle.tools.slice(0, 3).map((tool) => (
                            <div key={tool.id} className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded overflow-hidden flex-shrink-0">
                              </div>
                              <span className="text-sm text-gray-700">{tool.name}</span>
                            </div>
                          ))}
                          {bundle.tools.length > 3 && (
                            <p className="text-sm text-gray-500 ml-11">
                              +{bundle.tools.length - 3} more tools
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Key Benefits</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {bundle.implementation_steps.slice(0, 3).map((step, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-500 mt-1">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6">
                    <div className="flex-1">
                      <span className="text-sm text-gray-500">Estimated subscription cost (Subject to usage)</span>
                      <p className="font-bold text-gray-900">{bundle.total_cost}</p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <Link to="/workflows">
                        <Button variant="outline" size="sm">
                          View All Bundles
                        </Button>
                      </Link>
                      <Link to={`/bundle/${bundle.id}?source=recommendation`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" rightIcon={<ArrowRight className="h-4 w-4" />}>
                          Use This Bundle
                        </Button>
                      </Link>
                      <Link to={`/bundle/${bundle.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Looking for something different?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              leftIcon={<Redo className="h-4 w-4" />}
              onClick={onReset}
            >
              Start Over
            </Button>
            <Link to="/directory">
              <Button>
                Browse All Tools
              </Button>
            </Link>
            <Link to="/workflows">
              <Button variant="secondary">
                View Workflow Bundles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};