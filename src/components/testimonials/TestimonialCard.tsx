import React, { useState } from 'react';
import { Star, Play, X } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  rating: number;
  videoUrl?: string;
  tags?: string[];
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  role,
  company,
  content,
  image,
  rating,
  videoUrl,
  tags
}) => {
  const [showVideo, setShowVideo] = useState(false);

  const VideoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        <button
          onClick={() => setShowVideo(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="w-6 h-6" />
        </button>
        <video
          controls
          autoPlay
          className="w-full h-auto"
          src={videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="relative">
          {videoUrl ? (
            <div className="relative">
              <img
                src={image}
                alt={`${name}'s testimonial`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <button 
                  onClick={() => setShowVideo(true)}
                  className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition transform hover:scale-105"
                >
                  <Play className="w-8 h-8 text-blue-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={image}
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  <p className="text-sm text-gray-600">{role} at {company}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <blockquote className="text-gray-600 mb-4">
            "{content}"
          </blockquote>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showVideo && <VideoModal />}
    </>
  );
};

export default TestimonialCard;