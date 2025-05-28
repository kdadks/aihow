import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Search, Menu, X, Scale, ChevronDown, ChevronRight, Users } from 'lucide-react';
import { categories } from '../../data/categories';
import { tools } from '../../data/tools';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { useComparisonStore } from '../../stores/comparisonStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { } = useAuth();
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
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
                <Button size="sm" onClick={() => navigate('/signup')}>Sign up</Button>
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
          <div className="px-4 pt-4 pb-6 space-y-5">
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

            {/* Quick Access Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Link 
                to="/directory" 
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 shadow-sm"
              >
                <Search className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-sm font-medium text-gray-800">Tools Directory</span>
              </Link>
              <Link 
                to="/workflows" 
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 shadow-sm"
              >
                <ChevronRight className="h-6 w-6 text-green-600 mb-1" />
                <span className="text-sm font-medium text-gray-800">Workflows</span>
              </Link>
              <Link 
                to="/recommendation" 
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 shadow-sm"
              >
                <Search className="h-6 w-6 text-purple-600 mb-1" />
                <span className="text-sm font-medium text-gray-800">Get Recommendations</span>
              </Link>
              <Link 
                to="/community" 
                onClick={() => setIsMenuOpen(false)}
                className="flex flex-col items-center justify-center bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 shadow-sm"
              >
                <Users className="h-6 w-6 text-yellow-600 mb-1" />
                <span className="text-sm font-medium text-gray-800">Community</span>
              </Link>
            </div>

            {/* Compare Tools Link */}
            {selectedTools.length > 0 && (
              <Link 
                to="/compare" 
                className="flex items-center justify-center px-4 py-3 rounded-md text-base font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Scale className="h-5 w-5 mr-3" />
                Compare Selected Tools ({selectedTools.length})
              </Link>
            )}

            {/* Mobile Navigation */}
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">AI Categories</span>
                <Link 
                  to="/directory" 
                  className="text-xs font-medium text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All
                </Link>
              </div>
              
              <nav className="divide-y divide-gray-100 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {categories.map(category => (
                  <details key={category.id} className="group">
                    <summary className="flex items-center justify-between px-4 py-3 cursor-pointer focus:outline-none hover:bg-gray-50">
                      <div className="flex items-center">
                        {/* Display category icon if available */}
                        {category.icon && (
                          <span className="mr-2 text-gray-500 flex items-center justify-center w-6 h-6 rounded-md bg-white shadow-sm">
                            <i className={`icon-${category.icon}`}></i>
                          </span>
                        )}
                        <span className="text-sm font-medium text-gray-900">{category.name}</span>
                      </div>
                      <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-4 py-2 bg-gray-50 space-y-2">
                      <div className="mb-2 flex justify-between items-center">
                        <Link
                          to={`/directory/${category.id}`}
                          className="text-xs font-medium text-blue-600 hover:underline"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          View all in {category.name}
                        </Link>
                      </div>
                      
                      <div className="space-y-3">
                        {category.subcategories?.map(subcategory => (
                          <div key={subcategory.id} className="py-1">
                            <Link
                              to={`/directory/${category.id}/${subcategory.id}`}
                              className="block text-sm font-medium text-gray-800 hover:text-blue-600"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subcategory.name}
                            </Link>
                            {subcategory.tools && subcategory.tools.length > 0 && (
                              <div className="ml-3 mt-1 grid grid-cols-2 gap-y-1 gap-x-2">
                                {subcategory.tools.slice(0, 4).map((toolId, idx) => {
                                  const tool = tools.find(t => t.id === toolId || t.slug === toolId);
                                  return tool ? (
                                    <Link
                                      key={idx}
                                      to={`/directory/${category.id}/${subcategory.id}/${tool.slug}`}
                                      className="block py-1 text-xs text-gray-600 hover:text-blue-600 truncate"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      • {tool.name}
                                    </Link>
                                  ) : null;
                                })}
                              </div>
                            )}
                            {subcategory.tools && subcategory.tools.length > 4 && (
                              <Link
                                to={`/directory/${category.id}/${subcategory.id}`}
                                className="block mt-1 ml-3 text-xs text-blue-600 hover:text-blue-800 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                View all {subcategory.tools.length} tools →
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                ))}
              </nav>
            </div>
            
            {/* Secondary Navigation Links */}
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">More Resources</span>
              </div>
              <div className="grid grid-cols-2 divide-y divide-x divide-gray-100">
                <Link 
                  to="/blog" 
                  className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChevronRight className="h-5 w-5 text-gray-500 mb-1" />
                  <span className="text-sm font-medium text-gray-900">AI Blog</span>
                </Link>
                <Link 
                  to="/testimonials" 
                  className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChevronRight className="h-5 w-5 text-gray-500 mb-1" />
                  <span className="text-sm font-medium text-gray-900">Reviews</span>
                </Link>
                <Link 
                  to="/about" 
                  className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-100 border-t"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChevronRight className="h-5 w-5 text-gray-500 mb-1" />
                  <span className="text-sm font-medium text-gray-900">About Us</span>
                </Link>
                <Link 
                  to="/contact" 
                  className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-100 border-t"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ChevronRight className="h-5 w-5 text-gray-500 mb-1" />
                  <span className="text-sm font-medium text-gray-900">Contact</span>
                </Link>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 mt-2 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  className="justify-center py-2 shadow-sm"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </Button>
                <Button
                  fullWidth
                  className="justify-center py-2 shadow-sm"
                  onClick={() => navigate('/signup')}
                >
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