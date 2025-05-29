import React, { useState, useEffect } from 'react';
import { NavigationItem } from '../../types/cms';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Loading } from '../../../components/ui/Loading';
import { supabase } from '../../../lib/supabase';

export default function NavigationEditor() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);

  useEffect(() => {
    fetchNavigationItems();
  }, []);

  const fetchNavigationItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('navigation')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setItems(data as NavigationItem[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching navigation items');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (item: Partial<NavigationItem>) => {
    try {
      setLoading(true);
      if (editingItem?.id) {
        const { error } = await supabase
          .from('navigation')
          .update(item)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('navigation')
          .insert([{
            ...item,
            order: items.length
          }]);
        if (error) throw error;
      }
      
      await fetchNavigationItems();
      setEditingItem(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving navigation item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('navigation')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchNavigationItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting navigation item');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (itemId: string, newOrder: number) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('navigation')
        .update({ order: newOrder })
        .eq('id', itemId);

      if (error) throw error;
      await fetchNavigationItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error reordering navigation items');
    } finally {
      setLoading(false);
    }
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => (
    <div
      key={item.id}
      className={`flex items-center gap-2 py-2 ${level > 0 ? 'ml-6' : ''}`}
    >
      <div className="flex-1">
        <div className="font-medium">{item.label}</div>
        <div className="text-sm text-gray-500">{item.link}</div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => handleReorder(item.id, item.order - 1)}
          disabled={item.order === 0}
        >
          ↑
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleReorder(item.id, item.order + 1)}
          disabled={item.order === items.length - 1}
        >
          ↓
        </Button>
        <Button
          variant="outline"
          onClick={() => setEditingItem(item)}
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          onClick={() => handleDeleteItem(item.id)}
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </Button>
      </div>
    </div>
  );

  if (loading && !items.length) {
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
        <h2 className="text-2xl font-semibold">Navigation Menu</h2>
        <Button
          variant="primary"
          onClick={() => setEditingItem({
            id: '',
            label: '',
            link: '',
            order: items.length,
            children: []
          } as NavigationItem)}
        >
          Add Item
        </Button>
      </div>

      <Card className="divide-y">
        {items.map(item => renderNavigationItem(item))}
        {items.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No navigation items found
          </div>
        )}
      </Card>

      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-4 space-y-4">
            <h3 className="text-lg font-semibold">
              {editingItem.id ? 'Edit Navigation Item' : 'Add Navigation Item'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link
                </label>
                <input
                  type="text"
                  value={editingItem.link}
                  onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Item
                </label>
                <select
                  value={editingItem.parentId || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, parentId: e.target.value || undefined })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSaveItem(editingItem)}
                disabled={!editingItem.label || !editingItem.link}
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}