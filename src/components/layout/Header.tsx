import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Zap, Scale } from 'lucide-react';
import { Button } from '../ui/Button';
import { useComparisonStore } from '../../stores/comparisonStore';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedTools } = useComparisonStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log('Search for:', searchQuery);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">how2AI</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/directory" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Directory
              </Link>
              <Link to="/recommendation" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Find Tools
              </Link>
              <Link to="/workflows" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Workflows
              </Link>
              <Link to="/community" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Community
              </Link>
              {selectedTools.length > 0 && (
                <Link
                  to="/compare"
                  className="text-blue-600 hover:text-blue-800 px-3 py-2 text-sm font-medium flex items-center"
                >
                  <Scale className="h-4 w-4 mr-1" />
                  Compare <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">{selectedTools.length}</span>
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            <div className="ml-4 hidden md:flex items-center space-x-3">
              <Button variant="outline" size="sm">Log in</Button>
              <Button size="sm">Sign up</Button>
            </div>
            <div className="ml-4 md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/directory" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Directory
            </Link>
            <Link to="/recommendation" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Find Tools
            </Link>
            <Link to="/workflows" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
              Workflows
            </Link>
            <Link to="/community" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
              Community
            </Link>
            {selectedTools.length > 0 && (
              <Link to="/compare" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">
                <Scale className="h-4 w-4 mr-2" />
                Compare Tools ({selectedTools.length})
              </Link>
            )}
          </div>
          <div className="px-4 py-3 border-t border-gray-200">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <div className="mt-3 space-y-2">
              <Button variant="outline" fullWidth>Log in</Button>
              <Button fullWidth>Sign up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};