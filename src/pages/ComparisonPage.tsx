import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-hot-toast';
import { useComparisonStore } from '../stores/comparisonStore';
import { NewComparisonGrid } from '../components/comparison/NewComparisonGrid';
import { Button, Loading, Badge, Card } from '../components/ui';
import {
  Plus, X, Star, ExternalLink, Zap, BarChart3,
  Search, Filter, Download, Share2, Save,
  Check, Minus, Info, ArrowRight, Users,
  TrendingUp, Shield, Clock, Globe, Heart
} from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedTools, clearTools, removeTool } = useComparisonStore();

  // Handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Tools Comparison',
          text: `Compare ${selectedTools.map(t => t.name).join(', ')}`,
          url: window.location.href,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Comparison link copied to clipboard!');
    }
  };

  return (
    <>
      <Helmet>
        <title>Compare AI Tools | AIHow</title>
        <meta name="description" content="Compare AI tools side by side to find the best match for your needs. Compare features, pricing, and capabilities." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 lg:py-8">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border p-6 lg:p-8 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Compare AI Tools
                  </h1>
                </div>
                <p className="text-gray-600 text-sm lg:text-base">
                  {selectedTools.length > 0
                    ? `Comparing ${selectedTools.length} tool${selectedTools.length > 1 ? 's' : ''} to help you make the right choice`
                    : 'Find and compare the best AI tools for your needs'
                  }
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate('/directory')}
                  disabled={selectedTools.length >= 4}
                  leftIcon={<Plus className="h-4 w-4" />}
                  size="sm"
                >
                  {selectedTools.length >= 4 ? 'Max Reached' : 'Add Tools'}
                </Button>
                {selectedTools.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      leftIcon={<Share2 className="h-4 w-4" />}
                      size="sm"
                    >
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toast.success('Save feature coming soon!')}
                      leftIcon={<Save className="h-4 w-4" />}
                      size="sm"
                    >
                      Save
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {selectedTools.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Tools selected</span>
                  <span className="font-medium">{selectedTools.length}/4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(selectedTools.length / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          {selectedTools.length === 0 ? (
            <EmptyState onAddTools={() => navigate('/directory')} />
          ) : (
            <div className="space-y-6">
              {/* Use New Comparison Grid - it includes tool cards and comparison */}
              <NewComparisonGrid
                tools={selectedTools}
                onRemoveTool={removeTool}
              />

            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Empty State Component
const EmptyState: React.FC<{ onAddTools: () => void }> = ({ onAddTools }) => (
  <div className="bg-white rounded-xl shadow-sm border p-8 lg:p-12 text-center">
    <div className="max-w-md mx-auto">
      {/* Illustration */}
      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
        <BarChart3 className="h-12 w-12 text-blue-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        Start Your Comparison
      </h3>
      <p className="text-gray-600 mb-8">
        Add AI tools from our directory to compare their features, pricing, and capabilities side by side.
      </p>
      
      <div className="space-y-4">
        <Button
          onClick={onAddTools}
          leftIcon={<Plus className="h-5 w-5" />}
          size="lg"
          className="w-full sm:w-auto"
        >
          Browse AI Tools
        </Button>
        
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span>Up to 4 tools</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>Smart insights</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export results</span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Quick Start Guide */}
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">How it works</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">1</span>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-1">Add Tools</h5>
            <p className="text-sm text-gray-600">Browse our directory and select up to 4 AI tools to compare</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-semibold text-sm">2</span>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-1">Compare</h5>
            <p className="text-sm text-gray-600">View features, pricing, and capabilities side by side</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-semibold text-sm">3</span>
          </div>
          <div>
            <h5 className="font-medium text-gray-900 mb-1">Decide</h5>
            <p className="text-sm text-gray-600">Save, share, or export your comparison to make informed decisions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);


export default ComparisonPage;