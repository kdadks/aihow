import React from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            <span className="block">Find the perfect</span>
            <span className="block text-blue-600">AI tools for your workflow</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Discover, compare, and integrate the best AI tools to enhance your productivity and creative potential.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link to="/directory">
              <Button size="lg" rightIcon={<Search className="h-5 w-5" />}>
                Explore Tools
              </Button>
            </Link>
            <Link to="/recommendation">
              <Button size="lg" variant="secondary" rightIcon={<Sparkles className="h-5 w-5" />}>
                Get Recommendations
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="flex-1 text-center sm:text-left mb-6 sm:mb-0 sm:mr-8">
                <h2 className="text-2xl font-bold text-gray-900">Not sure where to start?</h2>
                <p className="mt-2 text-gray-600">
                  Answer a few questions about your needs and we'll recommend the perfect AI tools for you.
                </p>
                <Link to="/recommendation" className="mt-4 inline-flex items-center text-blue-600 font-medium hover:text-blue-800">
                  Take the assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
                <Sparkles className="h-16 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};