/**
 * Backlink Strategy Utilities for How2doAI
 * Comprehensive tools for improving Domain Strength (currently 5) and Page Strength (currently 4)
 */

export interface BacklinkMetrics {
  domainStrength: number;
  pageStrength: number;
  totalBacklinks: number;
  uniqueDomains: number;
  anchorText: Record<string, number>;
  linkTypes: {
    dofollow: number;
    nofollow: number;
    sponsored: number;
    ugc: number;
  };
  topPages: Array<{
    url: string;
    backlinks: number;
    domainStrength: number;
  }>;
}

export interface LinkBuildingOpportunity {
  type: 'guest_post' | 'resource_page' | 'broken_link' | 'competitor' | 'social_mention';
  targetUrl: string;
  opportunity: string;
  difficulty: 'easy' | 'medium' | 'hard';
  potentialValue: number;
  contactInfo?: string;
}

export class BacklinkStrategy {
  private static readonly SITE_URL = 'https://how2doai.com';

  /**
   * Generate internal linking suggestions for better link equity distribution
   */
  static generateInternalLinkSuggestions(content: string, currentUrl: string): Array<{
    anchorText: string;
    targetUrl: string;
    context: string;
  }> {
    const suggestions = [];
    const aiKeywords = [
      'AI tools', 'ChatGPT alternatives', 'workflow automation',
      'artificial intelligence', 'AI workflow', 'productivity AI'
    ];

    // Find relevant keywords in content
    for (const keyword of aiKeywords) {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        const targetPages = this.getRelevantTargetPages(keyword);
        for (const page of targetPages) {
          if (page.url !== currentUrl) {
            suggestions.push({
              anchorText: keyword,
              targetUrl: page.url,
              context: `Internal link opportunity for "${keyword}"`
            });
          }
        }
      }
    }

    return suggestions.slice(0, 5); // Limit to top 5 suggestions
  }

  /**
   * Get relevant target pages for internal linking
   */
  private static getRelevantTargetPages(keyword: string): Array<{ url: string; relevance: number }> {
    const pageMap: Record<string, string[]> = {
      'AI tools': ['/directory', '/tool-finder'],
      'ChatGPT alternatives': ['/directory?category=writing', '/compare/chatgpt-vs-copilot'],
      'workflow automation': ['/workflows', '/enterprise'],
      'artificial intelligence': ['/ai-guide', '/blog/ai-trends-2025'],
      'AI workflow': ['/workflows', '/productivity-guide'],
      'productivity AI': ['/directory?category=productivity', '/productivity-guide']
    };

    return (pageMap[keyword] || []).map(url => ({
      url: `${this.SITE_URL}${url}`,
      relevance: 1
    }));
  }

  /**
   * Generate link-worthy content ideas for backlink attraction
   */
  static generateLinkWorthyContentIdeas(): Array<{
    title: string;
    type: string;
    targetKeywords: string[];
    estimatedBacklinks: number;
    difficulty: string;
  }> {
    return [
      {
        title: 'The Ultimate Guide to AI Tools in 2025',
        type: 'comprehensive_guide',
        targetKeywords: ['AI tools guide', 'best AI tools 2025', 'AI tools comparison'],
        estimatedBacklinks: 50,
        difficulty: 'medium'
      },
      {
        title: 'ChatGPT vs Claude vs Gemini: Complete Comparison',
        type: 'comparison',
        targetKeywords: ['ChatGPT vs Claude', 'AI comparison', 'best AI chatbot'],
        estimatedBacklinks: 75,
        difficulty: 'hard'
      },
      {
        title: 'AI Workflow Automation: 10 Real Examples',
        type: 'case_studies',
        targetKeywords: ['AI workflow automation', 'automation examples', 'AI use cases'],
        estimatedBacklinks: 40,
        difficulty: 'medium'
      },
      {
        title: 'Free AI Tools Directory (Updated Daily)',
        type: 'resource_page',
        targetKeywords: ['free AI tools', 'AI tools directory', 'free AI software'],
        estimatedBacklinks: 100,
        difficulty: 'easy'
      },
      {
        title: 'How to Choose the Right AI Tool for Your Business',
        type: 'decision_guide',
        targetKeywords: ['choose AI tool', 'AI tool selection', 'business AI tools'],
        estimatedBacklinks: 35,
        difficulty: 'medium'
      }
    ];
  }

  /**
   * Analyze content for link building potential
   */
  static analyzeContentForLinkBuilding(content: string): {
    score: number;
    suggestions: string[];
    opportunities: LinkBuildingOpportunity[];
  } {
    let score = 0;
    const suggestions = [];
    const opportunities: LinkBuildingOpportunity[] = [];

    // Check for comprehensive content
    if (content.length > 2000) {
      score += 20;
    } else {
      suggestions.push('Expand content to 2000+ words for better link attraction');
    }

    // Check for data/statistics
    if (content.includes('study') || content.includes('research') || content.includes('%')) {
      score += 15;
    } else {
      suggestions.push('Add data, statistics, or research to make content more link-worthy');
    }

    // Check for unique insights
    if (content.includes('analysis') || content.includes('comparison') || content.includes('review')) {
      score += 15;
    } else {
      suggestions.push('Include unique analysis or comparisons');
    }

    // Check for actionable content
    if (content.includes('how to') || content.includes('guide') || content.includes('tutorial')) {
      score += 20;
    } else {
      suggestions.push('Make content more actionable with step-by-step guides');
    }

    // Check for visual elements
    if (content.includes('image') || content.includes('chart') || content.includes('infographic')) {
      score += 10;
    } else {
      suggestions.push('Add visual elements like charts or infographics');
    }

    // Generate opportunities based on content
    if (score >= 60) {
      opportunities.push({
        type: 'guest_post',
        targetUrl: '',
        opportunity: 'Repurpose as guest post for industry blogs',
        difficulty: 'medium',
        potentialValue: 8
      });
    }

    return { score, suggestions, opportunities };
  }

  /**
   * Generate outreach email templates for link building
   */
  static generateOutreachTemplates(): Array<{
    type: string;
    subject: string;
    template: string;
  }> {
    return [
      {
        type: 'broken_link',
        subject: 'Broken Link Opportunity on Your AI Tools Page',
        template: `Hi [Name],

I noticed a broken link on your page about [Topic] pointing to [Broken URL].

I have comprehensive information about [Related Topic] that would be perfect for your readers.

Would you consider updating the link to point to: [Your Content URL]

This would provide your visitors with current, valuable information about [Topic].

Best regards,
[Your Name]
How2doAI`
      },
      {
        type: 'resource_page',
        subject: 'Would Your Readers Benefit from Our Free AI Tools Directory?',
        template: `Hi [Name],

I came across your excellent article about [Topic] and thought your readers might benefit from our comprehensive AI tools directory.

We maintain an updated list of [Number]+ AI tools with detailed reviews and comparisons.

Would you consider adding a link to our directory? Here's what we'd suggest:
Anchor text: "comprehensive AI tools directory"
URL: https://how2doai.com/directory

We're happy to provide a reciprocal link back to your site as well.

Best,
[Your Name]
How2doAI`
      },
      {
        type: 'guest_post',
        subject: 'Guest Post Opportunity: AI Tools Guide for [Their Audience]',
        template: `Hi [Name],

I enjoyed your recent post about [Their Recent Post Topic]. Your audience seems very engaged with [Related Topic].

I have extensive experience with AI tools and workflow automation, and I'd love to contribute a guest post about [Specific Topic Related to Their Content].

The proposed title: "[Compelling Title Related to Their Niche]"

Would this be of interest to your readers?

Best regards,
[Your Name]
How2doAI`
      }
    ];
  }

  /**
   * Monitor backlink health and identify issues
   */
  static analyzeBacklinkHealth(metrics: BacklinkMetrics): {
    health: 'excellent' | 'good' | 'fair' | 'poor';
    issues: string[];
    recommendations: string[];
  } {
    const issues = [];
    const recommendations = [];

    // Domain Strength Analysis
    if (metrics.domainStrength < 5) {
      issues.push('Low domain strength - focus on high-quality backlinks');
      recommendations.push('Prioritize backlinks from domains with DA 30+');
    }

    // Page Strength Analysis
    if (metrics.pageStrength < 4) {
      issues.push('Low page strength - improve individual page authority');
      recommendations.push('Create cornerstone content and build internal links');
    }

    // Backlink Diversity
    if (metrics.uniqueDomains < 20) {
      issues.push('Limited domain diversity - too few unique linking domains');
      recommendations.push('Expand outreach to different types of websites');
    }

    // Link Types Balance
    const nofollowPercentage = (metrics.linkTypes.nofollow / metrics.totalBacklinks) * 100;
    if (nofollowPercentage > 70) {
      issues.push('Too many nofollow links - focus on dofollow opportunities');
      recommendations.push('Prioritize dofollow backlinks for better SEO value');
    }

    // Anchor Text Diversity
    const anchorTexts = Object.keys(metrics.anchorText);
    if (anchorTexts.length < 5) {
      issues.push('Limited anchor text diversity - over-optimization risk');
      recommendations.push('Use varied, natural anchor text in outreach');
    }

    // Determine overall health
    let health: 'excellent' | 'good' | 'fair' | 'poor' = 'poor';
    if (issues.length === 0) health = 'excellent';
    else if (issues.length <= 2) health = 'good';
    else if (issues.length <= 4) health = 'fair';

    return { health, issues, recommendations };
  }
}

export default BacklinkStrategy;
