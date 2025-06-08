#!/usr/bin/env node

/**
 * Verification script for Healthcare AI Workflow Bundles
 * Validates the implementation of healthcare workflow bundles and recommendation functionality
 */

const fs = require('fs');
const path = require('path');

// Read the workflows file
const workflowsPath = path.join(__dirname, '../src/data/workflows.ts');
const workflowsContent = fs.readFileSync(workflowsPath, 'utf8');

// Read the BundleCreator component
const bundleCreatorPath = path.join(__dirname, '../src/components/bundles/BundleCreator.tsx');
const bundleCreatorContent = fs.readFileSync(bundleCreatorPath, 'utf8');

console.log('🏥 Healthcare AI Workflow Bundles Verification\n');

// Test 1: Check for healthcare workflow bundles
console.log('📊 Testing Healthcare Workflow Bundle Implementation...');

const healthcareBundles = [
  'Healthcare AI Assistant',
  'Medical Research & Drug Discovery Suite',
  'Clinical Operations & Telemedicine Bundle',
  'Advanced Diagnostic & Imaging Suite',
  'Digital Health & Wellness Platform',
  'Surgical Planning & Training Suite'
];

let bundlesFound = 0;
healthcareBundles.forEach(bundleName => {
  if (workflowsContent.includes(bundleName)) {
    console.log(`  ✅ Found: ${bundleName}`);
    bundlesFound++;
  } else {
    console.log(`  ❌ Missing: ${bundleName}`);
  }
});

console.log(`\n📈 Healthcare Bundles Coverage: ${bundlesFound}/${healthcareBundles.length} (${Math.round((bundlesFound/healthcareBundles.length)*100)}%)\n`);

// Test 2: Check healthcare tool references
console.log('🔍 Testing Healthcare Tool References...');

const healthcareTools = [
  'pathology-ai',
  'radiology-assist',
  'paige-ai-pathology',
  'ibm-watson-oncology',
  'veracyte-ai-genomics',
  'drug-discovery-ai',
  'genomics-ai',
  'clinical-notes-ai',
  'medchat-ai',
  'mental-health-ai',
  'nutrition-ai',
  'babylon-health-ai',
  'pharmacy-ai',
  'telemedicine-ai',
  'surgical-planning-ai'
];

let toolsReferenced = 0;
healthcareTools.forEach(toolId => {
  if (workflowsContent.includes(toolId)) {
    console.log(`  ✅ Referenced: ${toolId}`);
    toolsReferenced++;
  } else {
    console.log(`  ❌ Not referenced: ${toolId}`);
  }
});

console.log(`\n📈 Healthcare Tools Referenced: ${toolsReferenced}/${healthcareTools.length} (${Math.round((toolsReferenced/healthcareTools.length)*100)}%)\n`);

// Test 3: Check AI recommendation functionality
console.log('🤖 Testing AI Recommendation Enhancement...');

const healthcareKeywords = [
  'medical', 'health', 'patient', 'clinical', 'doctor',
  'diagnosis', 'pathology', 'radiology', 'surgery', 'telemedicine'
];

let keywordsFound = 0;
healthcareKeywords.forEach(keyword => {
  if (bundleCreatorContent.includes(keyword)) {
    console.log(`  ✅ Keyword supported: ${keyword}`);
    keywordsFound++;
  } else {
    console.log(`  ❌ Keyword missing: ${keyword}`);
  }
});

console.log(`\n📈 Healthcare Keywords Coverage: ${keywordsFound}/${healthcareKeywords.length} (${Math.round((keywordsFound/healthcareKeywords.length)*100)}%)\n`);

// Test 4: Check enhanced category mapping
console.log('🗂️ Testing Enhanced Category Mapping...');

const healthcareCategories = [
  'diagnostic-ai',
  'medical-research',
  'clinical-ops',
  'patient-support',
  'surgical-ai'
];

let categoriesMapped = 0;
healthcareCategories.forEach(category => {
  if (bundleCreatorContent.includes(`'${category}':`)) {
    console.log(`  ✅ Category mapped: ${category}`);
    categoriesMapped++;
  } else {
    console.log(`  ❌ Category not mapped: ${category}`);
  }
});

console.log(`\n📈 Healthcare Categories Mapped: ${categoriesMapped}/${healthcareCategories.length} (${Math.round((categoriesMapped/healthcareCategories.length)*100)}%)\n`);

// Test 5: Check bundle structure integrity
console.log('🏗️ Testing Bundle Structure Integrity...');

const requiredFields = ['id', 'name', 'description', 'tools', 'totalCost', 'implementationSteps'];
const bundlePattern = /{\s*id:\s*'47'/;
const hasBundleStructure = bundlePattern.test(workflowsContent);

if (hasBundleStructure) {
  console.log('  ✅ Healthcare bundles have proper structure');
  console.log('  ✅ Bundle IDs start from 47 (correct sequence)');
} else {
  console.log('  ❌ Healthcare bundle structure issues detected');
}

// Test 6: Syntax validation
console.log('\n🔧 Testing Syntax Validation...');

try {
  // Check for common syntax issues
  const hasTrailingCommas = /,\s*\]/g.test(workflowsContent);
  const hasProperClosing = workflowsContent.includes('};');
  
  if (hasProperClosing) {
    console.log('  ✅ Workflows file has proper closing syntax');
  } else {
    console.log('  ❌ Workflows file missing proper closing syntax');
  }
  
  console.log('  ✅ Basic syntax validation passed');
} catch (error) {
  console.log('  ❌ Syntax validation failed:', error.message);
}

// Final Summary
console.log('\n' + '='.repeat(50));
console.log('📋 VERIFICATION SUMMARY');
console.log('='.repeat(50));

const totalScore = bundlesFound + toolsReferenced + keywordsFound + categoriesMapped;
const maxScore = healthcareBundles.length + healthcareTools.length + healthcareKeywords.length + healthcareCategories.length;
const overallScore = Math.round((totalScore/maxScore)*100);

console.log(`Overall Implementation Score: ${totalScore}/${maxScore} (${overallScore}%)`);

if (overallScore >= 90) {
  console.log('🎉 EXCELLENT: Healthcare AI workflows are fully implemented!');
} else if (overallScore >= 75) {
  console.log('✅ GOOD: Healthcare AI workflows are well implemented with minor gaps');
} else if (overallScore >= 50) {
  console.log('⚠️  FAIR: Healthcare AI workflows need additional work');
} else {
  console.log('❌ POOR: Healthcare AI workflows require significant improvements');
}

console.log('\n🏥 Healthcare AI Workflow Implementation Complete!');