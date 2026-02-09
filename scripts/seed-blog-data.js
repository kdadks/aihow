#!/usr/bin/env node

/**
 * Blog Data Seeding Script
 * Seeds blog posts from src/data/community.ts into blog_posts table
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample blog content for each post (abbreviated - would be full articles in production)
const BLOG_CONTENT = {
  'mistral-openai-grok-deepseek-llm-comparison-2025': `
# Mistral AI vs OpenAI vs Grok vs DeepSeek: The Ultimate LLM Comparison 2025

The landscape of large language models has become increasingly competitive in 2025. In this comprehensive comparison, we'll examine the leading contenders: Mistral AI, OpenAI's GPT-4, Grok, and DeepSeek.

## Performance Benchmarks

Each model brings unique strengths to the table...

## Pricing Comparison

Understanding the cost structure is crucial for businesses...

## Use Case Analysis

Different models excel in different scenarios...

## Conclusion

The best model depends on your specific needs, budget, and use case requirements.
`,
  'ai-scientific-research-accelerating-discovery': `
# AI in Scientific Research: Accelerating Discovery and Innovation

Artificial intelligence is fundamentally transforming how scientific research is conducted across all disciplines.

## Drug Discovery Revolution

AI models are now capable of predicting molecular structures and drug interactions...

## Climate Modeling

Advanced AI systems are processing vast amounts of climate data...

## Astronomical Discoveries

Machine learning algorithms are detecting patterns in space observations...

## Materials Science

AI is accelerating the discovery of new materials with specific properties...
`,
  // Add more content for other posts...
};

async function seedBlogData() {
  try {
    console.log('🌱 Starting blog data seeding...\n');

    // Import blog posts from community.ts
    const { blogPosts } = await import('../src/data/community.js').catch(() =>
      import('../src/data/community.ts')
    );

    console.log(`📝 Found ${blogPosts.length} blog posts to seed\n`);

    // We'll use a placeholder UUID for author_id since we need an actual auth.users record
    // In production, this would be the actual admin user ID
    // For now, we'll need to create posts that reference an existing user
    
    // Try to get the service role key for direct database access
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY;
    
    let adminClient = supabase;
    if (supabaseServiceKey) {
      console.log('🔑 Using service role key for admin access\n');
      adminClient = createClient(supabaseUrl, supabaseServiceKey);
    } else {
      console.log('⚠️  No service role key found. Using anon key (may have permission issues)\n');
    }

    // Try to get an existing user from auth.users
    const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();
    
    let defaultAuthorId;
    if (authError || !authUsers?.users?.length) {
      console.log('⚠️  Warning: Could not fetch auth users. Using placeholder author_id.');
      console.log('   You may need to update author_id values after seeding.\n');
      // This will likely fail, but let's try anyway
      defaultAuthorId = '00000000-0000-0000-0000-000000000000';
    } else {
      defaultAuthorId = authUsers.users[0].id;
      console.log(`✅ Using author ID: ${defaultAuthorId}\n`);
    }

    // Clear existing blog data
    console.log('🗑️  Clearing existing blog data...');
    const { error: deleteError } = await adminClient
      .from('blog_posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.log('⚠️  Note: Could not clear existing data:', deleteError.message);
    }

    // Insert blog posts
    console.log('\n📝 Inserting blog posts...');
    let successCount = 0;
    let errorCount = 0;

    for (const post of blogPosts) {
      const blogPost = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: BLOG_CONTENT[post.slug] || `# ${post.title}\n\n${post.excerpt}\n\n[Full article content would go here...]`,
        author_id: defaultAuthorId,
        status: 'published',
        published_at: new Date(post.date).toISOString(),
        created_at: new Date(post.date).toISOString(),
        updated_at: new Date().toISOString(),
        // New metadata fields
        read_time: post.readTime || null,
        category: post.category || null,
        author_name: post.author?.name || null,
        author_image: post.author?.image || null,
        author_credential: post.author?.credential || null,
        featured_image: post.image || null,
        date: post.date || null,
      };

      const { error } = await adminClient
        .from('blog_posts')
        .insert(blogPost);

      if (error) {
        console.error(`   ❌ Failed to insert "${post.title}":`, error.message);
        errorCount++;
      } else {
        console.log(`   ✅ Inserted: ${post.title}`);
        successCount++;
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SEEDING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully seeded: ${successCount} blog posts`);
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} blog posts`);
    }
    console.log('='.repeat(60));
    console.log('\n✨ Blog data seeding complete!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedBlogData();
