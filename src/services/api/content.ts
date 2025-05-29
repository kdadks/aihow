import { client } from './client';
import type { APIResponse } from './types';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'page' | 'post';
  status: 'draft' | 'published' | 'archived' | 'pending';
  createdAt: string;
  updatedAt: string;
  author: string;
  version: number;
  metadata?: Record<string, any>;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface ContentListResponse {
  data: ContentItem[];
  count: number;
}

export const content = {
  async getAll(page = 1, pageSize = 10): Promise<APIResponse<ContentListResponse>> {
    const { data } = await client.get<APIResponse<ContentListResponse>>('/content', {
      params: { page, pageSize }
    });
    return data;
  },

  async getById(id: string): Promise<APIResponse<ContentItem>> {
    const { data } = await client.get<APIResponse<ContentItem>>(`/content/${id}`);
    return data;
  },

  async create(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<APIResponse<ContentItem>> {
    const { data } = await client.post<APIResponse<ContentItem>>('/content', item);
    return data;
  },

  async update(id: string, update: Partial<ContentItem>): Promise<APIResponse<ContentItem>> {
    const { data } = await client.put<APIResponse<ContentItem>>(`/content/${id}`, update);
    return data;
  },

  async delete(id: string): Promise<APIResponse<void>> {
    const { data } = await client.delete<APIResponse<void>>(`/content/${id}`);
    return data;
  },

  async getVersions(contentId: string): Promise<APIResponse<ContentVersion[]>> {
    const { data } = await client.get<APIResponse<ContentVersion[]>>(`/content/${contentId}/versions`);
    return data;
  }
};