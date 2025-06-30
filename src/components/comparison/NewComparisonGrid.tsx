import React, { useState } from 'react';
import { Tool } from '../../types/Tool.d';
import { Button, Badge, Card } from '../ui';
import { 
  Star, X, Check, Minus, ExternalLink, 
  ChevronDown, ChevronUp, Clock, Users, 
  Zap, Globe, Shield, DollarSign
} from 'lucide-react';

interface NewComparisonGridProps {
  tools: Tool[];
  onRemoveTool?: (toolId: string) => void;
}

export const NewComparisonGrid: React.FC<NewComparisonGridProps> = ({
  tools,
  onRemoveTool
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['overview', 'pricing'])
  );
  const [showAllFeatures, setShowAllFeatures] = useState(false);

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

  // Get all unique features
  const getAllFeatures = () => {
    const allFeatures = new Set<string>();
    tools.forEach(tool => {
      tool.features?.forEach(feature => allFeatures.add(feature));
      if (tool.featureDetails) {
        Object.keys(tool.featureDetails).forEach(feature => allFeatures.add(feature));
      }
    });
    return Array.from(allFeatures);
  };

  const allFeatures = getAllFeatures();

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Zap,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'pricing',
      title: 'Pricing Plans',
      icon: DollarSign,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      id: 'features',
      title: 'Features Comparison',
      icon: Globe,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 'support',
      title: 'Support Options',
      icon: Users,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tools Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {tools.map(tool => (
          <Card key={tool.id} className="relative group">
            <div className="p-4">
              {/* Remove Button */}
              {onRemoveTool && (
                <button
                  onClick={() => onRemoveTool(tool.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 hover:scale-110"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              )}

              {/* Tool Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{tool.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {tool.shortDescription || tool.description}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-sm">{tool.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-sm text-gray-600">{tool.reviewCount} reviews</span>
                </div>

                {/* Key Features */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {tool.features?.slice(0, 2).map(feature => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {tool.features && tool.features.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{tool.features.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick Action */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(tool.website, '_blank')}
                  leftIcon={<ExternalLink className="h-4 w-4" />}
                  className="w-full mt-3"
                >
                  Visit Website
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison Sections */}
      <div className="space-y-4">
        {sections.map(section => {
          const Icon = section.icon;
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <Card key={section.id} className="overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full px-6 py-4 ${section.bgColor} flex items-center justify-between hover:bg-opacity-80 transition-colors border-b ${section.borderColor}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-700" />
                  <span className="font-semibold text-gray-900">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-600" />
                )}
              </button>
              
              {/* Section Content */}
              {isExpanded && (
                <div className="p-6">
                  {section.id === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {tools.map(tool => (
                        <div key={tool.id} className="space-y-3">
                          <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {tool.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {tool.features?.slice(0, 4).map(feature => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.id === 'pricing' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {tools.map(tool => (
                        <div key={tool.id} className="space-y-3">
                          <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                          <div className="space-y-2">
                            {tool.pricing?.tiers?.map(tier => (
                              <div key={tier.name} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <div className="font-medium text-sm">{tier.name}</div>
                                    <div className="text-lg font-bold text-gray-900">
                                      {tier.price || 'Free'}
                                      {tier.billingPeriod && (
                                        <span className="text-sm text-gray-600">
                                          /{tier.billingPeriod}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {tier.isPopular && (
                                    <Badge variant="secondary" className="text-xs">
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                {tier.features && tier.features.length > 0 && (
                                  <div className="text-xs text-gray-600">
                                    {tier.features.slice(0, 2).join(', ')}
                                    {tier.features.length > 2 && '...'}
                                  </div>
                                )}
                              </div>
                            )) || (
                              <div className="text-gray-400 text-sm italic">
                                No pricing information available
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.id === 'features' && (
                    <div className="space-y-4">
                      {/* Feature Summary */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Feature Overview</h4>
                            <p className="text-sm text-gray-600">
                              Comparing {allFeatures.length} features across {tools.length} tools
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {Math.round((allFeatures.reduce((acc, feature) =>
                                acc + tools.filter(tool => tool.features?.includes(feature)).length, 0
                              ) / (allFeatures.length * tools.length)) * 100)}%
                            </div>
                            <div className="text-xs text-gray-600">Average Coverage</div>
                          </div>
                        </div>
                      </div>

                      {(showAllFeatures ? allFeatures : allFeatures.slice(0, 10)).map(feature => (
                        <div key={feature} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{feature}</span>
                              <div className="text-xs text-gray-500 md:hidden">
                                {tools.filter(tool => tool.features?.includes(feature)).length}/{tools.length} tools
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                              {tools.map(tool => (
                                <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="text-sm font-medium text-gray-700">
                                    {tool.name}
                                  </span>
                                  {tool.features?.includes(feature) ? (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <Check className="h-4 w-4" />
                                      <span className="text-xs font-medium">Yes</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-gray-400">
                                      <Minus className="h-4 w-4" />
                                      <span className="text-xs font-medium">No</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      {allFeatures.length > 10 && (
                        <div className="text-center py-4 border-t border-gray-200">
                          <Button
                            variant="outline"
                            onClick={() => setShowAllFeatures(!showAllFeatures)}
                            className="text-sm"
                          >
                            {showAllFeatures
                              ? `Show Less (showing all ${allFeatures.length} features)`
                              : `Show All Features (${allFeatures.length - 10} more)`
                            }
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {section.id === 'support' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {tools.map(tool => (
                        <div key={tool.id} className="space-y-3">
                          <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                          <div className="space-y-2">
                            {tool.supportOptions ? (
                              Object.entries(tool.supportOptions)
                                .filter(([_, available]) => available)
                                .map(([option]) => (
                                  <div key={option} className="flex items-center gap-2">
                                    <Check className="h-4 w-4 text-green-600" />
                                    <span className="text-sm text-gray-700 capitalize">
                                      {option}
                                    </span>
                                  </div>
                                ))
                            ) : (
                              <div className="text-gray-400 text-sm italic">
                                No support information available
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};