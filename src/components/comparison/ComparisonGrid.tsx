import React, { useState, useEffect, useMemo } from 'react';
import { Tool, SupportOptionKey } from '../../types';
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
  setFilter: (key: keyof Filters, values: string[]) => void;
  clearFilters: () => void;
  saveComparison: (name: string, isPublic?: boolean) => void;
  trackComparison: () => void;
}
import {
  Star, Download, X, Save, Filter,
  SortAsc, SortDesc, FileText, Share
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
    if (tools.length > 1) {
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
      // Use both feature details and basic features
      const detailFeatures = tool.featureDetails ? Object.keys(tool.featureDetails) : [];
      return [...detailFeatures, ...(tool.features || [])];
    }))),
    allCertifications: Array.from(new Set(tools.flatMap(tool => tool.certifications || []))),
    allSupportOptions: Array.from(new Set(tools.flatMap(tool =>
      tool.supportOptions ?
        Object.entries(tool.supportOptions)
          .filter(([_, value]) => value)
          .map(([key]) => key)
        : []
    ))),
    allPricingTiers: Array.from(new Set(tools.flatMap(tool =>
      tool.pricing && tool.pricing.tiers ? 
      tool.pricing.tiers.map(tier => tier.name) : 
      []
    )))
  }), [tools]);

  // Filter and sort tools
  const processedTools = useMemo(() => {
    let result = [...tools];

    // Apply filters
    if (filters.features.length > 0) {
      result = result.filter(tool =>
        tool.features && filters.features.every((feature: string) => tool.features.includes(feature))
      );
    }
    if (filters.certifications.length > 0) {
      result = result.filter(tool =>
        filters.certifications.every((cert: string) => tool.certifications?.includes(cert))
      );
    }
    if (filters.supportOptions.length > 0) {
      result = result.filter(tool =>
        filters.supportOptions.every((option: SupportOptionKey) => tool.supportOptions[option])
      );
    }
    if (filters.pricing.length > 0) {
      result = result.filter(tool =>
        tool.pricing && tool.pricing.tiers &&
        filters.pricing.some((price: string) =>
          tool.pricing.tiers.some(tier => tier.name === price)
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

  const filteredFeatures = selectedFeatures.length > 0
    ? selectedFeatures
    : allFeatures;

  const exportToPDF = () => {
    // @ts-ignore - Fix jsPDF typings
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Tool Comparison Report', 14, 15);
    doc.setFontSize(10);
    
    // Add comparison table
    const tableData = filteredFeatures.map(feature => [
      feature,
      ...tools.map(tool => tool.features.includes(feature) ? '✓' : '✗')
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
        ...tools.map(tool => tool.features.includes(feature) ? '✓' : '✗')
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tool Comparison</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSaveDialogOpen(true)}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Share functionality using Web Share API if available
              if (navigator.share) {
                navigator.share({
                  title: 'AI Tools Comparison',
                  text: 'Check out this comparison of AI tools!',
                  url: window.location.href,
                })
                .then(() => toast.success('Shared successfully!'))
                .catch(error => toast.error('Error sharing: ' + error));
              } else {
                // Fallback: copy link to clipboard
                navigator.clipboard.writeText(window.location.href)
                  .then(() => toast.success('Link copied to clipboard!'))
                  .catch(() => toast.error('Failed to copy link'));
              }
            }}
            leftIcon={<Share className="h-4 w-4" />}
          >
            Share
          </Button>
          <div className="relative group">
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
                onClick={exportToCSV}
              >
                <FileText className="inline h-4 w-4 mr-2" />
                Export as CSV
              </button>
              <button
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
                onClick={exportToPDF}
              >
                <FileText className="inline h-4 w-4 mr-2" />
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            leftIcon={sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          >
            Sort
          </Button>
          <select
            className="form-select rounded-md border-gray-300"
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortableField)}
          >
            <option value="">Default</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="reviewCount">Review Count</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearFilters()}
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Filters
          </Button>
          <select
            multiple
            className="form-multiselect rounded-md border-gray-300"
            value={filters.features}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFilter('features', Array.from(e.target.selectedOptions, option => option.value))
            }
          >
            {allFeatures.map(feature => (
              <option key={feature} value={feature}>{feature}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feature
              </th>
              {tools.map(tool => (
                <th key={tool.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    <span>{tool.name}</span>
                    {onRemoveTool && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveTool(tool.id)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Rating
              </td>
              {tools.map(tool => (
                <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">{tool.rating}</span>
                    <span className="ml-2 text-gray-400">({tool.reviewCount} reviews)</span>
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Pricing Plans
              </td>
              {tools.map(tool => (
                <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    {tool.pricing && tool.pricing.tiers ? tool.pricing.tiers.map(tier => (
                      <Tooltip key={tier.name} content={(tier.features || []).join(', ')}>
                        <Badge variant={tier.isPopular ? 'secondary' : 'outline'} className="mr-1">
                          {tier.name} - {tier.price || 'Free'}/{tier.billingPeriod || 'month'}
                        </Badge>
                      </Tooltip>
                    )) : (
                      <span className="text-gray-400">No pricing information available</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Support Options
              </td>
              {tools.map(tool => (
                <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tool.supportOptions ? (
                    Object.entries(tool.supportOptions)
                      .filter(([_, available]) => available)
                      .map(([option]) => (
                        <Badge key={option} variant="outline" className="mr-1 capitalize">
                          {option}
                        </Badge>
                      ))
                  ) : (
                    <span className="text-gray-400">No support options available</span>
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Certifications
              </td>
              {tools.map(tool => (
                <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {tool.certifications?.map(cert => (
                    <Badge key={cert} variant="outline" className="mr-1">
                      {cert}
                    </Badge>
                  ))}
                </td>
              ))}
            </tr>

            {filteredFeatures.map(feature => (
              <tr key={feature}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {tools.length > 0 && (
                    <Tooltip content={
                      tools.find(t => t.featureDetails?.[feature]?.description)
                        ?.featureDetails?.[feature]?.description ||
                      "No additional details available"
                    }>
                      <button
                        onClick={() => toggleFeature(feature)}
                        className="hover:text-blue-600 focus:outline-none focus:text-blue-600"
                      >
                        {feature}
                      </button>
                    </Tooltip>
                  )}
                </td>
                {tools.map(tool => (
                  <td key={tool.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tool.features && tool.features.includes(feature) ? (
                      tool.featureDetails?.[feature] ? (
                        <Tooltip content={
                          `Available in ${tool.featureDetails[feature].availability || 'all'} plan`
                        }>
                          <span className="text-green-600">✓</span>
                        </Tooltip>
                      ) : (
                        <span className="text-green-600">✓</span>
                      )
                    ) : (
                      <span className="text-red-600">✗</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Save Comparison</h3>
          <input
            type="text"
            placeholder="Comparison name"
            className="w-full px-3 py-2 border rounded-md mb-4"
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
            Make public
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveComparison}>
              Save
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