import React, { useState } from 'react';
import { AssessmentForm } from '../components/recommendation/AssessmentForm';
import { RecommendationResults } from '../components/recommendation/RecommendationResults';
import { Recommendation } from '../types';

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

  return (
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
  );
};

export default RecommendationPage;