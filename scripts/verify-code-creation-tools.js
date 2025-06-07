#!/usr/bin/env node

// Script to verify Code Creation AI tools implementation
import { tools } from '../src/data/tools.ts';
import { categories } from '../src/data/categories.ts';

console.log('🔍 Verifying Code Creation AI Tools Implementation...\n');

// Find the code-creation category
const codeCreationCategory = categories.find(cat => cat.id === 'code-creation');

if (!codeCreationCategory) {
  console.error('❌ Code Creation category not found!');
  process.exit(1);
}

console.log(`✅ Found Code Creation category: ${codeCreationCategory.name}`);
console.log(`📝 Description: ${codeCreationCategory.description}\n`);

// Check the three specific subcategories
const targetSubcategories = [
  'mobile-development',
  'frontend-development', 
  'devops-cicd'
];

const results = {
  total: 0,
  implemented: 0,
  missing: []
};

targetSubcategories.forEach(subcategoryId => {
  const subcategory = codeCreationCategory.subcategories.find(sub => sub.id === subcategoryId);
  
  if (!subcategory) {
    console.error(`❌ Subcategory ${subcategoryId} not found!`);
    return;
  }

  console.log(`\n📂 ${subcategory.name} (${subcategory.tools.length} tools expected)`);
  console.log(`   Description: ${subcategory.description}`);
  
  const implementedTools = [];
  const missingTools = [];
  
  subcategory.tools.forEach(toolId => {
    const tool = tools.find(t => t.id === toolId);
    results.total++;
    
    if (tool) {
      implementedTools.push(tool);
      results.implemented++;
      console.log(`   ✅ ${tool.name} - ${tool.shortDescription}`);
    } else {
      missingTools.push(toolId);
      results.missing.push({ subcategory: subcategory.name, toolId });
      console.log(`   ❌ Missing: ${toolId}`);
    }
  });
  
  console.log(`   📊 Status: ${implementedTools.length}/${subcategory.tools.length} tools implemented`);
});

console.log('\n📈 Overall Results:');
console.log(`   Total tools expected: ${results.total}`);
console.log(`   Tools implemented: ${results.implemented}`);
console.log(`   Implementation rate: ${((results.implemented / results.total) * 100).toFixed(1)}%`);

if (results.missing.length === 0) {
  console.log('\n🎉 All Code Creation AI tools are properly implemented!');
  process.exit(0);
} else {
  console.log('\n⚠️  Missing tools:');
  results.missing.forEach(item => {
    console.log(`   - ${item.toolId} (${item.subcategory})`);
  });
  process.exit(1);
}