import React from 'react';
import { ForumCategory } from '../components/forum/ForumCategory';
import { Shield } from 'lucide-react';
import { forumCategories } from '../data/community';

const ForumPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Community Forum
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Join discussions about AI tools, share your experiences, and learn from other community members.
        </p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            New Discussion
          </button>
          <div className="relative">
            <input
              type="search"
              placeholder="Search discussions..."
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4" />
          <span>Community Guidelines</span>
        </div>
      </div>

      <div className="grid gap-6">
        {forumCategories.map((category, index) => (
          <ForumCategory key={index} {...category} />
        ))}
      </div>

      <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Moderation Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Report Management</h3>
            <p className="text-sm text-gray-600 mt-1">Handle community reports and violations</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">Content Filters</h3>
            <p className="text-sm text-gray-600 mt-1">Manage automated content filtering rules</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900">User Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage user roles and permissions</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Please follow our community guidelines and be respectful to other members.
        </p>
      </div>
    </div>
  );
};

export default ForumPage;