/**
 * Find exact line ranges for duplicate tools
 */

import { readFileSync } from 'fs';

const toolsContent = readFileSync('./src/data/tools.ts', 'utf-8');
const lines = toolsContent.split('\n');

const duplicates = [
  'novelai', 'mem-ai', 'gamma-ai', 'beautiful-ai', 'pitch-avatar',
  'presentations-ai', 'decktopus-ai', 'slidebean-ai', 'tome-presentations',
  'designrr-presentations', 'slides-ai', 'sendsteps-ai',
  'plus-ai-google-slides', 'prezo-ai'
];

console.log('Finding line numbers for duplicates...\n');

duplicates.forEach(slug => {
  const lineNumbers = [];
  lines.forEach((line, idx) => {
    if (line.includes(`slug: '${slug}'`) || line.includes(`id: '${slug}'`)) {
      lineNumbers.push(idx + 1);
    }
  });
  
  if (lineNumbers.length > 1) {
    console.log(`${slug}: lines ${lineNumbers.join(', ')}`);
  }
});
