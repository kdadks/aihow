import React from 'react';
import { useAdminContext } from '../context/AdminContext';
import type { SystemSetting, FeatureFlag } from '../../services/api';

export default function SystemSettings() {
    const { configService } = useAdminContext();
    const [settings, setSettings] = React.useState<SystemSetting[]>([]);
    const [featureFlags, setFeatureFlags] = React.useState<FeatureFlag[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [editingSetting, setEditingSetting] = React.useState<string | null>(null);
    const [editedValue, setEditedValue] = React.useState<string>('');

    // Fetch settings and feature flags
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [settingsResponse, flagsResponse] = await Promise.all([
                    configService.getSystemSettings(),
                    configService.getFeatureFlags()
                ]);

                if (settingsResponse.error) {
                    throw new Error(settingsResponse.error.message);
                }

                if (flagsResponse.error) {
                    throw new Error(flagsResponse.error.message);
                }

                setSettings(settingsResponse.data || []);
                setFeatureFlags(flagsResponse.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [configService]);

    const handleSettingEdit = (key: string, currentValue: any) => {
        setEditingSetting(key);
        setEditedValue(JSON.stringify(currentValue));
    };

    const handleSettingSave = async (key: string) => {
        try {
            let parsedValue;
            try {
                parsedValue = JSON.parse(editedValue);
            } catch {
                parsedValue = editedValue;
            }

            const response = await configService.updateSystemSetting(key, parsedValue);
            if (response.error) {
                throw new Error(response.error.message);
            }

            setSettings(prev =>
                prev.map(setting =>
                    setting.key === key
                        ? { ...setting, value: parsedValue }
                        : setting
                )
            );
            setEditingSetting(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update setting');
        }
    };

    const handleFeatureFlagToggle = async (name: string, enabled: boolean) => {
        try {
            const response = await configService.updateFeatureFlag(name, { enabled });
            if (response.error) {
                throw new Error(response.error.message);
            }

            setFeatureFlags(prev =>
                prev.map(flag =>
                    flag.name === name
                        ? { ...flag, enabled }
                        : flag
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update feature flag');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
            </div>

            {/* System Settings */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Configuration</h2>
                    <div className="space-y-4">
                        {settings.map(setting => (
                            <div key={setting.key} className="flex items-start justify-between">
                                <div className="flex-1 mr-4">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {setting.key}
                                    </h3>
                                    {setting.description && (
                                        <p className="text-sm text-gray-500">
                                            {setting.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex-1">
                                    {editingSetting === setting.key ? (
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={editedValue}
                                                onChange={e => setEditedValue(e.target.value)}
                                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <button
                                                onClick={() => handleSettingSave(setting.key)}
                                                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingSetting(null)}
                                                className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <code className="text-sm text-gray-600">
                                                {JSON.stringify(setting.value)}
                                            </code>
                                            <button
                                                onClick={() => handleSettingEdit(setting.key, setting.value)}
                                                className="ml-4 text-blue-600 hover:text-blue-900"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feature Flags */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Feature Flags</h2>
                    <div className="space-y-4">
                        {featureFlags.map(flag => (
                            <div key={flag.name} className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {flag.name}
                                    </h3>
                                    {flag.description && (
                                        <p className="text-sm text-gray-500">
                                            {flag.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => handleFeatureFlagToggle(flag.name, !flag.enabled)}
                                        className={`
                                            relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer 
                                            transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                            ${flag.enabled ? 'bg-blue-600' : 'bg-gray-200'}
                                        `}
                                    >
                                        <span className="sr-only">Toggle feature</span>
                                        <span
                                            className={`
                                                pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 
                                                transition ease-in-out duration-200
                                                ${flag.enabled ? 'translate-x-5' : 'translate-x-0'}
                                            `}
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}