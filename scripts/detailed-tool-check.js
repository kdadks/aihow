/**
 * Detailed tool comparison
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
    return tools;
  } catch (e) {
    console.error('❌ Could not import static data. Run with: npx tsx scripts/detailed-tool-check.js');
    throw e;
  }
}

async function detailedCheck() {
  console.log('🔍 Detailed tool comparison...\n');

  const tsTools = await loadStaticData();
  
  console.log(`TS Tools array length: ${tsTools.length}`);
  
  // Check for tools with missing slugs
  const toolsWithoutSlug = tsTools.filter(t => !t.slug && !t.id);
  console.log(`Tools without slug or id: ${toolsWithoutSlug.length}`);
  
  // Check for duplicate slugs
  const slugCounts = {};
  tsTools.forEach(t => {
    const slug = t.slug || t.id;
    slugCounts[slug] = (slugCounts[slug] || 0) + 1;
  });
  
  const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
  console.log(`\nDuplicate slugs in TS: ${duplicates.length}`);
  if (duplicates.length > 0) {
    console.log('Duplicates:');
    duplicates.forEach(([slug, count]) => {
      console.log(`  ${slug}: ${count} times`);
    });
  }
  
  // Get unique slugs
  const uniqueTsSlugs = new Set(tsTools.map(t => t.slug || t.id).filter(Boolean));
  console.log(`\nUnique tool slugs in TS: ${uniqueTsSlugs.size}`);
  
  const { data: dbTools } = await supabase
    .from('tools_v2')
    .select('slug, name');
  
  console.log(`DB Tools count: ${dbTools?.length || 0}`);
  
  const dbSlugs = new Set(dbTools?.map(t => t.slug) || []);
  console.log(`Unique tool slugs in DB: ${dbSlugs.size}`);
  
  // Find differences
  const missingInDb = Array.from(uniqueTsSlugs).filter(slug => !dbSlugs.has(slug));
  const extraInDb = Array.from(dbSlugs).filter(slug => !uniqueTsSlugs.has(slug));
  
  console.log(`\n❌ Missing in DB: ${missingInDb.length}`);
  if (missingInDb.length > 0) {
    missingInDb.forEach(slug => {
      const tool = tsTools.find(t => (t.slug || t.id) === slug);
      console.log(`  - ${slug} (${tool?.name || 'unknown'})`);
    });
  }
  
  console.log(`\n⚠️  Extra in DB: ${extraInDb.length}`);
  if (extraInDb.length > 0) {
    extraInDb.forEach(slug => {
      const tool = dbTools?.find(t => t.slug === slug);
      console.log(`  - ${slug} (${tool?.name || 'unknown'})`);
    });
  }
}

detailedCheck().catch(console.error);
