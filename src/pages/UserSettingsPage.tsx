import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Settings, Shield, Bell, Eye, Globe, Save } from 'lucide-react';

interface UserSettings {
  id: string;
  email_notifications: boolean;
  marketing_emails: boolean;
  profile_visibility: 'public' | 'private';
  theme_preference: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  two_factor_enabled: boolean;
}

const UserSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Loading user settings for:', user.email);
      
      // First try to get settings from database (production)
      try {
        const { data: existingSettings, error: fetchError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // No settings found - create default ones
            console.log('No settings found, creating defaults');
            await createDefaultSettings();
            return;
          } else if (fetchError.code === '42P01') {
            // Table doesn't exist - fall back to localStorage
            console.warn('Database table not found, using localStorage fallback');
            await loadFromLocalStorage();
            return;
          } else {
            throw fetchError;
          }
        }

        if (existingSettings) {
          setSettings(existingSettings);
          // Sync to localStorage as backup
          localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(existingSettings));
        }
      } catch (dbError: any) {
        console.warn('Database error, falling back to localStorage:', dbError);
        await loadFromLocalStorage();
      }
    } catch (err: any) {
      console.error('Settings fetch error:', err);
      useDefaultSettings();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = async () => {
    const localSettings = localStorage.getItem(`user_settings_${user!.id}`);
    
    if (localSettings) {
      try {
        const parsedSettings = JSON.parse(localSettings);
        setSettings(parsedSettings);
        console.log('Loaded settings from localStorage');
      } catch (parseError) {
        console.warn('Error parsing local settings, using defaults');
        useDefaultSettings();
      }
    } else {
      useDefaultSettings();
    }
  };

  const createDefaultSettings = async () => {
    const defaultSettings: UserSettings = {
      id: user!.id,
      email_notifications: true,
      marketing_emails: false,
      profile_visibility: 'public',
      theme_preference: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      two_factor_enabled: false
    };

    try {
      // Try to create in database first
      const { data: createdSettings, error: createError } = await supabase
        .from('user_settings')
        .insert([defaultSettings])
        .select()
        .single();

      if (createError) {
        console.warn('Could not create settings in database, using localStorage:', createError);
        localStorage.setItem(`user_settings_${user!.id}`, JSON.stringify(defaultSettings));
        setSettings(defaultSettings);
      } else {
        setSettings(createdSettings);
        // Sync to localStorage as backup
        localStorage.setItem(`user_settings_${user!.id}`, JSON.stringify(createdSettings));
      }
    } catch (err) {
      console.warn('Database unavailable, using localStorage only');
      localStorage.setItem(`user_settings_${user!.id}`, JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
    }
  };

  const useDefaultSettings = () => {
    const defaultSettings: UserSettings = {
      id: user!.id,
      email_notifications: true,
      marketing_emails: false,
      profile_visibility: 'public',
      theme_preference: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      two_factor_enabled: false
    };
    setSettings(defaultSettings);
    // Save to localStorage for persistence
    localStorage.setItem(`user_settings_${user!.id}`, JSON.stringify(defaultSettings));
  };

  const handleSave = async () => {
    if (!user || !settings) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Try to save to database first (production)
      try {
        const { error: updateError } = await supabase
          .from('user_settings')
          .upsert(settings, {
            onConflict: 'id'
          });

        if (updateError) {
          if (updateError.code === '42P01') {
            // Table doesn't exist - fall back to localStorage
            console.warn('Database table not found, saving to localStorage');
            localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settings));
          } else {
            throw updateError;
          }
        } else {
          console.log('Settings saved to database successfully');
          // Also save to localStorage as backup
          localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settings));
        }
      } catch (dbError: any) {
        console.warn('Database save failed, using localStorage fallback:', dbError);
        localStorage.setItem(`user_settings_${user.id}`, JSON.stringify(settings));
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError('Failed to save settings');
      console.error('Settings save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
          <p className="text-gray-600">
            Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to access your settings.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and privacy settings</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive notifications about your account activity</p>
              </div>
              <button
                onClick={() => updateSetting('email_notifications', !settings?.email_notifications)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings?.email_notifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings?.email_notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                <p className="text-sm text-gray-500">Receive updates about new features and tools</p>
              </div>
              <button
                onClick={() => updateSetting('marketing_emails', !settings?.marketing_emails)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  settings?.marketing_emails ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings?.marketing_emails ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Eye className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Profile Visibility
              </label>
              <select
                value={settings?.profile_visibility || 'public'}
                onChange={(e) => updateSetting('profile_visibility', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Public - Anyone can see your profile</option>
                <option value="private">Private - Only you can see your profile</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Appearance & Language</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Theme Preference
              </label>
              <select
                value={settings?.theme_preference || 'system'}
                onChange={(e) => updateSetting('theme_preference', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Language
              </label>
              <select
                value={settings?.language || 'en'}
                onChange={(e) => updateSetting('language', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Two-factor authentication setup coming soon!')}
              >
                {settings?.two_factor_enabled ? 'Disable' : 'Enable'}
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => alert('Password change functionality coming soon!')}
              >
                Change Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {success && (
              <span className="text-green-600 text-sm">Settings saved successfully!</span>
            )}
            {error && (
              <span className="text-red-600 text-sm">{error}</span>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;