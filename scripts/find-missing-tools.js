/**
 * Find missing tools
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
    console.error('❌ Could not import static data. Run with: npx tsx scripts/find-missing-tools.js');
    throw e;
  }
}

async function findMissing() {
  console.log('🔍 Finding missing tools...\n');

  const tsTools = await loadStaticData();
  
  const { data: dbTools } = await supabase
    .from('tools_v2')
    .select('slug, name');
  
  const dbSlugs = new Set(dbTools?.map(t => t.slug) || []);
  const tsSlugs = tsTools.map(t => ({ slug: t.slug || t.id, name: t.name }));
  
  const missingInDb = tsSlugs.filter(t => !dbSlugs.has(t.slug));
  
  console.log(`❌ ${missingInDb.length} tools in TS but NOT in DB:\n`);
  missingInDb.forEach((t, idx) => {
    console.log(`${idx + 1}. ${t.name} (${t.slug})`);
  });
}

findMissing().catch(console.error);
