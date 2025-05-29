import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { DatabaseError, NotFoundError } from '../types';
import {
    createWorkflow,
    getWorkflow,
    updateWorkflow,
    deleteWorkflow,
    createWorkflowVersion,
    listWorkflowVersions,
    createToolBundle,
    getToolBundle,
    updateToolBundle,
    deleteToolBundle,
    saveItem,
    unsaveItem,
    getUserSavedItems,
    updateWorkflowVisibility,
    updateBundleVisibility,
    listPublicWorkflows,
    listUserWorkflows,
    listPublicBundles,
    listUserBundles
} from '../workflows';
import {
    testWorkflow,
    testPublicWorkflow,
    testToolBundle,
    testPublicBundle,
    testSavedItem,
    mockUser,
    mockAdmin
} from './fixtures/workflows';

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn(),
    }
}));

describe('Workflow Database Operations', () => {
    const mockSelect = vi.fn();
    const mockInsert = vi.fn();
    const mockUpdate = vi.fn();
    const mockDelete = vi.fn();
    const mockEq = vi.fn();
    const mockSingle = vi.fn();
    const mockOrder = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (supabase.from as any).mockReturnValue({
            select: mockSelect,
            insert: mockInsert,
            update: mockUpdate,
            delete: mockDelete
        });
        mockSelect.mockReturnValue({ eq: mockEq, order: mockOrder });
        mockInsert.mockReturnValue({ select: mockSelect });
        mockUpdate.mockReturnValue({ eq: mockEq });
        mockDelete.mockReturnValue({ eq: mockEq });
        mockEq.mockReturnValue({ select: mockSelect, single: mockSingle, order: mockOrder });
        mockOrder.mockReturnValue({ eq: mockEq });
    });

    describe('Workflow CRUD', () => {
        it('should create a workflow', async () => {
            const mockWorkflow = { ...testWorkflow, id: '123', created_at: new Date(), updated_at: new Date() };
            mockSingle.mockResolvedValue({ data: mockWorkflow, error: null });

            const result = await createWorkflow(testWorkflow);
            expect(result).toEqual(mockWorkflow);
            expect(mockInsert).toHaveBeenCalledWith([testWorkflow]);
        });

        it('should throw error if workflow creation fails', async () => {
            mockSingle.mockResolvedValue({ data: null, error: new Error('Database error') });

            await expect(createWorkflow(testWorkflow)).rejects.toThrow(DatabaseError);
        });

        it('should get a workflow by id', async () => {
            const mockWorkflow = { ...testWorkflow, id: '123', created_at: new Date(), updated_at: new Date() };
            mockSingle.mockResolvedValue({ data: mockWorkflow, error: null });

            const result = await getWorkflow('123');
            expect(result).toEqual(mockWorkflow);
            expect(mockEq).toHaveBeenCalledWith('id', '123');
        });

        it('should throw NotFoundError if workflow not found', async () => {
            mockSingle.mockResolvedValue({ data: null, error: null });

            await expect(getWorkflow('123')).rejects.toThrow(NotFoundError);
        });
    });

    describe('Version Management', () => {
        it('should create a new version of a workflow', async () => {
            const mockWorkflow = { ...testWorkflow, id: '123', version: 1, created_at: new Date(), updated_at: new Date() };
            const mockNewVersion = { ...mockWorkflow, id: '124', version: 2 };

            mockSingle.mockResolvedValueOnce({ data: mockWorkflow, error: null })
                     .mockResolvedValueOnce({ data: mockNewVersion, error: null });

            const result = await createWorkflowVersion('123');
            expect(result.version).toBe(2);
        });

        it('should list workflow versions', async () => {
            const mockVersions = [
                { ...testWorkflow, id: '123', version: 2, created_at: new Date(), updated_at: new Date() },
                { ...testWorkflow, id: '124', version: 1, created_at: new Date(), updated_at: new Date() }
            ];
            mockOrder.mockResolvedValue({ data: mockVersions, error: null });

            const result = await listWorkflowVersions('123');
            expect(result).toEqual(mockVersions);
            expect(mockOrder).toHaveBeenCalledWith('version', { ascending: false });
        });
    });

    describe('Tool Bundle Operations', () => {
        it('should create a tool bundle', async () => {
            const mockBundle = { ...testToolBundle, id: '123', created_at: new Date(), updated_at: new Date() };
            mockSingle.mockResolvedValue({ data: mockBundle, error: null });

            const result = await createToolBundle(testToolBundle);
            expect(result).toEqual(mockBundle);
            expect(mockInsert).toHaveBeenCalledWith([testToolBundle]);
        });

        it('should update a bundle visibility', async () => {
            const mockBundle = { ...testToolBundle, id: '123', is_public: true, created_at: new Date(), updated_at: new Date() };
            mockSingle.mockResolvedValue({ data: mockBundle, error: null });

            const result = await updateBundleVisibility('123', true);
            expect(result.is_public).toBe(true);
        });
    });

    describe('User Saved Items', () => {
        it('should save an item', async () => {
            const mockSaved = { ...testSavedItem, id: '123', saved_at: new Date() };
            mockSingle.mockResolvedValue({ data: mockSaved, error: null });

            const result = await saveItem(testSavedItem);
            expect(result).toEqual(mockSaved);
            expect(mockInsert).toHaveBeenCalledWith([testSavedItem]);
        });

        it('should list user saved items', async () => {
            const mockSavedItems = [
                { ...testSavedItem, id: '123', saved_at: new Date() },
                { ...testSavedItem, id: '124', saved_at: new Date() }
            ];
            mockEq.mockResolvedValue({ data: mockSavedItems, error: null });

            const result = await getUserSavedItems(mockUser.id);
            expect(result).toEqual(mockSavedItems);
            expect(mockEq).toHaveBeenCalledWith('user_id', mockUser.id);
        });
    });

    describe('RLS Policies', () => {
        it('should allow users to view their own workflows', async () => {
            const mockWorkflows = [
                { ...testWorkflow, id: '123', created_at: new Date(), updated_at: new Date() }
            ];
            mockOrder.mockResolvedValue({ data: mockWorkflows, error: null });

            const result = await listUserWorkflows(mockUser.id);
            expect(result).toEqual(mockWorkflows);
            expect(mockEq).toHaveBeenCalledWith('creator_id', mockUser.id);
        });

        it('should allow public access to published workflows', async () => {
            const mockWorkflows = [
                { ...testPublicWorkflow, id: '123', created_at: new Date(), updated_at: new Date() }
            ];
            mockOrder.mockResolvedValue({ data: mockWorkflows, error: null });

            const result = await listPublicWorkflows();
            expect(result).toEqual(mockWorkflows);
            expect(mockEq).toHaveBeenCalledWith('is_public', true);
        });
    });
});