import { Tool, ToolCategory, ToolReview } from '../../types';

export const testCategories: ToolCategory[] = [
  {
    id: 'cat-1',
    name: 'Image Generation',
    slug: 'image-generation',
    description: 'AI tools for generating and editing images',
    created_at: new Date('2025-05-30T10:00:00Z'),
    updated_at: new Date('2025-05-30T10:00:00Z')
  },
  {
    id: 'cat-2',
    name: 'Text Generation',
    slug: 'text-generation',
    description: 'AI tools for generating and editing text',
    created_at: new Date('2025-05-30T10:00:00Z'),
    updated_at: new Date('2025-05-30T10:00:00Z')
  }
];

export const testTools: Tool[] = [
  {
    id: 'tool-1',
    name: 'TestAI',
    slug: 'testai',
    description: 'A test AI tool',
    category_id: 'cat-1',
    website_url: 'https://testai.com',
    pricing_type: 'freemium',
    features: {
      has_api: true,
      is_opensource: false
    },
    status: 'active',
    created_at: new Date('2025-05-30T10:00:00Z'),
    updated_at: new Date('2025-05-30T10:00:00Z')
  },
  {
    id: 'tool-2',
    name: 'AnotherAI',
    slug: 'another-ai',
    description: 'Another test AI tool',
    category_id: 'cat-2',
    website_url: 'https://another-ai.com',
    pricing_type: 'paid',
    features: null,
    status: 'active',
    created_at: new Date('2025-05-30T10:00:00Z'),
    updated_at: new Date('2025-05-30T10:00:00Z')
  }
];

export const testReviews: ToolReview[] = [
  {
    id: 'review-1',
    tool_id: 'tool-1',
    user_id: 'user-1',
    rating: 5,
    review_text: 'Great tool!',
    upvotes: 10,
    status: 'published',
    created_at: new Date('2025-05-30T10:00:00Z'),
    updated_at: new Date('2025-05-30T10:00:00Z')
  },
  {
    id: 'review-2',
    tool_id: 'tool-1',
    user_id: 'user-2',
    rating: 4,
    review_text: 'Pretty good tool',
    upvotes: 5,
    status: 'published',
    created_at: new Date('2025-05-30T10:00:00Z'),
    updated_at: new Date('2025-05-30T10:00:00Z')
  },
  {
    id: 'review-3',
    tool_id: 'tool-2',
    user_id: 'user-1',
    rating: 3.5,
    review_text: 'Decent tool but could be better',
    upvotes: 2,
    status: 'published',
    created_at: new Date('2025-05-30T10:00:00Z'),
    updated_at: new Date('2025-05-30T10:00:00Z')
  }
];