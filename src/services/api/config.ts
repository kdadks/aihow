import { client } from './client';
import type { APIResponse } from './types';

export interface SystemSetting {
  id: string;
  key: string;
  value: string | number | boolean;
  description: string;
  category: string;
  updatedAt: string;
}

export interface FeatureFlag {
  id: string;
  name: string; // Used in UI instead of key
  key: string;
  enabled: boolean;
  description: string;
  conditions?: Record<string, any>;
  updatedAt: string;
}

export const config = {
  async getSettings(): Promise<APIResponse<SystemSetting[]>> {
    const { data } = await client.get<APIResponse<SystemSetting[]>>('/config/settings');
    return data;
  },

  async getSetting(key: string): Promise<APIResponse<SystemSetting>> {
    const { data } = await client.get<APIResponse<SystemSetting>>(`/config/settings/${key}`);
    return data;
  },

  async updateSetting(key: string, update: Partial<SystemSetting>): Promise<APIResponse<SystemSetting>> {
    const { data } = await client.put<APIResponse<SystemSetting>>(`/config/settings/${key}`, update);
    return data;
  },

  async getFeatureFlags(): Promise<APIResponse<FeatureFlag[]>> {
    const { data } = await client.get<APIResponse<FeatureFlag[]>>('/config/feature-flags');
    return data;
  },

  async getFeatureFlag(key: string): Promise<APIResponse<FeatureFlag>> {
    const { data } = await client.get<APIResponse<FeatureFlag>>(`/config/feature-flags/${key}`);
    return data;
  },

  async updateFeatureFlag(key: string, update: Partial<FeatureFlag>): Promise<APIResponse<FeatureFlag>> {
    const { data } = await client.put<APIResponse<FeatureFlag>>(`/config/feature-flags/${key}`, update);
    return data;
  },

  async toggleFeatureFlag(key: string): Promise<APIResponse<FeatureFlag>> {
    const { data } = await client.post<APIResponse<FeatureFlag>>(`/config/feature-flags/${key}/toggle`);
    return data;
  }
};