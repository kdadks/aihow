import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, MessageCircle, Share, Flag, CheckCircle } from 'lucide-react';
import { forumThreads } from '../data/community';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const ForumThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const thread = forumThreads.find(t => t.id === threadId);

  const [replyText, setReplyText] = useState('');

  if (!thread) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thread Not Found</h1>
        <p className="text-gray-600 mb-6">
          The discussion thread you're looking for doesn't exist.
        </p>
        <Link to="/forum">
          <Button>Back to Forum</Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement reply submission
    console.log('Reply:', replyText);
    setReplyText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to={`/forum/${thread.category.toLowerCase().replace(/\s+/g, '-')}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to {thread.category}
      </Link>

      {/* Original Post */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {thread.isPinned && (
                <Badge variant="primary" className="text-xs">
                  Pinned
                </Badge>
              )}
              {thread.isSolved && (
                <Badge variant="success" className="text-xs flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Solved
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {thread.category}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-1" />
                {thread.replies}
              </span>
              <span className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {thread.likes}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{thread.title}</h1>

          {/* Author Info */}
          <div className="flex items-center space-x-3 mb-6">
            <img
              src={thread.authorAvatar}
              alt={thread.author}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-900">{thread.author}</div>
              <div className="text-sm text-gray-500">
                Posted {formatDate(thread.createdAt)}
              </div>
            </div>
          </div>

          {/* Thread Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed">{thread.content}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {thread.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <ThumbsUp className="h-5 w-5" />
              <span className="text-sm font-medium">Like</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
              <Share className="h-5 w-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors">
              <Flag className="h-5 w-5" />
              <span className="text-sm font-medium">Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Responses */}
      {thread.responses && thread.responses.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {thread.responses.length} {thread.responses.length === 1 ? 'Response' : 'Responses'}
          </h2>

          <div className="space-y-4">
            {thread.responses.map((response) => (
              <div
                key={response.id}
                className={`bg-white rounded-lg shadow-sm border ${
                  response.isAccepted ? 'border-green-500' : 'border-gray-200'
                } p-6`}
              >
                {response.isAccepted && (
                  <div className="flex items-center text-green-600 text-sm font-medium mb-3">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accepted Answer
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-start space-x-3 mb-4">
                  <img
                    src={response.authorAvatar}
                    alt={response.author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {response.author}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(response.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Content */}
                <div className="prose max-w-none mb-4">
                  <p className="text-gray-700 leading-relaxed">{response.content}</p>
                </div>

                {/* Response Actions */}
                <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors text-sm">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{response.likes}</span>
                  </button>
                  <button className="text-sm text-gray-600 hover:text-blue-600">
                    Reply
                  </button>
                  <button className="text-sm text-gray-600 hover:text-red-600">
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Your Reply</h3>
        <form onSubmit={handleSubmitReply}>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Share your thoughts, insights, or questions..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={6}
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Please be respectful and follow our community guidelines
            </p>
            <Button type="submit" disabled={!replyText.trim()}>
              Post Reply
            </Button>
          </div>
        </form>
      </div>

      {/* Related Threads */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          More from {thread.category}
        </h3>
        <div className="space-y-3">
          {forumThreads
            .filter(t => t.category === thread.category && t.id !== thread.id)
            .slice(0, 3)
            .map(relatedThread => (
              <Link
                key={relatedThread.id}
                to={`/forum/thread/${relatedThread.id}`}
                className="block p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium text-gray-900 hover:text-blue-600 mb-1">
                  {relatedThread.title}
                </h4>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{relatedThread.replies} replies</span>
                  <span>•</span>
                  <span>{relatedThread.views} views</span>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ForumThreadPage;
