import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Users, Settings, Rocket, LifeBuoy } from 'lucide-react';

interface ProcessSectionProps {
  showContactButton?: boolean;
  className?: string;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ 
  showContactButton = true, 
  className = "" 
}) => {
  const navigate = useNavigate();

  const processSteps = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'We discuss your specific needs, current workflow challenges, and desired outcomes to understand your requirements.',
      details: [
        'Requirement analysis and goal setting',
        'Current workflow assessment',
        'Success criteria definition',
        'Timeline and budget discussion'
      ],
      icon: <Users className="h-6 w-6" />,
      duration: '1-2 weeks'
    },
    {
      step: '02',
      title: 'Custom Bundle Design',
      description: 'Our experts create a tailored workflow bundle with the optimal combination of AI tools for your specific use case.',
      details: [
        'Tool selection and compatibility analysis',
        'Custom workflow architecture design',
        'Integration planning and mapping',
        'Cost optimization and recommendations'
      ],
      icon: <Settings className="h-6 w-6" />,
      duration: '1-3 weeks'
    },
    {
      step: '03',
      title: 'Implementation & Setup',
      description: 'We handle the complete setup and configuration of all tools, ensuring seamless integration and optimal performance.',
      details: [
        'Tool procurement and account setup',
        'API integrations and configurations',
        'Custom automation development',
        'Security and compliance implementation'
      ],
      icon: <Rocket className="h-6 w-6" />,
      duration: '2-4 weeks'
    },
    {
      step: '04',
      title: 'Training & Support',
      description: 'Comprehensive training for your team and ongoing support to ensure maximum adoption and ROI.',
      details: [
        'Team training and documentation',
        'Best practices and optimization tips',
        'Ongoing technical support',
        'Performance monitoring and optimization'
      ],
      icon: <LifeBuoy className="h-6 w-6" />,
      duration: 'Ongoing'
    }
  ];

  const benefits = [
    'Expert guidance throughout the entire process',
    'Customized solutions tailored to your needs',
    'Seamless integration with existing systems',
    'Comprehensive training and documentation',
    'Ongoing support and optimization',
    'Faster time-to-value and ROI'
  ];

  const handleContactUs = () => {
    navigate('/contact?inquiryType=implementation');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          From Engagement to Delivery
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Our proven process ensures smooth implementation of your workflow bundles, 
          from initial consultation to ongoing support.
        </p>
      </div>

      {/* Process Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {processSteps.map((step, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
                  {step.step}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl text-gray-900 mb-1">
                    {step.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    {step.icon}
                    <span className="font-medium">Duration: {step.duration}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-4">{step.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 text-sm">Key Activities:</h4>
                <ul className="space-y-1">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {index < processSteps.length - 1 && (
                <div className="absolute -bottom-4 -right-4 text-blue-300">
                  <ArrowRight className="h-8 w-8" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-blue-100">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Why Choose Our Process?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center lg:text-right">
              <Button
                variant="primary"
                size="lg"
                onClick={handleContactUs}
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="shadow-lg hover:shadow-xl mb-2"
              >
                Ready to Get Started?
              </Button>
              <p className="text-gray-600 mb-6">
                Let's discuss how we can help transform your workflow with the right AI tools.
              </p>
              {showContactButton && false && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleContactUs}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="shadow-lg hover:shadow-xl"
                >
                  Start Your Journey
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Typical Implementation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-blue-200"></div>
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <div key={index} className="relative flex items-center space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center relative z-10">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900">{step.title}</h4>
                      <span className="text-sm text-gray-500 font-medium">{step.duration}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Total Timeline:</strong> Most workflow bundle implementations are completed within 4-8 weeks, 
              depending on complexity and customization requirements. Enterprise solutions may require additional time for compliance and integration needs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessSection;
