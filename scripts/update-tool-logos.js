/**
 * Script to update tool logos with proper brand logos
 * This script replaces generic Pexels images with actual tool logos
 */

// Known tool logo mappings
const TOOL_LOGO_MAPPINGS = {
  // AI Chat & Language Models
  'chatgpt-document': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg',
  'chatgpt': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg',
  'gpt-4o': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg',
  'claude': 'https://www.anthropic.com/images/icons/claude-icon.svg',
  'claude-teams': 'https://www.anthropic.com/images/icons/claude-icon.svg',
  'gemini': 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
  'perplexity': 'https://yt3.googleusercontent.com/drmVSTJTP84VdGPyPRG1bNEOq6CqDn-pOWlYdnm2qg=s900-c-k-c0x00ffffff-no-rj',
  
  // Development Tools
  'github-copilot': 'https://github.com/features/copilot/assets/copilot-logo.svg',
  'cursor': 'https://cursor.sh/brand/icon.svg',
  'codeium': 'https://codeium.com/favicon.ico',
  'tabnine': 'https://www.tabnine.com/wp-content/uploads/2021/03/tabnine-logo.svg',
  'devika': 'https://raw.githubusercontent.com/stitionai/devika/main/ui/public/icon.svg',
  'gpt-engineer': 'https://avatars.githubusercontent.com/u/131524576?s=200&v=4',
  'v0-dev': 'https://v0.dev/favicon.ico',
  'replit': 'https://replit.com/public/images/replit-logo.svg',
  
  // Writing & Documentation
  'grammarly-go': 'https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/grammarly-icon.svg',
  'jasper-ai': 'https://www.jasper.ai/hubfs/jasper-ai-logo.svg',
  'writesonic': 'https://writesonic.com/static/images/landing/writesonic-logo.svg',
  'copy-ai': 'https://www.copy.ai/images/brand/copy-ai-logo.svg',
  'notion-ai': 'https://www.notion.so/images/logo-ios.png',
  'tome': 'https://tome.app/favicon.ico',
  'sudowrite': 'https://www.sudowrite.com/favicon.ico',
  'novelai': 'https://novelai.net/favicon.ico',
  'shortlyai': 'https://shortlyai.com/favicon.ico',
  
  // Productivity & Automation
  'zapier-ai': 'https://cdn.zapier.com/zapier/images/logos/zapier-logo-294x68.png',
  'make': 'https://www.make.com/en/help/image/88d3f9bcb0166c67.o.png',
  'reclaim-ai': 'https://reclaim.ai/favicon.ico',
  'motion': 'https://usemotion.com/favicon.ico',
  'clockwise': 'https://www.getclockwise.com/favicon.ico',
  'tana': 'https://tana.inc/favicon.ico',
  'mem-ai': 'https://mem.ai/favicon.ico',
  
  // Design & Creative
  'midjourney': 'https://cdn.midjourney.com/brand/midjourney-logo.svg',
  'dalle-3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg',
  'stable-diffusion': 'https://stability.ai/favicon.ico',
  'adobe-firefly': 'https://www.adobe.com/content/dam/cc/icons/firefly.svg',
  'leonardo-ai': 'https://leonardo.ai/favicon.ico',
  'clipdrop': 'https://clipdrop.co/favicon.ico',
  'canva': 'https://static.canva.com/web/images/8439b51bb7a19f6e65ce1064bc37c197.svg',
  'figma': 'https://static.figma.com/app/icon/1/favicon.ico',
  
  // Video & Audio
  'runway': 'https://runwayml.com/favicon.ico',
  'pika': 'https://pika.art/favicon.ico',
  'sora': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg',
  'synthesia': 'https://www.synthesia.io/favicon.ico',
  'lumen5': 'https://lumen5.com/favicon.ico',
  'elevenlabs': 'https://elevenlabs.io/favicon.ico',
  'suno': 'https://suno.ai/favicon.ico',
  'mubert': 'https://mubert.com/favicon.ico',
  'descript': 'https://www.descript.com/favicon.ico',
  
  // Business & Enterprise
  'salesforce-einstein': 'https://developer.salesforce.com/resource/images/einstein-platform.svg',
  'microsoft-copilot': 'https://res.cdn.office.net/officehub/images/content/images/microsoft365copilot_fluent_64x.png',
  'google-workspace': 'https://workspace.google.com/static/img/products/png/workspace.png',
  'slack': 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.svg',
  'zoom': 'https://st1.zoom.us/zoom.ico',
  
  // Analytics & Data
  'alteryx': 'https://www.alteryx.com/favicon.ico',
  'tableau': 'https://www.tableau.com/favicon.ico',
  'powerbi': 'https://powerbi.microsoft.com/pictures/application-logos/svg/powerbi.svg',
  'looker': 'https://looker.com/favicon.ico',
  
  // Learning & Education
  'coursera': 'https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-96x96.png',
  'udacity': 'https://www.udacity.com/favicon.ico',
  'edx': 'https://www.edx.org/favicon.ico',
  'udemy': 'https://www.udemy.com/staticx/udemy/images/v7/favicon.ico',
  'kaggle': 'https://www.kaggle.com/static/images/favicon.ico',
  'brilliant': 'https://brilliant.org/favicon.ico',
  'fast-ai': 'https://www.fast.ai/favicon.ico',
  
  // Research & Academic
  'scispace': 'https://scispace.com/favicon.ico',
  'elicit': 'https://elicit.org/favicon.ico',
  'consensus': 'https://consensus.app/favicon.ico',
  'arxiv': 'https://arxiv.org/favicon.ico',
  'semantic-scholar': 'https://www.semanticscholar.org/favicon.ico',
  'connected-papers': 'https://www.connectedpapers.com/favicon.ico',
  
  // Development Platforms
  'github': 'https://github.com/fluidicon.png',
  'gitlab': 'https://assets.gitlab-static.net/uploads/-/system/project/avatar/13083/gitlab-logo-gray-rgb.png',
  'docker': 'https://www.docker.com/favicon.ico',
  'kubernetes': 'https://kubernetes.io/images/favicon.png',
  'terraform': 'https://www.terraform.io/favicon.ico',
  'ansible': 'https://www.ansible.com/favicon.ico',
  
  // Cloud Platforms
  'aws': 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png',
  'azure': 'https://azure.microsoft.com/svghandler/azure-logo/?width=600&height=315',
  'gcp': 'https://cloud.google.com/_static/cloud/images/favicons/gcp/favicon.ico',
  'vercel': 'https://vercel.com/favicon.ico',
  'netlify': 'https://www.netlify.com/favicon.ico',
  
  // Presentation Tools
  'gamma': 'https://gamma.app/favicon.ico',
  'beautiful-ai': 'https://www.beautiful.ai/favicon.ico',
  'slidebean': 'https://slidebean.com/favicon.ico',
  'presentations-ai': 'https://presentations.ai/favicon.ico',
  'decktopus': 'https://www.decktopus.com/favicon.ico',
  
  // Prompt Engineering
  'promptlayer': 'https://promptlayer.com/favicon.ico',
  'langchain': 'https://python.langchain.com/favicon.ico',
  'flowiseai': 'https://flowiseai.com/favicon.ico',
  'promptperfect': 'https://promptperfect.com/favicon.ico',
  
  // AI Agents
  'autogpt': 'https://autogpt.net/favicon.ico',
  'babyagi': 'https://babyagi.org/favicon.ico',
  'crewai': 'https://crewai.com/favicon.ico',
  'superagent': 'https://superagent.sh/favicon.ico',
  
  // Health & Medical
  'ada-health': 'https://ada.com/favicon.ico',
  'babylon-health': 'https://www.babylonhealth.com/favicon.ico',
  'teladoc': 'https://www.teladoc.com/favicon.ico',
  
  // Legal
  'lexis-ai': 'https://www.lexisnexis.com/favicon.ico',
  'harvey-ai': 'https://harvey.ai/favicon.ico',
  'litera-one': 'https://www.litera.com/favicon.ico',
  
  // Resume & Career
  'teal': 'https://tealhq.com/favicon.ico',
  'rezi': 'https://rezi.ai/favicon.ico',
  'kickresume': 'https://kickresume.com/favicon.ico',
  'zety': 'https://zety.com/favicon.ico',
  'wonsulting': 'https://wonsulting.com/favicon.ico',
  
  // Translation
  'deepl': 'https://www.deepl.com/favicon.ico',
  'lokalise': 'https://lokalise.com/favicon.ico',
  'phrase': 'https://phrase.com/favicon.ico',
  
  // Proposal Tools
  'pandadoc': 'https://pandadoc.com/favicon.ico',
  'proposify': 'https://proposify.com/favicon.ico',
  'qwilr': 'https://qwilr.com/favicon.ico',
  
  // ML/AI Platforms
  'huggingface': 'https://huggingface.co/favicon.ico',
  'replicate': 'https://replicate.com/favicon.ico',
  'wandb': 'https://wandb.ai/favicon.ico',
  'cohere': 'https://cohere.ai/favicon.ico',
  'together-ai': 'https://together.ai/favicon.ico',
  'groq': 'https://groq.com/favicon.ico',
  'mistral': 'https://mistral.ai/favicon.ico',
  
  // Social & Community
  'discord': 'https://discord.com/assets/07dca80a102d4149e9736d4b162cff6f.ico',
  'reddit': 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-96x96.png',
  'twitter': 'https://abs.twimg.com/favicons/twitter.2.ico',
  'linkedin': 'https://static.licdn.com/aero-v1/sc/h/8w4qi0u6g3u4gq1a8q1j5b4x0',
  
  // 3D & Modeling
  'spline': 'https://spline.design/favicon.ico',
  'luma-labs': 'https://lumalabs.ai/favicon.ico',
  'meshy': 'https://www.meshy.ai/favicon.ico',
  'blender': 'https://www.blender.org/favicon.ico',
  
  // Voice & Audio
  'voicemod': 'https://www.voicemod.net/favicon.ico',
  'resemble': 'https://www.resemble.ai/favicon.ico',
  'murf': 'https://murf.ai/favicon.ico',
  'podcastle': 'https://podcastle.ai/favicon.ico',
  'cleanvoice': 'https://cleanvoice.ai/favicon.ico',
  'auphonic': 'https://auphonic.com/favicon.ico',
  
  // Diagramming & Visualization
  'miro': 'https://miro.com/favicon.ico',
  'lucidchart': 'https://lucid.co/favicon.ico',
  'draw-io': 'https://app.diagrams.net/favicon.ico',
  'whimsical': 'https://whimsical.com/favicon.ico',
  'mindmeister': 'https://www.mindmeister.com/favicon.ico',
  'xmind': 'https://www.xmind.net/favicon.ico',
  
  // Image Editing
  'photoshop': 'https://www.adobe.com/content/dam/cc/icons/photoshop.svg',
  'gimp': 'https://www.gimp.org/favicon.ico',
  'canva': 'https://static.canva.com/web/images/8439b51bb7a19f6e65ce1064bc37c197.svg',
  
  // Video Editing
  'adobe-premiere': 'https://www.adobe.com/content/dam/cc/icons/premiere.svg',
  'final-cut': 'https://www.apple.com/favicon.ico',
  'davinci-resolve': 'https://www.blackmagicdesign.com/favicon.ico',
  
  // Game Development
  'unity': 'https://unity.com/favicon.ico',
  'unreal': 'https://www.unrealengine.com/favicon.ico',
  'scenario': 'https://www.scenario.gg/favicon.ico',
  'inworld': 'https://inworld.ai/favicon.ico',
  
  // Generic fallbacks based on tool categories
  'ai-writing': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg',
  'ai-image': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=center',
  'ai-video': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop&crop=center',
  'ai-audio': 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=100&h=100&fit=crop&crop=center',
  'ai-code': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop&crop=center',
  'ai-data': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center',
  'ai-productivity': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop&crop=center',
  'ai-business': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center',
  'ai-education': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop&crop=center',
  'ai-health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop&crop=center',
  'ai-legal': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=100&h=100&fit=crop&crop=center',
  'ai-generic': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=center'
};

// Category-based fallback logos
const CATEGORY_FALLBACKS = {
  'document-creation': 'ai-writing',
  'presentation': 'ai-writing',
  'prompt-engineering': 'ai-writing',
  'ai-agents': 'ai-generic',
  'learning': 'ai-education',
  'content-creation': 'ai-writing',
  'development': 'ai-code',
  'image-generation': 'ai-image',
  'video-generation': 'ai-video',
  'audio-generation': 'ai-audio',
  'productivity': 'ai-productivity',
  'business': 'ai-business',
  'analytics': 'ai-data',
  'health': 'ai-health',
  'legal': 'ai-legal'
};

/**
 * Get the appropriate logo URL for a tool
 */
function getToolLogo(tool) {
  // First, try exact slug match
  if (TOOL_LOGO_MAPPINGS[tool.slug]) {
    return TOOL_LOGO_MAPPINGS[tool.slug];
  }
  
  // Try partial matches based on tool name/slug
  const slug = tool.slug.toLowerCase();
  const name = tool.name.toLowerCase();
  
  for (const [key, url] of Object.entries(TOOL_LOGO_MAPPINGS)) {
    if (slug.includes(key) || name.includes(key.replace('-', ' '))) {
      return url;
    }
  }
  
  // Try category-based fallback
  if (CATEGORY_FALLBACKS[tool.categoryId]) {
    return TOOL_LOGO_MAPPINGS[CATEGORY_FALLBACKS[tool.categoryId]];
  }
  
  // Default fallback
  return TOOL_LOGO_MAPPINGS['ai-generic'];
}

/**
 * Check if a URL is a Pexels generic image
 */
function isPexelsImage(url) {
  return url && url.includes('images.pexels.com');
}

module.exports = {
  TOOL_LOGO_MAPPINGS,
  CATEGORY_FALLBACKS,
  getToolLogo,
  isPexelsImage
};