/**
 * Check what tables exist in the database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function checkTables() {
  console.log('🔍 Checking database tables...\n');

  // Check for reviews table (V2)
  const { data: reviewsCheck, error: reviewsError } = await supabase
    .from('tool_reviews_v2')
    .select('*')
    .limit(1);

  console.log('📝 Reviews:');
  if (reviewsError) {
    console.log('   ❌ tool_reviews_v2 table does not exist or has no access');
    console.log('   Error:', reviewsError.message);
  } else {
    console.log('   ✅ tool_reviews_v2 table exists');
    const { count } = await supabase
      .from('tool_reviews_v2')
      .select('*', { count: 'exact', head: true });
    console.log(`   📊 Reviews: ${count || 0}`);
  }

  // Check forum tables
  const { data: forumCats, error: catsError } = await supabase
    .from('forum_categories')
    .select('*')
    .limit(1);

  console.log('\n💬 Forums:');
  if (catsError) {
    console.log('   ❌ forum_categories table does not exist');
  } else {
    console.log('   ✅ forum_categories table exists');
    const { count } = await supabase
      .from('forum_categories')
      .select('*', { count: 'exact', head: true });
    console.log(`   📊 Categories: ${count || 0}`);
  }

  const { data: topics, error: topicsError } = await supabase
    .from('forum_topics')
    .select('*')
    .limit(1);

  if (!topicsError) {
    const { count } = await supabase
      .from('forum_topics')
      .select('*', { count: 'exact', head: true });
    console.log(`   📊 Topics: ${count || 0}`);
  }

  const { data: replies, error: repliesError } = await supabase
    .from('forum_replies')
    .select('*')
    .limit(1);

  if (!repliesError) {
    const { count } = await supabase
      .from('forum_replies')
      .select('*', { count: 'exact', head: true });
    console.log(`   📊 Replies: ${count || 0}`);
  }

  // Check for success stories / case studies
  const { data: caseStudies, error: csError } = await supabase
    .from('case_studies')
    .select('*')
    .limit(1);

  console.log('\n🌟 Success Stories:');
  if (csError) {
    console.log('   ❌ case_studies table does not exist');
  } else {
    console.log('   ✅ case_studies table exists');
    const { count } = await supabase
      .from('case_studies')
      .select('*', { count: 'exact', head: true });
    console.log(`   📊 Stories: ${count || 0}`);
  }

  // Check blog posts
  const { data: posts, error: postsError } = await supabase
    .from('blog_posts')
    .select('*')
    .limit(1);

  console.log('\n📰 Blog:');
  if (postsError) {
    console.log('   ❌ blog_posts table does not exist');
  } else {
    console.log('   ✅ blog_posts table exists');
    const { count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });
    console.log(`   📊 Posts: ${count || 0}`);
  }
}

checkTables().catch(console.error);
