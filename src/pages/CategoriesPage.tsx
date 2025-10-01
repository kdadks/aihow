import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { categories } from '../data/categories';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Pagination } from '../components/ui/Pagination';

const ITEMS_PER_PAGE = 12;

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  }, [filteredCategories.length]);

  // Get current page items
  const currentCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCategories, currentPage]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <>
      <Helmet>
        <title>AI Tools & Bundles Categories | AIHow</title>
        <meta name="description" content="Browse our comprehensive collection of AI tools and bundles organized by category. Find the perfect tools for media creation, document generation, code development, and more." />
        <meta property="og:title" content="AI Tools & Bundles Categories" />
        <meta property="og:description" content="Discover AI tools and bundles organized by category - from media creation to code development." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Categories</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Tools & Bundles Categories</h1>
          <p className="text-lg text-gray-600 mb-8">
            Browse our comprehensive collection of AI tools and bundles, organized by category to help you find the perfect solution for your needs.
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCategories.map((category) => (
            <Card key={category.id} className="flex flex-col p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className={`icon-${category.icon} text-blue-600 text-xl`}></i>
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                </div>
              </div>
              
              {/* Subcategories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {category.subcategories.map((subcategory) => (
                  <Badge key={subcategory.id} variant="secondary">
                    {subcategory.name}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <Link
                  to={`/directory?category=${category.id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                  Browse Tools
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mb-6"
            />
          </div>
        )}

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoriesPage;