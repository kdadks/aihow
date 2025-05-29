import { supabase } from '../lib/supabase';
import { BlogPost, BlogCategory, BlogPostCategory, BlogPostStatus, DatabaseError, NotFoundError, ValidationError } from './types';

// Helper function to handle database errors
const handleError = (error: any, message: string): never => {
    if (error.code === 'PGRST116') {
        throw new ValidationError(message);
    }
    throw new DatabaseError(message, error);
};

// Blog Post CRUD Operations

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

    if (error) {
        handleError(error, 'Failed to create blog post');
    }

    return data as BlogPost;
}

export async function getBlogPost(id: string): Promise<BlogPost> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        handleError(error, `Failed to get blog post with id ${id}`);
    }
    if (!data) {
        throw new NotFoundError('BlogPost', id);
    }

    return data as BlogPost;
}

export async function updateBlogPost(id: string, updates: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>>): Promise<BlogPost> {
    const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        handleError(error, `Failed to update blog post with id ${id}`);
    }
    if (!data) {
        throw new NotFoundError('BlogPost', id);
    }

    return data as BlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

    if (error) {
        handleError(error, `Failed to delete blog post with id ${id}`);
    }
}

// Blog Category CRUD Operations

export async function createBlogCategory(category: Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>): Promise<BlogCategory> {
    const { data, error } = await supabase
        .from('blog_categories')
        .insert([category])
        .select()
        .single();

    if (error) {
        handleError(error, 'Failed to create blog category');
    }

    return data as BlogCategory;
}

export async function getBlogCategory(id: string): Promise<BlogCategory> {
    const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        handleError(error, `Failed to get blog category with id ${id}`);
    }
    if (!data) {
        throw new NotFoundError('BlogCategory', id);
    }

    return data as BlogCategory;
}

export async function updateBlogCategory(id: string, updates: Partial<Omit<BlogCategory, 'id' | 'created_at' | 'updated_at'>>): Promise<BlogCategory> {
    const { data, error } = await supabase
        .from('blog_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        handleError(error, `Failed to update blog category with id ${id}`);
    }
    if (!data) {
        throw new NotFoundError('BlogCategory', id);
    }

    return data as BlogCategory;
}

export async function deleteBlogCategory(id: string): Promise<void> {
    const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);

    if (error) {
        handleError(error, `Failed to delete blog category with id ${id}`);
    }
}

// Category Assignment Operations

export async function assignPostToCategory(postId: string, categoryId: string): Promise<void> {
    const { error } = await supabase
        .from('blog_post_categories')
        .insert([{ post_id: postId, category_id: categoryId }]);

    if (error) {
        handleError(error, `Failed to assign post ${postId} to category ${categoryId}`);
    }
}

export async function removePostFromCategory(postId: string, categoryId: string): Promise<void> {
    const { error } = await supabase
        .from('blog_post_categories')
        .delete()
        .match({ post_id: postId, category_id: categoryId });

    if (error) {
        handleError(error, `Failed to remove post ${postId} from category ${categoryId}`);
    }
}

export async function getPostCategories(postId: string): Promise<BlogCategory[]> {
    const { data, error } = await supabase
        .from('blog_categories')
        .select('*, blog_post_categories!inner(*)')
        .eq('blog_post_categories.post_id', postId);

    if (error) {
        handleError(error, `Failed to get categories for post ${postId}`);
    }

    return data as BlogCategory[];
}

// Post Status Management

export async function updatePostStatus(postId: string, status: BlogPostStatus): Promise<BlogPost> {
    const updates: Partial<BlogPost> = {
        status,
        published_at: status === 'published' ? new Date() : null
    };

    return await updateBlogPost(postId, updates);
}

// Author-specific Queries

export async function getAuthorPosts(authorId: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('author_id', authorId)
        .order('created_at', { ascending: false });

    if (error) {
        handleError(error, `Failed to get posts for author ${authorId}`);
    }

    return data as BlogPost[];
}

export async function getAuthorDrafts(authorId: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('author_id', authorId)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false });

    if (error) {
        handleError(error, `Failed to get drafts for author ${authorId}`);
    }

    return data as BlogPost[];
}

// Admin Operations

export async function getAllPosts(options: {
    status?: BlogPostStatus;
    categoryId?: string;
    page?: number;
    limit?: number;
}): Promise<{ posts: BlogPost[]; total: number }> {
    // Start building the query
    let query = options.categoryId
        ? supabase
            .from('blog_posts')
            .select('*, blog_post_categories!inner(*)', { count: 'exact' })
            .eq('blog_post_categories.category_id', options.categoryId)
        : supabase
            .from('blog_posts')
            .select('*', { count: 'exact' });

    // Apply status filter if provided
    if (options.status) {
        query = query.eq('status', options.status);
    }

    // Apply pagination if provided
    if (options.page && options.limit) {
        const from = (options.page - 1) * options.limit;
        query = query.range(from, from + options.limit - 1);
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false });

    // Execute query
    const { data, error, count } = await query;

    if (error) {
        handleError(error, 'Failed to get blog posts');
    }

    // Transform and validate the response
    const posts = (data || []).map((post: any): BlogPost => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        author_id: post.author_id,
        status: post.status as BlogPostStatus,
        published_at: post.published_at ? new Date(post.published_at) : null,
        created_at: new Date(post.created_at),
        updated_at: new Date(post.updated_at)
    }));

    return {
        posts,
        total: count || 0
    };
}

export async function getAllCategories(): Promise<BlogCategory[]> {
    const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

    if (error) {
        handleError(error, 'Failed to get blog categories');
    }

    return data as BlogCategory[];
}

export async function getPostsByCategory(categoryId: string): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_post_categories!inner(*)')
        .eq('blog_post_categories.category_id', categoryId)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) {
        handleError(error, `Failed to get posts for category ${categoryId}`);
    }

    return data as BlogPost[];
}