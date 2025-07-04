import React, { useState, useMemo } from 'react';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { reviews } from '../data/community';
import { Pagination } from '../components/ui/Pagination';

const ITEMS_PER_PAGE = 12;

const ReviewsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredReviews = useMemo(() => {
    return reviews
      .filter(review => filterRating ? review.rating >= filterRating : true)
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return b.rating - a.rating;
      });
  }, [filterRating, sortBy]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  }, [filteredReviews.length]);

  // Get current page items
  const currentReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterRating, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Customer Reviews
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See what our community has to say about their experience with how2AI's tool recommendations and comparisons.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'recent' | 'rating')}
            className="rounded-md border-gray-300 py-2 px-4 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
          </select>
          <select
            value={filterRating || ''}
            onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
            className="rounded-md border-gray-300 py-2 px-4 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
        </div>

        <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-2">
          <span className="text-gray-700 font-medium">
            {filteredReviews.length} reviews
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-700">
            {filteredReviews.length > 0 ? (filteredReviews.reduce((acc, review) => acc + review.rating, 0) / filteredReviews.length).toFixed(1) : '0'} average rating
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentReviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
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
    </div>
  );
};

export default ReviewsPage;