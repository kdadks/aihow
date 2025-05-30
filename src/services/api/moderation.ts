import { client } from './client';
import type { APIResponse } from './types';

export interface ModerationItem {
  id: string;
  content_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
}

export interface ModerationQueueResponse {
  data: ModerationItem[];
  count: number;
}

export const moderation = {
  async getQueue(
    page = 1, 
    pageSize = 10,
    status: 'pending' | 'approved' | 'rejected' = 'pending'
  ): Promise<APIResponse<ModerationQueueResponse>> {
    const { data } = await client.get<APIResponse<ModerationQueueResponse>>('/moderation', {
      params: { page, pageSize, status }
    });
    return data;
  },

  async reviewItem(id: string, status: 'approved' | 'rejected', notes?: string): Promise<APIResponse<ModerationItem>> {
    const { data } = await client.put<APIResponse<ModerationItem>>(`/moderation/${id}`, { status, notes });
    return data;
  }
};
