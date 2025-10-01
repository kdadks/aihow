import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoConfig } from '../config/seoConfig';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  noindex?: boolean;
  structuredData?: object;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  article,
  noindex = false,
  structuredData
}) => {
  const pageTitle = title ? `${title} | ${seoConfig.site.name}` : `${seoConfig.site.name} - Compare 100+ AI Tools, ChatGPT Alternatives & Workflow Automation Solutions`;
  const pageDescription = description || seoConfig.site.description;
  const pageImage = ogImage || `${seoConfig.site.url}${seoConfig.site.image}`;
  const pageUrl = canonicalUrl || seoConfig.site.url;

  // Combine keywords
  const allKeywords = [
    ...seoConfig.keywords.primary,
    ...seoConfig.keywords.secondary.slice(0, 10),
    ...keywords
  ].join(', ');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={allKeywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={seoConfig.site.name} />
      <meta property="og:locale" content={seoConfig.social.openGraph.locale} />

      {/* Article specific */}
      {article && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content={seoConfig.social.twitter.card} />
      <meta property="twitter:url" content={pageUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={pageImage} />
      <meta property="twitter:site" content={seoConfig.social.twitter.site} />
      <meta property="twitter:creator" content={seoConfig.social.twitter.creator} />

      {/* Additional SEO tags */}
      <meta name="author" content={seoConfig.site.name} />
      <meta name="publisher" content={seoConfig.site.name} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Mobile App / Web App */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={seoConfig.site.name} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Default Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(seoConfig.structuredData.organization)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(seoConfig.structuredData.website)}
      </script>

      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};
