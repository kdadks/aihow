import React, { useState } from 'react';
import { TestimonialCard } from '../components/testimonials/TestimonialCard';
import { FileText, Play } from 'lucide-react';
import { testimonials, caseStudies } from '../data/community';

const TestimonialsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'video'>('all');

  const filteredTestimonials = filter === 'all'
    ? testimonials
    : testimonials.filter(t => t.videoUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Customer Success Stories
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          See how organizations are transforming their workflows with AI tools recommended by our platform.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Testimonials
        </button>
        <button
          onClick={() => setFilter('video')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            filter === 'video'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Video Stories</span>
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {filteredTestimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>

      {/* Case Studies Section */}
      <div className="bg-gray-50 rounded-2xl p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Detailed Case Studies
          </h2>
          <p className="text-gray-600">
            Deep dive into how organizations achieved success with AI tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
            >
              <FileText className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {study.title}
              </h3>
              <p className="text-gray-600 mb-4">{study.company}</p>
              <ul className="space-y-2 mb-6">
                {study.metrics.map((metric, i) => (
                  <li key={i} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    {metric}
                  </li>
                ))}
              </ul>
              <a
                href={study.link}
                className="text-blue-600 hover:underline font-medium"
              >
                Read full case study →
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of successful organizations using our AI tool recommendations to optimize their operations.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Explore AI Tools
        </button>
      </div>
    </div>
  );
};

export default TestimonialsPage;