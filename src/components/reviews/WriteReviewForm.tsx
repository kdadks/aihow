import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface WriteReviewFormProps {
  toolId: string;
  toolName: string;
  onReviewSubmitted?: () => void;
}

export const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  toolId,
  toolName,
  onReviewSubmitted
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to write a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('tool_reviews')
        .insert({
          tool_id: toolId,
          user_id: user.id,
          rating,
          review_text: reviewText.trim(),
          status: 'published'
        });

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      setRating(0);
      setReviewText('');
      onReviewSubmitted?.();
    } catch (err: any) {
      if (err.code === '23505') {
        setError('You have already reviewed this tool');
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-gray-600 text-center">
          Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to write a review.
        </p>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-green-600 mb-2">✓</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Submitted!</h3>
          <p className="text-gray-600">Thank you for your review of {toolName}.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Write a Review for {toolName}
      </h3>
      
      <form onSubmit={handleSubmitReview} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this tool..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            maxLength={1000}
          />
          <div className="text-sm text-gray-500 mt-1">
            {reviewText.length}/1000 characters
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || rating === 0 || reviewText.trim().length < 10}
          className="w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Card>
  );
};