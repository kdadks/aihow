import React from 'react';
import { SEO } from '../components/ui/SEO';
import { useSEO, seoConfigs } from '../hooks/useSEO';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedTools } from '../components/home/FeaturedTools';
import { WorkflowSection } from '../components/home/WorkflowSection';
import { TestimonialSection } from '../components/home/TestimonialSection';
import { CallToAction } from '../components/home/CallToAction';

const HomePage: React.FC = () => {
  const seoConfig = useSEO(seoConfigs.home);

  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'How2doAI',
    description: 'Comprehensive AI tool comparison and recommendation platform',
    url: 'https://how2doai.com',
    logo: 'https://how2doai.com/logo.png',
    sameAs: [
      'https://twitter.com/how2doai',
      'https://www.linkedin.com/company/how2doai'
    ],
    offers: {
      '@type': 'Offer',
      category: 'AI Tools & Software',
      description: 'AI tool recommendations and comparisons'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '256'
    }
  };

  return (
    <>
      <SEO
        {...seoConfig}
        structuredData={homeStructuredData}
        breadcrumbs={[{ name: 'Home', url: '/' }]}
      />
      <div className="min-h-screen">
        <HeroSection />
        <FeaturedTools />
        <WorkflowSection />
        <TestimonialSection />
        <CallToAction />
      </div>
    </>
  );
};

export default HomePage;