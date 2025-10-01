import React, { useState, useMemo, useEffect } from 'react';
import { BlogCard } from '../components/blog/BlogCard';
import { Search, Mail } from 'lucide-react';
import { blogPosts } from '../data/community';
import { Pagination } from '../components/ui/Pagination';
import { SEOHead } from '../components/SEOHead';

const CATEGORIES = [
  "All",
  "Tools Roundup",
  "Industry News",
  "Tutorials",
  "Comparison",
  "Case Studies",
  "Updates"
];

const ITEMS_PER_PAGE = 12;

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => 
      (selectedCategory === "All" || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [selectedCategory, searchQuery]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  }, [filteredPosts.length]);

  // Get current page items
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'How2doAI Blog',
    description: 'Expert articles, tutorials, and news about AI tools and automation',
    url: 'https://how2doai.com/blog',
    blogPost: blogPosts.slice(0, 10).map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      author: {
        '@type': 'Person',
        name: post.author
      },
      datePublished: post.date
    }))
  };

  return (
    <>
      <SEOHead
        title="AI Tools Blog - Latest News, Tutorials & Expert Guides"
        description="Stay updated with the latest AI tools, industry news, expert tutorials, and in-depth comparisons. Learn how to choose and use AI tools effectively."
        keywords={['AI blog', 'AI tools news', 'AI tutorials', 'AI comparisons', 'AI guides', 'AI industry news']}
        canonicalUrl="https://how2doai.com/blog"
        structuredData={structuredData}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          The AI Tools Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          Stay updated with the latest AI tools, industry news, and expert guides.
        </p>
        <div className="mb-4">
          <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
            <p className="text-base text-gray-700 mb-2">
              Expert articles, comparisons, and news to help you choose the best AI tools.
            </p>
            <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 mt-2 text-sm text-gray-600 items-center justify-center w-full">
              <span className="font-semibold border-l-2 pl-2 border-blue-200">Latest News</span>
              <span className="font-semibold border-l-2 pl-2 border-blue-200">How to Choose</span>
              <span className="font-semibold border-l-2 pl-2 border-blue-200">Categories</span>
            </div>
          </div>
        </div>
        <a href="/write-article" className="inline-block">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Write an Article
          </button>
        </a>
      </div>

      {/* Search and Categories */}
      <div className="mb-8 space-y-4">
        <div className="relative max-w-xl mx-auto">
          <input
            type="search"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {currentPosts.map((post, index) => (
          <BlogCard key={index} {...post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center mb-12">
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mb-6"
          />
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="bg-blue-50 rounded-2xl p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Get the latest AI tools news and updates delivered straight to your inbox.
          </p>
          <form className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-l-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default BlogPage;