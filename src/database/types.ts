export interface ToolCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Tool {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    website_url: string | null;
    category_id: string | null;
    pricing_type: string | null;
    features: Record<string, any> | null;
    status: 'active' | 'inactive' | 'pending';
    created_at: Date;
    updated_at: Date;
}

export interface ToolReview {
    id: string;
    tool_id: string;
    user_id: string;
    rating: number;
    review_text: string | null;
    upvotes: number;
    status: 'published' | 'pending' | 'rejected';
    created_at: Date;
    updated_at: Date;
}

// Error types for database operations
export class DatabaseError extends Error {
    constructor(message: string, public cause?: Error) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export class NotFoundError extends DatabaseError {
    constructor(entity: string, identifier: string | number) {
        super(`${entity} with identifier ${identifier} not found`);
        this.name = 'NotFoundError';
    }
}

export class ValidationError extends DatabaseError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    author_id: string;
    status: BlogPostStatus;
    published_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface BlogPostCategory {
    post_id: string;
    category_id: string;
    created_at: Date;
}

export type ForumTopicStatus = {
    is_pinned: boolean;
    is_locked: boolean;
};

export interface ForumCategory {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    display_order: number;
    created_at: Date;
    updated_at: Date;
}

export interface ForumTopic {
    id: string;
    category_id: string;
    author_id: string;
    title: string;
    content: string;
    views: number;
    is_pinned: boolean;
    is_locked: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface ForumReply {
    id: string;
    topic_id: string;
    author_id: string;
    parent_reply_id: string | null;
    content: string;
    is_solution: boolean;
    created_at: Date;
    updated_at: Date;
}

export type WorkflowStatus = 'draft' | 'published' | 'archived';

export interface Workflow {
    id: string;
    creator_id: string;
    title: string;
    description: string | null;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
    tags: string[];
    metadata: Record<string, any>;
    version: number;
    status: WorkflowStatus;
}

export interface ToolBundle {
    id: string;
    creator_id: string;
    title: string;
    description: string | null;
    is_public: boolean;
    tools: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    tags: string[];
    category: string | null;
    version: number;
}

export interface UserSavedItem {
    id: string;
    user_id: string;
    item_id: string;
    item_type: 'workflow' | 'bundle';
    saved_at: Date;
    notes: string | null;
}