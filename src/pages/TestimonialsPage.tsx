import React from 'react';
import { Link } from 'react-router-dom';
import { TestimonialCard } from '../components/testimonials/TestimonialCard';
import { FileText, Users, BarChart3 } from 'lucide-react';
import { testimonials, caseStudies } from '../data/community';

const TestimonialsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Customer Success Stories
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          See how organizations are transforming their workflows with AI tools recommended by our platform.
        </p>
        
        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="font-medium">{testimonials.length} Success Stories</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">4.8/5 Average Rating</span>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {testimonials.map((testimonial, index) => (
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
              <Link
                to={study.link}
                className="text-blue-600 hover:underline font-medium"
              >
                Read full case study →
              </Link>
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
        <Link
          to="/directory"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore AI Tools
        </Link>
      </div>
    </div>
  );
};

export default TestimonialsPage;