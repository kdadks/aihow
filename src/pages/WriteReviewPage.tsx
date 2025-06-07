import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { WriteReviewForm } from '../components/reviews/WriteReviewForm';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';

interface Tool {
  id: string;
  name: string;
  description: string;
}

const WriteReviewPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toolId = searchParams.get('toolId');

  useEffect(() => {
    if (toolId) {
      fetchTool(toolId);
    } else {
      setError('No tool specified');
      setLoading(false);
    }
  }, [toolId]);

  const fetchTool = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('id, name, description')
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        setError('Tool not found');
      } else {
        setTool(data);
      }
    } catch (err) {
      setError('Failed to load tool information');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    // Navigate back to tool detail page after successful submission
    navigate(`/tools/${tool?.id}`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tool information...</p>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Tool not found'}</p>
          <Button onClick={() => navigate('/directory')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

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
            Write a Review
          </h1>
          <p className="text-gray-600">
            Share your experience with <span className="font-semibold">{tool.name}</span>
          </p>
        </div>
      </div>

      {tool.description && (
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">About {tool.name}</h2>
          <p className="text-gray-700">{tool.description}</p>
        </div>
      )}

      <WriteReviewForm
        toolId={tool.id}
        toolName={tool.name}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
};

export default WriteReviewPage;