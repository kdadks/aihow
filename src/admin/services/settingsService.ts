import { supabase } from '../../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import type { 
    AdminResponse,
    SystemSetting,
    FeatureFlag
} from '../types/admin';

class SettingsService {
    async getSettings(): Promise<AdminResponse<SystemSetting[]>> {
        try {
            const { data: settings, error } = await supabase
                .from('system_settings')
                .select('*')
                .order('category');

            if (error) {
                throw error;
            }

            if (!settings) {
                return { data: [], error: null };
            }

            const typedSettings: SystemSetting[] = settings.map(setting => ({
                key: setting.key,
                value: setting.value,
                description: setting.description,
                category: setting.category,
                is_public: setting.is_public,
                updated_at: setting.updated_at,
                updated_by: setting.updated_by
            }));

            return { data: typedSettings, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getPublicSettings(): Promise<AdminResponse<SystemSetting[]>> {
        try {
            const { data: settings, error } = await supabase
                .from('system_settings')
                .select('*')
                .eq('is_public', true)
                .order('category');

            if (error) {
                throw error;
            }

            if (!settings) {
                return { data: [], error: null };
            }

            const typedSettings: SystemSetting[] = settings.map(setting => ({
                key: setting.key,
                value: setting.value,
                description: setting.description,
                category: setting.category,
                is_public: setting.is_public,
                updated_at: setting.updated_at,
                updated_by: setting.updated_by
            }));

            return { data: typedSettings, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async updateSetting(key: string, value: any): Promise<AdminResponse<SystemSetting>> {
        try {
            const { data: setting, error } = await supabase
                .from('system_settings')
                .update({
                    value,
                    updated_at: new Date().toISOString(),
                    updated_by: (await supabase.auth.getUser()).data.user?.id
                })
                .eq('key', key)
                .select()
                .single();

            if (error) {
                throw error;
            }

            if (!setting) {
                throw new Error('Setting not found');
            }

            const typedSetting: SystemSetting = {
                key: setting.key,
                value: setting.value,
                description: setting.description,
                category: setting.category,
                is_public: setting.is_public,
                updated_at: setting.updated_at,
                updated_by: setting.updated_by
            };

            return { data: typedSetting, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getFeatureFlags(): Promise<AdminResponse<FeatureFlag[]>> {
        try {
            const { data: flags, error } = await supabase
                .from('feature_flags')
                .select('*')
                .order('name');

            if (error) {
                throw error;
            }

            if (!flags) {
                return { data: [], error: null };
            }

            const typedFlags: FeatureFlag[] = flags.map(flag => ({
                id: flag.id,
                name: flag.name,
                description: flag.description,
                enabled: flag.enabled,
                config: flag.config,
                created_at: flag.created_at,
                updated_at: flag.updated_at,
                updated_by: flag.updated_by
            }));

            return { data: typedFlags, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async updateFeatureFlag(id: string, data: Partial<FeatureFlag>): Promise<AdminResponse<FeatureFlag>> {
        try {
            const updates: Partial<FeatureFlag> = {
                ...data,
                updated_at: new Date().toISOString(),
                updated_by: (await supabase.auth.getUser()).data.user?.id
            };

            const { data: flag, error } = await supabase
                .from('feature_flags')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            if (!flag) {
                throw new Error('Feature flag not found');
            }

            const typedFlag: FeatureFlag = {
                id: flag.id,
                name: flag.name,
                description: flag.description,
                enabled: flag.enabled,
                config: flag.config,
                created_at: flag.created_at,
                updated_at: flag.updated_at,
                updated_by: flag.updated_by
            };

            return { data: typedFlag, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }

    async getSettingsByCategory(category: string): Promise<AdminResponse<SystemSetting[]>> {
        try {
            const { data: settings, error } = await supabase
                .from('system_settings')
                .select('*')
                .eq('category', category)
                .order('key');

            if (error) {
                throw error;
            }

            if (!settings) {
                return { data: [], error: null };
            }

            const typedSettings: SystemSetting[] = settings.map(setting => ({
                key: setting.key,
                value: setting.value,
                description: setting.description,
                category: setting.category,
                is_public: setting.is_public,
                updated_at: setting.updated_at,
                updated_by: setting.updated_by
            }));

            return { data: typedSettings, error: null };
        } catch (error) {
            return { data: null, error: error as PostgrestError };
        }
    }
}

export const settingsService = new SettingsService();
