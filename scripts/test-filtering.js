/**
 * Test API filtering with specific parameters
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function testFiltering() {
  console.log('🧪 Testing tool filtering with subcategory...\n');

  const categorySlug = 'code-creation';
  const subcategorySlug = 'coding-assistants';

  console.log(`Testing: ${categorySlug} / ${subcategorySlug}\n`);

  // Step 1: Get subcategory ID
  const { data: subData } = await supabase
    .from('subcategories_v2')
    .select('id, name, parent_category_id, tool_categories_v2(slug)')
    .eq('slug', subcategorySlug);

  console.log('Step 1: Found subcategories with slug "coding-assistants":');
  subData?.forEach(sub => {
    console.log(`  - ID: ${sub.id}`);
    console.log(`    Category: ${sub.tool_categories_v2[0]?.slug || 'unknown'}`);
    console.log(`    Name: ${sub.name}`);
  });

  // Step 2: Filter by category too
  console.log('\nStep 2: Filtering by both category and subcategory...');
  
  const { data: categoryData } = await supabase
    .from('tool_categories_v2')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();

  if (!categoryData) {
    console.log('❌ Category not found!');
    return;
  }

  console.log(`  Category ID: ${categoryData.id}`);

  const { data: filteredSubData } = await supabase
    .from('subcategories_v2')
    .select('id, name')
    .eq('slug', subcategorySlug)
    .eq('parent_category_id', categoryData.id)
    .maybeSingle();

  if (!filteredSubData) {
    console.log('❌ Subcategory not found under this category!');
    return;
  }

  console.log(`  Subcategory ID: ${filteredSubData.id}`);
  console.log(`  Subcategory Name: ${filteredSubData.name}`);

  // Step 3: Get tool IDs
  const { data: toolSubData } = await supabase
    .from('tool_subcategories_v2')
    .select('tool_id')
    .eq('subcategory_id', filteredSubData.id);

  const toolIds = [...new Set(toolSubData?.map(ts => ts.tool_id) || [])];
  console.log(`\nStep 3: Found ${toolIds.length} tool IDs`);

  if (toolIds.length === 0) {
    console.log('⚠️ No tools found!');
    return;
  }

  // Step 4: Fetch tools
  const { data: tools } = await supabase
    .from('tools_v2')
    .select('id, slug, name')
    .in('id', toolIds)
    .eq('status', 'active');

  console.log(`\nStep 4: Fetched ${tools?.length || 0} tools:`);
  tools?.forEach((tool, idx) => {
    console.log(`  ${idx + 1}. ${tool.name} (${tool.slug})`);
  });

  // Now test without category filter (just subcategory)
  console.log('\n\n🧪 Testing with ONLY subcategory slug (no category)...\n');

  const { data: subData2 } = await supabase
    .from('subcategories_v2')
    .select('id')
    .eq('slug', subcategorySlug);

  const subcategoryIds = subData2?.map(s => s.id) || [];
  console.log(`Found ${subcategoryIds.length} subcategories with slug "${subcategorySlug}"`);

  const { data: toolSubData2 } = await supabase
    .from('tool_subcategories_v2')
    .select('tool_id')
    .in('subcategory_id', subcategoryIds);

  const toolIds2 = [...new Set(toolSubData2?.map(ts => ts.tool_id) || [])];
  console.log(`This would return ${toolIds2.length} tool IDs`);

  const { data: tools2 } = await supabase
    .from('tools_v2')
    .select('id, slug, name')
    .in('id', toolIds2)
    .eq('status', 'active');

  console.log(`Which gives ${tools2?.length || 0} tools`);
}

testFiltering().catch(console.error);
