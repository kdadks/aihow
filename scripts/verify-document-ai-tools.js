#!/usr/bin/env node

/**
 * Script to verify that the new AI document creation tools have been added correctly
 */

// Since this is a test script, we'll simulate the TypeScript imports
// In a real environment, this would be handled by the build system

const newDocumentTools = [
  'chatgpt-document',
  'grammarly-go', 
  'jasper-ai',
  'tome',
  'writesonic',
  'scispace',
  'lexis-ai',
  'harvey-ai',
  'litera-one',
  'teal',
  'rezi',
  'kickresume',
  'zety',
  'resumai-wonsulting'
];

const expectedSubcategories = {
  'general-documents': ['chatgpt-document', 'grammarly-go'],
  'business-documents': ['jasper-ai', 'tome', 'writesonic'],
  'academic-research': ['scispace'],
  'legal-documents': ['lexis-ai', 'harvey-ai', 'litera-one'],
  'resume-documents': ['teal', 'rezi', 'kickresume', 'zety', 'resumai-wonsulting'],
  'creative-writing': ['writesonic']
};

console.log('🔍 Verifying Document Creation AI Tools Implementation...\n');

// Test 1: Check if tools exist in categories
console.log('📋 Test 1: Checking subcategory tool assignments...');
let subcategoryTests = 0;
let subcategoryPassed = 0;

try {
  // Read categories file
  const fs = require('fs');
  const categoriesContent = fs.readFileSync('./src/data/categories.ts', 'utf8');
  
  Object.entries(expectedSubcategories).forEach(([subcategoryId, expectedTools]) => {
    subcategoryTests++;
    
    // Find the subcategory in the file
    const subcategoryRegex = new RegExp(`id: '${subcategoryId}'[\\s\\S]*?tools: \\[([^\\]]+)\\]`, 'm');
    const match = categoriesContent.match(subcategoryRegex);
    
    if (match) {
      const toolsString = match[1];
      const foundTools = expectedTools.filter(tool => toolsString.includes(`'${tool}'`));
      
      if (foundTools.length === expectedTools.length) {
        console.log(`✅ ${subcategoryId}: All ${expectedTools.length} expected tools found`);
        subcategoryPassed++;
      } else {
        console.log(`❌ ${subcategoryId}: ${foundTools.length}/${expectedTools.length} tools found`);
        console.log(`   Missing: ${expectedTools.filter(t => !foundTools.includes(t)).join(', ')}`);
      }
    } else {
      console.log(`❌ ${subcategoryId}: Subcategory not found in categories file`);
    }
  });
} catch (error) {
  console.log(`❌ Error reading categories file: ${error.message}`);
}

// Test 2: Check if tool definitions exist
console.log('\n🔧 Test 2: Checking tool definitions...');
let toolTests = 0;
let toolsPassed = 0;

try {
  const toolsContent = fs.readFileSync('./src/data/tools.ts', 'utf8');
  
  newDocumentTools.forEach(toolId => {
    toolTests++;
    
    // Check if tool definition exists
    const toolRegex = new RegExp(`id: '${toolId}'`, 'm');
    const categoryRegex = new RegExp(`id: '${toolId}'[\\s\\S]*?categoryId: 'document-creation'`, 'm');
    
    if (toolRegex.test(toolsContent)) {
      if (categoryRegex.test(toolsContent)) {
        console.log(`✅ ${toolId}: Tool definition found with correct category`);
        toolsPassed++;
      } else {
        console.log(`⚠️  ${toolId}: Tool found but may not have correct categoryId`);
      }
    } else {
      console.log(`❌ ${toolId}: Tool definition not found`);
    }
  });
} catch (error) {
  console.log(`❌ Error reading tools file: ${error.message}`);
}

// Test 3: Check for required fields in tool definitions
console.log('\n📋 Test 3: Checking tool definition completeness...');
let completenessTests = 0;
let completenessPassed = 0;

const requiredFields = ['id', 'name', 'slug', 'description', 'shortDescription', 'logo', 'website', 'categoryId', 'subcategoryIds', 'pricing', 'features', 'limitations', 'rating', 'reviewCount'];

try {
  const toolsContent = fs.readFileSync('./src/data/tools.ts', 'utf8');
  
  // Sample a few tools for completeness check
  const sampleTools = ['chatgpt-document', 'teal', 'jasper-ai'];
  
  sampleTools.forEach(toolId => {
    completenessTests++;
    
    const toolStartRegex = new RegExp(`{[\\s]*id: '${toolId}'`, 'm');
    const toolStartMatch = toolsContent.match(toolStartRegex);
    
    if (toolStartMatch) {
      const startIndex = toolStartMatch.index;
      // Find the matching closing brace (simplified approach)
      let braceCount = 0;
      let endIndex = startIndex;
      
      for (let i = startIndex; i < toolsContent.length; i++) {
        if (toolsContent[i] === '{') braceCount++;
        if (toolsContent[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
      
      const toolDefinition = toolsContent.substring(startIndex, endIndex + 1);
      const missingFields = requiredFields.filter(field => !toolDefinition.includes(`${field}:`));
      
      if (missingFields.length === 0) {
        console.log(`✅ ${toolId}: All required fields present`);
        completenessPassed++;
      } else {
        console.log(`⚠️  ${toolId}: Missing fields: ${missingFields.join(', ')}`);
      }
    } else {
      console.log(`❌ ${toolId}: Tool definition not found for completeness check`);
    }
  });
} catch (error) {
  console.log(`❌ Error checking tool completeness: ${error.message}`);
}

// Summary
console.log('\n📊 VERIFICATION SUMMARY');
console.log('========================');
console.log(`Subcategory Tests: ${subcategoryPassed}/${subcategoryTests} passed`);
console.log(`Tool Definition Tests: ${toolsPassed}/${toolTests} passed`);
console.log(`Completeness Tests: ${completenessPassed}/${completenessTests} passed`);

const totalTests = subcategoryTests + toolTests + completenessTests;
const totalPassed = subcategoryPassed + toolsPassed + completenessPassed;
const successRate = ((totalPassed / totalTests) * 100).toFixed(2);

console.log(`\nOverall: ${totalPassed}/${totalTests} tests passed (${successRate}%)`);

if (totalPassed === totalTests) {
  console.log('\n🎉 All AI document creation tools have been successfully implemented!');
  console.log('\nTools added:');
  console.log('- General Documents: ChatGPT, Grammarly');
  console.log('- Business Documents: Jasper AI, Tome, Writesonic');
  console.log('- Academic Research: SciSpace, DeepSeek');
  console.log('- Legal Documents: Lexis+ AI, Harvey.ai, Litera One');
  console.log('- Resume Creation: Teal, Rezi, Kickresume, Zety, ResumAI by Wonsulting');
  process.exit(0);
} else {
  console.log('\n⚠️  Some issues were found. Please review the output above.');
  process.exit(1);
}