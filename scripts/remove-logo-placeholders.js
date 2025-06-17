#!/usr/bin/env node

/**
 * Script to remove all logo/image references from React components
 * This will eliminate image placeholders in the UI
 */

import fs from 'fs';
import path from 'path';

function removeLogoPlaceholders() {
  console.log('🔧 Removing all logo placeholders from React components...');
  
  const componentsToFix = [
    'src/components/comparison/ComparisonTable.tsx',
    'src/components/comparison/ComparisonGrid.tsx',
    'src/components/home/WorkflowSection.tsx',
    'src/components/home/FeaturedTools.tsx',
    'src/components/search/AutocompleteSearch.tsx'
  ];
  
  let totalReplacements = 0;
  
  componentsToFix.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fileReplacements = 0;
    
    // Pattern 1: Remove entire image containers with tool.logo
    const imageContainerPatterns = [
      // Pattern for image containers with tool.logo
      /\s*<div[^>]*>\s*<img[^>]*src={tool\.logo}[^>]*\/>\s*<\/div>/g,
      /\s*<img[^>]*src={tool\.logo}[^>]*\/>/g,
      
      // Pattern for more complex nested structures
      /\s*<div[^>]*h-\d+[^>]*>\s*<img[^>]*src={tool\.logo}[^>]*\/>\s*<\/div>/g,
      
      // Pattern for flex containers with images
      /\s*<div className="[^"]*h-\d+[^"]*">\s*<img src={tool\.logo}[^>]*\/>\s*<\/div>/g,
      
      // Pattern for rounded image containers
      /\s*<div className="[^"]*rounded[^"]*">\s*<img[^>]*src={tool\.logo}[^>]*\/>\s*<\/div>/g
    ];
    
    imageContainerPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, '');
        fileReplacements += matches.length;
      }
    });
    
    // Pattern 2: Remove logo property references
    const logoReferencePatterns = [
      /tool\.logo/g,
      /suggestion\.logo/g,
      /{tool\.logo}/g,
      /{suggestion\.logo}/g
    ];
    
    logoReferencePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, '""');
        fileReplacements += matches.length;
      }
    });
    
    // Pattern 3: Clean up empty className attributes and malformed HTML
    content = content.replace(/className=""\s*/g, '');
    content = content.replace(/\s+>/g, '>');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (fileReplacements > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${path.basename(filePath)}: ${fileReplacements} replacements`);
      totalReplacements += fileReplacements;
    } else {
      console.log(`✓ ${path.basename(filePath)}: No issues found`);
    }
  });
  
  console.log(`\n🎉 Logo placeholder removal complete!`);
  console.log(`📊 Total replacements: ${totalReplacements}`);
  console.log(`✨ UI will now display without logo placeholders`);
}

// Additional function to remove specific problematic patterns
function removeSpecificPatterns() {
  console.log('\n🔍 Checking for specific problematic patterns...');
  
  const specificFixes = {
    'src/components/comparison/ComparisonTable.tsx': [
      {
        search: /src={tool\.logo}/g,
        replace: 'src=""',
        description: 'tool.logo references'
      }
    ],
    'src/components/comparison/ComparisonGrid.tsx': [
      {
        search: /src={tool\.logo}/g,
        replace: 'src=""',
        description: 'tool.logo references'
      }
    ],
    'src/components/home/WorkflowSection.tsx': [
      {
        search: /<img src={tool\.logo}[^>]*\/>/g,
        replace: '',
        description: 'tool.logo img tags'
      }
    ],
    'src/components/home/FeaturedTools.tsx': [
      {
        search: /<img[^>]*src={tool\.logo}[^>]*\/>/g,
        replace: '',
        description: 'tool.logo img tags'
      }
    ],
    'src/components/search/AutocompleteSearch.tsx': [
      {
        search: /suggestion\.logo/g,
        replace: '""',
        description: 'suggestion.logo references'
      }
    ]
  };
  
  Object.entries(specificFixes).forEach(([filePath, fixes]) => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let fileChanged = false;
    
    fixes.forEach(({ search, replace, description }) => {
      const matches = content.match(search);
      if (matches) {
        content = content.replace(search, replace);
        console.log(`   ✅ Fixed ${description} in ${path.basename(filePath)}: ${matches.length} replacements`);
        fileChanged = true;
      }
    });
    
    if (fileChanged) {
      fs.writeFileSync(filePath, content);
    }
  });
}

// Run both functions
removeLogoPlaceholders();
removeSpecificPatterns();

console.log('\n📋 SUMMARY:');
console.log('• Removed all logo image containers');
console.log('• Replaced logo property references with empty strings');
console.log('• Cleaned up malformed HTML and empty attributes');
console.log('• Tools will now display cleanly without image placeholders');