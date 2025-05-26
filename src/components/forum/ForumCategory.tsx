import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ForumCategoryProps {
  title: string;
  description: string;
  topicCount: number;
  lastPost: {
    title: string;
    author: string;
    date: string;
  };
}

export const ForumCategory: React.FC<ForumCategoryProps> = ({
  title,
  description,
  topicCount,
  lastPost,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <Link
              to={`/forum/${title.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600"
            >
              {title}
            </Link>
          </div>
          <p className="mt-2 text-gray-600">{description}</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-gray-500">{topicCount} topics</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Latest:</span>
          <div className="flex items-center space-x-2">
            <Link
              to={`/forum/topic/${lastPost.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-blue-600 hover:underline"
            >
              {lastPost.title}
            </Link>
            <span className="text-gray-400">by</span>
            <span className="text-gray-700">{lastPost.author}</span>
            <span className="text-gray-400">{lastPost.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumCategory;