import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Scale, ChevronDown, ChevronRight } from 'lucide-react';
import { categories } from '../../data/categories';
import { tools } from '../../data/tools';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { useComparisonStore } from '../../stores/comparisonStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);
  const { selectedTools } = useComparisonStore();

  // Handle clicking outside of dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Get popular categories for quicker access
  const popularCategories = categories.slice(0, 6);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center h-8">
              <Logo className="h-full" />
              <span className="ml-2.5 text-xl font-bold text-gray-900">How2AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center flex-1 mx-8">
            <nav className="flex mx-auto space-x-6">
              {/* AI Hub Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium inline-flex items-center px-3 py-2 rounded-md hover:bg-gray-50"
                  aria-expanded={isDropdownOpen}
                >
                  AI HUB
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-[800px] max-w-screen-lg bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="flex">
                      {/* Categories sidebar */}
                      <div className="w-1/4 bg-gray-50 p-4 border-r border-gray-100 max-h-[60vh] overflow-y-auto">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Categories
                        </h3>
                        <ul className="space-y-1">
                          {categories.map(category => (
                            <li key={category.id}>
                              <button
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                                  activeCategoryId === category.id 
                                    ? 'bg-blue-50 text-blue-700 font-medium' 
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveCategoryId(category.id)}
                              >
                                {category.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Subcategories and tools */}
                      <div className="w-3/4 p-6 max-h-[60vh] overflow-y-auto">
                        {activeCategoryId ? (
                          // Show selected category details
                          <div>
                            {categories.filter(c => c.id === activeCategoryId).map(category => (
                              <div key={category.id}>
                                <div className="flex items-center justify-between mb-4">
                                  <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                                  <Link
                                    to={`/directory/${category.id}`}
                                    className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center"
                                    onClick={() => setIsDropdownOpen(false)}
                                  >
                                    View all <ChevronRight className="h-3 w-3 ml-1" />
                                  </Link>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                                
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                  {category.subcategories?.map(subcategory => (
                                    <div key={subcategory.id} className="mb-3">
                                      <Link
                                        to={`/directory/${category.id}/${subcategory.id}`}
                                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                        onClick={() => setIsDropdownOpen(false)}
                                      >
                                        {subcategory.name}
                                      </Link>
                                      <p className="text-xs text-gray-500 mt-1 mb-2">{subcategory.description}</p>
                                      {subcategory.tools && subcategory.tools.slice(0, 2).map((toolId, idx) => {
                                        const tool = tools.find(t => t.id === toolId || t.slug === toolId);
                                        return tool ? (
                                          <Link
                                            key={idx}
                                            to={`/directory/${category.id}/${subcategory.id}/${tool.slug}`}
                                            className="block text-xs text-blue-600 hover:text-blue-800 pl-2 border-l border-gray-200 py-1"
                                            onClick={() => setIsDropdownOpen(false)}
                                          >
                                            {tool.name}
                                          </Link>
                                        ) : null;
                                      })}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Show featured categories
                          <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h2>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                              {popularCategories.map(category => (
                                <div key={category.id} className="mb-2">
                                  <Link
                                    to={`/directory/${category.id}`}
                                    className="text-sm font-medium text-gray-900 hover:text-blue-600 flex items-center"
                                    onClick={() => setIsDropdownOpen(false)}
                                  >
                                    {category.name}
                                  </Link>
                                  <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                                  {category.subcategories && category.subcategories.length > 0 && (
                                    <button
                                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
                                      onClick={() => setActiveCategoryId(category.id)}
                                    >
                                      Explore {category.subcategories.length} subcategories
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Other Navigation Links */}
              <Link 
                to="/workflows" 
                className="text-gray-700 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-50"
              >
                Workflows
              </Link>
              <Link 
                to="/community" 
                className="text-gray-700 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-50"
              >
                Community
              </Link>
              {selectedTools.length > 0 && (
                <Link
                  to="/compare"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center px-3 py-2 rounded-md hover:bg-blue-50"
                >
                  <Scale className="h-4 w-4 mr-1.5" />
                  Compare <span className="ml-1.5 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {selectedTools.length}
                  </span>
                </Link>
              )}
            </nav>

            {/* Search and User Actions */}
            <div className="flex items-center ml-auto space-x-4">
              <form ref={searchRef} onSubmit={handleSearchSubmit} className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">Log in</Button>
                <Button size="sm">Sign up</Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-4 pb-6 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-3">
              {/* AI HUB Section - Collapsible Accordion */}
              <div className="border border-gray-100 rounded-lg overflow-hidden">
                <div className="px-4 py-3 text-base font-medium text-gray-900 bg-gray-50">
                  AI HUB
                </div>
                
                <div className="divide-y divide-gray-100">
                  {categories.map(category => (
                    <details key={category.id} className="group">
                      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer focus:outline-none">
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="px-4 py-2 bg-gray-50">
                        <Link
                          to={`/directory/${category.id}`}
                          className="block py-1 mb-2 text-xs font-medium text-blue-600 hover:underline"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          View all in {category.name}
                        </Link>
                        <div className="divide-y divide-gray-100">
                          {category.subcategories?.map(subcategory => (
                            <div key={subcategory.id} className="py-2">
                              <Link
                                to={`/directory/${category.id}/${subcategory.id}`}
                                className="block text-sm font-medium text-gray-800 hover:text-blue-600"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subcategory.name}
                              </Link>
                              {subcategory.tools && subcategory.tools.length > 0 && (
                                <div className="ml-3 mt-1 space-y-1">
                                  {subcategory.tools.slice(0, 3).map((toolId, idx) => {
                                    const tool = tools.find(t => t.id === toolId || t.slug === toolId);
                                    return tool ? (
                                      <Link
                                        key={idx}
                                        to={`/directory/${category.id}/${subcategory.id}/${tool.slug}`}
                                        className="block py-1 text-xs text-gray-600 hover:text-blue-600"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        • {tool.name}
                                      </Link>
                                    ) : null;
                                  })}
                                  {subcategory.tools.length > 3 && (
                                    <Link
                                      to={`/directory/${category.id}/${subcategory.id}`}
                                      className="block py-1 text-xs text-blue-600 hover:text-blue-800"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      + {subcategory.tools.length - 3} more tools
                                    </Link>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
              
              {/* Other Mobile Navigation Links */}
              <Link 
                to="/workflows" 
                className="flex items-center px-4 py-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Workflows
              </Link>
              <Link 
                to="/community" 
                className="flex items-center px-4 py-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Community
              </Link>
              
              {/* Compare Tools Link */}
              {selectedTools.length > 0 && (
                <Link 
                  to="/compare" 
                  className="flex items-center px-4 py-3 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Scale className="h-5 w-5 mr-3" />
                  Compare Tools ({selectedTools.length})
                </Link>
              )}
            </nav>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <Button variant="outline" fullWidth className="justify-center">
                  Log in
                </Button>
                <Button fullWidth className="justify-center">
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};