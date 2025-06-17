#!/usr/bin/env node

/**
 * Final targeted fix for the remaining key brand logo issues
 */

import fs from 'fs';

function finalBrandLogoFix() {
  const toolsPath = './src/data/tools.ts';
  
  if (!fs.existsSync(toolsPath)) {
    console.error('❌ Tools file not found:', toolsPath);
    return;
  }
  
  let content = fs.readFileSync(toolsPath, 'utf8');
  let updateCount = 0;
  
  console.log('🔧 Applying final brand logo fixes...');
  
  // Specific fixes for the remaining issues
  const criticalFixes = [
    {
      slug: 'chatgpt',
      correctLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      description: 'ChatGPT main tool'
    },
    {
      slug: 'claude-3-opus',
      correctLogo: 'https://claude.ai/images/claude_app_icon.png',
      description: 'Claude 3 Opus'
    },
    {
      slug: 'github-copilot',
      correctLogo: 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png',
      description: 'GitHub Copilot'
    },
    {
      slug: 'midjourney',
      correctLogo: 'https://styles.redditmedia.com/t5_16314h/styles/communityIcon_yyv4b9qxp9x91.png',
      description: 'Midjourney'
    }
  ];
  
  for (const { slug, correctLogo, description } of criticalFixes) {
    // Find and replace the logo for this specific slug
    const slugRegex = new RegExp(`(slug: ['"\`]${slug}['"\`][\\s\\S]*?)logo: ['"\`]([^'"\`]+)['"\`]`, 'g');
    
    const match = slugRegex.exec(content);
    if (match) {
      const currentLogo = match[2];
      if (currentLogo !== correctLogo) {
        content = content.replace(
          match[0],
          match[0].replace(`logo: '${currentLogo}'`, `logo: '${correctLogo}'`)
        );
        console.log(`✅ Fixed ${description}: ${correctLogo}`);
        updateCount++;
      } else {
        console.log(`✓ ${description} already has correct logo`);
      }
    } else {
      console.log(`⚠️  Could not find slug: ${slug}`);
    }
    
    // Reset regex lastIndex
    slugRegex.lastIndex = 0;
  }
  
  // Write the updated content
  fs.writeFileSync(toolsPath, content);
  
  console.log(`\n🎉 Final brand logo fix complete!`);
  console.log(`📊 Updated ${updateCount} critical brand logos`);
  console.log(`📁 File: ${toolsPath}`);
}

// Run the final fix
finalBrandLogoFix();