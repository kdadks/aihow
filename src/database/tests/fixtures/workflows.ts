import { Workflow, ToolBundle, UserSavedItem } from '../../types';

export const testWorkflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'> = {
    creator_id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Workflow',
    description: 'A test workflow for testing purposes',
    is_public: false,
    tags: ['test', 'automation'],
    metadata: {
        steps: [
            { id: 1, name: 'Step 1', description: 'First step' },
            { id: 2, name: 'Step 2', description: 'Second step' }
        ]
    },
    version: 1,
    status: 'draft'
};

export const testPublicWorkflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'> = {
    creator_id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Public Workflow',
    description: 'A public workflow for testing',
    is_public: true,
    tags: ['test', 'public'],
    metadata: {
        steps: [
            { id: 1, name: 'Public Step 1', description: 'First public step' }
        ]
    },
    version: 1,
    status: 'published'
};

export const testToolBundle: Omit<ToolBundle, 'id' | 'created_at' | 'updated_at'> = {
    creator_id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Bundle',
    description: 'A test tool bundle',
    is_public: false,
    tools: {
        tool1: { name: 'Tool 1', config: {} },
        tool2: { name: 'Tool 2', config: {} }
    },
    tags: ['test', 'tools'],
    category: 'testing',
    version: 1
};

export const testPublicBundle: Omit<ToolBundle, 'id' | 'created_at' | 'updated_at'> = {
    creator_id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Public Bundle',
    description: 'A public tool bundle',
    is_public: true,
    tools: {
        tool1: { name: 'Public Tool 1', config: {} }
    },
    tags: ['test', 'public'],
    category: 'public',
    version: 1
};

export const testSavedItem: Omit<UserSavedItem, 'id' | 'saved_at'> = {
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    item_id: '123e4567-e89b-12d3-a456-426614174001',
    item_type: 'workflow',
    notes: 'Test saved item'
};

export const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com'
};

export const mockAdmin = {
    id: '123e4567-e89b-12d3-a456-426614174999',
    email: 'admin@example.com'
};