import React from 'react';
import { ArrowRight, Search, Sparkles, Scale } from 'lucide-react';
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
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/directory">
              <Button size="lg" variant="outline" className="border-white text:bg-blue-500" rightIcon={<Search className="h-5 w-5" />}>
                Explore Tools
              </Button>
            </Link>
            <Link to="/compare">
              <Button size="lg" variant="secondary" rightIcon={<Scale className="h-5 w-5" />}>
                Compare Tools
              </Button>
            </Link>
            <Link to="/recommendation">
              <Button size="lg" variant="secondary" rightIcon={<Sparkles className="h-5 w-5" />}>
                Get Recommendations
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
          {/* First Card - Compare Tools */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col h-full">
                <div className="flex-shrink-0 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg inline-block">
                    <Scale className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Compare AI Tools</h3>
                <p className="mt-2 text-gray-600 flex-grow">
                  Compare features, pricing, and capabilities of different AI tools to make the best choice for your needs.
                </p>
                <Link to="/compare" className="mt-4 inline-flex items-center text-gray-600 font-medium hover:text-blue-600">
                  Start comparing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Second Card - Get Recommendations */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col h-full">
                <div className="flex-shrink-0 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg inline-block">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Not sure where to start?</h3>
                <p className="mt-2 text-gray-600 flex-grow">
                  Answer a few questions about your needs and we'll recommend the perfect AI tools for you.
                </p>
                <Link to="/recommendation" className="mt-4 inline-flex items-center text-purple-600 font-medium hover:text-purple-800">
                  Take the assessment <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};