import React, { useState, useEffect, useMemo } from 'react';
import { Tool } from '../../types/Tool.d';
import { SupportOptionKey } from '../../types/common.d';
import { ErrorBoundary } from './ErrorBoundary';

type SortableField = keyof Pick<Tool, 'name' | 'rating' | 'reviewCount'> | '';

interface Filters {
  features: string[];
  pricing: string[];
  certifications: string[];
  supportOptions: SupportOptionKey[];
}

interface ComparisonStoreState {
  sortField: SortableField;
  sortDirection: 'asc' | 'desc';
  filters: Filters;
  setSortField: (field: SortableField) => void;
  setSortDirection: (direction: 'asc' | 'desc') => void;
  setFilter: <K extends keyof Filters>(key: K, values: Filters[K]) => void;
  clearFilters: () => void;
  saveComparison: (name: string, isPublic?: boolean) => void;
  trackComparison: () => void;
}

import {
  Star, Download, X, Save, Filter,
  SortAsc, SortDesc, FileText, Share, Search,
  ChevronDown, ChevronUp, Eye, EyeOff, Grid,
  List, MoreHorizontal, Check, Zap, DollarSign
} from 'lucide-react';
import { useComparisonStore } from '../../stores/comparisonStore';
import { Button, Badge, Tooltip, Dialog } from '../ui';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface ComparisonGridProps {
  tools: Tool[];
  onRemoveTool?: (toolId: string) => void;
}

export const ComparisonGrid: React.FC<ComparisonGridProps> = ({ tools, onRemoveTool }) => {
  // Local state
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [comparisonName, setComparisonName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [hiddenFeatures, setHiddenFeatures] = useState<Set<string>>(new Set());

  // Global comparison store
  const {
    sortField,
    sortDirection,
    filters,
    setSortField,
    setSortDirection,
    setFilter,
    clearFilters,
    saveComparison,
    trackComparison
  } = useComparisonStore() as ComparisonStoreState;

  // Track comparison view
  useEffect(() => {
    if (tools.length> 1) {
      trackComparison();
    }
  }, [tools, trackComparison]);

  // Get all unique features and categories
  const {
    allFeatures,
    allCertifications,
    allSupportOptions,
    allPricingTiers
  } = useMemo(() => ({
    allFeatures: tools.length === 0 ? [] : Array.from(new Set(tools.flatMap(tool => {
      const detailFeatures = tool.featureDetails ? Object.keys(tool.featureDetails) : [];
      return [...detailFeatures, ...(tool.features || [])];
    }))),
    allCertifications: Array.from(new Set(tools.flatMap(tool => tool.certifications || []))),
    allSupportOptions: Array.from(new Set(tools.flatMap(tool =>
      tool.supportOptions ?
        (Object.entries(tool.supportOptions) as [SupportOptionKey, boolean][])
          .filter(([_, value]) => value)
          .map(([key]) => key)
        : []
    ))) as SupportOptionKey[],
    allPricingTiers: Array.from(new Set(tools.flatMap(tool =>
      tool.pricing && tool.pricing.tiers ? 
      tool.pricing.tiers.map(tier => tier.name) : 
      []
    )))
  }), [tools]);

  // Filter features based on search term
  const filteredFeatures = useMemo(() => {
    const features = selectedFeatures.length> 0 ? selectedFeatures : allFeatures;
    return features.filter((feature: string) =>
      feature.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !hiddenFeatures.has(feature)
    );
  }, [allFeatures, selectedFeatures, searchTerm, hiddenFeatures]);

  // Filter and sort tools
  const processedTools = useMemo(() => {
    let result = [...tools];

    // Apply filters
    if (filters.features.length> 0) {
      result = result.filter(tool =>
        tool.features && filters.features.every((feature: string) => tool.features.includes(feature))
      );
    }
    if (filters.certifications.length> 0) {
      result = result.filter(tool =>
        filters.certifications.every((cert: string) => tool.certifications?.includes(cert))
      );
    }
    if (filters.supportOptions.length> 0) {
      result = result.filter(tool =>
        filters.supportOptions.every((option: SupportOptionKey) => tool.supportOptions?.[option] === true)
      );
    }
    if (filters.pricing.length> 0) {
      result = result.filter(tool =>
        tool.pricing && tool.pricing.tiers &&
        filters.pricing.some((price: string) =>
          tool.pricing.tiers?.some(tier => tier.name === price)
        )
      );
    }

    // Apply sorting
    if (sortField !== '') {
      result.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * modifier;
        }
        return String(aValue).localeCompare(String(bValue)) * modifier;
      });
    }

    return result;
  }, [tools, filters, sortField, sortDirection]);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleFeatureVisibility = (feature: string) => {
    setHiddenFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(feature)) {
        newSet.delete(feature);
      } else {
        newSet.add(feature);
      }
      return newSet;
    });
  };

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const exportToPDF = () => {
    // @ts-ignore - Fix jsPDF typings
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Tool Comparison Report', 14, 15);
    doc.setFontSize(10);
    
    const tableData = filteredFeatures.map(feature => [
      feature,
      ...tools.map(tool => tool.features?.includes(feature) ? '✓' : '✗')
    ]);
    
    doc.autoTable({
      head: [['Feature', ...tools.map(tool => tool.name)]],
      body: tableData,
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    doc.save('tool-comparison.pdf');
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Feature', ...tools.map(tool => tool.name)],
      ...filteredFeatures.map(feature => [
        feature,
        ...tools.map(tool => tool.features?.includes(feature) ? '✓' : '✗')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tool-comparison.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSaveComparison = () => {
    if (!comparisonName) {
      toast.error('Please enter a name for your comparison');
      return;
    }
    
    saveComparison(comparisonName, isPublic);
    setSaveDialogOpen(false);
    setComparisonName('');
    setIsPublic(false);
    toast.success('Comparison saved successfully');
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchTerm('');
    setSelectedFeatures([]);
    setHiddenFeatures(new Set());
    toast.success('Filters cleared');
  };

  const renderFilterChip = (label: string, count: number, onRemove: () => void) => (
    <Badge key={label} variant="secondary" className="flex items-center gap-1">
      {label} ({count})
      <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={onRemove} />
    </Badge>
  );

  const activeFilterCount = Object.values(filters).reduce((acc, filterArray) => acc + filterArray.length, 0);

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tool Comparison</h2>
          <p className="text-gray-600 mt-1">
            Comparing {tools.length} tool{tools.length !== 1 ? 's' : ''} across {filteredFeatures.length} feature{filteredFeatures.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
            leftIcon={viewMode === 'table' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}>
            {viewMode === 'table' ? 'Card View' : 'Table View'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSaveDialogOpen(true)}
            leftIcon={<Save className="h-4 w-4" />}>
            Save
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'AI Tools Comparison',
                  text: 'Check out this comparison of AI tools!',
                  url: window.location.href,
                })
                .then(() => toast.success('Shared successfully!'))
                .catch(error => toast.error('Error sharing: ' + error));
              } else {
                navigator.clipboard.writeText(window.location.href)
                  .then(() => toast.success('Link copied to clipboard!'))
                  .catch(() => toast.error('Failed to copy link'));
              }
            }}
            leftIcon={<Share className="h-4 w-4" />}>
            Share
          </Button>
          
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}>
              Export
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border hidden group-hover:block z-20">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                onClick={exportToCSV}>
                <FileText className="h-4 w-4 mr-2" />
                Export as CSV
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                onClick={exportToPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search features..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortableField)}>
              <option value="">Sort by...</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="reviewCount">Review Count</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              disabled={!sortField}>
              {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>

          {/* Filter Toggle */}
          <Button
            variant={showAdvancedFilters ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            leftIcon={<Filter className="h-4 w-4" />}>
            Filters {activeFilterCount> 0 && `(${activeFilterCount})`}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
              <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                {allFeatures.map(feature => (
                  <label key={feature} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.features.includes(feature)}
                      onChange={(e) => {
                        const newFeatures = e.target.checked
                          ? [...filters.features, feature]
                          : filters.features.filter(f => f !== feature);
                        setFilter('features', newFeatures);
                      }}
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Plans</label>
              <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                {allPricingTiers.map(tier => (
                  <label key={tier} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.pricing.includes(tier)}
                      onChange={(e) => {
                        const newPricing = e.target.checked
                          ? [...filters.pricing, tier]
                          : filters.pricing.filter(p => p !== tier);
                        setFilter('pricing', newPricing);
                      }}
                    />
                    {tier}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Options</label>
              <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                {allSupportOptions.map(option => (
                  <label key={option} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.supportOptions.includes(option)}
                      onChange={(e) => {
                        const newSupport = e.target.checked
                          ? [...filters.supportOptions, option]
                          : filters.supportOptions.filter(s => s !== option);
                        setFilter('supportOptions', newSupport);
                      }}
                    />
                    <span className="capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
              <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
                {allCertifications.map(cert => (
                  <label key={cert} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={filters.certifications.includes(cert)}
                      onChange={(e) => {
                        const newCerts = e.target.checked
                          ? [...filters.certifications, cert]
                          : filters.certifications.filter(c => c !== cert);
                        setFilter('certifications', newCerts);
                      }}
                    />
                    {cert}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {activeFilterCount> 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {filters.features.map(feature => renderFilterChip(
              `Feature: ${feature}`,
              1,
              () => setFilter('features', filters.features.filter(f => f !== feature))
            ))}
            {filters.pricing.map(price => renderFilterChip(
              `Pricing: ${price}`,
              1,
              () => setFilter('pricing', filters.pricing.filter(p => p !== price))
            ))}
            {filters.supportOptions.map(option => renderFilterChip(
              `Support: ${option}`,
              1,
              () => setFilter('supportOptions', filters.supportOptions.filter(s => s !== option))
            ))}
            {filters.certifications.map(cert => renderFilterChip(
              `Cert: ${cert}`,
              1,
              () => setFilter('certifications', filters.certifications.filter(c => c !== cert))
            ))}
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Comparison Content */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                    <div className="flex items-center justify-between">
                      Feature
                      <div className="flex items-center gap-1">
                        <Tooltip content="Show/hide features">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </th>
                  {processedTools.map(tool => (
                    <th key={tool.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-64">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={""} 
                            alt={tool.name}
                            className="h-8 w-8 rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/32/32';
                            }}
                          />
                          <div>
                            <div className="font-semibold text-gray-900">{tool.name}</div>
                            <div className="text-xs text-gray-500">{tool.shortDescription}</div>
                          </div>
                        </div>
                        {onRemoveTool && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveTool(tool.id)}
                            className="hover:bg-red-50 hover:text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Overview Row */}
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Overview
                    </div>
                  </td>
                  {processedTools.map(tool => (
                    <td key={tool.id} className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{tool.rating}</span>
                          <span className="ml-1 text-gray-400">({tool.reviewCount})</span>
                        </div>
                        <div className="text-xs text-gray-600">{tool.description}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(tool.website, '_blank')}
                          className="text-xs">
                          Visit Website
                        </Button>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Pricing Row */}
                <tr className="bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      Pricing Plans
                    </div>
                  </td>
                  {processedTools.map(tool => (
                    <td key={tool.id} className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        {tool.pricing && tool.pricing.tiers ? tool.pricing.tiers.map(tier => (
                          <Tooltip key={tier.name} content={(tier.features || []).join(', ')}>
                            <Badge variant={tier.isPopular ? 'default' : 'outline'} className="mr-1 mb-1">
                              {tier.name} - {tier.price || 'Free'}/{tier.billingPeriod || 'month'}
                            </Badge>
                          </Tooltip>
                        )) : (
                          <span className="text-gray-400">No pricing information</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Support Options Row */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Support Options
                  </td>
                  {processedTools.map(tool => (
                    <td key={tool.id} className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {tool.supportOptions ? (
                          Object.entries(tool.supportOptions)
                            .filter(([_, available]) => available)
                            .map(([option]) => (
                              <Badge key={option} variant="outline" className="capitalize">
                                {option}
                              </Badge>
                            ))
                        ) : (
                          <span className="text-gray-400">No support options</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Certifications Row */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Certifications
                  </td>
                  {processedTools.map(tool => (
                    <td key={tool.id} className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {tool.certifications?.map(cert => (
                          <Badge key={cert} variant="outline">
                            {cert}
                          </Badge>
                        )) || <span className="text-gray-400">None</span>}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Feature Rows */}
                {filteredFeatures.map(feature => (
                  <tr key={feature} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center justify-between">
                        <Tooltip content={
                          tools.find(t => t.featureDetails?.[feature]?.description)
                            ?.featureDetails?.[feature]?.description ||
                          "No additional details available"
                        }>
                          <button
                            onClick={() => toggleFeature(feature)}
                            className="hover:text-blue-600 focus:outline-none focus:text-blue-600 text-left">
                            {feature}
                          </button>
                        </Tooltip>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFeatureVisibility(feature)}
                            className="text-gray-400 hover:text-gray-600">
                            {hiddenFeatures.has(feature) ? 
                              <EyeOff className="h-4 w-4" /> : 
                              <Eye className="h-4 w-4" />
                            }
                          </button>
                        </div>
                      </div>
                    </td>
                    {processedTools.map(tool => (
                      <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tool.features && tool.features.includes(feature) ? (
                          tool.featureDetails?.[feature] ? (
                            <Tooltip content={
                              `Available in ${tool.featureDetails[feature].availability || 'all'} plan`
                            }>
                              <div className="flex items-center">
                                <Check className="h-4 w-4 text-green-600 mr-1" />
                                <span className="text-green-600 font-medium">Yes</span>
                              </div>
                            </Tooltip>
                          ) : (
                            <div className="flex items-center">
                              <Check className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-green-600 font-medium">Yes</span>
                            </div>
                          )
                        ) : (
                          <div className="flex items-center">
                            <X className="h-4 w-4 text-red-600 mr-1" />
                            <span className="text-red-600 font-medium">No</span>
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
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedTools.map(tool => (
            <div key={tool.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={""} 
                    alt={tool.name}
                    className="h-10 w-10 rounded"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/40/40';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm">{tool.rating} ({tool.reviewCount})</span>
                    </div>
                  </div>
                </div>
                {onRemoveTool && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveTool(tool.id)}
                    className="hover:bg-red-50 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.features?.slice(0, 5).map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {tool.features && tool.features.length> 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{tool.features.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Pricing</h4>
                  <div className="space-y-1">
                    {tool.pricing?.tiers?.slice(0, 2).map(tier => (
                      <div key={tier.name} className="text-xs text-gray-600">
                        {tier.name}: {tier.price || 'Free'}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(tool.website, '_blank')}
                  className="w-full">
                  Visit Website
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={(open) => setSaveDialogOpen(open)}>
        <div className="p-6 w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">Save Comparison</h3>
          <input
            type="text"
            placeholder="Enter a name for this comparison"
            className="w-full px-3 py-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={comparisonName}
            onChange={(e) => setComparisonName(e.target.value)}
          />
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              className="mr-2"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="text-sm">Make this comparison public</span>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveComparison}>
              Save Comparison
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export const ComparisonGridWithErrorBoundary: React.FC<ComparisonGridProps> = (props) => {
  return (
    <ErrorBoundary>
      <ComparisonGrid {...props} />
    </ErrorBoundary>
  );
};