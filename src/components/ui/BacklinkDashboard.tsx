import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Link,
  ExternalLink,
  AlertTriangle,
  Clock,
  BarChart3
} from 'lucide-react';

interface BacklinkMetrics {
  domainAuthority: number;
  pageAuthority: number;
  totalBacklinks: number;
  uniqueDomains: number;
  newBacklinksThisMonth: number;
  lostBacklinksThisMonth: number;
}

interface BacklinkDashboardProps {
  metrics?: BacklinkMetrics;
  showRecommendations?: boolean;
}

export const BacklinkDashboard: React.FC<BacklinkDashboardProps> = ({
  metrics = {
    domainAuthority: 5,
    pageAuthority: 4,
    totalBacklinks: 150,
    uniqueDomains: 45,
    newBacklinksThisMonth: 12,
    lostBacklinksThisMonth: 3
  },
  showRecommendations = true
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'recommendations'>('overview');

  const getDAColor = (da: number) => {
    if (da >= 20) return 'text-green-600';
    if (da >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const recommendations = [
    {
      priority: 'high',
      title: 'Create Cornerstone Content',
      description: 'Publish 5 comprehensive guides (2,000+ words each)',
      progress: 1,
      target: 5,
      impact: 'High'
    },
    {
      priority: 'high',
      title: 'Guest Posting Campaign',
      description: 'Secure 20+ guest posts on authoritative AI blogs',
      progress: 3,
      target: 20,
      impact: 'High'
    },
    {
      priority: 'medium',
      title: 'Broken Link Building',
      description: 'Find and replace 50+ broken links in your niche',
      progress: 8,
      target: 50,
      impact: 'Medium'
    },
    {
      priority: 'medium',
      title: 'Internal Linking Audit',
      description: 'Optimize internal linking structure across all pages',
      progress: 75,
      target: 100,
      impact: 'Medium'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Backlink Strategy Dashboard</h2>
            <p className="text-sm text-gray-600">Track progress toward DA 20+ and improved rankings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Current DA</p>
              <p className={`text-2xl font-bold ${getDAColor(metrics.domainAuthority)}`}>
                {metrics.domainAuthority}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Target DA</p>
              <p className="text-2xl font-bold text-gray-400">20+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'progress', label: 'Progress' },
            { id: 'recommendations', label: 'Recommendations' }
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
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Domain Authority */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Domain Authority</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.domainAuthority}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${getProgressPercentage(metrics.domainAuthority, 20)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-blue-700 mt-1">Target: 20</p>
              </div>
            </div>

            {/* Total Backlinks */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">Total Backlinks</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.totalBacklinks}</p>
                </div>
                <Link className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-700">+{metrics.newBacklinksThisMonth} this month</span>
              </div>
            </div>

            {/* Unique Domains */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-900">Unique Domains</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.uniqueDomains}</p>
                </div>
                <ExternalLink className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-purple-700 mt-2">Target: 200+</p>
            </div>

            {/* Monthly Change */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-900">Monthly Change</p>
                  <p className="text-2xl font-bold text-orange-600">
                    +{metrics.newBacklinksThisMonth - metrics.lostBacklinksThisMonth}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                <span className="text-red-700">-{metrics.lostBacklinksThisMonth} lost</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Strategy Progress</h3>
            <div className="space-y-4">
              {recommendations.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {item.priority === 'high' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${getProgressPercentage(item.progress, item.target)}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {item.progress}/{item.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recommendations' && showRecommendations && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Actionable Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="font-medium text-red-900">High Priority</h4>
                </div>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Create cornerstone content (2,000+ words)</li>
                  <li>• Launch guest posting campaign</li>
                  <li>• Focus on DA 30+ link acquisition</li>
                  <li>• Improve internal linking structure</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <h4 className="font-medium text-yellow-900">Medium Priority</h4>
                </div>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Implement broken link building</li>
                  <li>• Create resource pages for links</li>
                  <li>• Optimize anchor text diversity</li>
                  <li>• Set up automated monitoring</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-2">
                <Target className="h-5 w-5 text-blue-600 mr-2" />
                <h4 className="font-medium text-blue-900">Next Steps</h4>
              </div>
              <div className="text-sm text-blue-800">
                <p className="mb-2">Focus on quality over quantity:</p>
                <ul className="space-y-1">
                  <li>• Prioritize links from domains with DA 30+</li>
                  <li>• Maintain 70%+ dofollow link profile</li>
                  <li>• Diversify anchor text (50+ variations)</li>
                  <li>• Monitor for unnatural link patterns</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BacklinkDashboard;
