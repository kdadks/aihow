import React, { useState } from 'react';
import { AssessmentForm } from '../components/recommendation/AssessmentForm';
import { RecommendationResults } from '../components/recommendation/RecommendationResults';
import { Recommendation } from '../types';
import { SEOHead } from '../components/SEOHead';

const RecommendationPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);

  const handleRecommendationComplete = (results: Recommendation[]) => {
    setRecommendations(results);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetRecommendations = () => {
    setRecommendations(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Tool Finder',
    description: 'Personalized AI tool recommendation system based on your workflow needs',
    url: 'https://how2doai.com/tool-finder',
    applicationCategory: 'BusinessApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <>
      <SEOHead
        title="AI Tool Finder - Get Personalized AI Tool Recommendations"
        description="Find the perfect AI tools for your workflow. Get personalized recommendations based on your needs, budget, and preferences. Free AI tool finder and matching service."
        keywords={['AI tool finder', 'AI tool recommendations', 'find AI tools', 'AI tool matcher', 'personalized AI recommendations', 'best AI tools for me']}
        canonicalUrl="https://how2doai.com/tool-finder"
        structuredData={structuredData}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {!recommendations ? (
        <>
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Find Your Perfect AI Tools</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Answer a few questions about your needs and preferences, and we'll recommend the best AI tools for you.
            </p>
          </div>
          <AssessmentForm onComplete={handleRecommendationComplete} />
        </>
      ) : (
        <RecommendationResults 
          recommendations={recommendations} 
          onReset={resetRecommendations} 
        />
      )}
    </div>
    </>
  );
};

export default RecommendationPage;