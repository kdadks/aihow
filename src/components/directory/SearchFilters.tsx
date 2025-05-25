import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { EnhancedVoiceSearch } from '../search/EnhancedVoiceSearch';
import { categories } from '../../data/categories';
import { SearchFilters as SearchFiltersType } from '../../types';

interface SearchFiltersProps {
  onFilterChange: (filters: SearchFiltersType) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFiltersType>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log('Search for:', searchQuery);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setSearchQuery(transcript);
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === categoryId ? undefined : categoryId,
      subcategory: undefined // Reset subcategory when category changes
    }));
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setFilters(prev => ({
      ...prev,
      subcategory: prev.subcategory === subcategoryId ? undefined : subcategoryId
    }));
  };

  const handlePricingChange = (pricing: string) => {
    const updatedPricing = filters.pricing || [];
    if (updatedPricing.includes(pricing)) {
      setFilters(prev => ({
        ...prev,
        pricing: updatedPricing.filter(p => p !== pricing)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        pricing: [...updatedPricing, pricing]
      }));
    }
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? undefined : rating
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  // Update parent component when filters change
  React.useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <div className="p-4">
        <form onSubmit={handleSearchSubmit}>
          <EnhancedVoiceSearch
            onTranscript={handleVoiceTranscript}
            placeholder="Search for AI tools..."
            className="mb-4"
          />
          <Button
            type="button"
            variant="ghost"
            className="w-full text-gray-400 hover:text-gray-500"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </form>

        {(Object.keys(filters).length > 0 || searchQuery) && (
          <div className="mt-3 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery && (
              <Badge variant="primary" className="flex items-center">
                Search: {searchQuery}
                <button 
                  className="ml-1 p-1"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.category && (
              <Badge variant="primary" className="flex items-center capitalize">
                {filters.category.replace('-', ' ')}
                <button 
                  className="ml-1 p-1"
                  onClick={() => handleCategoryChange(filters.category!)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.subcategory && (
              <Badge variant="primary" className="flex items-center capitalize">
                {filters.subcategory.replace('-', ' ')}
                <button 
                  className="ml-1 p-1"
                  onClick={() => handleSubcategoryChange(filters.subcategory!)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.pricing && filters.pricing.map(pricing => (
              <Badge key={pricing} variant="primary" className="flex items-center capitalize">
                {pricing}
                <button 
                  className="ml-1 p-1"
                  onClick={() => handlePricingChange(pricing)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.rating && (
              <Badge variant="primary" className="flex items-center">
                {filters.rating}+ stars
                <button 
                  className="ml-1 p-1"
                  onClick={() => handleRatingChange(filters.rating!)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-700"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {isFiltersOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      id={`category-${category.id}`}
                      name="category"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.category === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700 capitalize">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Subcategories</h3>
              <div className="space-y-2">
                {filters.category ? (
                  categories
                    .find(c => c.id === filters.category)
                    ?.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center">
                        <input
                          id={`subcategory-${subcategory.id}`}
                          name="subcategory"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={filters.subcategory === subcategory.id}
                          onChange={() => handleSubcategoryChange(subcategory.id)}
                        />
                        <label htmlFor={`subcategory-${subcategory.id}`} className="ml-2 text-sm text-gray-700 capitalize">
                          {subcategory.name}
                        </label>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-gray-500">Select a category first</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Pricing</h3>
              <div className="space-y-2">
                {['free', 'freemium', 'paid', 'subscription'].map((pricing) => (
                  <div key={pricing} className="flex items-center">
                    <input
                      id={`pricing-${pricing}`}
                      name="pricing"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.pricing?.includes(pricing)}
                      onChange={() => handlePricingChange(pricing)}
                    />
                    <label htmlFor={`pricing-${pricing}`} className="ml-2 text-sm text-gray-700 capitalize">
                      {pricing}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center">
                    <input
                      id={`rating-${rating}`}
                      name="rating"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={filters.rating === rating}
                      onChange={() => handleRatingChange(rating)}
                    />
                    <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-gray-700 flex items-center">
                      {rating}+ stars
                      <div className="ml-1 flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 15.934l-6.18 3.254 1.18-6.875L.586 7.935l6.9-1.002L10 .714l2.514 6.219 6.9 1.002-4.414 4.377 1.18 6.875z"
      clipRule="evenodd"
    />
  </svg>
);