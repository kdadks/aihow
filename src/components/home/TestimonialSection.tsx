import React from 'react';
import { QuoteIcon } from 'lucide-react';
import { reviews } from '../../data/reviews';

export const TestimonialSection: React.FC = () => {
  // Get a mix of recent reviews including some with Indian names
  const featuredReviewIds = ['11', '14', '24', '22', '19', '29'];
  const testimonials = featuredReviewIds
    .map(id => reviews.find(r => r.id === id))
    .filter((review): review is NonNullable<typeof review> => review !== undefined)
    .slice(0, 6); // Show up to 6 testimonials

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Real experiences from people who found the perfect AI tools using our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 relative"
            >
              <div className="absolute top-6 right-6 text-blue-100">
                <QuoteIcon className="h-16 w-16 opacity-20" />
              </div>
              <div className="relative z-10">
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={testimonial.userAvatar}
                      alt={testimonial.userName}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{testimonial.userName}</h4>
                    <div className="mt-1 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.934l-6.18 3.254 1.18-6.875L.586 7.935l6.9-1.002L10 .714l2.514 6.219 6.9 1.002-4.414 4.377 1.18 6.875z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};