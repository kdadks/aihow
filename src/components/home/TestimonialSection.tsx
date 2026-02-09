import React from 'react';
import { QuoteIcon } from 'lucide-react';
import { reviews } from '../../data/reviews';

export const TestimonialSection: React.FC = () => {
  const featuredReviewIds = ['11', '14', '24', '22', '19', '29'];
  const testimonials = featuredReviewIds
    .map(id => reviews.find(r => r.id === id))
    .filter((review): review is NonNullable<typeof review> => review !== undefined)
    .slice(0, 6);

  // Duplicate cards for seamless infinite loop
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <style>{`
        @keyframes marquee-rtl {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee-rtl 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Real experiences from people who found the perfect AI tools using our platform
          </p>
        </div>
      </div>

      {/* Full-width marquee track */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="marquee-track flex gap-5 w-max px-4">
          {doubled.map((testimonial, idx) => (
            <div
              key={`${testimonial.id}-${idx}`}
              className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-md shadow-gray-100/80 border border-gray-100 p-6 relative overflow-hidden hover:shadow-lg hover:shadow-violet-100/40 transition-shadow duration-300"
            >
              {/* Decorative quote */}
              <div className="absolute top-4 right-4 text-violet-100">
                <QuoteIcon className="h-12 w-12 opacity-30" />
              </div>

              {/* Accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400" />

              <div className="relative z-10">
                <p className="text-gray-600 text-sm leading-relaxed italic mb-5">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  {/* Avatar initial */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-violet-600">
                      {testimonial.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{testimonial.userName}</h4>
                    <div className="mt-0.5 flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < testimonial.rating ? 'text-amber-400' : 'text-gray-200'
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
