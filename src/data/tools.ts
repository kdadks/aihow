import { Tool } from '../types';

export const tools: Tool[] = [
  // Document Creation Tools
  {
    id: 'chatgpt-document',
    name: 'ChatGPT for Documents',
    slug: 'chatgpt-document',
    description: 'ChatGPT excels at creating various types of documents including essays, reports, letters, and creative writing. With its advanced language understanding, it can adapt writing style, tone, and format to match specific document requirements while maintaining coherence and quality.',
    shortDescription: 'AI-powered document creation with natural language generation',
    logo: 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg',
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
          features: ['Limited daily usage', 'Basic document creation', 'GPT-3.5 model']
        },
        {
          name: 'ChatGPT Plus',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Unlimited usage', 'GPT-4 access', 'Priority access', 'Advanced document features']
        }
      ]
    },
    features: [
      'Multi-format document creation',
      'Style and tone adaptation',
      'Real-time editing and revision',
      'Research assistance',
      'Citation and reference help',
      'Multiple language support'
    ],
    limitations: [
      'May require fact-checking for accuracy',
      'Limited knowledge cutoff date',
      'Free tier has usage restrictions',
      'Cannot access real-time information'
    ],
    rating: 4.7,
    reviewCount: 2800,
    trending: true,
    featured: true,
    integrations: ['API access', 'Third-party plugins', 'Browser extensions'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'grammarly-go',
    name: 'Grammarly',
    slug: 'grammarly-go',
    description: 'Grammarly uses AI to help improve writing quality by checking grammar, spelling, punctuation, and style. Beyond basic corrections, it offers suggestions for clarity, engagement, and tone, making it essential for professional document creation and editing.',
    shortDescription: 'AI writing assistant for grammar, style, and clarity improvement',
    logo: 'https://images.pexels.com/photos/4050442/pexels-photo-4050442.jpeg',
    website: 'https://grammarly.com',
    categoryId: 'document-creation',
    subcategoryIds: ['general-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$12/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic grammar and spelling', 'Limited suggestions', 'Browser extension']
        },
        {
          name: 'Premium',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['Advanced grammar check', 'Style suggestions', 'Tone detection', 'Plagiarism checker']
        },
        {
          name: 'Business',
          price: '$15/user/month',
          billingPeriod: 'monthly',
          features: ['All Premium features', 'Team management', 'Brand style guide', 'Analytics dashboard']
        }
      ]
    },
    features: [
      'Real-time grammar and spell checking',
      'Style and tone suggestions',
      'Plagiarism detection',
      'Writing analytics',
      'Multiple platform integration',
      'Genre-specific writing assistance'
    ],
    limitations: [
      'Advanced features require paid subscription',
      'Can be overly prescriptive sometimes',
      'Limited creative writing support',
      'Requires internet connection for full functionality'
    ],
    rating: 4.6,
    reviewCount: 3200,
    trending: false,
    featured: true,
    integrations: ['Microsoft Office', 'Google Docs', 'Browser extensions', 'Mobile apps', 'Desktop apps'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'jasper-ai',
    name: 'Jasper AI',
    slug: 'jasper-ai',
    description: 'Jasper AI is a comprehensive AI writing platform designed for businesses and content creators. It offers templates for various document types, brand voice training, and collaborative features, making it ideal for creating professional business documents, marketing materials, and content at scale.',
    shortDescription: 'Enterprise AI writing platform for business content creation',
    logo: 'https://images.pexels.com/photos/11035363/pexels-photo-11035363.jpeg',
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
          features: ['1 user', 'Unlimited words', '50+ templates', 'Plagiarism checker']
        },
        {
          name: 'Pro',
          price: '$69/month',
          billingPeriod: 'monthly',
          features: ['5 users', 'Unlimited words', 'Brand voice', 'Workflows', 'Collaboration tools']
        },
        {
          name: 'Business',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Custom users', 'Advanced features', 'Priority support', 'Custom integrations']
        }
      ]
    },
    features: [
      'Business document templates',
      'Brand voice training',
      'Team collaboration',
      'Multi-language support',
      'Plagiarism detection',
      'Workflow automation'
    ],
    limitations: [
      'No free tier available',
      'Higher price point than alternatives',
      'Learning curve for advanced features',
      'Requires subscription for all features'
    ],
    rating: 4.5,
    reviewCount: 1800,
    trending: true,
    featured: false,
    integrations: ['Google Docs', 'Microsoft Word', 'Browser extension', 'API access', 'Zapier'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'tome',
    name: 'Tome',
    slug: 'tome',
    description: 'Tome is an AI-native platform that creates comprehensive business documents and presentations. It combines text generation with multimedia content creation, allowing users to build professional reports, proposals, and presentations with integrated visuals and interactive elements.',
    shortDescription: 'AI-powered business document and presentation creator',
    logo: 'https://images.pexels.com/photos/4050445/pexels-photo-4050445.jpeg',
    website: 'https://tome.app',
    categoryId: 'document-creation',
    subcategoryIds: ['business-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$16/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited credits', 'Basic templates', 'Export options']
        },
        {
          name: 'Pro',
          price: '$16/month',
          billingPeriod: 'monthly',
          features: ['Unlimited credits', 'Premium templates', 'Custom branding', 'Priority support']
        }
      ]
    },
    features: [
      'AI document generation',
      'Multimedia content integration',
      'Interactive presentations',
      'Custom branding options',
      'Collaboration tools',
      'Multiple export formats'
    ],
    limitations: [
      'Limited free tier credits',
      'Newer platform with evolving features',
      'Requires internet connection',
      'Learning curve for advanced features'
    ],
    rating: 4.4,
    reviewCount: 850,
    trending: true,
    featured: false,
    integrations: ['Web-based platform', 'Export to various formats', 'Embedding options'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'writesonic',
    name: 'Writesonic',
    slug: 'writesonic',
    description: 'Writesonic is an AI writing platform that offers a wide range of document creation tools, from business proposals to creative content. With its multiple AI models and specialized templates, it helps create professional documents quickly while maintaining quality and consistency.',
    shortDescription: 'Versatile AI writing platform for various document types',
    logo: 'https://images.pexels.com/photos/4050430/pexels-photo-4050430.jpeg',
    website: 'https://writesonic.com',
    categoryId: 'document-creation',
    subcategoryIds: ['business-documents', 'creative-writing'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['10,000 words/month', 'Basic templates', 'GPT-3.5 model']
        },
        {
          name: 'Pro',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['Unlimited words', 'GPT-4 access', 'Premium templates', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Custom features', 'Team management', 'API access', 'Dedicated support']
        }
      ]
    },
    features: [
      'Multiple AI model options',
      '100+ writing templates',
      'Real-time collaboration',
      'Bulk content generation',
      'SEO optimization tools',
      'Multi-language support'
    ],
    limitations: [
      'Free tier has word limits',
      'Quality varies between templates',
      'Requires careful prompt crafting',
      'Advanced features need paid plans'
    ],
    rating: 4.3,
    reviewCount: 2100,
    trending: false,
    featured: false,
    integrations: ['Browser extension', 'API access', 'WordPress plugin', 'Chrome extension'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'scispace',
    name: 'SciSpace',
    slug: 'scispace',
    description: 'SciSpace (formerly Typeset) is an AI-powered research assistant that helps create academic papers, literature reviews, and research documents. It offers features like paper discovery, summarization, citation management, and academic writing assistance tailored for researchers and students.',
    shortDescription: 'AI research assistant for academic writing and paper discovery',
    logo: 'https://images.pexels.com/photos/4050297/pexels-photo-4050297.jpeg',
    website: 'https://scispace.com',
    categoryId: 'document-creation',
    subcategoryIds: ['academic-research'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 questions/day', 'Basic paper discovery', 'Limited AI assistance']
        },
        {
          name: 'Premium',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Unlimited questions', 'Advanced AI features', 'Priority support', 'Export options']
        }
      ]
    },
    features: [
      'Research paper discovery',
      'AI-powered summarization',
      'Citation management',
      'Academic writing assistance',
      'Literature review generation',
      'Data extraction from papers'
    ],
    limitations: [
      'Limited free tier usage',
      'Focused primarily on academic content',
      'Requires subscription for advanced features',
      'May need manual verification of citations'
    ],
    rating: 4.5,
    reviewCount: 950,
    trending: true,
    featured: false,
    integrations: ['Reference managers', 'Academic databases', 'Browser extension', 'API access'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'lexis-ai',
    name: 'Lexis+ AI',
    slug: 'lexis-ai',
    description: 'Lexis+ AI is a comprehensive legal research and document creation platform that uses artificial intelligence to assist lawyers and legal professionals. It offers case law research, document drafting, contract analysis, and legal brief generation with AI-powered insights.',
    shortDescription: 'AI-powered legal research and document creation platform',
    logo: 'https://images.pexels.com/photos/5668887/pexels-photo-5668887.jpeg',
    website: 'https://www.lexisnexis.com/en-us/products/lexis-plus.page',
    categoryId: 'document-creation',
    subcategoryIds: ['legal-documents'],
    pricing: {
      type: 'subscription',
      startingPrice: 'Custom',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Professional',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Legal research', 'Document drafting', 'Case law analysis', 'AI insights']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['All Professional features', 'Team collaboration', 'Advanced analytics', 'Custom integrations']
        }
      ]
    },
    features: [
      'AI-powered legal research',
      'Document drafting assistance',
      'Case law analysis',
      'Contract review and analysis',
      'Legal brief generation',
      'Compliance checking'
    ],
    limitations: [
      'Enterprise pricing not publicly available',
      'Requires legal expertise to use effectively',
      'Subscription-based only',
      'Limited to legal domain'
    ],
    rating: 4.2,
    reviewCount: 450,
    trending: false,
    featured: false,
    integrations: ['Legal databases', 'Document management systems', 'Practice management software'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'harvey-ai',
    name: 'Harvey.ai',
    slug: 'harvey-ai',
    description: 'Harvey.ai is an AI assistant specifically designed for legal professionals, offering capabilities in legal research, document drafting, contract analysis, and case preparation. Built with legal expertise, it helps law firms increase efficiency while maintaining accuracy in legal work.',
    shortDescription: 'Specialized AI assistant for legal professionals and law firms',
    logo: 'https://images.pexels.com/photos/5668886/pexels-photo-5668886.jpeg',
    website: 'https://harvey.ai',
    categoryId: 'document-creation',
    subcategoryIds: ['legal-documents'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Custom',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Legal AI assistant', 'Document analysis', 'Research capabilities', 'Custom deployment']
        }
      ]
    },
    features: [
      'Legal document analysis',
      'Case research assistance',
      'Contract drafting support',
      'Legal brief creation',
      'Regulatory compliance checking',
      'Specialized legal knowledge base'
    ],
    limitations: [
      'Enterprise-only pricing',
      'Requires legal domain expertise',
      'Custom implementation needed',
      'Limited public availability'
    ],
    rating: 4.1,
    reviewCount: 180,
    trending: true,
    featured: false,
    integrations: ['Law firm management systems', 'Legal databases', 'Document repositories'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'litera-one',
    name: 'Litera One',
    slug: 'litera-one',
    description: 'Litera One provides AI-powered document creation and management tools specifically for legal professionals. It offers automated document assembly, contract analysis, proofreading, and collaboration features designed to improve efficiency in legal document workflows.',
    shortDescription: 'AI-powered legal document management and creation platform',
    logo: 'https://images.pexels.com/photos/5668888/pexels-photo-5668888.jpeg',
    website: 'https://www.litera.com',
    categoryId: 'document-creation',
    subcategoryIds: ['legal-documents'],
    pricing: {
      type: 'subscription',
      startingPrice: 'Custom',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Professional',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Document assembly', 'AI proofreading', 'Collaboration tools', 'Version control']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['All Professional features', 'Advanced analytics', 'Custom integrations', 'Priority support']
        }
      ]
    },
    features: [
      'Automated document assembly',
      'AI-powered proofreading',
      'Document comparison',
      'Collaboration workflows',
      'Version control',
      'Integration with legal systems'
    ],
    limitations: [
      'Custom pricing only',
      'Focused on legal industry',
      'Requires implementation support',
      'Learning curve for complex features'
    ],
    rating: 4.0,
    reviewCount: 320,
    trending: false,
    featured: false,
    integrations: ['Microsoft Office', 'Legal practice management', 'Document management systems'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'teal',
    name: 'Teal',
    slug: 'teal',
    description: 'Teal is an AI-powered career platform that helps create professional resumes, cover letters, and LinkedIn profiles. It offers resume optimization, job matching, and career coaching features, making it a comprehensive tool for job seekers and career advancement.',
    shortDescription: 'AI-powered resume builder and career platform',
    logo: 'https://images.pexels.com/photos/4050314/pexels-photo-4050314.jpeg',
    website: 'https://tealhq.com',
    categoryId: 'document-creation',
    subcategoryIds: ['resume-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$9/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic resume builder', 'Job tracking', 'Limited AI features']
        },
        {
          name: 'Teal+',
          price: '$9/month',
          billingPeriod: 'monthly',
          features: ['Unlimited AI features', 'Advanced resume analysis', 'Priority support', 'Career coaching']
        }
      ]
    },
    features: [
      'AI resume optimization',
      'ATS-friendly templates',
      'Job application tracking',
      'LinkedIn profile optimization',
      'Cover letter generation',
      'Interview preparation'
    ],
    limitations: [
      'Limited free tier features',
      'Focus primarily on resume building',
      'Advanced features require subscription',
      'May need manual customization'
    ],
    rating: 4.6,
    reviewCount: 1200,
    trending: true,
    featured: false,
    integrations: ['LinkedIn', 'Job boards', 'ATS systems', 'Calendar apps'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'rezi',
    name: 'Rezi',
    slug: 'rezi',
    description: 'Rezi is an AI-powered resume builder that optimizes resumes for Applicant Tracking Systems (ATS). It offers real-time content suggestions, keyword optimization, and formatting assistance to help job seekers create resumes that pass through automated screening systems.',
    shortDescription: 'ATS-optimized AI resume builder with real-time optimization',
    logo: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
    website: 'https://rezi.ai',
    categoryId: 'document-creation',
    subcategoryIds: ['resume-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$29/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['1 resume', 'Basic templates', 'Limited AI features']
        },
        {
          name: 'Pro',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Unlimited resumes', 'All templates', 'AI writing assistant', 'ATS analysis']
        }
      ]
    },
    features: [
      'ATS optimization scoring',
      'Real-time content suggestions',
      'Keyword optimization',
      'Multiple resume formats',
      'Cover letter builder',
      'Interview preparation tools'
    ],
    limitations: [
      'Free tier very limited',
      'Higher pricing than some competitors',
      'Requires subscription for best features',
      'Learning curve for optimization features'
    ],
    rating: 4.4,
    reviewCount: 800,
    trending: false,
    featured: false,
    integrations: ['Job boards', 'ATS systems', 'LinkedIn', 'Email platforms'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'kickresume',
    name: 'Kickresume',
    slug: 'kickresume',
    description: 'Kickresume combines AI-powered resume building with professionally designed templates. It offers AI writing assistance, career guidance, and portfolio creation tools, making it suitable for various industries and career levels from entry-level to executive positions.',
    shortDescription: 'AI resume builder with professional templates and career tools',
    logo: 'https://images.pexels.com/photos/4050316/pexels-photo-4050316.jpeg',
    website: 'https://kickresume.com',
    categoryId: 'document-creation',
    subcategoryIds: ['resume-documents'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic templates', 'Limited downloads', 'Basic AI features']
        },
        {
          name: 'Premium',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['All templates', 'Unlimited downloads', 'AI writer', 'Cover letters', 'Portfolio builder']
        }
      ]
    },
    features: [
      'AI-powered content generation',
      'Professional design templates',
      'Cover letter builder',
      'Personal website creation',
      'Resume examples library',
      'Career guidance tools'
    ],
    limitations: [
      'Free tier has download limits',
      'Premium features require subscription',
      'Limited customization in some templates',
      'AI suggestions may need refinement'
    ],
    rating: 4.5,
    reviewCount: 1500,
    trending: false,
    featured: false,
    integrations: ['LinkedIn import', 'Portfolio hosting', 'Social media sharing'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'zety',
    name: 'Zety',
    slug: 'zety',
    description: 'Zety is an AI-enhanced resume builder that offers guided resume creation with real-time tips and suggestions. It provides industry-specific templates, cover letter building, and job search tools, helping users create professional documents tailored to their target roles.',
    shortDescription: 'AI-guided resume builder with industry-specific templates',
    logo: 'https://images.pexels.com/photos/4050317/pexels-photo-4050317.jpeg',
    website: 'https://zety.com',
    categoryId: 'document-creation',
    subcategoryIds: ['resume-documents'],
    pricing: {
      type: 'subscription',
      startingPrice: '$5.95/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Monthly',
          price: '$5.95/month',
          billingPeriod: 'monthly',
          features: ['All templates', 'Cover letters', 'AI assistance', 'Download options']
        },
        {
          name: '14-day',
          price: '$2.95/14 days',
          billingPeriod: 'one-time',
          features: ['All features', 'Short-term access', 'Full functionality']
        }
      ]
    },
    features: [
      'Step-by-step resume building',
      'Real-time content suggestions',
      'Industry-specific templates',
      'Cover letter matching',
      'Resume scoring and tips',
      'Multiple download formats'
    ],
    limitations: [
      'No free tier available',
      'Subscription required for downloads',
      'Limited template customization',
      'Recurring billing model'
    ],
    rating: 4.3,
    reviewCount: 2200,
    trending: false,
    featured: false,
    integrations: ['Job boards', 'Social media', 'Email platforms'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'resumai-wonsulting',
    name: 'ResumAI by Wonsulting',
    slug: 'resumai-wonsulting',
    description: 'ResumAI by Wonsulting is an AI-powered resume builder created by career coaching experts. It offers personalized resume optimization, industry-specific guidance, and proven templates based on successful job placements, particularly strong in tech and corporate sectors.',
    shortDescription: 'Expert-backed AI resume builder with proven templates',
    logo: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg',
    website: 'https://wonsulting.com/resumai',
    categoryId: 'document-creation',
    subcategoryIds: ['resume-documents'],
    pricing: {
      type: 'subscription',
      startingPrice: '$19.99/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Basic',
          price: '$19.99/month',
          billingPeriod: 'monthly',
          features: ['AI resume builder', 'Basic templates', 'Download options']
        },
        {
          name: 'Premium',
          price: '$39.99/month',
          billingPeriod: 'monthly',
          features: ['All Basic features', 'Expert review', 'Cover letters', 'LinkedIn optimization', 'Priority support']
        }
      ]
    },
    features: [
      'Expert-designed templates',
      'AI content optimization',
      'Industry-specific guidance',
      'Career coaching insights',
      'LinkedIn profile optimization',
      'Job search strategy tools'
    ],
    limitations: [
      'No free tier available',
      'Higher pricing than some alternatives',
      'Focused primarily on corporate/tech roles',
      'Requires subscription for all features'
    ],
    rating: 4.7,
    reviewCount: 650,
    trending: true,
    featured: false,
    integrations: ['LinkedIn', 'Job boards', 'Career coaching platform'],
    lastVerified: new Date('2025-06-01')
  },
  // Marketing & Sales Materials Tools
  {
    id: 'copy-ai-marketing',
    name: 'Copy.ai Marketing',
    slug: 'copy-ai-marketing',
    description: 'Copy.ai specializes in creating high-converting marketing copy using advanced AI. It offers templates for ads, emails, social media posts, product descriptions, and sales pages, helping marketers generate compelling content that drives engagement and conversions.',
    shortDescription: 'AI-powered marketing copy generator for high-converting content',
    logo: 'https://images.pexels.com/photos/4050420/pexels-photo-4050420.jpeg',
    website: 'https://copy.ai',
    categoryId: 'document-creation',
    subcategoryIds: ['marketing-sales'],
    pricing: {
      type: 'freemium',
      startingPrice: '$36/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['2,000 words/month', 'Basic templates', '90+ tools']
        },
        {
          name: 'Pro',
          price: '$36/month',
          billingPeriod: 'monthly',
          features: ['Unlimited words', 'Priority support', 'Brand voice', 'Team collaboration']
        },
        {
          name: 'Team',
          price: '$186/month',
          billingPeriod: 'monthly',
          features: ['All Pro features', '5 team members', 'Advanced collaboration', 'Custom workflows']
        }
      ]
    },
    features: [
      'High-converting ad copy',
      'Email marketing templates',
      'Social media content creation',
      'Product description generation',
      'Sales page optimization',
      'Brand voice customization'
    ],
    limitations: [
      'Free tier has word limits',
      'Quality varies between templates',
      'Requires editing for brand alignment',
      'Advanced features need paid plans'
    ],
    rating: 4.4,
    reviewCount: 2800,
    trending: true,
    featured: false,
    integrations: ['HubSpot', 'Salesforce', 'WordPress', 'Shopify', 'Chrome extension'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'persado',
    name: 'Persado',
    slug: 'persado',
    description: 'Persado uses AI and machine learning to generate marketing language that drives higher engagement and conversion rates. It analyzes emotional triggers and psychological motivators to create personalized marketing messages optimized for specific audiences and channels.',
    shortDescription: 'AI marketing language optimization for higher conversions',
    logo: 'https://images.pexels.com/photos/4050421/pexels-photo-4050421.jpeg',
    website: 'https://persado.com',
    categoryId: 'document-creation',
    subcategoryIds: ['marketing-sales'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Custom',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['AI-generated copy', 'A/B testing', 'Performance analytics', 'Custom integration']
        }
      ]
    },
    features: [
      'Emotion-driven copywriting',
      'Automated A/B testing',
      'Performance prediction',
      'Multi-channel optimization',
      'Real-time personalization',
      'Advanced analytics dashboard'
    ],
    limitations: [
      'Enterprise-only pricing',
      'Complex implementation process',
      'Requires significant data volume',
      'Limited transparency in AI decisions'
    ],
    rating: 4.2,
    reviewCount: 380,
    trending: false,
    featured: false,
    integrations: ['Salesforce', 'Adobe', 'Oracle', 'SAP', 'Custom APIs'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'anyword',
    name: 'Anyword',
    slug: 'anyword',
    description: 'Anyword is a performance-driven AI copywriting platform that predicts content performance before publication. It generates and optimizes marketing copy across multiple channels, providing predictive performance scores to help marketers choose the best-performing variations.',
    shortDescription: 'Predictive AI copywriting with performance scoring',
    logo: 'https://images.pexels.com/photos/4050422/pexels-photo-4050422.jpeg',
    website: 'https://anyword.com',
    categoryId: 'document-creation',
    subcategoryIds: ['marketing-sales'],
    pricing: {
      type: 'freemium',
      startingPrice: '$39/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Starter',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['1,000 words/month', 'Basic templates', 'Performance prediction']
        },
        {
          name: 'Data-Driven',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['20,000 words/month', 'All templates', 'Advanced analytics', 'Custom audiences']
        },
        {
          name: 'Business',
          price: '$79/month',
          billingPeriod: 'monthly',
          features: ['50,000 words/month', 'Team collaboration', 'Brand guidelines', 'Priority support']
        }
      ]
    },
    features: [
      'Predictive performance scoring',
      'Multi-channel optimization',
      'Custom audience targeting',
      'Brand voice consistency',
      'Real-time optimization',
      'Comprehensive analytics'
    ],
    limitations: [
      'Learning curve for optimization features',
      'Predictions may not always be accurate',
      'Limited free tier usage',
      'Requires consistent data for best results'
    ],
    rating: 4.3,
    reviewCount: 950,
    trending: true,
    featured: false,
    integrations: ['Facebook Ads', 'Google Ads', 'Salesforce', 'HubSpot', 'Shopify'],
    lastVerified: new Date('2025-06-01')
  },
  // Educational Content Tools
  {
    id: 'courseai',
    name: 'CourseAI',
    slug: 'courseai',
    description: 'CourseAI helps educators and content creators build comprehensive online courses using AI. It generates course outlines, lesson plans, quizzes, and educational content, making it easier to create engaging learning experiences across various subjects and skill levels.',
    shortDescription: 'AI-powered online course creation and educational content generator',
    logo: 'https://images.pexels.com/photos/4050350/pexels-photo-4050350.jpeg',
    website: 'https://courseai.com',
    categoryId: 'document-creation',
    subcategoryIds: ['educational-content'],
    pricing: {
      type: 'subscription',
      startingPrice: '$29/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Creator',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['5 courses/month', 'AI content generation', 'Basic templates', 'Quiz creation']
        },
        {
          name: 'Educator',
          price: '$59/month',
          billingPeriod: 'monthly',
          features: ['Unlimited courses', 'Advanced AI features', 'Custom branding', 'Student analytics']
        },
        {
          name: 'Institution',
          price: '$149/month',
          billingPeriod: 'monthly',
          features: ['Multi-user access', 'White-label solution', 'API access', 'Priority support']
        }
      ]
    },
    features: [
      'Automated course outline generation',
      'Lesson plan creation',
      'Quiz and assessment builder',
      'Multi-format content support',
      'Student progress tracking',
      'Interactive content elements'
    ],
    limitations: [
      'No free tier available',
      'Content may need manual refinement',
      'Limited customization in lower tiers',
      'Requires pedagogical knowledge for best results'
    ],
    rating: 4.5,
    reviewCount: 680,
    trending: true,
    featured: false,
    integrations: ['LMS platforms', 'Zoom', 'Google Classroom', 'Canvas', 'Moodle'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'synthesia-education',
    name: 'Synthesia for Education',
    slug: 'synthesia-education',
    description: 'Synthesia enables educators to create AI-generated video content for online learning. With AI avatars and text-to-speech capabilities, it helps create engaging educational videos, training materials, and tutorials without the need for cameras or studios.',
    shortDescription: 'AI video creation platform for educational content and training',
    logo: 'https://images.pexels.com/photos/4050351/pexels-photo-4050351.jpeg',
    website: 'https://synthesia.io/education',
    categoryId: 'document-creation',
    subcategoryIds: ['educational-content'],
    pricing: {
      type: 'subscription',
      startingPrice: '$30/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Personal',
          price: '$30/month',
          billingPeriod: 'monthly',
          features: ['10 minutes/month', '70+ AI avatars', '120+ languages', 'Basic editing']
        },
        {
          name: 'Corporate',
          price: '$67/month',
          billingPeriod: 'monthly',
          features: ['30 minutes/month', 'Custom avatars', 'Team collaboration', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Unlimited minutes', 'Advanced features', 'SSO integration', 'Dedicated support']
        }
      ]
    },
    features: [
      'AI avatar video creation',
      'Multi-language support',
      'Educational video templates',
      'Screen recording integration',
      'Interactive elements',
      'Branded content creation'
    ],
    limitations: [
      'No free tier available',
      'Limited video minutes on lower plans',
      'AI avatars may feel impersonal',
      'Requires good script writing skills'
    ],
    rating: 4.6,
    reviewCount: 1200,
    trending: true,
    featured: false,
    integrations: ['PowerPoint', 'Articulate', 'LMS platforms', 'YouTube', 'Vimeo'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'coursebox-ai',
    name: 'Coursebox AI',
    slug: 'coursebox-ai',
    description: 'Coursebox AI transforms existing content into interactive online courses using artificial intelligence. It can convert documents, videos, and websites into structured learning experiences with quizzes, assessments, and progress tracking.',
    shortDescription: 'AI-powered course creation from existing content and materials',
    logo: 'https://images.pexels.com/photos/4050352/pexels-photo-4050352.jpeg',
    website: 'https://coursebox.ai',
    categoryId: 'document-creation',
    subcategoryIds: ['educational-content'],
    pricing: {
      type: 'freemium',
      startingPrice: '$39/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['1 course', 'Basic templates', 'Limited AI features']
        },
        {
          name: 'Pro',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['Unlimited courses', 'Advanced AI', 'Custom branding', 'Analytics']
        },
        {
          name: 'Team',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'White-label', 'API access', 'Priority support']
        }
      ]
    },
    features: [
      'Content-to-course conversion',
      'Interactive quiz generation',
      'Progress tracking',
      'Multi-format support',
      'Custom branding options',
      'Student engagement analytics'
    ],
    limitations: [
      'Free tier very limited',
      'AI conversion may need refinement',
      'Limited customization options',
      'Requires structured input content'
    ],
    rating: 4.4,
    reviewCount: 520,
    trending: true,
    featured: false,
    integrations: ['Google Drive', 'Dropbox', 'YouTube', 'Vimeo', 'LMS platforms'],
    lastVerified: new Date('2025-06-01')
  },
  // Proposal & Contract Tools
  {
    id: 'pandadoc-ai',
    name: 'PandaDoc AI',
    slug: 'pandadoc-ai',
    description: 'PandaDoc AI enhances document creation and management with artificial intelligence features. It helps create proposals, contracts, and quotes faster with smart templates, automated workflows, and AI-powered content suggestions.',
    shortDescription: 'AI-enhanced document automation for proposals and contracts',
    logo: 'https://images.pexels.com/photos/4050380/pexels-photo-4050380.jpeg',
    website: 'https://pandadoc.com/ai',
    categoryId: 'document-creation',
    subcategoryIds: ['proposals-contracts'],
    pricing: {
      type: 'subscription',
      startingPrice: '$19/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Essentials',
          price: '$19/user/month',
          billingPeriod: 'monthly',
          features: ['5 documents/month', 'Basic templates', 'E-signatures', 'AI assistance']
        },
        {
          name: 'Business',
          price: '$49/user/month',
          billingPeriod: 'monthly',
          features: ['Unlimited documents', 'Advanced AI', 'Workflow automation', 'CRM integration']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Custom features', 'Advanced security', 'Dedicated support', 'Custom integrations']
        }
      ]
    },
    features: [
      'AI-powered content generation',
      'Smart template suggestions',
      'Automated workflow creation',
      'Electronic signature integration',
      'Real-time collaboration',
      'Performance analytics'
    ],
    limitations: [
      'No free tier available',
      'Learning curve for advanced features',
      'Per-user pricing can be expensive',
      'AI suggestions may need refinement'
    ],
    rating: 4.5,
    reviewCount: 1800,
    trending: false,
    featured: false,
    integrations: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zapier', 'Google Workspace'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'proposify-ai',
    name: 'Proposify AI',
    slug: 'proposify-ai',
    description: 'Proposify AI streamlines proposal creation with intelligent content suggestions and automated formatting. It helps sales teams create winning proposals faster by analyzing successful patterns and generating personalized content for each prospect.',
    shortDescription: 'AI-powered proposal creation and optimization platform',
    logo: 'https://images.pexels.com/photos/4050381/pexels-photo-4050381.jpeg',
    website: 'https://proposify.com/ai',
    categoryId: 'document-creation',
    subcategoryIds: ['proposals-contracts'],
    pricing: {
      type: 'subscription',
      startingPrice: '$49/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Team',
          price: '$49/user/month',
          billingPeriod: 'monthly',
          features: ['Unlimited proposals', 'AI content suggestions', 'Basic analytics', 'Team collaboration']
        },
        {
          name: 'Business',
          price: '$99/user/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI features', 'Custom branding', 'Advanced analytics', 'CRM integration']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Custom features', 'Advanced security', 'Dedicated support', 'Custom integrations']
        }
      ]
    },
    features: [
      'AI content generation',
      'Proposal performance tracking',
      'Smart template library',
      'Client interaction analytics',
      'Automated follow-ups',
      'Custom branding options'
    ],
    limitations: [
      'No free tier available',
      'Higher pricing than some competitors',
      'Learning curve for optimization',
      'AI suggestions need context'
    ],
    rating: 4.3,
    reviewCount: 920,
    trending: false,
    featured: false,
    integrations: ['Salesforce', 'HubSpot', 'Pipedrive', 'Slack', 'Google Workspace'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'qwilr-ai',
    name: 'Qwilr AI',
    slug: 'qwilr-ai',
    description: 'Qwilr AI creates interactive, web-based proposals and quotes that engage clients better than traditional PDFs. It uses AI to suggest content improvements, optimize layouts, and track client engagement to increase proposal success rates.',
    shortDescription: 'Interactive AI-powered proposals and quotes platform',
    logo: 'https://images.pexels.com/photos/4050382/pexels-photo-4050382.jpeg',
    website: 'https://qwilr.com/ai',
    categoryId: 'document-creation',
    subcategoryIds: ['proposals-contracts'],
    pricing: {
      type: 'subscription',
      startingPrice: '$35/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Business',
          price: '$35/user/month',
          billingPeriod: 'monthly',
          features: ['Unlimited pages', 'AI content assistance', 'Basic analytics', 'E-signature']
        },
        {
          name: 'Enterprise',
          price: '$59/user/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI features', 'Custom domains', 'Advanced analytics', 'Team management']
        }
      ]
    },
    features: [
      'Interactive web-based proposals',
      'AI content optimization',
      'Real-time client engagement tracking',
      'Integrated payment processing',
      'Custom branding and domains',
      'Performance analytics'
    ],
    limitations: [
      'No free tier available',
      'Web-based format may not suit all clients',
      'Limited offline functionality',
      'Learning curve for design features'
    ],
    rating: 4.4,
    reviewCount: 750,
    trending: true,
    featured: false,
    integrations: ['Stripe', 'PayPal', 'Salesforce', 'HubSpot', 'Zapier'],
    lastVerified: new Date('2025-06-01')
  },
  // Translation & Localization Tools
  {
    id: 'deepl-ai',
    name: 'DeepL',
    slug: 'deepl-ai',
    description: 'DeepL uses advanced neural networks to provide highly accurate translations that maintain context and nuance. It supports over 30 languages and offers document translation, making it ideal for professional document localization and multilingual content creation.',
    shortDescription: 'Advanced neural machine translation with superior accuracy',
    logo: 'https://images.pexels.com/photos/4050400/pexels-photo-4050400.jpeg',
    website: 'https://deepl.com',
    categoryId: 'document-creation',
    subcategoryIds: ['translation-localization'],
    pricing: {
      type: 'freemium',
      startingPrice: '$6.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5,000 characters/month', 'Basic translation', 'Web interface']
        },
        {
          name: 'Pro',
          price: '$6.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited text translation', 'Document translation', 'Enhanced security', 'CAT tool integration']
        },
        {
          name: 'Advanced',
          price: '$22.99/month',
          billingPeriod: 'monthly',
          features: ['All Pro features', 'Priority support', 'Team management', 'Advanced integrations']
        }
      ]
    },
    features: [
      'High-accuracy neural translation',
      'Document format preservation',
      'Context-aware translations',
      'CAT tool integration',
      'Bulk document processing',
      'API access for developers'
    ],
    limitations: [
      'Free tier has character limits',
      'Limited language pairs compared to some competitors',
      'Advanced features require paid plans',
      'May struggle with highly specialized terminology'
    ],
    rating: 4.7,
    reviewCount: 3200,
    trending: false,
    featured: true,
    integrations: ['CAT tools', 'Microsoft Office', 'Google Workspace', 'API integrations'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'lokalise-ai',
    name: 'Lokalise AI',
    slug: 'lokalise-ai',
    description: 'Lokalise AI streamlines the localization process with AI-powered translation management. It offers automated translation suggestions, quality checks, and workflow automation to help teams manage multilingual content efficiently across apps, websites, and documents.',
    shortDescription: 'AI-powered localization management and translation platform',
    logo: 'https://images.pexels.com/photos/4050401/pexels-photo-4050401.jpeg',
    website: 'https://lokalise.com/ai',
    categoryId: 'document-creation',
    subcategoryIds: ['translation-localization'],
    pricing: {
      type: 'subscription',
      startingPrice: '$120/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Growth',
          price: '$120/month',
          billingPeriod: 'monthly',
          features: ['AI translation assistance', 'Project management', 'Team collaboration', 'API access']
        },
        {
          name: 'Pro',
          price: '$300/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI features', 'Custom workflows', 'Advanced integrations', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Custom AI models', 'SSO integration', 'Dedicated support', 'Custom features']
        }
      ]
    },
    features: [
      'AI-powered translation assistance',
      'Automated quality checks',
      'Workflow automation',
      'Real-time collaboration',
      'Version control',
      'Integration ecosystem'
    ],
    limitations: [
      'No free tier available',
      'Higher pricing for small teams',
      'Learning curve for advanced features',
      'AI quality depends on content type'
    ],
    rating: 4.5,
    reviewCount: 890,
    trending: true,
    featured: false,
    integrations: ['GitHub', 'Figma', 'Sketch', 'Android Studio', 'Xcode'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'phrase-ai',
    name: 'Phrase AI',
    slug: 'phrase-ai',
    description: 'Phrase AI provides intelligent translation management with machine learning capabilities. It helps teams automate translation workflows, maintain consistency across languages, and leverage AI to improve translation quality and reduce time-to-market for global content.',
    shortDescription: 'Intelligent translation management with ML-powered automation',
    logo: 'https://images.pexels.com/photos/4050402/pexels-photo-4050402.jpeg',
    website: 'https://phrase.com/ai',
    categoryId: 'document-creation',
    subcategoryIds: ['translation-localization'],
    pricing: {
      type: 'subscription',
      startingPrice: '$18/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Starter',
          price: '$18/user/month',
          billingPeriod: 'monthly',
          features: ['Basic AI features', 'Project management', 'API access', 'Standard support']
        },
        {
          name: 'Professional',
          price: '$50/user/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI translation', 'Workflow automation', 'Quality checks', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Custom AI models', 'Advanced security', 'Dedicated support', 'Custom integrations']
        }
      ]
    },
    features: [
      'ML-powered translation suggestions',
      'Automated workflow management',
      'Quality assurance automation',
      'Translation memory optimization',
      'Real-time collaboration',
      'Advanced reporting and analytics'
    ],
    limitations: [
      'No free tier available',
      'Complex pricing structure',
      'Learning curve for full utilization',
      'AI effectiveness varies by language pair'
    ],
    rating: 4.4,
    reviewCount: 650,
    trending: false,
    featured: false,
    integrations: ['GitHub', 'Gitlab', 'Bitbucket', 'Slack', 'Jira'],
    lastVerified: new Date('2025-06-01')
  },
  // Creative Writing Tools
  {
    id: 'sudowrite',
    name: 'Sudowrite',
    slug: 'sudowrite',
    description: 'Sudowrite is an AI writing partner specifically designed for creative writers, novelists, and storytellers. It helps with character development, plot generation, dialogue writing, and overcoming writer\'s block by providing creative suggestions that maintain your unique voice and style.',
    shortDescription: 'AI writing partner for creative fiction and storytelling',
    logo: 'https://images.pexels.com/photos/4050450/pexels-photo-4050450.jpeg',
    website: 'https://sudowrite.com',
    categoryId: 'document-creation',
    subcategoryIds: ['creative-writing'],
    pricing: {
      type: 'subscription',
      startingPrice: '$19/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Hobby',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['30,000 words/month', 'All writing tools', 'Character development', 'Plot assistance']
        },
        {
          name: 'Professional',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['90,000 words/month', 'Priority processing', 'Advanced features', 'Export options']
        },
        {
          name: 'Max',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['300,000 words/month', 'Fastest processing', 'Beta features', 'Priority support']
        }
      ]
    },
    features: [
      'Creative writing assistance',
      'Character development tools',
      'Plot and scene generation',
      'Dialogue enhancement',
      'Style consistency maintenance',
      'Writer\'s block solutions'
    ],
    limitations: [
      'No free tier available',
      'Monthly word limits',
      'Focused primarily on fiction writing',
      'AI suggestions may need refinement'
    ],
    rating: 4.6,
    reviewCount: 1400,
    trending: true,
    featured: true,
    integrations: ['Google Docs', 'Microsoft Word', 'Scrivener', 'Export to various formats'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'novelai',
    name: 'NovelAI',
    slug: 'novelai',
    description: 'NovelAI is a subscription-based AI storytelling service that helps writers create unique stories, adventures, and even virtual companionship. It offers advanced AI models trained specifically for creative writing, with features for world-building, character creation, and narrative development.',
    shortDescription: 'AI-powered storytelling and creative writing platform',
    logo: 'https://images.pexels.com/photos/4050451/pexels-photo-4050451.jpeg',
    website: 'https://novelai.net',
    categoryId: 'document-creation',
    subcategoryIds: ['creative-writing'],
    pricing: {
      type: 'subscription',
      startingPrice: '$10/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Tablet',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Unlimited text generations', 'Memory up to 3000 tokens', 'Advanced AI model', 'Export options']
        },
        {
          name: 'Scroll',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['All Tablet features', 'Memory up to 6000 tokens', 'Advanced features', 'Image generation']
        },
        {
          name: 'Opus',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['All Scroll features', 'Memory up to 8000 tokens', 'Premium features', 'Priority access']
        }
      ]
    },
    features: [
      'AI story generation',
      'Character and world building',
      'Adventure mode gaming',
      'Image generation for stories',
      'Lorebook for world consistency',
      'Multiple writing genres support'
    ],
    limitations: [
      'No free tier available',
      'Subscription required for all features',
      'Content filtering limitations',
      'Learning curve for advanced features'
    ],
    rating: 4.3,
    reviewCount: 2100,
    trending: true,
    featured: false,
    integrations: ['Export formats', 'API access', 'Third-party tools'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'shortlyai',
    name: 'Shortly AI',
    slug: 'shortlyai',
    description: 'Shortly AI is a straightforward AI writing assistant that helps writers continue their stories, articles, and creative works. With a simple interface and powerful AI, it provides seamless writing assistance without complicated features, making it perfect for writers who want to focus on their craft.',
    shortDescription: 'Simple and powerful AI writing assistant for seamless content creation',
    logo: 'https://images.pexels.com/photos/4050452/pexels-photo-4050452.jpeg',
    website: 'https://shortlyai.com',
    categoryId: 'document-creation',
    subcategoryIds: ['creative-writing'],
    pricing: {
      type: 'subscription',
      startingPrice: '$79/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Annual',
          price: '$65/month',
          billingPeriod: 'yearly',
          features: ['Unlimited writing', 'All AI models', 'Priority support', 'No word limits']
        },
        {
          name: 'Monthly',
          price: '$79/month',
          billingPeriod: 'monthly',
          features: ['Unlimited writing', 'All AI models', 'Standard support', 'No word limits']
        }
      ]
    },
    features: [
      'Unlimited AI writing assistance',
      'Simple, distraction-free interface',
      'Instant text continuation',
      'Multiple writing styles',
      'Real-time writing collaboration',
      'Export to various formats'
    ],
    limitations: [
      'No free tier available',
      'Higher pricing than competitors',
      'Limited advanced features',
      'Minimal customization options'
    ],
    rating: 4.2,
    reviewCount: 820,
    trending: false,
    featured: false,
    integrations: ['Google Docs', 'Export options', 'Basic API access'],
    lastVerified: new Date('2025-06-01')
  },
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
    id: 'slidebot-ai',
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
    id: 'gamma-ai',
    name: 'Gamma',
    slug: 'gamma-ai',
    description: 'AI-powered presentation builder that creates beautiful slides, documents, and webpages from simple text prompts with advanced design capabilities.',
    shortDescription: 'AI-powered presentation and webpage builder',
    logo: 'https://images.pexels.com/photos/4050520/pexels-photo-4050520.jpeg',
    website: 'https://gamma.app',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited AI credits', 'Basic templates', 'Export to PDF', 'Basic sharing']
        },
        {
          name: 'Plus',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Unlimited AI credits', 'Premium templates', 'Custom branding', 'Advanced export options']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Advanced analytics', 'Custom domains', 'Priority support']
        }
      ]
    },
    features: [
      'One-click presentation generation',
      'Smart content suggestions',
      'Auto-generated layouts',
      'Responsive design',
      'Real-time collaboration',
      'Custom branding options'
    ],
    limitations: [
      'Limited free credits',
      'Internet required',
      'Template restrictions on free tier'
    ],
    rating: 4.7,
    reviewCount: 1850,
    trending: true,
    featured: true,
    integrations: ['Google Drive', 'Figma', 'Notion', 'PowerPoint'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'beautiful-ai',
    name: 'Beautiful.AI',
    slug: 'beautiful-ai',
    description: 'Intelligent presentation software that automatically designs slides using AI-powered layout engine with smart templates and data visualization.',
    shortDescription: 'Smart presentation design platform',
    logo: 'https://images.pexels.com/photos/7947720/pexels-photo-7947720.jpeg',
    website: 'https://www.beautiful.ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'subscription',
      startingPrice: '$12/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Pro',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['Smart templates', 'Auto-arrange layouts', 'Team sharing', 'Export options']
        },
        {
          name: 'Team',
          price: '$40/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Brand management', 'Advanced analytics', 'Admin controls']
        }
      ]
    },
    features: [
      'Smart template engine',
      'Auto-arrange layouts',
      'Data visualization tools',
      'Brand consistency enforcement',
      'Real-time collaboration',
      'Presentation analytics'
    ],
    limitations: [
      'No free tier',
      'Learning curve for templates',
      'Limited customization options'
    ],
    rating: 4.5,
    reviewCount: 980,
    trending: false,
    featured: false,
    integrations: ['PowerPoint', 'Google Slides', 'Dropbox', 'Adobe Creative Suite'],
    lastVerified: new Date('2025-05-28')
  },
  {
    id: 'pitch-avatar',
    name: 'Pitch Avatar',
    slug: 'pitch-avatar',
    description: 'AI-powered platform that creates interactive video presentations with virtual avatars delivering your content in multiple languages.',
    shortDescription: 'AI avatar presentation creator',
    logo: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    website: 'https://pitchavatar.com',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$29/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Starter',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Basic avatars', '5 presentations/month', 'Standard voices', 'HD export']
        },
        {
          name: 'Professional',
          price: '$79/month',
          billingPeriod: 'monthly',
          features: ['Premium avatars', 'Unlimited presentations', 'Custom voices', '4K export']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Custom avatars', 'White-label solution', 'API access', 'Dedicated support']
        }
      ]
    },
    features: [
      'AI avatar presenters',
      'Multi-language support',
      'Custom voice synthesis',
      'Interactive elements',
      'Brand customization',
      'Analytics tracking'
    ],
    limitations: [
      'No free tier',
      'Rendering time required',
      'Limited avatar customization'
    ],
    rating: 4.4,
    reviewCount: 420,
    trending: true,
    featured: false,
    integrations: ['PowerPoint', 'Keynote', 'Zoom', 'Teams'],
    lastVerified: new Date('2025-05-29')
  },
  {
    id: 'presentations-ai',
    name: 'Presentations.AI',
    slug: 'presentations-ai',
    description: 'Advanced AI presentation generator that creates complete slide decks from topic inputs with intelligent content structuring and design optimization.',
    shortDescription: 'Complete AI presentation generator',
    logo: 'https://images.pexels.com/photos/4050475/pexels-photo-4050475.jpeg',
    website: 'https://presentations.ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$25/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 presentations/month', 'Basic templates', 'Standard export', 'Community support']
        },
        {
          name: 'Pro',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Premium templates', 'Advanced export', 'Priority support']
        },
        {
          name: 'Business',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['Team features', 'Custom branding', 'API access', 'Advanced analytics']
        }
      ]
    },
    features: [
      'Topic-to-presentation generation',
      'Intelligent content structuring',
      'Auto-generated speaker notes',
      'Multiple design themes',
      'Citation management',
      'Export to multiple formats'
    ],
    limitations: [
      'Limited free generations',
      'Requires clear topic definition',
      'May need manual editing'
    ],
    rating: 4.6,
    reviewCount: 750,
    trending: true,
    featured: false,
    integrations: ['PowerPoint', 'Google Slides', 'PDF export', 'Web sharing'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'decktopus-ai',
    name: 'Decktopus AI',
    slug: 'decktopus-ai',
    description: 'AI-powered presentation maker that creates professional slides with smart content suggestions, design automation, and interactive elements.',
    shortDescription: 'Smart presentation automation',
    logo: 'https://images.pexels.com/photos/7947866/pexels-photo-7947866.jpeg',
    website: 'https://www.decktopus.com',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$9.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 AI presentations', 'Basic templates', 'Decktopus branding', 'Standard support']
        },
        {
          name: 'Pro',
          price: '$9.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Remove branding', 'Premium templates', 'Advanced features']
        },
        {
          name: 'Business',
          price: '$19.99/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Custom branding', 'Analytics', 'Priority support']
        }
      ]
    },
    features: [
      'AI content generation',
      'Smart design suggestions',
      'Interactive slide elements',
      'Voice-over integration',
      'Real-time feedback',
      'Mobile optimization'
    ],
    limitations: [
      'Branding on free tier',
      'Limited free presentations',
      'Template restrictions'
    ],
    rating: 4.3,
    reviewCount: 1200,
    trending: false,
    featured: false,
    integrations: ['PowerPoint', 'PDF export', 'Social media', 'Webhooks'],
    lastVerified: new Date('2025-05-27')
  },
  {
    id: 'slidebean-ai',
    name: 'Slidebean',
    slug: 'slidebean-ai',
    description: 'AI-powered presentation platform focused on startup pitch decks with automated design, content optimization, and investor-ready templates.',
    shortDescription: 'AI pitch deck creator',
    logo: 'https://images.pexels.com/photos/4050490/pexels-photo-4050490.jpeg',
    website: 'https://slidebean.com',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 presentations', 'Basic templates', 'Slidebean branding', 'Standard export']
        },
        {
          name: 'Premium',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Premium templates', 'Remove branding', 'Analytics']
        },
        {
          name: 'Team',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Advanced analytics', 'Custom templates', 'Priority support']
        }
      ]
    },
    features: [
      'Startup-focused templates',
      'Automated slide design',
      'Pitch deck optimization',
      'Investor presentation tools',
      'Financial slide automation',
      'Presentation analytics'
    ],
    limitations: [
      'Startup/business focus',
      'Limited free presentations',
      'Template dependency'
    ],
    rating: 4.4,
    reviewCount: 850,
    trending: false,
    featured: false,
    integrations: ['Google Drive', 'Dropbox', 'PowerPoint', 'Analytics tools'],
    lastVerified: new Date('2025-05-26')
  },
  {
    id: 'tome-presentations',
    name: 'Tome Presentations',
    slug: 'tome-presentations',
    description: 'AI-native presentation platform that creates immersive, interactive presentations with multimedia content generation and storytelling focus.',
    shortDescription: 'AI multimedia presentation creator',
    logo: 'https://images.pexels.com/photos/4050445/pexels-photo-4050445.jpeg',
    website: 'https://tome.app/presentations',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$16/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['500 AI credits', 'Basic sharing', 'Core features', 'Community templates']
        },
        {
          name: 'Pro',
          price: '$16/month',
          billingPeriod: 'monthly',
          features: ['Unlimited AI credits', 'Custom branding', 'Advanced sharing', 'Premium features']
        },
        {
          name: 'Business',
          price: '$40/month',
          billingPeriod: 'monthly',
          features: ['Team workspace', 'Admin controls', 'Advanced analytics', 'Priority support']
        }
      ]
    },
    features: [
      'AI content generation',
      'Interactive multimedia elements',
      'Immersive storytelling',
      'Real-time collaboration',
      'Custom branding',
      'Advanced sharing options'
    ],
    limitations: [
      'Credit-based system',
      'Learning curve',
      'Internet dependency'
    ],
    rating: 4.5,
    reviewCount: 1100,
    trending: true,
    featured: false,
    integrations: ['Figma', 'Notion', 'Slack', 'Web embeds'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'designrr-presentations',
    name: 'Designrr Presentations',
    slug: 'designrr-presentations',
    description: 'AI-enhanced presentation tool that automatically converts content from various sources into professional slide presentations with smart formatting.',
    shortDescription: 'Content-to-presentation converter',
    logo: 'https://images.pexels.com/photos/4050460/pexels-photo-4050460.jpeg',
    website: 'https://designrr.io/presentations',
    categoryId: 'presentation-tools',
    subcategoryIds: ['presentation-enhancement'],
    pricing: {
      type: 'subscription',
      startingPrice: '$29/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Personal',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Content conversion', 'Basic templates', 'Standard export', 'Email support']
        },
        {
          name: 'Professional',
          price: '$59/month',
          billingPeriod: 'monthly',
          features: ['Advanced conversion', 'Premium templates', 'Team features', 'Priority support']
        },
        {
          name: 'Agency',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['White-label option', 'Client management', 'Custom branding', 'Dedicated support']
        }
      ]
    },
    features: [
      'Multi-source content import',
      'Automated slide formatting',
      'Smart content extraction',
      'Template customization',
      'Batch processing',
      'Multiple export formats'
    ],
    limitations: [
      'No free tier',
      'Limited source types',
      'Requires content preparation'
    ],
    rating: 4.2,
    reviewCount: 380,
    trending: false,
    featured: false,
    integrations: ['Google Docs', 'WordPress', 'PDF import', 'Cloud storage'],
    lastVerified: new Date('2025-05-25')
  },
  {
    id: 'slides-ai',
    name: 'Slides AI',
    slug: 'slides-ai',
    description: 'Google Slides add-on that uses AI to automatically generate presentation content, design slides, and optimize layouts within your existing workflow.',
    shortDescription: 'Google Slides AI add-on',
    logo: 'https://images.pexels.com/photos/4050520/pexels-photo-4050520.jpeg',
    website: 'https://workspace.google.com/marketplace/app/slides_ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 AI generations/month', 'Basic templates', 'Standard support', 'Google Slides integration']
        },
        {
          name: 'Pro',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Unlimited AI generations', 'Premium templates', 'Advanced features', 'Priority support']
        }
      ]
    },
    features: [
      'Native Google Slides integration',
      'AI content generation',
      'Smart design suggestions',
      'Template automation',
      'Collaborative editing',
      'Cloud synchronization'
    ],
    limitations: [
      'Google Slides only',
      'Limited free generations',
      'Requires Google account'
    ],
    rating: 4.3,
    reviewCount: 920,
    trending: false,
    featured: false,
    integrations: ['Google Slides', 'Google Workspace', 'Google Drive', 'Google Fonts'],
    lastVerified: new Date('2025-05-28')
  },
  {
    id: 'sendsteps-ai',
    name: 'SendSteps AI',
    slug: 'sendsteps-ai',
    description: 'Interactive presentation platform with AI-powered content generation, audience engagement tools, and real-time feedback collection.',
    shortDescription: 'Interactive AI presentation platform',
    logo: 'https://images.pexels.com/photos/7947720/pexels-photo-7947720.jpeg',
    website: 'https://www.sendsteps.com',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$8.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['2 presentations/month', 'Basic interactivity', 'Standard templates', 'Community support']
        },
        {
          name: 'Pro',
          price: '$8.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Advanced interactivity', 'Custom branding', 'Analytics']
        },
        {
          name: 'Business',
          price: '$24.99/month',
          billingPeriod: 'monthly',
          features: ['Team features', 'White-label option', 'Advanced analytics', 'Priority support']
        }
      ]
    },
    features: [
      'Interactive audience engagement',
      'AI content generation',
      'Real-time polls and quizzes',
      'Audience response collection',
      'Live presentation mode',
      'Advanced analytics'
    ],
    limitations: [
      'Limited free presentations',
      'Internet required for interactivity',
      'Learning curve for advanced features'
    ],
    rating: 4.4,
    reviewCount: 650,
    trending: true,
    featured: false,
    integrations: ['PowerPoint', 'Zoom', 'Teams', 'Webex'],
    lastVerified: new Date('2025-05-29')
  },
  {
    id: 'plus-ai-google-slides',
    name: 'Plus AI for Google Slides',
    slug: 'plus-ai-google-slides',
    description: 'Advanced AI add-on for Google Slides that creates presentations from prompts, rewrites content, and enhances existing slides with intelligent suggestions.',
    shortDescription: 'Advanced Google Slides AI enhancement',
    logo: 'https://images.pexels.com/photos/4050475/pexels-photo-4050475.jpeg',
    website: 'https://www.plusdocs.com/plus-ai-for-google-slides',
    categoryId: 'presentation-tools',
    subcategoryIds: ['presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$15/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 AI generations/month', 'Basic features', 'Standard templates', 'Community support']
        },
        {
          name: 'Pro',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['100 AI generations/month', 'Advanced features', 'Custom templates', 'Priority support']
        },
        {
          name: 'Premium',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['Unlimited generations', 'Team features', 'Advanced customization', 'Dedicated support']
        }
      ]
    },
    features: [
      'Advanced AI content generation',
      'Intelligent slide enhancement',
      'Content rewriting capabilities',
      'Smart formatting suggestions',
      'Template customization',
      'Collaborative features'
    ],
    limitations: [
      'Google Slides dependency',
      'Monthly generation limits',
      'Requires Google Workspace'
    ],
    rating: 4.5,
    reviewCount: 780,
    trending: true,
    featured: false,
    integrations: ['Google Slides', 'Google Workspace', 'Google Drive', 'Third-party templates'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'prezo-ai',
    name: 'Prezo AI',
    slug: 'prezo-ai',
    description: 'AI-powered presentation assistant that helps create, edit, and optimize presentations with smart content suggestions and design automation.',
    shortDescription: 'Complete AI presentation assistant',
    logo: 'https://images.pexels.com/photos/4050490/pexels-photo-4050490.jpeg',
    website: 'https://prezo.ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$12/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 presentations/month', 'Basic AI features', 'Standard templates', 'Basic export']
        },
        {
          name: 'Starter',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['15 presentations/month', 'Advanced AI', 'Premium templates', 'HD export']
        },
        {
          name: 'Pro',
          price: '$24/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Team features', 'Custom branding', 'Analytics']
        }
      ]
    },
    features: [
      'Comprehensive AI assistance',
      'Multi-format support',
      'Smart content optimization',
      'Design automation',
      'Collaboration tools',
      'Performance analytics'
    ],
    limitations: [
      'Monthly presentation limits',
      'Template restrictions on free tier',
      'Learning curve for advanced features'
    ],
    rating: 4.3,
    reviewCount: 540,
    trending: false,
    featured: false,
    integrations: ['PowerPoint', 'Google Slides', 'Keynote', 'PDF export'],
    lastVerified: new Date('2025-05-27')
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
  },

  // =====================
  // AI EDUCATION TOOLS
  // =====================

  // Online Courses & MOOCs
  {
    id: 'coursera-ai',
    name: 'Coursera AI Courses',
    slug: 'coursera-ai',
    description: 'Coursera offers comprehensive AI and machine learning courses from top universities like Stanford, DeepLearning.AI, and Google. Features hands-on projects, peer-reviewed assignments, and industry certificates.',
    shortDescription: 'University-level AI courses and specializations',
    logo: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg',
    website: 'https://www.coursera.org/browse/data-science/machine-learning',
    categoryId: 'ai-education',
    subcategoryIds: ['online-courses'],
    pricing: {
      type: 'subscription',
      startingPrice: '$39/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Audit',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Access to course videos', 'Reading materials', 'Discussion forums']
        },
        {
          name: 'Certificate',
          price: '$39-79/month',
          billingPeriod: 'monthly',
          features: ['All audit features', 'Graded assignments', 'Certificate upon completion', 'Peer feedback']
        }
      ]
    },
    features: [
      'Courses from top universities',
      'Hands-on programming assignments',
      'Peer-reviewed projects',
      'Industry-recognized certificates',
      'Flexible scheduling',
      'Mobile learning app'
    ],
    limitations: [
      'Certificates require payment',
      'Some courses have fixed schedules',
      'Limited free access to assignments',
      'Subscription needed for full features'
    ],
    rating: 4.7,
    reviewCount: 12540,
    trending: true,
    featured: true,
    integrations: ['Mobile apps', 'Learning management systems', 'LinkedIn profiles'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'udacity-ai',
    name: 'Udacity AI Nanodegrees',
    slug: 'udacity-ai',
    description: 'Udacity offers industry-focused AI and machine learning nanodegree programs designed with tech companies. Features project-based learning, mentor support, and career services.',
    shortDescription: 'Industry-focused AI nanodegree programs',
    logo: 'https://images.pexels.com/photos/5935791/pexels-photo-5935791.jpeg',
    website: 'https://www.udacity.com/school-of-artificial-intelligence',
    categoryId: 'ai-education',
    subcategoryIds: ['online-courses'],
    pricing: {
      type: 'subscription',
      startingPrice: '$399/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Nanodegree',
          price: '$399/month',
          billingPeriod: 'monthly',
          features: ['Project-based curriculum', 'Mentor support', 'Career services', 'GitHub portfolio']
        },
        {
          name: 'Nanodegree Plus',
          price: '$599/month',
          billingPeriod: 'monthly',
          features: ['All standard features', 'Job guarantee', 'Extended support', 'Priority mentoring']
        }
      ]
    },
    features: [
      'Industry-designed curriculum',
      'Real-world projects',
      'Personal mentor support',
      'Career coaching',
      'GitHub portfolio building',
      'Job placement assistance'
    ],
    limitations: [
      'High cost compared to other platforms',
      'No free options',
      'Fixed program structure',
      'Time-intensive commitment'
    ],
    rating: 4.5,
    reviewCount: 3890,
    trending: true,
    featured: true,
    integrations: ['GitHub', 'LinkedIn', 'Career platforms', 'Industry tools'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'edx-ai',
    name: 'edX AI Courses',
    slug: 'edx-ai',
    description: 'edX provides AI and machine learning courses from MIT, Harvard, and other top institutions. Offers both free audit tracks and verified certificates with rigorous academic content.',
    shortDescription: 'Academic AI courses from top universities',
    logo: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg',
    website: 'https://www.edx.org/learn/artificial-intelligence',
    categoryId: 'ai-education',
    subcategoryIds: ['online-courses'],
    pricing: {
      type: 'freemium',
      startingPrice: '$50-300 per course',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Audit',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Course content access', 'Video lectures', 'Basic exercises']
        },
        {
          name: 'Verified Certificate',
          price: '$50-300',
          billingPeriod: 'one-time',
          features: ['All audit features', 'Graded assignments', 'Verified certificate', 'Instructor feedback']
        }
      ]
    },
    features: [
      'University-level academic content',
      'Self-paced learning',
      'Interactive exercises',
      'Discussion forums',
      'Mobile accessibility',
      'Verified certificates'
    ],
    limitations: [
      'Academic pace may be slow',
      'Limited practical applications',
      'Certificate fees required',
      'Less industry focus'
    ],
    rating: 4.6,
    reviewCount: 8760,
    trending: false,
    featured: true,
    integrations: ['University systems', 'LinkedIn profiles', 'Academic platforms'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'udemy-ai',
    name: 'Udemy AI Courses',
    slug: 'udemy-ai',
    description: 'Udemy hosts thousands of AI and machine learning courses from industry practitioners. Offers lifetime access to purchased courses with practical, hands-on content.',
    shortDescription: 'Practical AI courses with lifetime access',
    logo: 'https://images.pexels.com/photos/4144294/pexels-photo-4144294.jpeg',
    website: 'https://www.udemy.com/topic/artificial-intelligence/',
    categoryId: 'ai-education',
    subcategoryIds: ['online-courses'],
    pricing: {
      type: 'one-time',
      startingPrice: '$10-200 per course',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free Courses',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Basic course content', 'Limited features', 'Community access']
        },
        {
          name: 'Paid Courses',
          price: '$10-200',
          billingPeriod: 'one-time',
          features: ['Full course content', 'Lifetime access', 'Certificate of completion', 'Q&A support']
        }
      ]
    },
    features: [
      'Lifetime course access',
      'Practical, hands-on approach',
      'Wide variety of instructors',
      'Regular sales and discounts',
      'Mobile app learning',
      'Certificate of completion'
    ],
    limitations: [
      'Variable course quality',
      'No accreditation',
      'Limited instructor interaction',
      'Overwhelming course selection'
    ],
    rating: 4.4,
    reviewCount: 25680,
    trending: true,
    featured: false,
    integrations: ['Mobile apps', 'Various development tools', 'Certificate platforms'],
    lastVerified: new Date('2025-05-30')
  },

  // Interactive Tutorials
  {
    id: 'kaggle-learn',
    name: 'Kaggle Learn',
    slug: 'kaggle-learn',
    description: 'Kaggle Learn offers free, practical micro-courses in AI and data science. Features hands-on coding exercises with real datasets and immediate feedback in an interactive environment.',
    shortDescription: 'Free micro-courses with hands-on coding',
    logo: 'https://images.pexels.com/photos/6424586/pexels-photo-6424586.jpeg',
    website: 'https://www.kaggle.com/learn',
    categoryId: 'ai-education',
    subcategoryIds: ['interactive-tutorials'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['All micro-courses', 'Hands-on exercises', 'Completion certificates', 'Community access']
        }
      ]
    },
    features: [
      'Completely free access',
      'Interactive coding exercises',
      'Real-world datasets',
      'Immediate feedback',
      'Progress tracking',
      'Community integration'
    ],
    limitations: [
      'Limited depth per course',
      'No instructor support',
      'Basic certificate only',
      'Requires Kaggle account'
    ],
    rating: 4.8,
    reviewCount: 15420,
    trending: true,
    featured: true,
    integrations: ['Kaggle platform', 'Jupyter notebooks', 'Python ecosystem'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'brilliant-ai',
    name: 'Brilliant AI Courses',
    slug: 'brilliant-ai',
    description: 'Brilliant offers interactive AI and computer science courses with visual problem-solving approach. Features bite-sized lessons with immediate application and gamified learning.',
    shortDescription: 'Interactive visual AI learning platform',
    logo: 'https://images.pexels.com/photos/5428649/pexels-photo-5428649.jpeg',
    website: 'https://brilliant.org/courses/artificial-intelligence/',
    categoryId: 'ai-education',
    subcategoryIds: ['interactive-tutorials'],
    pricing: {
      type: 'freemium',
      startingPrice: '$12.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited course access', 'Basic problem solving', 'Community features']
        },
        {
          name: 'Premium',
          price: '$12.99/month',
          billingPeriod: 'monthly',
          features: ['All courses', 'Unlimited practice', 'Detailed explanations', 'Progress tracking']
        }
      ]
    },
    features: [
      'Visual learning approach',
      'Interactive problem solving',
      'Bite-sized lessons',
      'Gamified experience',
      'Mobile-first design',
      'Progress tracking'
    ],
    limitations: [
      'Less coding practice',
      'Premium required for full access',
      'Limited practical applications',
      'More conceptual than hands-on'
    ],
    rating: 4.6,
    reviewCount: 7850,
    trending: true,
    featured: false,
    integrations: ['Mobile apps', 'Web platform', 'Educational tools'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'fastai',
    name: 'fast.ai',
    slug: 'fastai',
    description: 'fast.ai provides free, practical deep learning courses with a top-down approach. Features state-of-the-art techniques taught through hands-on coding with real applications.',
    shortDescription: 'Free practical deep learning courses',
    logo: 'https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg',
    website: 'https://www.fast.ai/',
    categoryId: 'ai-education',
    subcategoryIds: ['interactive-tutorials'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Complete course access', 'Jupyter notebooks', 'Community forum', 'Book content']
        }
      ]
    },
    features: [
      'Completely free access',
      'Practical, top-down approach',
      'State-of-the-art techniques',
      'Jupyter notebook format',
      'Active community forum',
      'Real-world applications'
    ],
    limitations: [
      'Assumes some coding knowledge',
      'Fast-paced content',
      'Limited beginner support',
      'Self-directed learning only'
    ],
    rating: 4.9,
    reviewCount: 6790,
    trending: true,
    featured: true,
    integrations: ['Jupyter notebooks', 'PyTorch', 'Python ecosystem', 'Cloud platforms'],
    lastVerified: new Date('2025-05-30')
  },

  // AI Coding Platforms
  {
    id: 'kaggle',
    name: 'Kaggle',
    slug: 'kaggle',
    description: 'Kaggle is the world\'s largest data science community with competitions, datasets, notebooks, and courses. Provides free GPU/TPU access for machine learning experiments.',
    shortDescription: 'Data science community and competition platform',
    logo: 'https://images.pexels.com/photos/6424587/pexels-photo-6424587.jpeg',
    website: 'https://www.kaggle.com/',
    categoryId: 'ai-education',
    subcategoryIds: ['coding-platforms'],
    pricing: {
      type: 'freemium',
      startingPrice: 'Free with premium features',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Competitions', 'Datasets', 'Notebooks', 'Limited GPU hours', 'Community access']
        },
        {
          name: 'Kaggle+',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Extended GPU/TPU hours', 'Priority support', 'Advanced features', 'Exclusive content']
        }
      ]
    },
    features: [
      'Machine learning competitions',
      'Free datasets and notebooks',
      'GPU/TPU compute access',
      'Community collaboration',
      'Learning courses',
      'Career opportunities'
    ],
    limitations: [
      'Limited free compute time',
      'Competition-focused environment',
      'Steep learning curve',
      'Resource usage restrictions'
    ],
    rating: 4.7,
    reviewCount: 18950,
    trending: true,
    featured: true,
    integrations: ['Python/R', 'Jupyter notebooks', 'Cloud platforms', 'ML frameworks'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'google-colab',
    name: 'Google Colab',
    slug: 'google-colab',
    description: 'Google Colaboratory provides free Jupyter notebook environment with GPU/TPU access for machine learning. Features seamless integration with Google Drive and easy sharing.',
    shortDescription: 'Free Jupyter notebooks with GPU access',
    logo: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg',
    website: 'https://colab.research.google.com/',
    categoryId: 'ai-education',
    subcategoryIds: ['coding-platforms'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month for Pro',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic notebooks', 'Limited GPU/TPU', 'Google Drive integration', '12 hour runtime limit']
        },
        {
          name: 'Colab Pro',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Priority GPU access', 'Longer runtimes', 'More memory', 'Background execution']
        }
      ]
    },
    features: [
      'Free GPU/TPU access',
      'No setup required',
      'Google Drive integration',
      'Easy sharing and collaboration',
      'Pre-installed ML libraries',
      'Jupyter notebook interface'
    ],
    limitations: [
      'Session timeouts',
      'Limited free compute',
      'Internet dependency',
      'Storage limitations'
    ],
    rating: 4.8,
    reviewCount: 23560,
    trending: true,
    featured: true,
    integrations: ['Google Drive', 'GitHub', 'Python ecosystem', 'ML frameworks'],
    lastVerified: new Date('2025-05-30')
  },

  // Visualization Tools
  {
    id: 'tensorflow-playground',
    name: 'TensorFlow Playground',
    slug: 'tensorflow-playground',
    description: 'Interactive visualization tool for understanding neural networks. Allows experimentation with different architectures, datasets, and hyperparameters in real-time.',
    shortDescription: 'Interactive neural network visualization',
    logo: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    website: 'https://playground.tensorflow.org/',
    categoryId: 'ai-education',
    subcategoryIds: ['visualization-tools'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Full access', 'Interactive visualization', 'Real-time experimentation', 'Educational content']
        }
      ]
    },
    features: [
      'Interactive neural network visualization',
      'Real-time parameter adjustment',
      'Multiple dataset options',
      'Architecture experimentation',
      'Educational explanations',
      'No installation required'
    ],
    limitations: [
      'Simple networks only',
      'Limited to basic concepts',
      'No advanced features',
      'Web-based only'
    ],
    rating: 4.9,
    reviewCount: 5420,
    trending: false,
    featured: true,
    integrations: ['Web browsers', 'Educational platforms'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'distill-pub',
    name: 'Distill',
    slug: 'distill-pub',
    description: 'Distill presents machine learning research through clear, interactive visualizations. Features explorable explanations that make complex AI concepts accessible.',
    shortDescription: 'Interactive ML research explanations',
    logo: 'https://images.pexels.com/photos/5473298/pexels-photo-5473298.jpeg',
    website: 'https://distill.pub/',
    categoryId: 'ai-education',
    subcategoryIds: ['visualization-tools'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['All articles', 'Interactive visualizations', 'Research content', 'Educational materials']
        }
      ]
    },
    features: [
      'Interactive research articles',
      'High-quality visualizations',
      'Complex concept explanations',
      'Peer-reviewed content',
      'Explorable explanations',
      'Mobile-friendly design'
    ],
    limitations: [
      'Limited new content',
      'Advanced topics only',
      'No interactive exercises',
      'Read-only format'
    ],
    rating: 4.8,
    reviewCount: 2890,
    trending: false,
    featured: true,
    integrations: ['Web platforms', 'Academic systems', 'Research tools'],
    lastVerified: new Date('2025-05-30')
  },

  // Research & Academic Tools
  {
    id: 'arxiv',
    name: 'arXiv',
    slug: 'arxiv',
    description: 'arXiv is a free distribution service and open-access archive for scholarly articles in AI, machine learning, and other fields. Provides early access to cutting-edge research.',
    shortDescription: 'Free access to AI research papers',
    logo: 'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg',
    website: 'https://arxiv.org/',
    categoryId: 'ai-education',
    subcategoryIds: ['research-papers'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Full paper access', 'Search functionality', 'RSS feeds', 'Mobile access']
        }
      ]
    },
    features: [
      'Free access to research papers',
      'Early publication access',
      'Comprehensive search',
      'RSS feeds and alerts',
      'Mobile accessibility',
      'Version tracking'
    ],
    limitations: [
      'No peer review process',
      'Academic writing style',
      'Variable paper quality',
      'No interactive features'
    ],
    rating: 4.7,
    reviewCount: 8950,
    trending: false,
    featured: true,
    integrations: ['Academic platforms', 'Reference managers', 'Research tools'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'papers-with-code',
    name: 'Papers with Code',
    slug: 'papers-with-code',
    description: 'Papers with Code connects machine learning research papers with their implementation code. Features leaderboards, benchmarks, and reproducible research.',
    shortDescription: 'ML papers with implementation code',
    logo: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    website: 'https://paperswithcode.com/',
    categoryId: 'ai-education',
    subcategoryIds: ['research-papers'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Paper access', 'Code repositories', 'Leaderboards', 'Benchmarks', 'Search tools']
        }
      ]
    },
    features: [
      'Papers linked to code',
      'Benchmark leaderboards',
      'Reproducible research',
      'Implementation tracking',
      'State-of-the-art results',
      'Community contributions'
    ],
    limitations: [
      'Code quality varies',
      'Not all papers included',
      'Technical complexity',
      'Limited beginner content'
    ],
    rating: 4.8,
    reviewCount: 6750,
    trending: true,
    featured: true,
    integrations: ['GitHub', 'arXiv', 'Academic platforms', 'Development tools'],
    lastVerified: new Date('2025-05-30')
  },

  // Learning Communities
  {
    id: 'towards-data-science',
    name: 'Towards Data Science',
    slug: 'towards-data-science',
    description: 'Towards Data Science is Medium\'s largest publication for AI and data science content. Features articles, tutorials, and insights from industry practitioners and researchers.',
    shortDescription: 'AI and data science publication on Medium',
    logo: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg',
    website: 'https://towardsdatascience.com/',
    categoryId: 'ai-education',
    subcategoryIds: ['ai-communities'],
    pricing: {
      type: 'freemium',
      startingPrice: '$5/month for Medium membership',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited articles', 'Basic content', 'Community access']
        },
        {
          name: 'Medium Member',
          price: '$5/month',
          billingPeriod: 'monthly',
          features: ['Unlimited articles', 'Premium content', 'Author support', 'Ad-free reading']
        }
      ]
    },
    features: [
      'High-quality articles',
      'Industry insights',
      'Practical tutorials',
      'Expert authors',
      'Community discussions',
      'Regular updates'
    ],
    limitations: [
      'Paywall for premium content',
      'Variable article quality',
      'No structured curriculum',
      'Medium platform dependency'
    ],
    rating: 4.6,
    reviewCount: 12400,
    trending: true,
    featured: false,
    integrations: ['Medium platform', 'Social media', 'Professional networks'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'huggingface-community',
    name: 'Hugging Face Community',
    slug: 'huggingface-community',
    description: 'Hugging Face provides a collaborative platform for machine learning with models, datasets, and spaces. Features community-driven development and learning resources.',
    shortDescription: 'Collaborative ML platform and community',
    logo: 'https://images.pexels.com/photos/8386442/pexels-photo-8386442.jpeg',
    website: 'https://huggingface.co/',
    categoryId: 'ai-education',
    subcategoryIds: ['ai-communities'],
    pricing: {
      type: 'freemium',
      startingPrice: '$9/month for Pro',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Public models and datasets', 'Community features', 'Basic compute', 'Forum access']
        },
        {
          name: 'Pro',
          price: '$9/month',
          billingPeriod: 'monthly',
          features: ['Private repositories', 'Advanced compute', 'Priority support', 'Enhanced features']
        }
      ]
    },
    features: [
      'Pre-trained model repository',
      'Dataset sharing platform',
      'Collaborative development',
      'Educational content',
      'Community forums',
      'Model deployment tools'
    ],
    limitations: [
      'Technical complexity',
      'Requires ML knowledge',
      'Limited free compute',
      'Platform-specific learning'
    ],
    rating: 4.7,
    reviewCount: 9850,
    trending: true,
    featured: true,
    integrations: ['Python libraries', 'ML frameworks', 'Cloud platforms', 'Development tools'],
    lastVerified: new Date('2025-05-30')
  },

  // Additional AI Education Tools
  {
    id: 'pluralsight-ai',
    name: 'Pluralsight AI',
    slug: 'pluralsight-ai',
    description: 'Professional AI and machine learning courses with hands-on labs, skill assessments, and learning paths for enterprise-level AI education.',
    shortDescription: 'Professional AI learning platform',
    logo: 'https://images.pexels.com/photos/3861943/pexels-photo-3861943.jpeg',
    website: 'https://www.pluralsight.com/ai',
    categoryId: 'ai-education',
    subcategoryIds: ['online-courses'],
    pricing: {
      type: 'subscription',
      startingPrice: '$29/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free Trial',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Course access', 'Basic assessments', 'Limited labs']
        },
        {
          name: 'Core',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['All courses', 'Skill assessments', 'Learning paths', 'Basic analytics']
        },
        {
          name: 'Premium',
          price: '$45/month',
          billingPeriod: 'monthly',
          features: ['Hands-on labs', 'Practice exams', 'Advanced analytics', 'Expert mentoring']
        }
      ]
    },
    features: [
      'Professional AI courses',
      'Hands-on lab exercises',
      'Skill assessments',
      'Learning path guidance',
      'Industry expert instructors',
      'Certificate programs'
    ],
    limitations: [
      'Subscription required',
      'Enterprise focus',
      'High cost',
      'Technical prerequisites'
    ],
    rating: 4.5,
    reviewCount: 12400,
    trending: false,
    featured: false,
    integrations: ['IDE plugins', 'Enterprise systems', 'Learning management', 'Certification bodies'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'linkedin-learning-ai',
    name: 'LinkedIn Learning AI',
    slug: 'linkedin-learning-ai',
    description: 'Professional AI and machine learning courses integrated with LinkedIn profiles, offering career-focused learning with industry recognition.',
    shortDescription: 'Career-focused AI learning',
    logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg',
    website: 'https://www.linkedin.com/learning/topics/artificial-intelligence',
    categoryId: 'ai-education',
    subcategoryIds: ['online-courses'],
    pricing: {
      type: 'subscription',
      startingPrice: '$29.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free Trial',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Course access', 'Basic certificates', 'Mobile learning']
        },
        {
          name: 'Premium',
          price: '$29.99/month',
          billingPeriod: 'monthly',
          features: ['All courses', 'LinkedIn certificates', 'Offline viewing', 'Skills assessments']
        }
      ]
    },
    features: [
      'Professional AI courses',
      'LinkedIn profile integration',
      'Industry certificates',
      'Career guidance',
      'Mobile learning app',
      'Expert instructors'
    ],
    limitations: [
      'Subscription required',
      'LinkedIn dependency',
      'Limited hands-on practice',
      'Course quality varies'
    ],
    rating: 4.3,
    reviewCount: 8650,
    trending: false,
    featured: false,
    integrations: ['LinkedIn profile', 'Microsoft products', 'Mobile apps', 'HR systems'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'jupyter-notebooks',
    name: 'Jupyter Notebooks',
    slug: 'jupyter-notebooks',
    description: 'Interactive computational environment for AI and data science education, enabling live code, equations, visualizations, and narrative text.',
    shortDescription: 'Interactive AI development environment',
    logo: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg',
    website: 'https://jupyter.org/',
    categoryId: 'ai-education',
    subcategoryIds: ['coding-platforms'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Full functionality', 'Local installation', 'Community support', 'Extension ecosystem']
        }
      ]
    },
    features: [
      'Interactive notebooks',
      'Multi-language support',
      'Rich media output',
      'Collaborative sharing',
      'Extension ecosystem',
      'Export capabilities'
    ],
    limitations: [
      'Local setup required',
      'Resource intensive',
      'Version control challenges',
      'Security considerations'
    ],
    rating: 4.8,
    reviewCount: 15200,
    trending: true,
    featured: true,
    integrations: ['Python', 'R', 'Scala', 'Cloud platforms', 'Git', 'Docker'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'paperspace-gradient',
    name: 'Paperspace Gradient',
    slug: 'paperspace-gradient',
    description: 'Cloud-based machine learning platform with Jupyter notebooks, GPU access, and collaborative features for AI education and research.',
    shortDescription: 'Cloud ML development platform',
    logo: 'https://images.pexels.com/photos/1181677/pexels-photo-1177677.jpeg',
    website: 'https://www.paperspace.com/gradient',
    categoryId: 'ai-education',
    subcategoryIds: ['coding-platforms'],
    pricing: {
      type: 'freemium',
      startingPrice: '$8/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic CPU instances', 'Public notebooks', 'Community support', 'Limited hours']
        },
        {
          name: 'Growth',
          price: '$8/month',
          billingPeriod: 'monthly',
          features: ['GPU access', 'Private notebooks', 'More compute hours', 'Priority support']
        },
        {
          name: 'Pro',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['High-end GPUs', 'Unlimited private notebooks', 'Team collaboration', 'Advanced features']
        }
      ]
    },
    features: [
      'Cloud Jupyter notebooks',
      'GPU/TPU access',
      'Pre-configured environments',
      'Team collaboration',
      'Model deployment',
      'Version control integration'
    ],
    limitations: [
      'Usage-based pricing',
      'Internet dependency',
      'Resource limitations on free tier',
      'Learning curve'
    ],
    rating: 4.4,
    reviewCount: 3200,
    trending: true,
    featured: false,
    integrations: ['GitHub', 'Docker', 'TensorFlow', 'PyTorch', 'MLflow', 'Weights & Biases'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'github-codespaces',
    name: 'GitHub Codespaces',
    slug: 'github-codespaces',
    description: 'Cloud development environment with AI-powered coding assistance, perfect for AI education projects with pre-configured ML environments.',
    shortDescription: 'Cloud development with AI assistance',
    logo: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',
    website: 'https://github.com/features/codespaces',
    categoryId: 'ai-education',
    subcategoryIds: ['coding-platforms'],
    pricing: {
      type: 'freemium',
      startingPrice: '$0.18/hour',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['120 core hours', '15 GB storage', 'Basic instances', 'Personal use']
        },
        {
          name: 'Pay-as-you-go',
          price: '$0.18/hour',
          billingPeriod: 'monthly',
          features: ['Unlimited usage', 'Powerful instances', 'Team collaboration', 'Enterprise features']
        }
      ]
    },
    features: [
      'Pre-configured AI environments',
      'GitHub Copilot integration',
      'VS Code in browser',
      'Repository integration',
      'Collaborative coding',
      'Custom configurations'
    ],
    limitations: [
      'Usage-based pricing',
      'GitHub dependency',
      'Internet required',
      'Resource limitations'
    ],
    rating: 4.6,
    reviewCount: 5800,
    trending: true,
    featured: false,
    integrations: ['GitHub', 'VS Code', 'Copilot', 'Docker', 'Git', 'Extensions'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'replit-ai',
    name: 'Replit AI',
    slug: 'replit-ai',
    description: 'Collaborative online IDE with AI-powered coding assistance, featuring built-in AI tutoring and code generation for learning programming and AI.',
    shortDescription: 'AI-powered collaborative coding platform',
    logo: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
    website: 'https://replit.com/',
    categoryId: 'ai-education',
    subcategoryIds: ['coding-platforms'],
    pricing: {
      type: 'freemium',
      startingPrice: '$7/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Public repls', 'Basic AI features', 'Community access', 'Limited resources']
        },
        {
          name: 'Core',
          price: '$7/month',
          billingPeriod: 'monthly',
          features: ['Private repls', 'Enhanced AI', 'More resources', 'Priority support']
        },
        {
          name: 'Teams',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Advanced AI', 'Admin controls', 'Enhanced security']
        }
      ]
    },
    features: [
      'AI code generation',
      'Real-time collaboration',
      'Multi-language support',
      'Instant deployment',
      'Educational templates',
      'AI tutoring assistance'
    ],
    limitations: [
      'Internet dependency',
      'Resource constraints on free tier',
      'AI features require subscription',
      'Limited offline access'
    ],
    rating: 4.5,
    reviewCount: 7200,
    trending: true,
    featured: false,
    integrations: ['Git', 'GitHub', 'Package managers', 'Databases', 'APIs', 'Educational platforms'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'neural-network-playground',
    name: 'Neural Network Playground',
    slug: 'neural-network-playground',
    description: 'Interactive visualization tool for understanding neural networks, allowing hands-on experimentation with network architectures and parameters.',
    shortDescription: 'Interactive neural network visualization',
    logo: 'https://images.pexels.com/photos/1181412/pexels-photo-1181412.jpeg',
    website: 'https://playground.tensorflow.org/',
    categoryId: 'ai-education',
    subcategoryIds: ['visualization-tools'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Full access', 'All visualizations', 'Educational content', 'No registration required']
        }
      ]
    },
    features: [
      'Interactive neural network builder',
      'Real-time visualization',
      'Parameter adjustment',
      'Dataset exploration',
      'Educational explanations',
      'Shareable configurations'
    ],
    limitations: [
      'Simple networks only',
      'Limited to toy datasets',
      'Browser-based only',
      'No advanced features'
    ],
    rating: 4.9,
    reviewCount: 4500,
    trending: false,
    featured: true,
    integrations: ['TensorFlow', 'Educational platforms', 'Web browsers', 'Sharing tools'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'seeing-ai',
    name: 'Seeing AI',
    slug: 'seeing-ai',
    description: 'Microsoft\'s AI-powered app that narrates the world for visually impaired users, demonstrating computer vision capabilities in education.',
    shortDescription: 'AI accessibility and computer vision demo',
    logo: 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg',
    website: 'https://www.microsoft.com/en-us/ai/seeing-ai',
    categoryId: 'ai-education',
    subcategoryIds: ['visualization-tools'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Full functionality', 'All AI features', 'Regular updates', 'No ads']
        }
      ]
    },
    features: [
      'Object recognition',
      'Text reading',
      'Person identification',
      'Scene description',
      'Product recognition',
      'Handwriting detection'
    ],
    limitations: [
      'iOS only',
      'Internet required for some features',
      'Language limitations',
      'Camera quality dependent'
    ],
    rating: 4.7,
    reviewCount: 8900,
    trending: false,
    featured: false,
    integrations: ['iOS accessibility', 'VoiceOver', 'Microsoft services', 'Camera app'],
    lastVerified: new Date('2025-05-30')
  },

  {
    id: 'ml-visuals',
    name: 'ML Visuals',
    slug: 'ml-visuals',
    description: 'Open-source collection of machine learning visualizations and illustrations for education, presentations, and understanding AI concepts.',
    shortDescription: 'Open-source ML visualization library',
    logo: 'https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg',
    website: 'https://github.com/dair-ai/ml-visuals',
    categoryId: 'ai-education',
    subcategoryIds: ['visualization-tools'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['All visualizations', 'Commercial use allowed', 'Community contributions', 'Regular updates']
        }
      ]
    },
    features: [
      'ML concept illustrations',
      'High-quality graphics',
      'Educational diagrams',
      'Presentation templates',
      'Open-source license',
      'Community contributions'
    ],
    limitations: [
      'Static images only',
      'Limited interactivity',
      'Requires design skills for customization',
      'Manual updates needed'
    ],
    rating: 4.6,
    reviewCount: 1200,
    trending: false,
    featured: false,
    integrations: ['Presentation software', 'Educational platforms', 'Social media', 'Documentation tools'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'ai-explainer',
    name: 'AI Explainer',
    slug: 'ai-explainer',
    description: 'Interactive educational platform with visual explanations of AI algorithms, machine learning concepts, and neural network architectures.',
    shortDescription: 'Interactive AI concept explanations',
    logo: 'https://images.pexels.com/photos/1181427/pexels-photo-1181427.jpeg',
    website: 'https://okai.brown.edu/static/index.html',
    categoryId: 'ai-education',
    subcategoryIds: ['visualization-tools'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['All explanations', 'Interactive demos', 'Educational content', 'No registration']
        }
      ]
    },
    features: [
      'Interactive AI explanations',
      'Visual algorithm demos',
      'Step-by-step tutorials',
      'Concept illustrations',
      'Educational exercises',
      'Progressive complexity'
    ],
    limitations: [
      'Academic project',
      'Limited scope',
      'Irregular updates',
      'Browser-based only'
    ],
    rating: 4.4,
    reviewCount: 850,
    trending: false,
    featured: false,
    integrations: ['Web browsers', 'Educational platforms', 'Research tools', 'Academic networks'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'google-scholar',
    name: 'Google Scholar',
    slug: 'google-scholar',
    description: 'Academic search engine for scholarly literature in AI and machine learning, providing access to research papers, citations, and academic resources.',
    shortDescription: 'Academic search for AI research',
    logo: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg',
    website: 'https://scholar.google.com/',
    categoryId: 'ai-education',
    subcategoryIds: ['research-papers'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Unlimited searches', 'Citation tracking', 'Author profiles', 'Alerts']
        }
      ]
    },
    features: [
      'Academic paper search',
      'Citation analysis',
      'Author profiles',
      'Research alerts',
      'Library links',
      'Related articles'
    ],
    limitations: [
      'Limited full-text access',
      'Quality varies',
      'No peer review indicators',
      'Paywall restrictions'
    ],
    rating: 4.5,
    reviewCount: 25000,
    trending: false,
    featured: true,
    integrations: ['University libraries', 'Citation managers', 'Research tools', 'Academic databases'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'semantic-scholar',
    name: 'Semantic Scholar',
    slug: 'semantic-scholar',
    description: 'AI-powered academic search engine that uses machine learning to understand research papers and provide intelligent recommendations.',
    shortDescription: 'AI-powered academic search',
    logo: 'https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg',
    website: 'https://www.semanticscholar.org/',
    categoryId: 'ai-education',
    subcategoryIds: ['research-papers'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['AI-powered search', 'Paper summaries', 'Citation analysis', 'Research feeds']
        }
      ]
    },
    features: [
      'AI-powered paper discovery',
      'Intelligent summaries',
      'Citation context',
      'Research recommendations',
      'Author networks',
      'Impact metrics'
    ],
    limitations: [
      'Limited to certain fields',
      'Beta features',
      'Dependent on paper availability',
      'Algorithm bias potential'
    ],
    rating: 4.6,
    reviewCount: 3400,
    trending: true,
    featured: false,
    integrations: ['Citation managers', 'Research tools', 'Academic databases', 'API access'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'connected-papers',
    name: 'Connected Papers',
    slug: 'connected-papers',
    description: 'Visual tool for exploring academic papers in AI/ML research, creating similarity graphs to discover related work and research trends.',
    shortDescription: 'Visual research paper exploration',
    logo: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg',
    website: 'https://www.connectedpapers.com/',
    categoryId: 'ai-education',
    subcategoryIds: ['research-papers'],
    pricing: {
      type: 'freemium',
      startingPrice: '$5/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 graphs per month', 'Basic features', 'Paper exploration', 'Community access']
        },
        {
          name: 'Personal',
          price: '$5/month',
          billingPeriod: 'monthly',
          features: ['Unlimited graphs', 'Advanced features', 'Export options', 'Priority support']
        }
      ]
    },
    features: [
      'Visual paper networks',
      'Similarity mapping',
      'Research trend analysis',
      'Citation exploration',
      'Interactive graphs',
      'Paper recommendations'
    ],
    limitations: [
      'Limited free usage',
      'Depends on paper database',
      'Academic focus only',
      'Internet required'
    ],
    rating: 4.7,
    reviewCount: 2100,
    trending: true,
    featured: false,
    integrations: ['Academic databases', 'Citation managers', 'Research tools', 'Export formats'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'research-rabbit',
    name: 'Research Rabbit',
    slug: 'research-rabbit',
    description: 'AI-powered research discovery platform that helps researchers find relevant papers, track research trends, and build knowledge graphs.',
    shortDescription: 'AI research discovery platform',
    logo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
    website: 'https://www.researchrabbit.ai/',
    categoryId: 'ai-education',
    subcategoryIds: ['research-papers'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Unlimited collections', 'Paper discovery', 'Collaboration tools', 'Research feeds']
        }
      ]
    },
    features: [
      'AI-powered discovery',
      'Research collections',
      'Collaboration tools',
      'Personalized feeds',
      'Citation networks',
      'Research timelines'
    ],
    limitations: [
      'Newer platform',
      'Limited paper database',
      'Beta features',
      'Academic focus'
    ],
    rating: 4.5,
    reviewCount: 1800,
    trending: true,
    featured: false,
    integrations: ['Zotero', 'Mendeley', 'Academic databases', 'Social platforms'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'ai-stack-overflow',
    name: 'AI Stack Overflow',
    slug: 'ai-stack-overflow',
    description: 'Stack Overflow\'s artificial intelligence and machine learning sections, providing Q&A community support for AI development and learning.',
    shortDescription: 'AI programming Q&A community',
    logo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    website: 'https://stackoverflow.com/questions/tagged/artificial-intelligence',
    categoryId: 'ai-education',
    subcategoryIds: ['ai-communities'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Question/answer access', 'Community voting', 'Reputation system', 'Tag following']
        }
      ]
    },
    features: [
      'AI programming Q&A',
      'Expert community',
      'Code solutions',
      'Reputation system',
      'Tag-based organization',
      'Search functionality'
    ],
    limitations: [
      'Quality varies',
      'Strict moderation',
      'Learning curve',
      'Technical focus only'
    ],
    rating: 4.4,
    reviewCount: 45000,
    trending: false,
    featured: true,
    integrations: ['Developer tools', 'IDEs', 'Documentation', 'Learning platforms'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'reddit-machinelearning',
    name: 'Reddit Machine Learning',
    slug: 'reddit-machinelearning',
    description: 'Reddit\'s machine learning community with discussions, research sharing, career advice, and educational resources for AI enthusiasts.',
    shortDescription: 'ML community discussions and resources',
    logo: 'https://images.pexels.com/photos/1181701/pexels-photo-1181701.jpeg',
    website: 'https://www.reddit.com/r/MachineLearning/',
    categoryId: 'ai-education',
    subcategoryIds: ['ai-communities'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Community access', 'Discussion participation', 'Resource sharing', 'Subreddit features']
        }
      ]
    },
    features: [
      'Research discussions',
      'Paper sharing',
      'Career advice',
      'Project showcases',
      'Weekly threads',
      'AMA sessions'
    ],
    limitations: [
      'Informal environment',
      'Quality varies',
      'Reddit dependency',
      'Moderation policies'
    ],
    rating: 4.3,
    reviewCount: 18500,
    trending: false,
    featured: false,
    integrations: ['Reddit platform', 'External links', 'Social sharing', 'Mobile apps'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'discord-ai',
    name: 'Discord AI Communities',
    slug: 'discord-ai',
    description: 'Various Discord servers focused on AI and machine learning education, providing real-time chat, study groups, and collaborative learning.',
    shortDescription: 'Real-time AI learning communities',
    logo: 'https://images.pexels.com/photos/1181708/pexels-photo-1181708.jpeg',
    website: 'https://discord.com/',
    categoryId: 'ai-education',
    subcategoryIds: ['ai-communities'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Server access', 'Real-time chat', 'Voice channels', 'File sharing']
        }
      ]
    },
    features: [
      'Real-time discussions',
      'Study groups',
      'Voice chat sessions',
      'Resource sharing',
      'Mentorship programs',
      'Project collaboration'
    ],
    limitations: [
      'Requires Discord account',
      'Server-dependent quality',
      'Time zone differences',
      'Moderation varies'
    ],
    rating: 4.2,
    reviewCount: 12800,
    trending: true,
    featured: false,
    integrations: ['Discord platform', 'Bots', 'Screen sharing', 'Mobile apps'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'ml-twitter',
    name: 'ML Twitter Community',
    slug: 'ml-twitter',
    description: 'Twitter\'s vibrant machine learning community where researchers, practitioners, and educators share insights, papers, and educational content.',
    shortDescription: 'ML social media community',
    logo: 'https://images.pexels.com/photos/1181715/pexels-photo-1181715.jpeg',
    website: 'https://twitter.com/hashtag/MachineLearning',
    categoryId: 'ai-education',
    subcategoryIds: ['ai-communities'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Community access', 'Content sharing', 'Following experts', 'Hashtag following']
        }
      ]
    },
    features: [
      'Expert insights',
      'Paper announcements',
      'Thread discussions',
      'Conference updates',
      'Career opportunities',
      'Educational resources'
    ],
    limitations: [
      'Information overload',
      'Platform dependency',
      'Character limits',
      'Algorithm-driven feed'
    ],
    rating: 4.1,
    reviewCount: 32000,
    trending: false,
    featured: false,
    integrations: ['Twitter platform', 'External links', 'Mobile apps', 'Social tools'],
    lastVerified: new Date('2025-05-30')
  },

  // Additional Presentation Tools
  {
    id: 'gamma-ai',
    name: 'Gamma',
    slug: 'gamma-ai',
    description: 'AI-powered presentation builder that creates beautiful slides, documents, and webpages from simple text prompts with advanced design capabilities.',
    shortDescription: 'AI-powered presentation and webpage builder',
    logo: 'https://images.pexels.com/photos/4050520/pexels-photo-4050520.jpeg',
    website: 'https://gamma.app',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited AI credits', 'Basic templates', 'Export to PDF', 'Basic sharing']
        },
        {
          name: 'Plus',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Unlimited AI credits', 'Premium templates', 'Custom branding', 'Advanced export options']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Advanced analytics', 'Custom domains', 'Priority support']
        }
      ]
    },
    features: [
      'One-click presentation generation',
      'Smart content suggestions',
      'Auto-generated layouts',
      'Responsive design',
      'Real-time collaboration',
      'Custom branding options'
    ],
    limitations: [
      'Limited free credits',
      'Internet required',
      'Template restrictions on free tier'
    ],
    rating: 4.7,
    reviewCount: 1850,
    trending: true,
    featured: true,
    integrations: ['Google Drive', 'Figma', 'Notion', 'PowerPoint'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'beautiful-ai',
    name: 'Beautiful.AI',
    slug: 'beautiful-ai',
    description: 'Intelligent presentation software that automatically designs slides using AI-powered layout engine with smart templates and data visualization.',
    shortDescription: 'Smart presentation design platform',
    logo: 'https://images.pexels.com/photos/7947720/pexels-photo-7947720.jpeg',
    website: 'https://www.beautiful.ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'subscription',
      startingPrice: '$12/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Pro',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['Smart templates', 'Auto-arrange layouts', 'Team sharing', 'Export options']
        },
        {
          name: 'Team',
          price: '$40/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Brand management', 'Advanced analytics', 'Admin controls']
        }
      ]
    },
    features: [
      'Smart template engine',
      'Auto-arrange layouts',
      'Data visualization tools',
      'Brand consistency enforcement',
      'Real-time collaboration',
      'Presentation analytics'
    ],
    limitations: [
      'No free tier',
      'Learning curve for templates',
      'Limited customization options'
    ],
    rating: 4.5,
    reviewCount: 980,
    trending: false,
    featured: false,
    integrations: ['PowerPoint', 'Google Slides', 'Dropbox', 'Adobe Creative Suite'],
    lastVerified: new Date('2025-05-28')
  },
  {
    id: 'pitch-avatar',
    name: 'Pitch Avatar',
    slug: 'pitch-avatar',
    description: 'AI-powered platform that creates interactive video presentations with virtual avatars delivering your content in multiple languages.',
    shortDescription: 'AI avatar presentation creator',
    logo: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg',
    website: 'https://pitchavatar.com',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$29/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Starter',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Basic avatars', '5 presentations/month', 'Standard voices', 'HD export']
        },
        {
          name: 'Professional',
          price: '$79/month',
          billingPeriod: 'monthly',
          features: ['Premium avatars', 'Unlimited presentations', 'Custom voices', '4K export']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Custom avatars', 'White-label solution', 'API access', 'Dedicated support']
        }
      ]
    },
    features: [
      'AI avatar presenters',
      'Multi-language support',
      'Custom voice synthesis',
      'Interactive elements',
      'Brand customization',
      'Analytics tracking'
    ],
    limitations: [
      'No free tier',
      'Rendering time required',
      'Limited avatar customization'
    ],
    rating: 4.4,
    reviewCount: 420,
    trending: true,
    featured: false,
    integrations: ['PowerPoint', 'Keynote', 'Zoom', 'Teams'],
    lastVerified: new Date('2025-05-29')
  },
  {
    id: 'presentations-ai',
    name: 'Presentations.AI',
    slug: 'presentations-ai',
    description: 'Advanced AI presentation generator that creates complete slide decks from topic inputs with intelligent content structuring and design optimization.',
    shortDescription: 'Complete AI presentation generator',
    logo: 'https://images.pexels.com/photos/4050475/pexels-photo-4050475.jpeg',
    website: 'https://presentations.ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$25/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 presentations/month', 'Basic templates', 'Standard export', 'Community support']
        },
        {
          name: 'Pro',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Premium templates', 'Advanced export', 'Priority support']
        },
        {
          name: 'Business',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['Team features', 'Custom branding', 'API access', 'Advanced analytics']
        }
      ]
    },
    features: [
      'Topic-to-presentation generation',
      'Intelligent content structuring',
      'Auto-generated speaker notes',
      'Multiple design themes',
      'Citation management',
      'Export to multiple formats'
    ],
    limitations: [
      'Limited free generations',
      'Requires clear topic definition',
      'May need manual editing'
    ],
    rating: 4.6,
    reviewCount: 750,
    trending: true,
    featured: false,
    integrations: ['PowerPoint', 'Google Slides', 'PDF export', 'Web sharing'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'decktopus-ai',
    name: 'Decktopus AI',
    slug: 'decktopus-ai',
    description: 'AI-powered presentation maker that creates professional slides with smart content suggestions, design automation, and interactive elements.',
    shortDescription: 'Smart presentation automation',
    logo: 'https://images.pexels.com/photos/7947866/pexels-photo-7947866.jpeg',
    website: 'https://www.decktopus.com',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$9.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 AI presentations', 'Basic templates', 'Decktopus branding', 'Standard support']
        },
        {
          name: 'Pro',
          price: '$9.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Remove branding', 'Premium templates', 'Advanced features']
        },
        {
          name: 'Business',
          price: '$19.99/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Custom branding', 'Analytics', 'Priority support']
        }
      ]
    },
    features: [
      'AI content generation',
      'Smart design suggestions',
      'Interactive slide elements',
      'Voice-over integration',
      'Real-time feedback',
      'Mobile optimization'
    ],
    limitations: [
      'Branding on free tier',
      'Limited free presentations',
      'Template restrictions'
    ],
    rating: 4.3,
    reviewCount: 1200,
    trending: false,
    featured: false,
    integrations: ['PowerPoint', 'PDF export', 'Social media', 'Webhooks'],
    lastVerified: new Date('2025-05-27')
  },
  {
    id: 'slidebean-ai',
    name: 'Slidebean',
    slug: 'slidebean-ai',
    description: 'AI-powered presentation platform focused on startup pitch decks with automated design, content optimization, and investor-ready templates.',
    shortDescription: 'AI pitch deck creator',
    logo: 'https://images.pexels.com/photos/4050490/pexels-photo-4050490.jpeg',
    website: 'https://slidebean.com',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 presentations', 'Basic templates', 'Slidebean branding', 'Standard export']
        },
        {
          name: 'Premium',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Premium templates', 'Remove branding', 'Analytics']
        },
        {
          name: 'Team',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Advanced analytics', 'Custom templates', 'Priority support']
        }
      ]
    },
    features: [
      'Startup-focused templates',
      'Automated slide design',
      'Pitch deck optimization',
      'Investor presentation tools',
      'Financial slide automation',
      'Presentation analytics'
    ],
    limitations: [
      'Startup/business focus',
      'Limited free presentations',
      'Template dependency'
    ],
    rating: 4.4,
    reviewCount: 850,
    trending: false,
    featured: false,
    integrations: ['Google Drive', 'Dropbox', 'PowerPoint', 'Analytics tools'],
    lastVerified: new Date('2025-05-26')
  },
  {
    id: 'tome-presentations',
    name: 'Tome Presentations',
    slug: 'tome-presentations',
    description: 'AI-native presentation platform that creates immersive, interactive presentations with multimedia content generation and storytelling focus.',
    shortDescription: 'AI multimedia presentation creator',
    logo: 'https://images.pexels.com/photos/4050445/pexels-photo-4050445.jpeg',
    website: 'https://tome.app/presentations',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$16/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['500 AI credits', 'Basic sharing', 'Core features', 'Community templates']
        },
        {
          name: 'Pro',
          price: '$16/month',
          billingPeriod: 'monthly',
          features: ['Unlimited AI credits', 'Custom branding', 'Advanced sharing', 'Premium features']
        },
        {
          name: 'Business',
          price: '$40/month',
          billingPeriod: 'monthly',
          features: ['Team workspace', 'Admin controls', 'Advanced analytics', 'Priority support']
        }
      ]
    },
    features: [
      'AI content generation',
      'Interactive multimedia elements',
      'Immersive storytelling',
      'Real-time collaboration',
      'Custom branding',
      'Advanced sharing options'
    ],
    limitations: [
      'Credit-based system',
      'Learning curve',
      'Internet dependency'
    ],
    rating: 4.5,
    reviewCount: 1100,
    trending: true,
    featured: false,
    integrations: ['Figma', 'Notion', 'Slack', 'Web embeds'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'designrr-presentations',
    name: 'Designrr Presentations',
    slug: 'designrr-presentations',
    description: 'AI-enhanced presentation tool that automatically converts content from various sources into professional slide presentations with smart formatting.',
    shortDescription: 'Content-to-presentation converter',
    logo: 'https://images.pexels.com/photos/4050460/pexels-photo-4050460.jpeg',
    website: 'https://designrr.io/presentations',
    categoryId: 'presentation-tools',
    subcategoryIds: ['presentation-enhancement'],
    pricing: {
      type: 'subscription',
      startingPrice: '$29/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Personal',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Content conversion', 'Basic templates', 'Standard export', 'Email support']
        },
        {
          name: 'Professional',
          price: '$59/month',
          billingPeriod: 'monthly',
          features: ['Advanced conversion', 'Premium templates', 'Team features', 'Priority support']
        },
        {
          name: 'Agency',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['White-label option', 'Client management', 'Custom branding', 'Dedicated support']
        }
      ]
    },
    features: [
      'Multi-source content import',
      'Automated slide formatting',
      'Smart content extraction',
      'Template customization',
      'Batch processing',
      'Multiple export formats'
    ],
    limitations: [
      'No free tier',
      'Limited source types',
      'Requires content preparation'
    ],
    rating: 4.2,
    reviewCount: 380,
    trending: false,
    featured: false,
    integrations: ['Google Docs', 'WordPress', 'PDF import', 'Cloud storage'],
    lastVerified: new Date('2025-05-25')
  },
  {
    id: 'slides-ai',
    name: 'Slides AI',
    slug: 'slides-ai',
    description: 'Google Slides add-on that uses AI to automatically generate presentation content, design slides, and optimize layouts within your existing workflow.',
    shortDescription: 'Google Slides AI add-on',
    logo: 'https://images.pexels.com/photos/4050520/pexels-photo-4050520.jpeg',
    website: 'https://workspace.google.com/marketplace/app/slides_ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 AI generations/month', 'Basic templates', 'Standard support', 'Google Slides integration']
        },
        {
          name: 'Pro',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Unlimited AI generations', 'Premium templates', 'Advanced features', 'Priority support']
        }
      ]
    },
    features: [
      'Native Google Slides integration',
      'AI content generation',
      'Smart design suggestions',
      'Template automation',
      'Collaborative editing',
      'Cloud synchronization'
    ],
    limitations: [
      'Google Slides only',
      'Limited free generations',
      'Requires Google account'
    ],
    rating: 4.3,
    reviewCount: 920,
    trending: false,
    featured: false,
    integrations: ['Google Slides', 'Google Workspace', 'Google Drive', 'Google Fonts'],
    lastVerified: new Date('2025-05-28')
  },
  {
    id: 'sendsteps-ai',
    name: 'SendSteps AI',
    slug: 'sendsteps-ai',
    description: 'Interactive presentation platform with AI-powered content generation, audience engagement tools, and real-time feedback collection.',
    shortDescription: 'Interactive AI presentation platform',
    logo: 'https://images.pexels.com/photos/7947720/pexels-photo-7947720.jpeg',
    website: 'https://www.sendsteps.com',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$8.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['2 presentations/month', 'Basic interactivity', 'Standard templates', 'Community support']
        },
        {
          name: 'Pro',
          price: '$8.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Advanced interactivity', 'Custom branding', 'Analytics']
        },
        {
          name: 'Business',
          price: '$24.99/month',
          billingPeriod: 'monthly',
          features: ['Team features', 'White-label option', 'Advanced analytics', 'Priority support']
        }
      ]
    },
    features: [
      'Interactive audience engagement',
      'AI content generation',
      'Real-time polls and quizzes',
      'Audience response collection',
      'Live presentation mode',
      'Advanced analytics'
    ],
    limitations: [
      'Limited free presentations',
      'Internet required for interactivity',
      'Learning curve for advanced features'
    ],
    rating: 4.4,
    reviewCount: 650,
    trending: true,
    featured: false,
    integrations: ['PowerPoint', 'Zoom', 'Teams', 'Webex'],
    lastVerified: new Date('2025-05-29')
  },
  {
    id: 'plus-ai-google-slides',
    name: 'Plus AI for Google Slides',
    slug: 'plus-ai-google-slides',
    description: 'Advanced AI add-on for Google Slides that creates presentations from prompts, rewrites content, and enhances existing slides with intelligent suggestions.',
    shortDescription: 'Advanced Google Slides AI enhancement',
    logo: 'https://images.pexels.com/photos/4050475/pexels-photo-4050475.jpeg',
    website: 'https://www.plusdocs.com/plus-ai-for-google-slides',
    categoryId: 'presentation-tools',
    subcategoryIds: ['presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$15/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 AI generations/month', 'Basic features', 'Standard templates', 'Community support']
        },
        {
          name: 'Pro',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['100 AI generations/month', 'Advanced features', 'Custom templates', 'Priority support']
        },
        {
          name: 'Premium',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['Unlimited generations', 'Team features', 'Advanced customization', 'Dedicated support']
        }
      ]
    },
    features: [
      'Advanced AI content generation',
      'Intelligent slide enhancement',
      'Content rewriting capabilities',
      'Smart formatting suggestions',
      'Template customization',
      'Collaborative features'
    ],
    limitations: [
      'Google Slides dependency',
      'Monthly generation limits',
      'Requires Google Workspace'
    ],
    rating: 4.5,
    reviewCount: 780,
    trending: true,
    featured: false,
    integrations: ['Google Slides', 'Google Workspace', 'Google Drive', 'Third-party templates'],
    lastVerified: new Date('2025-05-30')
  },
  {
    id: 'prezo-ai',
    name: 'Prezo AI',
    slug: 'prezo-ai',
    description: 'AI-powered presentation assistant that helps create, edit, and optimize presentations with smart content suggestions and design automation.',
    shortDescription: 'Complete AI presentation assistant',
    logo: 'https://images.pexels.com/photos/4050490/pexels-photo-4050490.jpeg',
    website: 'https://prezo.ai',
    categoryId: 'presentation-tools',
    subcategoryIds: ['slide-generation', 'presentation-enhancement'],
    pricing: {
      type: 'freemium',
      startingPrice: '$12/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 presentations/month', 'Basic AI features', 'Standard templates', 'Basic export']
        },
        {
          name: 'Starter',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['15 presentations/month', 'Advanced AI', 'Premium templates', 'HD export']
        },
        {
          name: 'Pro',
          price: '$24/month',
          billingPeriod: 'monthly',
          features: ['Unlimited presentations', 'Team features', 'Custom branding', 'Analytics']
        }
      ]
    },
    features: [
      'Comprehensive AI assistance',
      'Multi-format support',
      'Smart content optimization',
      'Design automation',
      'Collaboration tools',
      'Performance analytics'
    ],
    limitations: [
      'Monthly presentation limits',
      'Template restrictions on free tier',
      'Learning curve for advanced features'
    ],
    rating: 4.3,
    reviewCount: 540,
    trending: false,
    featured: false,
    integrations: ['PowerPoint', 'Google Slides', 'Keynote', 'PDF export'],
    lastVerified: new Date('2025-05-27')
  },

  // Diagramming Tools
  {
    id: 'miro-ai',
    name: 'Miro AI',
    slug: 'miro-ai',
    description: 'Miro AI enhances collaborative whiteboarding with intelligent features like smart diagram generation, auto-organizing sticky notes, mind map creation, and AI-powered insights for brainstorming sessions.',
    shortDescription: 'AI-powered collaborative whiteboard platform',
    logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    website: 'https://miro.com/ai/',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['mind-maps', 'flowcharts', 'collaborative-diagramming'],
    pricing: {
      type: 'freemium',
      startingPrice: '$8/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 editable boards', 'Basic AI features', 'Core templates', 'Basic collaboration']
        },
        {
          name: 'Starter',
          price: '$8/month',
          billingPeriod: 'monthly',
          features: ['Unlimited personal boards', 'Advanced AI features', 'Premium templates', 'Team collaboration']
        },
        {
          name: 'Business',
          price: '$16/month',
          billingPeriod: 'monthly',
          features: ['Unlimited team boards', 'AI insights & analytics', 'Advanced integrations', 'Admin controls']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Enterprise security', 'Custom AI models', 'Advanced analytics', 'Dedicated support']
        }
      ]
    },
    features: [
      'AI-powered mind mapping',
      'Smart sticky note organization',
      'Automated flowchart generation',
      'Real-time collaboration',
      'AI brainstorming assistance',
      'Template recommendations',
      'Data visualization tools',
      'Integration ecosystem'
    ],
    limitations: [
      'Limited boards on free plan',
      'Advanced AI features require paid plans',
      'Learning curve for complex features',
      'Internet connectivity required'
    ],
    rating: 4.6,
    reviewCount: 3200,
    trending: true,
    featured: true,
    integrations: ['Slack', 'Microsoft Teams', 'Jira', 'Confluence', 'Google Workspace', 'Figma'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'lucidchart-ai',
    name: 'Lucidchart AI',
    slug: 'lucidchart-ai',
    description: 'Lucidchart AI revolutionizes diagramming with intelligent flowchart generation, smart shape suggestions, auto-layout optimization, and collaborative visual planning for technical documentation.',
    shortDescription: 'Professional AI diagramming and flowchart tool',
    logo: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
    website: 'https://lucid.co/lucidchart-ai',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['flowcharts', 'technical-diagrams', 'process-mapping'],
    pricing: {
      type: 'subscription',
      startingPrice: '$7.95/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 documents', 'Basic templates', 'Limited AI features', '100 professional templates']
        },
        {
          name: 'Individual',
          price: '$7.95/month',
          billingPeriod: 'monthly',
          features: ['Unlimited documents', 'Advanced AI features', 'Integrations', 'Data linking']
        },
        {
          name: 'Team',
          price: '$9/user/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Advanced shapes', 'Version history', 'Team management']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Advanced security', 'Custom integrations', 'Dedicated support', 'Enterprise controls']
        }
      ]
    },
    features: [
      'AI-powered flowchart generation',
      'Smart shape suggestions',
      'Auto-layout optimization',
      'Technical diagram templates',
      'Data-linked diagrams',
      'Real-time collaboration',
      'Version control',
      'Cloud synchronization'
    ],
    limitations: [
      'Document limits on free plan',
      'Advanced features require subscription',
      'Complex diagrams may need manual adjustment',
      'Learning curve for technical features'
    ],
    rating: 4.5,
    reviewCount: 2800,
    trending: true,
    featured: false,
    integrations: ['Microsoft Office', 'Google Workspace', 'Slack', 'Confluence', 'Jira', 'Salesforce'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'draw-io-ai',
    name: 'Draw.io AI',
    slug: 'draw-io-ai',
    description: 'Draw.io (now diagrams.net) enhanced with AI capabilities for automatic diagram generation, smart layout suggestions, and intelligent shape recognition for technical and business diagrams.',
    shortDescription: 'Free AI-enhanced diagramming tool',
    logo: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg',
    website: 'https://app.diagrams.net/',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['flowcharts', 'technical-diagrams', 'network-diagrams'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Unlimited diagrams', 'All diagram types', 'Cloud storage options', 'Export formats']
        }
      ]
    },
    features: [
      'AI diagram generation',
      'Smart layout algorithms',
      'Extensive shape libraries',
      'Multiple export formats',
      'Cloud storage integration',
      'Collaborative editing',
      'Version history',
      'Open source flexibility'
    ],
    limitations: [
      'Limited AI features compared to paid tools',
      'Interface can be overwhelming',
      'Advanced AI requires browser extensions',
      'Less polished than premium alternatives'
    ],
    rating: 4.3,
    reviewCount: 1900,
    trending: false,
    featured: false,
    integrations: ['Google Drive', 'OneDrive', 'Dropbox', 'Confluence', 'Jira', 'GitHub'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'whimsical-ai',
    name: 'Whimsical AI',
    slug: 'whimsical-ai',
    description: 'Whimsical AI combines beautiful design with intelligent features for creating flowcharts, wireframes, mind maps, and sticky notes with AI-powered content generation and layout suggestions.',
    shortDescription: 'Beautiful AI-powered visual workspace',
    logo: 'https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg',
    website: 'https://whimsical.com/ai',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['mind-maps', 'wireframes', 'flowcharts'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['4 boards', 'Basic AI features', 'Core templates', '1,000 blocks']
        },
        {
          name: 'Pro',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Unlimited boards', 'Advanced AI features', 'Premium templates', 'Unlimited blocks']
        },
        {
          name: 'Org',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Team features', 'Advanced permissions', 'Priority support', 'Admin controls']
        }
      ]
    },
    features: [
      'AI content generation',
      'Smart wireframe creation',
      'Beautiful mind mapping',
      'Sticky note organization',
      'Template library',
      'Real-time collaboration',
      'Export capabilities',
      'Design-focused interface'
    ],
    limitations: [
      'Limited boards on free plan',
      'Fewer integrations than competitors',
      'Advanced features require Pro plan',
      'Learning curve for complex diagrams'
    ],
    rating: 4.4,
    reviewCount: 1600,
    trending: true,
    featured: false,
    integrations: ['Slack', 'Figma', 'Notion', 'GitHub', 'Linear'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'visio-ai',
    name: 'Microsoft Visio AI',
    slug: 'visio-ai',
    description: 'Microsoft Visio enhanced with AI capabilities for intelligent diagram creation, data visualization, process automation, and smart shape suggestions for enterprise diagramming needs.',
    shortDescription: 'Enterprise AI diagramming solution',
    logo: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg',
    website: 'https://www.microsoft.com/en-us/microsoft-365/visio/flowchart-software',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['flowcharts', 'technical-diagrams', 'process-mapping'],
    pricing: {
      type: 'subscription',
      startingPrice: '$5/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Visio Plan 1',
          price: '$5/month',
          billingPeriod: 'monthly',
          features: ['Web and mobile apps', 'Basic AI features', '2GB OneDrive storage', 'Basic templates']
        },
        {
          name: 'Visio Plan 2',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['Desktop + web apps', 'Advanced AI features', 'Data connectivity', 'Advanced templates']
        }
      ]
    },
    features: [
      'AI-powered diagram suggestions',
      'Data-connected diagrams',
      'Process automation',
      'Enterprise templates',
      'Microsoft 365 integration',
      'Collaborative editing',
      'Version control',
      'Advanced security'
    ],
    limitations: [
      'No free tier',
      'Microsoft ecosystem dependency',
      'Complex pricing structure',
      'Learning curve for advanced features'
    ],
    rating: 4.2,
    reviewCount: 2200,
    trending: false,
    featured: false,
    integrations: ['Microsoft 365', 'SharePoint', 'Teams', 'Power BI', 'Azure', 'Excel'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'mindmeister-ai',
    name: 'MindMeister AI',
    slug: 'mindmeister-ai',
    description: 'MindMeister AI transforms mind mapping with intelligent content suggestions, automated branch creation, smart formatting, and AI-powered brainstorming for creative thinking and project planning.',
    shortDescription: 'AI-powered mind mapping tool',
    logo: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    website: 'https://www.mindmeister.com/ai',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['mind-maps', 'brainstorming-tools'],
    pricing: {
      type: 'freemium',
      startingPrice: '$4.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 mind maps', 'Basic AI features', 'Core templates', 'Export options']
        },
        {
          name: 'Personal',
          price: '$4.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited mind maps', 'Advanced AI features', 'Premium templates', 'History & backup']
        },
        {
          name: 'Pro',
          price: '$8.25/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Advanced export', 'Integrations', 'Priority support']
        },
        {
          name: 'Business',
          price: '$12.49/month',
          billingPeriod: 'monthly',
          features: ['Advanced admin', 'Custom branding', 'Advanced security', 'Team analytics']
        }
      ]
    },
    features: [
      'AI brainstorming assistance',
      'Smart content suggestions',
      'Automated formatting',
      'Collaborative mind mapping',
      'Template library',
      'Export to multiple formats',
      'Integration capabilities',
      'Mobile synchronization'
    ],
    limitations: [
      'Limited maps on free plan',
      'Advanced AI requires paid plans',
      'Some features need internet connection',
      'Learning curve for team features'
    ],
    rating: 4.3,
    reviewCount: 1800,
    trending: true,
    featured: false,
    integrations: ['Microsoft Teams', 'G Suite', 'Dropbox', 'MeisterTask', 'Slack'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'creately-ai',
    name: 'Creately AI',
    slug: 'creately-ai',
    description: 'Creately AI offers intelligent diagramming with automated flowchart generation, smart shape recognition, collaborative visual planning, and AI-powered insights for business process optimization.',
    shortDescription: 'Intelligent visual collaboration platform',
    logo: 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg',
    website: 'https://creately.com/ai',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['flowcharts', 'process-mapping', 'collaborative-diagramming'],
    pricing: {
      type: 'freemium',
      startingPrice: '$5/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 documents', 'Basic AI features', 'Core templates', '3 collaborators']
        },
        {
          name: 'Starter',
          price: '$5/month',
          billingPeriod: 'monthly',
          features: ['Unlimited personal docs', 'Advanced AI features', 'Premium templates', 'Unlimited collaborators']
        },
        {
          name: 'Business',
          price: '$89/month',
          billingPeriod: 'monthly',
          features: ['Team workspace', 'Advanced collaboration', 'Data connectivity', 'Priority support']
        }
      ]
    },
    features: [
      'AI diagram generation',
      'Smart process mapping',
      'Collaborative workspaces',
      'Template automation',
      'Data visualization',
      'Real-time collaboration',
      'Version control',
      'Export capabilities'
    ],
    limitations: [
      'Document limits on free plan',
      'Steep pricing jump to Business tier',
      'Learning curve for advanced features',
      'Limited offline capabilities'
    ],
    rating: 4.1,
    reviewCount: 1200,
    trending: false,
    featured: false,
    integrations: ['Slack', 'Microsoft Teams', 'Google Workspace', 'Confluence', 'Jira'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'milanote-ai',
    name: 'Milanote AI',
    slug: 'milanote-ai',
    description: 'Milanote AI enhances creative project organization with intelligent mood board creation, smart content curation, automated layout suggestions, and AI-powered creative insights for designers and teams.',
    shortDescription: 'AI-powered creative mood board tool',
    logo: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg',
    website: 'https://milanote.com/ai',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['mood-boards', 'creative-planning'],
    pricing: {
      type: 'freemium',
      startingPrice: '$9.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['100 notes/images/links', 'Basic AI features', '10 boards', 'File upload (100MB)']
        },
        {
          name: 'Pro',
          price: '$9.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited notes', 'Advanced AI features', 'Unlimited boards', 'File upload (unlimited)']
        }
      ]
    },
    features: [
      'AI mood board generation',
      'Smart content curation',
      'Creative project organization',
      'Collaborative boards',
      'Template library',
      'File management',
      'Mobile synchronization',
      'Export capabilities'
    ],
    limitations: [
      'Limited storage on free plan',
      'Focused on creative use cases',
      'Fewer technical diagram features',
      'Learning curve for organization'
    ],
    rating: 4.2,
    reviewCount: 950,
    trending: false,
    featured: false,
    integrations: ['Photoshop', 'Sketch', 'Figma', 'InVision', 'Dropbox'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'xmind-ai',
    name: 'XMind AI',
    slug: 'xmind-ai',
    description: 'XMind AI revolutionizes mind mapping with intelligent content generation, automated structure creation, smart formatting, and AI-powered brainstorming for enhanced productivity and creativity.',
    shortDescription: 'Advanced AI mind mapping software',
    logo: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    website: 'https://www.xmind.net/ai',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['mind-maps', 'brainstorming-tools'],
    pricing: {
      type: 'freemium',
      startingPrice: '$59.99/year',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Core mind mapping', 'Basic AI features', 'Local storage', 'Basic export']
        },
        {
          name: 'Pro',
          price: '$59.99/year',
          billingPeriod: 'yearly',
          features: ['Advanced AI features', 'Cloud sync', 'Premium themes', 'Advanced export']
        }
      ]
    },
    features: [
      'AI-powered mind mapping',
      'Smart content suggestions',
      'Multiple map structures',
      'Rich formatting options',
      'Presentation mode',
      'Cloud synchronization',
      'Team collaboration',
      'Advanced export options'
    ],
    limitations: [
      'Limited AI features on free plan',
      'Annual subscription model',
      'Learning curve for advanced features',
      'Limited real-time collaboration'
    ],
    rating: 4.0,
    reviewCount: 1400,
    trending: false,
    featured: false,
    integrations: ['Office 365', 'Google Workspace', 'Evernote', 'GitHub'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'conceptdraw-ai',
    name: 'ConceptDraw AI',
    slug: 'conceptdraw-ai',
    description: 'ConceptDraw AI provides professional diagramming with intelligent automation, extensive template libraries, smart shape suggestions, and AI-powered business process modeling for enterprise users.',
    shortDescription: 'Professional AI business diagramming suite',
    logo: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',
    website: 'https://www.conceptdraw.com/ai',
    categoryId: 'diagramming-tools',
    subcategoryIds: ['flowcharts', 'technical-diagrams', 'business-process-modeling'],
    pricing: {
      type: 'subscription',
      startingPrice: '$199/year',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Standard',
          price: '$199/year',
          billingPeriod: 'yearly',
          features: ['Core diagramming', 'Basic AI features', 'Standard templates', 'Email support']
        },
        {
          name: 'Professional',
          price: '$499/year',
          billingPeriod: 'yearly',
          features: ['Advanced AI features', 'Premium templates', 'Data connectivity', 'Priority support']
        }
      ]
    },
    features: [
      'AI diagram automation',
      'Extensive template library',
      'Business process modeling',
      'Data visualization',
      'Multi-platform support',
      'Export capabilities',
      'Professional templates',
      'Technical documentation'
    ],
    limitations: [
      'No free tier',
      'Higher cost than competitors',
      'Complex interface',
      'Learning curve for beginners'
    ],
    rating: 3.9,
    reviewCount: 800,
    trending: false,
    featured: false,
    integrations: ['Microsoft Office', 'SharePoint', 'Confluence', 'Dropbox'],
    lastVerified: new Date('2025-05-31')
  },
  {
    id: 'alteryx',
    name: 'Alteryx',
    slug: 'alteryx',
    description: 'Alteryx is an enterprise-grade data analytics platform that combines data preparation, advanced analytics, and machine learning capabilities. It provides a visual workflow designer that enables users to blend data from multiple sources, perform complex analytics, and deploy predictive models without extensive coding.',
    shortDescription: 'Enterprise data analytics and machine learning platform',
    logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    website: 'https://www.alteryx.com',
    categoryId: 'data-analysis',
    subcategoryIds: ['data-visualization', 'predictive-analysis'],
    pricing: {
      type: 'paid',
      startingPrice: '$5,195/year',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Designer',
          price: '$5,195/year',
          billingPeriod: 'yearly',
          features: ['Data preparation', 'Basic analytics', 'Visual workflow', '1 user license']
        },
        {
          name: 'Server',
          price: '$25,000+/year',
          billingPeriod: 'yearly',
          features: ['Enterprise deployment', 'Collaboration', 'Governance', 'Multiple users']
        },
        {
          name: 'Intelligence Suite',
          price: 'Custom pricing',
          billingPeriod: 'yearly',
          features: ['Advanced ML', 'Auto ML', 'Data science collaboration', 'Enterprise features']
        }
      ]
    },
    features: [
      'Visual data preparation',
      'Advanced analytics workflows',
      'Machine learning automation',
      'Data blending from 100+ sources',
      'Predictive modeling',
      'Spatial analytics',
      'Text mining capabilities',
      'Enterprise deployment options'
    ],
    limitations: [
      'High cost for small teams',
      'Steep learning curve',
      'Resource intensive',
      'Limited free options'
    ],
    rating: 4.3,
    reviewCount: 1200,
    trending: false,
    featured: true,
    integrations: ['Snowflake', 'AWS', 'Azure', 'Tableau', 'Power BI', 'Salesforce'],
    lastVerified: new Date('2025-01-15')
  },
  {
    id: 'hex',
    name: 'Hex',
    slug: 'hex',
    description: 'Hex is a modern collaborative data workspace that combines the power of notebooks, SQL, and no-code tools. It enables data teams to work together on analysis, visualization, and machine learning projects with features like version control, commenting, and real-time collaboration.',
    shortDescription: 'Collaborative data workspace with notebooks and SQL',
    logo: 'https://images.pexels.com/photos/11035364/pexels-photo-11035364.jpeg',
    website: 'https://hex.tech',
    categoryId: 'data-analysis',
    subcategoryIds: ['data-visualization', 'predictive-analysis'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Community',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['2 editors', 'Unlimited viewers', 'Basic integrations', 'Public projects']
        },
        {
          name: 'Team',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Unlimited editors', 'Private projects', 'Advanced integrations', 'Version control']
        },
        {
          name: 'Organization',
          price: '$60/month',
          billingPeriod: 'monthly',
          features: ['Enterprise security', 'SSO', 'Advanced governance', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: 'Custom pricing',
          billingPeriod: 'yearly',
          features: ['On-premise deployment', 'Custom integrations', 'Dedicated support', 'SLA']
        }
      ]
    },
    features: [
      'Interactive notebooks',
      'SQL editor with autocomplete',
      'Real-time collaboration',
      'Version control',
      'Data visualization library',
      'Python and R support',
      'Automated reporting',
      'API integrations'
    ],
    limitations: [
      'Limited offline capabilities',
      'Learning curve for non-technical users',
      'Performance with very large datasets',
      'Limited customization in free tier'
    ],
    rating: 4.6,
    reviewCount: 890,
    trending: true,
    featured: true,
    integrations: ['Snowflake', 'BigQuery', 'Redshift', 'PostgreSQL', 'dbt', 'GitHub'],
    lastVerified: new Date('2025-01-15')
  },
  {
    id: 'mode',
    name: 'Mode',
    slug: 'mode',
    description: 'Mode is a collaborative analytics platform that combines SQL, Python, and R in a single workspace. It enables data teams to query databases, build visualizations, and share insights through interactive reports and dashboards with enterprise-grade security and governance.',
    shortDescription: 'Collaborative analytics platform with SQL, Python, and R',
    logo: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg',
    website: 'https://mode.com',
    categoryId: 'data-analysis',
    subcategoryIds: ['data-visualization', 'predictive-analysis'],
    pricing: {
      type: 'freemium',
      startingPrice: '$35/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Studio',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 editors', 'Unlimited viewers', 'Basic SQL', 'Public reports']
        },
        {
          name: 'Business',
          price: '$35/month',
          billingPeriod: 'monthly',
          features: ['Unlimited editors', 'Private reports', 'Python/R support', 'API access']
        },
        {
          name: 'Enterprise',
          price: '$80/month',
          billingPeriod: 'monthly',
          features: ['Advanced security', 'SSO', 'Custom branding', 'Priority support']
        },
        {
          name: 'Data Platform',
          price: 'Custom pricing',
          billingPeriod: 'yearly',
          features: ['Data warehouse', 'ETL pipelines', 'Advanced governance', 'Dedicated support']
        }
      ]
    },
    features: [
      'SQL query editor',
      'Python and R notebooks',
      'Interactive visualizations',
      'Collaborative workspace',
      'Automated reports',
      'Dashboard creation',
      'Data governance',
      'Enterprise security'
    ],
    limitations: [
      'Limited free tier features',
      'Complex pricing structure',
      'Performance with large datasets',
      'Learning curve for beginners'
    ],
    rating: 4.4,
    reviewCount: 950,
    trending: false,
    featured: true,
    integrations: ['Snowflake', 'BigQuery', 'Redshift', 'MySQL', 'PostgreSQL', 'Slack'],
    lastVerified: new Date('2025-01-15')
  },
  {
    id: 'obviously-ai',
    name: 'Obviously AI',
    slug: 'obviously-ai',
    description: 'Obviously AI is a no-code machine learning platform that enables anyone to build, deploy, and monitor predictive models without programming knowledge. It automates the entire ML pipeline from data preprocessing to model deployment, making advanced analytics accessible to business users.',
    shortDescription: 'No-code machine learning platform for predictive analytics',
    logo: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg',
    website: 'https://www.obviously.ai',
    categoryId: 'data-analysis',
    subcategoryIds: ['predictive-analysis'],
    pricing: {
      type: 'freemium',
      startingPrice: '$75/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['1 model', '1,000 predictions/month', 'Basic algorithms', 'Email support']
        },
        {
          name: 'Starter',
          price: '$75/month',
          billingPeriod: 'monthly',
          features: ['5 models', '10,000 predictions/month', 'All algorithms', 'API access']
        },
        {
          name: 'Professional',
          price: '$200/month',
          billingPeriod: 'monthly',
          features: ['25 models', '100,000 predictions/month', 'Advanced features', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: 'Custom pricing',
          billingPeriod: 'yearly',
          features: ['Unlimited models', 'Unlimited predictions', 'On-premise option', 'Dedicated support']
        }
      ]
    },
    features: [
      'No-code model building',
      'Automated feature engineering',
      'Multiple ML algorithms',
      'Real-time predictions',
      'Model monitoring',
      'API deployment',
      'Data visualization',
      'Explainable AI'
    ],
    limitations: [
      'Limited customization',
      'No code export',
      'Performance with complex models',
      'Limited data preprocessing options'
    ],
    rating: 4.2,
    reviewCount: 680,
    trending: true,
    featured: false,
    integrations: ['CSV', 'Excel', 'Google Sheets', 'Zapier', 'API', 'Webhooks'],
    lastVerified: new Date('2025-01-15')
  },
  {
    id: 'anakin-ai',
    name: 'Anakin AI',
    slug: 'anakin-ai',
    description: 'Anakin AI is a comprehensive AI platform that combines data analysis, automation, and machine learning capabilities. It offers pre-built AI workflows for various business use cases, from data processing and analysis to content generation and predictive modeling, all accessible through a user-friendly interface.',
    shortDescription: 'All-in-one AI platform for data analysis and automation',
    logo: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg',
    website: 'https://anakin.ai',
    categoryId: 'data-analysis',
    subcategoryIds: ['data-visualization', 'predictive-analysis'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['10 AI credits/month', 'Basic workflows', 'Community templates', 'Email support']
        },
        {
          name: 'Basic',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['1,000 AI credits/month', 'All workflows', 'Premium templates', 'Priority support']
        },
        {
          name: 'Pro',
          price: '$30/month',
          billingPeriod: 'monthly',
          features: ['5,000 AI credits/month', 'Custom workflows', 'API access', 'Advanced features']
        },
        {
          name: 'Enterprise',
          price: 'Custom pricing',
          billingPeriod: 'yearly',
          features: ['Unlimited credits', 'White-label option', 'Dedicated support', 'On-premise deployment']
        }
      ]
    },
    features: [
      'Pre-built AI workflows',
      'Data analysis automation',
      'Custom workflow builder',
      'Multiple AI models',
      'Data visualization',
      'API integration',
      'Template marketplace',
      'Real-time collaboration'
    ],
    limitations: [
      'Credit-based usage model',
      'Limited offline capabilities',
      'Performance varies by workflow',
      'Learning curve for complex workflows'
    ],
    rating: 4.1,
    reviewCount: 520,
    trending: true,
    featured: false,
    integrations: ['Google Sheets', 'Airtable', 'Slack', 'Discord', 'Zapier', 'API'],
    lastVerified: new Date('2025-01-15')
  },
  // === MEDIA CREATION TOOLS ===
  // Image Generation Tools
  {
    id: 'dall-e-3',
    name: 'DALL·E 3',
    slug: 'dall-e-3',
    description: 'DALL·E 3 is OpenAI\'s most advanced AI image generation model that creates highly detailed and accurate images from text descriptions. It excels at understanding complex prompts and generating photorealistic and artistic images with remarkable precision.',
    shortDescription: 'OpenAI\'s advanced AI image generator with precise prompt understanding',
    logo: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    website: 'https://openai.com/dall-e-3',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation'],
    pricing: {
      type: 'pay-per-use',
      startingPrice: '$0.040 per image',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Standard',
          price: '$0.040 per image (1024×1024)',
          billingPeriod: 'one-time',
          features: ['High-quality image generation', 'Multiple aspect ratios', 'Style variations']
        },
        {
          name: 'HD',
          price: '$0.080 per image (1024×1024)',
          billingPeriod: 'one-time',
          features: ['Enhanced detail and quality', 'Sharper images', 'Better text rendering']
        }
      ]
    },
    features: [
      'Highly accurate prompt interpretation',
      'Photorealistic and artistic styles',
      'Multiple resolution options',
      'Built-in safety filters',
      'Integration with ChatGPT Plus',
      'Commercial usage rights'
    ],
    limitations: [
      'Pay-per-image model can be expensive',
      'Limited batch generation',
      'Cannot edit existing images',
      'Content policy restrictions'
    ],
    rating: 4.8,
    reviewCount: 2150,
    trending: true,
    featured: true,
    integrations: ['ChatGPT', 'OpenAI API', 'Microsoft Designer'],
    lastVerified: new Date('2025-01-20')
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    slug: 'stable-diffusion',
    description: 'Stable Diffusion is an open-source AI image generation model that can be run locally or through various online services. It offers high-quality image generation with extensive customization options and community-driven improvements.',
    shortDescription: 'Open-source AI image generator with local deployment options',
    logo: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg',
    website: 'https://stability.ai/stable-diffusion',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Free to use and modify', 'Local deployment', 'Community models', 'No usage limits']
        },
        {
          name: 'Cloud Services',
          price: 'Varies by provider',
          billingPeriod: 'monthly',
          features: ['Hosted solutions', 'API access', 'Faster generation', 'Premium models']
        }
      ]
    },
    features: [
      'Open-source and customizable',
      'Local deployment capability',
      'Extensive model variants',
      'Fine-tuning options',
      'Active community support',
      'No usage restrictions'
    ],
    limitations: [
      'Requires technical setup for local use',
      'Hardware requirements for optimal performance',
      'Inconsistent quality without fine-tuning',
      'Limited official support'
    ],
    rating: 4.6,
    reviewCount: 3200,
    trending: true,
    featured: false,
    integrations: ['Automatic1111', 'ComfyUI', 'Hugging Face', 'Replicate'],
    lastVerified: new Date('2025-01-18')
  },
  {
    id: 'adobe-firefly',
    name: 'Adobe Firefly',
    slug: 'adobe-firefly',
    description: 'Adobe Firefly is a family of generative AI models designed for creative workflows. It offers high-quality image generation, text effects, and vector graphics creation, all trained on Adobe Stock and openly licensed content.',
    shortDescription: 'Adobe\'s creative AI suite for commercial-safe content generation',
    logo: 'https://images.pexels.com/photos/7135037/pexels-photo-7135037.jpeg',
    website: 'https://www.adobe.com/products/firefly.html',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$4.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['25 generative credits/month', 'Basic features', 'Standard quality']
        },
        {
          name: 'Premium',
          price: '$4.99/month',
          billingPeriod: 'monthly',
          features: ['100 generative credits/month', 'Priority processing', 'High-quality output']
        },
        {
          name: 'Creative Cloud Integration',
          price: 'Included with CC',
          billingPeriod: 'monthly',
          features: ['Unlimited credits', 'Full Creative Cloud integration', 'Commercial licensing']
        }
      ]
    },
    features: [
      'Commercial-safe content generation',
      'Integration with Creative Cloud',
      'Text-to-image generation',
      'Vector graphics creation',
      'Style matching and transfer',
      'Content credentials'
    ],
    limitations: [
      'Limited free tier',
      'Requires Adobe ecosystem for full features',
      'Credit-based usage model',
      'Limited customization compared to open-source alternatives'
    ],
    rating: 4.5,
    reviewCount: 1850,
    trending: true,
    featured: false,
    integrations: ['Photoshop', 'Illustrator', 'Express', 'Creative Cloud'],
    lastVerified: new Date('2025-01-15')
  },
  {
    id: 'leonardo-ai',
    name: 'Leonardo.ai',
    slug: 'leonardo-ai',
    description: 'Leonardo.ai is a powerful AI image generation platform focused on creating production-quality visual assets. It offers fine-tuned models for different styles and use cases, making it ideal for creative professionals and content creators.',
    shortDescription: 'Professional AI image generation with fine-tuned models',
    logo: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg',
    website: 'https://leonardo.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['150 tokens daily', 'Basic models', 'Community access']
        },
        {
          name: 'Apprentice',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['8,500 tokens/month', 'Priority generation', 'Advanced models']
        },
        {
          name: 'Artisan',
          price: '$24/month',
          billingPeriod: 'monthly',
          features: ['25,000 tokens/month', 'Premium models', 'Commercial license']
        },
        {
          name: 'Maestro',
          price: '$48/month',
          billingPeriod: 'monthly',
          features: ['60,000 tokens/month', 'All features', 'API access']
        }
      ]
    },
    features: [
      'Fine-tuned models for specific styles',
      'Image-to-image transformation',
      'AI Canvas for editing',
      'Motion generation',
      'Prompt enhancement',
      'Commercial licensing'
    ],
    limitations: [
      'Token-based usage system',
      'Limited free tier',
      'Learning curve for advanced features',
      'Queue times during peak usage'
    ],
    rating: 4.6,
    reviewCount: 1650,
    trending: true,
    featured: false,
    integrations: ['API access', 'Discord bot', 'Web interface'],
    lastVerified: new Date('2025-01-12')
  },
  {
    id: 'clipdrop',
    name: 'ClipDrop',
    slug: 'clipdrop',
    description: 'ClipDrop is an AI-powered creative suite that offers image generation, background removal, upscaling, and various editing tools. It provides an ecosystem of AI tools for seamless creative workflows.',
    shortDescription: 'All-in-one AI creative suite for image editing and generation',
    logo: 'https://images.pexels.com/photos/7135037/pexels-photo-7135037.jpeg',
    website: 'https://clipdrop.co',
    categoryId: 'media-creation',
    subcategoryIds: ['image-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$7/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited daily uses', 'Basic tools', 'Watermarked outputs']
        },
        {
          name: 'Pro',
          price: '$7/month',
          billingPeriod: 'monthly',
          features: ['Unlimited usage', 'All tools', 'No watermarks', 'API access']
        }
      ]
    },
    features: [
      'Multiple AI tools in one platform',
      'Background removal and replacement',
      'Image upscaling and enhancement',
      'Text-to-image generation',
      'Object removal and cleanup',
      'Mobile and web apps'
    ],
    limitations: [
      'Limited free usage',
      'Some tools require internet connection',
      'Quality varies by tool',
      'Subscription required for professional use'
    ],
    rating: 4.4,
    reviewCount: 890,
    trending: false,
    featured: false,
    integrations: ['Mobile apps', 'API', 'Figma plugin'],
    lastVerified: new Date('2025-01-10')
  },
  // Video Generation Tools
  {
    id: 'runway-gen-2',
    name: 'Runway Gen-2',
    slug: 'runway-gen-2',
    description: 'Runway Gen-2 is a next-generation AI video generation model that creates high-quality videos from text prompts, images, or existing video clips. It offers unprecedented control over video creation and editing workflows.',
    shortDescription: 'Next-generation AI video generator with multimodal inputs',
    logo: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg',
    website: 'https://runwayml.com',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$12/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Basic',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['125 credits/month', '720p generation', 'Basic models']
        },
        {
          name: 'Standard',
          price: '$28/month',
          billingPeriod: 'monthly',
          features: ['625 credits/month', '1080p generation', 'Advanced models', 'Priority queue']
        },
        {
          name: 'Pro',
          price: '$76/month',
          billingPeriod: 'monthly',
          features: ['2250 credits/month', '4K generation', 'All features', 'API access']
        }
      ]
    },
    features: [
      'Text-to-video generation',
      'Image-to-video conversion',
      'Video-to-video transformation',
      'Multiple aspect ratios',
      'High-resolution output',
      'Advanced motion controls'
    ],
    limitations: [
      'Credit-based usage model',
      'Expensive for heavy usage',
      'Generation time can be lengthy',
      'Limited video duration'
    ],
    rating: 4.7,
    reviewCount: 1420,
    trending: true,
    featured: true,
    integrations: ['Adobe After Effects', 'Final Cut Pro', 'API'],
    lastVerified: new Date('2025-01-22')
  },
  {
    id: 'pika',
    name: 'Pika',
    slug: 'pika',
    description: 'Pika is an AI video generation platform that specializes in creating smooth, high-quality videos from text descriptions and images. It focuses on ease of use while delivering professional-grade video content.',
    shortDescription: 'User-friendly AI video generator for smooth, high-quality content',
    logo: 'https://images.pexels.com/photos/7988154/pexels-photo-7988154.jpeg',
    website: 'https://pika.art',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited daily generations', 'Basic quality', 'Watermarked videos']
        },
        {
          name: 'Pro',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Unlimited generations', 'HD quality', 'No watermarks', 'Priority processing']
        },
        {
          name: 'Team',
          price: '$30/month',
          billingPeriod: 'monthly',
          features: ['All Pro features', 'Team collaboration', 'Commercial license', 'Advanced controls']
        }
      ]
    },
    features: [
      'Text-to-video generation',
      'Image animation',
      'Smooth motion synthesis',
      'Multiple video formats',
      'Easy-to-use interface',
      'Fast generation times'
    ],
    limitations: [
      'Limited customization options',
      'Shorter video durations',
      'Free tier restrictions',
      'Limited style control'
    ],
    rating: 4.5,
    reviewCount: 980,
    trending: true,
    featured: false,
    integrations: ['Web interface', 'Discord bot', 'API coming soon'],
    lastVerified: new Date('2025-01-20')
  },
  {
    id: 'sora',
    name: 'Sora',
    slug: 'sora',
    description: 'Sora is OpenAI\'s revolutionary text-to-video AI model capable of generating high-quality, realistic videos up to a minute long. It demonstrates remarkable understanding of physics, motion, and complex scene composition.',
    shortDescription: 'OpenAI\'s groundbreaking text-to-video AI with realistic physics',
    logo: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg',
    website: 'https://openai.com/sora',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'coming-soon',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Research Preview',
          price: 'Invitation only',
          billingPeriod: 'monthly',
          features: ['Limited access', 'Research purposes', 'Feedback required']
        }
      ]
    },
    features: [
      'Up to 60-second video generation',
      'Realistic physics simulation',
      'Complex scene understanding',
      'Multiple camera angles',
      'High visual quality',
      'Temporal consistency'
    ],
    limitations: [
      'Not publicly available yet',
      'Invitation-only access',
      'Long generation times expected',
      'High computational requirements'
    ],
    rating: 4.9,
    reviewCount: 450,
    trending: true,
    featured: true,
    integrations: ['Coming soon'],
    lastVerified: new Date('2025-01-25')
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    slug: 'synthesia',
    description: 'Synthesia is an AI video generation platform that creates professional videos with AI avatars. It\'s designed for business communications, training, and marketing, offering multilingual support and custom avatar creation.',
    shortDescription: 'AI video platform with realistic avatars for business content',
    logo: 'https://images.pexels.com/photos/7988190/pexels-photo-7988190.jpeg',
    website: 'https://www.synthesia.io',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$22.50/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Starter',
          price: '$22.50/month',
          billingPeriod: 'monthly',
          features: ['10 minutes/month', '90+ avatars', '120+ languages', 'Basic templates']
        },
        {
          name: 'Creator',
          price: '$67.50/month',
          billingPeriod: 'monthly',
          features: ['30 minutes/month', 'All avatars', 'Custom backgrounds', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: 'Custom pricing',
          billingPeriod: 'yearly',
          features: ['Unlimited minutes', 'Custom avatars', 'API access', 'Dedicated support']
        }
      ]
    },
    features: [
      'AI avatar video creation',
      '120+ languages supported',
      'Custom avatar training',
      'Professional templates',
      'Screen recording integration',
      'Team collaboration tools'
    ],
    limitations: [
      'Expensive for individuals',
      'Limited free trial',
      'Avatar movements can look artificial',
      'Subscription-based only'
    ],
    rating: 4.6,
    reviewCount: 1150,
    trending: true,
    featured: false,
    integrations: ['PowerPoint', 'Canva', 'API', 'LMS platforms'],
    lastVerified: new Date('2025-01-18')
  },
  {
    id: 'colossyan',
    name: 'Colossyan',
    slug: 'colossyan',
    description: 'Colossyan is an AI video generator that creates professional videos with AI presenters. It specializes in learning and development content, offering diverse avatars and comprehensive video creation tools.',
    shortDescription: 'AI video creator with diverse presenters for L&D content',
    logo: 'https://images.pexels.com/photos/7988225/pexels-photo-7988225.jpeg',
    website: 'https://www.colossyan.com',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$19/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Starter',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['10 minutes/month', 'Basic avatars', 'Standard quality', 'Basic support']
        },
        {
          name: 'Pro',
          price: '$61/month',
          billingPeriod: 'monthly',
          features: ['30 minutes/month', 'Premium avatars', 'HD quality', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: 'Custom pricing',
          billingPeriod: 'yearly',
          features: ['Unlimited minutes', 'Custom avatars', 'API access', 'White-label option']
        }
      ]
    },
    features: [
      'Diverse AI presenters',
      'Learning-focused templates',
      'Multilingual support',
      'Interactive elements',
      'Collaboration tools',
      'Analytics and tracking'
    ],
    limitations: [
      'Limited free options',
      'Focus primarily on business/education',
      'Subscription required',
      'Avatar customization limitations'
    ],
    rating: 4.4,
    reviewCount: 720,
    trending: false,
    featured: false,
    integrations: ['LMS platforms', 'PowerPoint', 'Google Slides'],
    lastVerified: new Date('2025-01-15')
  },
  {
    id: 'lumen5',
    name: 'Lumen5',
    slug: 'lumen5',
    description: 'Lumen5 is an AI-powered video creation platform that transforms text content into engaging videos. It uses AI to match content with relevant visuals, making video creation accessible for content marketers and creators.',
    shortDescription: 'AI video maker that transforms text into engaging visual content',
    logo: 'https://images.pexels.com/photos/7135027/pexels-photo-7135027.jpeg',
    website: 'https://lumen5.com',
    categoryId: 'media-creation',
    subcategoryIds: ['video-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Community',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 videos/month', '720p quality', 'Lumen5 branding', 'Basic templates']
        },
        {
          name: 'Basic',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['15 videos/month', '1080p quality', 'No branding', 'Premium media']
        },
        {
          name: 'Starter',
          price: '$59/month',
          billingPeriod: 'monthly',
          features: ['60 videos/month', 'Custom branding', 'Auto-captions', 'Priority support']
        },
        {
          name: 'Professional',
          price: '$149/month',
          billingPeriod: 'monthly',
          features: ['Unlimited videos', 'Team collaboration', 'API access', 'Advanced features']
        }
      ]
    },
    features: [
      'Text-to-video conversion',
      'AI-powered content matching',
      'Extensive media library',
      'Customizable templates',
      'Auto-generated captions',
      'Social media optimization'
    ],
    limitations: [
      'Limited customization in free tier',
      'Branding on free videos',
      'Template-based creation',
      'Internet connection required'
    ],
    rating: 4.3,
    reviewCount: 1350,
    trending: false,
    featured: false,
    integrations: ['YouTube', 'Facebook', 'LinkedIn', 'Twitter', 'WordPress'],
    lastVerified: new Date('2025-01-12')
  },
  // Audio & Music Generation Tools
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    slug: 'elevenlabs',
    description: 'ElevenLabs is a leading AI voice generation platform that creates realistic, expressive speech in multiple languages. It offers voice cloning, text-to-speech, and speech-to-speech capabilities with exceptional quality and emotional range.',
    shortDescription: 'Premium AI voice generation with realistic speech and cloning',
    logo: 'https://images.pexels.com/photos/7948035/pexels-photo-7948035.jpeg',
    website: 'https://elevenlabs.io',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$5/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['10,000 characters/month', 'Basic voices', 'Standard quality']
        },
        {
          name: 'Starter',
          price: '$5/month',
          billingPeriod: 'monthly',
          features: ['30,000 characters/month', 'Instant voice cloning', 'Commercial license']
        },
        {
          name: 'Creator',
          price: '$22/month',
          billingPeriod: 'monthly',
          features: ['100,000 characters/month', 'Professional voice cloning', 'Multiple downloads']
        },
        {
          name: 'Pro',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['500,000 characters/month', 'Highest quality voices', 'Priority support']
        }
      ]
    },
    features: [
      'Realistic voice synthesis',
      'Voice cloning technology',
      'Multiple languages supported',
      'Emotional expression control',
      'High-quality audio output',
      'API integration'
    ],
    limitations: [
      'Character-based usage limits',
      'Voice cloning requires samples',
      'Can be expensive for heavy usage',
      'Some accents may be less accurate'
    ],
    rating: 4.8,
    reviewCount: 2340,
    trending: true,
    featured: true,
    integrations: ['API', 'Discord bot', 'Third-party apps'],
    lastVerified: new Date('2025-01-20')
  },
  {
    id: 'voicemod',
    name: 'Voicemod',
    slug: 'voicemod',
    description: 'Voicemod is a real-time voice changer and AI voice generator that offers a wide range of voice effects, custom voice creation, and text-to-speech capabilities. It\'s popular among gamers, content creators, and streamers.',
    shortDescription: 'Real-time voice changer with AI voice effects and generation',
    logo: 'https://images.pexels.com/photos/7948065/pexels-photo-7948065.jpeg',
    website: 'https://www.voicemod.net',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$3.33/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited voice effects', 'Basic real-time changing', 'Community access']
        },
        {
          name: 'Pro',
          price: '$3.33/month (billed annually)',
          billingPeriod: 'yearly',
          features: ['All voice effects', 'Custom voice creation', 'Soundboard', 'Priority updates']
        }
      ]
    },
    features: [
      'Real-time voice changing',
      'AI voice generation',
      'Custom voice effects',
      'Soundboard integration',
      'Gaming integration',
      'Streaming compatibility'
    ],
    limitations: [
      'Limited effects in free version',
      'Requires Windows or Mac',
      'Can affect system performance',
      'Learning curve for advanced features'
    ],
    rating: 4.5,
    reviewCount: 1860,
    trending: true,
    featured: false,
    integrations: ['Discord', 'OBS', 'Twitch', 'VRChat', 'Among Us'],
    lastVerified: new Date('2025-01-18')
  },
  {
    id: 'suno-ai',
    name: 'Suno.ai',
    slug: 'suno-ai',
    description: 'Suno.ai is an AI music generation platform that creates complete songs with vocals and instruments from text prompts. It can generate music in various genres and styles, making music creation accessible to everyone.',
    shortDescription: 'AI music generator creating complete songs from text prompts',
    logo: 'https://images.pexels.com/photos/7948098/pexels-photo-7948098.jpeg',
    website: 'https://suno.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$8/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['50 credits/day', 'Basic generation', 'Non-commercial use']
        },
        {
          name: 'Pro',
          price: '$8/month',
          billingPeriod: 'monthly',
          features: ['500 credits/month', 'Commercial license', 'Priority generation', 'No ads']
        },
        {
          name: 'Premier',
          price: '$24/month',
          billingPeriod: 'monthly',
          features: ['2,000 credits/month', 'All features', 'Fastest generation', 'Premium support']
        }
      ]
    },
    features: [
      'Complete song generation',
      'Vocal and instrumental tracks',
      'Multiple music genres',
      'Custom lyrics input',
      'High-quality audio output',
      'Commercial licensing available'
    ],
    limitations: [
      'Credit-based usage system',
      'Limited style control',
      'Generation time varies',
      'Copyright considerations for similar melodies'
    ],
    rating: 4.6,
    reviewCount: 1450,
    trending: true,
    featured: true,
    integrations: ['Web interface', 'Discord bot', 'API coming soon'],
    lastVerified: new Date('2025-01-22')
  },
  {
    id: 'aiva',
    name: 'AIVA',
    slug: 'aiva',
    description: 'AIVA (Artificial Intelligence Virtual Artist) is an AI composer that creates original music for films, video games, commercials, and other creative projects. It specializes in orchestral and cinematic compositions.',
    shortDescription: 'AI composer for orchestral and cinematic music creation',
    logo: 'https://images.pexels.com/photos/7948125/pexels-photo-7948125.jpeg',
    website: 'https://www.aiva.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '€15/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '€0',
          billingPeriod: 'monthly',
          features: ['3 downloads/month', 'AIVA attribution required', 'Basic compositions']
        },
        {
          name: 'Standard',
          price: '€15/month',
          billingPeriod: 'monthly',
          features: ['15 downloads/month', 'No attribution required', 'Copyright ownership']
        },
        {
          name: 'Pro',
          price: '€49/month',
          billingPeriod: 'monthly',
          features: ['300 downloads/month', 'All features', 'Priority support', 'Commercial license']
        }
      ]
    },
    features: [
      'Orchestral music composition',
      'Multiple musical styles',
      'Custom mood and emotion settings',
      'Professional-quality output',
      'MIDI and audio export',
      'Copyright ownership available'
    ],
    limitations: [
      'Limited free downloads',
      'Primarily classical/orchestral focus',
      'Subscription required for ownership',
      'Less suitable for modern genres'
    ],
    rating: 4.4,
    reviewCount: 680,
    trending: false,
    featured: false,
    integrations: ['MIDI export', 'Audio formats', 'Music software'],
    lastVerified: new Date('2025-01-15')
  },
  {
    id: 'soundraw',
    name: 'Soundraw',
    slug: 'soundraw',
    description: 'Soundraw is an AI music generator that creates royalty-free music for content creators. It offers customizable tracks across various genres and moods, perfect for videos, podcasts, and other creative projects.',
    shortDescription: 'AI music generator for royalty-free content creation',
    logo: 'https://images.pexels.com/photos/7948155/pexels-photo-7948155.jpeg',
    website: 'https://soundraw.io',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'subscription',
      startingPrice: '$16.99/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Creator',
          price: '$16.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited downloads', 'Royalty-free license', 'All genres', 'Basic customization']
        },
        {
          name: 'Artist',
          price: '$29.99/month',
          billingPeriod: 'monthly',
          features: ['All Creator features', 'Stem downloads', 'Advanced editing', 'Priority support']
        }
      ]
    },
    features: [
      'Royalty-free music generation',
      'Multiple genres and moods',
      'Customizable track elements',
      'Unlimited downloads',
      'High-quality audio',
      'Content creator focused'
    ],
    limitations: [
      'No free tier',
      'Subscription-based only',
      'Limited advanced customization',
      'May sound algorithmic to trained ears'
    ],
    rating: 4.3,
    reviewCount: 920,
    trending: false,
    featured: false,
    integrations: ['Content creation platforms', 'Social media', 'Video editors'],
    lastVerified: new Date('2025-01-12')
  },
  {
    id: 'mubert',
    name: 'Mubert',
    slug: 'mubert',
    description: 'Mubert is an AI music platform that generates personalized soundtracks in real-time. It offers both streaming services for listeners and music generation tools for content creators, with a focus on electronic and ambient music.',
    shortDescription: 'Real-time AI music generation platform for streaming and content',
    logo: 'https://images.pexels.com/photos/7948180/pexels-photo-7948180.jpeg',
    website: 'https://mubert.com',
    categoryId: 'media-creation',
    subcategoryIds: ['audio-generation'],
    pricing: {
      type: 'freemium',
      startingPrice: '$14/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited downloads', 'Basic quality', 'Personal use only']
        },
        {
          name: 'Creator',
          price: '$14/month',
          billingPeriod: 'monthly',
          features: ['25 downloads/month', 'High quality', 'Commercial license', 'No attribution']
        },
        {
          name: 'Pro',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['500 downloads/month', 'API access', 'Priority generation', 'Advanced features']
        }
      ]
    },
    features: [
      'Real-time music generation',
      'Electronic and ambient focus',
      'Mood-based generation',
      'API for developers',
      'Streaming service',
      'Commercial licensing'
    ],
    limitations: [
      'Limited to electronic genres',
      'Free tier very restricted',
      'Quality can be inconsistent',
      'Less suitable for traditional music needs'
    ],
    rating: 4.2,
    reviewCount: 540,
    trending: false,
    featured: false,
    integrations: ['API', 'Streaming platforms', 'Developer tools'],
    lastVerified: new Date('2025-01-10')
  },
  // Interactive & Game Media Tools
  {
    id: 'inworld-ai',
    name: 'Inworld AI',
    slug: 'inworld-ai',
    description: 'Inworld AI creates intelligent, interactive characters for games, virtual worlds, and immersive experiences. These AI characters can engage in natural conversations, remember past interactions, and develop personalities.',
    shortDescription: 'AI-powered interactive characters for games and virtual worlds',
    logo: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg',
    website: 'https://inworld.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Starter',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['1,000 API calls/month', 'Basic characters', 'Community support']
        },
        {
          name: 'Creator',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['20,000 API calls/month', 'Advanced characters', 'Custom training']
        },
        {
          name: 'Pro',
          price: '$200/month',
          billingPeriod: 'monthly',
          features: ['200,000 API calls/month', 'Enterprise features', 'Priority support']
        }
      ]
    },
    features: [
      'Natural language conversations',
      'Character memory and personality',
      'Real-time interaction',
      'Emotional intelligence',
      'Multi-platform integration',
      'Voice and text support'
    ],
    limitations: [
      'API-based usage limits',
      'Requires integration work',
      'Can be expensive for high usage',
      'Learning curve for implementation'
    ],
    rating: 4.5,
    reviewCount: 380,
    trending: true,
    featured: false,
    integrations: ['Unity', 'Unreal Engine', 'Web platforms', 'VR/AR systems'],
    lastVerified: new Date('2025-01-20')
  },
  {
    id: 'scenario-gg',
    name: 'Scenario.gg',
    slug: 'scenario-gg',
    description: 'Scenario.gg is an AI-powered game asset generation platform that creates consistent, high-quality art for video games. It allows game developers to train custom AI models and generate assets that match their specific art style.',
    shortDescription: 'AI game asset generator with custom style training',
    logo: 'https://images.pexels.com/photos/7135037/pexels-photo-7135037.jpeg',
    website: 'https://www.scenario.gg',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'freemium',
      startingPrice: '$12/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['100 generations/month', 'Public models', 'Basic features']
        },
        {
          name: 'Pro',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['1,000 generations/month', 'Private models', 'Custom training', 'HD quality']
        },
        {
          name: 'Team',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['5,000 generations/month', 'Team collaboration', 'Priority training', 'API access']
        }
      ]
    },
    features: [
      'Custom AI model training',
      'Consistent art style generation',
      'Game-focused asset creation',
      'Team collaboration tools',
      'High-resolution outputs',
      'Batch generation capabilities'
    ],
    limitations: [
      'Learning curve for model training',
      'Limited free generations',
      'Requires quality training data',
      'Generation times can vary'
    ],
    rating: 4.6,
    reviewCount: 540,
    trending: true,
    featured: false,
    integrations: ['Unity', 'Unreal Engine', 'Photoshop', 'API'],
    lastVerified: new Date('2025-01-18')
  },
  {
    id: 'luma-ai',
    name: 'Luma AI',
    slug: 'luma-ai',
    description: 'Luma AI creates photorealistic 3D models and scenes from simple text prompts or images. It\'s designed for creators who need high-quality 3D assets for games, AR/VR, and digital content without extensive 3D modeling knowledge.',
    shortDescription: 'AI-powered 3D model and scene generation platform',
    logo: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg',
    website: 'https://lumalabs.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'freemium',
      startingPrice: '$24/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['30 generations/month', 'Basic quality', 'Personal use']
        },
        {
          name: 'Standard',
          price: '$24/month',
          billingPeriod: 'monthly',
          features: ['150 generations/month', 'High quality', 'Commercial license', 'Priority queue']
        },
        {
          name: 'Pro',
          price: '$80/month',
          billingPeriod: 'monthly',
          features: ['500 generations/month', 'Highest quality', 'API access', 'Advanced features']
        }
      ]
    },
    features: [
      '3D model generation from text',
      'Photorealistic quality',
      'Multiple export formats',
      'Scene composition',
      'Texture generation',
      'AR/VR optimization'
    ],
    limitations: [
      'Generation-based limits',
      'Complex scenes may require multiple attempts',
      'Limited editing capabilities',
      'High-quality models require paid plans'
    ],
    rating: 4.4,
    reviewCount: 720,
    trending: true,
    featured: false,
    integrations: ['Blender', 'Unity', 'Unreal Engine', 'Three.js'],
    lastVerified: new Date('2025-01-15')
  },
  {
    id: 'unity-muse',
    name: 'Unity Muse',
    slug: 'unity-muse',
    description: 'Unity Muse is an AI-powered suite of tools integrated into the Unity engine for game development. It assists with code generation, sprite creation, texture generation, and other game development tasks directly within the Unity environment.',
    shortDescription: 'AI-powered development tools integrated into Unity engine',
    logo: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg',
    website: 'https://unity.com/products/muse',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'subscription',
      startingPrice: '$18/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Unity Pro + Muse',
          price: '$18/month (additional to Unity Pro)',
          billingPeriod: 'monthly',
          features: ['Integrated AI tools', 'Code generation', 'Asset creation', 'Unlimited usage']
        }
      ]
    },
    features: [
      'Native Unity integration',
      'AI code generation',
      'Sprite and texture creation',
      'Animation assistance',
      'Game logic suggestions',
      'Asset optimization'
    ],
    limitations: [
      'Requires Unity Pro subscription',
      'Limited to Unity ecosystem',
      'Still in development/preview',
      'Additional cost on top of Unity'
    ],
    rating: 4.3,
    reviewCount: 280,
    trending: true,
    featured: false,
    integrations: ['Unity Engine', 'Unity Asset Store', 'Unity Cloud'],
    lastVerified: new Date('2025-01-12')
  },
  {
    id: 'character-ai',
    name: 'Character.ai',
    slug: 'character-ai',
    description: 'Character.ai allows users to create and interact with AI-powered characters that can engage in conversations, roleplay, and provide entertainment. It\'s popular for creative writing, character development, and interactive storytelling.',
    shortDescription: 'Platform for creating and chatting with AI characters',
    logo: 'https://images.pexels.com/photos/7948035/pexels-photo-7948035.jpeg',
    website: 'https://character.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'freemium',
      startingPrice: '$9.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic characters', 'Limited conversations', 'Public characters']
        },
        {
          name: 'Plus',
          price: '$9.99/month',
          billingPeriod: 'monthly',
          features: ['Priority access', 'Faster responses', 'Character rooms', 'Skip waiting times']
        }
      ]
    },
    features: [
      'Custom character creation',
      'Natural conversations',
      'Character memory',
      'Roleplay capabilities',
      'Community sharing',
      'Mobile and web access'
    ],
    limitations: [
      'Free tier has waiting times',
      'Limited customization in free version',
      'Conversations can become repetitive',
      'Content filtering may limit creativity'
    ],
    rating: 4.5,
    reviewCount: 4200,
    trending: true,
    featured: false,
    integrations: ['Web platform', 'Mobile apps', 'Community features'],
    lastVerified: new Date('2025-01-22')
  },
  {
    id: 'novelai',
    name: 'NovelAI',
    slug: 'novelai',
    description: 'NovelAI is an AI-powered writing assistant and storytelling platform that helps create interactive fiction, characters, and immersive narratives. It includes both text generation and image generation capabilities for creative projects.',
    shortDescription: 'AI storytelling platform with text and image generation',
    logo: 'https://images.pexels.com/photos/7948065/pexels-photo-7948065.jpeg',
    website: 'https://novelai.net',
    categoryId: 'media-creation',
    subcategoryIds: ['interactive-media'],
    pricing: {
      type: 'subscription',
      startingPrice: '$10/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Tablet',
          price: '$10/month',
          billingPeriod: 'monthly',
          features: ['Unlimited text generation', '1000 Anlas for images', 'Advanced AI models']
        },
        {
          name: 'Scroll',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['All Tablet features', '1000 additional Anlas', 'Advanced image features']
        },
        {
          name: 'Opus',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['All features', '10,000 Anlas', 'Highest priority', 'Largest context']
        }
      ]
    },
    features: [
      'Interactive storytelling',
      'Character development tools',
      'Image generation for stories',
      'Customizable AI behavior',
      'World-building assistance',
      'Export capabilities'
    ],
    limitations: [
      'No free tier',
      'Image generation uses credits',
      'Learning curve for advanced features',
      'Subscription required for all features'
    ],
    rating: 4.4,
    reviewCount: 1150,
    trending: false,
    featured: false,
    integrations: ['Web platform', 'Export tools', 'Community features'],
    lastVerified: new Date('2025-01-10')
  },
  // AI-Powered Media Editing Tools
  {
    id: 'descript',
    name: 'Descript',
    slug: 'descript',
    description: 'Descript is an all-in-one audio and video editing platform that uses AI to simplify content creation. It offers text-based editing, automatic transcription, voice cloning, and collaborative editing features.',
    shortDescription: 'AI-powered audio and video editor with text-based editing',
    logo: 'https://images.pexels.com/photos/7988190/pexels-photo-7988190.jpeg',
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
          features: ['3 hours transcription/month', 'Watermarked exports', 'Basic editing']
        },
        {
          name: 'Creator',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['10 hours transcription/month', 'No watermarks', 'Overdub voice cloning']
        },
        {
          name: 'Pro',
          price: '$24/month',
          billingPeriod: 'monthly',
          features: ['30 hours transcription/month', 'Advanced features', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: 'Custom pricing',
          billingPeriod: 'yearly',
          features: ['Unlimited transcription', 'Team features', 'Advanced security']
        }
      ]
    },
    features: [
      'Text-based video editing',
      'Automatic transcription',
      'Voice cloning (Overdub)',
      'Screen recording',
      'Collaborative editing',
      'Podcast publishing'
    ],
    limitations: [
      'Limited free transcription hours',
      'Learning curve for new users',
      'Voice cloning requires training',
      'Internet connection required'
    ],
    rating: 4.7,
    reviewCount: 2850,
    trending: true,
    featured: true,
    integrations: ['YouTube', 'Spotify', 'Apple Podcasts', 'Slack'],
    lastVerified: new Date('2025-01-20')
  },
  {
    id: 'runway-editor',
    name: 'Runway',
    slug: 'runway-editor',
    description: 'Runway is a comprehensive AI video editing platform offering advanced tools like background removal, object tracking, motion tracking, and various AI-powered effects for professional video production.',
    shortDescription: 'Professional AI video editing with advanced effects and tools',
    logo: 'https://images.pexels.com/photos/7988086/pexels-photo-7988086.jpeg',
    website: 'https://runwayml.com',
    categoryId: 'media-creation',
    subcategoryIds: ['media-editing'],
    pricing: {
      type: 'subscription',
      startingPrice: '$12/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Basic',
          price: '$12/month',
          billingPeriod: 'monthly',
          features: ['125 credits/month', 'AI editing tools', 'HD exports']
        },
        {
          name: 'Standard',
          price: '$28/month',
          billingPeriod: 'monthly',
          features: ['625 credits/month', 'Advanced tools', '4K exports', 'Priority processing']
        },
        {
          name: 'Pro',
          price: '$76/month',
          billingPeriod: 'monthly',
          features: ['2250 credits/month', 'All features', 'Team collaboration', 'API access']
        }
      ]
    },
    features: [
      'AI background removal',
      'Object and motion tracking',
      'Style transfer effects',
      'Automatic subtitles',
      'Color correction AI',
      'Collaborative editing'
    ],
    limitations: [
      'Credit-based usage model',
      'No free tier',
      'Can be expensive for heavy use',
      'Learning curve for advanced features'
    ],
    rating: 4.6,
    reviewCount: 1950,
    trending: true,
    featured: false,
    integrations: ['Adobe Premiere', 'Final Cut Pro', 'After Effects'],
    lastVerified: new Date('2025-01-18')
  },
  {
    id: 'adobe-photoshop-premiere',
    name: 'Adobe Photoshop & Premiere',
    slug: 'adobe-photoshop-premiere',
    description: 'Adobe\'s flagship creative applications enhanced with AI features including generative fill, content-aware tools, auto-reframe, and intelligent editing assistance powered by Adobe Sensei.',
    shortDescription: 'Industry-standard creative apps enhanced with AI capabilities',
    logo: 'https://images.pexels.com/photos/7135037/pexels-photo-7135037.jpeg',
    website: 'https://www.adobe.com/creativecloud.html',
    categoryId: 'media-creation',
    subcategoryIds: ['media-editing'],
    pricing: {
      type: 'subscription',
      startingPrice: '$20.99/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Individual App',
          price: '$20.99/month per app',
          billingPeriod: 'monthly',
          features: ['Single app access', 'AI features', 'Cloud storage', 'Mobile apps']
        },
        {
          name: 'Creative Cloud All Apps',
          price: '$54.99/month',
          billingPeriod: 'monthly',
          features: ['All 20+ apps', 'Advanced AI features', 'Premium fonts', 'Collaboration tools']
        },
        {
          name: 'Business',
          price: '$84.99/month per license',
          billingPeriod: 'monthly',
          features: ['All apps', 'Advanced admin', 'Enhanced security', 'Priority support']
        }
      ]
    },
    features: [
      'Generative AI fill and expand',
      'Content-aware editing',
      'Auto-reframe for social media',
      'Speech-to-text captions',
      'Smart color matching',
      'Professional-grade tools'
    ],
    limitations: [
      'Expensive subscription model',
      'Steep learning curve',
      'Resource-intensive',
      'Requires consistent internet for full features'
    ],
    rating: 4.8,
    reviewCount: 15600,
    trending: true,
    featured: true,
    integrations: ['Creative Cloud ecosystem', 'Third-party plugins', 'Stock libraries'],
    lastVerified: new Date('2025-01-22')
  },
  {
    id: 'kapwing',
    name: 'Kapwing',
    slug: 'kapwing',
    description: 'Kapwing is an online video editor that uses AI to simplify content creation for social media. It offers automatic subtitles, background removal, video resizing, and collaborative editing features.',
    shortDescription: 'AI-powered online video editor for social media content',
    logo: 'https://images.pexels.com/photos/7135027/pexels-photo-7135027.jpeg',
    website: 'https://www.kapwing.com',
    categoryId: 'media-creation',
    subcategoryIds: ['media-editing'],
    pricing: {
      type: 'freemium',
      startingPrice: '$16/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['3 exports/month', 'Basic tools', 'Kapwing watermark', '720p quality']
        },
        {
          name: 'Pro',
          price: '$16/month',
          billingPeriod: 'monthly',
          features: ['Unlimited exports', 'AI features', 'No watermark', '1080p quality']
        },
        {
          name: 'Team',
          price: '$50/month',
          billingPeriod: 'monthly',
          features: ['All Pro features', 'Team collaboration', 'Priority support', 'Brand kit']
        }
      ]
    },
    features: [
      'Automatic subtitle generation',
      'AI background removal',
      'Smart video resizing',
      'Template library',
      'Collaborative editing',
      'Social media optimization'
    ],
    limitations: [
      'Limited free exports',
      'Internet connection required',
      'Advanced features require subscription',
      'File size limitations'
    ],
    rating: 4.5,
    reviewCount: 3400,
    trending: true,
    featured: false,
    integrations: ['YouTube', 'TikTok', 'Instagram', 'Twitter', 'Slack'],
    lastVerified: new Date('2025-01-15')
  },
  {
    id: 'otter-ai',
    name: 'Otter.ai',
    slug: 'otter-ai',
    description: 'Otter.ai is an AI-powered transcription service that automatically converts speech to text in real-time. It\'s designed for meetings, interviews, lectures, and any audio content that needs accurate transcription.',
    shortDescription: 'AI transcription service for meetings and audio content',
    logo: 'https://images.pexels.com/photos/7948035/pexels-photo-7948035.jpeg',
    website: 'https://otter.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['media-editing'],
    pricing: {
      type: 'freemium',
      startingPrice: '$8.33/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['600 minutes/month', 'Real-time transcription', 'Basic search']
        },
        {
          name: 'Pro',
          price: '$8.33/month',
          billingPeriod: 'monthly',
          features: ['6,000 minutes/month', 'Advanced search', 'Export options', 'Custom vocabulary']
        },
        {
          name: 'Business',
          price: '$20/month per user',
          billingPeriod: 'monthly',
          features: ['Unlimited minutes', 'Team features', 'Admin controls', 'Priority support']
        }
      ]
    },
    features: [
      'Real-time transcription',
      'Speaker identification',
      'Keyword search',
      'Meeting integration',
      'Export capabilities',
      'Mobile and web access'
    ],
    limitations: [
      'Limited free minutes',
      'Accuracy varies with audio quality',
      'Requires good internet connection',
      'May struggle with accents or technical terms'
    ],
    rating: 4.6,
    reviewCount: 5200,
    trending: true,
    featured: false,
    integrations: ['Zoom', 'Google Meet', 'Microsoft Teams', 'Slack'],
    lastVerified: new Date('2025-01-20')
  },
  {
    id: 'pictory',
    name: 'Pictory',
    slug: 'pictory',
    description: 'Pictory is an AI video creation platform that transforms long-form content into short, engaging videos. It uses AI to automatically extract highlights, add captions, and create social media-ready clips.',
    shortDescription: 'AI video creator that transforms long content into engaging clips',
    logo: 'https://images.pexels.com/photos/7988225/pexels-photo-7988225.jpeg',
    website: 'https://pictory.ai',
    categoryId: 'media-creation',
    subcategoryIds: ['media-editing'],
    pricing: {
      type: 'subscription',
      startingPrice: '$19/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Starter',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['30 videos/month', 'Basic features', 'Standard quality', 'Pictory branding']
        },
        {
          name: 'Professional',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['60 videos/month', 'Advanced features', 'HD quality', 'No branding']
        },
        {
          name: 'Teams',
          price: '$99/month',
          billingPeriod: 'monthly',
          features: ['90 videos/month', 'Team collaboration', 'Priority support', 'API access']
        }
      ]
    },
    features: [
      'AI highlight extraction',
      'Automatic captioning',
      'Text-to-video conversion',
      'Voice-over generation',
      'Template library',
      'Social media optimization'
    ],
    limitations: [
      'No free tier',
      'Monthly video limits',
      'Template-based creation',
      'Limited customization options'
    ],
    rating: 4.4,
    reviewCount: 1680,
    trending: false,
    featured: false,
    integrations: ['YouTube', 'Social media platforms', 'Cloud storage'],
    lastVerified: new Date('2025-01-12')
  },
  // Code Creation Tools - Enhanced Coding Assistants
  {
    id: 'github-copilot-business',
    name: 'GitHub Copilot Business',
    slug: 'github-copilot-business',
    description: 'Enhanced version of GitHub Copilot designed for businesses with advanced security, compliance features, and team management capabilities. Provides AI-powered code suggestions with enterprise-grade privacy and control.',
    shortDescription: 'Enterprise AI pair programmer with advanced security',
    logo: 'https://images.pexels.com/photos/11035386/pexels-photo-11035386.jpeg',
    website: 'https://github.com/features/copilot/plans',
    categoryId: 'code-creation',
    subcategoryIds: ['coding-assistants'],
    pricing: {
      type: 'subscription',
      startingPrice: '$19/user/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Business',
          price: '$19/user/month',
          billingPeriod: 'monthly',
          features: ['AI code completion', 'Enterprise security', 'Admin controls', 'Audit logs', 'Policy management']
        }
      ]
    },
    features: [
      'AI-powered code suggestions',
      'Multi-language support',
      'Enterprise security controls',
      'Usage analytics',
      'Policy enforcement',
      'Audit logging'
    ],
    limitations: [
      'No free tier',
      'Requires GitHub Enterprise',
      'Internet connection required',
      'May suggest outdated patterns'
    ],
    rating: 4.7,
    reviewCount: 3200,
    trending: true,
    featured: true,
    integrations: ['VS Code', 'Visual Studio', 'JetBrains IDEs', 'Neovim', 'GitHub'],
    lastVerified: new Date('2025-05-20')
  },
  {
    id: 'claude-dev',
    name: 'Claude for Developers',
    slug: 'claude-dev',
    description: 'Anthropic Claude optimized for development tasks with enhanced code understanding, debugging assistance, and architecture planning. Excels at code review, refactoring, and technical documentation.',
    shortDescription: 'AI assistant specialized for software development',
    logo: 'https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg',
    website: 'https://www.anthropic.com/claude',
    categoryId: 'code-creation',
    subcategoryIds: ['coding-assistants'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited messages', 'Basic code assistance', 'Web interface access']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['5x more usage', 'Priority access', 'Early feature access', 'API access']
        }
      ]
    },
    features: [
      'Advanced code understanding',
      'Architecture planning',
      'Code review assistance',
      'Debug support',
      'Technical documentation',
      'Multi-language expertise'
    ],
    limitations: [
      'Usage limits in free tier',
      'No direct IDE integration',
      'Requires copy-paste workflow',
      'Internet connection required'
    ],
    rating: 4.8,
    reviewCount: 2800,
    trending: true,
    featured: true,
    integrations: ['API access', 'Web interface', 'Third-party extensions'],
    lastVerified: new Date('2025-05-18')
  },
  {
    id: 'gemini-code',
    name: 'Gemini Code Assist',
    slug: 'gemini-code',
    description: 'Google Gemini specialized for coding tasks with multimodal capabilities, supporting code generation, debugging, and explanation across multiple programming languages with visual understanding.',
    shortDescription: 'Google AI assistant for coding with multimodal support',
    logo: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
    website: 'https://cloud.google.com/ai/generative-ai',
    categoryId: 'code-creation',
    subcategoryIds: ['coding-assistants'],
    pricing: {
      type: 'freemium',
      startingPrice: '$0.15/1K tokens',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free Tier',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['15 requests/minute', 'Basic code assistance', 'API access']
        },
        {
          name: 'Pay-as-you-go',
          price: '$0.15/1K tokens',
          billingPeriod: 'monthly',
          features: ['Unlimited requests', 'Advanced features', 'Priority support', 'Enterprise features']
        }
      ]
    },
    features: [
      'Multimodal code understanding',
      'Visual code analysis',
      'Code generation',
      'Debugging assistance',
      'Architecture suggestions',
      'Documentation generation'
    ],
    limitations: [
      'Pay-per-use after free tier',
      'Requires Google Cloud setup',
      'API-based integration',
      'Learning curve for setup'
    ],
    rating: 4.6,
    reviewCount: 1900,
    trending: true,
    featured: false,
    integrations: ['Google Cloud', 'APIs', 'Custom integrations', 'Third-party tools'],
    lastVerified: new Date('2025-05-16')
  },
  {
    id: 'roocode',
    name: 'RooCode AI',
    slug: 'roocode',
    description: 'AI-powered coding assistant that helps developers write, review, and optimize code with intelligent suggestions, automated refactoring, and best practice recommendations.',
    shortDescription: 'AI coding assistant for better code quality',
    logo: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg',
    website: 'https://roocode.com/',
    categoryId: 'code-creation',
    subcategoryIds: ['coding-assistants', 'code-optimization'],
    pricing: {
      type: 'Free',
      startingPrice: 'Free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic code suggestions', 'Limited refactoring', '50 AI requests/month']
        },
        {
          name: 'Pro',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI features', 'Unlimited refactoring', 'Code quality insights', 'Team features']
        }
      ]
    },
    features: [
      'Intelligent code suggestions',
      'Automated refactoring',
      'Code quality analysis',
      'Best practice recommendations',
      'Performance optimization',
      'Security vulnerability detection'
    ],
    limitations: [
      'Limited free tier usage',
      'Newer platform with smaller community',
      'Limited IDE integrations',
      'Still in active development'
    ],
    rating: 4.4,
    reviewCount: 680,
    trending: true,
    featured: false,
    integrations: ['VS Code', 'WebStorm', 'Git', 'CI/CD pipelines'],
    lastVerified: new Date('2025-05-14')
  },
  // Code Creation Tools - API Development
  {
    id: 'thunder-client-ai',
    name: 'Thunder Client AI',
    slug: 'thunder-client-ai',
    description: 'Lightweight API testing tool with AI-powered features for VS Code. Offers intelligent request generation, automated testing scenarios, and smart API documentation.',
    shortDescription: 'AI-enhanced API testing tool for VS Code',
    logo: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    website: 'https://www.thunderclient.com',
    categoryId: 'code-creation',
    subcategoryIds: ['api-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$5/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic API testing', 'Local collections', 'Basic AI assistance']
        },
        {
          name: 'Team',
          price: '$5/user/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Cloud sync', 'Advanced AI features', 'Git integration']
        }
      ]
    },
    features: [
      'AI request generation',
      'Smart environment variables',
      'Automated test creation',
      'API documentation generation',
      'VS Code integration',
      'Collection management'
    ],
    limitations: [
      'Limited to VS Code',
      'Smaller ecosystem than Postman',
      'AI features require paid plan',
      'Limited enterprise features'
    ],
    rating: 4.5,
    reviewCount: 1200,
    trending: true,
    featured: false,
    integrations: ['VS Code', 'Git', 'CI/CD', 'OpenAPI', 'GraphQL'],
    lastVerified: new Date('2025-05-15')
  },
  // Code Creation Tools - Testing Automation
  {
    id: 'playwright-ai',
    name: 'Playwright with AI',
    slug: 'playwright-ai',
    description: 'Microsoft Playwright enhanced with AI capabilities for automated browser testing. Features intelligent test generation, self-healing selectors, and automated debugging.',
    shortDescription: 'AI-enhanced browser automation testing',
    logo: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    website: 'https://playwright.dev',
    categoryId: 'code-creation',
    subcategoryIds: ['testing-automation'],
    pricing: {
      type: 'free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Full Playwright features', 'AI-enhanced testing', 'Community support', 'Cross-browser testing']
        }
      ]
    },
    features: [
      'AI test generation',
      'Cross-browser testing',
      'Auto-wait functionality',
      'Mobile testing',
      'API testing',
      'Visual regression testing'
    ],
    limitations: [
      'Requires coding knowledge',
      'Setup complexity for beginners',
      'Limited visual test recorder',
      'Steeper learning curve'
    ],
    rating: 4.7,
    reviewCount: 2100,
    trending: true,
    featured: true,
    integrations: ['GitHub Actions', 'Azure DevOps', 'Jenkins', 'Docker', 'CI/CD pipelines'],
    lastVerified: new Date('2025-05-18')
},

  // Mobile Development AI Tools
  {
    id: 'flutterflow',
    name: 'FlutterFlow',
    slug: 'flutterflow',
    description: 'FlutterFlow is a visual app builder that uses AI to help create native mobile applications for iOS and Android. It provides drag-and-drop interface design, automatic code generation, and AI-powered suggestions for UI components and app logic.',
    shortDescription: 'Visual app builder with AI-powered mobile app development',
    logo: 'https://images.pexels.com/photos/4050470/pexels-photo-4050470.jpeg',
    website: 'https://flutterflow.io',
    categoryId: 'code-creation',
    subcategoryIds: ['mobile-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$30/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic app building', 'Limited exports', 'Community support']
        },
        {
          name: 'Standard',
          price: '$30/month',
          billingPeriod: 'monthly',
          features: ['Unlimited exports', 'Custom code', 'Firebase integration', 'AI suggestions']
        },
        {
          name: 'Pro',
          price: '$70/month',
          billingPeriod: 'monthly',
          features: ['Advanced features', 'Team collaboration', 'Priority support', 'Custom domains']
        }
      ]
    },
    features: [
      'Visual drag-and-drop interface',
      'AI-powered UI suggestions',
      'Automatic code generation',
      'Flutter framework integration',
      'Real-time preview',
      'Firebase backend integration'
    ],
    limitations: [
      'Limited to Flutter framework',
      'Requires Flutter knowledge for advanced customization',
      'Export limitations on free tier',
      'Dependency on FlutterFlow platform'
    ],
    rating: 4.5,
    reviewCount: 1850,
    trending: true,
    featured: true,
    integrations: ['Firebase', 'Supabase', 'REST APIs', 'Flutter packages'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'expo-ai',
    name: 'Expo with AI Tools',
    slug: 'expo-ai',
    description: 'Expo enhanced with AI development tools provides an open-source platform for React Native development. With AI-powered code suggestions, automatic optimization, and intelligent debugging, it streamlines mobile app development for cross-platform applications.',
    shortDescription: 'AI-enhanced React Native development platform',
    logo: 'https://images.pexels.com/photos/4050468/pexels-photo-4050468.jpeg',
    website: 'https://expo.dev',
    categoryId: 'code-creation',
    subcategoryIds: ['mobile-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$29/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic development tools', 'Community support', 'Limited builds']
        },
        {
          name: 'Production',
          price: '$29/month',
          billingPeriod: 'monthly',
          features: ['Unlimited builds', 'AI code assistance', 'Priority support', 'Advanced analytics']
        }
      ]
    },
    features: [
      'AI-powered code completion',
      'Cross-platform development',
      'Hot reloading',
      'Over-the-air updates',
      'Built-in debugging tools',
      'Automatic optimization suggestions'
    ],
    limitations: [
      'Requires React Native knowledge',
      'Some native features require ejecting',
      'Build queue limitations on free tier',
      'Learning curve for beginners'
    ],
    rating: 4.6,
    reviewCount: 2200,
    trending: true,
    featured: false,
    integrations: ['React Native', 'TypeScript', 'GraphQL', 'Firebase', 'Supabase'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'react-native-ai',
    name: 'React Native AI',
    slug: 'react-native-ai',
    description: 'React Native AI is a comprehensive toolkit that integrates artificial intelligence capabilities directly into React Native development. It provides pre-built AI components, machine learning model integration, and intelligent code generation for mobile apps.',
    shortDescription: 'AI toolkit for React Native mobile app development',
    logo: 'https://images.pexels.com/photos/4050469/pexels-photo-4050469.jpeg',
    website: 'https://reactnative.ai',
    categoryId: 'code-creation',
    subcategoryIds: ['mobile-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$25/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic AI components', 'Limited API calls', 'Community support']
        },
        {
          name: 'Pro',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI features', 'Unlimited API calls', 'Custom models', 'Priority support']
        }
      ]
    },
    features: [
      'Pre-built AI components',
      'Machine learning model integration',
      'Natural language processing',
      'Computer vision capabilities',
      'Voice recognition integration',
      'Intelligent code suggestions'
    ],
    limitations: [
      'Requires React Native expertise',
      'Limited free tier API calls',
      'Dependency on external AI services',
      'Performance considerations for on-device AI'
    ],
    rating: 4.3,
    reviewCount: 920,
    trending: true,
    featured: false,
    integrations: ['OpenAI', 'Google ML Kit', 'TensorFlow Lite', 'Core ML', 'AWS AI services'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'ionic-ai',
    name: 'Ionic with AI Studio',
    slug: 'ionic-ai',
    description: 'Ionic AI Studio enhances the popular Ionic framework with artificial intelligence capabilities for hybrid mobile app development. It offers AI-powered design suggestions, code generation, and intelligent optimization for cross-platform mobile applications.',
    shortDescription: 'AI-enhanced hybrid mobile app development framework',
    logo: 'https://images.pexels.com/photos/4050467/pexels-photo-4050467.jpeg',
    website: 'https://ionic.io',
    categoryId: 'code-creation',
    subcategoryIds: ['mobile-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$40/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Community',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic Ionic tools', 'Community support', 'Limited AI features']
        },
        {
          name: 'Growth',
          price: '$40/month',
          billingPeriod: 'monthly',
          features: ['AI design assistance', 'Code generation', 'Cloud builds', 'Analytics']
        },
        {
          name: 'Scale',
          price: '$120/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI features', 'Team collaboration', 'Enterprise support', 'Custom integrations']
        }
      ]
    },
    features: [
      'AI-powered UI/UX design',
      'Hybrid app development',
      'Cross-platform compatibility',
      'Intelligent code optimization',
      'Automated testing suggestions',
      'Performance monitoring'
    ],
    limitations: [
      'Web technology limitations for native features',
      'Performance may not match native apps',
      'Requires web development knowledge',
      'Advanced AI features require paid plans'
    ],
    rating: 4.2,
    reviewCount: 1560,
    trending: false,
    featured: false,
    integrations: ['Angular', 'React', 'Vue.js', 'Capacitor', 'Cordova'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'capacitor-ai',
    name: 'Capacitor AI',
    slug: 'capacitor-ai',
    description: 'Capacitor AI brings artificial intelligence to native mobile app development using web technologies. It provides AI-powered native plugin suggestions, automatic platform optimization, and intelligent bridge code generation for seamless native functionality.',
    shortDescription: 'AI-powered native mobile app development with web technologies',
    logo: 'https://images.pexels.com/photos/4050466/pexels-photo-4050466.jpeg',
    website: 'https://capacitorjs.com',
    categoryId: 'code-creation',
    subcategoryIds: ['mobile-development'],
    pricing: {
      type: 'open_source',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Full framework access', 'Community support', 'Basic AI tools']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Advanced AI features', 'Priority support', 'Custom plugins', 'Training']
        }
      ]
    },
    features: [
      'Native plugin AI suggestions',
      'Cross-platform development',
      'Web-to-native bridge optimization',
      'Automatic performance tuning',
      'AI-powered debugging',
      'Native API integration assistance'
    ],
    limitations: [
      'Requires web development skills',
      'Some advanced native features may need custom plugins',
      'Enterprise AI features require custom pricing',
      'Performance overhead compared to native development'
    ],
    rating: 4.4,
    reviewCount: 1340,
    trending: true,
    featured: false,
    integrations: ['iOS SDK', 'Android SDK', 'PWA', 'Electron', 'Native plugins'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'kodular-ai',
    name: 'Kodular',
    slug: 'kodular-ai',
    description: 'Kodular is a visual development platform that uses AI to simplify Android app creation through drag-and-drop interface. It offers AI-powered component suggestions, automatic layout optimization, and intelligent app monetization strategies for non-programmers.',
    shortDescription: 'AI-powered visual Android app development platform',
    logo: 'https://images.pexels.com/photos/4050465/pexels-photo-4050465.jpeg',
    website: 'https://kodular.io',
    categoryId: 'code-creation',
    subcategoryIds: ['mobile-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$9.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic app building', 'Limited exports', 'Community support']
        },
        {
          name: 'Premium',
          price: '$9.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited exports', 'AI suggestions', 'Custom branding', 'Priority support']
        }
      ]
    },
    features: [
      'Visual drag-and-drop development',
      'AI component recommendations',
      'No-code Android app creation',
      'Monetization assistance',
      'Automatic UI optimization',
      'Built-in testing tools'
    ],
    limitations: [
      'Android-only platform',
      'Limited advanced programming capabilities',
      'Export restrictions on free tier',
      'May not suit complex app requirements'
    ],
    rating: 4.1,
    reviewCount: 950,
    trending: false,
    featured: false,
    integrations: ['Google Play Console', 'AdMob', 'Firebase', 'Payment gateways'],
    lastVerified: new Date('2025-06-01')
  },

  // Frontend Development AI Tools
  {
    id: 'v0-dev',
    name: 'v0 by Vercel',
    slug: 'v0-dev',
    description: 'v0 is Vercel\'s AI-powered frontend development tool that generates React components and complete user interfaces from text descriptions. It creates production-ready code with modern design patterns, responsive layouts, and best practices.',
    shortDescription: 'AI-powered React component and UI generation tool',
    logo: 'https://images.pexels.com/photos/4050471/pexels-photo-4050471.jpeg',
    website: 'https://v0.dev',
    categoryId: 'code-creation',
    subcategoryIds: ['frontend-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Limited generations', 'Basic components', 'Community support']
        },
        {
          name: 'Pro',
          price: '$20/month',
          billingPeriod: 'monthly',
          features: ['Unlimited generations', 'Advanced components', 'Custom styling', 'Priority support']
        }
      ]
    },
    features: [
      'Text-to-React component generation',
      'Modern UI library integration',
      'Responsive design generation',
      'TypeScript support',
      'Tailwind CSS integration',
      'Interactive preview'
    ],
    limitations: [
      'Limited to React ecosystem',
      'Requires React knowledge for customization',
      'Free tier has generation limits',
      'May need manual refinement for complex designs'
    ],
    rating: 4.7,
    reviewCount: 1650,
    trending: true,
    featured: true,
    integrations: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'builder-ai',
    name: 'Builder.ai',
    slug: 'builder-ai',
    description: 'Builder.ai is an AI-powered platform that creates custom software applications including web and mobile frontends. It uses artificial intelligence to understand requirements, design interfaces, and generate production-ready code with minimal human intervention.',
    shortDescription: 'AI-powered custom software and frontend development platform',
    logo: 'https://images.pexels.com/photos/4050472/pexels-photo-4050472.jpeg',
    website: 'https://builder.ai',
    categoryId: 'code-creation',
    subcategoryIds: ['frontend-development'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Custom',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Studio',
          price: 'Custom',
          billingPeriod: 'one-time',
          features: ['AI-powered development', 'Custom applications', 'Full-stack solutions', 'Dedicated team']
        }
      ]
    },
    features: [
      'AI-driven software development',
      'Custom UI/UX design',
      'Full-stack application creation',
      'Automated testing',
      'Deployment automation',
      'Ongoing maintenance'
    ],
    limitations: [
      'Enterprise-only pricing',
      'Project-based engagement model',
      'Limited control over development process',
      'Higher cost compared to traditional development'
    ],
    rating: 4.2,
    reviewCount: 380,
    trending: false,
    featured: false,
    integrations: ['Cloud platforms', 'Third-party APIs', 'Payment systems', 'Analytics tools'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'framer-ai',
    name: 'Framer AI',
    slug: 'framer-ai',
    description: 'Framer AI combines design and development with artificial intelligence to create interactive web experiences. It offers AI-powered component generation, automatic responsive design, and intelligent animation suggestions for modern web interfaces.',
    shortDescription: 'AI-powered interactive web design and development platform',
    logo: 'https://images.pexels.com/photos/4050473/pexels-photo-4050473.jpeg',
    website: 'https://framer.com',
    categoryId: 'code-creation',
    subcategoryIds: ['frontend-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$15/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic design tools', 'Limited AI features', 'Community templates']
        },
        {
          name: 'Mini',
          price: '$15/month',
          billingPeriod: 'monthly',
          features: ['Custom domain', 'AI assistance', 'Advanced animations', 'Form handling']
        },
        {
          name: 'Basic',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['Multiple sites', 'AI optimization', 'Analytics', 'Collaboration tools']
        }
      ]
    },
    features: [
      'AI-powered design generation',
      'Interactive prototype creation',
      'Responsive design automation',
      'Component library integration',
      'Animation and micro-interaction AI',
      'Code export capabilities'
    ],
    limitations: [
      'Learning curve for complex interactions',
      'Limited backend integration',
      'Advanced AI features require paid plans',
      'May generate excessive code for simple designs'
    ],
    rating: 4.5,
    reviewCount: 2100,
    trending: true,
    featured: false,
    integrations: ['Figma', 'Sketch', 'React', 'TypeScript', 'CMS platforms'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'webflow-ai',
    name: 'Webflow AI',
    slug: 'webflow-ai',
    description: 'Webflow AI enhances the popular visual web development platform with artificial intelligence capabilities. It provides AI-powered design suggestions, automatic SEO optimization, content generation, and intelligent responsive design adjustments.',
    shortDescription: 'AI-enhanced visual web development platform',
    logo: 'https://images.pexels.com/photos/4050474/pexels-photo-4050474.jpeg',
    website: 'https://webflow.com',
    categoryId: 'code-creation',
    subcategoryIds: ['frontend-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$14/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['2 projects', 'Basic AI features', 'Webflow subdomain']
        },
        {
          name: 'Basic',
          price: '$14/month',
          billingPeriod: 'monthly',
          features: ['Custom domain', 'AI design assistance', 'Form handling', 'Site search']
        },
        {
          name: 'CMS',
          price: '$23/month',
          billingPeriod: 'monthly',
          features: ['Content management', 'AI content generation', 'Dynamic content', '2,000 CMS items']
        }
      ]
    },
    features: [
      'Visual drag-and-drop design',
      'AI design suggestions',
      'Automatic responsive design',
      'Content generation AI',
      'SEO optimization assistance',
      'Clean code export'
    ],
    limitations: [
      'Steeper learning curve',
      'Limited e-commerce on lower tiers',
      'Can become expensive for large sites',
      'Some advanced features require coding knowledge'
    ],
    rating: 4.6,
    reviewCount: 3200,
    trending: true,
    featured: true,
    integrations: ['Zapier', 'Google Analytics', 'Mailchimp', 'Stripe', 'CMS platforms'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'figma-to-code',
    name: 'Figma to Code AI',
    slug: 'figma-to-code',
    description: 'Figma to Code AI automatically converts Figma designs into production-ready frontend code. Using advanced AI algorithms, it generates clean, responsive HTML, CSS, and React components while maintaining design fidelity and best practices.',
    shortDescription: 'AI-powered design-to-code conversion from Figma',
    logo: 'https://images.pexels.com/photos/4050475/pexels-photo-4050475.jpeg',
    website: 'https://figma-to-code.com',
    categoryId: 'code-creation',
    subcategoryIds: ['frontend-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['5 conversions/month', 'Basic HTML/CSS', 'Community support']
        },
        {
          name: 'Pro',
          price: '$19/month',
          billingPeriod: 'monthly',
          features: ['Unlimited conversions', 'React/Vue components', 'TypeScript support', 'Priority support']
        },
        {
          name: 'Team',
          price: '$49/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Custom frameworks', 'API access', 'Advanced customization']
        }
      ]
    },
    features: [
      'Figma design conversion',
      'Multiple framework support',
      'Responsive code generation',
      'Component extraction',
      'Clean, semantic code',
      'Design system integration'
    ],
    limitations: [
      'Requires well-structured Figma designs',
      'May need manual refinement for complex layouts',
      'Limited free tier conversions',
      'Dependency on Figma design quality'
    ],
    rating: 4.3,
    reviewCount: 1280,
    trending: true,
    featured: false,
    integrations: ['Figma', 'React', 'Vue.js', 'Angular', 'TypeScript', 'Tailwind CSS'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'locofy-ai',
    name: 'Locofy.ai',
    slug: 'locofy-ai',
    description: 'Locofy.ai is an AI-powered design-to-code platform that converts designs from Figma and Adobe XD into production-ready frontend code. It supports multiple frameworks and provides intelligent component structuring with responsive design capabilities.',
    shortDescription: 'AI design-to-code platform for multiple design tools and frameworks',
    logo: 'https://images.pexels.com/photos/4050476/pexels-photo-4050476.jpeg',
    website: 'https://locofy.ai',
    categoryId: 'code-creation',
    subcategoryIds: ['frontend-development'],
    pricing: {
      type: 'freemium',
      startingPrice: '$25/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['10 exports/month', 'Basic frameworks', 'Community support']
        },
        {
          name: 'Pro',
          price: '$25/month',
          billingPeriod: 'monthly',
          features: ['Unlimited exports', 'All frameworks', 'Advanced features', 'Priority support']
        },
        {
          name: 'Team',
          price: '$100/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'Custom components', 'API access', 'White-label options']
        }
      ]
    },
    features: [
      'Multi-design tool support',
      'Framework flexibility',
      'Intelligent component creation',
      'Responsive code generation',
      'Design system compatibility',
      'Version control integration'
    ],
    limitations: [
      'Quality depends on design structure',
      'Limited free tier exports',
      'May require post-conversion optimization',
      'Learning curve for optimal results'
    ],
    rating: 4.4,
    reviewCount: 920,
    trending: true,
    featured: false,
    integrations: ['Figma', 'Adobe XD', 'React', 'Next.js', 'Vue.js', 'HTML/CSS'],
    lastVerified: new Date('2025-06-01')
  },

  // DevOps & CI/CD AI Tools
  {
    id: 'github-actions-ai',
    name: 'GitHub Actions AI',
    slug: 'github-actions-ai',
    description: 'GitHub Actions enhanced with AI capabilities provides intelligent workflow automation, predictive build optimization, and smart deployment strategies. It offers AI-powered workflow suggestions, automated testing recommendations, and intelligent error resolution.',
    shortDescription: 'AI-enhanced CI/CD automation and workflow intelligence',
    logo: 'https://images.pexels.com/photos/4050477/pexels-photo-4050477.jpeg',
    website: 'https://github.com/features/actions',
    categoryId: 'code-creation',
    subcategoryIds: ['devops-cicd'],
    pricing: {
      type: 'freemium',
      startingPrice: '$4/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['2,000 minutes/month', 'Basic AI suggestions', 'Public repositories']
        },
        {
          name: 'Pro',
          price: '$4/month',
          billingPeriod: 'monthly',
          features: ['3,000 minutes/month', 'Advanced AI features', 'Private repositories', 'Priority support']
        },
        {
          name: 'Team',
          price: '$4/user/month',
          billingPeriod: 'monthly',
          features: ['10,000 minutes/month', 'Team AI insights', 'Advanced security', 'Team management']
        }
      ]
    },
    features: [
      'AI workflow optimization',
      'Predictive build analysis',
      'Intelligent error detection',
      'Automated testing suggestions',
      'Smart deployment strategies',
      'Performance monitoring'
    ],
    limitations: [
      'Limited minutes on free tier',
      'Requires GitHub ecosystem',
      'AI features may need fine-tuning',
      'Learning curve for complex workflows'
    ],
    rating: 4.7,
    reviewCount: 4200,
    trending: true,
    featured: true,
    integrations: ['GitHub', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'jenkins-ai',
    name: 'Jenkins with AI Plugins',
    slug: 'jenkins-ai',
    description: 'Jenkins enhanced with AI plugins provides intelligent build automation, predictive failure detection, and smart resource optimization. It offers AI-powered pipeline suggestions, automated troubleshooting, and intelligent deployment scheduling.',
    shortDescription: 'AI-enhanced Jenkins automation and pipeline intelligence',
    logo: 'https://images.pexels.com/photos/4050478/pexels-photo-4050478.jpeg',
    website: 'https://jenkins.io',
    categoryId: 'code-creation',
    subcategoryIds: ['devops-cicd'],
    pricing: {
      type: 'open_source',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Full Jenkins access', 'Community AI plugins', 'Self-hosted']
        },
        {
          name: 'CloudBees CI',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Enterprise AI features', 'Managed service', 'Premium support', 'Advanced analytics']
        }
      ]
    },
    features: [
      'AI-powered pipeline optimization',
      'Predictive build failure detection',
      'Intelligent resource scheduling',
      'Automated troubleshooting',
      'Smart deployment recommendations',
      'Performance analytics'
    ],
    limitations: [
      'Requires infrastructure management',
      'AI features depend on plugins',
      'Setup complexity for beginners',
      'Enterprise features require CloudBees'
    ],
    rating: 4.5,
    reviewCount: 3800,
    trending: false,
    featured: false,
    integrations: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'Maven', 'Gradle'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'docker-ai',
    name: 'Docker with AI Tools',
    slug: 'docker-ai',
    description: 'Docker enhanced with AI capabilities provides intelligent containerization, automated optimization, and smart resource management. It offers AI-powered Dockerfile generation, security scanning, and performance optimization for container workflows.',
    shortDescription: 'AI-enhanced containerization and deployment platform',
    logo: 'https://images.pexels.com/photos/4050479/pexels-photo-4050479.jpeg',
    website: 'https://docker.com',
    categoryId: 'code-creation',
    subcategoryIds: ['devops-cicd'],
    pricing: {
      type: 'freemium',
      startingPrice: '$5/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Personal',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic Docker features', 'Limited AI assistance', 'Public repositories']
        },
        {
          name: 'Pro',
          price: '$5/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI features', 'Private repositories', 'Enhanced security', 'Priority support']
        },
        {
          name: 'Team',
          price: '$7/user/month',
          billingPeriod: 'monthly',
          features: ['Team collaboration', 'AI insights', 'Advanced security', 'Team management']
        }
      ]
    },
    features: [
      'AI Dockerfile optimization',
      'Intelligent image building',
      'Automated security scanning',
      'Performance optimization',
      'Resource usage analytics',
      'Smart deployment suggestions'
    ],
    limitations: [
      'Requires containerization knowledge',
      'AI features limited on free tier',
      'Resource intensive for large applications',
      'Learning curve for Docker concepts'
    ],
    rating: 4.6,
    reviewCount: 5200,
    trending: true,
    featured: true,
    integrations: ['Kubernetes', 'CI/CD platforms', 'Cloud providers', 'Orchestration tools'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'kubernetes-ai',
    name: 'Kubernetes AI Tools',
    slug: 'kubernetes-ai',
    description: 'Kubernetes enhanced with AI tools provides intelligent cluster management, automated scaling, and predictive resource optimization. It offers AI-powered deployment strategies, anomaly detection, and intelligent troubleshooting for container orchestration.',
    shortDescription: 'AI-powered Kubernetes cluster management and orchestration',
    logo: 'https://images.pexels.com/photos/4050480/pexels-photo-4050480.jpeg',
    website: 'https://kubernetes.io',
    categoryId: 'code-creation',
    subcategoryIds: ['devops-cicd'],
    pricing: {
      type: 'open_source',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Full Kubernetes access', 'Community AI tools', 'Self-managed']
        },
        {
          name: 'Managed Services',
          price: 'Variable',
          billingPeriod: 'monthly',
          features: ['Cloud provider AI features', 'Managed clusters', 'Enterprise support', 'Advanced AI tools']
        }
      ]
    },
    features: [
      'AI-powered auto-scaling',
      'Intelligent resource optimization',
      'Predictive failure detection',
      'Automated deployment strategies',
      'Anomaly detection',
      'Smart load balancing'
    ],
    limitations: [
      'Complex learning curve',
      'Requires cluster management expertise',
      'AI tools may need additional setup',
      'Resource intensive for small applications'
    ],
    rating: 4.4,
    reviewCount: 2800,
    trending: true,
    featured: false,
    integrations: ['Docker', 'Helm', 'Prometheus', 'Grafana', 'Cloud providers', 'CI/CD tools'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'terraform-ai',
    name: 'Terraform with AI Tools',
    slug: 'terraform-ai',
    description: 'Terraform enhanced with AI capabilities provides intelligent infrastructure as code, automated optimization, and smart resource planning. It offers AI-powered configuration generation, cost optimization, and security best practice recommendations.',
    shortDescription: 'AI-enhanced infrastructure as code and automation',
    logo: 'https://images.pexels.com/photos/4050481/pexels-photo-4050481.jpeg',
    website: 'https://terraform.io',
    categoryId: 'code-creation',
    subcategoryIds: ['devops-cicd'],
    pricing: {
      type: 'freemium',
      startingPrice: '$20/user/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Core Terraform', 'Community AI tools', 'Local state management']
        },
        {
          name: 'Terraform Cloud',
          price: '$20/user/month',
          billingPeriod: 'monthly',
          features: ['Remote state', 'AI policy suggestions', 'VCS integration', 'Collaboration tools']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Advanced AI features', 'SSO', 'Audit logging', 'Private registry']
        }
      ]
    },
    features: [
      'AI configuration generation',
      'Intelligent resource planning',
      'Automated cost optimization',
      'Security best practices',
      'Drift detection',
      'Smart dependency management'
    ],
    limitations: [
      'Requires infrastructure knowledge',
      'AI features mainly in paid tiers',
      'Complex for beginners',
      'State management complexity'
    ],
    rating: 4.5,
    reviewCount: 2100,
    trending: true,
    featured: false,
    integrations: ['AWS', 'Azure', 'Google Cloud', 'GitHub', 'GitLab', 'CI/CD platforms'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'ansible-ai',
    name: 'Ansible with AI Tools',
    slug: 'ansible-ai',
    description: 'Ansible enhanced with AI capabilities provides intelligent automation, predictive configuration management, and smart playbook optimization. It offers AI-powered playbook generation, error prediction, and automated remediation for infrastructure management.',
    shortDescription: 'AI-enhanced automation and configuration management',
    logo: 'https://images.pexels.com/photos/4050482/pexels-photo-4050482.jpeg',
    website: 'https://ansible.com',
    categoryId: 'code-creation',
    subcategoryIds: ['devops-cicd'],
    pricing: {
      type: 'freemium',
      startingPrice: '$10,000/year',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Core Ansible', 'Community modules', 'Basic automation']
        },
        {
          name: 'Ansible Automation Platform',
          price: '$10,000/year',
          billingPeriod: 'yearly',
          features: ['AI-powered insights', 'Web UI', 'Analytics', 'Enterprise support']
        }
      ]
    },
    features: [
      'AI playbook generation',
      'Predictive failure detection',
      'Intelligent automation',
      'Configuration drift detection',
      'Smart error handling',
      'Performance optimization'
    ],
    limitations: [
      'Requires automation knowledge',
      'Enterprise AI features are expensive',
      'Learning curve for complex scenarios',
      'Limited Windows support'
    ],
    rating: 4.3,
    reviewCount: 1900,
    trending: false,
    featured: false,
    integrations: ['Linux systems', 'Cloud platforms', 'Network devices', 'CI/CD tools', 'Monitoring systems'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'gitlab-ai',
    name: 'GitLab AI',
    slug: 'gitlab-ai',
    description: 'GitLab AI integrates artificial intelligence throughout the DevOps lifecycle, providing intelligent code suggestions, automated security scanning, predictive analytics, and smart CI/CD optimization within a complete DevOps platform.',
    shortDescription: 'AI-integrated complete DevOps platform with intelligent automation',
    logo: 'https://images.pexels.com/photos/4050483/pexels-photo-4050483.jpeg',
    website: 'https://gitlab.com',
    categoryId: 'code-creation',
    subcategoryIds: ['devops-cicd'],
    pricing: {
      type: 'freemium',
      startingPrice: '$19/user/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'monthly',
          features: ['Basic AI features', 'Unlimited private repos', 'CI/CD', '5GB storage']
        },
        {
          name: 'Premium',
          price: '$19/user/month',
          billingPeriod: 'monthly',
          features: ['Advanced AI insights', 'Security scanning', 'Advanced CI/CD', 'Priority support']
        },
        {
          name: 'Ultimate',
          price: '$99/user/month',
          billingPeriod: 'monthly',
          features: ['Full AI suite', 'Compliance management', 'Portfolio management', 'Executive insights']
        }
      ]
    },
    features: [
      'AI-powered code suggestions',
      'Intelligent security scanning',
      'Predictive DevOps analytics',
      'Automated testing recommendations',
      'Smart merge request insights',
      'Performance optimization AI'
    ],
    limitations: [
      'Can be complex for small teams',
      'Advanced AI features require higher tiers',
      'Resource intensive for self-hosted',
      'Learning curve for full platform adoption'
    ],
    rating: 4.6,
    reviewCount: 3500,
    trending: true,
    featured: true,
    integrations: ['Kubernetes', 'Docker', 'Jira', 'Slack', 'AWS', 'Google Cloud', 'Azure'],
    lastVerified: new Date('2025-06-01')
  },
  
  // Healthcare AI Tools
  {
    id: 'pathology-ai',
    name: 'PathAI',
    slug: 'pathology-ai',
    description: 'PathAI is a leading AI platform for pathology that assists pathologists in making more accurate diagnoses. It uses machine learning to analyze tissue samples, detect cancer, and provide quantitative insights for better patient outcomes.',
    shortDescription: 'AI-powered pathology platform for accurate disease diagnosis',
    logo: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
    website: 'https://www.pathai.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['diagnostic-ai'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['AI pathology analysis', 'Integration with lab systems', 'Compliance support', 'Training and support']
        }
      ]
    },
    features: [
      'AI-powered tissue analysis',
      'Cancer detection and grading',
      'Quantitative pathology metrics',
      'Integration with lab workflows',
      'FDA-approved algorithms',
      'Real-time analysis results'
    ],
    limitations: [
      'Requires professional pathologist oversight',
      'High implementation costs',
      'Regulatory compliance requirements',
      'Limited to supported tissue types'
    ],
    rating: 4.7,
    reviewCount: 420,
    trending: true,
    featured: true,
    integrations: ['Laboratory Information Systems', 'PACS', 'Electronic Health Records'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'radiology-assist',
    name: 'Aidoc',
    slug: 'radiology-assist',
    description: 'Aidoc is an AI radiologist assistant that automatically detects acute abnormalities in medical imaging. It helps radiologists prioritize urgent cases, reduce interpretation time, and improve diagnostic accuracy across multiple imaging modalities.',
    shortDescription: 'AI radiologist assistant for medical imaging analysis',
    logo: 'https://images.pexels.com/photos/8466803/pexels-photo-8466803.jpeg',
    website: 'https://www.aidoc.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['diagnostic-ai'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['AI imaging analysis', 'Priority case flagging', 'Multiple modality support', '24/7 monitoring']
        }
      ]
    },
    features: [
      'Automated abnormality detection',
      'Case prioritization',
      'Multi-modality imaging support',
      'Real-time alerts',
      'Integration with PACS systems',
      'Stroke and PE detection'
    ],
    limitations: [
      'Requires radiologist final interpretation',
      'High implementation costs',
      'Specific to supported conditions',
      'Regulatory approval varies by region'
    ],
    rating: 4.6,
    reviewCount: 380,
    trending: true,
    featured: true,
    integrations: ['PACS', 'RIS', 'Electronic Health Records', 'Worklist management'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'drug-discovery-ai',
    name: 'Atomwise',
    slug: 'drug-discovery-ai',
    description: 'Atomwise uses AI for drug discovery, utilizing deep learning to predict how different compounds will interact with target proteins. It accelerates the discovery of new medicines by identifying promising drug candidates faster than traditional methods.',
    shortDescription: 'AI-powered drug discovery platform for pharmaceutical research',
    logo: 'https://images.pexels.com/photos/3825367/pexels-photo-3825367.jpeg',
    website: 'https://www.atomwise.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['medical-research'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Research Collaboration',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['AI drug discovery platform', 'Molecular analysis', 'Research collaboration', 'Expert consultation']
        }
      ]
    },
    features: [
      'AI-powered molecular analysis',
      'Drug-target interaction prediction',
      'Compound optimization',
      'Virtual screening',
      'Research collaboration tools',
      'Expert scientific support'
    ],
    limitations: [
      'Requires extensive pharmaceutical expertise',
      'High costs for research programs',
      'Limited to specific research areas',
      'Long development timelines'
    ],
    rating: 4.5,
    reviewCount: 160,
    trending: true,
    featured: false,
    integrations: ['Research databases', 'Molecular modeling software', 'Laboratory systems'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'genomics-ai',
    name: 'DeepVariant',
    slug: 'genomics-ai',
    description: 'DeepVariant is Google\'s AI tool for genomic variant calling that uses deep learning to identify genetic variations from DNA sequencing data. It provides highly accurate variant calls for research and clinical genomics applications.',
    shortDescription: 'AI-powered genomic variant calling for DNA analysis',
    logo: 'https://images.pexels.com/photos/8617876/pexels-photo-8617876.jpeg',
    website: 'https://github.com/google/deepvariant',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['medical-research'],
    pricing: {
      type: 'free',
      startingPrice: '$0',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Open Source',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Genomic variant calling', 'Deep learning models', 'Research use', 'Community support']
        },
        {
          name: 'Google Cloud',
          price: 'Pay per use',
          billingPeriod: 'monthly',
          features: ['Cloud-based processing', 'Scalable infrastructure', 'Professional support', 'Enterprise features']
        }
      ]
    },
    features: [
      'Deep learning variant calling',
      'High accuracy genetic analysis',
      'Support for multiple sequencing platforms',
      'Open source availability',
      'Scalable cloud processing',
      'Research and clinical applications'
    ],
    limitations: [
      'Requires bioinformatics expertise',
      'Computational resource intensive',
      'Limited to supported file formats',
      'May require additional validation'
    ],
    rating: 4.8,
    reviewCount: 890,
    trending: true,
    featured: true,
    integrations: ['Google Cloud Platform', 'Bioinformatics pipelines', 'Genomics workflows'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'clinical-notes-ai',
    name: 'Nuance DAX',
    slug: 'clinical-notes-ai',
    description: 'Nuance Dragon Ambient eXperience (DAX) is an AI-powered clinical documentation tool that automatically generates clinical notes from natural physician-patient conversations, reducing documentation burden and improving physician efficiency.',
    shortDescription: 'AI clinical documentation assistant for automated note generation',
    logo: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg',
    website: 'https://www.nuance.com/healthcare/ambient-clinical-intelligence.html',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['clinical-documentation'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'monthly',
          features: ['Ambient clinical documentation', 'EHR integration', 'HIPAA compliance', 'Professional support']
        }
      ]
    },
    features: [
      'Ambient conversation capture',
      'Automated clinical note generation',
      'EHR integration',
      'Real-time documentation',
      'HIPAA compliant',
      'Multi-specialty support'
    ],
    limitations: [
      'Requires physician oversight',
      'High implementation costs',
      'Limited to supported specialties',
      'Privacy and security considerations'
    ],
    rating: 4.4,
    reviewCount: 650,
    trending: true,
    featured: true,
    integrations: ['Epic', 'Cerner', 'AllScripts', 'Major EHR systems'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'medchat-ai',
    name: 'Ada Health',
    slug: 'medchat-ai',
    description: 'Ada Health is an AI-powered health assessment app that provides personalized health guidance through conversational AI. It helps users understand their symptoms and connects them with appropriate healthcare resources.',
    shortDescription: 'AI health assessment chatbot for symptom analysis',
    logo: 'https://images.pexels.com/photos/5726794/pexels-photo-5726794.jpeg',
    website: 'https://ada.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['patient-support'],
    pricing: {
      type: 'freemium',
      startingPrice: 'Free',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Personal',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Health assessment', 'Symptom analysis', 'Basic health insights', 'Limited consultations']
        },
        {
          name: 'Premium',
          price: '$9.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited assessments', 'Advanced insights', 'Priority support', 'Health tracking']
        }
      ]
    },
    features: [
      'AI symptom assessment',
      'Personalized health insights',
      'Medical knowledge base',
      'Healthcare provider recommendations',
      'Multi-language support',
      'Privacy-focused design'
    ],
    limitations: [
      'Not a replacement for professional medical advice',
      'Limited to symptom assessment',
      'Requires internet connection',
      'May not cover all medical conditions'
    ],
    rating: 4.3,
    reviewCount: 12500,
    trending: true,
    featured: false,
    integrations: ['Health apps', 'Wearable devices', 'Healthcare providers'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'mental-health-ai',
    name: 'Woebot',
    slug: 'mental-health-ai',
    description: 'Woebot is an AI-powered mental health chatbot that provides cognitive behavioral therapy (CBT) techniques and emotional support. It offers 24/7 availability for mental health assistance and mood tracking.',
    shortDescription: 'AI mental health chatbot for emotional support and therapy',
    logo: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg',
    website: 'https://woebothealth.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['patient-support'],
    pricing: {
      type: 'subscription',
      startingPrice: '$39/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Individual',
          price: '$39/month',
          billingPeriod: 'monthly',
          features: ['24/7 AI therapy support', 'CBT techniques', 'Mood tracking', 'Personalized interventions']
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['All individual features', 'Team management', 'Analytics dashboard', 'Professional support']
        }
      ]
    },
    features: [
      'AI-powered CBT therapy',
      '24/7 emotional support',
      'Mood and wellness tracking',
      'Personalized interventions',
      'Evidence-based techniques',
      'Privacy protection'
    ],
    limitations: [
      'Not a replacement for human therapy',
      'Limited to text-based interaction',
      'Subscription required for full access',
      'May not suit all therapy needs'
    ],
    rating: 4.2,
    reviewCount: 3200,
    trending: true,
    featured: false,
    integrations: ['Health apps', 'Employee wellness programs', 'Healthcare providers'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'nutrition-ai',
    name: 'MyFitnessPal AI',
    slug: 'nutrition-ai',
    description: 'MyFitnessPal AI uses machine learning to provide personalized nutrition recommendations, food recognition, and dietary insights. It helps users track nutrition, set goals, and make healthier food choices with AI assistance.',
    shortDescription: 'AI-powered nutrition tracking and dietary recommendation app',
    logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    website: 'https://www.myfitnesspal.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['patient-support'],
    pricing: {
      type: 'freemium',
      startingPrice: '$9.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Free',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['Basic food tracking', 'Calorie counting', 'Exercise logging', 'Basic insights']
        },
        {
          name: 'Premium',
          price: '$9.99/month',
          billingPeriod: 'monthly',
          features: ['AI food recognition', 'Advanced analytics', 'Personalized goals', 'Macro tracking', 'Ad-free experience']
        }
      ]
    },
    features: [
      'AI food recognition',
      'Personalized nutrition recommendations',
      'Comprehensive food database',
      'Macro and micronutrient tracking',
      'Integration with fitness devices',
      'Social support features'
    ],
    limitations: [
      'Free version has limited features',
      'Requires consistent user input',
      'May not account for all dietary restrictions',
      'Food recognition accuracy varies'
    ],
    rating: 4.4,
    reviewCount: 25600,
    trending: false,
    featured: true,
    integrations: ['Fitbit', 'Apple Health', 'Google Fit', 'Garmin', 'Samsung Health'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'pharmacy-ai',
    name: 'PillPack by Amazon',
    slug: 'pharmacy-ai',
    description: 'PillPack by Amazon uses AI to optimize medication management, providing personalized medication packaging, delivery scheduling, and drug interaction monitoring. It simplifies complex medication regimens for patients.',
    shortDescription: 'AI-powered pharmacy service for medication management',
    logo: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg',
    website: 'https://www.pillpack.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['clinical-operations'],
    pricing: {
      type: 'subscription',
      startingPrice: 'Insurance dependent',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Standard Service',
          price: 'Insurance co-pay',
          billingPeriod: 'monthly',
          features: ['Automated medication packaging', 'Delivery service', 'Medication synchronization', 'Pharmacist support']
        }
      ]
    },
    features: [
      'AI-optimized medication packaging',
      'Automated delivery scheduling',
      'Drug interaction monitoring',
      'Medication adherence tracking',
      'Insurance coordination',
      '24/7 pharmacist support'
    ],
    limitations: [
      'Limited to supported insurance plans',
      'Geographic availability restrictions',
      'Requires prescription transfer',
      'May not suit all medication types'
    ],
    rating: 4.5,
    reviewCount: 8900,
    trending: false,
    featured: false,
    integrations: ['Insurance providers', 'Healthcare systems', 'Electronic health records'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'telemedicine-ai',
    name: 'Teladoc Health AI',
    slug: 'telemedicine-ai',
    description: 'Teladoc Health AI integrates artificial intelligence into telemedicine consultations, providing clinical decision support, symptom triage, and personalized treatment recommendations during virtual healthcare visits.',
    shortDescription: 'AI-enhanced telemedicine platform for virtual healthcare',
    logo: 'https://images.pexels.com/photos/5726805/pexels-photo-5726805.jpeg',
    website: 'https://www.teladoc.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['clinical-operations'],
    pricing: {
      type: 'subscription',
      startingPrice: '$89/month',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Individual',
          price: '$89/month',
          billingPeriod: 'monthly',
          features: ['24/7 virtual consultations', 'AI-assisted diagnosis', 'Prescription services', 'Health monitoring']
        },
        {
          name: 'Family',
          price: '$189/month',
          billingPeriod: 'monthly',
          features: ['All individual features', 'Family coverage', 'Pediatric care', 'Mental health support']
        }
      ]
    },
    features: [
      'AI-powered symptom assessment',
      '24/7 virtual consultations',
      'Clinical decision support',
      'Electronic prescriptions',
      'Health monitoring integration',
      'Multi-specialty access'
    ],
    limitations: [
      'Cannot replace in-person care for serious conditions',
      'Limited physical examination capabilities',
      'Insurance coverage varies',
      'Technology requirements for access'
    ],
    rating: 4.3,
    reviewCount: 15600,
    trending: true,
    featured: true,
    integrations: ['Health insurance', 'Pharmacy networks', 'Electronic health records', 'Wearable devices'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'surgical-planning-ai',
    name: 'Surgical Theater VR',
    slug: 'surgical-planning-ai',
    description: 'Surgical Theater VR combines AI with virtual reality to create personalized 3D surgical simulations. It helps surgeons plan complex procedures, practice techniques, and improve patient outcomes through immersive visualization.',
    shortDescription: 'AI-powered VR platform for surgical planning and training',
    logo: 'https://images.pexels.com/photos/7089019/pexels-photo-7089019.jpeg',
    website: 'https://www.surgicaltheater.net',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['surgical-assistance'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Hospital License',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['VR surgical planning', 'AI-powered 3D modeling', 'Training modules', 'Professional support']
        }
      ]
    },
    features: [
      'AI-powered 3D surgical modeling',
      'VR surgical simulation',
      'Patient-specific planning',
      'Risk assessment tools',
      'Training and education modules',
      'Outcome prediction'
    ],
    limitations: [
      'High implementation costs',
      'Requires specialized hardware',
      'Limited to supported procedures',
      'Extensive training required'
    ],
    rating: 4.6,
    reviewCount: 240,
    trending: true,
    featured: true,
    integrations: ['Medical imaging systems', 'Hospital information systems', 'VR hardware'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'babylon-health-ai',
    name: 'Babylon Health AI',
    slug: 'babylon-health-ai',
    description: 'Babylon Health AI provides comprehensive digital healthcare services powered by artificial intelligence, including symptom checking, virtual consultations, health monitoring, and personalized health insights.',
    shortDescription: 'Comprehensive AI-powered digital healthcare platform',
    logo: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
    website: 'https://www.babylonhealth.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['patient-support', 'clinical-operations'],
    pricing: {
      type: 'subscription',
      startingPrice: '$9.99/month',
      hasFreeOption: true,
      tiers: [
        {
          name: 'Basic',
          price: '$0',
          billingPeriod: 'one-time',
          features: ['AI symptom checker', 'Health tracking', 'Basic insights', 'Limited consultations']
        },
        {
          name: 'Premium',
          price: '$9.99/month',
          billingPeriod: 'monthly',
          features: ['Unlimited AI consultations', 'GP appointments', 'Health monitoring', 'Prescription services']
        }
      ]
    },
    features: [
      'AI-powered symptom assessment',
      'Virtual doctor consultations',
      'Health monitoring and tracking',
      'Personalized health insights',
      'Prescription management',
      'Mental health support'
    ],
    limitations: [
      'Geographic availability limited',
      'Premium features require subscription',
      'Not suitable for emergency conditions',
      'Technology access requirements'
    ],
    rating: 4.1,
    reviewCount: 18900,
    trending: true,
    featured: false,
    integrations: ['NHS systems', 'Insurance providers', 'Pharmacy networks', 'Health apps'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'paige-ai-pathology',
    name: 'Paige.AI',
    slug: 'paige-ai-pathology',
    description: 'Paige.AI is an FDA-approved AI platform for digital pathology that assists pathologists in cancer detection and diagnosis. It provides AI-powered analysis of tissue samples with high accuracy and efficiency.',
    shortDescription: 'FDA-approved AI pathology platform for cancer detection',
    logo: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
    website: 'https://paige.ai',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['diagnostic-ai'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['AI pathology analysis', 'Cancer detection algorithms', 'Laboratory integration', 'Regulatory compliance']
        }
      ]
    },
    features: [
      'FDA-approved AI algorithms',
      'Cancer detection and classification',
      'Digital pathology workflow',
      'Quality assurance tools',
      'Integration with lab systems',
      'Continuous learning capabilities'
    ],
    limitations: [
      'Requires pathologist oversight',
      'High implementation costs',
      'Limited to approved use cases',
      'Regulatory compliance requirements'
    ],
    rating: 4.8,
    reviewCount: 180,
    trending: true,
    featured: true,
    integrations: ['Digital pathology systems', 'Laboratory information systems', 'Hospital networks'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'ibm-watson-oncology',
    name: 'IBM Watson for Oncology',
    slug: 'ibm-watson-oncology',
    description: 'IBM Watson for Oncology is an AI-powered clinical decision support system that helps oncologists identify treatment options by analyzing patient data against a vast knowledge base of medical literature and treatment guidelines.',
    shortDescription: 'AI clinical decision support system for cancer treatment',
    logo: 'https://images.pexels.com/photos/3825368/pexels-photo-3825368.jpeg',
    website: 'https://www.ibm.com/watson-health/oncology',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['diagnostic-ai', 'clinical-documentation'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Enterprise',
          price: 'Custom',
          billingPeriod: 'yearly',
          features: ['AI treatment recommendations', 'Clinical guidelines analysis', 'Patient data integration', 'Evidence-based insights']
        }
      ]
    },
    features: [
      'AI-powered treatment recommendations',
      'Evidence-based decision support',
      'Integration with medical literature',
      'Patient data analysis',
      'Clinical workflow integration',
      'Continuous knowledge updates'
    ],
    limitations: [
      'Requires oncologist oversight',
      'High implementation costs',
      'Limited to supported cancer types',
      'Complex integration requirements'
    ],
    rating: 4.2,
    reviewCount: 320,
    trending: false,
    featured: false,
    integrations: ['Electronic health records', 'Hospital information systems', 'Medical databases'],
    lastVerified: new Date('2025-06-01')
  },
  {
    id: 'veracyte-ai-genomics',
    name: 'Veracyte Genomic Classifier',
    slug: 'veracyte-ai-genomics',
    description: 'Veracyte uses AI and machine learning to analyze genomic data for cancer diagnosis and treatment decisions. Their genomic classifiers help physicians make more informed decisions about patient care through molecular insights.',
    shortDescription: 'AI-powered genomic analysis for cancer diagnosis and treatment',
    logo: 'https://images.pexels.com/photos/8617876/pexels-photo-8617876.jpeg',
    website: 'https://www.veracyte.com',
    categoryId: 'healthcare-ai',
    subcategoryIds: ['medical-research', 'diagnostic-ai'],
    pricing: {
      type: 'enterprise',
      startingPrice: 'Contact for pricing',
      hasFreeOption: false,
      tiers: [
        {
          name: 'Clinical Testing',
          price: 'Per test pricing',
          billingPeriod: 'one-time',
          features: ['Genomic analysis', 'AI classification', 'Clinical reporting', 'Professional consultation']
        }
      ]
    },
    features: [
      'AI-powered genomic classification',
      'Cancer risk assessment',
      'Treatment decision support',
      'Molecular profiling',
      'Clinical grade accuracy',
      'Comprehensive reporting'
    ],
    limitations: [
      'Limited to specific cancer types',
      'Requires tissue samples',
      'High per-test costs',
      'Insurance coverage varies'
    ],
    rating: 4.5,
    reviewCount: 290,
    trending: true,
    featured: false,
    integrations: ['Laboratory systems', 'Electronic health records', 'Pathology workflows'],
    lastVerified: new Date('2025-06-01')
  }
];