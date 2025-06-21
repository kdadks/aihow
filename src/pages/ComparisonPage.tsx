import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast, Toast } from 'react-hot-toast';
import { useComparisonStore } from '../stores/comparisonStore';
import { ComparisonGridWithErrorBoundary } from '../components/comparison/ComparisonGrid';
import { Button, Loading } from '../components/ui';
import { Plus, ArrowLeft, Zap, BarChart3 } from 'lucide-react';

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
  }, [selectedTools.length, navigate, isLoading]);

  return (
    <>
      <Helmet>
        <title>Compare AI Tools | AIHow</title>
        <meta name="description" content="Compare AI tools side by side to find the best match for your needs. Compare features, pricing, and capabilities." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Contextual Internal Links */}
        {selectedTools.length > 0 && (
          <div className="mb-6 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Explore More About Compared Tools:</h2>
            {selectedTools.map(tool => (
              <div key={tool.id} className="space-x-3">
                <a
                  href={`/tools/${tool.slug}`}
                  className="text-blue-700 underline font-semibold"
                >
                  {tool.name} full feature overview
                </a>
                <a
                  href={`/reviews`}
                  className="text-blue-700 underline font-semibold"
                >
                  Read user reviews of {tool.name}
                </a>
                <a
                  href={`/blog`}
                  className="text-blue-700 underline font-semibold"
                >
                  Articles about {tool.name}
                </a>
              </div>
            ))}
          </div>
        )}
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <a href="/" className="text-gray-500 hover:text-gray-700 transition-colors">Home</a>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">Compare Tools</li>
          </ol>
        </nav>

        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Compare AI Tools</h1>
              </div>
              <p className="text-lg text-gray-600 mb-4">
                Compare up to 4 tools side by side to find the perfect match for your needs
              </p>
              
              {selectedTools.length > 0 && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-green-500" />
                    <span>{selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <span>Maximum 4 tools allowed</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/directory')}
                disabled={selectedTools.length >= 4}
                leftIcon={<Plus className="h-4 w-4" />}
                className="min-w-32"
              >
                {selectedTools.length >= 4 ? 'Max Reached' : 'Add Tool'}
              </Button>
              <Button
                variant="ghost"
                onClick={clearTools}
                disabled={selectedTools.length === 0}
                className="min-w-32"
              >
                Clear All ({selectedTools.length})
              </Button>
            </div>
          </div>
          
          {/* Progress indicator */}
          {selectedTools.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Tools selected</span>
                <span>{selectedTools.length}/4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(selectedTools.length / 4) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
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

        {/* Enhanced Empty State */}
        {selectedTools.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="mx-auto w-64 h-48 mb-8">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                <defs>
                  <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dbeafe" />
                    <stop offset="100%" stopColor="#bfdbfe" />
                  </linearGradient>
                </defs>
                <rect width="400" height="300" fill="url(#bg)" rx="20" />
                <rect x="50" y="50" width="100" height="80" fill="#3b82f6" rx="8" opacity="0.8" />
                <rect x="170" y="50" width="100" height="80" fill="#60a5fa" rx="8" opacity="0.6" />
                <rect x="290" y="50" width="60" height="80" fill="#93c5fd" rx="8" opacity="0.4" />
                <text x="200" y="180" textAnchor="middle" fill="#1e40af" fontSize="16" fontWeight="bold">
                  Compare Tools
                </text>
                <text x="200" y="200" textAnchor="middle" fill="#3730a3" fontSize="12">
                  Side by Side
                </text>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Compare AI Tools?
            </h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
              Select tools from our comprehensive directory to compare their features, pricing, and capabilities in a clean, organized view.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <Button
                onClick={() => navigate('/directory')}
                leftIcon={<Plus className="h-5 w-5" />}
                size="lg"
              >
                Browse Tools Directory
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/recommendation')}
                size="lg"
              >
                Get AI Recommendations
              </Button>
            </div>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Side-by-Side Analysis</h4>
                <p className="text-gray-600 text-sm">Compare features, pricing, and capabilities across multiple tools in one view</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Smart Filtering</h4>
                <p className="text-gray-600 text-sm">Filter by features, pricing, support options, and certifications</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Export & Share</h4>
                <p className="text-gray-600 text-sm">Save comparisons and export to PDF or CSV for team collaboration</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ComparisonPage;