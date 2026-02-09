/**
 * Compare data counts between TS files and database
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

async function loadStaticData() {
  try {
    const { tools } = await import('../src/data/tools.js').catch(() =>
      import('../src/data/tools.ts')
    );
    const { categories } = await import('../src/data/categories.js').catch(() =>
      import('../src/data/categories.ts')
    );
    const { workflowBundles } = await import('../src/data/workflows.js').catch(() =>
      import('../src/data/workflows.ts')
    );
    return { tools, categories, workflowBundles };
  } catch (e) {
    console.error('❌ Could not import static data. Run with: npx tsx scripts/compare-data.js');
    throw e;
  }
}

async function compareData() {
  console.log('📊 Comparing TypeScript data vs Database...\n');

  // Load static data
  const { tools: tsTools, categories: tsCategories, workflowBundles: tsBundles } = await loadStaticData();

  // Count subcategories and tool mappings from TS
  let tsSubcategoriesCount = 0;
  let tsMappingsCount = 0;
  
  tsCategories.forEach(cat => {
    tsSubcategoriesCount += (cat.subcategories || []).length;
    (cat.subcategories || []).forEach(sub => {
      tsMappingsCount += (sub.tools || []).length;
    });
  });

  console.log('📁 TypeScript Files:');
  console.log(`  Categories: ${tsCategories.length}`);
  console.log(`  Subcategories: ${tsSubcategoriesCount}`);
  console.log(`  Tools: ${tsTools.length}`);
  console.log(`  Tool-Subcategory Mappings: ${tsMappingsCount}`);
  console.log(`  Workflow Bundles: ${tsBundles.length}\n`);

  // Get database counts
  const { count: dbCategoriesCount } = await supabase
    .from('tool_categories_v2')
    .select('*', { count: 'exact', head: true });

  const { count: dbSubcategoriesCount } = await supabase
    .from('subcategories_v2')
    .select('*', { count: 'exact', head: true });

  const { count: dbToolsCount } = await supabase
    .from('tools_v2')
    .select('*', { count: 'exact', head: true });

  const { count: dbMappingsCount } = await supabase
    .from('tool_subcategories_v2')
    .select('*', { count: 'exact', head: true });

  const { count: dbBundlesCount } = await supabase
    .from('bundles_v2')
    .select('*', { count: 'exact', head: true });

  console.log('💾 Database:');
  console.log(`  Categories: ${dbCategoriesCount || 0}`);
  console.log(`  Subcategories: ${dbSubcategoriesCount || 0}`);
  console.log(`  Tools: ${dbToolsCount || 0}`);
  console.log(`  Tool-Subcategory Mappings: ${dbMappingsCount || 0}`);
  console.log(`  Workflow Bundles: ${dbBundlesCount || 0}\n`);

  // Compare
  console.log('✅ Comparison:');
  console.log(`  Categories: ${tsCategories.length === dbCategoriesCount ? '✅ Match' : `❌ Mismatch (TS: ${tsCategories.length}, DB: ${dbCategoriesCount})`}`);
  console.log(`  Subcategories: ${tsSubcategoriesCount === dbSubcategoriesCount ? '✅ Match' : `❌ Mismatch (TS: ${tsSubcategoriesCount}, DB: ${dbSubcategoriesCount})`}`);
  console.log(`  Tools: ${tsTools.length === dbToolsCount ? '✅ Match' : `❌ Mismatch (TS: ${tsTools.length}, DB: ${dbToolsCount})`}`);
  console.log(`  Mappings: ${tsMappingsCount === dbMappingsCount ? '✅ Match' : `❌ Mismatch (TS: ${tsMappingsCount}, DB: ${dbMappingsCount})`}`);
  console.log(`  Bundles: ${tsBundles.length === dbBundlesCount ? '✅ Match' : `❌ Mismatch (TS: ${tsBundles.length}, DB: ${dbBundlesCount})`}\n`);

  // Detailed tool check - find missing tools
  if (tsTools.length !== dbToolsCount) {
    console.log('🔍 Checking for missing tools...\n');
    
    const { data: dbTools } = await supabase
      .from('tools_v2')
      .select('slug');
    
    const dbSlugs = new Set(dbTools?.map(t => t.slug) || []);
    const tsSlugs = tsTools.map(t => t.slug || t.id);
    
    const missingInDb = tsSlugs.filter(slug => !dbSlugs.has(slug));
    const extraInDb = Array.from(dbSlugs).filter(slug => !tsSlugs.includes(slug));
    
    if (missingInDb.length > 0) {
      console.log(`❌ Tools in TS but NOT in DB (${missingInDb.length}):`);
      missingInDb.slice(0, 10).forEach(slug => console.log(`  - ${slug}`));
      if (missingInDb.length > 10) console.log(`  ... and ${missingInDb.length - 10} more`);
      console.log('');
    }
    
    if (extraInDb.length > 0) {
      console.log(`⚠️  Tools in DB but NOT in TS (${extraInDb.length}):`);
      extraInDb.slice(0, 10).forEach(slug => console.log(`  - ${slug}`));
      if (extraInDb.length > 10) console.log(`  ... and ${extraInDb.length - 10} more`);
    }
  }
}

compareData().catch(console.error);
