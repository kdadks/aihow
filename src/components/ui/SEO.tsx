import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
  noindex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  linkProps?: {
    follow?: boolean;
    sponsored?: boolean;
    ugc?: boolean;
    noreferrer?: boolean;
  };
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = 'website',
  structuredData,
  noindex = false,
  breadcrumbs,
  linkProps = {}
}) => {
  const siteName = 'How2doAI';
  const siteUrl = 'https://how2doai.com';
  const defaultTitle = 'How2doAI - Top AI Tools & ChatGPT Alternatives';
  const defaultDescription = 'Compare 100+ ChatGPT alternatives & AI tools. Get expert recommendations for your workflow needs. Boost productivity with perfect AI combinations. Updated 2025.';
  const defaultKeywords = [
    'AI', 'How2do AI', 'how to AI', 'AI tools', 'AI Apps', 'chatgpt', 'copilot',
    'workflow automation', 'Agentic AI', 'artificial intelligence', 'AI workflow',
    'ChatGPT alternatives', 'AI tool comparison', 'productivity AI', 'best AI tools 2025'
  ];

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const allKeywords = [...defaultKeywords, ...keywords].join(', ');
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const ogImageUrl = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/og-image.jpg`;

  // Generate link relationship attributes for backlink strategy
  const generateLinkAttributes = () => {
    const attrs = [];
    if (linkProps.follow === false) attrs.push('nofollow');
    if (linkProps.sponsored) attrs.push('sponsored');
    if (linkProps.ugc) attrs.push('ugc');
    if (linkProps.noreferrer) attrs.push('noreferrer');
    return attrs.length > 0 ? attrs.join(' ') : 'follow';
  };

  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      description: fullDescription,
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      // Add backlink-related structured data
      sameAs: [
        'https://twitter.com/how2doai',
        'https://www.linkedin.com/company/how2doai',
        'https://github.com/kdadks/aihow'
      ]
    };

    if (structuredData) {
      return [baseData, structuredData];
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${siteUrl}${crumb.url}`
        }))
      };
      return [baseData, breadcrumbData];
    }

    return [baseData];
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={siteName} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : `index, ${generateLinkAttributes()}, max-snippet:-1, max-image-preview:large, max-video-preview:-1`} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:creator" content="@how2doai" />
      <meta name="twitter:site" content="@how2doai" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#1f2937" />
      <meta name="msapplication-TileColor" content="#1f2937" />
      <meta name="application-name" content={siteName} />

      {/* Structured Data */}
      {generateStructuredData().map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data, null, 2)}
        </script>
      ))}

      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};
