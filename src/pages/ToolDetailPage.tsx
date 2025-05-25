import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { tools } from '../data/tools';
import { reviews } from '../data/reviews';
import { categories } from '../data/categories';
import { ArrowLeft, Star, ExternalLink, ThumbsUp, ThumbsDown, Save, Share, MessageSquare, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const ToolDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = tools.find(t => t.slug === slug);
  
  if (!tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tool Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">We couldn't find the tool you're looking for.</p>
        <Link to="/directory">
          <Button>Return to Directory</Button>
        </Link>
      </div>
    );
  }

  const category = categories.find(c => c.id === tool.categoryId);
  const subcategories = tool.subcategoryIds.map(
    subId => category?.subcategories.find(s => s.id === subId)
  ).filter(Boolean);
  
  const toolReviews = reviews.filter(r => r.toolId === tool.id);
  
  // Find similar tools (same category or subcategory)
  const similarTools = tools
    .filter(t => t.id !== tool.id && 
      (t.categoryId === tool.categoryId || 
       t.subcategoryIds.some(s => tool.subcategoryIds.includes(s))
      )
    )
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/directory" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="bg-white p-4 rounded-lg shadow-md mr-0 md:mr-8 mb-6 md:mb-0 flex-shrink-0">
              <img src={tool.logo} alt={tool.name} className="h-24 w-24 object-cover rounded-md" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{tool.name}</h1>
              <p className="text-lg text-blue-100 mb-4">{tool.shortDescription}</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{tool.rating}</span>
                  <span className="ml-1 text-sm">({tool.reviewCount} reviews)</span>
                </div>
                {category && (
                  <Badge variant="primary" className="capitalize bg-white bg-opacity-20">
                    {category.name}
                  </Badge>
                )}
                {tool.trending && (
                  <Badge variant="primary" className="bg-purple-700">Trending</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Column */}
            <div className="flex-1">
              {/* Overview Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-700 mb-6">
                  {tool.description}
                </p>
                
                {/* Quick Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Pricing</h3>
                    <p className="text-gray-700">
                      <span className="font-semibold">{tool.pricing.type.charAt(0).toUpperCase() + tool.pricing.type.slice(1)}</span>
                      {tool.pricing.startingPrice && ` - Starting at ${tool.pricing.startingPrice}`}
                      {tool.pricing.hasFreeOption && ', free option available'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Last Verified</h3>
                    <p className="text-gray-700">
                      {tool.lastVerified ? new Date(tool.lastVerified).toLocaleDateString() : 'Not verified yet'}
                    </p>
                  </div>
                  {subcategories.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Subcategories</h3>
                      <div className="flex flex-wrap gap-2">
                        {subcategories.map(subcategory => subcategory && (
                          <Badge key={subcategory.id} variant="outline" className="capitalize">
                            {subcategory.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {tool.integrations && tool.integrations.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Integrations</h3>
                      <div className="flex flex-wrap gap-2">
                        {tool.integrations.map((integration, i) => (
                          <Badge key={i} variant="outline">
                            {integration}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Features Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                <ul className="space-y-3">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Limitations Section */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitations</h2>
                <ul className="space-y-3">
                  {tool.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-yellow-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-gray-700">{limitation}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Reviews Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                  <Button variant="outline" leftIcon={<MessageSquare className="h-4 w-4" />}>
                    Write a Review
                  </Button>
                </div>
                
                {toolReviews.length > 0 ? (
                  <div className="space-y-6">
                    {toolReviews.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <img 
                              src={review.userAvatar} 
                              alt={review.userName} 
                              className="h-10 w-10 rounded-full mr-3" 
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{review.userName}</h4>
                              <div className="flex items-center mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          {review.verified && (
                            <Badge variant="success" className="text-xs">Verified Purchase</Badge>
                          )}
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                        <div className="mt-3 flex items-center space-x-4">
                          <button className="flex items-center text-gray-500 text-sm hover:text-gray-700">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful ({review.upvotes})
                          </button>
                          <button className="flex items-center text-gray-500 text-sm hover:text-gray-700">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            Not Helpful
                          </button>
                          <button className="flex items-center text-gray-500 text-sm hover:text-gray-700">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center bg-gray-50 py-10 rounded-lg">
                    <p className="text-gray-500 mb-4">No reviews yet for this tool</p>
                    <Button variant="outline" leftIcon={<MessageSquare className="h-4 w-4" />}>
                      Be the first to review
                    </Button>
                  </div>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-24">
                {/* Action Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                  <a href={tool.website} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button fullWidth rightIcon={<ExternalLink className="h-4 w-4" />}>
                      Visit Website
                    </Button>
                  </a>
                  <Button variant="outline" fullWidth className="mt-3" leftIcon={<Save className="h-4 w-4" />}>
                    Save to Collection
                  </Button>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-2">Share this tool</h4>
                    <div className="flex space-x-3">
                      <button className="text-gray-400 hover:text-blue-600">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-blue-800">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-blue-700">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1 15h-2v-6h2v6zm-1-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 7h-2v-3.25c0-.69-.56-1.25-1.25-1.25S11 12.31 11 13v3H9V9h2v1.5c.46-.69 1.25-1.25 2-1.25 1.38 0 2.5 1.12 2.5 2.5V17z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Similar Tools */}
                {similarTools.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Similar Tools</h3>
                    <div className="space-y-4">
                      {similarTools.map(similarTool => (
                        <Link 
                          key={similarTool.id} 
                          to={`/tool/${similarTool.slug}`}
                          className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                        >
                          <div className="h-10 w-10 rounded overflow-hidden mr-3">
                            <img src={similarTool.logo} alt={similarTool.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{similarTool.name}</h4>
                            <div className="flex items-center mt-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-500 ml-1">
                                {similarTool.rating} ({similarTool.reviewCount})
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;