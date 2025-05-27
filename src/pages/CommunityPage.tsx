import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Star, BookOpen, Users } from 'lucide-react';
import { forumCategories, reviews, blogPosts } from '../data/community';

const CommunityPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          How2AI Community
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join our vibrant community of AI enthusiasts. Share experiences, learn from others, and stay updated with the latest in AI tools.
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
            Join discussions about AI tools, share your experiences, and get help from the community.
          </p>
          <div className="space-y-2">
            {forumCategories.slice(0, 2).map((category, index) => (
              <div key={index} className="text-sm text-gray-500">
                • {category.lastPost.title}
              </div>
            ))}
          </div>
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
            Read verified customer reviews and share your own experience with AI tools.
          </p>
          <div className="space-y-2">
            {reviews.slice(0, 2).map((review, index) => (
              <div key={index} className="text-sm text-gray-500">
                • "{review.content.substring(0, 60)}..."
              </div>
            ))}
          </div>
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
            Stay updated with the latest insights, tutorials, and news about AI tools.
          </p>
          <div className="space-y-2">
            {blogPosts.slice(0, 2).map((post, index) => (
              <div key={index} className="text-sm text-gray-500">
                • {post.title}
              </div>
            ))}
          </div>
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
            Discover how organizations are transforming their workflows with AI tools.
          </p>
          <div className="text-sm text-gray-500">
            • Watch video testimonials from our users
            <br />
            • Read detailed case studies
          </div>
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

      {/* CTA Section */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Join Our Community Today
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Share your experiences, learn from others, and be part of the AI tools revolution.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Get Started Free
        </button>
      </div>
    </div>
  );
};

export default CommunityPage;