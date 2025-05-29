import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { supabase } from '../../lib/supabase';
import { NotFoundError, ValidationError } from '../types';
import {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    listCategories,
    createTopic,
    getTopic,
    updateTopic,
    deleteTopic,
    listTopics,
    pinTopic,
    lockTopic,
    moveTopic,
    incrementTopicViews,
    createReply,
    getReply,
    updateReply,
    deleteReply,
    listReplies,
    markAsSolution,
    getThreadedReplies,
    moderateContent
} from '../forum';

import {
    testCategory,
    testTopic,
    testReply,
    mockUser,
    mockAdmin,
    testNestedReply,
    pinnedTopic,
    lockedTopic
} from './fixtures/forum';

describe('Forum Database Operations', () => {
    // Store created IDs for cleanup
    let categoryId: string;
    let topicId: string;
    let replyId: string;

    // Clear test data before each test
    beforeEach(async () => {
        await supabase.from('forum_replies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('forum_topics').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('forum_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    });

    // Category Tests
    describe('Category Operations', () => {
        it('should create a category', async () => {
            const category = await createCategory(testCategory);
            categoryId = category.id;
            expect(category).toMatchObject(testCategory);
        });

        it('should get a category by id', async () => {
            const category = await createCategory(testCategory);
            const retrieved = await getCategory(category.id);
            expect(retrieved).toMatchObject(testCategory);
        });

        it('should update a category', async () => {
            const category = await createCategory(testCategory);
            const updated = await updateCategory(category.id, { name: 'Updated Category' });
            expect(updated.name).toBe('Updated Category');
        });

        it('should delete a category', async () => {
            const category = await createCategory(testCategory);
            await deleteCategory(category.id);
            await expect(getCategory(category.id)).rejects.toThrow(NotFoundError);
        });

        it('should list categories in display order', async () => {
            await createCategory({ ...testCategory, display_order: 2 });
            await createCategory({ ...testCategory, display_order: 1, slug: 'test-2' });
            const categories = await listCategories();
            expect(categories).toHaveLength(2);
            expect(categories[0].display_order).toBeLessThan(categories[1].display_order);
        });
    });

    // Topic Tests
    describe('Topic Operations', () => {
        beforeEach(async () => {
            const category = await createCategory(testCategory);
            categoryId = category.id;
        });

        it('should create a topic', async () => {
            const topic = await createTopic({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            topicId = topic.id;
            expect(topic).toMatchObject({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
        });

        it('should get a topic by id', async () => {
            const topic = await createTopic({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            const retrieved = await getTopic(topic.id);
            expect(retrieved).toMatchObject(testTopic);
        });

        it('should update a topic', async () => {
            const topic = await createTopic({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            const updated = await updateTopic(topic.id, { title: 'Updated Topic' });
            expect(updated.title).toBe('Updated Topic');
        });

        it('should delete a topic', async () => {
            const topic = await createTopic({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            await deleteTopic(topic.id);
            await expect(getTopic(topic.id)).rejects.toThrow(NotFoundError);
        });

        it('should list topics with pinned topics first', async () => {
            await createTopic({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            await createTopic({
                ...pinnedTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            const topics = await listTopics(categoryId);
            expect(topics).toHaveLength(2);
            expect(topics[0].is_pinned).toBe(true);
        });
    });

    // Topic Management Tests
    describe('Topic Management', () => {
        beforeEach(async () => {
            const category = await createCategory(testCategory);
            categoryId = category.id;
            const topic = await createTopic({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            topicId = topic.id;
        });

        it('should pin and unpin a topic', async () => {
            const pinned = await pinTopic(topicId, true);
            expect(pinned.is_pinned).toBe(true);
            const unpinned = await pinTopic(topicId, false);
            expect(unpinned.is_pinned).toBe(false);
        });

        it('should lock and unlock a topic', async () => {
            const locked = await lockTopic(topicId, true);
            expect(locked.is_locked).toBe(true);
            const unlocked = await lockTopic(topicId, false);
            expect(unlocked.is_locked).toBe(false);
        });

        it('should move a topic to another category', async () => {
            const newCategory = await createCategory({
                ...testCategory,
                slug: 'new-category'
            });
            const moved = await moveTopic(topicId, newCategory.id);
            expect(moved.category_id).toBe(newCategory.id);
        });

        it('should increment topic views', async () => {
            const initialTopic = await getTopic(topicId);
            await incrementTopicViews(topicId);
            const updatedTopic = await getTopic(topicId);
            expect(updatedTopic.views).toBe(initialTopic.views + 1);
        });
    });

    // Reply Tests
    describe('Reply Operations', () => {
        beforeEach(async () => {
            const category = await createCategory(testCategory);
            categoryId = category.id;
            const topic = await createTopic({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            topicId = topic.id;
        });

        it('should create a reply', async () => {
            const reply = await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });
            replyId = reply.id;
            expect(reply).toMatchObject({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });
        });

        it('should prevent replies to locked topics', async () => {
            await lockTopic(topicId, true);
            await expect(createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            })).rejects.toThrow(ValidationError);
        });

        it('should get a reply by id', async () => {
            const reply = await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });
            const retrieved = await getReply(reply.id);
            expect(retrieved).toMatchObject(testReply);
        });

        it('should update a reply', async () => {
            const reply = await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });
            const updated = await updateReply(reply.id, { content: 'Updated content' });
            expect(updated.content).toBe('Updated content');
        });

        it('should delete a reply', async () => {
            const reply = await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });
            await deleteReply(reply.id);
            await expect(getReply(reply.id)).rejects.toThrow(NotFoundError);
        });

        it('should list replies for a topic', async () => {
            await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });
            await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });
            const replies = await listReplies(topicId);
            expect(replies).toHaveLength(2);
        });
    });

    // Reply Threading Tests
    describe('Reply Threading', () => {
        beforeEach(async () => {
            const category = await createCategory(testCategory);
            categoryId = category.id;
            const topic = await createTopic({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            topicId = topic.id;
        });

        it('should create nested replies', async () => {
            const parentReply = await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });

            const nestedReply = await createReply({
                ...testNestedReply,
                topic_id: topicId,
                author_id: mockUser.id,
                parent_reply_id: parentReply.id
            });

            expect(nestedReply.parent_reply_id).toBe(parentReply.id);
        });

        it('should mark and unmark replies as solution', async () => {
            const reply = await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });

            const marked = await markAsSolution(reply.id, true);
            expect(marked.is_solution).toBe(true);

            const unmarked = await markAsSolution(reply.id, false);
            expect(unmarked.is_solution).toBe(false);
        });

        it('should get threaded replies', async () => {
            const parentReply = await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });

            await createReply({
                ...testNestedReply,
                topic_id: topicId,
                author_id: mockUser.id,
                parent_reply_id: parentReply.id
            });

            const replies = await getThreadedReplies(topicId);
            expect(replies).toHaveLength(2);
            expect(replies.some(r => r.parent_reply_id === parentReply.id)).toBe(true);
        });
    });

    // Admin Moderation Tests
    describe('Admin Moderation', () => {
        beforeEach(async () => {
            const category = await createCategory(testCategory);
            categoryId = category.id;
            const topic = await createTopic({
                ...testTopic,
                category_id: categoryId,
                author_id: mockUser.id
            });
            topicId = topic.id;
        });

        it('should moderate topics', async () => {
            await moderateContent('topic', topicId, 'delete');
            await expect(getTopic(topicId)).rejects.toThrow(NotFoundError);
        });

        it('should moderate replies', async () => {
            const reply = await createReply({
                ...testReply,
                topic_id: topicId,
                author_id: mockUser.id
            });
            await moderateContent('reply', reply.id, 'delete');
            await expect(getReply(reply.id)).rejects.toThrow(NotFoundError);
        });
    });
});