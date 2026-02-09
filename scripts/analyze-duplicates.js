/**
 * Analyze if duplicates are actually cross-category mappings
 */

async function analyzeDuplicates() {
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
    
    console.log('🔍 Analyzing duplicate entries...\n');
    console.log('The database design supports ONE tool being in MULTIPLE categories/subcategories');
    console.log('via the many-to-many tool_subcategories_v2 mapping table.\n');
    console.log('Analysis:\n');
    
    duplicates.forEach(slug => {
      const matches = tools.filter(t => (t.slug || t.id) === slug);
      if (matches.length > 1) {
        const categories = matches.map(m => m.categoryId).filter((v, i, a) => a.indexOf(v) === i);
        const allSubcategories = matches.flatMap(m => m.subcategoryIds || []);
        
        console.log(`📌 ${slug}:`);
        console.log(`   Appears: ${matches.length} times`);
        console.log(`   Categories: ${categories.join(', ')}`);
        console.log(`   All subcategories: ${allSubcategories.join(', ')}`);
        
        // Check if they're REALLY different or just duplicates
        if (categories.length > 1) {
          console.log(`   ✅ VALID - Tool belongs to ${categories.length} different categories`);
        } else {
          console.log(`   ❌ DUPLICATE - Same tool, same category, defined multiple times`);
        }
        console.log('');
      }
    });
    
    console.log('\n💡 RECOMMENDATION:');
    console.log('- Valid cross-category tools: Keep but MERGE into ONE tool entry with multiple subcategoryIds');
    console.log('- Duplicate entries: Remove duplicate definitions\n');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

analyzeDuplicates();
