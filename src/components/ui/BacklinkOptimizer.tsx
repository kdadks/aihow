import React, { useState, useEffect } from 'react';
import { Link, ExternalLink, Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import BacklinkStrategy, { LinkBuildingOpportunity } from '../../utils/backlinkStrategy';

interface BacklinkOptimizerProps {
  content: string;
  currentUrl: string;
}

export const BacklinkOptimizer: React.FC<BacklinkOptimizerProps> = ({
  content,
  currentUrl
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [internalLinks, setInternalLinks] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<LinkBuildingOpportunity[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'links' | 'opportunities'>('analysis');

  useEffect(() => {
    // Analyze content for backlink potential
    const contentAnalysis = BacklinkStrategy.analyzeContentForLinkBuilding(content);
    setAnalysis(contentAnalysis);

    // Generate internal linking suggestions
    const linkSuggestions = BacklinkStrategy.generateInternalLinkSuggestions(content, currentUrl);
    setInternalLinks(linkSuggestions);

    // Set opportunities
    setOpportunities(contentAnalysis.opportunities);
  }, [content, currentUrl]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <TrendingUp className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Backlink Optimizer</h3>
            <p className="text-sm text-gray-600">Improve your content's link-building potential</p>
          </div>
          <div className="flex items-center space-x-2">
            {getScoreIcon(analysis.score)}
            <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
              {analysis.score}/100
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'analysis', label: 'Content Analysis', count: analysis.suggestions.length },
            { id: 'links', label: 'Internal Links', count: internalLinks.length },
            { id: 'opportunities', label: 'Link Opportunities', count: opportunities.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Content Analysis Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Strengths</span>
                </div>
                <ul className="mt-2 text-sm text-green-700 space-y-1">
                  {analysis.score >= 80 && <li>• High-quality, comprehensive content</li>}
                  {content.length > 2000 && <li>• Substantial content length</li>}
                  {(content.includes('study') || content.includes('research')) && <li>• Includes research/data</li>}
                  {(content.includes('how to') || content.includes('guide')) && <li>• Actionable content</li>}
                </ul>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">Areas for Improvement</span>
                </div>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                  {analysis.suggestions.map((suggestion: string, index: number) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Internal Linking Suggestions</h4>
            {internalLinks.length === 0 ? (
              <p className="text-gray-600">No internal linking opportunities found for this content.</p>
            ) : (
              <div className="space-y-3">
                {internalLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Link className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">"{link.anchorText}"</p>
                        <p className="text-xs text-gray-600">{link.context}</p>
                      </div>
                    </div>
                    <a
                      href={link.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Link Building Opportunities</h4>
            {opportunities.length === 0 ? (
              <p className="text-gray-600">Improve content score to unlock link building opportunities.</p>
            ) : (
              <div className="space-y-3">
                {opportunities.map((opportunity, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {opportunity.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        opportunity.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        opportunity.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {opportunity.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{opportunity.opportunity}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        Potential Value: {opportunity.potentialValue}/10
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Learn More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BacklinkOptimizer;
