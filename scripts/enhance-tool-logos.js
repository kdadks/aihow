#!/usr/bin/env node

/**
 * Enhanced logo update script with more comprehensive mappings
 * This script improves the logos with better brand-specific icons
 */

import fs from 'fs';
import path from 'path';

// Enhanced logo mappings with better sources
const ENHANCED_LOGOS = {
  // Major AI Companies & Models
  'chatgpt-document': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'chatgpt': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'gpt-4o': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'claude': 'https://claude.ai/images/claude_app_icon.png',
  'claude-3-opus': 'https://claude.ai/images/claude_app_icon.png',
  'claude-3-5-sonnet': 'https://claude.ai/images/claude_app_icon.png',
  'anthropic-claude-for-teams': 'https://claude.ai/images/claude_app_icon.png',
  'anthropic-claude-teams': 'https://claude.ai/images/claude_app_icon.png',
  'gemini': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
  'perplexity-ai': 'https://yt3.googleusercontent.com/drmVSTJTP84VdGPyPRG1bNEOq6CqDn-pOWlYdnm2qg=s900-c-k-c0x00ffffff-no-rj',
  'midjourney': 'https://styles.redditmedia.com/t5_16314h/styles/communityIcon_yyv4b9qxp9x91.png',
  
  // Development Tools
  'github-copilot': 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png',
  'github-copilot-business': 'https://github.githubassets.com/images/modules/site/copilot/copilot-logo.png',
  'cursor-ai': 'https://cursor.sh/brand/icon.png',
  'codeium': 'https://exafunction.github.io/codeium/assets/favicon.ico',
  'tabnine': 'https://www.tabnine.com/wp-content/uploads/2021/03/tabnine-logo.svg',
  'replit-ai': 'https://replit.com/public/images/logo-small.png',
  'v0-dev': 'https://v0.dev/favicon.ico',
  
  // Writing & Content
  'grammarly-go': 'https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/grammarly-icon.svg',
  'jasper-ai': 'https://assets.jasper.ai/public/jasper-favicon.png',
  'jasper-ai-agent': 'https://assets.jasper.ai/public/jasper-favicon.png',
  'copy-ai-marketing': 'https://www.copy.ai/images/brand/copy-ai-logo.svg',
  'writesonic': 'https://writesonic.com/static/images/landing/writesonic-logo.svg',
  'notion-ai': 'https://www.notion.so/images/logo-ios.png',
  
  // Design & Creative
  'adobe-firefly': 'https://www.adobe.com/content/dam/cc/icons/firefly.svg',
  'adobe-photoshop-premiere': 'https://www.adobe.com/content/dam/cc/icons/photoshop.svg',
  'canva-ai': 'https://static.canva.com/web/images/8439b51bb7a19f6e65ce1064bc37c197.svg',
  'figma-to-code': 'https://static.figma.com/app/icon/1/favicon.ico',
  'leonardo-ai': 'https://leonardo.ai/favicon.ico',
  'stable-diffusion': 'https://stability.ai/favicon.ico',
  'dall-e-3': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'ideogram': 'https://ideogram.ai/favicon.ico',
  'flux': 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=64&h=64&fit=crop&crop=center',
  
  // Video & Audio
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
  
  // Audio & Music
  'suno-ai': 'https://suno.ai/favicon.ico',
  'udio': 'https://udio.ai/favicon.ico',
  'aiva': 'https://www.aiva.ai/favicon.ico',
  'mubert': 'https://mubert.com/favicon.ico',
  'soundraw': 'https://soundraw.io/favicon.ico',
  'boomy': 'https://boomy.com/favicon.ico',
  'beatoven-ai': 'https://www.beatoven.ai/favicon.ico',
  'voicemod': 'https://www.voicemod.net/favicon.ico',
  'otter-ai': 'https://otter.ai/favicon.ico',
  
  // Productivity
  'zapier-ai': 'https://cdn.zapier.com/zapier/images/logos/zapier-logo-294x68.png',
  'make-ai': 'https://www.make.com/en/help/image/88d3f9bcb0166c67.o.png',
  'notion-ai': 'https://www.notion.so/images/logo-ios.png',
  'reclaim-ai': 'https://reclaim.ai/favicon.ico',
  'motion': 'https://usemotion.com/favicon.ico',
  'clockwise': 'https://www.getclockwise.com/favicon.ico',
  'tana': 'https://tana.inc/favicon.ico',
  'mem-ai': 'https://mem.ai/favicon.ico',
  
  // Business Tools
  'microsoft-copilot-studio': 'https://res.cdn.office.net/officehub/images/content/images/microsoft365copilot_fluent_64x.png',
  'pandadoc-ai': 'https://pandadoc.com/favicon.ico',
  'proposify-ai': 'https://proposify.com/favicon.ico',
  'qwilr-ai': 'https://qwilr.com/favicon.ico',
  
  // Presentation Tools
  'gamma-ai': 'https://gamma.app/favicon.ico',
  'beautiful-ai': 'https://www.beautiful.ai/favicon.ico',
  'slidebean-ai': 'https://slidebean.com/favicon.ico',
  'slidebot-ai': 'https://www.slidebot.ai/favicon.ico',
  'presentations-ai': 'https://presentations.ai/favicon.ico',
  'decktopus-ai': 'https://www.decktopus.com/favicon.ico',
  'pitch-avatar': 'https://pitchavatar.com/favicon.ico',
  'tome-presentations': 'https://tome.app/favicon.ico',
  'slides-ai': 'https://workspace.google.com/static/img/products/png/slides.png',
  'prezo-ai': 'https://prezo.ai/favicon.ico',
  
  // Learning Platforms
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
  
  // Data & Analytics
  'alteryx': 'https://www.alteryx.com/favicon.ico',
  'hex': 'https://hex.tech/favicon.ico',
  'mode': 'https://mode.com/favicon.ico',
  'obviously-ai': 'https://www.obviously.ai/favicon.ico',
  'anakin-ai': 'https://anakin.ai/favicon.ico',
  
  // 3D & Gaming
  'unity-muse': 'https://unity.com/favicon.ico',
  'luma-ai': 'https://lumalabs.ai/favicon.ico',
  'meshy': 'https://www.meshy.ai/favicon.ico',
  'spline-ai': 'https://spline.design/favicon.ico',
  'scenario-gg': 'https://www.scenario.gg/favicon.ico',
  'inworld-ai': 'https://inworld.ai/favicon.ico',
  'character-ai': 'https://character.ai/favicon.ico',
  
  // Legal & Professional
  'lexis-ai': 'https://www.lexisnexis.com/favicon.ico',
  'harvey-ai': 'https://harvey.ai/favicon.ico',
  'litera-one': 'https://www.litera.com/favicon.ico',
  
  // Translation
  'deepl-ai': 'https://www.deepl.com/favicon.ico',
  'lokalise-ai': 'https://lokalise.com/favicon.ico',
  'phrase-ai': 'https://phrase.com/favicon.ico',
  
  // Resume & Career
  'teal': 'https://tealhq.com/favicon.ico',
  'rezi': 'https://rezi.ai/favicon.ico',
  'kickresume': 'https://kickresume.com/favicon.ico',
  'zety': 'https://zety.com/favicon.ico',
  'resumai-wonsulting': 'https://wonsulting.com/favicon.ico',
  
  // Research & Academic
  'scispace': 'https://scispace.com/favicon.ico',
  'elicit': 'https://elicit.org/favicon.ico',
  'consensus-ai': 'https://consensus.app/favicon.ico',
  'arxiv': 'https://arxiv.org/favicon.ico',
  'semantic-scholar': 'https://www.semanticscholar.org/favicon.ico',
  'connected-papers': 'https://www.connectedpapers.com/favicon.ico',
  'wolfram-alpha': 'https://www.wolframalpha.com/favicon.ico',
  
  // Advanced AI Models
  'llama-3': 'https://llama.meta.com/favicon.ico',
  'llama-3-2': 'https://llama.meta.com/favicon.ico',
  'deepseek': 'https://chat.deepseek.com/favicon.ico',
  'you-ai': 'https://you.com/favicon.ico',
  'groq-ai': 'https://groq.com/favicon.ico',
  'mistral-ai': 'https://mistral.ai/favicon.ico',
  'o1-preview': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'openai-fine-tuning': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  'openai-codex': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
  
  // ML Platforms
  'weights-biases': 'https://wandb.ai/favicon.ico',
  'replicate': 'https://replicate.com/favicon.ico',
  'together-ai': 'https://together.ai/favicon.ico',
  'cohere-ai': 'https://cohere.ai/favicon.ico',
  'scale-ai': 'https://scale.com/favicon.ico',
  
  // DevOps & Infrastructure
  'github-actions-ai': 'https://github.com/favicon.ico',
  'gitlab-ai': 'https://gitlab.com/favicon.ico',
  'docker-ai': 'https://www.docker.com/favicon.ico',
  'kubernetes-ai': 'https://kubernetes.io/images/favicon.png',
  'terraform-ai': 'https://www.terraform.io/favicon.ico',
  'ansible-ai': 'https://www.ansible.com/favicon.ico',
  
  // Mobile Development
  'flutterflow': 'https://flutterflow.io/favicon.ico',
  'expo-ai': 'https://expo.dev/favicon.ico',
  'react-native-ai': 'https://reactnative.dev/favicon.ico',
  'ionic-ai': 'https://ionic.io/favicon.ico',
  'capacitor-ai': 'https://capacitorjs.com/favicon.ico',
  'kodular-ai': 'https://kodular.io/favicon.ico',
  
  // Frontend Development
  'framer-ai': 'https://framer.com/favicon.ico',
  'webflow-ai': 'https://webflow.com/favicon.ico',
  'builder-ai': 'https://builder.ai/favicon.ico',
  'locofy-ai': 'https://locofy.ai/favicon.ico',
  
  // Health & Medical
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
  'babylon-health-ai': 'https://www.babylonhealth.com/favicon.ico',
  'paige-ai-pathology': 'https://paige.ai/favicon.ico',
  'ibm-watson-oncology': 'https://www.ibm.com/favicon.ico',
  'veracyte-ai-genomics': 'https://www.veracyte.com/favicon.ico',
  
  // Course Creation
  'courseai': 'https://courseai.com/favicon.ico',
  'coursebox-ai': 'https://coursebox.ai/favicon.ico',
  
  // Diagramming
  'miro-ai': 'https://miro.com/favicon.ico',
  'lucidchart-ai': 'https://lucid.co/favicon.ico',
  'draw-io-ai': 'https://app.diagrams.net/favicon.ico',
  'whimsical-ai': 'https://whimsical.com/favicon.ico',
  'visio-ai': 'https://www.microsoft.com/favicon.ico',
  'mindmeister-ai': 'https://www.mindmeister.com/favicon.ico',
  'creately-ai': 'https://creately.com/favicon.ico',
  'milanote-ai': 'https://milanote.com/favicon.ico',
  'xmind-ai': 'https://www.xmind.net/favicon.ico',
  'conceptdraw-ai': 'https://www.conceptdraw.com/favicon.ico'
};

// High-quality category-based fallbacks
const CATEGORY_FALLBACKS = {
  'document-creation': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=64&h=64&fit=crop&crop=center',
  'presentation': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center',
  'ai-agents': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=64&h=64&fit=crop&crop=center',
  'learning': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=64&h=64&fit=crop&crop=center',
  'content-creation': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=64&h=64&fit=crop&crop=center',
  'development': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=64&h=64&fit=crop&crop=center',
  'image-generation': 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=64&h=64&fit=crop&crop=center',
  'video-generation': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=64&h=64&fit=crop&crop=center',
  'audio-generation': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=64&h=64&fit=crop&crop=center',
  'productivity': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop&crop=center',
  'business': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=64&h=64&fit=crop&crop=center',
  'analytics': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=64&h=64&fit=crop&crop=center',
  'health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=64&h=64&fit=crop&crop=center',
  'legal': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=64&h=64&fit=crop&crop=center'
};

function enhanceLogos() {
  const toolsPath = './src/data/tools.ts';
  
  if (!fs.existsSync(toolsPath)) {
    console.error('❌ Tools file not found:', toolsPath);
    return;
  }
  
  let content = fs.readFileSync(toolsPath, 'utf8');
  let updateCount = 0;
  
  console.log('🚀 Starting logo enhancement...');
  
  // Update tools with enhanced logos
  for (const [slug, logoUrl] of Object.entries(ENHANCED_LOGOS)) {
    const slugPattern = new RegExp(`slug: ['"\`]${slug}['"\`][\\s\\S]*?logo: ['"\`]([^'"\`]+)['"\`]`, 'g');
    const match = slugPattern.exec(content);
    
    if (match) {
      const currentLogo = match[1];
      if (currentLogo !== logoUrl) {
        content = content.replace(
          `logo: '${currentLogo}'`,
          `logo: '${logoUrl}'`
        );
        console.log(`✅ Enhanced ${slug}: ${logoUrl}`);
        updateCount++;
      }
    }
  }
  
  // Write the updated content
  fs.writeFileSync(toolsPath, content);
  
  console.log(`\n🎉 Enhancement complete!`);
  console.log(`📊 Updated ${updateCount} tool logos`);
  console.log(`📁 File: ${toolsPath}`);
}

// Run the enhancement
enhanceLogos();