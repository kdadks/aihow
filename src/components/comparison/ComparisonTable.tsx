import React, { useState, useMemo } from 'react';
import { Tool } from '../../types/Tool.d';
import { 
  Star, X, Check, ChevronDown, ChevronUp, 
  Eye, EyeOff, ExternalLink, DollarSign 
} from 'lucide-react';
import { Button, Badge, Tooltip } from '../ui';

type SupportOptionKey = 'documentation' | 'email' | 'phone' | 'chat' | 'community';

interface ComparisonTableProps {
  tools: Tool[];
  onRemoveTool?: (toolId: string) => void;
  searchTerm?: string;
  selectedFeatures?: string[];
  hiddenFeatures?: Set<string>;
  onToggleFeatureVisibility?: (feature: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  tools,
  onRemoveTool,
  searchTerm = '',
  selectedFeatures = [],
  hiddenFeatures = new Set(),
  onToggleFeatureVisibility
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'pricing']));
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get all unique features
  const allFeatures = useMemo(() => {
    if (tools.length === 0) return [];
    return Array.from(new Set(tools.flatMap(tool => {
      const detailFeatures = tool.featureDetails ? Object.keys(tool.featureDetails) : [];
      return [...detailFeatures, ...(tool.features || [])];
    })));
  }, [tools]);

  // Filter features based on search and selection
  const filteredFeatures = useMemo(() => {
    const features = selectedFeatures.length > 0 ? selectedFeatures : allFeatures;
    return features.filter(feature => 
      feature.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !hiddenFeatures.has(feature)
    );
  }, [allFeatures, selectedFeatures, searchTerm, hiddenFeatures]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  if (isMobileView) {
    return <MobileComparisonView tools={tools} onRemoveTool={onRemoveTool} filteredFeatures={filteredFeatures} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Enhanced Header */}
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                <div className="flex items-center justify-between">
                  <span>Feature Comparison</span>
                  <div className="text-xs text-gray-400">
                    {filteredFeatures.length} features
                  </div>
                </div>
              </th>
              {tools.map(tool => (
                <th key={tool.id} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-64">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={tool.logo} 
                          alt={tool.name}
                          className="h-10 w-10 rounded-lg shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/40/40';
                          }}
                        />
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{tool.name}</div>
                          <div className="text-xs text-gray-500 normal-case">{tool.shortDescription}</div>
                        </div>
                      </div>
                      {onRemoveTool && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveTool(tool.id)}
                          className="hover:bg-red-50 hover:text-red-600 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-semibold text-gray-900">{tool.rating}</span>
                        <span className="text-xs text-gray-500">({tool.reviewCount})</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(tool.website, '_blank')}
                        leftIcon={<ExternalLink className="h-3 w-3" />}
                        className="text-xs"
                      >
                        Visit
                      </Button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {/* Overview Section */}
            <tr className="bg-blue-50 border-l-4 border-blue-500">
              <td className="px-6 py-4 font-semibold text-gray-900">
                <button
                  onClick={() => toggleSection('overview')}
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  {expandedSections.has('overview') ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                  Overview
                </button>
              </td>
              {tools.map(tool => (
                <td key={tool.id} className="px-6 py-4">
                  {expandedSections.has('overview') && (
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">{tool.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {tool.features?.slice(0, 3).map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {tool.features && tool.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tool.features.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Pricing Section */}
            <tr className="bg-green-50 border-l-4 border-green-500">
              <td className="px-6 py-4 font-semibold text-gray-900">
                <button
                  onClick={() => toggleSection('pricing')}
                  className="flex items-center gap-2 hover:text-green-600 transition-colors"
                >
                  {expandedSections.has('pricing') ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                  <DollarSign className="h-4 w-4" />
                  Pricing Plans
                </button>
              </td>
              {tools.map(tool => (
                <td key={tool.id} className="px-6 py-4">
                  {expandedSections.has('pricing') && (
                    <div className="space-y-2">
                      {tool.pricing && tool.pricing.tiers ? tool.pricing.tiers.map(tier => (
                        <Tooltip key={tier.name} content={(tier.features || []).join(', ')}>
                          <div className="flex items-center justify-between bg-white rounded p-2 border">
                            <div>
                              <div className="font-medium text-sm">{tier.name}</div>
                              <div className="text-xs text-gray-500">
                                {tier.price || 'Free'}/{tier.billingPeriod || 'month'}
                              </div>
                            </div>
                            {tier.isPopular && (
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            )}
                          </div>
                        </Tooltip>
                      )) : (
                        <span className="text-gray-400 text-sm">No pricing information</span>
                      )}
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Support Section */}
            <tr className="bg-purple-50 border-l-4 border-purple-500">
              <td className="px-6 py-4 font-semibold text-gray-900">
                <button
                  onClick={() => toggleSection('support')}
                  className="flex items-center gap-2 hover:text-purple-600 transition-colors"
                >
                  {expandedSections.has('support') ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                  }
                  Support Options
                </button>
              </td>
              {tools.map(tool => (
                <td key={tool.id} className="px-6 py-4">
                  {expandedSections.has('support') && (
                    <div className="flex flex-wrap gap-1">
                      {tool.supportOptions ? (
                        Object.entries(tool.supportOptions)
                          .filter(([_, available]) => available)
                          .map(([option]) => (
                            <Badge key={option} variant="outline" className="capitalize text-xs">
                              {option}
                            </Badge>
                          ))
                      ) : (
                        <span className="text-gray-400 text-sm">No support options</span>
                      )}
                    </div>
                  )}
                </td>
              ))}
            </tr>

            {/* Feature Rows */}
            {filteredFeatures.map((feature, index) => (
              <tr key={feature} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                <td className="px-6 py-3 font-medium text-gray-900">
                  <div className="flex items-center justify-between">
                    <Tooltip content={
                      tools.find(t => t.featureDetails?.[feature]?.description)
                        ?.featureDetails?.[feature]?.description ||
                      "No additional details available"
                    }>
                      <span className="hover:text-blue-600 cursor-help transition-colors">
                        {feature}
                      </span>
                    </Tooltip>
                    {onToggleFeatureVisibility && (
                      <button
                        onClick={() => onToggleFeatureVisibility(feature)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {hiddenFeatures.has(feature) ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </button>
                    )}
                  </div>
                </td>
                {tools.map(tool => (
                  <td key={tool.id} className="px-6 py-3">
                    {tool.features && tool.features.includes(feature) ? (
                      tool.featureDetails?.[feature] ? (
                        <Tooltip content={
                          `Available in ${tool.featureDetails[feature].availability || 'all'} plan`
                        }>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-green-700 font-medium text-sm">Yes</span>
                          </div>
                        </Tooltip>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-green-700 font-medium text-sm">Yes</span>
                        </div>
                      )
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                          <X className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="text-red-700 font-medium text-sm">No</span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Mobile-optimized comparison view
const MobileComparisonView: React.FC<{
  tools: Tool[];
  onRemoveTool?: (toolId: string) => void;
  filteredFeatures: string[];
}> = ({ tools, onRemoveTool, filteredFeatures }) => {
  const [selectedTool, setSelectedTool] = useState(0);

  return (
    <div className="space-y-4">
      {/* Tool Selector for Mobile */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Select Tool to View</h3>
        <div className="grid grid-cols-1 gap-2">
          {tools.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(index)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                selectedTool === index 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img 
                src={tool.logo} 
                alt={tool.name}
                className="h-8 w-8 rounded"
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/32/32';
                }}
              />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{tool.name}</div>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                  {tool.rating} ({tool.reviewCount})
                </div>
              </div>
              {onRemoveTool && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTool(tool.id);
                  }}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Tool Details */}
      {tools[selectedTool] && (
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={tools[selectedTool].logo} 
              alt={tools[selectedTool].name}
              className="h-12 w-12 rounded-lg"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{tools[selectedTool].name}</h2>
              <div className="flex items-center text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                {tools[selectedTool].rating} ({tools[selectedTool].reviewCount} reviews)
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{tools[selectedTool].description}</p>

          {/* Features List for Mobile */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Features</h3>
            <div className="space-y-2">
              {filteredFeatures.map(feature => (
                <div key={feature} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{feature}</span>
                  {tools[selectedTool].features?.includes(feature) ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">Yes</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="h-4 w-4" />
                      <span className="text-sm font-medium">No</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => window.open(tools[selectedTool].website, '_blank')}
            className="w-full mt-6"
            leftIcon={<ExternalLink className="h-4 w-4" />}
          >
            Visit {tools[selectedTool].name}
          </Button>
        </div>
      )}
    </div>
  );
};