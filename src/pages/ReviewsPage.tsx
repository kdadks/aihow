import React, { useState } from 'react';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { reviews } from '../data/community';

const ReviewsPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<'recent' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const filteredReviews = reviews
    .filter(review => filterRating ? review.rating >= filterRating : true)
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.rating - a.rating;
    });

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
            {(filteredReviews.reduce((acc, review) => acc + review.rating, 0) / filteredReviews.length).toFixed(1)} average rating
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;