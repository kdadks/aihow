import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchFilters } from '../components/directory/SearchFilters';
import { ToolCard } from '../components/directory/ToolCard';
import { tools } from '../data/tools';
import { SearchFilters as SearchFiltersType, Tool } from '../types';
import { useComparisonStore } from '../stores/comparisonStore';
import { Button } from '../components/ui';
import { Scale } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DirectoryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFiltersType>(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    return categoryParam ? { category: categoryParam } : {};
  });
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const { selectedTools, addTool, isToolSelectable } = useComparisonStore();

  useEffect(() => {
    // Check if we should show the comparison prompt
    if (location.state?.showComparisonPrompt) {
      toast('Select tools to compare', {
        icon: '👆',
        duration: 3000
      });
    }
  }, [location.state]);

  // Update filters when URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    } else if (filters.category) {
      setFilters(prev => {
        const { category, ...rest } = prev;
        return rest;
      });
    }
  }, [location.search]);

  useEffect(() => {
    let result = [...tools];

    // Apply category filter
    if (filters.category) {
      result = result.filter(tool => tool.categoryId === filters.category);
    }

    // Apply subcategory filter
    if (filters.subcategory) {
      result = result.filter(tool => tool.subcategoryIds.includes(filters.subcategory!));
    }

    // Apply pricing filter
    if (filters.pricing && filters.pricing.length > 0) {
      result = result.filter(tool => filters.pricing!.includes(tool.pricing.type));
    }

    // Apply rating filter
    if (filters.rating) {
      result = result.filter(tool => tool.rating >= filters.rating!);
    }

    setFilteredTools(result);
  }, [filters]);

  const handleCompare = () => {
    if (selectedTools.length < 2) {
      toast.error('Select at least 2 tools to compare');
      return;
    }
    navigate('/compare');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Comparison Bar */}
      {selectedTools.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Scale className="h-5 w-5 text-blue-600" />
              <span className="font-medium">
                {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/directory')}
                disabled={!isToolSelectable(tools[0])}
              >
                Add More ({4 - selectedTools.length} remaining)
              </Button>
              <Button
                onClick={handleCompare}
                disabled={selectedTools.length < 2}
              >
                Compare Tools
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">AI Tools Directory</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Browse and filter through our comprehensive collection of AI tools to find the perfect solutions for your needs.
        </p>
      </div>

      <SearchFilters onFilterChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.length > 0 ? (
          filteredTools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isSelected={selectedTools.some(t => t.id === tool.id)}
              onCompare={() => addTool(tool)}
              isCompareDisabled={!isToolSelectable(tool)}
            />
          ))
        ) : (
          <div className="col-span-3 py-20 text-center">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">No tools match your filters</h3>
            <p className="text-gray-600">
              Try adjusting your filters or browse our complete collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryPage;