#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the tools data
const toolsPath = path.join(__dirname, '../src/data/tools.ts');
const categoriesPath = path.join(__dirname, '../src/data/categories.ts');

let toolsContent = fs.readFileSync(toolsPath, 'utf8');
let categoriesContent = fs.readFileSync(categoriesPath, 'utf8');

// Extract tools array (simplified parsing)
const toolsMatch = toolsContent.match(/export const tools: Tool\[\] = \[([\s\S]*)\];/);
if (!toolsMatch) {
  console.error('Could not parse tools array');
  process.exit(1);
}

// Extract categories array (simplified parsing)
const categoriesMatch = categoriesContent.match(/export const categories: Category\[\] = \[([\s\S]*)\];/);
if (!categoriesMatch) {
  console.error('Could not parse categories array');
  process.exit(1);
}

// Healthcare AI subcategories
const expectedSubcategories = [
  'diagnostic-ai',
  'medical-research',
  'clinical-documentation',
  'patient-support',
  'clinical-operations',
  'surgical-assistance'
];

console.log('\n🏥 Healthcare AI Implementation Verification\n');
console.log('Expected subcategories:', expectedSubcategories);

// Find all healthcare tools
const healthcareTools = [];
const toolMatches = toolsContent.match(/{\s*id: '[^']*',[\s\S]*?categoryId: 'healthcare-ai'[\s\S]*?}/g);

if (toolMatches) {
  toolMatches.forEach(toolMatch => {
    const idMatch = toolMatch.match(/id: '([^']+)'/);
    const nameMatch = toolMatch.match(/name: '([^']+)'/);
    const subcategoryMatch = toolMatch.match(/subcategoryIds: \[([^\]]+)\]/);
    
    if (idMatch && nameMatch) {
      const subcategoryIds = subcategoryMatch ? 
        subcategoryMatch[1].split(',').map(s => s.trim().replace(/'/g, '')) : [];
      
      healthcareTools.push({
        id: idMatch[1],
        name: nameMatch[1],
        subcategories: subcategoryIds
      });
    }
  });
}

console.log(`\n✅ Found ${healthcareTools.length} Healthcare AI tools:\n`);

// Group tools by subcategory
const toolsBySubcategory = {};
expectedSubcategories.forEach(subcat => {
  toolsBySubcategory[subcat] = [];
});

healthcareTools.forEach(tool => {
  tool.subcategories.forEach(subcat => {
    if (toolsBySubcategory[subcat]) {
      toolsBySubcategory[subcat].push(tool);
    }
  });
});

// Display results
Object.entries(toolsBySubcategory).forEach(([subcategory, tools]) => {
  console.log(`📋 ${subcategory}:`);
  if (tools.length === 0) {
    console.log('   ❌ No tools found');
  } else {
    tools.forEach(tool => {
      console.log(`   ✅ ${tool.name} (${tool.id})`);
    });
  }
  console.log('');
});

// Summary
const totalExpected = expectedSubcategories.length;
const coverageCount = Object.values(toolsBySubcategory).filter(tools => tools.length > 0).length;

console.log(`\n📊 Coverage Summary:`);
console.log(`   Subcategories with tools: ${coverageCount}/${totalExpected}`);
console.log(`   Total healthcare tools: ${healthcareTools.length}`);
console.log(`   Coverage: ${Math.round((coverageCount / totalExpected) * 100)}%\n`);

if (coverageCount === totalExpected) {
  console.log('🎉 All Healthcare AI subcategories have been implemented with tools!');
} else {
  console.log('⚠️  Some subcategories still need tool implementations.');
}

console.log('\n✅ Healthcare AI tools verification completed!\n');