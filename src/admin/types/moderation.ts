import type { AdminResponse } from './admin';

export interface ContentItem {
    id: string;
    type: string;
    content: Record<string, any>;
    status: 'pending' | 'approved' | 'rejected';
    user_id: string;
    created_at: string;
    updated_at: string;
    reviewed_by?: string;
    reviewed_at?: string;
    reason?: string;
}

export interface ModerationFilters {
    status?: ContentItem['status'];
    type?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
}

export interface ModerationStats {
    pending: number;
    approved: number;
    rejected: number;
}

export interface ModerationService {
    getContent(
        filters: ModerationFilters,
        page?: number,
        pageSize?: number
    ): Promise<AdminResponse<{ data: ContentItem[]; count: number }>>;
    
    updateContentStatus(
        id: string,
        status: ContentItem['status'],
        reason?: string
    ): Promise<AdminResponse<ContentItem>>;
    
    getContentStats(): Promise<AdminResponse<ModerationStats>>;
    
    addToModerationQueue(
        type: string,
        content: Record<string, any>,
        userId: string
    ): Promise<AdminResponse<ContentItem>>;
}
