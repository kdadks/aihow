import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { WriteArticleForm } from '../components/blog/WriteArticleForm';
import { Button } from '../components/ui/Button';

const WriteArticlePage: React.FC = () => {
  const navigate = useNavigate();

  const handleArticleSubmitted = () => {
    // Navigate back to blog page after successful submission
    navigate('/blog');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Button 
          onClick={() => navigate(-1)} 
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Write an Article
          </h1>
          <p className="text-gray-600">
            Share your insights about AI tools, workflows, and industry trends
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="font-semibold text-blue-900 mb-2">Writing Guidelines</h2>
        <ul className="text-blue-800 space-y-1 text-sm">
          <li>• Write about AI tools, workflows, comparisons, or industry insights</li>
          <li>• Keep your content informative and helpful to the community</li>
          <li>• Use clear, engaging language and provide practical examples</li>
          <li>• Articles are moderated before publication to ensure quality</li>
        </ul>
      </div>

      <WriteArticleForm onArticleSubmitted={handleArticleSubmitted} />
    </div>
  );
};

export default WriteArticlePage;