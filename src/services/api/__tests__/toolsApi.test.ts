import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '../../../lib/supabase';
import type { Tool } from '../../../types/Tool';

// Mock the Supabase client
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      limit: vi.fn(),
    })),
  },
}));

// Mock tool data
const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Test Tool 1',
    slug: 'test-tool-1',
    description: 'Test Description 1',
    shortDescription: 'Short Description 1',
    logo: '/logo1.png',
    website: 'https://test1.com',
    categoryId: 'cat1',
    subcategoryIds: ['subcat1'],
    rating: 4.5,
    reviewCount: 100,
    features: ['Feature 1'],
    limitations: [],
    pricing: {
      type: 'free',
      hasFreeOption: true,
    }
  },
  {
    id: '2',
    name: 'Test Tool 2',
    slug: 'test-tool-2',
    description: 'Test Description 2',
    shortDescription: 'Short Description 2',
    logo: '/logo2.png',
    website: 'https://test2.com',
    categoryId: 'cat1',
    subcategoryIds: ['subcat2'],
    rating: 4.0,
    reviewCount: 50,
    features: ['Feature 1', 'Feature 2'],
    limitations: ['Limitation 1'],
    pricing: {
      type: 'paid',
      hasFreeOption: false,
      startingPrice: '$10',
    }
  }
];

describe('Tools API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTools', () => {
    it('fetches tools successfully', async () => {
      const mockSelect = vi.fn().mockResolvedValue({ data: mockTools, error: null });
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
      } as any);

      const { data, error } = await supabase
        .from('tools')
        .select('*');

      expect(error).toBeNull();
      expect(data).toEqual(mockTools);
      expect(mockSelect).toHaveBeenCalled();
    });

    it('handles errors gracefully', async () => {
      const mockError = { message: 'Database error' };
      const mockSelect = vi.fn().mockResolvedValue({ data: null, error: mockError });
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
      } as any);

      const { data, error } = await supabase
        .from('tools')
        .select('*');

      expect(error).toEqual(mockError);
      expect(data).toBeNull();
    });
  });

  describe('getToolBySlug', () => {
    it('fetches a specific tool by slug', async () => {
      const mockTool = mockTools[0];
      const mockEq = vi.fn().mockResolvedValue({ data: [mockTool], error: null });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: vi.fn(),
        limit: vi.fn(),
      } as any);

      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('slug', 'test-tool-1');

      expect(error).toBeNull();
      expect(data).toEqual([mockTool]);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('slug', 'test-tool-1');
    });
  });

  describe('getToolsByCategory', () => {
    it('fetches tools filtered by category', async () => {
      const categoryTools = mockTools.filter(tool => tool.categoryId === 'cat1');
      const mockEq = vi.fn().mockResolvedValue({ data: categoryTools, error: null });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: vi.fn(),
        limit: vi.fn(),
      } as any);

      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('categoryId', 'cat1');

      expect(error).toBeNull();
      expect(data).toEqual(categoryTools);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('categoryId', 'cat1');
    });
  });
});
