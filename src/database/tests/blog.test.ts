import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import {
    createBlogPost,
    updateBlogPost,
    getBlogPost,
    deleteBlogPost,
    createBlogCategory,
    updateBlogCategory,
    getBlogCategory,
    deleteBlogCategory,
    assignPostToCategory,
    removePostFromCategory,
    getPostCategories,
    updatePostStatus,
    getAuthorPosts,
    getAllPosts
} from '../blog';
import { testPosts, testCategories, TEST_AUTHORS, createTestData } from './fixtures/blog';
import { BlogPost, BlogCategory, DatabaseError, NotFoundError } from '../types';

// Mock Supabase types
type PostgrestError = {
    message: string;
    details: string;
    hint: string;
    code: string;
};

type PostgrestResponse<T> = {
    data: T | null;
    error: PostgrestError | null;
    count?: number;
    status: number;
    statusText: string;
};

// Mock the Supabase client
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn()
    }
}));

describe('Blog Database Operations', () => {
    const mockSuccessResponse = <T>(data: T, count?: number): PostgrestResponse<T> => ({
        data,
        error: null,
        count,
        status: 200,
        statusText: 'OK'
    });

    const mockErrorResponse = (message: string): PostgrestResponse<null> => ({
        data: null,
        error: {
            message,
            details: 'Error details',
            hint: 'Error hint',
            code: 'ERROR'
        },
        status: 400,
        statusText: 'Bad Request'
    });

    // Mock Supabase query builder with correct types
    const createMockQueryBuilder = (response: PostgrestResponse<any>) => {
        const builder: any = {
            url: 'http://localhost',
            headers: {} as Record<string, string>,
            body: {},
            schema: 'public',
            throwOnError: false,
            // Query methods that return the builder
            insert: () => builder,
            select: () => builder,
            update: () => builder,
            upsert: () => builder,
            delete: () => builder,
            eq: () => builder,
            range: () => builder,
            order: () => builder,
            limit: () => builder,
            single: () => Promise.resolve(response),
            match: () => builder,
            in: () => builder,
            then: (callback: (response: PostgrestResponse<any>) => any) => Promise.resolve(callback(response))
        };
        return builder;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Blog Post CRUD Operations', () => {
        it('should create a blog post with type safety', async () => {
            const post = testPosts[0];
            vi.mocked(supabase.from).mockImplementation(() => 
                createMockQueryBuilder(mockSuccessResponse(post))
            );

            const result = await createBlogPost({
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: post.excerpt,
                author_id: post.author_id,
                status: post.status,
                published_at: post.published_at
            });

            expect(result).toEqual(post);
            const typeCheck: BlogPost = result;
            expect(typeCheck).toBeDefined();
        });

        it('should handle post not found error', async () => {
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockErrorResponse('Post not found'))
            );

            await expect(getBlogPost('nonexistent-id'))
                .rejects.toThrow(NotFoundError);
        });

        it('should enforce RLS policies on post creation', async () => {
            const post = testPosts[0];
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockErrorResponse('Permission denied'))
            );

            await expect(createBlogPost({
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: post.excerpt,
                author_id: post.author_id,
                status: post.status,
                published_at: post.published_at
            })).rejects.toThrow(DatabaseError);
        });
    });

    describe('Blog Category Operations', () => {
        it('should create a category with type safety', async () => {
            const category = testCategories[0];
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockSuccessResponse(category))
            );

            const result = await createBlogCategory({
                name: category.name,
                slug: category.slug,
                description: category.description
            });

            expect(result).toEqual(category);
            const typeCheck: BlogCategory = result;
            expect(typeCheck).toBeDefined();
        });

        it('should enforce admin-only policy on category operations', async () => {
            const category = testCategories[0];
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockErrorResponse('Permission denied'))
            );

            await expect(createBlogCategory({
                name: category.name,
                slug: category.slug,
                description: category.description
            })).rejects.toThrow(DatabaseError);
        });
    });

    describe('Category Assignment', () => {
        const { posts, categories } = createTestData();

        it('should assign a post to a category', async () => {
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockSuccessResponse({ 
                    post_id: posts[0].id,
                    category_id: categories[0].id 
                }))
            );

            await expect(assignPostToCategory(posts[0].id, categories[0].id))
                .resolves.not.toThrow();
        });

        it('should enforce author permissions on category assignment', async () => {
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockErrorResponse('Permission denied'))
            );

            await expect(assignPostToCategory('unauthorized-post', categories[0].id))
                .rejects.toThrow(DatabaseError);
        });
    });

    describe('Post Status Management', () => {
        const { posts } = createTestData();

        it('should update post status and set published_at', async () => {
            const post = { ...posts[0], status: 'published', published_at: new Date() };
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockSuccessResponse(post))
            );

            const result = await updatePostStatus(post.id, 'published');
            expect(result.status).toBe('published');
            expect(result.published_at).toBeInstanceOf(Date);
        });

        it('should clear published_at when unpublishing', async () => {
            const post = { ...posts[0], status: 'draft', published_at: null };
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockSuccessResponse(post))
            );

            const result = await updatePostStatus(post.id, 'draft');
            expect(result.status).toBe('draft');
            expect(result.published_at).toBeNull();
        });
    });

    describe('Author-specific Operations', () => {
        it('should get author posts with RLS enforcement', async () => {
            const authorPosts = testPosts.filter(p => p.author_id === TEST_AUTHORS.AUTHOR_1);
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockSuccessResponse(authorPosts))
            );

            const result = await getAuthorPosts(TEST_AUTHORS.AUTHOR_1);
            expect(result).toHaveLength(authorPosts.length);
            expect(result.every(p => p.author_id === TEST_AUTHORS.AUTHOR_1)).toBe(true);
        });
    });

    describe('Performance Testing', () => {
        it('should handle large result sets efficiently', async () => {
            const largeBlogSet = Array(100).fill(null).map((_, index) => ({
                ...testPosts[0],
                id: `post-${index}`,
                title: `Post ${index}`
            }));

            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockSuccessResponse(largeBlogSet, largeBlogSet.length))
            );

            const startTime = performance.now();
            const result = await getAllPosts({ page: 1, limit: 100 });
            const endTime = performance.now();

            expect(result.posts).toHaveLength(100);
            expect(endTime - startTime).toBeLessThan(200); // Performance threshold: 200ms
        });
    });

    describe('Type Safety and Validation', () => {
        it('should handle null values in optional fields', async () => {
            const post = { ...testPosts[0], excerpt: null, published_at: null };
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockSuccessResponse(post))
            );

            const result = await createBlogPost({
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: null,
                author_id: post.author_id,
                status: post.status,
                published_at: null
            });

            expect(result.excerpt).toBeNull();
            expect(result.published_at).toBeNull();
        });

        it('should validate required fields', async () => {
            vi.mocked(supabase.from).mockImplementation(() =>
                createMockQueryBuilder(mockErrorResponse('Not null violation'))
            );

            // @ts-expect-error - Testing runtime validation
            await expect(createBlogPost({
                title: '',
                content: '',
                author_id: TEST_AUTHORS.AUTHOR_1
            })).rejects.toThrow(DatabaseError);
        });
    });
});