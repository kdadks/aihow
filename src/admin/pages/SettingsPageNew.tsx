import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description: string;
  category: string;
  is_public: boolean;
}

const CATEGORIES = ['general', 'users', 'files', 'analytics', 'performance'];

export default function SettingsPageNew() {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('category', { ascending: true })
        .order('key', { ascending: true });

      if (error) throw error;
      setSettings(data || []);

      // Initialize edited values
      const initialValues: Record<string, any> = {};
      (data || []).forEach((setting) => {
        initialValues[setting.key] = setting.value;
      });
      setEditedValues(initialValues);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Update each changed setting
      for (const [key, value] of Object.entries(editedValues)) {
        const { error} = await supabase
          .from('system_settings')
          .update({
            value,
            updated_at: new Date().toISOString(),
          })
          .eq('key', key);

        if (error) throw error;

        // Log audit
        await supabase.rpc('create_audit_log', {
          p_action: 'update_setting',
          p_resource_type: 'system_setting',
          p_metadata: { key, value },
        });
      }

      await loadSettings();
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateValue = (key: string, value: any) => {
    setEditedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const parseValue = (value: any): any => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  };

  const renderInput = (setting: SystemSetting) => {
    const value = editedValues[setting.key];
    const parsedValue = parseValue(value);

    if (typeof parsedValue === 'boolean') {
      return (
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={parsedValue}
            onChange={(e) => updateValue(setting.key, e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-3 text-gray-700">
            {parsedValue ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      );
    }

    if (typeof parsedValue === 'number') {
      return (
        <input
          type="number"
          value={parsedValue}
          onChange={(e) => updateValue(setting.key, Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      );
    }

    return (
      <input
        type="text"
        value={typeof parsedValue === 'string' ? parsedValue : JSON.stringify(parsedValue)}
        onChange={(e) => updateValue(setting.key, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    );
  };

  const filteredSettings = settings.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-blue-600" />
              System Settings
            </h1>
            <p className="text-gray-600 mt-1">Configure site-wide settings and preferences</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadSettings}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
              Refresh
            </button>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  selectedCategory === category
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <span className="ml-2 text-xs opacity-75">
                  ({settings.filter((s) => s.category === category).length})
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredSettings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-medium">No settings in this category</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSettings.map((setting) => (
              <div key={setting.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        {setting.key}
                      </label>
                      {setting.is_public && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          Public
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{setting.description}</p>
                    {renderInput(setting)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
