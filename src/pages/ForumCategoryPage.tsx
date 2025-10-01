import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Eye, ThumbsUp, Pin, CheckCircle } from 'lucide-react';
import { forumThreads } from '../data/community';
import { Badge } from '../components/ui/Badge';

const ForumCategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'replies'>('recent');

  // Convert slug back to category name
  const categoryName = categorySlug
    ?.split('-')
    .map(word => {
      // Handle 'ai' specially to keep it uppercase
      if (word.toLowerCase() === 'ai') return 'AI';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');

  // Filter threads by category
  const categoryThreads = forumThreads.filter(
    thread => thread.category === categoryName
  );

  // Sort threads
  const sortedThreads = [...categoryThreads].sort((a, b) => {
    if (sortBy === 'popular') return b.likes - a.likes;
    if (sortBy === 'replies') return b.replies - a.replies;
    // Default: sort by recent (pinned first, then by created date)
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/forum"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Forum
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{categoryName}</h1>
        <p className="text-lg text-gray-600">
          {categoryThreads.length} discussions in this category
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="replies">Most Replies</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
          New Discussion
        </button>
      </div>

      {/* Thread List */}
      <div className="space-y-4">
        {sortedThreads.map((thread) => (
          <Link
            key={thread.id}
            to={`/forum/thread/${thread.id}`}
            className="block bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              {/* Author Avatar */}
              <img
                src={thread.authorAvatar}
                alt={thread.author}
                className="w-12 h-12 rounded-full flex-shrink-0"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {thread.isPinned && (
                        <Pin className="h-4 w-4 text-blue-600" />
                      )}
                      {thread.isSolved && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                        {thread.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {thread.content}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">
                        {thread.author}
                      </span>
                      <span>•</span>
                      <span>{formatDate(thread.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {thread.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{thread.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{thread.replies} replies</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{thread.likes} likes</span>
                  </div>
                  <div className="ml-auto text-xs">
                    Last activity: {thread.lastActivity}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {sortedThreads.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No discussions yet
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first to start a discussion in this category
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Start Discussion
          </button>
        </div>
      )}
    </div>
  );
};

export default ForumCategoryPage;
