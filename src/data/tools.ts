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
    featured: true,
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
    id: '3',
    name: 'Notion AI',
    slug: 'notion-ai',
    description: 'Notion AI integrates artificial intelligence into the Notion workspace, helping users draft content, summarize notes, brainstorm ideas, and more.',
    shortDescription: 'AI writing assistant integrated with Notion',
    logo: 'https://images.pexels.com/photos/5712159/pexels-photo-5712159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://notion.so',
    categoryId: 'document-creation',
    subcategoryIds: ['text-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$8/month per member',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Team',
          price: '$8/month',
          billingPeriod: 'monthly',
          features: ['AI writing assistance', 'Workspace integration']
        }
      ]
    },
    features: [
      'Content drafting',
      'Summarization',
      'Translation',
      'Brainstorming',
      'Seamless Notion integration'
    ],
    limitations: [
      'Requires Notion subscription',
      'Limited to Notion workspace',
      'Not available in all languages'
    ],
    rating: 4.7,
    reviewCount: 823,
    trending: false,
    featured: true,
    integrations: ['Notion'],
    lastVerified: new Date('2023-04-10')
  },
  {
    id: '4',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'GitHub Copilot is an AI pair programmer that helps developers write better code faster by suggesting line completions and entire functions in real-time.',
    shortDescription: 'AI pair programming assistant',
    logo: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://github.com/features/copilot',
    categoryId: 'code-creation',
    subcategoryIds: ['coding-assistants'],
    pricing: {
      type: 'subscription',
      startingPrice: '$10/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Individual',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['AI code completion', 'Multi-language support']
        }
      ]
    },
    features: [
      'Real-time code suggestions',
      'Multiple programming language support',
      'IDE integration',
      'Context-aware completions',
      'Function generation from comments'
    ],
    limitations: [
      'May suggest code with bugs or vulnerabilities',
      'Limited understanding of complex project contexts',
      'Subscription required for all features'
    ],
    rating: 4.8,
    reviewCount: 2156,
    trending: true,
    featured: false,
    integrations: ['Visual Studio Code', 'Visual Studio', 'JetBrains IDEs', 'Neovim'],
    lastVerified: new Date('2023-03-25')
  },
  {
    id: '5',
    name: 'DALL-E',
    slug: 'dall-e',
    description: 'DALL-E is an AI system that can create realistic images and art from a description in natural language, allowing users to generate unique visuals from text prompts.',
    shortDescription: 'Text-to-image AI generation tool',
    logo: 'https://images.pexels.com/photos/1191710/pexels-photo-1191710.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://openai.com/dall-e-3',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: 'Credits system, varies by usage',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic image generation', 'Limited credits']
        },
        {
          name: 'Pro',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['More credits', 'Priority generation']
        }
      ]
    },
    features: [
      'Photorealistic image generation',
      'Detailed prompt control',
      'Commercial rights to generations',
      'Outpainting and inpainting capabilities',
      'Multiple style options'
    ],
    limitations: [
      'Limited free generations',
      'Restricted content policies',
      'Credit system can be confusing'
    ],
    rating: 4.7,
    reviewCount: 1836,
    trending: false,
    featured: true,
    integrations: ['ChatGPT Plus', 'API access'],
    lastVerified: new Date('2023-02-18')
  },
  {
    id: '6',
    name: 'Zapier AI',
    slug: 'zapier-ai',
    description: 'Zapier AI integrates automation with artificial intelligence, enabling users to create and modify automated workflows using natural language instructions.',
    shortDescription: 'AI-powered workflow automation',
    logo: 'https://images.pexels.com/photos/5691695/pexels-photo-5691695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://zapier.com',
    categoryId: 'workflow-automation',
    subcategoryIds: ['business-automation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic automation', 'Limited tasks']
        },
        {
          name: 'Professional',
          price: '$19.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited tasks', 'Advanced automation', 'Priority support']
        }
      ]
    },
    features: [
      'Natural language workflow creation',
      'AI-suggested automation recipes',
      'Integration with 5,000+ apps',
      'Custom automation logic',
      'No-code interface'
    ],
    limitations: [
      'Free tier has limited tasks',
      'Complex workflows require higher tiers',
      'Learning curve for advanced features'
    ],
    rating: 4.6,
    reviewCount: 947,
    trending: false,
    featured: false,
    integrations: ['5,000+ apps and services'],
    lastVerified: new Date('2023-01-15')
  },
  {
    id: '7',
    name: 'Synthesia',
    slug: 'synthesia',
    description: 'Synthesia is an AI video generation platform that creates professional videos with virtual avatars speaking your script in multiple languages.',
    shortDescription: 'AI video creation with virtual avatars',
    logo: 'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://www.synthesia.io',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$30/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Professional',
          price: '$30/month',
          billingPeriod: 'monthly',
          features: ['AI video generation', 'Multiple avatars', '120+ languages', 'Custom backgrounds']
        }
      ]
    },
    features: [
      'AI video generation',
      'Multiple avatar options',
      '120+ language and accent options',
      'Custom backgrounds',
      'Screen recording integration'
    ],
    limitations: [
      'Limited customization of avatars',
      'Some languages have fewer avatar options',
      'Higher pricing for advanced features'
    ],
    rating: 4.5,
    reviewCount: 756,
    trending: true,
    featured: false,
    integrations: ['YouTube', 'HubSpot', 'Microsoft Teams'],
    lastVerified: new Date('2022-12-20')
  },
  {
    id: '8',
    name: 'Anthropic Claude',
    slug: 'anthropic-claude',
    description: 'Claude is a conversational AI assistant created by Anthropic with a focus on helpfulness, harmlessness, and honesty, capable of complex reasoning and detailed responses.',
    shortDescription: 'Helpful and harmless conversational AI',
    logo: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://www.anthropic.com/claude',
    categoryId: 'general-ai',
    subcategoryIds: ['chatbots'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month for Pro',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic chat functionality', 'Standard response time']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Priority access', 'Longer context window', 'Advanced features']
        }
      ]
    },
    features: [
      'Long context window (100K tokens)',
      'Detailed reasoning',
      'Nuanced content generation',
      'Helpful, harmless, and honest responses',
      'API access'
    ],
    limitations: [
      'No image generation',
      'Limited file handling',
      'Knowledge cutoff date'
    ],
    rating: 4.8,
    reviewCount: 1253,
    trending: true,
    featured: true,
    integrations: ['Amazon Bedrock', 'Slack', 'Custom APIs'],
    lastVerified: new Date('2023-09-05')
  },
  {
    id: '9',
    name: 'Promptbase',
    slug: 'promptbase',
    description: 'Promptbase is a marketplace for buying and selling quality prompts for AI art and language models, helping users get better results from tools like DALL-E, Midjourney, and GPT models.',
    shortDescription: 'Marketplace for AI prompts',
    logo: 'https://images.pexels.com/photos/5691653/pexels-photo-5691653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://promptbase.com',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-libraries'],
    pricing: {
      type: 'freemium',
      startingPrice: 'Varies by prompt',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Browse prompts', 'Basic access']
        },
        {
          name: 'Pro',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Premium prompts', 'Early access', 'Seller features']
        }
      ]
    },
    features: [
      'Curated prompt marketplace',
      'Prompt effectiveness ratings',
      'Various AI tool support',
      'Seller dashboard',
      'Prompt previews'
    ],
    limitations: [
      'Quality varies by seller',
      'Higher prices for premium prompts',
      'No guarantee of results'
    ],
    rating: 4.3,
    reviewCount: 521,
    trending: false,
    featured: false,
    integrations: ['Compatible with most AI tools'],
    lastVerified: new Date('2023-07-12')
  },
  {
    id: '10',
    name: 'Beautiful.ai',
    slug: 'beautiful-ai',
    description: 'Beautiful.ai is an AI-powered presentation software that designs slides automatically as you add content, making it easy to create professional presentations quickly.',
    shortDescription: 'AI-powered presentation creation',
    logo: 'https://images.pexels.com/photos/7567464/pexels-photo-7567464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    website: 'https://www.beautiful.ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$12/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic templates', 'Limited presentations']
        },
        {
          name: 'Pro',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['Smart templates', 'Team collaboration', 'Advanced features']
        }
      ]
    },
    features: [
      'Smart templates',
      'Automatic design adjustments',
      'Team collaboration',
      'Brand customization',
      'Library of icons and images'
    ],
    limitations: [
      'Limited customization on free plan',
      'Some advanced features require higher tiers',
      'Limited offline capabilities'
    ],
    rating: 4.6,
    reviewCount: 872,
    trending: false,
    featured: true,
    integrations: ['Slack', 'Google Drive', 'Unsplash'],
    lastVerified: new Date('2023-08-30')
  }
];