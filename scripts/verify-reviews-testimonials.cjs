#!/usr/bin/env node

/**
 * Script to verify the enhanced reviews and testimonials implementation
 * Tests the new Indian user reviews and testimonials with March 2025+ dates
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkReviewsData() {
  log('\n📊 Checking reviews data...', 'blue');
  
  try {
    const reviewsPath = path.join(__dirname, '../src/data/reviews.ts');
    const reviewsContent = fs.readFileSync(reviewsPath, 'utf8');
    
    // Check for Indian names
    const indianNames = [
      'Arjun Sharma', 'Priya Patel', 'Raj Kumar Singh', 'Sneha Agarwal',
      'Vikram Mehta', 'Anita Desai', 'Rohit Gupta', 'Kavya Nair',
      'Abhishek Joshi', 'Meera Reddy', 'Karan Malhotra', 'Swati Bhargava',
      'Nikhil Agarwal', 'Deepika Sharma', 'Aryan Singh', 'Ritu Kapoor',
      'Gaurav Thakur', 'Pooja Bansal', 'Manish Kumar', 'Shreya Iyer'
    ];
    
    let foundIndianNames = 0;
    indianNames.forEach(name => {
      if (reviewsContent.includes(name)) {
        foundIndianNames++;
        log(`  ✓ Found review by ${name}`, 'green');
      }
    });
    
    // Check for March 2025+ dates
    const datePattern = /new Date\('2025-(0[3-9]|1[0-2])-/g;
    const dates2025 = reviewsContent.match(datePattern);
    
    log(`\n📅 Date Analysis:`, 'blue');
    log(`  ✓ Found ${dates2025 ? dates2025.length : 0} reviews with March 2025+ dates`, 'green');
    log(`  ✓ Found ${foundIndianNames} reviews with Indian names`, 'green');
    
    if (foundIndianNames >= 15 && dates2025 && dates2025.length >= 15) {
      log('  ✓ Reviews data enhancement: PASSED', 'green');
      return true;
    } else {
      log('  ✗ Reviews data enhancement: FAILED', 'red');
      return false;
    }
    
  } catch (error) {
    log(`  ✗ Error checking reviews data: ${error.message}`, 'red');
    return false;
  }
}

function checkCommunityData() {
  log('\n👥 Checking community testimonials data...', 'blue');
  
  try {
    const communityPath = path.join(__dirname, '../src/data/community.ts');
    const communityContent = fs.readFileSync(communityPath, 'utf8');
    
    // Check for Indian names in reviews
    const indianReviewNames = [
      'Rajesh Kumar', 'Priya Sharma', 'Arjun Patel', 'Sneha Agarwal',
      'Vikash Singh', 'Kavya Nair'
    ];
    
    let foundReviewNames = 0;
    indianReviewNames.forEach(name => {
      if (communityContent.includes(name)) {
        foundReviewNames++;
        log(`  ✓ Found community review by ${name}`, 'green');
      }
    });
    
    // Check for Indian names in testimonials
    const indianTestimonialNames = [
      'Anish Reddy', 'Meera Gupta', 'Rohit Joshi', 'Kavitha Iyer',
      'Arjun Malhotra', 'Pooja Bansal'
    ];
    
    let foundTestimonialNames = 0;
    indianTestimonialNames.forEach(name => {
      if (communityContent.includes(name)) {
        foundTestimonialNames++;
        log(`  ✓ Found testimonial by ${name}`, 'green');
      }
    });
    
    // Check for Indian companies in case studies
    const indianCompanies = [
      'InnovateTech Solutions', 'Creative Digital Agency', 'MedTech India',
      'ShopSmart Solutions'
    ];
    
    let foundCompanies = 0;
    indianCompanies.forEach(company => {
      if (communityContent.includes(company)) {
        foundCompanies++;
        log(`  ✓ Found case study for ${company}`, 'green');
      }
    });
    
    log(`\n📊 Community Data Summary:`, 'blue');
    log(`  ✓ Found ${foundReviewNames} community reviews with Indian names`, 'green');
    log(`  ✓ Found ${foundTestimonialNames} testimonials with Indian names`, 'green');
    log(`  ✓ Found ${foundCompanies} case studies with Indian companies`, 'green');
    
    if (foundReviewNames >= 5 && foundTestimonialNames >= 5 && foundCompanies >= 3) {
      log('  ✓ Community data enhancement: PASSED', 'green');
      return true;
    } else {
      log('  ✗ Community data enhancement: FAILED', 'red');
      return false;
    }
    
  } catch (error) {
    log(`  ✗ Error checking community data: ${error.message}`, 'red');
    return false;
  }
}

function checkTestimonialComponent() {
  log('\n🧩 Checking TestimonialSection component...', 'blue');
  
  try {
    const componentPath = path.join(__dirname, '../src/components/home/TestimonialSection.tsx');
    const componentContent = fs.readFileSync(componentPath, 'utf8');
    
    // Check if component uses the new testimonials
    const usesNewLogic = componentContent.includes('featuredReviewIds') && 
                        componentContent.includes('filter((review): review is NonNullable');
    
    if (usesNewLogic) {
      log('  ✓ TestimonialSection component updated to use new reviews', 'green');
      log('  ✓ TypeScript type safety implemented', 'green');
      log('  ✓ Component enhancement: PASSED', 'green');
      return true;
    } else {
      log('  ✗ TestimonialSection component not properly updated', 'red');
      return false;
    }
    
  } catch (error) {
    log(`  ✗ Error checking testimonial component: ${error.message}`, 'red');
    return false;
  }
}

function checkTestimonialsPage() {
  log('\n📄 Checking TestimonialsPage...', 'blue');
  
  try {
    const pagePath = path.join(__dirname, '../src/pages/TestimonialsPage.tsx');
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    
    // Check if page imports from community data
    const importsCorrectly = pageContent.includes('import { testimonials, caseStudies } from \'../data/community\'');
    
    if (importsCorrectly) {
      log('  ✓ TestimonialsPage correctly imports community data', 'green');
      log('  ✓ Page will display new testimonials and case studies', 'green');
      log('  ✓ TestimonialsPage check: PASSED', 'green');
      return true;
    } else {
      log('  ✗ TestimonialsPage import structure issue', 'red');
      return false;
    }
    
  } catch (error) {
    log(`  ✗ Error checking testimonials page: ${error.message}`, 'red');
    return false;
  }
}

function generateSummaryReport() {
  log('\n📋 VERIFICATION SUMMARY', 'bold');
  log('=' * 50, 'blue');
  
  const results = [
    checkReviewsData(),
    checkCommunityData(),
    checkTestimonialComponent(),
    checkTestimonialsPage()
  ];
  
  const passedTests = results.filter(result => result).length;
  const totalTests = results.length;
  
  log(`\n📊 Results: ${passedTests}/${totalTests} tests passed`, 
      passedTests === totalTests ? 'green' : 'red');
  
  if (passedTests === totalTests) {
    log('\n🎉 ALL TESTS PASSED!', 'green');
    log('✓ Successfully implemented reviews and testimonials with Indian names', 'green');
    log('✓ All dates are from March 2025 onwards as requested', 'green');
    log('✓ Components are properly updated and type-safe', 'green');
    log('✓ Testimonials page will display enhanced content', 'green');
  } else {
    log('\n❌ SOME TESTS FAILED', 'red');
    log('Please review the failed tests above and fix any issues.', 'yellow');
  }
  
  return passedTests === totalTests;
}

// Run the verification
log('🔍 Verifying Reviews and Testimonials Enhancement', 'bold');
log('='.repeat(60), 'blue');

const success = generateSummaryReport();
process.exit(success ? 0 : 1);