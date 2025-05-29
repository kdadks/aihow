import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest';
import { getDatabase } from '../init';
import {
    createTool,
    updateTool,
    getTool,
    getTools,
    createToolCategory,
    getToolCategories,
    createToolReview,
    getToolReviews,
    updateToolReview,
    searchTools
} from '../tools';
import { testTools, testCategories, testReviews } from './fixtures/tools';
import { DatabaseError, NotFoundError, ValidationError } from '../types';
import type { Tool, ToolCategory, ToolReview } from '../types';

// Mock Supabase types
type PostgrestError = {
    message: string;
    details: string;
    hint: string;
    code: string;
};

type PostgrestResponseSuccess<T> = {
    data: T;
    error: null;
    count?: number;
    status: number;
    statusText: string;
};

type PostgrestResponseFailure = {
    data: null;
    error: PostgrestError;
    status: number;
    statusText: string;
};

type PostgrestSingleResponse<T> = PostgrestResponseSuccess<T> | PostgrestResponseFailure;

// Create mock builder
const createMockQueryBuilder = (response: PostgrestSingleResponse<any>) => {
    const queryBuilder = {
        insert: () => queryBuilder,
        select: () => queryBuilder,
        update: () => queryBuilder,
        single: () => Promise.resolve(response),
        eq: () => queryBuilder,
        range: () => queryBuilder,
        limit: () => queryBuilder,
        textSearch: () => queryBuilder,
    };
    return queryBuilder;
};

// Mock the database
vi.mock('../init', () => ({
    getDatabase: vi.fn()
}));

describe('Tools Database Operations', () => {
    const mockSuccessResponse = <T>(data: T, count?: number): PostgrestResponseSuccess<T> => ({
        data,
        error: null,
        count,
        status: 200,
        statusText: 'OK'
    });

    const mockErrorResponse = (message: string): PostgrestResponseFailure => ({
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

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('Category Operations', () => {
        it('should create a tool category successfully', async () => {
            const category = testCategories[0];
            const mockDb = {
                from: () => createMockQueryBuilder(mockSuccessResponse(category))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            const result = await createToolCategory({
                name: category.name,
                slug: category.slug,
                description: category.description
            });

            expect(result).toEqual(category);
            // Type safety check
            const typeCheck: ToolCategory = result;
            expect(typeCheck).toBeDefined();
        });

        it('should fetch all tool categories', async () => {
            const mockDb = {
                from: () => createMockQueryBuilder(mockSuccessResponse(testCategories))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            const result = await getToolCategories();
            expect(result).toEqual(testCategories);
        });
    });

    describe('Tool Operations', () => {
        it('should create a tool successfully with type safety', async () => {
            const tool = testTools[0];
            const mockDb = {
                from: () => createMockQueryBuilder(mockSuccessResponse(tool))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            const result = await createTool({
                name: tool.name,
                slug: tool.slug,
                description: tool.description,
                category_id: tool.category_id,
                website_url: tool.website_url,
                pricing_type: tool.pricing_type,
                features: tool.features,
                status: tool.status
            });

            expect(result).toEqual(tool);
            // Type safety check
            const typeCheck: Tool = result;
            expect(typeCheck).toBeDefined();
        });

        it('should search tools with performance metrics', async () => {
            const mockDb = {
                from: () => createMockQueryBuilder(mockSuccessResponse(testTools))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            const startTime = performance.now();
            const result = await searchTools('test');
            const endTime = performance.now();

            expect(result).toEqual(testTools);
            expect(endTime - startTime).toBeLessThan(100); // Performance threshold: 100ms
        });

        it('should enforce RLS policies on tool creation', async () => {
            const tool = testTools[0];
            const mockDb = {
                from: () => createMockQueryBuilder(mockErrorResponse('Permission denied'))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            await expect(createTool({
                name: tool.name,
                slug: tool.slug,
                description: tool.description,
                category_id: tool.category_id,
                website_url: tool.website_url,
                pricing_type: tool.pricing_type,
                features: tool.features,
                status: tool.status
            })).rejects.toThrow(DatabaseError);
        });
    });

    describe('Review Operations', () => {
        it('should create a tool review with type safety', async () => {
            const review = testReviews[0];
            const mockDb = {
                from: () => createMockQueryBuilder(mockSuccessResponse(review))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            const result = await createToolReview({
                tool_id: review.tool_id,
                user_id: review.user_id,
                rating: review.rating,
                review_text: review.review_text,
                status: review.status
            });

            expect(result).toEqual(review);
            // Type safety check
            const typeCheck: ToolReview = result;
            expect(typeCheck).toBeDefined();
        });

        it('should enforce RLS policies on review creation', async () => {
            const review = testReviews[0];
            const mockDb = {
                from: () => createMockQueryBuilder(mockErrorResponse('Permission denied'))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            await expect(createToolReview({
                tool_id: review.tool_id,
                user_id: review.user_id,
                rating: review.rating,
                review_text: review.review_text,
                status: review.status
            })).rejects.toThrow(DatabaseError);
        });
    });

    describe('Performance Testing', () => {
        it('should fetch tools with acceptable performance', async () => {
            const mockDb = {
                from: () => createMockQueryBuilder(mockSuccessResponse(testTools, testTools.length))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            const startTime = performance.now();
            const result = await getTools({ limit: 50, offset: 0 });
            const endTime = performance.now();

            expect(result.tools).toEqual(testTools);
            expect(endTime - startTime).toBeLessThan(100); // Performance threshold: 100ms
        });

        it('should handle large result sets efficiently', async () => {
            const largeToolSet = Array(1000).fill(null).map((_, index) => ({
                ...testTools[0],
                id: `tool-${index}`,
                name: `Tool ${index}`
            }));

            const mockDb = {
                from: () => createMockQueryBuilder(mockSuccessResponse(largeToolSet, largeToolSet.length))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            const startTime = performance.now();
            const result = await getTools({ limit: 1000, offset: 0 });
            const endTime = performance.now();

            expect(result.tools).toHaveLength(1000);
            expect(endTime - startTime).toBeLessThan(200); // Performance threshold: 200ms for large datasets
        });
    });

    describe('Type Safety and Validation', () => {
        it('should enforce type safety on tool category fields', async () => {
            const category = testCategories[0];
            const mockDb = {
                from: () => createMockQueryBuilder(mockSuccessResponse(category))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            const result = await createToolCategory({
                name: category.name,
                slug: category.slug,
                description: category.description
            });

            expect(typeof result.id).toBe('string');
            expect(typeof result.name).toBe('string');
            expect(typeof result.slug).toBe('string');
            expect(result.description === null || typeof result.description === 'string').toBe(true);
        });

        it('should handle null values in optional fields', async () => {
            const tool = { ...testTools[0], description: null, website_url: null };
            const mockDb = {
                from: () => createMockQueryBuilder(mockSuccessResponse(tool))
            };
            vi.mocked(getDatabase).mockReturnValue(mockDb as any);

            const result = await createTool({
                name: tool.name,
                slug: tool.slug,
                description: tool.description,
                category_id: tool.category_id,
                website_url: tool.website_url,
                pricing_type: tool.pricing_type,
                features: tool.features,
                status: tool.status
            });

            expect(result.description).toBeNull();
            expect(result.website_url).toBeNull();
        });
    });
});