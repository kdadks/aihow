#!/usr/bin/env node

/**
 * Script to apply logo updates to the tools.ts file
 * This will replace all Pexels images with proper tool logos
 */

const fs = require('fs');
const path = require('path');
const { getToolLogo, isPexelsImage } = require('./update-tool-logos.js');

// Path to the tools.ts file
const TOOLS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'tools.ts');

/**
 * Extract tools array from the TypeScript file
 */
function extractToolsFromFile(content) {
  // Find the tools array export
  const toolsStart = content.indexOf('export const tools: Tool[] = [');
  if (toolsStart === -1) {
    throw new Error('Could not find tools array in file');
  }
  
  // Find the matching closing bracket
  let bracketCount = 0;
  let start = content.indexOf('[', toolsStart);
  let pos = start;
  
  do {
    const char = content[pos];
    if (char === '[') bracketCount++;
    if (char === ']') bracketCount--;
    pos++;
  } while (bracketCount > 0 && pos < content.length);
  
  return {
    before: content.substring(0, start),
    toolsArray: content.substring(start, pos),
    after: content.substring(pos)
  };
}

/**
 * Parse a tool object from string representation
 */
function parseToolObject(toolStr) {
  // Simple regex to extract key properties
  const idMatch = toolStr.match(/id:\s*['"`]([^'"`]+)['"`]/);
  const nameMatch = toolStr.match(/name:\s*['"`]([^'"`]+)['"`]/);
  const slugMatch = toolStr.match(/slug:\s*['"`]([^'"`]+)['"`]/);
  const logoMatch = toolStr.match(/logo:\s*['"`]([^'"`]+)['"`]/);
  const categoryMatch = toolStr.match(/categoryId:\s*['"`]([^'"`]+)['"`]/);
  
  return {
    id: idMatch ? idMatch[1] : '',
    name: nameMatch ? nameMatch[1] : '',
    slug: slugMatch ? slugMatch[1] : '',
    logo: logoMatch ? logoMatch[1] : '',
    categoryId: categoryMatch ? categoryMatch[1] : '',
    originalString: toolStr
  };
}

/**
 * Update tool logos in the content
 */
function updateToolLogos(content) {
  console.log('Starting logo update process...');
  
  let updatedContent = content;
  let updateCount = 0;
  
  // Find all logo property assignments
  const logoRegex = /logo:\s*['"`]([^'"`]+)['"`]/g;
  let match;
  
  while ((match = logoRegex.exec(content)) !== null) {
    const originalUrl = match[1];
    
    if (isPexelsImage(originalUrl)) {
      // Find the tool object this logo belongs to
      const beforeLogo = content.substring(0, match.index);
      const toolStart = beforeLogo.lastIndexOf('{');
      const afterLogo = content.substring(match.index);
      const toolEnd = afterLogo.indexOf('}') + match.index;
      
      const toolStr = content.substring(toolStart, toolEnd + 1);
      const tool = parseToolObject(toolStr);
      
      if (tool.slug) {
        const newLogo = getToolLogo(tool);
        
        if (newLogo !== originalUrl) {
          console.log(`Updating ${tool.name} (${tool.slug}): ${originalUrl} -> ${newLogo}`);
          updatedContent = updatedContent.replace(
            `logo: '${originalUrl}'`,
            `logo: '${newLogo}'`
          );
          updateCount++;
        }
      }
    }
  }
  
  console.log(`Updated ${updateCount} tool logos`);
  return updatedContent;
}

/**
 * Backup the original file
 */
function backupFile(filePath) {
  const backupPath = filePath + '.backup';
  fs.copyFileSync(filePath, backupPath);
  console.log(`Backup created: ${backupPath}`);
}

/**
 * Main execution
 */
function main() {
  try {
    console.log('Reading tools.ts file...');
    
    if (!fs.existsSync(TOOLS_FILE_PATH)) {
      throw new Error(`Tools file not found: ${TOOLS_FILE_PATH}`);
    }
    
    const originalContent = fs.readFileSync(TOOLS_FILE_PATH, 'utf8');
    
    // Create backup
    backupFile(TOOLS_FILE_PATH);
    
    // Update logos
    const updatedContent = updateToolLogos(originalContent);
    
    // Write updated content
    fs.writeFileSync(TOOLS_FILE_PATH, updatedContent, 'utf8');
    
    console.log('✅ Tool logos updated successfully!');
    console.log(`📁 File: ${TOOLS_FILE_PATH}`);
    console.log(`💾 Backup: ${TOOLS_FILE_PATH}.backup`);
    
  } catch (error) {
    console.error('❌ Error updating tool logos:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = { main, updateToolLogos, parseToolObject };