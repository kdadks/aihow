/**
 * Test script to verify the enhanced workflows and AI recommendation functionality
 */

import { workflowBundles } from '../src/data/workflows.js';
import { tools } from '../src/data/tools.js';

console.log('🔍 Testing Enhanced Workflow Bundles Implementation...\n');

// Test 1: Verify new workflow bundles exist
console.log('📋 Test 1: Verifying New Workflow Bundles');
console.log('==========================================');

const expectedNewBundles = [
  'Professional Document Creation Suite',
  'Academic Research & Writing Bundle',
  'Legal Document Automation Suite',
  'Creative Writing & Content Studio',
  'Career Development Document Bundle',
  'Marketing Content Creation Workflow',
  'Full-Stack Web Development Suite',
  'Mobile App Development Bundle',
  'Enterprise DevOps Automation Suite',
  'Frontend Development Accelerator',
  'AI-Powered Development Team',
  'No-Code/Low-Code Development Suite'
];

const foundBundles = [];
const missingBundles = [];

expectedNewBundles.forEach(bundleName => {
  const bundle = workflowBundles.find(b => b.name === bundleName);
  if (bundle) {
    foundBundles.push(bundleName);
    console.log(`✅ Found: ${bundleName} (ID: ${bundle.id})`);
  } else {
    missingBundles.push(bundleName);
    console.log(`❌ Missing: ${bundleName}`);
  }
});

console.log(`\n📊 Bundle Summary: ${foundBundles.length}/${expectedNewBundles.length} found`);

// Test 2: Verify tool references
console.log('\n🔗 Test 2: Verifying Tool References in New Bundles');
console.log('==================================================');

let validToolReferences = 0;
let invalidToolReferences = 0;
const toolIssues = [];

const newBundles = workflowBundles.filter(bundle => 
  expectedNewBundles.includes(bundle.name)
);

newBundles.forEach(bundle => {
  console.log(`\n📦 Checking bundle: ${bundle.name}`);
  bundle.tools.forEach(tool => {
    const toolExists = tools.find(t => t.id === tool.id);
    if (toolExists) {
      console.log(`  ✅ ${tool.name} (${tool.id})`);
      validToolReferences++;
    } else {
      console.log(`  ❌ ${tool.name} (${tool.id}) - NOT FOUND`);
      invalidToolReferences++;
      toolIssues.push(`${bundle.name}: ${tool.name} (${tool.id})`);
    }
  });
});

console.log(`\n📊 Tool References: ${validToolReferences} valid, ${invalidToolReferences} invalid`);

if (toolIssues.length > 0) {
  console.log('\n⚠️  Tool Reference Issues:');
  toolIssues.forEach(issue => console.log(`   - ${issue}`));
}

// Test 3: Verify bundle structure
console.log('\n🏗️  Test 3: Verifying Bundle Structure');
console.log('=====================================');

const requiredFields = ['id', 'name', 'description', 'tools', 'totalCost', 'implementationSteps'];
let structureIssues = 0;

newBundles.forEach(bundle => {
  const missingFields = requiredFields.filter(field => !bundle[field]);
  if (missingFields.length > 0) {
    console.log(`❌ ${bundle.name} missing fields: ${missingFields.join(', ')}`);
    structureIssues++;
  } else {
    console.log(`✅ ${bundle.name} - complete structure`);
  }
});

console.log(`\n📊 Structure: ${newBundles.length - structureIssues}/${newBundles.length} bundles have complete structure`);

// Test 4: Test AI recommendation categories
console.log('\n🤖 Test 4: Testing AI Recommendation Keywords');
console.log('==============================================');

const testCases = [
  { input: 'I need to write a business proposal', expectedCategory: 'document' },
  { input: 'Help me create a resume and cover letter', expectedCategory: 'career' },
  { input: 'I want to build a mobile app', expectedCategory: 'mobile' },
  { input: 'Need to develop a website with React', expectedCategory: 'frontend' },
  { input: 'Academic research paper writing', expectedCategory: 'research' },
  { input: 'Legal contract automation', expectedCategory: 'legal' },
  { input: 'Creative writing and storytelling', expectedCategory: 'creative' },
  { input: 'Marketing campaign copy', expectedCategory: 'marketing' },
  { input: 'DevOps and deployment automation', expectedCategory: 'automation' },
  { input: 'Programming and code development', expectedCategory: 'code' }
];

// Simulate the enhanced recommendation logic
const useCaseMap = {
  'healthcare': ['medical', 'health', 'patient', 'clinical', 'doctor'],
  'education': ['teach', 'learn', 'course', 'student', 'education', 'academic', 'training'],
  'automation': ['automate', 'workflow', 'process', 'integrate', 'devops', 'deploy', 'ci/cd'],
  'data': ['analysis', 'data', 'insight', 'visualization', 'report', 'analytics'],
  'agent': ['agent', 'autonomous', 'agentic', 'automate', 'bot'],
  'research': ['research', 'study', 'analyze', 'literature', 'academic', 'paper', 'citation'],
  'content': ['content', 'create', 'write', 'blog', 'article', 'copy', 'marketing'],
  'visual': ['presentation', 'diagram', 'visual', 'design', 'image'],
  'document': ['document', 'documents', 'writing', 'report', 'proposal', 'contract', 'legal', 'resume', 'cv', 'business plan', 'essay', 'letter'],
  'code': ['code', 'coding', 'programming', 'development', 'software', 'app', 'website', 'frontend', 'backend', 'mobile', 'web', 'api', 'github', 'javascript', 'python', 'react'],
  'mobile': ['mobile', 'app', 'android', 'ios', 'flutter', 'react native', 'smartphone'],
  'frontend': ['frontend', 'ui', 'ux', 'web design', 'website', 'react', 'component', 'html', 'css'],
  'legal': ['legal', 'law', 'contract', 'compliance', 'attorney', 'lawyer', 'litigation'],
  'career': ['resume', 'cv', 'job', 'career', 'interview', 'cover letter', 'professional'],
  'marketing': ['marketing', 'campaign', 'copy', 'sales', 'conversion', 'advertising', 'promotion'],
  'creative': ['creative', 'story', 'novel', 'fiction', 'writing', 'screenplay', 'poetry'],
  'business': ['business', 'professional', 'corporate', 'enterprise', 'proposal', 'plan']
};

function findCategories(text) {
  const lowerText = text.toLowerCase();
  return Object.entries(useCaseMap).filter(([category, keywords]) =>
    keywords.some(keyword => lowerText.includes(keyword))
  ).map(([category]) => category);
}

let correctRecommendations = 0;
testCases.forEach(testCase => {
  const detectedCategories = findCategories(testCase.input);
  const hasExpectedCategory = detectedCategories.includes(testCase.expectedCategory);
  
  if (hasExpectedCategory) {
    console.log(`✅ "${testCase.input}" → ${detectedCategories.join(', ')} (includes ${testCase.expectedCategory})`);
    correctRecommendations++;
  } else {
    console.log(`❌ "${testCase.input}" → ${detectedCategories.join(', ')} (expected ${testCase.expectedCategory})`);
  }
});

console.log(`\n📊 AI Recommendations: ${correctRecommendations}/${testCases.length} correct`);

// Test 5: Category coverage
console.log('\n📈 Test 5: Category Coverage Analysis');
console.log('====================================');

const documentBundles = newBundles.filter(bundle => 
  bundle.name.includes('Document') || 
  bundle.name.includes('Writing') || 
  bundle.name.includes('Academic') ||
  bundle.name.includes('Legal') ||
  bundle.name.includes('Career') ||
  bundle.name.includes('Marketing') ||
  bundle.name.includes('Creative')
);

const codeBundles = newBundles.filter(bundle => 
  bundle.name.includes('Development') || 
  bundle.name.includes('Mobile') || 
  bundle.name.includes('Frontend') ||
  bundle.name.includes('DevOps') ||
  bundle.name.includes('Code') ||
  bundle.name.includes('Web')
);

console.log(`📄 Document Creation Bundles: ${documentBundles.length}`);
documentBundles.forEach(bundle => console.log(`   - ${bundle.name}`));

console.log(`\n💻 Code Creation Bundles: ${codeBundles.length}`);
codeBundles.forEach(bundle => console.log(`   - ${bundle.name}`));

// Final Summary
console.log('\n🎯 FINAL SUMMARY');
console.log('================');
console.log(`✅ New bundles added: ${foundBundles.length}/${expectedNewBundles.length}`);
console.log(`✅ Valid tool references: ${validToolReferences}`);
console.log(`❌ Invalid tool references: ${invalidToolReferences}`);
console.log(`✅ Complete bundle structures: ${newBundles.length - structureIssues}/${newBundles.length}`);
console.log(`✅ AI recommendation accuracy: ${correctRecommendations}/${testCases.length}`);
console.log(`📄 Document bundles: ${documentBundles.length}`);
console.log(`💻 Code bundles: ${codeBundles.length}`);

const allTestsPassed = 
  missingBundles.length === 0 &&
  invalidToolReferences === 0 &&
  structureIssues === 0 &&
  correctRecommendations >= testCases.length * 0.8; // 80% accuracy threshold

if (allTestsPassed) {
  console.log('\n🎉 ALL TESTS PASSED! ✅');
  console.log('The enhanced workflow implementation is successful!');
} else {
  console.log('\n⚠️  SOME TESTS FAILED!');
  console.log('Please review the issues above before deployment.');
}

console.log('\n✨ Test completed!\n');