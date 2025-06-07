import React, { useState, useEffect } from 'react';
import { Save, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface WriteArticleFormProps {
  onArticleSubmitted?: () => void;
  editingArticle?: {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    status: string;
  } | null;
}

export const WriteArticleForm: React.FC<WriteArticleFormProps> = ({
  onArticleSubmitted,
  editingArticle
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(editingArticle?.title || '');
  const [content, setContent] = useState(editingArticle?.content || '');
  const [excerpt, setExcerpt] = useState(editingArticle?.excerpt || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!user) {
      setError('You must be logged in to write an article');
      return;
    }

    if (title.trim().length < 5) {
      setError('Title must be at least 5 characters long');
      return;
    }

    if (content.trim().length < 50) {
      setError('Content must be at least 50 characters long');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const slug = generateSlug(title);
      const autoExcerpt = excerpt.trim() || content.substring(0, 150) + '...';

      const articleData = {
        title: title.trim(),
        slug: editingArticle ? undefined : slug, // Don't update slug when editing
        content: content.trim(),
        excerpt: autoExcerpt,
        author_id: user.id,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null
      };

      let result;
      if (editingArticle) {
        // Update existing article
        result = await supabase
          .from('blog_posts')
          .update(articleData)
          .eq('id', editingArticle.id)
          .eq('author_id', user.id);
      } else {
        // Create new article
        result = await supabase
          .from('blog_posts')
          .insert(articleData);
      }

      if (result.error) {
        throw result.error;
      }

      setSuccess(true);
      if (!editingArticle) {
        setTitle('');
        setContent('');
        setExcerpt('');
        setSelectedCategories([]);
      }
      onArticleSubmitted?.();
    } catch (err: any) {
      if (err.code === '23505') {
        setError('An article with this title already exists. Please choose a different title.');
      } else {
        setError('Failed to save article. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingArticle || !user) return;
    
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', editingArticle.id)
        .eq('author_id', user.id);

      if (error) throw error;

      setSuccess(true);
      onArticleSubmitted?.();
    } catch (err) {
      setError('Failed to delete article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-gray-600 text-center">
          Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to write an article.
        </p>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-green-600 mb-2">✓</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {editingArticle ? 'Article Updated!' : 'Article Submitted!'}
          </h3>
          <p className="text-gray-600">
            {editingArticle 
              ? 'Your article has been updated successfully.'
              : 'Your article has been submitted successfully.'
            }
          </p>
        </div>
      </Card>
    );
  }

  if (previewMode) {
    return (
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Article Preview</h2>
          <Button onClick={() => setPreviewMode(false)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          {excerpt && (
            <p className="text-lg text-gray-600 italic mb-6">{excerpt}</p>
          )}
          <div className="whitespace-pre-wrap text-gray-800">{content}</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingArticle ? 'Edit Article' : 'Write New Article'}
        </h3>
        <div className="flex gap-2">
          <Button onClick={() => setPreviewMode(true)} variant="outline" disabled={!title || !content}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          {editingArticle && (
            <Button onClick={handleDelete} variant="outline" className="text-red-600" disabled={isSubmitting}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            maxLength={255}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief description of your article..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            maxLength={300}
          />
          <div className="text-sm text-gray-500 mt-1">
            {excerpt.length}/300 characters. If empty, will be auto-generated from content.
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article content here..."
            rows={12}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="text-sm text-gray-500 mt-1">
            {content.length} characters
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting || title.trim().length < 5 || content.trim().length < 50}
            variant="outline"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save as Draft'}
          </Button>
          
          <Button
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting || title.trim().length < 5 || content.trim().length < 50}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </Button>
        </div>
      </div>
    </Card>
  );
};