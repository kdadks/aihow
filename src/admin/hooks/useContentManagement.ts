import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { ContentItem, ContentVersion, PreviewData, NavigationItem, SiteLayout } from '../types/cms';

export function useContentManagement() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  const fetchContent = useCallback(async (type?: ContentItem['type']) => {
    try {
      setLoading(true);
      let query = supabase
        .from('content')
        .select(`
          *,
          versions:content_versions(*)
        `);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      setContent(data as ContentItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred fetching content');
    } finally {
      setLoading(false);
    }
  }, []);

  const createContent = useCallback(async (item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content')
        .insert([{
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      await fetchContent(item.type);
      return data[0] as ContentItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred creating content');
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchContent]);

  const updateContent = useCallback(async (id: string, updates: Partial<ContentItem>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('content')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      await fetchContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred updating content');
    } finally {
      setLoading(false);
    }
  }, [fetchContent]);

  const createVersion = useCallback(async (contentId: string, version: Omit<ContentVersion, 'id'>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('content_versions')
        .insert([{
          contentId,
          ...version,
          createdAt: new Date().toISOString()
        }]);

      if (error) throw error;
      await fetchContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred creating version');
    } finally {
      setLoading(false);
    }
  }, [fetchContent]);

  const publishVersion = useCallback(async (contentId: string, versionId: string) => {
    try {
      setLoading(true);
      // Start a transaction to update both version and content
      const { data: version, error: versionError } = await supabase
        .from('content_versions')
        .select('content')
        .eq('id', versionId)
        .single();

      if (versionError) throw versionError;

      const { error: publishError } = await supabase
        .from('content')
        .update({
          content: version.content,
          published: true,
          updatedAt: new Date().toISOString()
        })
        .eq('id', contentId);

      if (publishError) throw publishError;
      await fetchContent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred publishing version');
    } finally {
      setLoading(false);
    }
  }, [fetchContent]);

  const generatePreview = useCallback(async (contentId: string, versionId?: string) => {
    try {
      setLoading(true);
      const { data: content, error: contentError } = await supabase
        .from('content')
        .select('*, versions:content_versions(*)')
        .eq('id', contentId)
        .single();

      if (contentError) throw contentError;

      const { data: layout, error: layoutError } = await supabase
        .from('site_layouts')
        .select()
        .eq('id', content.metadata.template)
        .single();

      if (layoutError) throw layoutError;

      const { data: navigation, error: navError } = await supabase
        .from('navigation')
        .select()
        .order('order', { ascending: true });

      if (navError) throw navError;

      setPreviewData({
        content: {
          ...content,
          content: versionId 
            ? content.versions.find((v: ContentVersion) => v.id === versionId)?.content || content.content
            : content.content
        },
        layout,
        navigation
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred generating preview');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    content,
    loading,
    error,
    previewData,
    fetchContent,
    createContent,
    updateContent,
    createVersion,
    publishVersion,
    generatePreview
  };
}