import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About how2AI</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                At how2AI, we're dedicated to making artificial intelligence accessible and practical for everyone. 
                Our platform helps individuals and businesses navigate the rapidly evolving landscape of AI tools, 
                ensuring they find the perfect solutions for their specific needs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">What We Do</h2>
              <p className="text-gray-600 mb-4">
                We provide comprehensive, unbiased comparisons and recommendations for AI tools across various categories:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Curated directory of vetted AI tools</li>
                <li>Personalized tool recommendations</li>
                <li>In-depth comparisons and reviews</li>
                <li>Pre-built workflow bundles</li>
                <li>Expert guidance and support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Transparency</h3>
                  <p className="text-gray-600">
                    We provide honest, unbiased information about AI tools and their capabilities.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">User-Focused</h3>
                  <p className="text-gray-600">
                    Every feature and recommendation is designed with our users' needs in mind.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    We stay ahead of AI trends to bring you the latest and most effective tools.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Quality</h3>
                  <p className="text-gray-600">
                    We maintain high standards in our tool vetting and recommendation process.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Join Our Journey</h2>
              <p className="text-gray-600">
                We're on a mission to democratize AI technology and help everyone harness its potential. 
                Whether you're a business looking to optimize operations, a creator seeking to enhance your work, 
                or simply curious about AI, we're here to guide you every step of the way.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;