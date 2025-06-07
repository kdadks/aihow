import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Star, BookOpen, Users, PlusCircle, Edit3 } from 'lucide-react';
import { forumCategories, reviews, blogPosts } from '../data/community';
import { useAuth } from '../auth/hooks/useAuth';

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    navigate('/signup');
  };


  // Render different content based on authentication status
  const renderSectionContent = (section: 'forum' | 'reviews' | 'blog' | 'testimonials') => {
    if (!isAuthenticated) {
      return (
        <div className="text-sm text-gray-500">
          {section === 'forum' && forumCategories.slice(0, 2).map((category, index) => (
            <div key={index}>• {category.lastPost.title}</div>
          ))}
          {section === 'reviews' && reviews.slice(0, 2).map((review, index) => (
            <div key={index}>• "{review.content.substring(0, 60)}..."</div>
          ))}
          {section === 'blog' && blogPosts.slice(0, 2).map((post, index) => (
            <div key={index}>• {post.title}</div>
          ))}
          {section === 'testimonials' && (
            <>
              <div>• Watch video testimonials from our users</div>
              <div>• Read detailed case studies</div>
            </>
          )}
        </div>
      );
    }

    // Authenticated user content with enhanced features
    return (
      <div className="space-y-3">
        <div className="text-sm text-gray-500">
          {section === 'forum' && forumCategories.slice(0, 2).map((category, index) => (
            <div key={index}>• {category.lastPost.title}</div>
          ))}
          {section === 'reviews' && reviews.slice(0, 2).map((review, index) => (
            <div key={index}>• "{review.content.substring(0, 60)}..."</div>
          ))}
          {section === 'blog' && blogPosts.slice(0, 2).map((post, index) => (
            <div key={index}>• {post.title}</div>
          ))}
          {section === 'testimonials' && (
            <>
              <div>• Watch video testimonials from our users</div>
              <div>• Read detailed case studies</div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
            <PlusCircle className="w-3 h-3" />
            {section === 'forum' && 'Start Discussion'}
            {section === 'reviews' && 'Write Review'}
            {section === 'blog' && 'Write Article'}
            {section === 'testimonials' && 'Share Story'}
          </button>
          <span className="text-gray-300">|</span>
          <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 font-medium">
            <Edit3 className="w-3 h-3" />
            {section === 'forum' && 'My Posts'}
            {section === 'reviews' && 'My Reviews'}
            {section === 'blog' && 'My Articles'}
            {section === 'testimonials' && 'My Stories'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {isAuthenticated ? 'Welcome back!' : 'How2doAI Community'}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {isAuthenticated
            ? 'Share your insights, engage with fellow AI enthusiasts, and grow your expertise.'
            : 'Join our vibrant community of AI enthusiasts. Share experiences, learn from others, and stay updated with the latest in AI tools.'
          }
        </p>
      </div>

      {/* Community Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Forum Section */}
        <Link 
          to="/forum"
          className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600">
              Discussion Forum
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {isAuthenticated
              ? 'Start discussions, share insights, and get help from the community.'
              : 'Join discussions about AI tools, share your experiences, and get help from the community.'
            }
          </p>
          {renderSectionContent('forum')}
        </Link>

        {/* Reviews Section */}
        <Link 
          to="/reviews"
          className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Star className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600">
              User Reviews
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {isAuthenticated
              ? 'Write detailed reviews and read insights from verified users.'
              : 'Read verified customer reviews and share your own experience with AI tools.'
            }
          </p>
          {renderSectionContent('reviews')}
        </Link>

        {/* Blog Section */}
        <Link 
          to="/blog"
          className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600">
              Blog Articles
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {isAuthenticated
              ? 'Write articles, share tutorials, and contribute to our knowledge base.'
              : 'Stay updated with the latest insights, tutorials, and news about AI tools.'
            }
          </p>
          {renderSectionContent('blog')}
        </Link>

        {/* Testimonials Section */}
        <Link 
          to="/testimonials"
          className="group bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-blue-600">
              Success Stories
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {isAuthenticated
              ? 'Share your success story and inspire others in their AI journey.'
              : 'Discover how organizations are transforming their workflows with AI tools.'
            }
          </p>
          {renderSectionContent('testimonials')}
        </Link>
      </div>

      {/* Community Stats */}
      <div className="bg-gray-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Growing Community</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">1,000+</div>
            <div className="text-gray-600">Active Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{forumCategories.reduce((acc, cat) => acc + cat.topicCount, 0)}+</div>
            <div className="text-gray-600">Discussion Topics</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{reviews.length}+</div>
            <div className="text-gray-600">Tool Reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{blogPosts.length}+</div>
            <div className="text-gray-600">Blog Articles</div>
          </div>
        </div>
      </div>

      {/* CTA Section - Different content for authenticated vs non-authenticated users */}
      {!isAuthenticated ? (
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Community Today
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Share your experiences, learn from others, and be part of the AI tools revolution.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Get Started Free
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Contribute?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your insights matter! Start sharing your expertise and help fellow AI enthusiasts succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/forum"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              Start a Discussion
            </Link>
            <Link
              to="/reviews"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
            >
              Write a Review
            </Link>
            <Link
              to="/blog"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
            >
              Share an Article
            </Link>
            <Link
              to="/dashboard"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;