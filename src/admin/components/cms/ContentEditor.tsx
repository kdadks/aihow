import React, { useState, useCallback } from 'react';
import { useContentManagement } from '../../hooks/useContentManagement';
import { ContentItem, ContentMetadata } from '../../types/cms';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';

interface ContentEditorProps {
  contentId?: string;
  type: ContentItem['type'];
  onSave?: () => void;
}

export default function ContentEditor({ contentId, type, onSave }: ContentEditorProps) {
  const {
    content: existingContent,
    loading,
    error,
    fetchContent,
    createContent,
    updateContent,
    createVersion,
    generatePreview
  } = useContentManagement();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<ContentMetadata>({
    description: '',
    keywords: [],
    template: '',
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (contentId) {
      fetchContent(type).then(() => {
        const item = existingContent.find(c => c.id === contentId);
        if (item) {
          setTitle(item.title);
          setContent(item.content);
          setMetadata({
            description: item.metadata.description || '',
            keywords: item.metadata.keywords || [],
            template: item.metadata.template || '',
            ...item.metadata
          });
        }
      });
    }
  }, [contentId, type, fetchContent, existingContent]);

  const handleSave = async (publish: boolean = false) => {
    try {
      setIsSaving(true);
      const contentData = {
        type,
        title,
        content,
        metadata,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        published: publish
      };

      if (contentId) {
        await updateContent(contentId, contentData);
        if (!publish) {
          await createVersion(contentId, {
            content,
            createdBy: 'current-user', // Replace with actual user ID
            published: false,
            createdAt: new Date()
          });
        }
      } else {
        await createContent(contentData);
      }

      onSave?.();
    } catch (err) {
      console.error('Error saving content:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePreview = useCallback(async () => {
    if (!isPreview && contentId) {
      await generatePreview(contentId);
    }
    setIsPreview(!isPreview);
  }, [isPreview, contentId, generatePreview]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Card className="p-4 text-red-600">
        Error: {error}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          {contentId ? 'Edit Content' : 'Create New Content'}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={togglePreview}
          >
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleSave(false)}
            disabled={isSaving}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave(true)}
            disabled={isSaving}
          >
            {isSaving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {!isPreview ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (Markdown supported)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Enter content using Markdown..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={metadata.description || ''}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={(metadata.keywords || []).join(', ')}
                onChange={(e) => setMetadata({
                  ...metadata,
                  keywords: e.target.value.split(',').map(k => k.trim())
                })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter keywords..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template
              </label>
              <input
                type="text"
                value={metadata.template || ''}
                onChange={(e) => setMetadata({ ...metadata, template: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter template..."
              />
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-4">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <div className="prose max-w-none">
            {/* Add markdown rendering here */}
            {content}
          </div>
        </Card>
      )}
    </div>
  );
}