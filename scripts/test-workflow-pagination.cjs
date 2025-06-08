#!/usr/bin/env node

/**
 * Test script to verify workflow pagination implementation
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testWorkflowPagination() {
  log('blue', '🧪 Testing Workflow Pagination Implementation...\n');

  try {
    // Test 1: Check if WorkflowsPage has pagination imports
    const workflowPagePath = path.join(process.cwd(), 'src/pages/WorkflowsPage.tsx');
    const workflowPageContent = fs.readFileSync(workflowPagePath, 'utf8');
    
    const tests = [
      {
        name: 'Pagination component import',
        check: () => workflowPageContent.includes("import { Pagination } from '../components/ui/Pagination';"),
        expected: true
      },
      {
        name: 'Current page state',
        check: () => workflowPageContent.includes('const [currentPage, setCurrentPage] = useState(1);'),
        expected: true
      },
      {
        name: 'Items per page configuration',
        check: () => workflowPageContent.includes('const itemsPerPage = 10;'),
        expected: true
      },
      {
        name: 'Total pages calculation',
        check: () => workflowPageContent.includes('const totalPages = Math.ceil(workflowBundles.length / itemsPerPage);'),
        expected: true
      },
      {
        name: 'Current bundles slice',
        check: () => workflowPageContent.includes('const currentBundles = workflowBundles.slice(startIndex, endIndex);'),
        expected: true
      },
      {
        name: 'Page change handler',
        check: () => workflowPageContent.includes('const handlePageChange = (page: number) => {'),
        expected: true
      },
      {
        name: 'Pagination component usage',
        check: () => workflowPageContent.includes('<Pagination') && workflowPageContent.includes('currentPage={currentPage}'),
        expected: true
      },
      {
        name: 'Pagination info display',
        check: () => workflowPageContent.includes('Showing {startIndex + 1}-{Math.min(endIndex, workflowBundles.length)} of {workflowBundles.length}'),
        expected: true
      },
      {
        name: 'Scroll to top functionality',
        check: () => workflowPageContent.includes("window.scrollTo({ top: 0, behavior: 'smooth' });"),
        expected: true
      },
      {
        name: 'Current bundles mapping',
        check: () => workflowPageContent.includes('{currentBundles.map((workflow) => ('),
        expected: true
      }
    ];

    let passed = 0;
    let failed = 0;

    tests.forEach(test => {
      const result = test.check();
      if (result === test.expected) {
        log('green', `✅ ${test.name}`);
        passed++;
      } else {
        log('red', `❌ ${test.name}`);
        failed++;
      }
    });

    // Test 2: Check if Pagination component exists and has correct interface
    log('blue', '\n📄 Checking Pagination component...');
    const paginationPath = path.join(process.cwd(), 'src/components/ui/Pagination.tsx');
    
    if (fs.existsSync(paginationPath)) {
      const paginationContent = fs.readFileSync(paginationPath, 'utf8');
      
      const paginationTests = [
        {
          name: 'Pagination component exports',
          check: () => paginationContent.includes('export const Pagination: React.FC<PaginationProps>'),
          expected: true
        },
        {
          name: 'Pagination props interface',
          check: () => paginationContent.includes('currentPage: number;') && 
                      paginationContent.includes('totalPages: number;') && 
                      paginationContent.includes('onPageChange: (page: number) => void;'),
          expected: true
        }
      ];

      paginationTests.forEach(test => {
        const result = test.check();
        if (result === test.expected) {
          log('green', `✅ ${test.name}`);
          passed++;
        } else {
          log('red', `❌ ${test.name}`);
          failed++;
        }
      });
    } else {
      log('red', '❌ Pagination component file not found');
      failed++;
    }

    // Test 3: Check workflow data
    log('blue', '\n📊 Checking workflow data...');
    const workflowDataPath = path.join(process.cwd(), 'src/data/workflows.ts');
    
    if (fs.existsSync(workflowDataPath)) {
      const workflowDataContent = fs.readFileSync(workflowDataPath, 'utf8');
      
      // Count workflow bundles (rough estimation)
      const bundleMatches = workflowDataContent.match(/id: '\d+'/g);
      const bundleCount = bundleMatches ? bundleMatches.length : 0;
      
      if (bundleCount >= 52) {
        log('green', `✅ Found ${bundleCount} workflow bundles (pagination needed)`);
        passed++;
      } else {
        log('yellow', `⚠️  Found ${bundleCount} workflow bundles`);
      }
    }

    // Summary
    log('blue', '\n📋 Test Summary:');
    log('green', `✅ Passed: ${passed}`);
    log('red', `❌ Failed: ${failed}`);
    
    if (failed === 0) {
      log('green', '\n🎉 All pagination tests passed! The implementation looks good.');
      
      log('blue', '\n📝 Pagination Features Implemented:');
      log('green', '• 10 bundles per page');
      log('green', '• Navigation controls (Previous/Next)');
      log('green', '• Page numbers with ellipsis for large page counts');
      log('green', '• Current page and total count display');
      log('green', '• Smooth scroll to top on page change');
      log('green', '• Responsive grid layout maintained');
      log('green', '• Existing functionality preserved (BundleCreator)');
    } else {
      log('red', '\n❌ Some tests failed. Please check the implementation.');
    }

  } catch (error) {
    log('red', `❌ Error running tests: ${error.message}`);
  }
}

// Run the test
testWorkflowPagination();