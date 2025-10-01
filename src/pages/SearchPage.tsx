import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Grid, List, ArrowRight, Star, ExternalLink } from 'lucide-react';
import { tools } from '../data/tools';
import { categories } from '../data/categories';
import { Tool, Category } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { GenerativeAnswer } from '../components/search/GenerativeAnswer';
import { getToolLogo, getLogoFallback } from '../utils/logoUtils';

interface SearchResult extends Tool {
  matchScore: number;
  matchReason: string;
  categoryName?: string;
  subcategoryName?: string;
}

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'name'>('relevance');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (query.trim()) {
      performSearch(query.trim());
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const performSearch = (searchQuery: string) => {
    setIsLoading(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const results = searchTools(searchQuery);
      setSearchResults(results);
      setIsLoading(false);
    }, 200);
  };

  const searchTools = (searchQuery: string): SearchResult[] => {
    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    tools.forEach(tool => {
      let matchScore = 0;
      let matchReason = '';

      // Exact name match (highest priority)
      if (tool.name.toLowerCase() === query) {
        matchScore = 100;
        matchReason = 'Exact name match';
      }
      // Name contains query
      else if (tool.name.toLowerCase().includes(query)) {
        matchScore = 90;
        matchReason = 'Name contains search term';
      }
      // Short description match
      else if (tool.shortDescription.toLowerCase().includes(query)) {
        matchScore = 80;
        matchReason = 'Description match';
      }
      // Full description match
      else if (tool.description.toLowerCase().includes(query)) {
        matchScore = 70;
        matchReason = 'Detailed description match';
      }
      // Features match
      else if (tool.features.some(feature => feature.toLowerCase().includes(query))) {
        matchScore = 60;
        matchReason = 'Feature match';
      }
      // Category match
      else {
        const category = categories.find(cat => cat.id === tool.categoryId);
        if (category?.name.toLowerCase().includes(query) || 
            category?.description.toLowerCase().includes(query)) {
          matchScore = 50;
          matchReason = 'Category match';
        }
        // Subcategory match
        else {
          const subcategory = category?.subcategories.find(sub => 
            tool.subcategoryIds.includes(sub.id)
          );
          if (subcategory?.name.toLowerCase().includes(query) ||
              subcategory?.description.toLowerCase().includes(query)) {
            matchScore = 40;
            matchReason = 'Subcategory match';
          }
        }
      }

      if (matchScore > 0) {
        const category = categories.find(cat => cat.id === tool.categoryId);
        const subcategory = category?.subcategories.find(sub => 
          tool.subcategoryIds.includes(sub.id)
        );

        results.push({
          ...tool,
          matchScore,
          matchReason,
          categoryName: category?.name,
          subcategoryName: subcategory?.name
        });
      }
    });

    // Sort by match score initially
    return results.sort((a, b) => b.matchScore - a.matchScore);
  };

  const getSortedAndFilteredResults = () => {
    let filtered = searchResults;

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(tool => tool.categoryId === filterCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case 'relevance':
      default:
        return filtered.sort((a, b) => b.matchScore - a.matchScore);
    }
  };

  const getResultsText = () => {
    const count = getSortedAndFilteredResults().length;
    if (count === 0) return 'No results found';
    if (count === 1) return '1 result found';
    return `${count} results found`;
  };

  const renderToolCard = (tool: SearchResult, index: number) => (
    <Card key={`${tool.id}-${tool.slug}-${index}`} className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={getToolLogo(tool.name, tool.website)}
          alt={`${tool.name} logo`}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getLogoFallback(tool.name);
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{tool.shortDescription}</p>
              
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">
                    {tool.rating} ({tool.reviewCount} reviews)
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {tool.categoryName}
                </Badge>
                {tool.trending && (
                  <Badge variant="default" className="text-xs">
                    Trending
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-600 font-medium">
                    {tool.matchReason}
                  </span>
                  <span className="text-sm text-gray-500">
                    {tool.pricing.type === 'freemium' ? 'Free tier available' : 
                     tool.pricing.type === 'free' ? 'Free' : 
                     tool.pricing.startingPrice}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 px-3 text-sm rounded-md border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit
                  </a>
                  <Link
                    to={`/directory/${tool.categoryId}/${tool.subcategoryIds[0]}/${tool.slug}`}
                    className="inline-flex items-center justify-center h-8 px-3 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderToolListItem = (tool: SearchResult, index: number) => (
    <div key={`${tool.id}-${tool.slug}-${index}`} className="flex items-center space-x-4 p-4 border-b border-gray-200 hover:bg-gray-50">
      <img
        src={getToolLogo(tool.name, tool.website)}
        alt={`${tool.name} logo`}
        className="w-10 h-10 rounded object-cover flex-shrink-0"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = getLogoFallback(tool.name);
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{tool.name}</h3>
            <p className="text-sm text-gray-600 truncate">{tool.shortDescription}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">{tool.rating}</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {tool.categoryName}
            </Badge>
            <Link
              to={`/directory/${tool.categoryId}/${tool.subcategoryIds[0]}/${tool.slug}`}
              className="inline-flex items-center justify-center h-8 px-3 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          {query && (
            <p className="text-lg text-gray-600">
              Results for: <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {/* Generative Answer */}
        {query && searchResults.length > 0 && !isLoading && (
          <GenerativeAnswer
            query={query}
            searchResults={getSortedAndFilteredResults()}
          />
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {getResultsText()}
              </span>
              {searchResults.length > 0 && (
                <Badge variant="secondary">
                  {query}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="rating">Sort by Rating</option>
                <option value="name">Sort by Name</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {query ? `No results found for "${query}"` : 'Enter a search term'}
            </h3>
            <p className="text-gray-600 mb-6">
              Try searching for tool names, categories, or features
            </p>
            <Link
              to="/directory"
              className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
            >
              Browse All Tools
            </Link>
          </div>
        ) : (
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-6">
                {getSortedAndFilteredResults().map((tool, index) => renderToolCard(tool, index))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {getSortedAndFilteredResults().map((tool, index) => renderToolListItem(tool, index))}
              </div>
            )}
          </div>
        )}

        {/* Suggestions for empty results */}
        {searchResults.length === 0 && query && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Suggestions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/directory" className="text-blue-600 hover:text-blue-800">
                Browse all tools →
              </Link>
              <Link to="/tool-finder" className="text-blue-600 hover:text-blue-800">
                Use our tool finder →
              </Link>
              <Link to="/workflows" className="text-blue-600 hover:text-blue-800">
                Explore workflows →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;