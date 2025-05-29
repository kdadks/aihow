import { BlogPost, BlogCategory, BlogPostStatus } from '../../types';

export const testCategories: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>[] = [
    {
        name: 'Technology',
        slug: 'technology',
        description: 'Posts about technology and software development'
    },
    {
        name: 'AI Tools',
        slug: 'ai-tools',
        description: 'Articles about artificial intelligence tools'
    }
];

export const testPosts: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>[] = [
    {
        title: 'Getting Started with TypeScript',
        slug: 'getting-started-with-typescript',
        content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript...',
        excerpt: 'Learn the basics of TypeScript and how to get started',
        author_id: 'test-author-1',
        status: 'published' as BlogPostStatus,
        published_at: new Date('2025-05-29T12:00:00Z')
    },
    {
        title: 'Introduction to AI Development',
        slug: 'introduction-to-ai-development',
        content: 'Artificial Intelligence development has become increasingly accessible...',
        excerpt: 'A beginner-friendly guide to AI development',
        author_id: 'test-author-1',
        status: 'draft' as BlogPostStatus,
        published_at: null
    },
    {
        title: 'Advanced TypeScript Patterns',
        slug: 'advanced-typescript-patterns',
        content: 'Explore advanced TypeScript patterns and best practices...',
        excerpt: 'Deep dive into TypeScript patterns',
        author_id: 'test-author-2',
        status: 'published' as BlogPostStatus,
        published_at: new Date('2025-05-28T12:00:00Z')
    }
];

// Test author IDs for reference
export const TEST_AUTHORS = {
    AUTHOR_1: 'test-author-1',
    AUTHOR_2: 'test-author-2',
    ADMIN: 'admin-user'
};

// Helper to create test data with generated IDs
export function createTestData() {
    const categories = testCategories.map((cat, index) => ({
        ...cat,
        id: `test-category-${index + 1}`,
        created_at: new Date(),
        updated_at: new Date()
    }));

    const posts = testPosts.map((post, index) => ({
        ...post,
        id: `test-post-${index + 1}`,
        created_at: new Date(),
        updated_at: new Date()
    }));

    return {
        categories,
        posts
    };
}