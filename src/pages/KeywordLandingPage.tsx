import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getKeywordPage } from '../data/keywordPages';
import { SEOHead } from '../components/SEOHead';
import { ArrowRight, Search, Star, TrendingUp } from 'lucide-react';

export const KeywordLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const keywordPage = slug ? getKeywordPage(slug) : undefined;

  if (!keywordPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <Link to="/" className="text-indigo-600 hover:text-indigo-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: keywordPage.title,
    description: keywordPage.metaDescription,
    url: `https://how2doai.com/${keywordPage.slug}`,
    about: {
      '@type': 'Thing',
      name: keywordPage.keywords[0]
    },
    keywords: keywordPage.keywords.join(', '),
    isPartOf: {
      '@type': 'WebSite',
      name: 'How2doAI',
      url: 'https://how2doai.com'
    }
  };

  return (
    <>
      <SEOHead
        title={keywordPage.title}
        description={keywordPage.metaDescription}
        keywords={keywordPage.keywords}
        canonicalUrl={`https://how2doai.com/${keywordPage.slug}`}
        structuredData={structuredData}
      />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {keywordPage.h1}
              </h1>
              <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
                {keywordPage.content}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/directory"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Browse All Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/tool-finder"
                  className="inline-flex items-center justify-center px-8 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors border-2 border-white"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Your Perfect Tool
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Reviews</h3>
              <p className="text-gray-600">
                Detailed comparisons and ratings from real users and industry experts to help you make informed decisions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Latest Tools</h3>
              <p className="text-gray-600">
                Stay updated with the newest AI tools and platforms, continuously added to our comprehensive directory.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Use our AI-powered tool finder to get personalized recommendations based on your specific needs and workflow.
              </p>
            </div>
          </div>

          {/* Keywords Section */}
          <div className="bg-white rounded-xl p-8 shadow-lg mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Topics & Keywords</h2>
            <div className="flex flex-wrap gap-3">
              {keywordPage.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect AI Tool?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who trust How2doAI to discover and compare the best AI tools for their needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/directory"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Explore AI Tools Directory
              </Link>
              <Link
                to="/forum"
                className="inline-flex items-center justify-center px-8 py-3 bg-indigo-700 text-white rounded-lg font-semibold hover:bg-indigo-800 transition-colors border-2 border-white"
              >
                Join Community Discussions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeywordLandingPage;
