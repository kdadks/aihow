import { useMemo } from 'react';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noindex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

export const useSEO = (config: SEOConfig = {}) => {
  const seoConfig = useMemo(() => {
    const baseKeywords = [
      'AI', 'How2do AI', 'how to AI', 'AI tools', 'AI Apps', 'chatgpt', 'copilot',
      'workflow automation', 'Agentic AI', 'artificial intelligence', 'AI workflow',
      'ChatGPT alternatives', 'AI tool comparison', 'productivity AI', 'best AI tools 2025'
    ];

    return {
      keywords: [...baseKeywords, ...(config.keywords || [])],
      ...config
    };
  }, [config]);

  return seoConfig;
};

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: 'Best ChatGPT & AI Tools Comparison 2025',
    description: 'Compare 100+ ChatGPT alternatives & AI tools. Get expert recommendations for your specific workflow needs. Boost productivity with the perfect AI tool combination.',
    keywords: ['AI tools directory', 'ChatGPT comparison', 'AI workflow tools', 'productivity apps']
  },

  directory: {
    title: 'AI Tools Directory - Complete Guide to AI Applications',
    description: 'Browse our comprehensive directory of AI tools and applications. Find the perfect AI solution for your workflow automation needs.',
    keywords: ['AI tools directory', 'AI applications', 'AI software', 'workflow automation tools']
  },

  toolFinder: {
    title: 'AI Tool Finder - Get Personalized AI Recommendations',
    description: 'Answer a few questions and get personalized AI tool recommendations tailored to your specific workflow and needs.',
    keywords: ['AI tool finder', 'personalized AI recommendations', 'AI workflow assessment']
  },

  workflows: {
    title: 'AI Workflow Automation - Streamline Your Processes',
    description: 'Discover AI-powered workflow automation solutions. Learn how to optimize your productivity with intelligent automation tools.',
    keywords: ['workflow automation', 'AI automation', 'process optimization', 'productivity tools']
  },

  compare: {
    title: 'Compare AI Tools - Side-by-Side AI Tool Comparison',
    description: 'Compare AI tools side-by-side. Make informed decisions with detailed feature comparisons and user reviews.',
    keywords: ['compare AI tools', 'AI tool comparison', 'feature comparison', 'AI reviews']
  },

  blog: {
    title: 'AI Tools Blog - Latest AI News & Tutorials',
    description: 'Stay updated with the latest AI tools news, tutorials, and insights. Learn how to leverage AI for better productivity.',
    keywords: ['AI blog', 'AI tutorials', 'AI news', 'AI insights', 'productivity tips']
  },

  bundles: {
    title: 'AI Tool Bundles - Curated AI Tool Collections',
    description: 'Explore curated bundles of AI tools designed for specific use cases. Save time and money with our expert-recommended tool combinations.',
    keywords: ['AI tool bundles', 'curated AI tools', 'AI tool packages', 'workflow bundles']
  }
};
