import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { Search, Menu, X, Scale, ChevronDown, ChevronRight, Users, MoreHorizontal } from 'lucide-react';
import { useCategories } from '../../services/api/v2/categories';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { useComparisonStore } from '../../stores/comparisonStore';
import { AutocompleteSearch } from '../search/AutocompleteSearch';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: categories = [] } = useCategories();
  const isAuthenticated = !!user;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [openMobileCategories, setOpenMobileCategories] = useState<Set<string>>(new Set());
  const [openMobileSubcategories, setOpenMobileSubcategories] = useState<Set<string>>(new Set());
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { selectedTools } = useComparisonStore();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = mobileMenuRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;
        setShowScrollIndicator(isScrollable && !isNearBottom);
      }
    };

    if (isMenuOpen && mobileMenuRef.current) {
      const menuElement = mobileMenuRef.current;
      menuElement.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => menuElement.removeEventListener('scroll', handleScroll);
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setOpenMobileCategories(new Set());
      setOpenMobileSubcategories(new Set());
    }
  };

  const toggleMobileCategory = (categoryId: string) => {
    setOpenMobileCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
        setOpenMobileSubcategories(prevSub => {
          const category = categories.find(c => c.id === categoryId);
          const subcategoryIds = (category?.subcategories ?? []).map(sub => sub.id);
          const newSubSet = new Set(prevSub);
          subcategoryIds.forEach(id => newSubSet.delete(id));
          return newSubSet;
        });
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleMobileSubcategory = (subcategoryId: string) => {
    setOpenMobileSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subcategoryId)) {
        newSet.delete(subcategoryId);
      } else {
        newSet.add(subcategoryId);
      }
      return newSet;
    });
  };

  const popularCategories = categories.slice(0, 6);


  return (
    <header className="sticky top-0 z-40 bg-transparent">
      {/* Main pill header bar */}
      <div className="px-3 pt-2.5 pb-1 bg-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Gradient border cylinder wrapper */}
          <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-r from-violet-400/40 via-blue-400/40 to-cyan-400/40 shadow-[0_8px_32px_rgba(139,92,246,0.12),0_2px_8px_rgba(0,0,0,0.06)]">
            {/* Glass inner surface */}
            <div className="bg-transparent rounded-[13px] px-5">
              <div className="flex items-center justify-between h-14">
                {/* Logo */}
                <div className="flex items-center flex-shrink-0 mr-6">
                  <Link to="/" className="flex items-center h-8 group" onClick={scrollToTop}>
                    <Logo className="h-full" />
                    <span className="ml-2.5 text-xl font-bold bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text text-transparent group-hover:from-violet-600 group-hover:to-cyan-500 transition-all duration-300">
                      How2doAI
                    </span>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:justify-center flex-1 mx-4">
                  <nav className="flex items-center space-x-1">
                    {/* AI Hub Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium inline-flex items-center px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-violet-50 hover:to-blue-50 transition-all duration-200 whitespace-nowrap"
                        aria-expanded={isDropdownOpen}
                      >
                        AI HUB
                        <ChevronDown className={`ml-1 w-4 h-4 transition-transform flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute left-0 mt-2 w-[800px] max-w-screen-lg bg-white/95 backdrop-blur-xl border border-gray-100/80 rounded-2xl shadow-2xl shadow-gray-200/60 z-50 overflow-hidden">
                          <div className="flex">
                            {/* Categories sidebar */}
                            <div className="w-1/4 bg-gradient-to-b from-gray-50 to-white p-4 border-r border-gray-100/80 max-h-[60vh] overflow-y-auto">
                              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                Categories
                              </h3>
                              <ul className="space-y-0.5">
                                {categories.map(category => (
                                  <li key={category.id}>
                                    <button
                                      className={`w-full text-left px-3 py-2 text-sm rounded-xl transition-all duration-150 ${
                                        activeCategoryId === category.id
                                          ? 'bg-gradient-to-r from-violet-50 to-blue-50 text-violet-700 font-medium'
                                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                                <div>
                                  {categories.filter(c => c.id === activeCategoryId).map(category => (
                                    <div key={category.id}>
                                      <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                                        <Link
                                          to={`/directory/${category.slug}`}
                                          className="text-xs font-medium text-violet-600 hover:text-violet-800 flex items-center px-3 py-1.5 rounded-full bg-violet-50 hover:bg-violet-100 transition-all"
                                          onClick={() => setIsDropdownOpen(false)}
                                        >
                                          View all <ChevronRight className="h-3 w-3 ml-1" />
                                        </Link>
                                      </div>
                                      <p className="text-sm text-gray-500 mb-4">{category.description}</p>

                                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                        {category.subcategories?.map(subcategory => (
                                          <div key={subcategory.id} className="mb-3">
                                            <Link
                                              to={`/directory/${category.slug}/${subcategory.slug}`}
                                              className="text-sm font-medium text-gray-900 hover:text-violet-600 transition-colors"
                                              onClick={() => setIsDropdownOpen(false)}
                                            >
                                              {subcategory.name}
                                            </Link>
                                            <p className="text-xs text-gray-400 mt-1 mb-2">{subcategory.description}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div>
                                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h2>
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    {popularCategories.map(category => (
                                      <div key={category.id} className="mb-2">
                                        <Link
                                          to={`/directory/${category.slug}`}
                                          className="text-sm font-medium text-gray-900 hover:text-violet-600 flex items-center transition-colors"
                                          onClick={() => setIsDropdownOpen(false)}
                                        >
                                          {category.name}
                                        </Link>
                                        <p className="text-xs text-gray-400 mt-1">{category.description}</p>
                                        {category.subcategories && category.subcategories.length > 0 && (
                                          <button
                                            className="mt-2 text-xs text-violet-600 hover:text-violet-800 focus:outline-none transition-colors"
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

                    <Link
                      to="/workflows"
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-violet-50 hover:to-blue-50 transition-all duration-200 whitespace-nowrap"
                      onClick={scrollToTop}
                    >
                      Workflows
                    </Link>
                    <Link
                      to="/community"
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-violet-50 hover:to-blue-50 transition-all duration-200 whitespace-nowrap"
                      onClick={scrollToTop}
                    >
                      Community
                    </Link>

                    {/* Compare Tools */}
                    <div className="w-32 flex justify-center">
                      {selectedTools.length > 0 && (
                        <Link
                          to="/compare"
                          className="text-violet-600 hover:text-violet-800 text-sm font-medium flex items-center px-3 py-2 rounded-full hover:bg-violet-50 transition-all duration-200 whitespace-nowrap"
                          onClick={scrollToTop}
                        >
                          <Scale className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          Compare
                          <span className="ml-1.5 bg-gradient-to-r from-violet-100 to-blue-100 text-violet-800 px-2 py-0.5 rounded-full text-xs flex-shrink-0">
                            {selectedTools.length}
                          </span>
                        </Link>
                      )}
                    </div>
                  </nav>
                </div>

                {/* Right Section */}
                <div className="hidden md:flex md:items-center md:space-x-3 flex-shrink-0">
                  <AutocompleteSearch
                    className="w-60"
                    placeholder="Search AI tools..."
                  />

                  {isAuthenticated ? (
                    <div className="flex items-center space-x-2">
                      <Link
                        to="/my-content"
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-full hover:bg-gray-50 transition-all whitespace-nowrap"
                      >
                        My Content
                      </Link>
                      <Link
                        to="/dashboard"
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-full hover:bg-gray-50 transition-all whitespace-nowrap"
                      >
                        Dashboard
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            await signOut();
                            navigate('/');
                          } catch (error) {
                            console.error('Logout error:', error);
                            navigate('/login');
                          }
                        }}
                        className="whitespace-nowrap rounded-full"
                      >
                        Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="whitespace-nowrap rounded-full">
                        Log in
                      </Button>
                      <button
                        onClick={() => navigate('/signup')}
                        className="whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-violet-200/50"
                      >
                        Sign up
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden">
                  <button
                    onClick={toggleMenu}
                    className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-400/50 transition-all"
                    aria-expanded={isMenuOpen}
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMenuOpen ? (
                      <X className="block h-5 w-5" />
                    ) : (
                      <Menu className="block h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - separate floating panel */}
      {isMenuOpen && (
        <div className="md:hidden px-3 pb-3">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/96 backdrop-blur-2xl rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100/80 overflow-hidden">
              {/* Sticky Auth Section */}
              <div
                className="sticky top-0 z-10 bg-white/98 border-b border-gray-100 px-4 py-3"
                role="banner"
                aria-label="Authentication section"
              >
                {!isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-900">Quick Access</span>
                      <span className="text-xs text-gray-400">Sign in to save your preferences</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2" role="group" aria-label="Authentication options">
                      <Button
                        variant="outline"
                        fullWidth
                        className="justify-center py-2.5 text-sm font-medium rounded-xl border-gray-200 hover:bg-gray-50 mobile-touch-target"
                        onClick={() => {
                          navigate('/login');
                          setIsMenuOpen(false);
                        }}
                        aria-label="Log in to your account"
                      >
                        Log in
                      </Button>
                      <button
                        onClick={() => {
                          navigate('/signup');
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-center py-2.5 text-sm font-medium rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 transition-all"
                        aria-label="Sign up for a new account"
                      >
                        Sign up
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-100 to-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-violet-600">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">
                          {user?.email || 'User'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs rounded-xl mobile-touch-target"
                        onClick={() => {
                          navigate('/dashboard');
                          setIsMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-400 rounded-xl mobile-touch-target"
                        onClick={async () => {
                          try {
                            await signOut();
                            setIsMenuOpen(false);
                            navigate('/');
                          } catch (error) {
                            console.error('Logout error:', error);
                            setIsMenuOpen(false);
                            navigate('/login');
                          }
                        }}
                      >
                        Sign out
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Scrollable Content Area */}
              <div
                ref={mobileMenuRef}
                className="px-4 pt-4 pb-6 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto mobile-menu-scroll mobile-scrollbar"
              >
                {/* Mobile Search */}
                <AutocompleteSearch
                  className="w-full"
                  placeholder="Search AI tools..."
                  onSearch={() => setIsMenuOpen(false)}
                />

                {/* Quick Access Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/directory"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <Search className="h-6 w-6 text-violet-600 mb-1" />
                    <span className="text-sm font-medium text-gray-800">Tools Directory</span>
                  </Link>
                  <Link
                    to="/workflows"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <ChevronRight className="h-6 w-6 text-teal-600 mb-1" />
                    <span className="text-sm font-medium text-gray-800">Workflows</span>
                  </Link>
                  <Link
                    to="/tool-finder"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <Search className="h-6 w-6 text-purple-600 mb-1" />
                    <span className="text-sm font-medium text-gray-800">Tool Finder</span>
                  </Link>
                  <Link
                    to="/community"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <Users className="h-6 w-6 text-amber-600 mb-1" />
                    <span className="text-sm font-medium text-gray-800">Community</span>
                  </Link>
                </div>

                {/* Compare Tools Link */}
                {selectedTools.length > 0 && (
                  <Link
                    to="/compare"
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-semibold text-violet-600 bg-gradient-to-r from-violet-50 to-blue-50 hover:from-violet-100 hover:to-blue-100 transition-all"
                    onClick={() => {
                      setIsMenuOpen(false);
                      scrollToTop();
                    }}
                  >
                    <Scale className="h-5 w-5 mr-3" />
                    Compare Selected Tools ({selectedTools.length})
                  </Link>
                )}

                {/* Mobile Navigation */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">AI Categories</span>
                    <Link
                      to="/directory"
                      className="text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View All
                    </Link>
                  </div>

                  <nav className="divide-y divide-gray-50 max-h-[50vh] overflow-y-auto mobile-menu-scroll mobile-scrollbar">
                    {categories.map(category => (
                      <div key={category.id} className="group">
                        <button
                          onClick={() => toggleMobileCategory(category.id)}
                          className="w-full flex items-center justify-between px-4 py-3 cursor-pointer focus:outline-none hover:bg-gray-50 mobile-touch-target transition-colors"
                        >
                          <div className="flex items-center">
                            {category.icon && (
                              <span className="mr-2 text-gray-400 flex items-center justify-center w-6 h-6 rounded-lg bg-white shadow-sm">
                                <i className={`icon-${category.icon}`}></i>
                              </span>
                            )}
                            <span className="text-sm font-medium text-gray-800">{category.name}</span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                            openMobileCategories.has(category.id) ? 'rotate-180' : ''
                          }`} />
                        </button>
                        {openMobileCategories.has(category.id) && (
                          <div className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
                            <div className="px-4 py-3 border-b border-gray-100">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">{category.name}</h3>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {category.subcategories?.length} subcategories
                                  </p>
                                </div>
                                <Link
                                  to={`/directory/${category.slug}`}
                                  className="text-xs font-medium text-violet-600 hover:text-violet-800 px-3 py-1.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  View All
                                </Link>
                              </div>
                            </div>

                            <div className="divide-y divide-gray-50">
                              {category.subcategories?.map(subcategory => (
                                <div key={subcategory.id} className="group">
                                  <button
                                    onClick={() => toggleMobileSubcategory(subcategory.id)}
                                    className="w-full flex items-center justify-between px-4 py-3 mobile-touch-target transition-colors hover:bg-gray-50/80"
                                  >
                                    <div className="flex-1 text-left">
                                      <div className="flex items-center space-x-2">
                                        <h4 className="text-sm font-medium text-gray-800">{subcategory.name}</h4>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
                                          {subcategory.tools?.length || 0}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                                        {subcategory.description}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-3">
                                      <Link
                                        to={`/directory/${category.slug}/${subcategory.slug}`}
                                        className="text-xs text-violet-600 hover:text-violet-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIsMenuOpen(false);
                                        }}
                                      >
                                        View
                                      </Link>
                                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                                        openMobileSubcategories.has(subcategory.id) ? 'rotate-180' : ''
                                      }`} />
                                    </div>
                                  </button>

                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Secondary Navigation Links */}
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <span className="text-base font-semibold text-gray-900">More Resources</span>
                  </div>
                  <div className="grid grid-cols-2 divide-y divide-x divide-gray-50">
                    <Link
                      to="/blog"
                      className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-50 mobile-touch-target transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-400 mb-1" />
                      <span className="text-sm font-medium text-gray-800">AI Blog</span>
                    </Link>
                    <Link
                      to="/testimonials"
                      className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-50 mobile-touch-target transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-400 mb-1" />
                      <span className="text-sm font-medium text-gray-800">Reviews</span>
                    </Link>
                    <Link
                      to="/about"
                      className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-50 border-t mobile-touch-target transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-400 mb-1" />
                      <span className="text-sm font-medium text-gray-800">About Us</span>
                    </Link>
                    <Link
                      to="/contact"
                      className="flex flex-col items-center justify-center p-4 text-center hover:bg-gray-50 border-t mobile-touch-target transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ChevronRight className="h-5 w-5 text-gray-400 mb-1" />
                      <span className="text-sm font-medium text-gray-800">Contact</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Scroll indicator */}
              {showScrollIndicator && (
                <div className="absolute bottom-0 left-0 right-0 flex justify-center py-2 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                  <div className="flex items-center space-x-1 text-gray-300 text-xs">
                    <MoreHorizontal className="h-4 w-4" />
                    <span>Scroll for more</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
