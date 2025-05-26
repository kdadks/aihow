import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Scale } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
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
              <Link to="/directory" className="text-gray-500 hover:text-gray-900 text-sm font-medium">
                Directory
              </Link>
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

            <nav className="space-y-2">
              <Link to="/directory" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
                <Search className="h-5 w-5 mr-3 text-gray-400" />
                Directory
              </Link>
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