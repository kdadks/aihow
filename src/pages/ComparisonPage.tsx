import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast, Toast } from 'react-hot-toast';
import { Tool } from '../types';
import { useComparisonStore } from '../stores/comparisonStore';
import { ComparisonGridWithErrorBoundary } from '../components/comparison/ComparisonGrid';
import { Button, Loading } from '../components/ui';
import { Plus } from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { selectedTools, clearTools, removeTool } = useComparisonStore();

  useEffect(() => {
    const abortController = new AbortController();
    const loadingTimer = setTimeout(() => {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
      }
    }, 1000);

    return () => {
      abortController.abort();
      clearTimeout(loadingTimer);
    };
  }, []);

  useEffect(() => {
    // Show welcome message if user comes directly to comparison page
    if (selectedTools.length === 0 && !isLoading) {
      const controller = new AbortController();
      const redirectTimer = setTimeout(() => {
        if (!controller.signal.aborted) {
          navigate('/directory', { state: { showComparisonPrompt: true } });
        }
      }, 5000);

      // Show welcome toast
      const toastId = toast((t: Toast) => (
        <div>
          <p className="font-medium mb-1">Welcome to Tool Comparison!</p>
          <p className="text-sm text-gray-600">Select tools from our directory to start comparing.</p>
          <div className="mt-2">
            <Button
              size="sm"
              onClick={() => {
                controller.abort();
                navigate('/directory', { state: { showComparisonPrompt: true } });
              }}
            >
              Browse Directory Now
            </Button>
          </div>
        </div>
      ), {
        duration: 5000,
      });

      return () => {
        controller.abort();
        clearTimeout(redirectTimer);
        toast.dismiss(toastId);
      };
    }
  }, [selectedTools.length, navigate]);

  return (
    <>
      <Helmet>
        <title>Compare AI Tools | AIHow</title>
        <meta name="description" content="Compare AI tools side by side to find the best match for your needs. Compare features, pricing, and capabilities." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Compare Tools</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Compare AI Tools</h1>
              <p className="mt-2 text-gray-600">
                Compare up to 4 tools side by side to find the best match for your needs
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/directory')}
                disabled={selectedTools.length >= 4}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Tool
              </Button>
              <Button
                variant="ghost"
                onClick={clearTools}
                disabled={selectedTools.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Comparison Content */}
        {isLoading ? (
          <div className="py-20">
            <Loading size="lg" className="mx-auto" />
            <p className="text-center mt-4 text-gray-600">Loading comparison data...</p>
          </div>
        ) : (
          selectedTools.length > 0 && (
            <ComparisonGridWithErrorBoundary tools={selectedTools} onRemoveTool={removeTool} />
          )
        )}

        {/* Empty State */}
        {selectedTools.length === 0 && (
          <div className="text-center py-12">
            <img
              src="/images/empty-comparison.svg"
              alt="No tools to compare"
              className="mx-auto h-48 mb-6"
            />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No tools selected for comparison
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Browse our directory to select AI tools and compare their features, pricing, and capabilities side by side.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/directory')}>
                Browse Tools Directory
              </Button>
              <Button variant="outline" onClick={() => navigate('/recommendation')}>
                Get Recommendations
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ComparisonPage;