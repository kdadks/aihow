import React, { useEffect } from 'react';
import { ArrowRight, Search, Sparkles, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Helmet } from 'react-helmet';

// For improving Core Web Vitals
const preloadAssets = () => {
  const preloadLinks = [
    { href: '/images/tools/chatgpt.jpg', as: 'image' },
    { href: '/images/tools/midjourney.jpg', as: 'image' }
  ];

  preloadLinks.forEach(link => {
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.href = link.href;
    preload.as = link.as;
    document.head.appendChild(preload);
  });
};

export const HeroSection: React.FC = () => {
  useEffect(() => {
    preloadAssets();
  }, []);

  // FAQ structured data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "How do I choose the right AI tool for my workflow?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Consider your specific needs, budget, and use cases. Our tool finder helps match you with the perfect AI tools based on your requirements."
      }
    }, {
      "@type": "Question",
      "name": "What are the best AI tools for content creation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Popular AI tools for content creation include ChatGPT for writing, Midjourney for images, and Descript for video editing. Compare features on our platform."
      }
    }, {
      "@type": "Question",
      "name": "How can I compare different AI tools?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Use our comparison tool to evaluate features, pricing, and capabilities side by side. Read user reviews and see detailed analysis."
      }
    }]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        {/* Mobile-specific meta tags */}
        <meta name="theme-color" content="#1D4ED8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
      </Helmet>

      <section aria-label="hero" className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 sm:py-24" itemScope itemType="https://schema.org/WebPage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight" itemProp="headline">
              <span className="block">Find and Compare the Best</span>
              <span className="block text-blue-600">AI Tools for Your Workflow</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500" itemProp="description">
              Discover, compare, and integrate top AI tools. Get personalized recommendations to enhance your productivity and creative workflow.
            </p>
            <nav className="mt-10 flex flex-wrap justify-center gap-4" aria-label="primary navigation">
              <Link to="/tool-finder">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Find Tools
                </Button>
              </Link>
              <Link to="/directory">
                <Button size="lg" variant="secondary" rightIcon={<Search className="h-5 w-5" />}>
                  Explore Tools
                </Button>
              </Link>
              <Link to="/compare">
                <Button size="lg" variant="secondary" rightIcon={<Scale className="h-5 w-5" />}>
                  Compare Tools
                </Button>
              </Link>
              <Link to="/tool-finder">
                <Button size="lg" variant="secondary" rightIcon={<Sparkles className="h-5 w-5" />}>
                  Get Recommendations
                </Button>
              </Link>
            </nav>
          </header>

          {/* FAQ Section for SEO */}
          <div className="mt-12 max-w-4xl mx-auto px-4" itemScope itemType="https://schema.org/FAQPage">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-lg font-semibold" itemProp="name">How do I choose the right AI tool for my workflow?</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-gray-600" itemProp="text">Consider your specific needs, budget, and use cases. Our tool finder helps match you with the perfect AI tools based on your requirements.</p>
                </div>
              </div>
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-lg font-semibold" itemProp="name">What are the best AI tools for content creation?</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-gray-600" itemProp="text">Popular AI tools for content creation include ChatGPT for writing, Midjourney for images, and Descript for video editing. Compare features on our platform.</p>
                </div>
              </div>
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-lg font-semibold" itemProp="name">How can I compare different AI tools?</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-gray-600" itemProp="text">Use our comparison tool to evaluate features, pricing, and capabilities side by side. Read user reviews and see detailed analysis.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto px-4" role="complementary">
            {/* First Card - Compare Tools */}
            <article className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105" itemScope itemType="https://schema.org/Article">
              <div className="p-6 sm:p-8" style={{ contain: 'content' }}>
                <div className="flex flex-col h-full">
                  <div className="flex-shrink-0 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg inline-block" aria-hidden="true">
                      <Scale className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900" itemProp="headline">Compare AI Tools</h3>
                  <p className="mt-2 text-gray-600 flex-grow" itemProp="description">
                    Compare features, pricing, and capabilities of different AI tools to make the best choice for your needs.
                  </p>
                  <Link to="/compare" className="mt-4 inline-flex items-center text-gray-600 font-medium hover:text-blue-600" rel="noopener">
                    Start comparing <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>

            {/* Second Card - Get Recommendations */}
            <article className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105" itemScope itemType="https://schema.org/Article">
              <div className="p-6 sm:p-8" style={{ contain: 'content' }}>
                <div className="flex flex-col h-full">
                  <div className="flex-shrink-0 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg inline-block" aria-hidden="true">
                      <Sparkles className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900" itemProp="headline">Not sure where to start?</h3>
                  <p className="mt-2 text-gray-600 flex-grow" itemProp="description">
                    Answer a few questions about your needs and we'll recommend the perfect AI tools for you.
                  </p>
                  <Link to="/tool-finder" className="mt-4 inline-flex items-center text-purple-600 font-medium hover:text-purple-800" rel="noopener">
                    Take the assessment <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};
