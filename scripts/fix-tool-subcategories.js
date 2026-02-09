/**
 * Script to update tools.ts with correct subcategoryIds based on categories.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load categories to get the correct tool-subcategory mappings
const { categories } = await import('../src/data/categories.ts');

// Build a map of tool slug -> subcategory slugs
const toolSubcategoryMap = new Map();

categories.forEach(category => {
  (category.subcategories || []).forEach(subcategory => {
    (subcategory.tools || []).forEach(toolSlug => {
      if (!toolSubcategoryMap.has(toolSlug)) {
        toolSubcategoryMap.set(toolSlug, []);
      }
      toolSubcategoryMap.get(toolSlug).push(subcategory.id);
    });
  });
});

console.log('🔍 Tool-Subcategory mappings from categories.ts:');
console.log(`   Total tools mapped: ${toolSubcategoryMap.size}\n`);

// Show some examples
const codeCreationTools = Array.from(toolSubcategoryMap.entries())
  .filter(([slug, subs]) => subs.some(s => ['coding-assistants', 'code-generation', 'code-optimization'].includes(s)));

console.log('📝 Example mappings for code creation tools:');
codeCreationTools.slice(0, 10).forEach(([slug, subs]) => {
  console.log(`   ${slug}: [${subs.join(', ')}]`);
});

console.log('\n✅ Run the seed script to apply these mappings:');
console.log('   npx tsx scripts/seed-v2-data.js\n');
