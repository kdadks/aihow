#!/usr/bin/env node

/**
 * Comprehensive logo fix script to address broken and incorrect logos
 * This script fixes all the issues identified in the tools file
 */

import fs from 'fs';
import path from 'path';

// Comprehensive logo fixes - organized by issue type
const LOGO_FIXES = {
  // Fix ChatGPT Document to use ChatGPT logo (not Make.com)
  'chatgpt-document': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  
  // Fix tools with wrong company logos
  'copy-ai-marketing': 'https://www.copy.ai/images/brand/copy-ai-logo.svg',
  'persado': 'https://persado.com/favicon.ico',
  'anyword': 'https://anyword.com/favicon.ico',
  'pandadoc-ai': 'https://pandadoc.com/favicon.ico',
  'proposify-ai': 'https://proposify.com/favicon.ico',
  'qwilr-ai': 'https://qwilr.com/favicon.ico',
  'deepl-ai': 'https://www.deepl.com/favicon.ico',
  'lokalise-ai': 'https://lokalise.com/favicon.ico',
  'phrase-ai': 'https://phrase.com/favicon.ico',
  'make-ai': 'https://www.make.com/en/help/image/88d3f9bcb0166c67.o.png',
  
  // Fix tools with generic Unsplash images to proper brand logos
  'sudowrite': 'https://www.sudowrite.com/favicon.ico',
  'shortlyai': 'https://shortlyai.com/favicon.ico',
  'zapier-ai': 'https://cdn.zapier.com/zapier/images/logos/zapier-logo-294x68.png',
  'character-ai': 'https://character.ai/favicon.ico',
  
  // Fix presentation tools with wrong logos
  'presentations-ai': 'https://presentations.ai/favicon.ico',
  'prezo-ai': 'https://prezo.ai/favicon.ico',
  'slides-ai': 'https://workspace.google.com/static/img/products/png/slides.png',
  'slidebot-ai': 'https://www.slidebot.ai/favicon.ico',
  
  // Fix development tools with wrong logos  
  'deepseek': 'https://chat.deepseek.com/favicon.ico',
  'github-copilot-business': 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png',
  'anthropic-claude-teams': 'https://claude.ai/images/claude_app_icon.png',
  'gpt-4o': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'gemini': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
  'chatgpt': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'tabnine': 'https://www.tabnine.com/wp-content/uploads/2021/03/tabnine-logo.svg',
  'replit-ai': 'https://replit.com/public/images/logo-small.png',
  'v0-dev': 'https://v0.dev/favicon.ico',
  'jasper-ai-agent': 'https://assets.jasper.ai/public/jasper-favicon.png',
  'adobe-firefly': 'https://www.adobe.com/content/dam/cc/icons/firefly.svg',
  'adobe-photoshop-premiere': 'https://www.adobe.com/content/dam/cc/icons/photoshop.svg',
  
  // Fix video/image generation tools
  'runway-gen-2': 'https://runwayml.com/favicon.ico',
  'runway-editor': 'https://runwayml.com/favicon.ico',
  'pika': 'https://pika.art/favicon.ico',
  'pika-labs': 'https://pika.art/favicon.ico',
  'sora': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'synthesia': 'https://www.synthesia.io/favicon.ico',
  'synthesia-education': 'https://www.synthesia.io/favicon.ico',
  'elevenlabs': 'https://elevenlabs.io/favicon.ico',
  'lumen5': 'https://lumen5.com/favicon.ico',
  'descript': 'https://www.descript.com/favicon.ico',
  'invideo-ai': 'https://invideo.io/favicon.ico',
  'fliki': 'https://fliki.ai/favicon.ico',
  'steve-ai': 'https://www.steve.ai/favicon.ico',
  'heygen': 'https://www.heygen.com/favicon.ico',
  'colossyan': 'https://www.colossyan.com/favicon.ico',
  'pictory': 'https://pictory.ai/favicon.ico',
  
  // Fix audio tools
  'suno-ai': 'https://suno.ai/favicon.ico',
  'udio': 'https://udio.ai/favicon.ico',
  'aiva': 'https://www.aiva.ai/favicon.ico',
  'mubert': 'https://mubert.com/favicon.ico',
  'soundraw': 'https://soundraw.io/favicon.ico',
  'boomy': 'https://boomy.com/favicon.ico',
  'beatoven-ai': 'https://www.beatoven.ai/favicon.ico',
  'voicemod': 'https://www.voicemod.net/favicon.ico',
  'otter-ai': 'https://otter.ai/favicon.ico',
  
  // Fix learning platforms
  'coursera-ai': 'https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-96x96.png',
  'udacity-ai': 'https://www.udacity.com/favicon.ico',
  'edx-ai': 'https://www.edx.org/favicon.ico',
  'udemy-ai': 'https://www.udemy.com/staticx/udemy/images/v7/favicon.ico',
  'kaggle': 'https://www.kaggle.com/static/images/favicon.ico',
  'kaggle-learn': 'https://www.kaggle.com/static/images/favicon.ico',
  'brilliant-ai': 'https://brilliant.org/favicon.ico',
  'fastai': 'https://www.fast.ai/favicon.ico',
  'google-colab': 'https://colab.research.google.com/favicon.ico',
  'huggingface-community': 'https://huggingface.co/favicon.ico',
  'huggingface-hub': 'https://huggingface.co/favicon.ico',
  'hugging-chat': 'https://huggingface.co/favicon.ico',
  
  // Fix analytics tools
  'alteryx': 'https://www.alteryx.com/favicon.ico',
  'hex': 'https://hex.tech/favicon.ico',
  'mode': 'https://mode.com/favicon.ico',
  'obviously-ai': 'https://www.obviously.ai/favicon.ico',
  'anakin-ai': 'https://anakin.ai/favicon.ico',
  
  // Fix 3D/Gaming tools
  'unity-muse': 'https://unity.com/favicon.ico',
  'luma-ai': 'https://lumalabs.ai/favicon.ico',
  'meshy': 'https://www.meshy.ai/favicon.ico',
  'spline-ai': 'https://spline.design/favicon.ico',
  'scenario-gg': 'https://www.scenario.gg/favicon.ico',
  'inworld-ai': 'https://inworld.ai/favicon.ico',
  
  // Fix research tools
  'elicit': 'https://elicit.org/favicon.ico',
  'consensus-ai': 'https://consensus.app/favicon.ico',
  'arxiv': 'https://arxiv.org/favicon.ico',
  'semantic-scholar': 'https://www.semanticscholar.org/favicon.ico',
  'connected-papers': 'https://www.connectedpapers.com/favicon.ico',
  'wolfram-alpha': 'https://www.wolframalpha.com/favicon.ico',
  
  // Fix advanced AI models
  'llama-3': 'https://llama.meta.com/favicon.ico',
  'llama-3-2': 'https://llama.meta.com/favicon.ico',
  'you-ai': 'https://you.com/favicon.ico',
  'groq-ai': 'https://groq.com/favicon.ico',
  'mistral-ai': 'https://mistral.ai/favicon.ico',
  'o1-preview': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'openai-fine-tuning': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'openai-codex': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  
  // Fix ML platforms
  'weights-biases': 'https://wandb.ai/favicon.ico',
  'replicate': 'https://replicate.com/favicon.ico',
  'together-ai': 'https://together.ai/favicon.ico',
  'cohere-ai': 'https://cohere.ai/favicon.ico',
  'scale-ai': 'https://scale.com/favicon.ico',
  
  // Fix DevOps tools
  'github-actions-ai': 'https://github.com/favicon.ico',
  'gitlab-ai': 'https://gitlab.com/favicon.ico',
  'docker-ai': 'https://www.docker.com/favicon.ico',
  'kubernetes-ai': 'https://kubernetes.io/images/favicon.png',
  'terraform-ai': 'https://www.terraform.io/favicon.ico',
  'ansible-ai': 'https://www.ansible.com/favicon.ico',
  
  // Fix mobile development
  'flutterflow': 'https://flutterflow.io/favicon.ico',
  'expo-ai': 'https://expo.dev/favicon.ico',
  'react-native-ai': 'https://reactnative.dev/favicon.ico',
  'ionic-ai': 'https://ionic.io/favicon.ico',
  'capacitor-ai': 'https://capacitorjs.com/favicon.ico',
  'kodular-ai': 'https://kodular.io/favicon.ico',
  
  // Fix frontend development
  'framer-ai': 'https://framer.com/favicon.ico',
  'webflow-ai': 'https://webflow.com/favicon.ico',
  'builder-ai': 'https://builder.ai/favicon.ico',
  'locofy-ai': 'https://locofy.ai/favicon.ico',
  
  // Fix diagramming tools
  'miro-ai': 'https://miro.com/favicon.ico',
  'lucidchart-ai': 'https://lucid.co/favicon.ico',
  'draw-io-ai': 'https://app.diagrams.net/favicon.ico',
  'whimsical-ai': 'https://whimsical.com/favicon.ico',
  'visio-ai': 'https://www.microsoft.com/favicon.ico',
  'mindmeister-ai': 'https://www.mindmeister.com/favicon.ico',
  'creately-ai': 'https://creately.com/favicon.ico',
  'milanote-ai': 'https://milanote.com/favicon.ico',
  'xmind-ai': 'https://www.xmind.net/favicon.ico',
  'conceptdraw-ai': 'https://www.conceptdraw.com/favicon.ico',
  
  // Fix healthcare tools (many currently show generic images)
  'babylon-health-ai': 'https://www.babylonhealth.com/favicon.ico',
  'paige-ai-pathology': 'https://paige.ai/favicon.ico',
  'ibm-watson-oncology': 'https://www.ibm.com/favicon.ico',
  'veracyte-ai-genomics': 'https://www.veracyte.com/favicon.ico',
  
  // Fix tools showing wrong logos completely
  'discord-ai': 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg',
  'mem-ai': 'https://mem.ai/favicon.ico'
};

// Tools that should use category-appropriate high-quality fallbacks
const CATEGORY_BASED_FIXES = {
  // For tools with generic/broken images that don't have specific brand logos
  'pathology-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'radiology-assist': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'drug-discovery-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'genomics-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'clinical-notes-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'medchat-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'mental-health-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'nutrition-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'pharmacy-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'telemedicine-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'surgical-planning-ai': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  
  // Creative tools fallbacks
  'dall-e-3': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'stable-diffusion': 'https://stability.ai/favicon.ico',
  'ideogram': 'https://ideogram.ai/favicon.ico',
  'flux': 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=64&h=64&fit=crop&crop=center'
};

// Combine all fixes
const ALL_LOGO_FIXES = { ...LOGO_FIXES, ...CATEGORY_BASED_FIXES };

function fixBrokenLogos() {
  const toolsPath = './src/data/tools.ts';
  
  if (!fs.existsSync(toolsPath)) {
    console.error('❌ Tools file not found:', toolsPath);
    return;
  }
  
  let content = fs.readFileSync(toolsPath, 'utf8');
  let updateCount = 0;
  
  console.log('🔧 Starting comprehensive logo fixes...');
  
  // Apply all logo fixes
  for (const [slug, correctLogoUrl] of Object.entries(ALL_LOGO_FIXES)) {
    // Find the tool by slug and replace its logo
    const slugPattern = new RegExp(`(slug: ['"\`]${slug}['"\`][\\s\\S]*?)logo: ['"\`]([^'"\`]+)['"\`]`, 'g');
    const match = slugPattern.exec(content);
    
    if (match) {
      const currentLogo = match[2];
      if (currentLogo !== correctLogoUrl) {
        content = content.replace(
          `logo: '${currentLogo}'`,
          `logo: '${correctLogoUrl}'`
        );
        console.log(`✅ Fixed ${slug}: ${correctLogoUrl}`);
        updateCount++;
      }
    }
    
    // Reset regex lastIndex for next iteration
    slugPattern.lastIndex = 0;
  }
  
  // Additional cleanup: Replace any remaining problematic patterns
  const problematicPatterns = [
    // Replace any remaining generic Unsplash URLs with a parameter w=100&h=100
    {
      pattern: /https:\/\/images\.unsplash\.com\/photo-[^?]+\?w=100&h=100&fit=crop&crop=center/g,
      replacement: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=64&h=64&fit=crop&crop=center'
    }
  ];
  
  problematicPatterns.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      console.log(`🔄 Cleaned up ${matches.length} generic image URLs`);
      updateCount += matches.length;
    }
  });
  
  // Write the updated content
  fs.writeFileSync(toolsPath, content);
  
  console.log(`\n🎉 Logo fix complete!`);
  console.log(`📊 Fixed ${updateCount} problematic logos`);
  console.log(`📁 File: ${toolsPath}`);
  
  console.log(`\n🔍 Summary of fixes:`);
  console.log(`• Brand-specific logos: ${Object.keys(LOGO_FIXES).length}`);
  console.log(`• Category-appropriate fallbacks: ${Object.keys(CATEGORY_BASED_FIXES).length}`);
  console.log(`• All tools should now display proper images!`);
}

// Run the fix
fixBrokenLogos();