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
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enterprise Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                How2doAI System Settings
              </h1>
              <p className="text-gray-600 font-medium">Configure system-wide settings and preferences</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
            {error && (
              <div className="bg-red-50/80 backdrop-blur-xl border border-red-200 text-red-700 rounded-xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-semibold">{error}</p>
                </div>
              </div>
            )}

            {/* System Configuration */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">System Configuration</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={e => setSettings(s => ({
                      ...s,
                      maintenanceMode: e.target.checked
                    }))}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Maintenance Mode</span>
                    <p className="text-sm text-gray-600">Temporarily disable public access</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.userRegistration}
                    onChange={e => setSettings(s => ({
                      ...s,
                      userRegistration: e.target.checked
                    }))}
                    className="form-checkbox h-5 w-5 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Allow User Registration</span>
                    <p className="text-sm text-gray-600">Enable new user signups</p>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Maximum Login Attempts</label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={e => setSettings(s => ({
                      ...s,
                      maxLoginAttempts: parseInt(e.target.value)
                    }))}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    min="1"
                    max="10"
                  />
                  <p className="text-xs text-gray-500">Number of failed attempts before account lockout</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">Session Timeout (seconds)</label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={e => setSettings(s => ({
                      ...s,
                      sessionTimeout: parseInt(e.target.value)
                    }))}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    min="300"
                    max="86400"
                  />
                  <p className="text-xs text-gray-500">Session duration before automatic logout (300-86400 seconds)</p>
                </div>
              </div>

              <label className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-amber-50 rounded-xl border border-gray-200 hover:border-amber-300 transition-all duration-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.mfaEnabled}
                  onChange={e => setSettings(s => ({
                    ...s,
                    mfaEnabled: e.target.checked
                  }))}
                  className="form-checkbox h-5 w-5 text-amber-600 rounded focus:ring-amber-500"
                />
                <div>
                  <span className="font-medium text-gray-900">Enable Multi-Factor Authentication</span>
                  <p className="text-sm text-gray-600">Require additional verification for admin accounts</p>
                </div>
              </label>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading || !hasPermission('settings.update')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Saving Settings...</span>
                  </span>
                ) : (
                  'Save Settings'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};