import { ForumCategory, ForumTopic, ForumReply } from '../../types';

export const testCategory: Omit<ForumCategory, 'id' | 'created_at' | 'updated_at'> = {
    name: 'Test Category',
    description: 'A test category for the forum',
    slug: 'test-category',
    display_order: 0
};

export const testTopic: Omit<ForumTopic, 'id' | 'views' | 'created_at' | 'updated_at'> = {
    category_id: '', // Set during tests
    author_id: '', // Set during tests
    title: 'Test Topic',
    content: 'This is a test topic content',
    is_pinned: false,
    is_locked: false
};

export const testReply: Omit<ForumReply, 'id' | 'created_at' | 'updated_at'> = {
    topic_id: '', // Set during tests
    author_id: '', // Set during tests
    parent_reply_id: null,
    content: 'This is a test reply content',
    is_solution: false
};

export const mockUser = {
    id: '12345678-1234-1234-1234-123456789012',
    role: 'authenticated'
};

export const mockAdmin = {
    id: '87654321-4321-4321-4321-210987654321',
    role: 'admin'
};

export const testNestedReply: Omit<ForumReply, 'id' | 'created_at' | 'updated_at'> = {
    topic_id: '', // Set during tests
    author_id: '', // Set during tests
    parent_reply_id: '', // Set during tests
    content: 'This is a nested reply content',
    is_solution: false
};

export const pinnedTopic: Omit<ForumTopic, 'id' | 'views' | 'created_at' | 'updated_at'> = {
    category_id: '', // Set during tests
    author_id: '', // Set during tests
    title: 'Pinned Topic',
    content: 'This is a pinned topic content',
    is_pinned: true,
    is_locked: false
};

export const lockedTopic: Omit<ForumTopic, 'id' | 'views' | 'created_at' | 'updated_at'> = {
    category_id: '', // Set during tests
    author_id: '', // Set during tests
    title: 'Locked Topic',
    content: 'This is a locked topic content',
    is_pinned: false,
    is_locked: true
};