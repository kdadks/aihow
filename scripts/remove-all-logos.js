#!/usr/bin/env node

/**
 * Script to remove ALL logo properties from tools data
 * This will make tools display without any logo images
 */

import fs from 'fs';

function removeAllLogos() {
  const toolsPath = './src/data/tools.ts';
  
  if (!fs.existsSync(toolsPath)) {
    console.error('❌ Tools file not found:', toolsPath);
    return;
  }
  
  let content = fs.readFileSync(toolsPath, 'utf8');
  
  console.log('🗑️  Starting removal of ALL logo properties...');
  
  // Count existing logos before removal
  const logoMatches = content.match(/logo: '[^']*',?\s*\n/g);
  const totalLogos = logoMatches ? logoMatches.length : 0;
  
  console.log(`📊 Found ${totalLogos} logo properties to remove`);
  
  // Remove all logo properties and their values
  // This regex matches: logo: 'any-url', (with optional trailing comma and whitespace)
  content = content.replace(/\s*logo: '[^']*',?\s*\n/g, '\n');
  
  // Clean up any double newlines that might be left
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  // Write the updated content
  fs.writeFileSync(toolsPath, content);
  
  // Verify removal
  const remainingLogos = content.match(/logo: '/g);
  const remainingCount = remainingLogos ? remainingLogos.length : 0;
  
  console.log(`\n✅ Logo removal complete!`);
  console.log(`📊 Removed: ${totalLogos} logo properties`);
  console.log(`📊 Remaining: ${remainingCount} logo references`);
  console.log(`📁 File: ${toolsPath}`);
  
  if (remainingCount === 0) {
    console.log(`\n🎉 SUCCESS: All logo properties have been completely removed!`);
    console.log(`🔄 Tools will now be displayed without any logo images`);
  } else {
    console.log(`\n⚠️  Warning: ${remainingCount} logo references still exist`);
  }
  
  // Additional cleanup - remove any logo-related imports or types if they exist
  console.log('\n🔍 Checking for logo-related cleanup opportunities...');
  
  // Check if there are any logo-related comments or references
  const logoReferences = content.match(/logo|Logo/gi);
  if (logoReferences && logoReferences.length > 0) {
    console.log(`📝 Note: Found ${logoReferences.length} remaining logo references in comments/text`);
    console.log(`💡 These are likely in comments or strings and can be left as-is`);
  }
  
  console.log('\n📋 SUMMARY:');
  console.log(`• Removed all logo properties from tools data`);
  console.log(`• Tools will display without logo images`);
  console.log(`• Clean, logo-free tool presentation achieved`);
  console.log(`• ${totalLogos} logo URLs eliminated`);
}

// Run the removal
removeAllLogos();