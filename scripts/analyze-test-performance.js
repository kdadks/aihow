#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const PERFORMANCE_THRESHOLDS = {
  INDIVIDUAL_TEST: 10000, // 10 seconds
  TEST_SUITE: 30000,     // 30 seconds
  TOTAL_EXECUTION: 300000 // 5 minutes
};

/**
 * Analyzes Cypress test performance from test results
 */
function analyzeTestPerformance() {
  const reportsDir = path.join(process.cwd(), 'cypress', 'reports');
  
  if (!fs.existsSync(reportsDir)) {
    console.error('No test reports found. Make sure tests have been run with --config "reporterOptions.reportDir=cypress/reports"');
    process.exit(1);
  }

  const results = {
    slowTests: [],
    slowSuites: [],
    totalDuration: 0,
    totalTests: 0,
    totalPassed: 0,
    totalFailed: 0
  };

  // Process all test result files
  const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const testResults = JSON.parse(
      fs.readFileSync(path.join(reportsDir, file), 'utf8')
    );

    analyzeTestFile(testResults, results);
  });

  // Generate performance report
  generateReport(results);

  // Check if we should fail the build
  const shouldFail = checkFailureConditions(results);
  
  if (shouldFail) {
    process.exit(1);
  }
}

/**
 * Analyzes a single test results file
 */
function analyzeTestFile(testResults, results) {
  testResults.results.forEach(suite => {
    const suiteDuration = calculateSuiteDuration(suite);
    results.totalDuration += suiteDuration;

    if (suiteDuration > PERFORMANCE_THRESHOLDS.TEST_SUITE) {
      results.slowSuites.push({
        name: suite.fullFile,
        duration: suiteDuration
      });
    }

    traverseTestResults(suite, results);
  });
}

/**
 * Recursively traverses test results to find slow tests
 */
function traverseTestResults(suite, results) {
  if (suite.tests) {
    suite.tests.forEach(test => {
      results.totalTests++;
      
      if (test.state === 'passed') {
        results.totalPassed++;
      } else if (test.state === 'failed') {
        results.totalFailed++;
      }

      if (test.duration > PERFORMANCE_THRESHOLDS.INDIVIDUAL_TEST) {
        results.slowTests.push({
          name: `${suite.title} - ${test.title}`,
          duration: test.duration
        });
      }
    });
  }

  if (suite.suites) {
    suite.suites.forEach(subSuite => {
      traverseTestResults(subSuite, results);
    });
  }
}

/**
 * Calculates the total duration of a test suite
 */
function calculateSuiteDuration(suite) {
  let duration = 0;

  if (suite.tests) {
    duration += suite.tests.reduce((sum, test) => sum + (test.duration || 0), 0);
  }

  if (suite.suites) {
    duration += suite.suites.reduce((sum, subSuite) => sum + calculateSuiteDuration(subSuite), 0);
  }

  return duration;
}

/**
 * Generates a performance report
 */
function generateReport(results) {
  console.log('\nTest Performance Analysis');
  console.log('========================');
  
  console.log('\nSummary:');
  console.log(`Total Tests: ${results.totalTests}`);
  console.log(`Passed: ${results.totalPassed}`);
  console.log(`Failed: ${results.totalFailed}`);
  console.log(`Total Duration: ${(results.totalDuration / 1000).toFixed(2)}s`);

  if (results.slowTests.length > 0) {
    console.log('\nSlow Tests:');
    results.slowTests.forEach(test => {
      console.log(`- ${test.name}: ${(test.duration / 1000).toFixed(2)}s`);
    });
  }

  if (results.slowSuites.length > 0) {
    console.log('\nSlow Test Suites:');
    results.slowSuites.forEach(suite => {
      console.log(`- ${suite.name}: ${(suite.duration / 1000).toFixed(2)}s`);
    });
  }
}

/**
 * Determines if the build should fail based on performance results
 */
function checkFailureConditions(results) {
  const failures = [];

  // Check total execution time
  if (results.totalDuration > PERFORMANCE_THRESHOLDS.TOTAL_EXECUTION) {
    failures.push(
      `Total execution time (${results.totalDuration}ms) exceeds threshold (${PERFORMANCE_THRESHOLDS.TOTAL_EXECUTION}ms)`
    );
  }

  // Check for too many slow tests
  if (results.slowTests.length > Math.max(3, results.totalTests * 0.1)) {
    failures.push('Too many slow tests (>10% of total tests)');
  }

  // Check for too many slow suites
  if (results.slowSuites.length > 2) {
    failures.push('Too many slow test suites (>2)');
  }

  if (failures.length > 0) {
    console.log('\nPerformance Test Failures:');
    failures.forEach(failure => console.log(`- ${failure}`));
    return true;
  }

  console.log('\nAll performance checks passed!');
  return false;
}

// Run the analysis
analyzeTestPerformance();
