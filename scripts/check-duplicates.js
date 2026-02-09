/**
 * Check for duplicate subcategory slugs and their tool counts
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

async function checkDuplicates() {
  console.log('🔍 Checking for duplicate subcategory slugs...\n');

  // Get all subcategories with their parent categories
  const { data: subcategories, error } = await supabase
    .from('subcategories_v2')
    .select(`
      id,
      slug,
      name,
      parent_category_id,
      tool_categories_v2!inner(slug, name)
    `);

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Group by slug
  const slugGroups = {};
  subcategories.forEach(sub => {
    if (!slugGroups[sub.slug]) {
      slugGroups[sub.slug] = [];
    }
    slugGroups[sub.slug].push(sub);
  });

  // Find duplicates
  console.log('📊 Subcategory Slug Analysis:\n');
  
  for (const [slug, subs] of Object.entries(slugGroups)) {
    if (subs.length > 1) {
      console.log(`⚠️  DUPLICATE: "${slug}" appears ${subs.length} times:`);
      for (const sub of subs) {
        const { count } = await supabase
          .from('tool_subcategories_v2')
          .select('*', { count: 'exact', head: true })
          .eq('subcategory_id', sub.id);
        
        console.log(`   - ${sub.tool_categories_v2.slug}/${slug}: ${count || 0} tools`);
      }
      console.log('');
    }
  }

  // Check coding-assistants specifically
  console.log('\n🔍 Detailed check for "coding-assistants":\n');
  const codingAssistants = subcategories.filter(s => s.slug === 'coding-assistants');
  
  for (const sub of codingAssistants) {
    console.log(`Category: ${sub.tool_categories_v2.name} (${sub.tool_categories_v2.slug})`);
    console.log(`Subcategory ID: ${sub.id}`);
    
    const { data: mappings, count } = await supabase
      .from('tool_subcategories_v2')
      .select('tool_id, tools_v2(name, slug)', { count: 'exact' })
      .eq('subcategory_id', sub.id);
    
    console.log(`Tool count: ${count || 0}`);
    if (mappings && mappings.length > 0) {
      console.log('Tools:');
      mappings.forEach(m => {
        console.log(`  - ${m.tools_v2.name} (${m.tools_v2.slug})`);
      });
    }
    console.log('');
  }
}

checkDuplicates().catch(console.error);
