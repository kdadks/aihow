import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Globe, TrendingUp } from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'AI Tools Curated', value: '1,500+', icon: Globe },
    { label: 'Active Users', value: '50,000+', icon: Users },
    { label: 'Tool Categories', value: '25+', icon: CheckCircle },
    { label: 'Monthly Growth', value: '15%', icon: TrendingUp },
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We provide honest, unbiased information about AI tools and their capabilities, ensuring our users can make informed decisions.',
      icon: '🔍'
    },
    {
      title: 'User-Focused',
      description: 'Every feature and recommendation is designed with our users\' needs in mind, prioritizing their success above all else.',
      icon: '👥'
    },
    {
      title: 'Innovation',
      description: 'We stay ahead of AI trends to bring you the latest and most effective tools, constantly evolving our platform.',
      icon: '🚀'
    },
    {
      title: 'Quality',
      description: 'We maintain rigorous standards in our tool vetting and recommendation process to ensure reliability.',
      icon: '⭐'
    },
    {
      title: 'Accessibility',
      description: 'Making AI technology accessible to everyone, regardless of technical expertise or business size.',
      icon: '🌍'
    },
    {
      title: 'Excellence',
      description: 'Committed to delivering exceptional experiences and continuously improving our platform and services.',
      icon: '🏆'
    }
  ];

  const team = [
    {
      name: 'Deepti Sharma',
      role: 'Chief Executive Officer',
      bio: 'Former AI researcher at Stanford with 10+ years in enterprise AI solutions.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Chief Technology Officer',
      bio: 'Ex-Google engineer specializing in ML infrastructure and scalable AI systems.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of AI Research',
      bio: 'PhD in Computer Science with focus on AI ethics and responsible AI development.',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'David Kim',
      role: 'VP of Product',
      bio: 'Product leader with expertise in user experience design for AI platforms.',
      image: '/api/placeholder/150/150'
    }
  ];

  const timeline = [
    {
      year: 'March 2025',
      title: 'Company Founded',
      description: '"How2doAI" was established with a mission to democratize AI technology access.Under the Kdadks service private limited umberalla.',
    },
    {
      year: 'June 2025',
      title: 'Platform Launch',
      description: 'Launched our initial platform with 100+ curated AI tools across 10 categories.'
    },

  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About How2doAI
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Empowering individuals and businesses to harness the full potential of artificial intelligence 
              through expert curation, intelligent recommendations, and comprehensive guidance.
            </p>
            <div className="inline-flex items-center space-x-2 bg-blue-700/50 px-6 py-3 rounded-full">
              <span className="text-sm font-medium">Trusted by 50,000+ users worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At How2doAI, we're dedicated to making artificial intelligence accessible and practical for everyone. 
                Our platform helps individuals and businesses navigate the rapidly evolving landscape of AI tools, 
                ensuring they find the perfect solutions for their specific needs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">Democratize access to AI technology</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">Provide expert guidance and recommendations</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">Foster innovation through AI adoption</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 mb-6">
                To be the world's most trusted platform for AI tool discovery and implementation, 
                enabling every person and organization to leverage AI for positive impact.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What We Do</h4>
                <ul className="text-blue-800 space-y-2">
                  <li>• Curated directory of vetted AI tools</li>
                  <li>• Personalized tool recommendations</li>
                  <li>• In-depth comparisons and reviews</li>
                  <li>• Pre-built workflow bundles</li>
                  <li>• Expert guidance and support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and ensure we deliver exceptional value to our community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section - Hidden for now */}
      {/*
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Meet the experts behind How2doAI, bringing together decades of experience in AI, technology, and business.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-blue-400 mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From our founding to becoming a trusted platform for AI discovery, see how we've grown.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-blue-200 h-full"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                      <div className="text-blue-600 font-bold text-lg mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your AI Journey?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of professionals and businesses who trust How2doAI to guide their AI adoption. 
            Start exploring our curated collection of AI tools today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/directory"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
            >
              Explore AI Tools
            </Link>
            <Link
              to="/tool-finder"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-center"
            >
              Get Personalized Recommendations
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Us</h3>
              <p className="text-gray-600">support@how2doai.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Partnership Inquiries</h3>
              <p className="text-gray-600">support@how2doai.com</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Media & Press</h3>
              <p className="text-gray-600">support@how2doai.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;