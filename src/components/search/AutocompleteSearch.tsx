import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { tools } from '../../data/tools';
import { categories } from '../../data/categories';
import { Tool, Category } from '../../types';

interface SearchSuggestion {
  type: 'tool' | 'category' | 'subcategory';
  id: string;
  name: string;
  description?: string;
  url: string;
  logo?: string;
  categoryName?: string;
}

interface AutocompleteSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({
  className = "w-64",
  placeholder = "Search tools...",
  onSearch
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        generateSuggestions(query.trim());
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateSuggestions = (searchQuery: string) => {
    const query = searchQuery.toLowerCase();
    const suggestions: SearchSuggestion[] = [];
    const maxSuggestions = 8;

    // Search tools
    const toolMatches = tools.filter(tool => 
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.shortDescription.toLowerCase().includes(query) ||
      tool.features.some(feature => feature.toLowerCase().includes(query))
    ).slice(0, 5);

    toolMatches.forEach(tool => {
      const category = categories.find(cat => cat.id === tool.categoryId);
      suggestions.push({
        type: 'tool',
        id: tool.id,
        name: tool.name,
        description: tool.shortDescription,
        url: `/directory/${tool.categoryId}/${tool.subcategoryIds[0]}/${tool.slug}`,
        logo: tool.logo,
        categoryName: category?.name
      });
    });

    // Search categories
    if (suggestions.length < maxSuggestions) {
      const categoryMatches = categories.filter(cat =>
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query)
      ).slice(0, maxSuggestions - suggestions.length);

      categoryMatches.forEach(category => {
        suggestions.push({
          type: 'category',
          id: category.id,
          name: category.name,
          description: category.description,
          url: `/directory/${category.id}`
        });
      });
    }

    // Search subcategories
    if (suggestions.length < maxSuggestions) {
      const subcategoryMatches: SearchSuggestion[] = [];
      categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
          if (subcategory.name.toLowerCase().includes(query) ||
              subcategory.description.toLowerCase().includes(query)) {
            subcategoryMatches.push({
              type: 'subcategory',
              id: subcategory.id,
              name: subcategory.name,
              description: subcategory.description,
              url: `/directory/${category.id}/${subcategory.id}`,
              categoryName: category.name
            });
          }
        });
      });

      suggestions.push(...subcategoryMatches.slice(0, maxSuggestions - suggestions.length));
    }

    setSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
    setSelectedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    navigate(suggestion.url);
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch?.(suggestion.name);
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      onSearch?.(query.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'tool':
        return <Search className="h-4 w-4 text-blue-500" />;
      case 'category':
        return <div className="h-4 w-4 bg-green-500 rounded" />;
      case 'subcategory':
        return <div className="h-4 w-4 bg-purple-500 rounded-sm" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          autoComplete="off"
        />
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0 ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {suggestion.logo ? (
                        <img 
                          src={suggestion.logo} 
                          alt={suggestion.name}
                          className="h-6 w-6 rounded object-cover"
                        />
                      ) : (
                        getSuggestionIcon(suggestion.type)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.name}
                        </p>
                        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                      </div>
                      {suggestion.description && (
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {suggestion.description}
                        </p>
                      )}
                      {suggestion.categoryName && (
                        <p className="text-xs text-blue-600 mt-1">
                          in {suggestion.categoryName}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {query.trim() && (
                <button
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-t border-gray-200 text-sm text-blue-600"
                  onClick={handleSearch}
                >
                  <div className="flex items-center">
                    <Search className="h-4 w-4 mr-2" />
                    Search for "{query}"
                  </div>
                </button>
              )}
            </>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};