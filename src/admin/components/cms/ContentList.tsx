import React from 'react';
import { useContentManagement } from '../../hooks/useContentManagement';
import { ContentItem } from '../../types/cms';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';

interface ContentListProps {
  onEdit: (content: ContentItem) => void;
  onCreateNew: (type: ContentItem['type']) => void;
}

const CONTENT_TYPES: ContentItem['type'][] = [
  'page',
  'layout',
  'menu',
  'tool',
  'header',
  'footer'
];

export default function ContentList({ onEdit, onCreateNew }: ContentListProps) {
  const { content, loading, error, fetchContent } = useContentManagement();

  React.useEffect(() => {
    fetchContent();
  }, [fetchContent]);

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

  const groupedContent = content.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<ContentItem['type'], ContentItem[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {CONTENT_TYPES.map(type => (
          <Button
            key={type}
            variant="outline"
            onClick={() => onCreateNew(type)}
          >
            New {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {CONTENT_TYPES.map(type => {
        const items = groupedContent[type] || [];
        if (items.length === 0) return null;

        return (
          <div key={type} className="space-y-2">
            <h3 className="text-lg font-semibold capitalize">
              {type}s
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map(item => (
                <button
                  key={item.id}
                  className="text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                  onClick={() => onEdit(item)}
                >
                  <Card className="p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.metadata.description || 'No description'}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        item.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.published ? 'Published' : 'Draft'}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      Last updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {content.length === 0 && (
        <Card className="p-8 text-center text-gray-500">
          <p className="text-lg">No content found</p>
          <p className="mt-2">Create new content using the buttons above</p>
        </Card>
      )}
    </div>
  );
}