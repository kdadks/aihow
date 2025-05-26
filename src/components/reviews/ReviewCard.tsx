import React from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  rating: number;
  date: string;
  verified: boolean;
  content: string;
  photoUrl?: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  name,
  rating,
  date,
  verified,
  content,
  photoUrl,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xl font-semibold">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              {verified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Verified User
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="text-gray-600 leading-relaxed">{content}</p>
    </div>
  );
};

export default ReviewCard;