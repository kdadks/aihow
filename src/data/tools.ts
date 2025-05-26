import { Tool } from '../types';

export const tools: Tool[] = [
  {
    id: '1',
    name: 'MidJourney',
    slug: 'midjourney',
    description: 'MidJourney is an AI image generation tool that creates images based on text prompts. It excels at creating artistic, detailed images with a unique aesthetic quality.',
    shortDescription: 'AI image generation with artistic quality',
    logo: 'https://images.pexels.com/photos/2882552/pexels-photo-2882552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://www.midjourney.com',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$10/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Basic',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Basic image generation', 'Community support']
        },
        {
          name: 'Pro',
          price: '$30/month',
          billingPeriod: 'monthly',
          features: ['Advanced image generation', 'Priority support', 'Higher resolution']
        }
      ]
    },
    features: [
      'High-quality image generation',
      'Artistic style customization',
      'Discord integration',
      'Commercial usage rights'
    ],
    limitations: [
      'Limited batch processing',
      'Queue times during high usage',
      'Limited control over specific details'
    ],
    rating: 4.8,
    reviewCount: 1245,
    trending: true,
    featured: false,
    integrations: ['Discord', 'Twitter', 'Instagram'],
    lastVerified: new Date('2023-06-15')
  },
  {
    id: '2',
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: 'ChatGPT is a large language model optimized for conversation. It can understand complex prompts and generate coherent, helpful responses across a wide range of topics.',
    shortDescription: 'Conversational AI for text generation',
    logo: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://chat.openai.com',
    categoryId: 'general-ai',
    subcategoryIds: ['chatbots'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month for Plus',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic chat functionality', 'Limited requests']
        },
        {
          name: 'Plus',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Priority access', 'Advanced features', 'Faster response times']
        }
      ]
    },
    features: [
      'Natural language conversation',
      'Code generation and explanation',
      'Content creation',
      'Information retrieval',
      'Problem solving assistance'
    ],
    limitations: [
      'Knowledge cutoff date',
      'Occasional factual errors',
      'Limited access to real-time data',
      'No direct internet browsing'
    ],
    rating: 4.9,
    reviewCount: 3567,
    trending: true,
    featured: true,
    integrations: ['Plugins ecosystem', 'API integration', 'Microsoft tools'],
    lastVerified: new Date('2023-05-20')
  },
  {
    id: '16',
    name: 'Tabnine',
    slug: 'tabnine',
    description: 'AI-powered code completion tool that learns from your coding patterns to provide accurate, context-aware suggestions across multiple programming languages.',
    shortDescription: 'Smart AI code completion',
    logo: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    website: 'https://www.tabnine.com',
    categoryId: 'code-creation',
    subcategoryIds: ['code-completion'],
    pricing: {
      type: 'freemium',
      startingPrice: '$12/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic code completion', 'Limited suggestions']
        },
        {
          name: 'Pro',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['Advanced completion', 'Custom models', 'Team sharing']
        }
      ]
    },
    features: [
      'Multi-language support',
      'Context-aware suggestions',
      'Learning from your code',
      'Team collaboration',
      'IDE integration'
    ],
    limitations: [
      'Limited completions in free tier',
      'Requires training period',
      'IDE-dependent functionality'
    ],
    rating: 4.7,
    reviewCount: 1850,
    trending: true,
    featured: true,
    integrations: ['VSCode', 'IntelliJ', 'PyCharm', 'WebStorm'],
    lastVerified: new Date('2025-05-20')
  },
  {
    id: '17',
    name: 'PromptBase Pro',
    slug: 'promptbase-pro',
    description: 'Advanced prompt engineering platform with tools for crafting, testing, and optimizing AI prompts. Includes version control and performance analytics.',
    shortDescription: 'Professional prompt engineering suite',
    logo: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    website: 'https://www.promptbase-pro.ai',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-optimization'],
    pricing: {
      type: 'subscription',
      startingPrice: '$25/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Professional',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['Prompt testing', 'Analytics', 'Version control']
        },
        {
          name: 'Team',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['Collaboration', 'Advanced analytics', 'Custom templates']
        }
      ]
    },
    features: [
      'Prompt version control',
      'Performance analytics',
      'A/B testing',
      'Template library',
      'Collaboration tools'
    ],
    limitations: [
      'No free tier',
      'Learning curve for analytics',
      'Limited model support'
    ],
    rating: 4.6,
    reviewCount: 780,
    trending: true,
    featured: false,
    integrations: ['OpenAI', 'Anthropic', 'Hugging Face', 'Custom APIs'],
    lastVerified: new Date('2025-05-18')
  },
  {
    id: '18',
    name: 'Slidebot AI',
    slug: 'slidebot-ai',
    description: 'AI-powered presentation tool that automatically generates professional slides from your content, with smart design suggestions and dynamic layouts.',
    shortDescription: 'AI presentation creator',
    logo: 'https://images.pexels.com/photos/7947866/pexels-photo-7947866.jpeg',
    website: 'https://www.slidebot.ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$15/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic templates', 'Limited exports']
        },
        {
          name: 'Premium',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['Custom branding', 'Advanced AI', 'Premium templates']
        }
      ]
    },
    features: [
      'Automatic slide generation',
      'Smart design suggestions',
      'Brand consistency',
      'Real-time collaboration',
      'Custom templates'
    ],
    limitations: [
      'Limited free templates',
      'Export restrictions in free tier',
      'Internet required for AI features'
    ],
    rating: 4.5,
    reviewCount: 920,
    trending: true,
    featured: false,
    integrations: ['Google Slides', 'PowerPoint', 'Canva', 'Stock image services'],
    lastVerified: new Date('2025-05-15')
  },
  {
    id: '19',
    name: 'WorkflowGPT',
    slug: 'workflowgpt',
    description: 'Advanced workflow automation platform that uses AI to design, optimize, and manage complex business processes with natural language commands.',
    shortDescription: 'AI workflow automation',
    logo: 'https://images.pexels.com/photos/1181615/pexels-photo-1181615.jpeg',
    website: 'https://www.workflowgpt.ai',
    categoryId: 'workflow-automation',
    subcategoryIds: ['process-automation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$39/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Pro',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['Workflow design', 'Process automation', 'Basic analytics']
        },
        {
          name: 'Enterprise',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['Advanced automation', 'Custom integrations', 'Priority support']
        }
      ]
    },
    features: [
      'Natural language workflow creation',
      'Process optimization',
      'Automation templates',
      'Performance tracking',
      'Integration management'
    ],
    limitations: [
      'Complex pricing for large teams',
      'Integration setup required',
      'Learning curve for advanced features'
    ],
    rating: 4.7,
    reviewCount: 560,
    trending: true,
    featured: true,
    integrations: ['Slack', 'Microsoft Teams', 'Salesforce', 'Jira', 'Custom APIs'],
    lastVerified: new Date('2025-05-10')
  },
  {
    id: '20',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'AI pair programmer that suggests code completions in real-time, helping developers write better code faster with context-aware suggestions across multiple programming languages.',
    shortDescription: 'AI pair programming assistant',
    logo: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg',
    website: 'https://github.com/features/copilot',
    categoryId: 'code-creation',
    subcategoryIds: ['code-completion'],
    pricing: {
      type: 'subscription',
      startingPrice: '$10/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Individual',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['AI code completion', 'Multi-language support', 'IDE integration']
        },
        {
          name: 'Business',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['Team management', 'Advanced security', 'License compliance']
        }
      ]
    },
    features: [
      'Real-time code suggestions',
      'Multi-language support',
      'Context awareness',
      'Function completion',
      'IDE integration'
    ],
    limitations: [
      'Requires paid subscription',
      'Internet connection required',
      'May suggest incorrect code'
    ],
    rating: 4.8,
    reviewCount: 3200,
    trending: true,
    featured: false,
    integrations: ['VSCode', 'Visual Studio', 'JetBrains IDEs', 'Neovim'],
    lastVerified: new Date('2025-05-20')
  },
  {
    id: '21',
    name: 'Claude Code Assistant',
    slug: 'claude-code',
    description: 'Advanced AI coding assistant powered by Anthropic\'s Claude model, specializing in complex code generation, refactoring, and detailed code explanations.',
    shortDescription: 'Advanced AI code assistant',
    logo: 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg',
    website: 'https://www.anthropic.com/claude/code',
    categoryId: 'code-creation',
    subcategoryIds: ['code-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic code generation', 'Limited requests']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Advanced features', 'Priority access', 'Higher limits']
        }
      ]
    },
    features: [
      'Complex code generation',
      'Detailed explanations',
      'Refactoring assistance',
      'Multiple languages',
      'Code review'
    ],
    limitations: [
      'Rate limits on free tier',
      'May require clarification',
      'Complex setups need guidance'
    ],
    rating: 4.7,
    reviewCount: 1800,
    trending: true,
    featured: false,
    integrations: ['VS Code', 'JetBrains', 'Terminal', 'API access'],
    lastVerified: new Date('2025-05-19')
  },
  {
    id: '22',
    name: 'Google Gemini Code',
    slug: 'gemini-code',
    description: 'Google\'s advanced code generation and assistance tool powered by the Gemini model, offering seamless integration with Google\'s development ecosystem.',
    shortDescription: 'Google\'s AI code assistant',
    logo: 'https://images.pexels.com/photos/4960464/pexels-photo-4960464.jpeg',
    website: 'https://gemini.google.com/code',
    categoryId: 'code-creation',
    subcategoryIds: ['code-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$15/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic features', 'Community support']
        },
        {
          name: 'Pro',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['Advanced coding features', 'Priority generation', 'Enhanced support']
        }
      ]
    },
    features: [
      'Smart code completion',
      'Google Cloud integration',
      'Multiple language support',
      'Code explanation',
      'Contextual suggestions'
    ],
    limitations: [
      'Limited features in free tier',
      'Google account required',
      'Region availability varies'
    ],
    rating: 4.6,
    reviewCount: 1500,
    trending: true,
    featured: false,
    integrations: ['Google Cloud', 'Android Studio', 'Chrome DevTools', 'Google Colab'],
    lastVerified: new Date('2025-05-18')
  },
  {
    id: '23',
    name: 'Runway Gen-2',
    slug: 'runway-gen2',
    description: 'Advanced AI video generation platform that creates high-quality videos from text prompts or images, with powerful editing and customization capabilities.',
    shortDescription: 'AI video generation and editing',
    logo: 'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg',
    website: 'https://runway.ml',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$15/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Creator',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['Basic video generation', 'Standard resolution', 'Community support']
        },
        {
          name: 'Professional',
          price: '$35/month',
          billingPeriod: 'monthly',
          features: ['Advanced generation', 'Higher resolution', 'Priority rendering', 'Professional support']
        }
      ]
    },
    features: [
      'Text-to-video generation',
      'Image-to-video conversion',
      'Video editing tools',
      'Motion tracking',
      'Style transfer'
    ],
    limitations: [
      'Processing time varies',
      'Limited video length',
      'Resource-intensive rendering'
    ],
    rating: 4.7,
    reviewCount: 850,
    trending: true,
    featured: true,
    integrations: ['Adobe Premiere', 'After Effects', 'DaVinci Resolve'],
    lastVerified: new Date('2025-05-20')
  },
  {
    id: '24',
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    description: 'State-of-the-art AI voice synthesis platform offering ultra-realistic voice generation and cloning capabilities with emotional expression control.',
    shortDescription: 'Premium AI voice generation',
    logo: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg',
    website: 'https://elevenlabs.io',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$22/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic voices', 'Limited characters', 'Standard quality']
        },
        {
          name: 'Pro',
          price: '$22/month',
          billingPeriod: 'monthly',
          features: ['Professional voices', 'Voice cloning', 'Priority generation']
        }
      ]
    },
    features: [
      'Ultra-realistic voices',
      'Voice cloning technology',
      'Emotion control',
      'Multi-language support',
      'API access'
    ],
    limitations: [
      'Character limits on free tier',
      'Clone quality varies',
      'Internet required for generation'
    ],
    rating: 4.8,
    reviewCount: 1200,
    trending: true,
    featured: false,
    integrations: ['Unity', 'Unreal Engine', 'Web API', 'Discord'],
    lastVerified: new Date('2025-05-15')
  },
  {
    id: '25',
    name: 'Inworld AI',
    slug: 'inworld-ai',
    description: 'Advanced AI character creation platform for games and interactive experiences, featuring dynamic NPC personalities and natural conversations.',
    shortDescription: 'AI character creation for games',
    logo: 'https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg',
    website: 'https://inworld.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'freemium',
      startingPrice: '$30/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic character creation', 'Limited interactions', 'Community support']
        },
        {
          name: 'Pro',
          price: '$30/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI characters', 'Custom behaviors', 'Developer tools']
        }
      ]
    },
    features: [
      'Dynamic NPC creation',
      'Natural conversations',
      'Emotional responses',
      'Memory and context',
      'Game engine integration'
    ],
    limitations: [
      'API call limits',
      'Response latency',
      'Complex setup process'
    ],
    rating: 4.6,
    reviewCount: 680,
    trending: true,
    featured: false,
    integrations: ['Unity', 'Unreal Engine', 'Roblox', 'Web API'],
    lastVerified: new Date('2025-05-18')
  },
  {
    id: '26',
    name: 'Descript',
    slug: 'descript',
    description: 'All-in-one AI-powered video and audio editing platform with transcription, voice cloning, and seamless content editing capabilities.',
    shortDescription: 'AI video and audio editing',
    logo: 'https://images.pexels.com/photos/1ownself1/pexels-photo-1ownself1.jpeg',
    website: 'https://www.descript.com',
    categoryId: 'media-creation',
    subcategoryIds: ['media-editing'],
    pricing: {
      type: 'freemium',
      startingPrice: '$12/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic editing', 'Limited transcription', 'Standard export']
        },
        {
          name: 'Creator',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['Advanced editing', 'Full transcription', 'Voice cloning']
        }
      ]
    },
    features: [
      'Text-based video editing',
      'AI transcription',
      'Voice cloning',
      'Screen recording',
      'Collaboration tools'
    ],
    limitations: [
      'Export limits on free tier',
      'Internet required',
      'Large file processing time'
    ],
    rating: 4.7,
    reviewCount: 920,
    trending: true,
    featured: true,
    integrations: ['Premiere Pro', 'Final Cut Pro', 'YouTube', 'Dropbox'],
    lastVerified: new Date('2025-05-19')
  },
  {
    id: '29',
    name: 'Pika',
    slug: 'pika',
    description: 'Next-generation AI video creation platform that specializes in dynamic scene transitions, camera movements, and high-quality video generation from both text and image inputs.',
    shortDescription: 'Advanced AI video creation and editing',
    logo: 'https://images.pexels.com/photos/2927583/pexels-photo-2927583.jpeg',
    website: 'https://pika.art',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Starter',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic video generation', 'Limited renders', 'Standard quality']
        },
        {
          name: 'Creator',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Advanced editing', 'Higher quality', 'More renders', 'Priority processing']
        }
      ]
    },
    features: [
      'Text-to-video generation',
      'Image-to-video conversion',
      'Advanced camera movements',
      'Scene transitions',
      'Style customization'
    ],
    limitations: [
      'Render time varies',
      'Quality depends on tier',
      'Some features in beta'
    ],
    rating: 4.7,
    reviewCount: 890,
    trending: true,
    featured: true,
    integrations: ['Adobe Creative Suite', 'Social media platforms', 'Cloud storage'],
    lastVerified: new Date('2025-05-23')
  },
  {
    id: '30',
    name: 'Character.ai',
    slug: 'character-ai',
    description: 'Advanced AI platform for creating and interacting with customized AI characters, featuring natural conversations, personality development, and integration capabilities.',
    shortDescription: 'Custom AI character creation',
    logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    website: 'https://character.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic character creation', 'Public characters', 'Standard response time']
        },
        {
          name: 'Premium',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Private characters', 'Advanced customization', 'Priority access', 'No ads']
        }
      ]
    },
    features: [
      'Custom character creation',
      'Natural conversations',
      'Memory and context',
      'Multi-language support',
      'API access'
    ],
    limitations: [
      'Response time varies',
      'Character consistency',
      'Usage limits on free tier'
    ],
    rating: 4.8,
    reviewCount: 1500,
    trending: true,
    featured: false,
    integrations: ['Discord', 'Telegram', 'Custom websites', 'Mobile apps'],
    lastVerified: new Date('2025-05-22')
  },
  {
    id: '27',
    name: 'DALL·E 3',
    slug: 'dalle3',
    description: 'OpenAI\'s advanced image generation AI that creates highly detailed and accurate images from natural language descriptions, with improved understanding of spatial relationships and artistic styles.',
    shortDescription: 'Advanced AI image generation by OpenAI',
    logo: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    website: 'https://openai.com/dall-e-3',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation'],
    pricing: {
      type: 'usage-based',
      startingPrice: 'Credits system',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic image generation', 'Limited credits monthly']
        },
        {
          name: 'Pro',
          price: 'Pay per use',
          billingPeriod: 'monthly',
          features: ['Higher resolution', 'More variations', 'Commercial rights']
        }
      ]
    },
    features: [
      'High-fidelity image generation',
      'Natural language understanding',
      'Style consistency',
      'Commercial usage rights',
      'Integration with ChatGPT'
    ],
    limitations: [
      'Credit system limits',
      'No direct photo editing',
      'May need prompt refinement'
    ],
    rating: 4.9,
    reviewCount: 2800,
    trending: true,
    featured: true,
    integrations: ['ChatGPT', 'Microsoft Designer', 'Adobe Creative Cloud'],
    lastVerified: new Date('2025-05-25')
  },
  {
    id: '28',
    name: 'Sora',
    slug: 'sora',
    description: 'OpenAI\'s groundbreaking text-to-video AI model that generates highly realistic, coherent videos with complex scenes, camera movements, and multiple characters.',
    shortDescription: 'OpenAI\'s text-to-video generation',
    logo: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg',
    website: 'https://openai.com/sora',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'API Access',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['High-quality video generation', 'Custom integration', 'Priority support']
        }
      ]
    },
    features: [
      'Realistic video generation',
      'Complex scene understanding',
      'Dynamic camera movements',
      'Multiple character interactions',
      'Consistent style and physics'
    ],
    limitations: [
      'Limited public access',
      'Resource-intensive processing',
      'Enterprise focus'
    ],
    rating: 4.9,
    reviewCount: 450,
    trending: true,
    featured: true,
    integrations: ['Custom API', 'Enterprise workflows'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '31',
    name: 'Synthesia',
    slug: 'synthesia',
    description: 'AI platform that creates professional video content with customizable AI avatars speaking your script, ideal for training, marketing, and educational content.',
    shortDescription: 'AI avatar video creation',
    logo: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    website: 'https://www.synthesia.io',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$30/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Starter',
          price: '$30/month',
          billingPeriod: 'monthly',
          features: ['20 video credits', 'Basic avatars', 'HD quality']
        },
        {
          name: 'Professional',
          price: '$90/month',
          billingPeriod: 'monthly',
          features: ['60 video credits', 'Premium avatars', '4K quality', 'Custom backgrounds']
        }
      ]
    },
    features: [
      'AI avatar customization',
      'Multi-language support',
      'Script to video',
      'Custom backgrounds',
      'Brand voice cloning'
    ],
    limitations: [
      'Credit-based system',
      'Limited avatar emotions',
      'Some languages in beta'
    ],
    rating: 4.7,
    reviewCount: 850,
    trending: true,
    featured: true,
    integrations: ['Zapier', 'Microsoft Teams', 'HubSpot', 'Slack'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '32',
    name: 'Colossyan',
    slug: 'colossyan',
    description: 'Enterprise-focused AI video creation platform specializing in professional training and corporate communications with realistic AI presenters.',
    shortDescription: 'Corporate AI video creation',
    logo: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    website: 'https://colossyan.com',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Custom pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Business',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['Custom AI presenters', 'Brand integration', 'Enterprise support']
        }
      ]
    },
    features: [
      'Professional AI presenters',
      'Corporate training focus',
      'Brand customization',
      'Multiple languages',
      'Enterprise security'
    ],
    limitations: [
      'Enterprise pricing only',
      'Minimum commitment required',
      'Setup time needed'
    ],
    rating: 4.6,
    reviewCount: 320,
    trending: false,
    featured: false,
    integrations: ['LMS platforms', 'Corporate portals', 'SharePoint'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '33',
    name: 'Lumen5',
    slug: 'lumen5',
    description: 'AI-powered video creation platform that transforms blog posts, articles, and text content into engaging social media videos with automated scene generation.',
    shortDescription: 'Blog to video automation',
    logo: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
    website: 'https://lumen5.com',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$29/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Community',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic templates', 'Watermarked videos', '720p resolution']
        },
        {
          name: 'Creator',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Custom branding', 'Full HD', 'Premium templates']
        }
      ]
    },
    features: [
      'Text to video conversion',
      'Social media templates',
      'Automated scene creation',
      'Brand customization',
      'Stock media library'
    ],
    limitations: [
      'Watermark in free tier',
      'Template limitations',
      'Basic automation only'
    ],
    rating: 4.5,
    reviewCount: 950,
    trending: true,
    featured: false,
    integrations: ['WordPress', 'HubSpot', 'Buffer', 'Hootsuite'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '34',
    name: 'Stable Diffusion',
    slug: 'stable-diffusion',
    description: 'Open-source AI image generation model known for its flexibility, customization options, and ability to run locally, supporting various creative workflows.',
    shortDescription: 'Open-source AI image generation',
    logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    website: 'https://stability.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Local installation', 'Community models', 'Basic features']
        },
        {
          name: 'API Access',
          price: 'Usage based',
          billingPeriod: 'monthly',
          features: ['Cloud API', 'Higher limits', 'Priority support']
        }
      ]
    },
    features: [
      'Local installation option',
      'Custom model training',
      'Multiple interfaces',
      'Active community',
      'Extensive customization'
    ],
    limitations: [
      'Technical setup required',
      'Hardware requirements',
      'Learning curve'
    ],
    rating: 4.7,
    reviewCount: 2100,
    trending: true,
    featured: true,
    integrations: ['Custom UIs', 'Discord bots', 'PhotoShop plugins'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '35',
    name: 'Adobe Firefly',
    slug: 'adobe-firefly',
    description: 'Adobe\'s AI creative suite for generating and editing images, with seamless integration into Creative Cloud apps and focus on commercial-safe content.',
    shortDescription: 'Adobe\'s AI creative tools',
    logo: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    website: 'https://www.adobe.com/firefly',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation', 'media-editing'],
    pricing: {
      type: 'subscription',
      startingPrice: '$19.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic features', 'Limited generations', 'Web only']
        },
        {
          name: 'Creative Cloud Add-on',
          price: '$19.99/month',
          billingPeriod: 'monthly',
          features: ['Full integration', 'Commercial license', 'Priority rendering']
        }
      ]
    },
    features: [
      'Text-to-image generation',
      'Generative fill',
      'Creative Cloud integration',
      'Commercial license',
      'Style customization'
    ],
    limitations: [
      'Subscription required for full access',
      'Creative Cloud dependency',
      'Web-only for free tier'
    ],
    rating: 4.8,
    reviewCount: 1600,
    trending: true,
    featured: true,
    integrations: ['Photoshop', 'Illustrator', 'Express', 'InDesign'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '36',
    name: 'Voicemod AI',
    slug: 'voicemod-ai',
    description: 'Real-time voice changing and synthesis platform using AI to create custom voices and sound effects for streaming, gaming, and content creation.',
    shortDescription: 'AI voice changing and synthesis',
    logo: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg',
    website: 'https://www.voicemod.net',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$15/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic voice effects', 'Limited voices', 'Standard quality']
        },
        {
          name: 'Pro',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['Custom voices', 'AI voice creation', 'Pro effects']
        }
      ]
    },
    features: [
      'Real-time voice changing',
      'Custom voice creation',
      'Soundboard integration',
      'Stream deck support',
      'Voice effects library'
    ],
    limitations: [
      'Windows only',
      'Hardware requirements',
      'Internet needed for AI features'
    ],
    rating: 4.6,
    reviewCount: 2800,
    trending: true,
    featured: false,
    integrations: ['OBS', 'Discord', 'Zoom', 'Skype'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '37',
    name: 'Suno AI',
    slug: 'suno-ai',
    description: 'Advanced AI music generation platform that creates complete songs with vocals, instruments, and arrangements from text prompts.',
    shortDescription: 'AI song creation platform',
    logo: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg',
    website: 'https://suno.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited generations', 'Basic quality', 'Community access']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Unlimited generations', 'High quality', 'Commercial rights']
        }
      ]
    },
    features: [
      'Complete song generation',
      'Vocal synthesis',
      'Style control',
      'Instrumental tracks',
      'Export options'
    ],
    limitations: [
      'Generation time varies',
      'Style limitations',
      'Quality varies by tier'
    ],
    rating: 4.7,
    reviewCount: 950,
    trending: true,
    featured: true,
    integrations: ['DAWs', 'Audio editing software', 'Streaming platforms'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '38',
    name: 'Aiva',
    slug: 'aiva',
    description: 'Professional AI music composition platform specializing in creating original soundtracks and background music for various media projects.',
    shortDescription: 'AI music composition',
    logo: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
    website: 'https://www.aiva.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$24/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic composition', 'Limited exports', 'Personal use']
        },
        {
          name: 'Pro',
          price: '$24/month',
          billingPeriod: 'monthly',
          features: ['Advanced composition', 'Commercial rights', 'Priority rendering']
        }
      ]
    },
    features: [
      'Orchestral composition',
      'Style customization',
      'Theme variation',
      'MIDI export',
      'Commercial licensing'
    ],
    limitations: [
      'Export limits on free tier',
      'Genre limitations',
      'Complex emotion control'
    ],
    rating: 4.5,
    reviewCount: 780,
    trending: false,
    featured: false,
    integrations: ['DAWs', 'Video editors', 'Game engines'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '39',
    name: 'Scenario.gg',
    slug: 'scenario-gg',
    description: 'AI-powered game asset generation platform that creates high-quality 3D models, textures, and environments from text descriptions or concept sketches.',
    shortDescription: 'AI game asset generation',
    logo: 'https://images.pexels.com/photos/7887800/pexels-photo-7887800.jpeg',
    website: 'https://scenario.gg',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'subscription',
      startingPrice: '$49/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Indie',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['Basic asset generation', 'Standard quality', 'Limited exports']
        },
        {
          name: 'Studio',
          price: '$199/month',
          billingPeriod: 'monthly',
          features: ['Advanced generation', 'Team collaboration', 'Priority support']
        }
      ]
    },
    features: [
      '3D asset generation',
      'Texture creation',
      'Environment generation',
      'Style matching',
      'Game engine integration'
    ],
    limitations: [
      'No free tier',
      'Processing time varies',
      'Complex asset limitations'
    ],
    rating: 4.6,
    reviewCount: 420,
    trending: true,
    featured: false,
    integrations: ['Unity', 'Unreal Engine', 'Blender', 'Maya'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '40',
    name: 'Luma AI',
    slug: 'luma-ai',
    description: 'Advanced 3D scanning and modeling platform that uses AI to convert real-world objects and environments into game-ready 3D assets.',
    shortDescription: 'AI 3D scanning and modeling',
    logo: 'https://images.pexels.com/photos/8728285/pexels-photo-8728285.jpeg',
    website: 'https://lumalabs.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'usage-based',
      startingPrice: 'Pay per scan',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic scans', 'Limited resolution', 'Community features']
        },
        {
          name: 'Pro',
          price: 'Usage based',
          billingPeriod: 'monthly',
          features: ['High-quality scans', 'Commercial use', 'Priority processing']
        }
      ]
    },
    features: [
      '3D scanning',
      'Mesh optimization',
      'Texture generation',
      'Mobile scanning',
      'Cloud processing'
    ],
    limitations: [
      'Scan quality varies',
      'Large file sizes',
      'Complex object limitations'
    ],
    rating: 4.7,
    reviewCount: 580,
    trending: true,
    featured: false,
    integrations: ['Unity', 'Unreal Engine', '3D modeling software'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '41',
    name: 'Unity Muse',
    slug: 'unity-muse',
    description: 'Unity\'s integrated AI toolset for game development, offering automated content generation, code assistance, and game testing capabilities.',
    shortDescription: 'Unity\'s AI game dev tools',
    logo: 'https://images.pexels.com/photos/1921326/pexels-photo-1921326.jpeg',
    website: 'https://unity.com/products/muse',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'subscription',
      startingPrice: 'Unity Pro required',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Pro',
          price: 'Unity Pro subscription',
          billingPeriod: 'monthly',
          features: ['Full AI toolset', 'Integration with Unity', 'Professional support']
        }
      ]
    },
    features: [
      'Asset generation',
      'Code assistance',
      'Game testing',
      'Performance optimization',
      'Content automation'
    ],
    limitations: [
      'Unity Pro required',
      'Learning curve',
      'Platform restrictions'
    ],
    rating: 4.5,
    reviewCount: 340,
    trending: true,
    featured: false,
    integrations: ['Unity Editor', 'Asset Store', 'Version Control'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '42',
    name: 'Adobe Creative Suite AI',
    slug: 'adobe-creative-suite-ai',
    description: 'Comprehensive AI tools integrated across Adobe\'s Creative Suite, enhancing photo editing, video production, and creative workflows.',
    shortDescription: 'Adobe\'s integrated AI tools',
    logo: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    website: 'https://www.adobe.com/creativecloud',
    categoryId: 'media-creation',
    subcategoryIds: ['media-editing'],
    pricing: {
      type: 'subscription',
      startingPrice: '$54.99/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Creative Cloud',
          price: '$54.99/month',
          billingPeriod: 'monthly',
          features: ['All Creative Cloud apps', 'AI features', 'Cloud storage']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['Advanced features', 'Enterprise support', 'Custom deployment']
        }
      ]
    },
    features: [
      'AI-powered editing',
      'Automated workflows',
      'Smart object selection',
      'Content-aware fill',
      'Neural filters'
    ],
    limitations: [
      'Subscription required',
      'Resource intensive',
      'Learning curve'
    ],
    rating: 4.8,
    reviewCount: 3500,
    trending: true,
    featured: true,
    integrations: ['Creative Cloud apps', 'Stock services', 'Cloud storage'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '43',
    name: 'ChatGPT (Document Mode)',
    slug: 'chatgpt-document',
    description: 'OpenAI\'s ChatGPT optimized for document creation, offering multi-format writing capabilities from essays to business plans with real-time collaboration features.',
    shortDescription: 'Multi-format document AI writer',
    logo: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
    website: 'https://chat.openai.com',
    categoryId: 'document-creation',
    subcategoryIds: ['general-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic document creation', 'Limited requests']
        },
        {
          name: 'Plus',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Advanced writing features', 'Priority access', 'Canva integration']
        }
      ]
    },
    features: [
      'Multi-format writing',
      'Real-time collaboration',
      'Template library',
      'Export options',
      'Style customization'
    ],
    limitations: [
      'Limited requests in free tier',
      'No direct file editing',
      'Internet required'
    ],
    rating: 4.8,
    reviewCount: 2500,
    trending: true,
    featured: false,
    integrations: ['Canva', 'Google Docs', 'Microsoft Word', 'Notion'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '44',
    name: 'Notion AI',
    slug: 'notion-ai',
    description: 'Integrated AI writing assistant within Notion\'s workspace, specializing in document drafting, meeting notes, and knowledge base creation.',
    shortDescription: 'Workspace integrated AI writing',
    logo: 'https://images.pexels.com/photos/4050420/pexels-photo-4050420.jpeg',
    website: 'https://notion.ai',
    categoryId: 'document-creation',
    subcategoryIds: ['general-documents'],
    pricing: {
      type: 'subscription',
      startingPrice: '$10/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'AI Add-on',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Document drafting', 'Meeting notes', 'Knowledge base']
        }
      ]
    },
    features: [
      'Integrated writing assistant',
      'Smart templates',
      'Content organization',
      'Collaborative editing',
      'Version history'
    ],
    limitations: [
      'Requires Notion subscription',
      'Limited to Notion platform',
      'Learning curve'
    ],
    rating: 4.7,
    reviewCount: 1800,
    trending: true,
    featured: false,
    integrations: ['Notion workspace', 'Web clipper', 'API'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '45',
    name: 'Microsoft Copilot',
    slug: 'microsoft-copilot',
    description: 'AI assistant integrated into Microsoft Word for document creation, summarization, and improvement, with advanced writing and formatting capabilities.',
    shortDescription: 'Microsoft Word AI assistant',
    logo: 'https://images.pexels.com/photos/4050445/pexels-photo-4050445.jpeg',
    website: 'https://microsoft.com/copilot',
    categoryId: 'document-creation',
    subcategoryIds: ['business-documents'],
    pricing: {
      type: 'subscription',
      startingPrice: '$30/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Microsoft 365',
          price: '$30/month',
          billingPeriod: 'monthly',
          features: ['Word integration', 'Advanced editing', 'Template access']
        }
      ]
    },
    features: [
      'Smart suggestions',
      'Document improvement',
      'Style refinement',
      'Format automation',
      'Citation help'
    ],
    limitations: [
      'Requires Microsoft 365',
      'Windows/Mac only',
      'Internet connection needed'
    ],
    rating: 4.6,
    reviewCount: 2200,
    trending: true,
    featured: false,
    integrations: ['Microsoft 365', 'Teams', 'SharePoint'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '46',
    name: 'GrammarlyGO',
    slug: 'grammarly-go',
    description: 'AI-powered writing assistant that helps refine tone, improve clarity, and generate content across various platforms and document types.',
    shortDescription: 'AI writing refinement',
    logo: 'https://images.pexels.com/photos/4050460/pexels-photo-4050460.jpeg',
    website: 'https://grammarly.com/go',
    categoryId: 'document-creation',
    subcategoryIds: ['general-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$15/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic writing suggestions', 'Grammar checking']
        },
        {
          name: 'Premium',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['AI writing', 'Tone adjustment', 'Full-sentence rewrites']
        }
      ]
    },
    features: [
      'Writing suggestions',
      'Tone adjustment',
      'Content generation',
      'Browser integration',
      'Desktop app'
    ],
    limitations: [
      'Limited features in free tier',
      'May require manual review',
      'Platform restrictions'
    ],
    rating: 4.7,
    reviewCount: 3100,
    trending: true,
    featured: false,
    integrations: ['Chrome', 'Word', 'Google Docs', 'Slack'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '47',
    name: 'Tome',
    slug: 'tome',
    description: 'AI-powered storytelling platform that creates visually rich documents and presentations with minimal input, ideal for pitch decks and visual narratives.',
    shortDescription: 'AI visual storytelling',
    logo: 'https://images.pexels.com/photos/4050475/pexels-photo-4050475.jpeg',
    website: 'https://tome.app',
    categoryId: 'document-creation',
    subcategoryIds: ['business-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$25/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic templates', 'Limited exports']
        },
        {
          name: 'Pro',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI', 'Custom branding', 'Full exports']
        }
      ]
    },
    features: [
      'Visual storytelling',
      'AI-generated layouts',
      'Image generation',
      'Collaboration tools',
      'Export options'
    ],
    limitations: [
      'Export limitations in free tier',
      'Template restrictions',
      'Storage limits'
    ],
    rating: 4.6,
    reviewCount: 950,
    trending: true,
    featured: false,
    integrations: ['Figma', 'Adobe CC', 'Slack', 'Notion'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '48',
    name: 'Copy.ai',
    slug: 'copy-ai',
    description: 'AI-powered writing platform focused on business content creation, featuring templates for marketing materials, sales copy, and professional documents.',
    shortDescription: 'Business content AI writer',
    logo: 'https://images.pexels.com/photos/4050480/pexels-photo-4050480.jpeg',
    website: 'https://copy.ai',
    categoryId: 'document-creation',
    subcategoryIds: ['business-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$35/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic templates', 'Limited generations']
        },
        {
          name: 'Pro',
          price: '$35/month',
          billingPeriod: 'monthly',
          features: ['Unlimited generations', 'Custom templates', 'Priority support']
        }
      ]
    },
    features: [
      'Marketing templates',
      'Sales copy generation',
      'Business document creation',
      'Multi-language support',
      'Team collaboration'
    ],
    limitations: [
      'Generation limits on free tier',
      'Template customization limited',
      'Advanced features require Pro'
    ],
    rating: 4.7,
    reviewCount: 1850,
    trending: true,
    featured: false,
    integrations: ['Chrome', 'Google Docs', 'WordPress', 'Shopify'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '49',
    name: 'LawGeex',
    slug: 'lawgeex',
    description: 'Enterprise-grade AI platform for legal document review and analysis, specializing in contract review, risk assessment, and compliance checking.',
    shortDescription: 'AI legal document analysis',
    logo: 'https://images.pexels.com/photos/4050485/pexels-photo-4050485.jpeg',
    website: 'https://lawgeex.com',
    categoryId: 'document-creation',
    subcategoryIds: ['legal-documents'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Custom pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['Contract review', 'Risk analysis', 'Compliance checking', 'Custom playbooks']
        }
      ]
    },
    features: [
      'AI contract review',
      'Risk assessment',
      'Compliance validation',
      'Legal playbooks',
      'Workflow automation'
    ],
    limitations: [
      'Enterprise focus only',
      'Complex implementation',
      'Requires legal expertise'
    ],
    rating: 4.6,
    reviewCount: 380,
    trending: false,
    featured: false,
    integrations: ['DocuSign', 'Salesforce', 'Microsoft Teams'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '50',
    name: 'Resume.io',
    slug: 'resume-io',
    description: 'AI-powered resume builder with smart content suggestions, ATS optimization, and professional templates for creating job-winning resumes and cover letters.',
    shortDescription: 'Smart resume builder',
    logo: 'https://images.pexels.com/photos/4050490/pexels-photo-4050490.jpeg',
    website: 'https://resume.io',
    categoryId: 'document-creation',
    subcategoryIds: ['resume-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic templates', 'Limited downloads']
        },
        {
          name: 'Pro',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['All templates', 'Unlimited downloads', 'Cover letters']
        }
      ]
    },
    features: [
      'AI content suggestions',
      'ATS optimization',
      'Professional templates',
      'Cover letter builder',
      'Multi-format export'
    ],
    limitations: [
      'Download limits on free tier',
      'Some features Premium only',
      'Limited customization'
    ],
    rating: 4.7,
    reviewCount: 2800,
    trending: true,
    featured: false,
    integrations: ['LinkedIn', 'Google Drive', 'Dropbox'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '51',
    name: 'Scite',
    slug: 'scite',
    description: 'AI research assistant that analyzes scientific papers, provides citation context, and helps create literature reviews with smart summarization.',
    shortDescription: 'Smart research assistant',
    logo: 'https://images.pexels.com/photos/4050495/pexels-photo-4050495.jpeg',
    website: 'https://scite.ai',
    categoryId: 'document-creation',
    subcategoryIds: ['academic-research'],
    pricing: {
      type: 'freemium',
      startingPrice: '$15/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic search', 'Limited citations']
        },
        {
          name: 'Premium',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['Full access', 'Citation reports', 'API access']
        }
      ]
    },
    features: [
      'Citation analysis',
      'Smart summaries',
      'Literature reviews',
      'Citation reports',
      'Reference management'
    ],
    limitations: [
      'Academic focus only',
      'Limited free features',
      'Requires research context'
    ],
    rating: 4.5,
    reviewCount: 750,
    trending: false,
    featured: false,
    integrations: ['Zotero', 'Mendeley', 'EndNote'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '52',
    name: 'Consensus',
    slug: 'consensus',
    description: 'AI-powered academic search engine that synthesizes research findings, generates literature reviews, and provides evidence-based insights.',
    shortDescription: 'Research synthesis AI',
    logo: 'https://images.pexels.com/photos/4050500/pexels-photo-4050500.jpeg',
    website: 'https://consensus.app',
    categoryId: 'document-creation',
    subcategoryIds: ['academic-research'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic search', 'Limited summaries']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Advanced search', 'Full summaries', 'Export options']
        }
      ]
    },
    features: [
      'Research synthesis',
      'Literature reviews',
      'Evidence analysis',
      'Citation tracking',
      'Export capabilities'
    ],
    limitations: [
      'Scientific focus only',
      'Complex queries needed',
      'Limited free tier'
    ],
    rating: 4.6,
    reviewCount: 620,
    trending: true,
    featured: false,
    integrations: ['Reference managers', 'Academic databases', 'Export tools'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '53',
    name: 'Jasper AI',
    slug: 'jasper-ai',
    description: 'Advanced AI writing platform specializing in marketing content, blog posts, and business documents with brand voice customization.',
    shortDescription: 'Marketing-focused AI writer',
    logo: 'https://images.pexels.com/photos/4050505/pexels-photo-4050505.jpeg',
    website: 'https://jasper.ai',
    categoryId: 'document-creation',
    subcategoryIds: ['business-documents'],
    pricing: {
      type: 'subscription',
      startingPrice: '$49/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Creator',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['50k words/month', 'Basic templates', 'Brand voice settings']
        },
        {
          name: 'Teams',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited words', 'Advanced features', 'Team collaboration']
        }
      ]
    },
    features: [
      'Marketing content generation',
      'Brand voice customization',
      'Multi-language support',
      'SEO optimization',
      'Team workflows'
    ],
    limitations: [
      'Higher pricing tier',
      'Learning curve',
      'Template limitations'
    ],
    rating: 4.8,
    reviewCount: 2200,
    trending: true,
    featured: false,
    integrations: ['Surfer SEO', 'Chrome', 'WordPress', 'Grammarly'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '54',
    name: 'Canva Docs',
    slug: 'canva-docs',
    description: 'Visual document creation platform with AI assistance for creating beautiful, design-rich documents and presentations.',
    shortDescription: 'Visual document creator',
    logo: 'https://images.pexels.com/photos/4050520/pexels-photo-4050520.jpeg',
    website: 'https://canva.com/docs',
    categoryId: 'document-creation',
    subcategoryIds: ['general-documents', 'business-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$12.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic templates', 'Limited storage']
        },
        {
          name: 'Pro',
          price: '$12.99/month',
          billingPeriod: 'monthly',
          features: ['Premium features', 'Team collaboration', 'Brand kit']
        }
      ]
    },
    features: [
      'Visual document design',
      'AI writing assistance',
      'Template library',
      'Real-time collaboration',
      'Brand consistency'
    ],
    limitations: [
      'Storage limits on free tier',
      'Some features Pro only',
      'Export restrictions'
    ],
    rating: 4.7,
    reviewCount: 3100,
    trending: true,
    featured: false,
    integrations: ['Google Drive', 'Dropbox', 'Microsoft Office'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '55',
    name: 'ClickUp AI',
    slug: 'clickup-ai',
    description: 'Integrated AI writing assistant for project documentation, team wikis, and collaborative documents within the ClickUp workspace.',
    shortDescription: 'Project documentation AI',
    logo: 'https://images.pexels.com/photos/4050525/pexels-photo-4050525.jpeg',
    website: 'https://clickup.com/ai',
    categoryId: 'document-creation',
    subcategoryIds: ['business-documents'],
    pricing: {
      type: 'subscription',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic docs', 'Limited AI usage']
        },
        {
          name: 'Business',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Full AI features', 'Advanced docs', 'Unlimited usage']
        }
      ]
    },
    features: [
      'Project documentation',
      'Team wikis',
      'AI writing assistance',
      'Document templates',
      'Collaboration tools'
    ],
    limitations: [
      'Requires ClickUp',
      'Limited free tier',
      'Platform-specific'
    ],
    rating: 4.6,
    reviewCount: 850,
    trending: false,
    featured: false,
    integrations: ['ClickUp', 'Slack', 'Google Workspace'],
    lastVerified: new Date('2025-05-24')
  },
  {
    id: '56',
    name: 'Otter.ai',
    slug: 'otter-ai',
    description: 'AI-powered meeting transcription and note-taking platform that converts conversations into searchable, shareable documents with smart summaries.',
    shortDescription: 'Meeting transcription AI',
    logo: 'https://images.pexels.com/photos/4050530/pexels-photo-4050530.jpeg',
    website: 'https://otter.ai',
    categoryId: 'document-creation',
    subcategoryIds: ['general-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$16.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic transcription', 'Limited minutes']
        },
        {
          name: 'Pro',
          price: '$16.99/month',
          billingPeriod: 'monthly',
          features: ['Advanced features', 'More minutes', 'Custom vocabulary']
        }
      ]
    },
    features: [
      'Live transcription',
      'Meeting notes',
      'Smart summaries',
      'Collaboration',
      'Custom vocabulary'
    ],
    limitations: [
      'Accuracy varies',
      'Limited free minutes',
      'Language restrictions'
    ],
    rating: 4.7,
    reviewCount: 2200,
    trending: true,
    featured: true,
    integrations: ['Zoom', 'Teams', 'Google Meet', 'Slack'],
    lastVerified: new Date('2025-05-24')
  }
];