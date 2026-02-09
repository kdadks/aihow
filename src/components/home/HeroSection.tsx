import React, { useEffect } from 'react';
import { ArrowRight, Search, Sparkles, Scale, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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
        <meta name="theme-color" content="#7C3AED" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
      </Helmet>

      <section
        aria-label="hero"
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50/60 pb-14 sm:pb-20 -mt-20"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        {/* Decorative background orbs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-cyan-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-center">

            {/* LEFT: Hero content */}
            <header>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-100 text-violet-700 text-sm font-semibold mb-6">
                <Zap className="h-3.5 w-3.5 fill-violet-500 text-violet-500" />
                <span>AI Tool Discovery Platform</span>
              </div>

              {/* H1 */}
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold text-gray-900 tracking-tight leading-[1.1]"
                itemProp="headline"
              >
                <span className="block">Find and Compare</span>
                <span className="block bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent py-1">
                  the Best AI Tools
                </span>
                <span className="block">for Your Workflow</span>
              </h1>

              {/* Description */}
              <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-xl" itemProp="description">
                Discover, compare, and integrate top AI tools. Get personalized recommendations to enhance your productivity and creative workflow.
              </p>

              {/* CTA Buttons */}
              <nav className="mt-8 flex flex-wrap gap-3" aria-label="primary navigation">
                <Link to="/tool-finder">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-violet-200/60 hover:shadow-xl hover:shadow-violet-300/50 hover:-translate-y-0.5 transition-all duration-200">
                    Find Tools
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link to="/directory">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:border-violet-200 hover:text-violet-700 shadow-sm hover:shadow-md transition-all duration-200">
                    Explore Tools
                    <Search className="h-4 w-4" />
                  </button>
                </Link>
                <Link to="/compare">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:border-violet-200 hover:text-violet-700 shadow-sm hover:shadow-md transition-all duration-200">
                    Compare Tools
                    <Scale className="h-4 w-4" />
                  </button>
                </Link>
                <Link to="/tool-finder">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold text-sm hover:border-violet-200 hover:text-violet-700 shadow-sm hover:shadow-md transition-all duration-200">
                    Get Recommendations
                    <Sparkles className="h-4 w-4" />
                  </button>
                </Link>
              </nav>

              {/* Trust badges */}
              <div className="mt-10 flex items-center gap-3 flex-wrap">
                {[
                  '500+ AI Tools',
                  'Free to Use',
                  'Updated Daily',
                ].map((badge) => (
                  <div key={badge} className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </header>

            {/* RIGHT: Feature Cards */}
            <div className="flex flex-col gap-4" role="complementary">
              {/* Compare AI Tools Card */}
              <article
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-100/80 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/60 hover:-translate-y-1 transition-all duration-300"
                itemScope
                itemType="https://schema.org/Article"
              >
                {/* Gradient accent bar */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-indigo-500" />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-md shadow-blue-200/50">
                      <Scale className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900" itemProp="headline">
                        Compare AI Tools
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed" itemProp="description">
                        Compare features, pricing, and capabilities of different AI tools side by side to make the best choice for your needs.
                      </p>
                      {/* Feature tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {['Features', 'Pricing', 'Integrations', 'Reviews'].map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        to="/compare"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 group-hover:gap-2.5 transition-all duration-200"
                        rel="noopener"
                      >
                        Start comparing
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>

              {/* Not sure where to start Card */}
              <article
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-100/80 border border-gray-100 hover:shadow-xl hover:shadow-purple-100/60 hover:-translate-y-1 transition-all duration-300"
                itemScope
                itemType="https://schema.org/Article"
              >
                {/* Gradient accent bar */}
                <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400" />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-md shadow-purple-200/50">
                      <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900" itemProp="headline">
                        Not sure where to start?
                      </h3>
                      <p className="mt-1.5 text-sm text-gray-500 leading-relaxed" itemProp="description">
                        Answer a few questions about your needs and we'll recommend the perfect AI tools for you.
                      </p>
                      {/* Feature tags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {['Personalized', 'Quick', 'Free'].map(tag => (
                          <span key={tag} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        to="/tool-finder"
                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 group-hover:gap-2.5 transition-all duration-200"
                        rel="noopener"
                      >
                        Take the assessment
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* FAQ Section for SEO — visually minimal below the hero */}
          <div className="mt-16 pt-12 border-t border-gray-100 max-w-4xl mx-auto" itemScope itemType="https://schema.org/FAQPage">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-sm font-semibold text-gray-800" itemProp="name">How do I choose the right AI tool?</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="mt-1.5 text-sm text-gray-500" itemProp="text">
                    Consider your specific needs, budget, and use cases. Our tool finder helps match you with the perfect AI tools.
                  </p>
                </div>
              </div>
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-sm font-semibold text-gray-800" itemProp="name">Best AI tools for content creation?</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="mt-1.5 text-sm text-gray-500" itemProp="text">
                    Popular options include ChatGPT for writing, Midjourney for images, and Descript for video editing.
                  </p>
                </div>
              </div>
              <div itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <h3 className="text-sm font-semibold text-gray-800" itemProp="name">How can I compare AI tools?</h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="mt-1.5 text-sm text-gray-500" itemProp="text">
                    Use our comparison tool to evaluate features, pricing, and capabilities side by side with detailed analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
