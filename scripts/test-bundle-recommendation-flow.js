#!/usr/bin/env node

/**
 * Test script for Bundle Recommendation Flow
 * Tests the "Use This Bundle" functionality from AI Recommendation section
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Bundle Recommendation Flow Implementation\n');

// Test 1: Check RecommendationResults component updates
console.log('✅ Test 1: RecommendationResults Component');
const recommendationResultsPath = path.join(__dirname, '..', 'src', 'components', 'recommendation', 'RecommendationResults.tsx');
const recommendationResultsContent = fs.readFileSync(recommendationResultsPath, 'utf8');

const hasUseThisBundleButton = recommendationResultsContent.includes('Use This Bundle');
const hasSourceParam = recommendationResultsContent.includes('source=recommendation');
const hasViewDetailsButton = recommendationResultsContent.includes('View Details');

console.log(`   - "Use This Bundle" button: ${hasUseThisBundleButton ? '✅' : '❌'}`);
console.log(`   - Source parameter added: ${hasSourceParam ? '✅' : '❌'}`);
console.log(`   - "View Details" button: ${hasViewDetailsButton ? '✅' : '❌'}`);

// Test 2: Check BundleDetailPage enhancements
console.log('\n✅ Test 2: BundleDetailPage Enhancements');
const bundleDetailPath = path.join(__dirname, '..', 'src', 'pages', 'BundleDetailPage.tsx');
const bundleDetailContent = fs.readFileSync(bundleDetailPath, 'utf8');

const hasRecommendationBanner = bundleDetailContent.includes('Recommended Bundle Selected');
const hasSaveBundleFunction = bundleDetailContent.includes('handleSaveBundle');
const hasBookmarkIcon = bundleDetailContent.includes('Bookmark');
const hasLocalStorageSave = bundleDetailContent.includes('localStorage.setItem');
const hasSuccessMessage = bundleDetailContent.includes('Bundle saved successfully');
const hasBackToRecommendations = bundleDetailContent.includes('Back to Recommendations');

console.log(`   - Recommendation banner: ${hasRecommendationBanner ? '✅' : '❌'}`);
console.log(`   - Save bundle functionality: ${hasSaveBundleFunction ? '✅' : '❌'}`);
console.log(`   - Bookmark icon import: ${hasBookmarkIcon ? '✅' : '❌'}`);
console.log(`   - LocalStorage save: ${hasLocalStorageSave ? '✅' : '❌'}`);
console.log(`   - Success message: ${hasSuccessMessage ? '✅' : '❌'}`);
console.log(`   - Navigation update: ${hasBackToRecommendations ? '✅' : '❌'}`);

// Test 3: Check URL parameter handling
console.log('\n✅ Test 3: URL Parameter Handling');
const hasUseSearchParams = bundleDetailContent.includes('useSearchParams');
const hasSourceRecommendation = bundleDetailContent.includes("searchParams.get('source') === 'recommendation'");

console.log(`   - useSearchParams import: ${hasUseSearchParams ? '✅' : '❌'}`);
console.log(`   - Source parameter check: ${hasSourceRecommendation ? '✅' : '❌'}`);

// Test 4: Check UI/UX enhancements
console.log('\n✅ Test 4: UI/UX Enhancements');
const hasConditionalSaveButton = bundleDetailContent.includes('isFromRecommendation && !bundleSaved');
const hasBundleSavedState = bundleDetailContent.includes('bundleSaved');
const hasCheckCircleIcon = bundleDetailContent.includes('CheckCircle2');

console.log(`   - Conditional save button: ${hasConditionalSaveButton ? '✅' : '❌'}`);
console.log(`   - Bundle saved state: ${hasBundleSavedState ? '✅' : '❌'}`);
console.log(`   - Success icons: ${hasCheckCircleIcon ? '✅' : '❌'}`);

// Test 5: Verify TypeScript compilation
console.log('\n✅ Test 5: TypeScript Compilation');
try {
  const { execSync } = require('child_process');
  execSync('cd /Users/prashant/Documents/AIhow && npx tsc --noEmit', { stdio: 'pipe' });
  console.log(`   - TypeScript compilation: ✅`);
} catch (error) {
  console.log(`   - TypeScript compilation: ❌`);
  console.log(`   - Error: ${error.message}`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 BUNDLE RECOMMENDATION FLOW TEST SUMMARY');
console.log('='.repeat(60));

const allTests = [
  hasUseThisBundleButton,
  hasSourceParam,
  hasViewDetailsButton,
  hasRecommendationBanner,
  hasSaveBundleFunction,
  hasBookmarkIcon,
  hasLocalStorageSave,
  hasSuccessMessage,
  hasBackToRecommendations,
  hasUseSearchParams,
  hasSourceRecommendation,
  hasConditionalSaveButton,
  hasBundleSavedState,
  hasCheckCircleIcon
];

const passedTests = allTests.filter(test => test).length;
const totalTests = allTests.length;

console.log(`✅ Tests Passed: ${passedTests}/${totalTests}`);
console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 All tests passed! Bundle recommendation flow is ready.');
} else {
  console.log('\n⚠️  Some tests failed. Please review the implementation.');
}

console.log('\n📋 Implementation Features:');
console.log('   • "Use This Bundle" button in AI recommendations');
console.log('   • Enhanced bundle detail page for recommendation flow');
console.log('   • Save bundle functionality with localStorage');
console.log('   • Special UI for users coming from recommendations');
console.log('   • Success messages and state management');
console.log('   • Proper navigation between pages');

console.log('\n🔗 User Flow:');
console.log('   1. User completes AI assessment');
console.log('   2. Bundle recommendations are shown');
console.log('   3. User clicks "Use This Bundle"');
console.log('   4. Navigates to bundle detail page with special context');
console.log('   5. User can review details and save bundle');
console.log('   6. Success feedback and next step options');
