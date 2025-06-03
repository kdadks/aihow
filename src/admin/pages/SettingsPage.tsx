import { useState, useEffect } from 'react';
import { useConfigAdmin } from '../context/AdminContext';
import { Widget } from '../components/dashboard/Widget';
import { WidgetGrid } from '../components/dashboard/WidgetGrid';
import { TabGroup } from '../components/common/TabGroup';
import type { SystemSetting, FeatureFlag } from '../types/admin';

type SettingCategory = 'general' | 'users' | 'content' | 'system';
type SettingTab = 'settings' | 'features';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingTab>('settings');
    const [activeCategory, setActiveCategory] = useState<SettingCategory>('general');
    const configAdmin = useConfigAdmin();

    const tabs = [
        { id: 'settings', label: 'System Settings' },
        { id: 'features', label: 'Feature Flags' }
    ];

    const categories = [
        { id: 'general', label: 'General' },
        { id: 'users', label: 'Users' },
        { id: 'content', label: 'Content' },
        { id: 'system', label: 'System' }
    ];

    return (
        <div className="min-h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 shadow-xl p-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent">
                                        System Settings
                                    </h1>
                                    <p className="text-gray-600 font-medium">Configure system settings and feature flags</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <TabGroup
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={(tab) => setActiveTab(tab as SettingTab)}
                />

                {/* Content */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="flex space-x-4">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id as SettingCategory)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeCategory === category.id
                                            ? 'bg-white shadow-md text-indigo-600'
                                            : 'text-gray-600 hover:text-indigo-600'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                        <SettingsGrid category={activeCategory} configAdmin={configAdmin} />
                    </div>
                )}

                {activeTab === 'features' && (
                    <FeatureFlagList configAdmin={configAdmin} />
                )}
            </div>
        </div>
    );
}

function SettingsGrid({ category, configAdmin }: { category: SettingCategory, configAdmin: ReturnType<typeof useConfigAdmin> }) {
    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                const result = await configAdmin.getSettings();
                if (result.error) throw result.error;
                if (result.data) {
                    const filteredSettings = result.data.filter(
                        setting => setting.category === category
                    );
                    setSettings(filteredSettings);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load settings');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [category, configAdmin]);

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                {error}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <WidgetGrid columns={2}>
            {settings.map(setting => (
                <SettingWidget 
                    key={setting.key}
                    setting={setting}
                    onUpdate={async (key, value) => {
                        const result = await configAdmin.updateSetting(key, value);
                        if (result.error) throw result.error;
                    }}
                />
            ))}
        </WidgetGrid>
    );
}

function SettingWidget({ 
    setting,
    onUpdate
}: {
    setting: SystemSetting;
    onUpdate: (key: string, value: any) => Promise<void>;
}) {
    const [value, setValue] = useState(setting.value);

    const handleUpdate = async () => {
        try {
            await onUpdate(setting.key, value);
        } catch (error) {
            console.error('Failed to update setting:', error);
            // Reset to original value on error
            setValue(setting.value);
        }
    };

    return (
        <Widget id={setting.key} title={setting.key}>
            <div className="space-y-4">
                <p className="text-sm text-gray-600">{setting.description}</p>
                <div className="space-y-2">
                    {typeof value === 'boolean' ? (
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => setValue(e.target.checked)}
                                onBlur={handleUpdate}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Enabled</span>
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={typeof value === 'string' ? value : JSON.stringify(value)}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={handleUpdate}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    )}
                </div>
            </div>
        </Widget>
    );
}

function FeatureFlagList({ configAdmin }: { configAdmin: ReturnType<typeof useConfigAdmin> }) {
    const [flags, setFlags] = useState<FeatureFlag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlags = async () => {
            try {
                setIsLoading(true);
                const result = await configAdmin.getFeatureFlags();
                if (result.error) throw result.error;
                if (result.data) {
                    setFlags(result.data);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load feature flags');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlags();
    }, [configAdmin]);

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
                {error}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {flags.map(flag => (
                <FeatureFlagCard 
                    key={flag.id}
                    flag={flag}
                    onUpdate={async (id, data) => {
                        const result = await configAdmin.updateFeatureFlag(id, data);
                        if (result.error) throw result.error;
                    }}
                />
            ))}
        </div>
    );
}

function FeatureFlagCard({
    flag,
    onUpdate
}: {
    flag: FeatureFlag;
    onUpdate: (id: string, data: Partial<FeatureFlag>) => Promise<void>;
}) {
    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-6">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">{flag.name}</h3>
                    <p className="text-sm text-gray-600">{flag.description}</p>
                </div>
                <div>
                    <input
                        type="checkbox"
                        checked={flag.enabled}
                        onChange={(e) => {
                            onUpdate(flag.id, { enabled: e.target.checked });
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                </div>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Configuration</label>
                <div className="mt-1">
                    <textarea
                        rows={3}
                        value={JSON.stringify(flag.config, null, 2)}
                        onChange={(e) => {
                            try {
                                const config = JSON.parse(e.target.value);
                                onUpdate(flag.id, { config });
                            } catch (error) {
                                // Invalid JSON - ignore
                            }
                        }}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md font-mono"
                    />
                </div>
            </div>
        </div>
    );
}
