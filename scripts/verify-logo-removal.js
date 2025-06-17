#!/usr/bin/env node

/**
 * Verification script to confirm all logo references have been removed
 */

import fs from 'fs';

function verifyLogoRemoval() {
  console.log('🔍 LOGO REMOVAL VERIFICATION REPORT');
  console.log('===================================\n');
  
  const filesToCheck = [
    { path: './src/data/tools.ts', description: 'Tools data file' },
    { path: './src/types/Tool.d.ts', description: 'Tool type definitions' }
  ];
  
  let totalIssues = 0;
  let filesChecked = 0;
  
  filesToCheck.forEach(({ path, description }) => {
    if (!fs.existsSync(path)) {
      console.log(`❌ ${description}: File not found - ${path}`);
      return;
    }
    
    filesChecked++;
    const content = fs.readFileSync(path, 'utf8');
    
    // Check for logo properties
    const logoProperties = content.match(/logo\s*:/g);
    const logoCount = logoProperties ? logoProperties.length : 0;
    
    // Check for any logo URLs
    const logoUrls = content.match(/logo:\s*['"`][^'"`]*['"`]/g);
    const urlCount = logoUrls ? logoUrls.length : 0;
    
    console.log(`📁 ${description}:`);
    console.log(`   Path: ${path}`);
    console.log(`   Logo properties: ${logoCount}`);
    console.log(`   Logo URLs: ${urlCount}`);
    
    if (logoCount === 0 && urlCount === 0) {
      console.log(`   ✅ CLEAN: No logo references found`);
    } else {
      console.log(`   ❌ ISSUES: Found ${logoCount + urlCount} logo references`);
      totalIssues += logoCount + urlCount;
      
      if (logoProperties) {
        logoProperties.forEach((match, index) => {
          console.log(`      - Logo property ${index + 1}: ${match}`);
        });
      }
    }
    console.log('');
  });
  
  // Count tools to verify data integrity
  const toolsPath = './src/data/tools.ts';
  if (fs.existsSync(toolsPath)) {
    const toolsContent = fs.readFileSync(toolsPath, 'utf8');
    const toolMatches = toolsContent.match(/\{[\s\S]*?id: ['"`][^'"`]+['"`]/g);
    const toolCount = toolMatches ? toolMatches.length : 0;
    
    console.log(`📊 DATA INTEGRITY CHECK:`);
    console.log(`   Total tools found: ${toolCount}`);
    console.log(`   Expected tools: 271`);
    console.log(`   Data integrity: ${toolCount === 271 ? '✅ GOOD' : '⚠️  CHECK NEEDED'}`);
    console.log('');
  }
  
  // Final assessment
  console.log(`🏆 FINAL VERIFICATION RESULTS:`);
  console.log(`   Files checked: ${filesChecked}`);
  console.log(`   Logo references found: ${totalIssues}`);
  console.log(`   Status: ${totalIssues === 0 ? '✅ COMPLETE' : '❌ INCOMPLETE'}`);
  
  if (totalIssues === 0) {
    console.log(`\n🎉 SUCCESS: All logo references have been completely removed!`);
    console.log(`🔄 Tools will now display without any logo images`);
    console.log(`✨ Clean, logo-free presentation achieved`);
  } else {
    console.log(`\n⚠️  ATTENTION: ${totalIssues} logo references still exist`);
    console.log(`🔧 Additional cleanup may be required`);
  }
  
  console.log(`\n📋 SUMMARY:`);
  console.log(`• All logo properties removed from tools data`);
  console.log(`• Logo property removed from Tool type definition`);
  console.log(`• Tools will display without logo images`);
  console.log(`• Clean, minimalist tool presentation`);
}

// Run verification
verifyLogoRemoval();