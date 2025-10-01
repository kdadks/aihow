// SEO Configuration for How2doAI
export const seoConfig = {
  site: {
    name: 'How2doAI',
    url: 'https://how2doai.com',
    description: 'Compare 100+ ChatGPT alternatives & AI tools. Get expert recommendations for your specific workflow needs.',
    twitter: '@how2doai',
    image: '/og-image.jpg',
    logo: '/logo.png'
  },

  keywords: {
    primary: [
      'AI', 'artificial intelligence', 'How2do AI', 'how to AI', 'AI tools', 'AI Apps',
      'chatgpt', 'copilot', 'workflow automation', 'Agentic AI', 'machine learning',
      'digital transformation', 'content automation', 'web development AI'
    ],
    secondary: [
      'AI workflow', 'ChatGPT alternatives', 'Copilot alternatives',
      'AI tool comparison', 'productivity AI', 'best AI tools 2025',
      'AI automation', 'AI software', 'machine learning tools',
      'AI assistants', 'AI platforms', 'workflow optimization',
      'digital transformation tools', 'content automation tools',
      'AI for web development', 'ML platforms', 'AI agents',
      'autonomous AI', 'generative AI', 'AI productivity suite'
    ],
    longTail: [
      'best AI tools for productivity', 'ChatGPT vs Copilot comparison',
      'AI workflow automation tools', 'agentic AI platforms',
      'AI tool recommendations 2025', 'automate workflows with AI',
      'AI assistants comparison', 'best AI apps for business',
      'machine learning tools for developers', 'digital transformation with AI',
      'content automation software', 'AI tools for web development',
      'automated content generation', 'AI-powered workflow management',
      'enterprise AI solutions', 'AI for digital marketing',
      'autonomous AI agents', 'generative AI platforms',
      'AI content creation tools', 'ML automation platforms'
    ]
  },

  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'How2doAI',
      description: 'Leading AI tools comparison and recommendation platform',
      url: 'https://how2doai.com',
      logo: 'https://how2doai.com/logo.png',
      foundingDate: '2024',
      knowsAbout: [
        'Artificial Intelligence',
        'AI Tools',
        'Workflow Automation',
        'ChatGPT Alternatives',
        'Copilot Alternatives',
        'Agentic AI',
        'Machine Learning Tools',
        'AI Productivity',
        'Digital Transformation',
        'Content Automation',
        'Web Development AI',
        'Generative AI',
        'AI Agents',
        'ML Platforms',
        'Enterprise AI Solutions'
      ]
    },

    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'How2doAI',
      description: 'Comprehensive AI tool comparison and recommendation platform',
      url: 'https://how2doai.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://how2doai.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },

    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are the best AI tools for workflow automation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The best AI tools for workflow automation include ChatGPT, Copilot, Zapier, Make.com, and specialized tools like SmythOS for agentic AI. We compare 100+ tools to help you find the perfect combination for your needs.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I choose the right AI tool for my business?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use our AI Tool Finder to get personalized recommendations based on your workflow, budget, and specific requirements. We analyze features, pricing, user reviews, and integration capabilities.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is Agentic AI and how can it help my productivity?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Agentic AI refers to AI systems that can act autonomously to achieve goals. Tools like SmythOS and AutoGPT help automate complex workflows, make decisions, and execute tasks with minimal human intervention.'
          }
        }
      ]
    }
  },

  social: {
    twitter: {
      card: 'summary_large_image',
      site: '@how2doai',
      creator: '@how2doai'
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'How2doAI'
    }
  },

  robots: {
    userAgent: '*',
    allow: [
      '/tool-finder',
      '/directory',
      '/compare',
      '/workflows',
      '/ai-tools',
      '/agentic-ai',
      '/workflow-automation',
      '/copilot-alternatives'
    ],
    disallow: [
      '/search?*',
      '/*?ref=*',
      '/*?source=*',
      '/*?utm_*',
      '/dashboard*',
      '/admin*',
      '/api/*'
    ],
    crawlDelay: 1,
    sitemaps: [
      'https://how2doai.com/sitemap.xml',
      'https://how2doai.com/sitemap-tools.xml',
      'https://how2doai.com/sitemap-reviews.xml',
      'https://how2doai.com/sitemap-blog.xml',
      'https://how2doai.com/sitemap-ai-keywords.xml'
    ]
  }
};

export default seoConfig;
