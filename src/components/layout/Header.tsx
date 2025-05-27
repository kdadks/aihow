import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Scale } from 'lucide-react';
import { categories } from '../../data/categories';
import { tools } from '../../data/tools';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { useComparisonStore } from '../../stores/comparisonStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle clicking outside of dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const { selectedTools } = useComparisonStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchQuery);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center h-8">
              <Logo className="h-full" />
              <span className="ml-2.5 text-xl font-bold text-gray-900">How2AI</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center flex-1 mx-8">
            <nav className="flex mx-auto space-x-8">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-500 hover:text-gray-900 text-sm font-medium inline-flex items-center"
                >
                  AI HUB
                  <svg
                    className={`ml-1 w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-[900px] bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-4 px-4 grid grid-cols-3 gap-6">
                      {categories.map(category => (
                        <div key={category.id} className="space-y-2">
                          <Link
                            to={`/directory/${category.id}`}
                            className="block text-sm font-semibold text-gray-800 hover:text-blue-600"
                          >
                            {category.name}
                          </Link>
                          <div className="space-y-1 mt-2">
                            {category.subcategories?.map(subcategory => (
                              <div key={subcategory.id} className="group/subcategory relative">
                                <Link
                                  to={`/directory/${category.id}/${subcategory.id}`}
                                  className="block text-sm text-gray-600 hover:text-blue-600 py-1"
                                >
                                  {subcategory.name}
                                </Link>
                                <div className="hidden group-hover/subcategory:block absolute left-full top-0 -ml-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3">
                                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Popular Tools
                                  </div>
                                  {tools.filter(tool =>
                                    tool.categoryId === category.id &&
                                    tool.subcategoryIds?.includes(subcategory.id)
                                  ).slice(0, 5).map(tool => (
                                    <Link
                                      key={tool.id}
                                      to={`/directory/${category.id}/${subcategory.id}/${tool.slug}`}
                                      className="block py-1.5 text-sm text-gray-700 hover:text-blue-600"
                                    >
                                      {tool.name}
                                      <div className="text-xs text-gray-500">{tool.shortDescription}</div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/recommendation" className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                Find Tools
              </Link>
              <Link to="/workflows" className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                Workflows
              </Link>
              <Link to="/community" className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                Community
              </Link>
              {selectedTools.length > 0 && (
                <Link
                  to="/compare"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                >
                  <Scale className="h-4 w-4 mr-1" />
                  Compare <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {selectedTools.length}
                  </span>
                </Link>
              )}
            </nav>

            <div className="flex items-center ml-auto space-x-4">
              <form onSubmit={handleSearchSubmit} className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
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
                <Button variant="outline" size="sm">Log in</Button>
                <Button size="sm">Sign up</Button>
              </div>
            </div>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-4 pb-3 space-y-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <nav className="space-y-2">                <div>
                <div className="px-3 py-2 text-base font-medium text-gray-900">
                  AI HUB
                </div>
                <div className="divide-y divide-gray-100">
                  {categories.map(category => (
                    <div key={category.id} className="py-3">
                      <Link
                        to={`/directory/${category.id}`}
                        className="block px-4 py-1 text-sm font-bold text-gray-800 hover:text-blue-600"
                      >
                        {category.name}
                      </Link>
                      <div className="grid grid-cols-2 mt-1 gap-x-2">
                        {category.subcategories?.map(subcategory => (
                          <div key={subcategory.id} className="py-1.5">
                            <Link
                              to={`/directory/${category.id}/${subcategory.id}`}
                              className="block px-6 text-sm text-gray-600 hover:text-blue-600"
                            >
                              {subcategory.name}
                            </Link>
                            {/* Show only the first tool as an example */}
                            {tools
                              .filter(tool =>
                                tool.categoryId === category.id &&
                                tool.subcategoryIds?.includes(subcategory.id)
                              )
                              .slice(0, 1)
                              .map(tool => (
                                <Link
                                  key={tool.id}
                                  to={`/directory/${category.id}/${subcategory.id}/${tool.slug}`}
                                  className="block px-6 mt-0.5 text-xs text-gray-500 hover:text-blue-600"
                                >
                                  {tool.name}
                                </Link>
                              ))
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Link to="/recommendation" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                <Logo className="h-5 mr-3" />
                Find Tools
              </Link>
              <Link to="/workflows" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                <span className="w-5 mr-3" />
                Workflows
              </Link>
              <Link to="/community" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                <span className="w-5 mr-3" />
                Community
              </Link>
              {selectedTools.length > 0 && (
                <Link to="/compare" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">
                  <Scale className="h-5 w-5 mr-3" />
                  Compare Tools ({selectedTools.length})
                </Link>
              )}
            </nav>

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