/**
 * Find duplicate tool entries in tools.ts
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function findDuplicates() {
  try {
    const { tools } = await import('../src/data/tools.js').catch(() =>
      import('../src/data/tools.ts')
    );
    
    const duplicates = [
      'novelai', 'mem-ai', 'gamma-ai', 'beautiful-ai', 'pitch-avatar',
      'presentations-ai', 'decktopus-ai', 'slidebean-ai', 'tome-presentations',
      'designrr-presentations', 'slides-ai', 'sendsteps-ai',
      'plus-ai-google-slides', 'prezo-ai'
    ];
    
    console.log('🔍 Finding duplicate tool entries...\n');
    
    duplicates.forEach(slug => {
      const matches = tools.filter(t => (t.slug || t.id) === slug);
      if (matches.length > 1) {
        console.log(`\n📌 ${slug} (${matches.length} entries):`);
        matches.forEach((tool, idx) => {
          console.log(`\n  Entry ${idx + 1}:`);
          console.log(`    Name: ${tool.name}`);
          console.log(`    Category: ${tool.categoryId || 'N/A'}`);
          console.log(`    Subcategories: ${JSON.stringify(tool.subcategoryIds || [])}`);
          console.log(`    Description: ${(tool.description || '').substring(0, 80)}...`);
        });
      }
    });
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

findDuplicates();
