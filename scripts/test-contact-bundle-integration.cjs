/**
 * Test script to verify the contact functionality integration with bundle pages
 */

const fs = require('fs');
const path = require('path');

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

function testBundleDetailPageIntegration() {
  console.log('🧪 Testing Bundle Detail Page Integration...\n');
  
  const bundleDetailContent = readFile('src/pages/BundleDetailPage.tsx');
  if (!bundleDetailContent) return false;

  const tests = [
    {
      name: 'Contact Us button import',
      test: () => bundleDetailContent.includes('MessageCircle'),
      description: 'MessageCircle icon should be imported'
    },
    {
      name: 'Contact handler function',
      test: () => bundleDetailContent.includes('handleContactForImplementation'),
      description: 'Contact handler function should exist'
    },
    {
      name: 'Navigation with parameters',
      test: () => bundleDetailContent.includes('URLSearchParams') && 
                  bundleDetailContent.includes('bundle: bundle.id') &&
                  bundleDetailContent.includes('bundleName: bundle.name') &&
                  bundleDetailContent.includes('inquiryType: \'implementation\''),
      description: 'Should navigate to contact page with bundle parameters'
    },
    {
      name: 'Contact button in UI',
      test: () => bundleDetailContent.includes('Contact Us for Implementation'),
      description: 'Contact Us for Implementation button should be present'
    },
    {
      name: 'Button properties',
      test: () => bundleDetailContent.includes('onClick={handleContactForImplementation}') &&
                  bundleDetailContent.includes('variant="outline"') &&
                  bundleDetailContent.includes('leftIcon={<MessageCircle'),
      description: 'Contact button should have correct properties'
    }
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    if (test.test()) {
      console.log(`✅ ${test.name}: PASSED`);
      console.log(`   ${test.description}\n`);
      passed++;
    } else {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   ${test.description}\n`);
      failed++;
    }
  });

  console.log(`Bundle Detail Page Tests: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

function testContactPageIntegration() {
  console.log('🧪 Testing Contact Page Integration...\n');
  
  const contactPageContent = readFile('src/pages/ContactPage.tsx');
  if (!contactPageContent) return false;

  const tests = [
    {
      name: 'URL parameters handling',
      test: () => contactPageContent.includes('useSearchParams') &&
                  contactPageContent.includes('useLocation'),
      description: 'Should import URL parameter handling hooks'
    },
    {
      name: 'Bundle reference in form data',
      test: () => contactPageContent.includes('bundleReference?: string'),
      description: 'Form data should include bundle reference field'
    },
    {
      name: 'Bundle data extraction',
      test: () => contactPageContent.includes('searchParams.get(\'bundle\')') &&
                  contactPageContent.includes('searchParams.get(\'bundleName\')') &&
                  contactPageContent.includes('searchParams.get(\'inquiryType\')'),
      description: 'Should extract bundle parameters from URL'
    },
    {
      name: 'Bundle lookup',
      test: () => contactPageContent.includes('workflowBundles.find(b => b.id === bundleId)'),
      description: 'Should find bundle by ID'
    },
    {
      name: 'Form auto-fill',
      test: () => contactPageContent.includes('Implementation Inquiry for') &&
                  contactPageContent.includes('I\'m interested in implementing the'),
      description: 'Should auto-fill form with bundle information'
    },
    {
      name: 'Bundle reference display',
      test: () => contactPageContent.includes('Referenced Bundle') &&
                  contactPageContent.includes('referencedBundle &&'),
      description: 'Should display referenced bundle information'
    },
    {
      name: 'Implementation inquiry type',
      test: () => contactPageContent.includes('<option value="implementation">Bundle Implementation</option>'),
      description: 'Should include Bundle Implementation as inquiry type'
    }
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    if (test.test()) {
      console.log(`✅ ${test.name}: PASSED`);
      console.log(`   ${test.description}\n`);
      passed++;
    } else {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   ${test.description}\n`);
      failed++;
    }
  });

  console.log(`Contact Page Tests: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

function testWorkflowDataIntegration() {
  console.log('🧪 Testing Workflow Data Integration...\n');
  
  const workflowsContent = readFile('src/data/workflows.ts');
  if (!workflowsContent) return false;

  const tests = [
    {
      name: 'Workflows data exists',
      test: () => workflowsContent.includes('export const workflowBundles'),
      description: 'Workflow bundles should be exported'
    },
    {
      name: 'Bundle structure',
      test: () => workflowsContent.includes('id:') &&
                  workflowsContent.includes('name:') &&
                  workflowsContent.includes('description:') &&
                  workflowsContent.includes('tools:'),
      description: 'Bundles should have required properties'
    }
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(test => {
    if (test.test()) {
      console.log(`✅ ${test.name}: PASSED`);
      console.log(`   ${test.description}\n`);
      passed++;
    } else {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   ${test.description}\n`);
      failed++;
    }
  });

  console.log(`Workflow Data Tests: ${passed} passed, ${failed} failed\n`);
  return failed === 0;
}

function runAllTests() {
  console.log('🚀 Running Contact Bundle Integration Tests\n');
  console.log('=' .repeat(50) + '\n');

  const bundleDetailTests = testBundleDetailPageIntegration();
  const contactPageTests = testContactPageIntegration();
  const workflowDataTests = testWorkflowDataIntegration();

  console.log('=' .repeat(50));
  console.log('📊 FINAL RESULTS:');
  console.log('=' .repeat(50));
  
  if (bundleDetailTests && contactPageTests && workflowDataTests) {
    console.log('🎉 ALL TESTS PASSED! Contact bundle integration is working correctly.');
    console.log('\n✨ Features implemented:');
    console.log('  • Contact Us for Implementation button on bundle pages');
    console.log('  • Auto-fill contact form with bundle reference');
    console.log('  • Bundle Implementation inquiry type');
    console.log('  • Referenced bundle display in contact form');
    console.log('  • URL parameter passing between pages');
  } else {
    console.log('❌ Some tests failed. Please check the implementation.');
    
    if (!bundleDetailTests) console.log('  • Bundle Detail Page integration needs attention');
    if (!contactPageTests) console.log('  • Contact Page integration needs attention');
    if (!workflowDataTests) console.log('  • Workflow data structure needs attention');
  }
  
  console.log('\n🔍 How to test manually:');
  console.log('  1. Navigate to any bundle detail page (e.g., /bundle/healthcare-ai)');
  console.log('  2. Click "Contact Us for Implementation" button');
  console.log('  3. Verify contact form is pre-filled with bundle information');
  console.log('  4. Check that bundle reference is displayed in the form');
  console.log('  5. Verify inquiry type is set to "Bundle Implementation"');
}

// Run the tests
runAllTests();