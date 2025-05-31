import { FC, useState } from 'react';
import { useAdminAuth } from '../auth/hooks/useAdminAuth';
import { ADMIN_API } from '../api';

interface SystemSettings {
  maintenanceMode: boolean;
  userRegistration: boolean;
  maxLoginAttempts: number;
  sessionTimeout: number;
  mfaEnabled: boolean;
}

export const AdminSettings: FC = () => {
  const { hasPermission } = useAdminAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    userRegistration: true,
    maxLoginAttempts: 5,
    sessionTimeout: 3600,
    mfaEnabled: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('settings.update')) {
      setError('You do not have permission to update settings');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(ADMIN_API.settings.update, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-gray-600">Configure system-wide settings</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={e => setSettings(s => ({
                ...s,
                maintenanceMode: e.target.checked
              }))}
              className="form-checkbox"
            />
            <span>Maintenance Mode</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.userRegistration}
              onChange={e => setSettings(s => ({
                ...s,
                userRegistration: e.target.checked
              }))}
              className="form-checkbox"
            />
            <span>Allow User Registration</span>
          </label>

          <div>
            <label className="block mb-2">Maximum Login Attempts</label>
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={e => setSettings(s => ({
                ...s,
                maxLoginAttempts: parseInt(e.target.value)
              }))}
              min="1"
              max="10"
              className="form-input w-full"
            />
          </div>

          <div>
            <label className="block mb-2">Session Timeout (seconds)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={e => setSettings(s => ({
                ...s,
                sessionTimeout: parseInt(e.target.value)
              }))}
              min="300"
              max="86400"
              className="form-input w-full"
            />
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.mfaEnabled}
              onChange={e => setSettings(s => ({
                ...s,
                mfaEnabled: e.target.checked
              }))}
              className="form-checkbox"
            />
            <span>Enable Multi-Factor Authentication</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !hasPermission('settings.update')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};