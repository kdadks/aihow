import React, { useState, useEffect } from 'react';
import { SearchFilters } from '../components/directory/SearchFilters';
import { ToolCard } from '../components/directory/ToolCard';
import { tools } from '../data/tools';
import { SearchFilters as SearchFiltersType, Tool } from '../types';

const DirectoryPage: React.FC = () => {
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [filteredTools, setFilteredTools] = useState<Tool[]>(tools);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <ToolCard key={tool.id} tool={tool} />
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