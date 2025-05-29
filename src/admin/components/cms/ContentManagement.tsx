import React, { useState } from 'react';
import { ContentItem } from '../../types/cms';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import ContentEditor from './ContentEditor';
import NavigationEditor from './NavigationEditor';
import ContentList from './ContentList';

type CMSSection = 'list' | 'editor' | 'navigation';

export default function ContentManagement() {
  const [section, setSection] = useState<CMSSection>('list');
  const [selectedContent, setSelectedContent] = useState<{
    id?: string;
    type: ContentItem['type'];
  } | null>(null);

  const renderSection = () => {
    switch (section) {
      case 'editor':
        return (
          <ContentEditor
            contentId={selectedContent?.id}
            type={selectedContent?.type || 'page'}
            onSave={() => {
              setSection('list');
              setSelectedContent(null);
            }}
          />
        );
      case 'navigation':
        return <NavigationEditor />;
      default:
        return (
          <ContentList
            onEdit={(content: ContentItem) => {
              setSelectedContent({
                id: content.id,
                type: content.type
              });
              setSection('editor');
            }}
            onCreateNew={(type: ContentItem['type']) => {
              setSelectedContent({ type });
              setSection('editor');
            }}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="mt-2 text-gray-600">
          Manage your site's content, navigation, and layout
        </p>
      </div>

      <div className="flex gap-4 border-b pb-4">
        <Button
          variant={section === 'list' ? 'primary' : 'ghost'}
          onClick={() => {
            setSection('list');
            setSelectedContent(null);
          }}
        >
          Content
        </Button>
        <Button
          variant={section === 'navigation' ? 'primary' : 'ghost'}
          onClick={() => setSection('navigation')}
        >
          Navigation
        </Button>
        <Button
          variant={section === 'editor' && !selectedContent?.id ? 'primary' : 'ghost'}
          onClick={() => {
            setSelectedContent({ type: 'page' });
            setSection('editor');
          }}
        >
          Create New
        </Button>
      </div>

      <Card className="p-6">
        {renderSection()}
      </Card>
    </div>
  );
}