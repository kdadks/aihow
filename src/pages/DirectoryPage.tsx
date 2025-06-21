import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SearchFilters } from '../components/directory/SearchFilters';
import { ToolCard } from '../components/directory/ToolCard';
import { tools } from '../data/tools';
import { categories } from '../data/categories';
import { SearchFilters as SearchFiltersType, Tool, Category, Subcategory } from '../types';
import { useComparisonStore } from '../stores/comparisonStore';
import { Button } from '../components/ui';
import { Pagination } from '../components/ui/Pagination';
import { Scale } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AutocompleteSearch } from '../components/search/AutocompleteSearch';

const ITEMS_PER_PAGE = 12;

const DirectoryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { categoryId, subcategoryId } = useParams();
  const [filters, setFilters] = useState<SearchFiltersType>(() => ({
    category: categoryId,
    subcategory: subcategoryId
  }));
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);
  const { selectedTools, addTool, isToolSelectable } = useComparisonStore();

  // --- SEO/Intro Section ---
  // Concise intro and subtle headings for better UX alignment
  const renderIntroSection = () => (
    <section className="mb-4">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">AI Tools Directory</h1>
        <p className="text-base text-gray-700 mb-2">
          Compare top AI tools for 2025 by features, pricing, and reviews. Find the best AI software for your workflow.
        </p>
        <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 mt-2 text-sm text-gray-600 items-center justify-center w-full">
          <span className="font-semibold border-l-2 pl-2 border-blue-200">Best AI Tools</span>
          <span className="font-semibold border-l-2 pl-2 border-blue-200">How to Choose</span>
          <span className="font-semibold border-l-2 pl-2 border-blue-200">Categories</span>
        </div>
      </div>
    </section>
  );

  // Handle search from AutocompleteSearch
  const handleDirectorySearch = (query: string) => {
    // Try to match tool, category, or subcategory by name
    const lowerQuery = query.trim().toLowerCase();
    const toolMatch = tools.find(t => t.name.toLowerCase() === lowerQuery);
    if (toolMatch) {
      navigate(`/tools/${toolMatch.id}`);
      return;
    }
    const categoryMatch = categories.find(c => c.name.toLowerCase() === lowerQuery);
    if (categoryMatch) {
      setFilters(prev => ({
        ...prev,
        category: categoryMatch.id,
        subcategory: undefined
      }));
      return;
    }
    let foundSub: { categoryId: string, subcategoryId: string } | undefined;
    categories.forEach(c => {
      c.subcategories?.forEach(s => {
        if (s.name.toLowerCase() === lowerQuery) {
          foundSub = { categoryId: c.id, subcategoryId: s.id };
        }
      });
    });
    if (foundSub) {
      setFilters(prev => ({
        ...prev,
        category: foundSub!.categoryId,
        subcategory: foundSub!.subcategoryId
      }));
      return;
    }
    // If no match, just filter by query (partial match)
    setFilters(prev => ({
      ...prev,
      query
    }));
  };

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
  }, [filteredTools.length]);

  // Get current page items
  const currentTools = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTools.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTools, currentPage]);

  useEffect(() => {
    // Check if we should show the comparison prompt
    if (location.state?.showComparisonPrompt) {
      toast('Select tools to compare', {
        icon: '👆',
        duration: 3000
      });
    }
  }, [location.state]);

  // Update filters when URL params change
  useEffect(() => {
    setCurrentPage(1); // Reset pagination when category/subcategory changes
    setFilters(prev => ({
      ...prev,
      category: categoryId,
      subcategory: subcategoryId
    }));
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
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

    // Apply query filter from search bar
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(tool =>
        tool.name.toLowerCase().includes(q) ||
        tool.description?.toLowerCase().includes(q)
      );
    }

    // Update filtered results
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
      {renderIntroSection()}
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
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          {filters.subcategory ? (
            categories.find((c: Category) => c.id === filters.category)?.subcategories?.find((s: Subcategory) => s.id === filters.subcategory)?.name
          ) : filters.category ? (
            categories.find((c: Category) => c.id === filters.category)?.name
          ) : (
            'AI Tools Directory'
          )}
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          {filters.subcategory ? (
            categories.find((c: Category) => c.id === filters.category)?.subcategories?.find((s: Subcategory) => s.id === filters.subcategory)?.description
          ) : filters.category ? (
            categories.find((c: Category) => c.id === filters.category)?.description
          ) : (
            'Browse and filter through our comprehensive collection of AI tools to find the perfect solutions for your needs.'
          )}
        </p>
      </div>

      <AutocompleteSearch
        className="mb-6 w-full max-w-xl mx-auto"
        placeholder="Search tools, categories, or subcategories..."
        onSearch={handleDirectorySearch}
      />
      <SearchFilters onFilterChange={setFilters} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.length > 0 ? (
          currentTools.map(tool => (
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
      
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mb-6"
          />
        </div>
      )}
    </div>
  );
};

export default DirectoryPage;
