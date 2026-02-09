/**
 * Find complete tool object ranges for removal
 */

import { readFileSync } from 'fs';

const toolsContent = readFileSync('./src/data/tools.ts', 'utf-8');
const lines = toolsContent.split('\n');

// Find tool object boundaries (starts with { and ends with },)
function findToolObject(startLine) {
  let braceCount = 0;
  let started = false;
  
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Count opening braces
    for (const char of line) {
      if (char === '{') {
        braceCount++;
        started = true;
      } else if (char === '}') {
        braceCount--;
        if (started && braceCount === 0) {
          return i + 1; // Return line number (1-indexed)
        }
      }
    }
  }
  return -1;
}

const duplicates = {
  'gamma-ai': [2721, 6028],
  'beautiful-ai': [2775, 6082],
  'pitch-avatar': [2823, 6130],
  'presentations-ai': [2877, 6184],
  'decktopus-ai': [2931, 6238],
  'slidebean-ai': [2985, 6292],
  'tome-presentations': [3039, 6346],
  'designrr-presentations': [3093, 6400],
  'slides-ai': [3147, 6454],
  'sendsteps-ai': [3195, 6502],
  'plus-ai-google-slides': [3249, 6556],
  'prezo-ai': [3303, 6610]
};

console.log('Tool object ranges to remove (second occurrence):\n');

Object.entries(duplicates).forEach(([slug, lineNumbers]) => {
  const secondOccurrence = lineNumbers[1];
  
  // Find the start of the tool object (look backwards for "  {")
  let startLine = secondOccurrence - 1;
  while (startLine > 0 && !lines[startLine - 1].trim().match(/^{$/)) {
    startLine--;
  }
  
  const endLine = findToolObject(startLine - 1);
  
  console.log(`${slug}: lines ${startLine} to ${endLine}`);
});
