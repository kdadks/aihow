import { Tool } from '../types';

export const tools: Tool[] = [
  {
    id: 'zapier-ai',
    name: 'Zapier AI',
    slug: 'zapier-ai',
    description: 'Zapier AI combines natural language processing with workflow automation, allowing users to create complex automations by simply describing what they want to accomplish. It connects with 5,000+ apps and services, making it easy to automate tasks across different platforms without coding.',
    shortDescription: 'Natural language workflow automation for 5,000+ apps',
    logo: 'https://images.pexels.com/photos/11035386/pexels-photo-11035386.jpeg',
    website: 'https://zapier.com/ai',
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
          features: ['5 single-step Zaps', 'Basic AI suggestions', '100 tasks/month']
        },
        {
          name: 'Starter',
          price: '$19.99/month',
          billingPeriod: 'monthly',
          features: ['20 multi-step Zaps', 'Standard AI capabilities', '750 tasks/month']
        },
        {
          name: 'Professional',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['Unlimited Zaps', 'Advanced AI automation', '2,000 tasks/month', 'Custom logic']
        },
        {
          name: 'Team & Company',
          price: '$69+/month',
          billingPeriod: 'monthly',
          features: ['Unlimited Zaps', 'Premium AI features', 'Team sharing', 'Role-based access']
        }
      ]
    },
    features: [
      'Natural language automation creation',
      'Integration with 5,000+ apps',
      'AI-assisted workflow recommendations',
      'Multi-step automation sequences',
      'Conditional logic and branching',
      'Error handling and notifications'
    ],
    limitations: [
      'Complex custom logic may still require manual setup',
      'Free plan has significant limitations',
      'May require setup time for optimal workflows',
      'Some third-party app integrations require paid plans'
    ],
    rating: 4.8,
    reviewCount: 1560,
    trending: true,
    featured: true,
    integrations: ['Google Workspace', 'Microsoft 365', 'Slack', 'CRM systems', 'Email services', '5,000+ apps'],
    lastVerified: new Date('2025-05-20')
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    slug: 'notion-ai',
    description: 'Notion AI transforms your workspace by adding powerful AI capabilities to the popular productivity platform. It can write, edit, summarize, and organize content while seamlessly integrating with Notion\'s powerful database and document management features to enhance team productivity and collaboration.',
    shortDescription: 'AI-powered writing and organization within Notion workspaces',
    logo: 'https://images.pexels.com/photos/11035469/pexels-photo-11035469.jpeg',
    website: 'https://www.notion.so/product/ai',
    categoryId: 'workflow-automation',
    subcategoryIds: ['productivity-ai', 'document-creation'],
    pricing: {
      type: 'add-on',
      startingPrice: '$8/member/month for Notion AI',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Notion Personal',
          price: '$0 + $8/month for AI',
          billingPeriod: 'monthly',
          features: ['Basic Notion features', 'Limited AI usage', 'Personal projects']
        },
        {
          name: 'Notion Personal Pro',
          price: '$8/month + $8/month for AI',
          billingPeriod: 'monthly',
          features: ['Unlimited blocks', 'Full AI capabilities', 'Advanced page analytics']
        },
        {
          name: 'Notion Team',
          price: '$10/member/month + $8/member/month for AI',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Unlimited team members', 'Shared AI capabilities', 'Advanced permissions']
        }
      ]
    },
    features: [
      'AI-powered content creation and editing',
      'Content summarization and extraction',
      'Meeting notes generation',
      'Multiple writing styles and tones',
      'Translation capabilities',
      'Seamless integration with Notion databases'
    ],
    limitations: [
      'Requires Notion subscription for full functionality',
      'Additional cost on top of base Notion pricing',
      'Occasional inaccuracies in complex content generation',
      'Network connectivity required for AI functions'
    ],
    rating: 4.7,
    reviewCount: 1280,
    trending: true,
    featured: true,
    integrations: ['Notion workspace', 'Web Clipper', 'API access', 'Import/export tools'],
    lastVerified: new Date('2025-05-18')
  },
  {
    id: 'reclaim-ai',
    name: 'Reclaim AI',
    slug: 'reclaim-ai',
    description: 'Reclaim AI is an intelligent calendar assistant that automatically schedules your tasks, habits, and meetings to optimize your time. Using AI to understand your priorities and work patterns, it finds the perfect time slots, protects your focus time, and adapts to changes in real-time.',
    shortDescription: 'AI calendar assistant for time optimization and scheduling',
    logo: 'https://images.pexels.com/photos/3760810/pexels-photo-3760810.jpeg',
    website: 'https://reclaim.ai',
    categoryId: 'workflow-automation',
    subcategoryIds: ['scheduling-automation', 'personal-automation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$8/user/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Smart scheduling', 'Calendar sync', '1:1 scheduling', 'Basic habits']
        },
        {
          name: 'Pro',
          price: '$8/user/month',
          billingPeriod: 'monthly',
          features: ['All basic features', 'Time analytics', 'Advanced task scheduling', 'Calendar defense', 'Smart 1:1s']
        },
        {
          name: 'Team',
          price: '$12/user/month',
          billingPeriod: 'monthly',
          features: ['All Pro features', 'Team analytics', 'Priority support', 'Admin controls', 'API access']
        }
      ]
    },
    features: [
      'AI-powered smart scheduling',
      'Automatic task prioritization',
      'Focus time protection',
      'Time analytics and insights',
      'Calendar defense mechanisms',
      'Multiple calendar integration'
    ],
    limitations: [
      'Limited customization in free tier',
      'Learning curve to optimize AI scheduling',
      'Requires calendar data access',
      'Some features only available on paid plans'
    ],
    rating: 4.7,
    reviewCount: 890,
    trending: true,
    featured: false,
    integrations: ['Google Calendar', 'Microsoft Outlook', 'Slack', 'Asana', 'Todoist', 'Zoom'],
    lastVerified: new Date('2025-05-16')
  },
  {
    id: 'motion',
    name: 'Motion',
    slug: 'motion',
    description: 'Motion combines AI-powered project management with intelligent calendar scheduling to automatically organize your tasks and meetings for optimal productivity. It adapts to your work style, reschedules around new commitments, and ensures you stay focused on high-priority work.',
    shortDescription: 'AI project manager and calendar optimizer in one platform',
    logo: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    website: 'https://www.usemotion.com',
    categoryId: 'workflow-automation',
    subcategoryIds: ['scheduling-automation', 'personal-automation', 'productivity-ai'],
    pricing: {
      type: 'subscription',
      startingPrice: '$19/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Individual',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['AI schedule optimization', 'Task management', 'Calendar integration', 'Personal projects']
        },
        {
          name: 'Professional',
          price: '$34/month',
          billingPeriod: 'monthly',
          features: ['All Individual features', 'Advanced project management', 'Custom workflows', 'Priority support']
        },
        {
          name: 'Team',
          price: '$12/user/month',
          billingPeriod: 'monthly',
          features: ['All Professional features', 'Team collaboration', 'Workload balancing', 'Team analytics']
        }
      ]
    },
    features: [
      'AI calendar optimization',
      'Automated task scheduling',
      'Project management integration',
      'Smart meeting scheduling',
      'Focus time protection',
      'Real-time schedule adaptation'
    ],
    limitations: [
      'No free tier available',
      'Higher price point than some competitors',
      'Requires consistent task input for optimal results',
      'Learning curve for full feature utilization'
    ],
    rating: 4.6,
    reviewCount: 760,
    trending: true,
    featured: false,
    integrations: ['Google Calendar', 'Microsoft Outlook', 'Slack', 'Zoom', 'Google Meet', 'Asana'],
    lastVerified: new Date('2025-05-15')
  },
  {
    id: 'clockwise',
    name: 'Clockwise',
    slug: 'clockwise',
    description: 'Clockwise uses AI to optimize your calendar automatically, creating Focus Time by intelligently moving meetings to the optimal times. It analyzes everyone\'s schedule patterns to find the best time slots, minimizes context switching, and ensures teams have coordinated blocks of uninterrupted time.',
    shortDescription: 'AI calendar optimization for creating focus time',
    logo: 'https://images.pexels.com/photos/3760778/pexels-photo-3760778.jpeg',
    website: 'https://www.getclockwise.com',
    categoryId: 'workflow-automation',
    subcategoryIds: ['scheduling-automation', 'productivity-ai'],
    pricing: {
      type: 'freemium',
      startingPrice: '$6.75/user/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Focus Time creation', 'Calendar analytics', 'Basic integrations']
        },
        {
          name: 'Teams',
          price: '$6.75/user/month',
          billingPeriod: 'monthly',
          features: ['All free features', 'Team scheduling', 'No-meeting days', 'Team analytics']
        },
        {
          name: 'Business',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['All Teams features', 'Enterprise SSO', 'Advanced analytics', 'Dedicated support']
        }
      ]
    },
    features: [
      'AI-driven Focus Time creation',
      'Smart meeting scheduling',
      'Calendar analytics and insights',
      'Team schedule coordination',
      'Flexible working hours support',
      'No-meeting days facilitation'
    ],
    limitations: [
      'Primarily focused on Google Calendar',
      'Limited customization in free tier',
      'Requires team adoption for best results',
      'Some organizations may have policy restrictions'
    ],
    rating: 4.6,
    reviewCount: 850,
    trending: false,
    featured: false,
    integrations: ['Google Calendar', 'Microsoft Outlook (beta)', 'Slack', 'Zoom', 'Asana', 'GitHub'],
    lastVerified: new Date('2025-05-08')
  },
  {
    id: 'tana',
    name: 'Tana AI',
    slug: 'tana',
    description: 'Tana is an AI-enhanced workspace that combines the flexibility of a notes app with the structure of a database. With its unique supertags and AI capabilities, it helps organize your thoughts, manage projects, and automate workflows in a highly customizable and interconnected environment.',
    shortDescription: 'AI-powered personal knowledge management system',
    logo: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg',
    website: 'https://tana.inc',
    categoryId: 'workflow-automation',
    subcategoryIds: ['productivity-ai', 'personal-automation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$10/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Personal',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Core Tana features', 'AI assistance', 'Unlimited nodes', 'Public templates']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['All Personal features', 'Advanced AI capabilities', 'API access', 'Priority support']
        },
        {
          name: 'Team',
          price: '$15/user/month',
          billingPeriod: 'monthly',
          features: ['All Pro features', 'Team collaboration', 'Shared workspaces', 'Admin controls']
        }
      ]
    },
    features: [
      'AI content generation and summarization',
      'Structured notes with supertags',
      'Dynamic views and filters',
      'Cross-reference linking and backlinks',
      'Customizable templates and workflows',
      'Natural language processing'
    ],
    limitations: [
      'No free tier available',
      'Learning curve for advanced features',
      'Limited third-party integrations compared to competitors',
      'Relatively new product still in development'
    ],
    rating: 4.7,
    reviewCount: 620,
    trending: true,
    featured: false,
    integrations: ['API access', 'Web Clipper', 'Limited third-party integrations'],
    lastVerified: new Date('2025-05-14')
  },
  {
    id: 'mem-ai',
    name: 'Mem AI',
    slug: 'mem-ai',
    description: 'Mem AI is a self-organizing workspace powered by AI that captures, organizes and connects your information automatically. With its powerful search, knowledge generation, and collaboration features, it helps individuals and teams turn scattered notes into structured knowledge.',
    shortDescription: 'AI-powered self-organizing workspace and knowledge assistant',
    logo: 'https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg',
    website: 'https://mem.ai',
    categoryId: 'workflow-automation',
    subcategoryIds: ['productivity-ai', 'personal-automation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$8/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic notes', 'Limited AI features', 'Search functionality', '100MB storage']
        },
        {
          name: 'Personal',
          price: '$8/month',
          billingPeriod: 'monthly',
          features: ['Unlimited notes', 'Full AI capabilities', 'Advanced search', '5GB storage']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['All Personal features', 'Premium AI features', 'API access', '20GB storage', 'Priority support']
        },
        {
          name: 'Team',
          price: '$15/user/month',
          billingPeriod: 'monthly',
          features: ['All Pro features', 'Team workspaces', 'Collaborative editing', 'Admin controls']
        }
      ]
    },
    features: [
      'AI-generated summaries and insights',
      'Automatic note organization',
      'Natural language search',
      'Knowledge connections and recommendations',
      'Document embedding and analysis',
      'Multi-platform synchronization'
    ],
    limitations: [
      'Limited storage in free tier',
      'Full feature set requires paid plan',
      'Advanced AI features can be resource-intensive',
      'Some users may prefer more manual organization'
    ],
    rating: 4.6,
    reviewCount: 710,
    trending: true,
    featured: false,
    integrations: ['Web clipper', 'Mobile apps', 'Email integration', 'API access', 'Calendar connections'],
    lastVerified: new Date('2025-05-12')
  },
  {
    id: 'make-ai',
    name: 'Make AI',
    slug: 'make-ai',
    description: 'Make AI (formerly Integromat) enhances its powerful visual automation platform with AI capabilities, allowing users to create complex workflows with natural language instructions. The platform connects 1,000+ services and apps while providing advanced logic, transformations, and error handling.',
    shortDescription: 'Visual workflow automation platform enhanced with AI',
    logo: 'https://images.pexels.com/photos/5926393/pexels-photo-5926393.jpeg',
    website: 'https://www.make.com',
    categoryId: 'workflow-automation',
    subcategoryIds: ['business-automation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$9/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['1,000 operations', 'Basic integrations', 'Limited AI features', '2 active scenarios']
        },
        {
          name: 'Core',
          price: '$9/month',
          billingPeriod: 'monthly',
          features: ['10,000 operations', 'Standard AI capabilities', '3 active scenarios']
        },
        {
          name: 'Pro',
          price: '$16/month',
          billingPeriod: 'monthly',
          features: ['10,000 operations', 'Advanced AI features', '10 active scenarios', 'On-premises execution']
        },
        {
          name: 'Teams & Enterprise',
          price: '$29+/month',
          billingPeriod: 'monthly',
          features: ['Custom operations', 'Premium AI assistance', 'Team collaboration', 'Enterprise support']
        }
      ]
    },
    features: [
      'Visual workflow builder',
      'AI-powered automation suggestions',
      'Real-time execution',
      'Data mapping and transformation',
      'Error handling and retries',
      'Connections to 1,000+ apps and services'
    ],
    limitations: [
      'More technical learning curve than some alternatives',
      'Limited operations in free tier',
      'Complex scenarios require paid plans',
      'Some integrations require premium subscriptions'
    ],
    rating: 4.7,
    reviewCount: 1100,
    trending: false,
    featured: false,
    integrations: ['Google Workspace', 'Microsoft 365', 'CRM systems', 'Marketing platforms', 'Payment processors', '1,000+ apps'],
    lastVerified: new Date('2025-05-10')
  },
  {
    id: 'llama-3',
    name: 'Llama 3',
    slug: 'llama-3',
    description: 'Llama 3 is Meta\'s open-source large language model that offers strong performance across various tasks. Available in different sizes with the ability to be run locally or via API, it provides developers with flexibility for building AI applications while maintaining strong reasoning capabilities.',
    shortDescription: 'Meta\'s open-source AI model for local and cloud deployment',
    logo: 'https://images.pexels.com/photos/7048043/pexels-photo-7048043.jpeg',
    website: 'https://llama.meta.com',
    categoryId: 'general-ai',
    subcategoryIds: ['multimodal-ai', 'chatbots'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Free to use', 'Local deployment possible', 'Commercial usage allowed', 'Different model sizes']
        }
      ]
    },
    features: [
      'Open-source foundation model',
      'Multiple model sizes (8B to 70B parameters)',
      'Local deployment capabilities',
      'Strong reasoning and coding abilities',
      'Community-driven improvements'
    ],
    limitations: [
      'Requires substantial computing resources for larger models',
      'Less powerful than some proprietary models',
      'Knowledge cutoff date limitations',
      'Requires technical expertise to deploy locally'
    ],
    rating: 4.6,
    reviewCount: 1450,
    trending: true,
    featured: false,
    integrations: ['Hugging Face', 'Local deployment', 'Various frameworks'],
    lastVerified: new Date('2025-05-15')
  },
  {
    id: 'codeium',
    name: 'Codeium',
    slug: 'codeium',
    description: 'Codeium is a free AI-powered coding assistant that provides intelligent code completions, explanations, and refactoring suggestions across multiple languages and IDEs. It offers a compelling alternative to paid coding assistants with enterprise-grade security features.',
    shortDescription: 'Free AI coding assistant with enterprise features',
    logo: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    website: 'https://codeium.com',
    categoryId: 'general-ai',
    subcategoryIds: ['coding-assistants'],
    pricing: {
      type: 'freemium',
      startingPrice: 'Enterprise pricing available',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['AI code completions', 'Multiple language support', 'IDE integrations', 'Unlimited usage']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['All free features', 'Enhanced security', 'Team management', 'Priority support', 'Custom models']
        }
      ]
    },
    features: [
      'AI-powered code completions',
      'Support for 70+ programming languages',
      'IDE integrations (VS Code, JetBrains, Vim, etc.)',
      'Code explanation and documentation',
      'Natural language to code translation'
    ],
    limitations: [
      'May occasionally suggest incorrect code',
      'Less advanced than some paid alternatives for complex tasks',
      'Limited context window in free version'
    ],
    rating: 4.6,
    reviewCount: 950,
    trending: true,
    featured: false,
    integrations: ['VS Code', 'JetBrains IDEs', 'Vim/Neovim', 'Jupyter', 'Web browsers'],
    lastVerified: new Date('2025-05-18')
  },
  {
    id: 'you-ai',
    name: 'You.com AI',
    slug: 'you-ai',
    description: 'You.com AI is an advanced search engine with integrated AI capabilities that provides summarized search results, chat functionality, and specialized modes for different tasks. It focuses on delivering real-time information with source citations while maintaining user privacy.',
    shortDescription: 'AI-first search engine with privacy focus',
    logo: 'https://images.pexels.com/photos/5473302/pexels-photo-5473302.jpeg',
    website: 'https://you.com',
    categoryId: 'general-ai',
    subcategoryIds: ['search-augmentation', 'chatbots'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month for Pro',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic search & AI chat', 'Source citations', 'Privacy-focused']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['All free features', 'Priority access', 'Advanced AI models', 'Higher usage limits', 'No ads']
        }
      ]
    },
    features: [
      'AI-powered search summaries',
      'Chat mode with internet access',
      'Privacy-focused approach',
      'Source citations for verification',
      'Specialized search modes (code, shopping, etc.)'
    ],
    limitations: [
      'Search depth sometimes limited compared to traditional search engines',
      'May occasionally provide outdated information',
      'Pro subscription required for premium features'
    ],
    rating: 4.5,
    reviewCount: 1100,
    trending: true,
    featured: false,
    integrations: ['Web browser', 'Mobile app', 'Chrome extension'],
    lastVerified: new Date('2025-05-12')
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    slug: 'deepseek',
    description: 'DeepSeek AI offers powerful language models for various tasks with its family of models including DeepSeek Chat and DeepSeek Coder, providing advanced capabilities for both general conversation and specialized code generation.',
    shortDescription: 'Advanced AI models for conversation and coding',
    logo: 'https://images.pexels.com/photos/7709019/pexels-photo-7709019.jpeg',
    website: 'https://deepseek.com',
    categoryId: 'general-ai',
    subcategoryIds: ['chatbots', 'coding-assistants'],
    pricing: {
      type: 'free',
      startingPrice: 'Free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic chat functionality', 'Limited usage']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Unlimited usage', 'Advanced features', 'Priority access']
        }
      ]
    },
    features: [
      'Advanced language understanding',
      'Code generation and explanation',
      'Specialized coding capabilities',
      'Context-aware responses',
      'Multi-turn conversations'
    ],
    limitations: [
      'May occasionally generate incorrect information',
      'Limited to knowledge available during training',
      'Less detailed understanding of specialized domains'
    ],
    rating: 4.7,
    reviewCount: 850,
    trending: true,
    featured: false,
    integrations: ['API access', 'Web interface'],
    lastVerified: new Date('2025-04-20')
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'GitHub Copilot is an AI pair programmer that helps developers write code faster with suggestions based on comments and existing code. Powered by advanced language models, it integrates with popular editors and understands dozens of programming languages.',
    shortDescription: 'AI pair programmer for developers',
    logo: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg',
    website: 'https://github.com/features/copilot',
    categoryId: 'general-ai',
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
          features: ['Code suggestions', 'Editor integration', 'Multiple programming languages']
        },
        {
          name: 'Business',
          price: '$19/user/month',
          billingPeriod: 'monthly',
          features: ['All individual features', 'Admin controls', 'Organization-wide management']
        }
      ]
    },
    features: [
      'Real-time code suggestions',
      'Support for dozens of programming languages',
      'IDE integration (VS Code, Visual Studio, JetBrains IDEs)',
      'Auto-completion of repetitive code',
      'Natural language to code translation'
    ],
    limitations: [
      'May suggest code with bugs or security vulnerabilities',
      'Performance varies by programming language',
      'Requires internet connection',
      'Occasional irrelevant suggestions'
    ],
    rating: 4.8,
    reviewCount: 2250,
    trending: true,
    featured: true,
    integrations: ['VS Code', 'Visual Studio', 'JetBrains IDEs', 'GitHub'],
    lastVerified: new Date('2025-05-15')
  },
  {
    id: 'perplexity-ai',
    name: 'Perplexity AI',
    slug: 'perplexity-ai',
    description: 'Perplexity AI is an AI-powered search engine that provides accurate answers with real-time information from the internet. It combines large language models with search capabilities to deliver cited, up-to-date responses to complex queries.',
    shortDescription: 'AI search engine with real-time information',
    logo: 'https://images.pexels.com/photos/9420595/pexels-photo-9420595.jpeg',
    website: 'https://www.perplexity.ai',
    categoryId: 'general-ai',
    subcategoryIds: ['search-augmentation', 'chatbots'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month for Pro',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic search features', 'Limited daily queries']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Unlimited searches', 'Advanced models', 'Custom sources', 'Collections']
        }
      ]
    },
    features: [
      'Real-time internet search',
      'Cited sources for verification',
      'Multi-modal search capabilities',
      'Conversational interface',
      'Complex query understanding'
    ],
    limitations: [
      'Search depth limited in free tier',
      'Citation quality can vary',
      'May occasionally misunderstand complex queries'
    ],
    rating: 4.7,
    reviewCount: 1850,
    trending: true,
    featured: false,
    integrations: ['Mobile app', 'Web interface', 'API (Pro+)'],
    lastVerified: new Date('2025-05-10')
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    slug: 'claude-3-opus',
    description: 'Claude 3 Opus is Anthropic\'s most powerful AI assistant, capable of sophisticated reasoning, nuanced conversation, and handling complex tasks across text, vision, and code. It excels at detailed analysis and creative content generation with exceptional accuracy.',
    shortDescription: 'Anthropic\'s most capable multimodal AI assistant',
    logo: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg',
    website: 'https://www.anthropic.com/claude',
    categoryId: 'general-ai',
    subcategoryIds: ['multimodal-ai', 'chatbots'],
    pricing: {
      type: 'api-usage',
      startingPrice: 'Starts at $15/million tokens',
      hasFreeOption: false,
      tiers: [
        {
          name: 'API Usage',
          price: 'Starts at $15/million input tokens, $75/million output tokens',
          billingPeriod: 'monthly',
          features: ['Full model capabilities', 'Pay-as-you-go pricing', 'Enterprise options available']
        }
      ]
    },
    features: [
      'Advanced reasoning capabilities',
      'Multimodal understanding (text, images)',
      'Detailed analysis of complex information',
      'Code generation and interpretation',
      'Nuanced conversation with long context windows'
    ],
    limitations: [
      'Higher cost than simpler models',
      'Knowledge cutoff date',
      'Occasional hallucinations in complex scenarios'
    ],
    rating: 4.9,
    reviewCount: 1200,
    trending: true,
    featured: true,
    integrations: ['Claude web interface', 'API access', 'AWS Bedrock', 'Slack'],
    lastVerified: new Date('2025-05-01')
  },
  {
    id: 'anthropic-claude-for-teams',
    name: 'Claude for Teams',
    slug: 'anthropic-claude-for-teams',
    description: 'Claude for Teams is Anthropic\'s enterprise solution that provides teams with collaborative access to Claude AI capabilities. It offers enhanced security, admin controls, and specialized features designed for business use cases while maintaining Claude\'s reasoning abilities and safety focus.',
    shortDescription: 'Enterprise-focused Claude AI for team collaboration',
    logo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
    website: 'https://www.anthropic.com/claude/teams',
    categoryId: 'general-ai',
    subcategoryIds: ['specialized-assistants', 'chatbots'],
    pricing: {
      type: 'subscription',
      startingPrice: '$30/user/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Teams',
          price: '$30/user/month',
          billingPeriod: 'monthly',
          features: ['Full Claude capabilities', 'Team workspaces', 'Conversation sharing', 'Basic admin controls']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['All Teams features', 'Enhanced security', 'Advanced admin controls', 'Custom deployment options', 'Priority support']
        }
      ]
    },
    features: [
      'Team collaboration features',
      'Enhanced security and privacy',
      'Administrative controls and user management',
      'Conversation history and sharing',
      'Claude\'s advanced reasoning capabilities'
    ],
    limitations: [
      'Higher cost than consumer options',
      'Knowledge cutoff date',
      'Limited customization in base tier'
    ],
    rating: 4.8,
    reviewCount: 780,
    trending: false,
    featured: false,
    integrations: ['SSO', 'Slack', 'API access', 'Web interface'],
    lastVerified: new Date('2025-05-05')
  },
  {
    id: 'cursor-ai',
    name: 'Cursor AI',
    slug: 'cursor-ai',
    description: 'Cursor AI is an intelligent code editor built specifically for AI-assisted development. It features advanced code generation, debugging assistance, and codebase explanation capabilities while maintaining the familiar feel of VS Code with specialized features for AI programming.',
    shortDescription: 'AI-native code editor for developers',
    logo: 'https://images.pexels.com/photos/4709285/pexels-photo-4709285.jpeg',
    website: 'https://cursor.sh',
    categoryId: 'general-ai',
    subcategoryIds: ['coding-assistants'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month for Pro',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic code generation', 'Limited GPT-4 access', 'VS Code integration']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Unlimited GPT-4 usage', 'Advanced code tools', 'Larger context window', 'Code search capabilities']
        }
      ]
    },
    features: [
      'AI code generation and editing',
      'Codebase understanding and navigation',
      'Bug detection and fixing assistance',
      'VS Code-like editor experience',
      'Natural language code commands'
    ],
    limitations: [
      'Limited GPT-4 access in free tier',
      'Still evolving platform',
      'Some language limitations'
    ],
    rating: 4.7,
    reviewCount: 920,
    trending: true,
    featured: false,
    integrations: ['GitHub', 'VS Code extensions', 'Various language servers'],
    lastVerified: new Date('2025-05-10')
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    slug: 'gpt-4o',
    description: 'GPT-4o is OpenAI\'s most advanced multimodal model, capable of handling text, images, and audio in real-time with dramatically improved speed and cost efficiency. It represents a significant advancement in AI assistants with near-human level performance across many tasks.',
    shortDescription: 'OpenAI\'s fastest and most capable multimodal AI',
    logo: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    website: 'https://openai.com/gpt-4o',
    categoryId: 'general-ai',
    subcategoryIds: ['multimodal-ai', 'chatbots'],
    pricing: {
      type: 'api-usage',
      startingPrice: 'Starts at $5/million tokens',
      hasFreeOption: true,
      tiers: [
        {
          name: 'ChatGPT Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited access to GPT-4o', 'Basic capabilities']
        },
        {
          name: 'ChatGPT Plus',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Priority access to GPT-4o', 'Higher usage limits']
        },
        {
          name: 'API Usage',
          price: 'Starts at $5/million tokens',
          billingPeriod: 'monthly',
          features: ['Full model capabilities', 'Pay-as-you-go pricing', 'Volume discounts']
        }
      ]
    },
    features: [
      'Real-time multimodal capabilities (text, images, audio)',
      'Enhanced reasoning and problem-solving',
      'Significantly faster response times',
      'Improved accuracy across tasks',
      'Seamless conversation with context awareness'
    ],
    limitations: [
      'Knowledge cutoff date limitations',
      'Occasional hallucinations',
      'May struggle with highly specialized domain knowledge'
    ],
    rating: 4.9,
    reviewCount: 3200,
    trending: true,
    featured: true,
    integrations: ['ChatGPT interface', 'API access', 'Various platforms and applications'],
    lastVerified: new Date('2025-05-20')
  },
  {
    id: 'gemini',
    name: 'Gemini',
    slug: 'gemini',
    description: 'Gemini is Google\'s most capable AI model family, offering multimodal capabilities across text, code, images, and audio. Available in different sizes including Ultra, Pro, and Nano versions, it powers various Google products and offers strong reasoning and understanding capabilities.',
    shortDescription: 'Google\'s multimodal AI model for versatile applications',
    logo: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    website: 'https://gemini.google.com',
    categoryId: 'general-ai',
    subcategoryIds: ['multimodal-ai', 'chatbots'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month for Advanced',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic Gemini capabilities', 'Limited usage', 'Google account integration']
        },
        {
          name: 'Advanced',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Access to Gemini Advanced (Ultra model)', 'Higher usage limits', 'Priority access', 'Google One benefits']
        },
        {
          name: 'API',
          price: 'Pay-as-you-go',
          billingPeriod: 'monthly',
          features: ['All Gemini models', 'Usage-based pricing', 'Integration with Google Cloud']
        }
      ]
    },
    features: [
      'Multimodal understanding (text, images, code, audio)',
      'Multiple model sizes for different needs',
      'Integration with Google ecosystem',
      'Strong reasoning capabilities',
      'Multilingual support'
    ],
    limitations: [
      'Knowledge cutoff date',
      'Less specialized than some domain-specific models',
      'Advanced features require subscription'
    ],
    rating: 4.7,
    reviewCount: 2100,
    trending: true,
    featured: false,
    integrations: ['Google Workspace', 'Google Cloud', 'Android', 'API access'],
    lastVerified: new Date('2025-05-22')
  },
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
    id: 'github-copilot',
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
    id: 'claude-code-assistant',
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
    id: 'google-gemini-code',
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
    id: 'runway-gen-2',
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
    id: 'elevenlabs',
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
    id: 'inworld-ai',
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
    id: 'descript',
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
    id: 'pika',
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
    id: 'character.ai',
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
    id: 'dalle3',
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
    id: 'sora',
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
    id: 'synthesia',
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
    id: 'colossyan',
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
    id: 'lumen5',
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
    id: 'stable-diffusion',
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
    id: 'adobe-firefly',
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
    id: 'voicemod-ai',
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
    id: 'suno-ai',
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
          name: '$20/month',
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
    id: 'aiva',
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
    id: 'scenario-gg',
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
    id: 'unity-muse',
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
    id: 'adobe-creative-suite-ai',
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
    id: 'chatgpt-document',
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
    id: 'notion-ai',
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
    id: 'microsoft-copilot',
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
    id: 'grammarly-go',
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
    id: 'tome',
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
    id: 'copy-ai',
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
    id: 'lawgeex',
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
    id: 'resume-io',
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
    id: 'scite',
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
    id: 'consensus',
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
    id: 'jasper-ai',
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
    id: 'canva-docs',
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
    id: 'clickup-ai',
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
    id: 'otter-ai',
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
  },
  
  // Prompt Management Platforms
  {
    id: 'promptlayer',
    name: 'PromptLayer',
    slug: 'promptlayer',
    description: 'PromptLayer is the first platform built for prompt engineers that enables management, versioning, and analytics for prompts in LLM applications. It functions as a middleware between applications and LLM providers, providing detailed insights and tracking of prompt performance.',
    shortDescription: 'Version control and analytics for LLM prompts',
    logo: 'https://images.pexels.com/photos/11134135/pexels-photo-11134135.jpeg',
    website: 'https://promptlayer.com',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-management'],
    pricing: {
      type: 'freemium',
      startingPrice: '$29/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic prompt tracking', 'Limited requests', 'Core features']
        },
        {
          name: 'Pro',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Unlimited requests', 'Advanced analytics', 'Prompt versioning', 'Team collaboration']
        }
      ]
    },
    features: [
      'Prompt versioning and management',
      'Performance analytics',
      'A/B testing for prompts',
      'Integration with major LLM providers',
      'API access',
      'Prompt templates'
    ],
    limitations: [
      'Free tier has limited requests',
      'Learning curve for advanced features',
      'Limited model support in free tier'
    ],
    rating: 4.7,
    reviewCount: 215,
    trending: true
  },
  {
    id: 'langchain',
    name: 'LangChain',
    slug: 'langchain',
    description: 'LangChain is a framework for developing applications powered by language models. It provides tools for prompt management, chaining multiple components together, and integrating with external sources like APIs and databases to build context-aware applications.',
    shortDescription: 'Framework for building LLM-powered applications',
    logo: 'https://images.pexels.com/photos/11134134/pexels-photo-11134134.jpeg',
    website: 'https://langchain.com',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-management'],
    pricing: {
      type: 'freemium',
      startingPrice: '$49/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Core framework', 'Basic documentation', 'Community support']
        },
        {
          name: 'Cloud',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['Hosted infrastructure', 'Enhanced monitoring', 'Production support', 'Advanced features']
        }
      ]
    },
    features: [
      'Prompt templating and management',
      'Chains and sequences',
      'Memory for conversational contexts',
      'Integration with external data sources',
      'Document loading and indexing',
      'Agent frameworks'
    ],
    limitations: [
      'Steep learning curve',
      'Requires programming knowledge',
      'Documentation can be complex',
      'Rapid development pace leads to frequent changes'
    ],
    rating: 4.8,
    reviewCount: 845,
    trending: true
  },
  {
    id: 'flowise',
    name: 'Flowise',
    slug: 'flowise',
    description: 'Flowise is a visual drag-and-drop interface for building LLM workflows and chatbots. It simplifies the process of creating complex LangChain flows without needing to write code, making prompt engineering and LLM application development more accessible.',
    shortDescription: 'Visual builder for LLM workflows',
    logo: 'https://images.pexels.com/photos/11134133/pexels-photo-11134133.jpeg',
    website: 'https://flowiseai.com',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-management'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Community',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Self-hosted option', 'Basic flows', 'Core components']
        },
        {
          name: 'Pro',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['Cloud hosting', 'Advanced components', 'Team collaboration', 'API access']
        }
      ]
    },
    features: [
      'Drag-and-drop flow builder',
      'Visual prompt engineering',
      'Integration with LangChain',
      'Multiple LLM provider support',
      'No-code chatbot creation',
      'Custom API endpoints'
    ],
    limitations: [
      'Limited customization compared to coding',
      'Some advanced features require technical knowledge',
      'Self-hosted version requires setup expertise'
    ],
    rating: 4.5,
    reviewCount: 186,
    trending: true
  },
  {
    id: 'promptable-ai',
    name: 'Promptable.ai',
    slug: 'promptable-ai',
    description: 'Promptable.ai is a comprehensive platform for collaborative prompt engineering, allowing teams to create, test, and deploy prompts at scale. It focuses on enterprise-grade prompt management with features like versioning, collaboration, and performance metrics.',
    shortDescription: 'Enterprise prompt engineering platform',
    logo: 'https://images.pexels.com/photos/11134132/pexels-photo-11134132.jpeg',
    website: 'https://promptable.ai',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-management'],
    pricing: {
      type: 'subscription',
      startingPrice: '$49/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Team',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['Collaborative workspace', 'Prompt versioning', 'Basic analytics', 'Multi-user access']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Advanced analytics', 'SSO integration', 'Priority support', 'Custom integrations', 'SLA guarantees']
        }
      ]
    },
    features: [
      'Collaborative prompt management',
      'Version control',
      'Prompt testing and evaluation',
      'Performance monitoring',
      'Role-based access control',
      'Enterprise integrations'
    ],
    limitations: [
      'No free tier available',
      'More expensive than some alternatives',
      'Best suited for larger teams'
    ],
    rating: 4.6,
    reviewCount: 125
  },
  {
    id: 'promptops',
    name: 'PromptOps',
    slug: 'promptops',
    description: 'PromptOps is a DevOps-inspired platform for prompt engineering that focuses on the operational aspects of managing prompts in production. It provides tools for versioning, deployment pipelines, monitoring, and continuous improvement of prompts.',
    shortDescription: 'DevOps for LLM prompts',
    logo: 'https://images.pexels.com/photos/11134131/pexels-photo-11134131.jpeg',
    website: 'https://promptops.ai',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-management'],
    pricing: {
      type: 'subscription',
      startingPrice: '$39/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic version control', 'Limited requests', 'Single user']
        },
        {
          name: 'Standard',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['Full version control', 'CI/CD for prompts', 'Analytics dashboard', 'Team collaboration']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Advanced monitoring', 'Custom integrations', 'Priority support', 'SSO and security features']
        }
      ]
    },
    features: [
      'Prompt version control',
      'CI/CD pipelines for prompts',
      'Performance monitoring',
      'A/B testing',
      'Automatic prompt optimization',
      'Rollback capabilities'
    ],
    limitations: [
      'Complex for beginners',
      'Requires DevOps knowledge for full benefit',
      'Free tier has significant limitations'
    ],
    rating: 4.5,
    reviewCount: 98,
    trending: true
  },

  // Prompt Testing & Optimization
  {
    id: 'promptperfect',
    name: 'PromptPerfect',
    slug: 'promptperfect',
    description: 'PromptPerfect is an AI-powered tool that helps optimize prompts for better results with language models. It automatically improves prompts to be more effective, clear, and economical, while providing insights on performance and potential issues.',
    shortDescription: 'AI-powered prompt optimizer',
    logo: 'https://images.pexels.com/photos/11134130/pexels-photo-11134130.jpeg',
    website: 'https://promptperfect.com',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-testing'],
    pricing: {
      type: 'subscription',
      startingPrice: '$14.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited optimizations per day', 'Basic optimization features', 'Single user']
        },
        {
          name: 'Pro',
          price: '$14.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited optimizations', 'Advanced optimization features', 'Performance analytics']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Custom optimization rules', 'API access', 'Priority support']
        }
      ]
    },
    features: [
      'Automatic prompt optimization',
      'Performance comparison',
      'Token usage reduction',
      'Formatting improvements',
      'Context enhancement',
      'Bias detection'
    ],
    limitations: [
      'May not always preserve exact intent',
      'Limited customization in free tier',
      'Works best with certain types of prompts'
    ],
    rating: 4.7,
    reviewCount: 312
  },
  {
    id: 'promptstorm',
    name: 'PromptStorm',
    slug: 'promptstorm',
    description: 'PromptStorm is a prompt testing platform that helps users generate and evaluate multiple prompt variations at once. It provides statistical analysis of prompt performance across different models and parameters, enabling data-driven prompt optimization.',
    shortDescription: 'Multi-variant prompt testing platform',
    logo: 'https://images.pexels.com/photos/11134129/pexels-photo-11134129.jpeg',
    website: 'https://promptstorm.ai',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-testing'],
    pricing: {
      type: 'freemium',
      startingPrice: '$29/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 tests per day', 'Basic analytics', 'Limited model support']
        },
        {
          name: 'Professional',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Unlimited testing', 'Advanced analytics', 'All model support', 'Export capabilities']
        }
      ]
    },
    features: [
      'Simultaneous multi-variant testing',
      'Statistical performance analysis',
      'Visual result comparison',
      'Parameter optimization',
      'Export and sharing options',
      'Custom evaluation metrics'
    ],
    limitations: [
      'Free tier very limited',
      'Can be token-intensive',
      'Requires baseline knowledge of prompt engineering'
    ],
    rating: 4.4,
    reviewCount: 156
  },
  {
    id: 'chainforge',
    name: 'ChainForge',
    slug: 'chainforge',
    description: 'ChainForge is an open-source tool for prompt evaluation and development that enables systematic testing of prompt-model combinations. It provides a visual interface for comparing responses across multiple prompts and models, with built-in evaluation methods.',
    shortDescription: 'Visual prompt evaluation workbench',
    logo: 'https://images.pexels.com/photos/11134128/pexels-photo-11134128.jpeg',
    website: 'https://github.com/ianarawjo/ChainForge',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-testing'],
    pricing: {
      type: 'free',
      hasFreeOption: true
    },
    features: [
      'Visual prompt comparison',
      'Multi-model testing',
      'Built-in evaluation methods',
      'Parameter sweeping',
      'Batch processing',
      'Customizable evaluation metrics'
    ],
    limitations: [
      'Requires local setup',
      'Technical expertise needed',
      'No cloud hosting option',
      'Limited support options'
    ],
    rating: 4.3,
    reviewCount: 87
  },
  {
    id: 'lmql',
    name: 'LMQL (Language Model Query Language)',
    slug: 'lmql',
    description: 'LMQL is a programming language designed specifically for interacting with large language models. It allows for precise control over LLM outputs through constraints, validation, and structured queries, making it ideal for advanced prompt engineering and testing.',
    shortDescription: 'Programming language for LLM interaction',
    logo: 'https://images.pexels.com/photos/11134127/pexels-photo-11134127.jpeg',
    website: 'https://lmql.ai',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-testing'],
    pricing: {
      type: 'free',
      hasFreeOption: true
    },
    features: [
      'Declarative query language',
      'Output validation',
      'Structured response formatting',
      'Constraint-based generation',
      'Integration with Python',
      'Local and API model support'
    ],
    limitations: [
      'Steep learning curve',
      'Requires programming knowledge',
      'Limited educational resources',
      'Early-stage technology'
    ],
    rating: 4.6,
    reviewCount: 124
  },
  {
    id: 'openprompt',
    name: 'OpenPrompt',
    slug: 'openprompt',
    description: 'OpenPrompt is an open-source framework designed for prompt engineering research and development. It provides a toolkit for creating, testing, and optimizing prompts across different prompting techniques and language models.',
    shortDescription: 'Open-source prompt engineering framework',
    logo: 'https://images.pexels.com/photos/11134126/pexels-photo-11134126.jpeg',
    website: 'https://thunlp.github.io/OpenPrompt/',
    categoryId: 'prompt-engineering',
    subcategoryIds: ['prompt-testing'],
    pricing: {
      type: 'free',
      hasFreeOption: true
    },
    features: [
      'Multiple prompting strategies',
      'Template system',
      'Evaluation toolkit',
      'Model integration',
      'Research-focused features',
      'Extensible architecture'
    ],
    limitations: [
      'More academic than commercial',
      'Requires technical expertise',
      'Limited documentation for beginners',
      'Primarily for research use'
    ],
    rating: 4.2,
    reviewCount: 78
  },

  // =====================
  // AGENTIC AI TOOLS
  // =====================

  // Task Automation Agents
  {
    id: 'autogpt',
    name: 'AutoGPT',
    slug: 'autogpt',
    description: 'AutoGPT is an experimental open-source AI agent that attempts to make GPT-4 fully autonomous. It chains together LLM thoughts to autonomously achieve complex goals by breaking them down into sub-tasks and executing them through various APIs and tools.',
    shortDescription: 'Autonomous AI agent for complex task execution',
    logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    website: 'https://autogpt.net',
    categoryId: 'agentic-ai',
    subcategoryIds: ['autonomous-agents', 'task-automation'],
    pricing: {
      type: 'free',
      startingPrice: 'Free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Self-hosted deployment', 'Full code access', 'Community support', 'Custom integrations']
        },
        {
          name: 'Cloud Hosted',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['Managed hosting', 'Premium support', 'Enhanced security', 'Auto-scaling']
        }
      ]
    },
    features: [
      'Autonomous goal achievement',
      'Task decomposition and planning',
      'Multi-step reasoning',
      'Tool and API integration',
      'Memory management',
      'Self-improvement capabilities'
    ],
    limitations: [
      'Experimental and may be unstable',
      'Requires technical setup',
      'High API costs with extensive usage',
      'Limited oversight and control'
    ],
    rating: 4.3,
    reviewCount: 2847,
    trending: true,
    featured: true,
    integrations: ['OpenAI API', 'Google APIs', 'Web browsing', 'File systems', 'Database connections'],
    lastVerified: new Date('2025-05-25')
  },

  {
    id: 'babyagi',
    name: 'BabyAGI',
    slug: 'babyagi',
    description: 'BabyAGI is a Python script that uses OpenAI and Pinecone APIs to create, prioritize, and execute tasks. It operates as an autonomous task management system that can generate and complete tasks based on the results of previous tasks.',
    shortDescription: 'Task management AI agent',
    logo: 'https://images.pexels.com/photos/8386427/pexels-photo-8386427.jpeg',
    website: 'https://babyagi.org',
    categoryId: 'agentic-ai',
    subcategoryIds: ['task-automation', 'autonomous-agents'],
    pricing: {
      type: 'free',
      startingPrice: 'Free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Full source code', 'Self-deployment', 'Community support', 'Unlimited usage']
        }
      ]
    },
    features: [
      'Autonomous task creation',
      'Priority-based task execution',
      'Result-driven task generation',
      'Memory and context retention',
      'Vector database integration',
      'Minimal setup requirements'
    ],
    limitations: [
      'Requires API keys (OpenAI, Pinecone)',
      'Basic user interface',
      'Limited built-in safeguards',
      'Can generate excessive tasks'
    ],
    rating: 4.1,
    reviewCount: 1653,
    trending: true,
    featured: false,
    integrations: ['OpenAI GPT', 'Pinecone', 'Python ecosystem', 'Custom APIs'],
    lastVerified: new Date('2025-05-24')
  },

  {
    id: 'langchain-agents',
    name: 'LangChain Agents',
    slug: 'langchain-agents',
    description: 'LangChain Agents provide a framework for building AI agents that can reason about actions and use tools to accomplish tasks. They combine language models with the ability to take actions in the world through various integrations.',
    shortDescription: 'Framework for building AI agents with tools',
    logo: 'https://images.pexels.com/photos/8386442/pexels-photo-8386442.jpeg',
    website: 'https://python.langchain.com/docs/modules/agents/',
    categoryId: 'agentic-ai',
    subcategoryIds: ['agent-frameworks', 'tool-integration'],
    pricing: {
      type: 'free',
      startingPrice: 'Free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Full framework access', 'All agent types', 'Tool integrations', 'Community support']
        },
        {
          name: 'LangSmith',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['Debugging tools', 'Monitoring', 'Evaluation metrics', 'Team collaboration']
        }
      ]
    },
    features: [
      'Multiple agent architectures',
      'Tool and API integration',
      'Custom action planning',
      'Memory and state management',
      'Chain of thought reasoning',
      'Extensive model support'
    ],
    limitations: [
      'Requires programming knowledge',
      'Complex setup for advanced features',
      'Documentation can be overwhelming',
      'Performance varies by use case'
    ],
    rating: 4.5,
    reviewCount: 3241,
    trending: true,
    featured: true,
    integrations: ['OpenAI', 'Anthropic', 'Google', 'Hugging Face', 'APIs', 'Databases', 'Search engines'],
    lastVerified: new Date('2025-05-25')
  },

  // Research and Analysis Agents
  {
    id: 'research-agent-gpt',
    name: 'ResearchAgent GPT',
    slug: 'research-agent-gpt',
    description: 'ResearchAgent GPT is an AI agent specifically designed for conducting comprehensive research tasks. It can gather information from multiple sources, synthesize findings, and produce detailed research reports with citations.',
    shortDescription: 'AI agent for automated research tasks',
    logo: 'https://images.pexels.com/photos/8386447/pexels-photo-8386447.jpeg',
    website: 'https://researchagent.ai',
    categoryId: 'agentic-ai',
    subcategoryIds: ['research-agents', 'content-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$29/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Starter',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 research tasks/month', 'Basic sources', 'Standard reports', 'Community support']
        },
        {
          name: 'Professional',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['50 research tasks/month', 'Premium sources', 'Advanced reports', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited tasks', 'Custom sources', 'White-label reports', 'Dedicated support']
        }
      ]
    },
    features: [
      'Multi-source information gathering',
      'Automated fact-checking',
      'Citation management',
      'Report generation',
      'Data visualization',
      'Real-time research updates'
    ],
    limitations: [
      'Limited free tier',
      'Source quality varies',
      'May require fact verification',
      'Processing time for complex topics'
    ],
    rating: 4.4,
    reviewCount: 892,
    trending: true,
    featured: false,
    integrations: ['Academic databases', 'News APIs', 'Web scraping', 'Google Scholar', 'PDF processing'],
    lastVerified: new Date('2025-05-23')
  },

  {
    id: 'dataiku-ai-agents',
    name: 'Dataiku AI Agents',
    slug: 'dataiku-ai-agents',
    description: 'Dataiku AI Agents provide enterprise-grade autonomous agents for data science and analytics workflows. These agents can perform complex data analysis, machine learning model development, and automated reporting.',
    shortDescription: 'Enterprise AI agents for data science',
    logo: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    website: 'https://www.dataiku.com/product/ai-agents',
    categoryId: 'agentic-ai',
    subcategoryIds: ['data-agents', 'enterprise-agents'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Professional',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['Basic AI agents', 'Standard integrations', 'Email support', 'Training included']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['Advanced agents', 'Custom integrations', 'Dedicated support', 'On-premise deployment']
        }
      ]
    },
    features: [
      'Automated data analysis',
      'ML model development',
      'Predictive analytics',
      'Report automation',
      'Data pipeline management',
      'Collaborative workflows'
    ],
    limitations: [
      'Enterprise pricing only',
      'Complex implementation',
      'Requires data science knowledge',
      'Long setup time'
    ],
    rating: 4.6,
    reviewCount: 247,
    trending: false,
    featured: false,
    integrations: ['Hadoop', 'Spark', 'SQL databases', 'Cloud platforms', 'APIs', 'Business intelligence tools'],
    lastVerified: new Date('2025-05-20')
  },

  // Business Process Agents
  {
    id: 'superagent',
    name: 'SuperAgent',
    slug: 'superagent',
    description: 'SuperAgent is a platform for building and deploying AI agents that can handle complex business processes, customer service interactions, and workflow automation with natural language understanding.',
    shortDescription: 'Business process automation AI agents',
    logo: 'https://images.pexels.com/photos/8386449/pexels-photo-8386449.jpeg',
    website: 'https://superagent.sh',
    categoryId: 'agentic-ai',
    subcategoryIds: ['business-agents', 'customer-service-agents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$49/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Hobby',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 agents', 'Basic integrations', 'Community support', '1,000 interactions/month']
        },
        {
          name: 'Pro',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['10 agents', 'Advanced integrations', 'Priority support', '10,000 interactions/month']
        },
        {
          name: 'Business',
          price: '$149/month',
          billingPeriod: 'monthly',
          features: ['Unlimited agents', 'Custom integrations', 'Dedicated support', 'Unlimited interactions']
        }
      ]
    },
    features: [
      'No-code agent builder',
      'Multi-channel deployment',
      'Workflow automation',
      'API integrations',
      'Analytics and reporting',
      'Team collaboration'
    ],
    limitations: [
      'Limited free tier usage',
      'Learning curve for complex workflows',
      'Requires integration setup',
      'Performance depends on model choice'
    ],
    rating: 4.3,
    reviewCount: 567,
    trending: true,
    featured: false,
    integrations: ['Slack', 'Discord', 'WhatsApp', 'CRM systems', 'APIs', 'Databases', 'Email'],
    lastVerified: new Date('2025-05-24')
  },

  {
    id: 'crew-ai',
    name: 'CrewAI',
    slug: 'crew-ai',
    description: 'CrewAI is a framework for orchestrating role-playing AI agents that work together as a team to accomplish complex tasks. Each agent has specific roles, goals, and tools to collaborate effectively.',
    shortDescription: 'Multi-agent collaboration framework',
    logo: 'https://images.pexels.com/photos/8386431/pexels-photo-8386431.jpeg',
    website: 'https://crewai.com',
    categoryId: 'agentic-ai',
    subcategoryIds: ['multi-agent-systems', 'collaborative-agents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$29/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Core framework', 'Basic agents', 'Community support', 'Self-hosted']
        },
        {
          name: 'Pro',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Advanced agents', 'Cloud hosting', 'Priority support', 'Enhanced monitoring']
        },
        {
          name: 'Enterprise',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['Custom agents', 'Dedicated hosting', 'SLA guarantee', 'Professional services']
        }
      ]
    },
    features: [
      'Multi-agent orchestration',
      'Role-based agent design',
      'Task delegation',
      'Inter-agent communication',
      'Workflow management',
      'Performance monitoring'
    ],
    limitations: [
      'Complex setup for beginners',
      'Requires coordination planning',
      'Higher costs with multiple agents',
      'Learning curve for optimization'
    ],
    rating: 4.5,
    reviewCount: 1347,
    trending: true,
    featured: true,
    integrations: ['OpenAI', 'Anthropic', 'LangChain', 'APIs', 'Databases', 'Communication tools'],
    lastVerified: new Date('2025-05-25')
  },

  // Personal Assistant Agents
  {
    id: 'agent-gpt',
    name: 'AgentGPT',
    slug: 'agent-gpt',
    description: 'AgentGPT allows you to configure and deploy autonomous AI agents in your browser. You can give your agent a name and goal, and it will attempt to reach that goal by thinking of tasks to do and executing them.',
    shortDescription: 'Browser-based autonomous AI agents',
    logo: 'https://images.pexels.com/photos/8386445/pexels-photo-8386445.jpeg',
    website: 'https://agentgpt.reworkd.ai',
    categoryId: 'agentic-ai',
    subcategoryIds: ['personal-agents', 'task-automation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited agents', 'Basic features', 'Public hosting', 'Community support']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Unlimited agents', 'Advanced features', 'Priority processing', 'Email support']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Custom deployment', 'API access', 'Dedicated support', 'Enhanced security']
        }
      ]
    },
    features: [
      'Browser-based interface',
      'Goal-oriented agents',
      'Task generation and execution',
      'Real-time monitoring',
      'Custom agent configuration',
      'Progress tracking'
    ],
    limitations: [
      'Limited free tier capacity',
      'Internet browser dependency',
      'Variable execution speed',
      'May require supervision'
    ],
    rating: 4.2,
    reviewCount: 1873,
    trending: true,
    featured: false,
    integrations: ['OpenAI API', 'Web browsers', 'Cloud hosting', 'Third-party APIs'],
    lastVerified: new Date('2025-05-24')
  },

  {
    id: 'microsoft-copilot-studio',
    name: 'Microsoft Copilot Studio',
    slug: 'microsoft-copilot-studio',
    description: 'Microsoft Copilot Studio enables organizations to create, customize, and deploy AI agents across Microsoft 365 and business applications. It provides low-code tools for building intelligent agents.',
    shortDescription: 'Enterprise AI agent builder for Microsoft ecosystem',
    logo: 'https://images.pexels.com/photos/4050477/pexels-photo-4050477.jpeg',
    website: 'https://copilotstudio.microsoft.com',
    categoryId: 'agentic-ai',
    subcategoryIds: ['enterprise-agents', 'business-agents'],
    pricing: {
      type: 'subscription',
      startingPrice: '$200/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Copilot Studio',
          price: '$200/month per tenant',
          billingPeriod: 'monthly',
          features: ['Agent creation tools', 'Microsoft 365 integration', 'Basic analytics', 'Standard support']
        },
        {
          name: 'Premium',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Advanced agents', 'Custom integrations', 'Enhanced analytics', 'Priority support']
        }
      ]
    },
    features: [
      'Low-code agent builder',
      'Microsoft 365 integration',
      'Enterprise security',
      'Compliance controls',
      'Analytics dashboard',
      'Team collaboration'
    ],
    limitations: [
      'Microsoft ecosystem dependency',
      'High minimum cost',
      'Complex licensing',
      'Limited customization outside Microsoft stack'
    ],
    rating: 4.4,
    reviewCount: 432,
    trending: false,
    featured: false,
    integrations: ['Microsoft 365', 'Teams', 'SharePoint', 'Power Platform', 'Azure', 'Dynamics 365'],
    lastVerified: new Date('2025-05-22')
  },

  // Development and Code Agents
  {
    id: 'devika-ai',
    name: 'Devika AI',
    slug: 'devika-ai',
    description: 'Devika is an agentic AI software engineer that can understand high-level human instructions, break them down into steps, research relevant information, and write code to achieve the given objective.',
    shortDescription: 'AI software engineer agent',
    logo: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    website: 'https://devika.ai',
    categoryId: 'agentic-ai',
    subcategoryIds: ['development-agents', 'autonomous-agents'],
    pricing: {
      type: 'free',
      startingPrice: 'Free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Full source code', 'Self-hosted deployment', 'Community support', 'All features']
        },
        {
          name: 'Hosted',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['Managed hosting', 'Premium support', 'Enhanced performance', 'Auto-updates']
        }
      ]
    },
    features: [
      'Natural language to code',
      'Multi-language support',
      'Project planning',
      'Code generation and testing',
      'Documentation creation',
      'Version control integration'
    ],
    limitations: [
      'Early development stage',
      'May require technical setup',
      'Code quality varies',
      'Limited testing capabilities'
    ],
    rating: 4.1,
    reviewCount: 756,
    trending: true,
    featured: false,
    integrations: ['Git', 'GitHub', 'Various programming languages', 'Development tools', 'APIs'],
    lastVerified: new Date('2025-05-23')
  },

  {
    id: 'gpt-engineer',
    name: 'GPT Engineer',
    slug: 'gpt-engineer',
    description: 'GPT Engineer is an AI agent that creates entire codebases from prompts. It asks clarifying questions, generates code, and can build complete applications with minimal human input.',
    shortDescription: 'AI agent for codebase generation',
    logo: 'https://images.pexels.com/photos/4065615/pexels-photo-4065615.jpeg',
    website: 'https://gptengineer.app',
    categoryId: 'agentic-ai',
    subcategoryIds: ['development-agents', 'code-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$29/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic code generation', 'Limited projects', 'Community support', 'Open source access']
        },
        {
          name: 'Pro',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Advanced generation', 'Unlimited projects', 'Priority support', 'Enhanced models']
        },
        {
          name: 'Team',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Custom models', 'API access', 'Dedicated support']
        }
      ]
    },
    features: [
      'Complete codebase generation',
      'Clarifying questions',
      'Multiple programming languages',
      'Project scaffolding',
      'Code explanation',
      'Iterative improvement'
    ],
    limitations: [
      'Generated code needs review',
      'Complex projects may be incomplete',
      'Limited architecture decisions',
      'Requires clear requirements'
    ],
    rating: 4.3,
    reviewCount: 1245,
    trending: true,
    featured: true,
    integrations: ['OpenAI', 'GitHub', 'VS Code', 'Multiple frameworks', 'Cloud platforms'],
    lastVerified: new Date('2025-05-25')
  },

  // Sales and Marketing Agents
  {
    id: 'apollo-ai-agent',
    name: 'Apollo AI Agent',
    slug: 'apollo-ai-agent',
    description: 'Apollo AI Agent automates sales prospecting, lead qualification, and outreach sequences. It can research prospects, craft personalized messages, and manage follow-up campaigns autonomously.',
    shortDescription: 'AI agent for sales automation',
    logo: 'https://images.pexels.com/photos/7947866/pexels-photo-7947866.jpeg',
    website: 'https://apollo.io/ai-agent',
    categoryId: 'agentic-ai',
    subcategoryIds: ['sales-agents', 'marketing-agents'],
    pricing: {
      type: 'subscription',
      startingPrice: '$49/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Professional',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['Basic automation', 'Lead research', 'Email sequences', 'Standard support']
        },
        {
          name: 'Enterprise',
          price: '$149/month',
          billingPeriod: 'monthly',
          features: ['Advanced automation', 'Custom workflows', 'Multi-channel outreach', 'Priority support']
        },
        {
          name: 'Scale',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Unlimited automation', 'Custom integrations', 'Dedicated CSM', 'SLA guarantee']
        }
      ]
    },
    features: [
      'Prospect research automation',
      'Personalized outreach',
      'Lead qualification',
      'Follow-up sequences',
      'Performance analytics',
      'CRM integration'
    ],
    limitations: [
      'No free tier',
      'Requires sales expertise',
      'Email deliverability concerns',
      'Compliance considerations'
    ],
    rating: 4.5,
    reviewCount: 923,
    trending: true,
    featured: false,
    integrations: ['Salesforce', 'HubSpot', 'Pipedrive', 'LinkedIn', 'Email providers', 'Calendar tools'],
    lastVerified: new Date('2025-05-24')
  },

  {
    id: 'jasper-ai-agent',
    name: 'Jasper AI Agent',
    slug: 'jasper-ai-agent',
    description: 'Jasper AI Agent creates and manages comprehensive marketing campaigns autonomously. It can develop content strategies, create assets, and optimize campaigns based on performance data.',
    shortDescription: 'AI agent for marketing campaign automation',
    logo: 'https://images.pexels.com/photos/11035363/pexels-photo-11035363.jpeg',
    website: 'https://jasper.ai/agents',
    categoryId: 'agentic-ai',
    subcategoryIds: ['marketing-agents', 'content-agents'],
    pricing: {
      type: 'subscription',
      startingPrice: '$99/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Creator',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['Campaign automation', 'Content generation', 'Basic analytics', 'Email support']
        },
        {
          name: 'Pro',
          price: '$199/month',
          billingPeriod: 'monthly',
          features: ['Advanced campaigns', 'Multi-channel content', 'Advanced analytics', 'Priority support']
        },
        {
          name: 'Business',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Enterprise features', 'Custom integrations', 'Dedicated support', 'Training included']
        }
      ]
    },
    features: [
      'Campaign strategy development',
      'Multi-format content creation',
      'Performance optimization',
      'Brand voice consistency',
      'A/B testing automation',
      'ROI tracking'
    ],
    limitations: [
      'High starting price',
      'Requires marketing knowledge',
      'Content may need human review',
      'Learning curve for optimization'
    ],
    rating: 4.4,
    reviewCount: 687,
    trending: false,
    featured: false,
    integrations: ['Google Ads', 'Facebook Ads', 'HubSpot', 'Salesforce', 'Analytics tools', 'CMS platforms'],
    lastVerified: new Date('2025-05-22')
  }
];