import { seoConfig } from '../config/seoConfig';

export class SEOUtils {
  /**
   * Generate SEO-optimized title with AI keywords
   */
  static generateTitle(baseTitle: string, includeKeywords: string[] = []): string {
    const keywords = [...seoConfig.keywords.primary, ...includeKeywords]
      .slice(0, 3)
      .join(' ');
    return `${baseTitle} - ${keywords} | ${seoConfig.site.name}`;
  }

  /**
   * Generate SEO-optimized description with AI keywords
   */
  static generateDescription(baseDescription: string, focusKeywords: string[] = []): string {
    const keywords = [...seoConfig.keywords.primary, ...focusKeywords]
      .slice(0, 5)
      .join(', ');
    return `${baseDescription} Featuring ${keywords}.`;
  }

  /**
   * Generate comprehensive keywords array
   */
  static generateKeywords(additionalKeywords: string[] = []): string[] {
    return [
      ...seoConfig.keywords.primary,
      ...seoConfig.keywords.secondary,
      ...additionalKeywords
    ];
  }

  /**
   * Generate breadcrumb structured data
   */
  static generateBreadcrumbs(items: Array<{ name: string; url: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${seoConfig.site.url}${item.url}`
      }))
    };
  }

  /**
   * Generate product structured data for AI tools
   */
  static generateProductSchema(product: {
    name: string;
    description: string;
    image: string;
    url: string;
    rating?: number;
    reviewCount?: number;
    price?: string;
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: product.name,
      description: product.description,
      image: product.image,
      url: product.url,
      applicationCategory: 'AI Tool',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: product.price || '0',
        priceCurrency: 'USD'
      },
      ...(product.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 1
        }
      })
    };
  }

  /**
   * Generate article structured data for blog posts
   */
  static generateArticleSchema(article: {
    headline: string;
    description: string;
    image: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    author: string;
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.headline,
      description: article.description,
      image: article.image,
      url: article.url,
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: seoConfig.site.name,
        logo: {
          '@type': 'ImageObject',
          url: `${seoConfig.site.url}${seoConfig.site.logo}`
        }
      }
    };
  }

  /**
   * Check if URL contains AI-related keywords
   */
  static isAIRelevant(url: string): boolean {
    const aiKeywords = [
      'ai', 'artificial-intelligence', 'chatgpt', 'copilot', 'automation',
      'workflow', 'agentic', 'machine-learning', 'productivity'
    ];

    return aiKeywords.some(keyword =>
      url.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Generate meta robots directive
   */
  static generateRobotsDirective(options: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    maxSnippet?: number;
    maxImagePreview?: string;
    maxVideoPreview?: number;
  } = {}): string {
    const {
      index = true,
      follow = true,
      noarchive = false,
      nosnippet = false,
      maxSnippet = -1,
      maxImagePreview = 'large',
      maxVideoPreview = -1
    } = options;

    const directives = [];

    if (index && follow) directives.push('index, follow');
    else if (index) directives.push('index, nofollow');
    else if (follow) directives.push('noindex, follow');
    else directives.push('noindex, nofollow');

    if (noarchive) directives.push('noarchive');
    if (nosnippet) directives.push('nosnippet');

    if (maxSnippet > 0) directives.push(`max-snippet:${maxSnippet}`);
    if (maxImagePreview) directives.push(`max-image-preview:${maxImagePreview}`);
    if (maxVideoPreview > 0) directives.push(`max-video-preview:${maxVideoPreview}`);

    return directives.join(', ');
  }
}

export default SEOUtils;
