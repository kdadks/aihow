/**
 * Quick script to check if v2 data has been seeded
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

async function checkData() {
  console.log('🔍 Checking V2 tables...\n');

  // Check categories
  const { data: categories, error: catError } = await supabase
    .from('tool_categories_v2')
    .select('id, slug, name')
    .limit(5);

  console.log('Categories:', categories?.length || 0);
  if (categories && categories.length > 0) {
    console.log('  Sample:', categories.map(c => c.slug).join(', '));
  }

  // Check subcategories
  const { data: subcategories, error: subError } = await supabase
    .from('subcategories_v2')
    .select('id, slug, name, parent_category_id')
    .limit(5);

  console.log('\nSubcategories:', subcategories?.length || 0);
  if (subcategories && subcategories.length > 0) {
    console.log('  Sample:', subcategories.map(s => s.slug).join(', '));
  }

  // Check tools
  const { count: toolsCount } = await supabase
    .from('tools_v2')
    .select('*', { count: 'exact', head: true });

  console.log('\nTools:', toolsCount || 0);

  // Check tool-subcategory mappings
  const { count: mappingsCount } = await supabase
    .from('tool_subcategories_v2')
    .select('*', { count: 'exact', head: true });

  console.log('Tool-Subcategory Mappings:', mappingsCount || 0);

  // Check bundles
  const { count: bundlesCount } = await supabase
    .from('tool_bundles_v2')
    .select('*', { count: 'exact', head: true });

  console.log('Bundles:', bundlesCount || 0);

  // Check code-creation category specifically
  const { data: codeCreation } = await supabase
    .from('tool_categories_v2')
    .select('id, slug, name')
    .eq('slug', 'code-creation')
    .maybeSingle();

  console.log('\n📂 Code Creation Category:', codeCreation ? '✅ Found' : '❌ Not found');
  if (codeCreation) {
    console.log('  ID:', codeCreation.id);

    // Check its subcategories
    const { data: codeSubs } = await supabase
      .from('subcategories_v2')
      .select('id, slug, name')
      .eq('parent_category_id', codeCreation.id);

    console.log('  Subcategories:', codeSubs?.length || 0);
    if (codeSubs && codeSubs.length > 0) {
      codeSubs.forEach(sub => {
        console.log(`    - ${sub.slug} (${sub.name})`);
      });
    }

    // Check coding-assistants subcategory
    const codingAssistants = codeSubs?.find(s => s.slug === 'coding-assistants');
    if (codingAssistants) {
      const { count: toolCount } = await supabase
        .from('tool_subcategories_v2')
        .select('*', { count: 'exact', head: true })
        .eq('subcategory_id', codingAssistants.id);

      console.log(`\n  🔧 Tools in coding-assistants:`, toolCount || 0);
    }

    // Check code-generation subcategory
    const codeGeneration = codeSubs?.find(s => s.slug === 'code-generation');
    if (codeGeneration) {
      const { count: toolCount } = await supabase
        .from('tool_subcategories_v2')
        .select('*', { count: 'exact', head: true })
        .eq('subcategory_id', codeGeneration.id);

      console.log(`  🔧 Tools in code-generation:`, toolCount || 0);
    }
  }
}

checkData().catch(console.error);
