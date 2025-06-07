import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Eye, Plus, Star } from 'lucide-react';
import { useAuth } from '../auth/hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { WriteArticleForm } from '../components/blog/WriteArticleForm';

interface UserReview {
  id: string;
  rating: number;
  review_text: string;
  status: string;
  created_at: string;
  updated_at: string;
  tools: {
    id: string;
    name: string;
  };
}

interface UserArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

const MyContentPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'reviews' | 'articles'>('reviews');
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [articles, setArticles] = useState<UserArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<UserArticle | null>(null);
  const [showWriteForm, setShowWriteForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserContent();
    }
  }, [user]);

  const fetchUserContent = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch user reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('tool_reviews')
        .select(`
          id,
          rating,
          review_text,
          status,
          created_at,
          updated_at,
          tools(id, name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch user articles
      const { data: articlesData, error: articlesError } = await supabase
        .from('blog_posts')
        .select('id, title, excerpt, content, status, created_at, updated_at, published_at')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      setReviews((reviewsData || []).map(review => ({
        ...review,
        tools: Array.isArray(review.tools) ? review.tools[0] : review.tools
      })));
      setArticles(articlesData || []);
    } catch (error) {
      console.error('Error fetching user content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('tool_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handleEditArticle = (article: UserArticle) => {
    setEditingArticle(article);
    setShowWriteForm(true);
  };

  const handleArticleUpdated = () => {
    setEditingArticle(null);
    setShowWriteForm(false);
    fetchUserContent();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      archived: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors] || colors.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Content</h1>
          <p className="text-gray-600">
            Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to view your content.
          </p>
        </div>
      </div>
    );
  }

  if (showWriteForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button 
          onClick={() => {
            setShowWriteForm(false);
            setEditingArticle(null);
          }} 
          variant="outline" 
          className="mb-6"
        >
          ← Back to My Content
        </Button>
        <WriteArticleForm 
          editingArticle={editingArticle}
          onArticleSubmitted={handleArticleUpdated}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Content</h1>
        <p className="text-gray-600">Manage your reviews and articles</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            activeTab === 'reviews'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 text-sm font-medium rounded-lg ${
            activeTab === 'articles'
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Articles ({articles.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your content...</p>
        </div>
      ) : (
        <>
          {activeTab === 'reviews' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Reviews</h2>
                <Button onClick={() => window.location.href = '/directory'}>
                  <Plus className="w-4 h-4 mr-2" />
                  Write New Review
                </Button>
              </div>

              {reviews.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-600 mb-4">You haven't written any reviews yet.</p>
                  <Button onClick={() => window.location.href = '/directory'}>
                    Browse Tools to Review
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">
                              {review.tools.name}
                            </h3>
                            <div className="flex items-center mr-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            {getStatusBadge(review.status)}
                          </div>
                          <p className="text-gray-700 mb-3">{review.review_text}</p>
                          <p className="text-sm text-gray-500">
                            Created: {formatDate(review.created_at)}
                            {review.updated_at !== review.created_at && (
                              <> • Updated: {formatDate(review.updated_at)}</>
                            )}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.location.href = `/tools/${review.tools.id}`}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReview(review.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'articles' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Articles</h2>
                <Button onClick={() => setShowWriteForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Write New Article
                </Button>
              </div>

              {articles.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-600 mb-4">You haven't written any articles yet.</p>
                  <Button onClick={() => setShowWriteForm(true)}>
                    Write Your First Article
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <Card key={article.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mr-3">
                              {article.title}
                            </h3>
                            {getStatusBadge(article.status)}
                          </div>
                          {article.excerpt && (
                            <p className="text-gray-700 mb-3">{article.excerpt}</p>
                          )}
                          <p className="text-sm text-gray-500">
                            Created: {formatDate(article.created_at)}
                            {article.published_at && (
                              <> • Published: {formatDate(article.published_at)}</>
                            )}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditArticle(article)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyContentPage;