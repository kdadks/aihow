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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="pt-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center h-64">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
                                <span className="text-sm font-medium text-gray-600">Loading system settings...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="pt-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-red-50/80 backdrop-blur-xl border border-red-200 rounded-2xl p-6 text-red-700 shadow-xl">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Error Loading Settings</h3>
                                    <div className="mt-2 text-sm text-red-700">{error}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="pt-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header with How2doAI Branding */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    How2doAI System Configuration
                                </h1>
                                <p className="mt-2 text-lg text-gray-600">
                                    Manage system-wide settings and feature toggles for optimal performance
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-gray-600">System Online</span>
                            </div>
                        </div>
                    </div>

                    {/* System Settings */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <svg className="h-6 w-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Configuration Settings
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                System-wide configuration parameters and values
                            </p>
                        </div>
                        <div className="p-8">
                            <div className="space-y-6">
                                {settings.map((setting, index) => (
                                    <div key={setting.key} className={`flex items-start justify-between p-4 rounded-xl transition-all duration-200 ${
                                        index % 2 === 0 ? 'bg-white/40' : 'bg-blue-50/20'
                                    } hover:bg-white/60 border border-gray-200/30`}>
                                        <div className="flex-1 mr-6">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                                {setting.key}
                                            </h3>
                                            {setting.description && (
                                                <p className="text-sm text-gray-600">
                                                    {setting.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex-1 max-w-md">
                                            {editingSetting === setting.key ? (
                                                <div className="flex items-center space-x-3">
                                                    <input
                                                        type="text"
                                                        value={editedValue}
                                                        onChange={e => setEditedValue(e.target.value)}
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-sm"
                                                        placeholder="Enter value..."
                                                    />
                                                    <button
                                                        onClick={() => handleSettingSave(setting.key)}
                                                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 shadow-sm"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSetting(null)}
                                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 bg-white/80"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-between">
                                                    <code className="text-sm text-gray-700 bg-gray-100/80 px-3 py-1.5 rounded-lg font-mono border">
                                                        {JSON.stringify(setting.value)}
                                                    </code>
                                                    <button
                                                        onClick={() => handleSettingEdit(setting.key, setting.value)}
                                                        className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                                    >
                                                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
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
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <svg className="h-6 w-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                </svg>
                                Feature Flags
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Toggle experimental features and system capabilities
                            </p>
                        </div>
                        <div className="p-8">
                            <div className="space-y-6">
                                {featureFlags.map((flag, index) => (
                                    <div key={flag.name} className={`flex items-start justify-between p-4 rounded-xl transition-all duration-200 ${
                                        index % 2 === 0 ? 'bg-white/40' : 'bg-purple-50/20'
                                    } hover:bg-white/60 border border-gray-200/30`}>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                                                {flag.name}
                                                {flag.enabled && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                        Active
                                                    </span>
                                                )}
                                            </h3>
                                            {flag.description && (
                                                <p className="text-sm text-gray-600">
                                                    {flag.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center ml-6">
                                            <button
                                                onClick={() => handleFeatureFlagToggle(flag.name, !flag.enabled)}
                                                className={`
                                                    relative inline-flex flex-shrink-0 h-7 w-12 border-2 border-transparent rounded-full cursor-pointer 
                                                    transition-colors ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                                                    shadow-lg hover:shadow-xl transform hover:scale-105
                                                    ${flag.enabled 
                                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                                                        : 'bg-gradient-to-r from-gray-200 to-gray-300'
                                                    }
                                                `}
                                            >
                                                <span className="sr-only">Toggle {flag.name}</span>
                                                <span
                                                    className={`
                                                        pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg transform ring-0 
                                                        transition ease-in-out duration-300 flex items-center justify-center
                                                        ${flag.enabled ? 'translate-x-5' : 'translate-x-0'}
                                                    `}
                                                >
                                                    {flag.enabled ? (
                                                        <svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}