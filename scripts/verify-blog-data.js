#!/usr/bin/env node

/**
 * Verify blog data in database
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyBlogData() {
  try {
    console.log('🔍 Verifying blog data in database...\n');

    // Get all published posts (using only blog_posts table, no joins)
    const { data: posts, error, count } = await supabase
      .from('blog_posts')
      .select('title, slug, category, author_name, read_time, date, status', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(20);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`✅ Found ${count} published blog posts\n`);
    console.log('=' .repeat(80));
    posts?.forEach((post, i) => {
      console.log(`${i + 1}. ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Category: ${post.category} | Author: ${post.author_name} | ${post.read_time}`);
      console.log(`   Date: ${post.date}`);
      console.log('');
    });
    console.log('=' .repeat(80));
    console.log('\n✨ Blog data verification complete!\n');

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
  }
}

verifyBlogData();
