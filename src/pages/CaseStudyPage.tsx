import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface CaseStudyData {
  id: string;
  title: string;
  company: string;
  industry: string;
  description: string;
  challenge: string;
  solution: string;
  implementation: string;
  results: string[];
  metrics: Array<{
    label: string;
    value: string;
    description: string;
  }>;
  timeline: string;
  teamSize: string;
  technologies: string[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    avatar: string;
  };
  images: string[];
  keyFeatures: string[];
  lessonsLearned: string[];
}

const caseStudiesData: Record<string, CaseStudyData> = {
  'techcorp': {
    id: 'techcorp',
    title: 'Enterprise AI Integration',
    company: 'TechCorp Inc',
    industry: 'Technology & Software',
    description: 'How TechCorp transformed their content production workflow using AI tools recommended by How2doAI, achieving unprecedented efficiency and quality improvements.',
    challenge: 'TechCorp faced significant challenges in scaling their content production to meet growing demand. Their content team was overwhelmed with manual tasks, quality was inconsistent, and production costs were spiraling out of control. They needed a comprehensive AI solution that could integrate with their existing workflows.',
    solution: 'Working with How2doAI, TechCorp implemented a comprehensive AI content production suite including GPT-4 for content generation, Grammarly Business for quality assurance, Jasper for marketing copy, and Notion AI for workflow management. The integration was carefully planned to maintain quality while dramatically increasing output.',
    implementation: 'The implementation took place over 3 months with careful change management. We started with a pilot team, provided comprehensive training, and gradually rolled out to the entire content organization. Key milestones included tool integration, workflow optimization, and team training.',
    results: [
      'Increased content output by 300% while maintaining quality standards',
      'Reduced content production costs by 65% through automation',
      'Improved team satisfaction scores to 4.8/5 as repetitive tasks were automated',
      'Decreased time-to-publish from 5 days to 1.5 days on average',
      'Enhanced content consistency across all marketing channels'
    ],
    metrics: [
      {
        label: 'Content Output Increase',
        value: '300%',
        description: 'Monthly content pieces increased from 50 to 200'
      },
      {
        label: 'Cost Reduction',
        value: '65%',
        description: 'Production costs reduced from $50K to $17.5K monthly'
      },
      {
        label: 'Team Satisfaction',
        value: '4.8/5',
        description: 'Employee satisfaction improved significantly'
      },
      {
        label: 'Time to Publish',
        value: '70% Faster',
        description: 'Average turnaround time improved from 5 to 1.5 days'
      }
    ],
    timeline: '3 months',
    teamSize: '25 content professionals',
    technologies: ['GPT-4', 'Grammarly Business', 'Jasper AI', 'Notion AI', 'Zapier'],
    testimonial: {
      quote: "How2doAI transformed our content production workflow. Their tool recommendations helped us increase output by 300% while maintaining quality.",
      author: 'Sarah Miller',
      role: 'Content Director',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf',
      'https://images.unsplash.com/photo-1551434678-e076c223a692'
    ],
    keyFeatures: [
      'Automated content ideation and planning',
      'AI-powered writing assistance and editing',
      'Real-time collaboration and feedback systems',
      'Automated quality assurance and fact-checking',
      'Integrated SEO optimization tools'
    ],
    lessonsLearned: [
      'Change management is crucial for AI adoption success',
      'Training and support must be continuous, not one-time',
      'Quality controls become more important, not less, with AI',
      'Human creativity is enhanced, not replaced, by AI tools'
    ]
  },
  'growth-studios': {
    id: 'growth-studios',
    title: 'AI-Powered Marketing Agency Transformation',
    company: 'Growth Studios',
    industry: 'Digital Marketing',
    description: 'Growth Studios leveraged AI tools to double their client capacity while improving campaign performance and team efficiency.',
    challenge: 'Growth Studios was struggling to scale their marketing operations to serve more clients without compromising quality. Manual campaign research, content creation, and analysis were consuming too much time, limiting their growth potential.',
    solution: 'How2doAI recommended a comprehensive marketing automation stack including HubSpot AI, Copy.ai for content creation, Semrush for SEO analysis, and ChatGPT for strategy development. The solution focused on automating repetitive tasks while enhancing creative capabilities.',
    implementation: 'The 4-month implementation included workflow restructuring, tool integration, team training, and gradual client migration to AI-enhanced processes. Each team member received specialized training on their relevant tools.',
    results: [
      'Doubled client capacity from 25 to 50 active accounts',
      'Increased average campaign engagement rates by 40%',
      'Reduced research time by 90% through AI-powered insights',
      'Improved client retention rate to 95%',
      'Increased profit margins by 35% through efficiency gains'
    ],
    metrics: [
      {
        label: 'Client Capacity',
        value: '2x',
        description: 'Doubled from 25 to 50 active clients'
      },
      {
        label: 'Engagement Increase',
        value: '40%',
        description: 'Average campaign engagement improved significantly'
      },
      {
        label: 'Research Time Saved',
        value: '90%',
        description: 'Market research time reduced from 8 hours to 45 minutes'
      },
      {
        label: 'Client Retention',
        value: '95%',
        description: 'Highest retention rate in company history'
      }
    ],
    timeline: '4 months',
    teamSize: '15 marketing professionals',
    technologies: ['HubSpot AI', 'Copy.ai', 'Semrush', 'ChatGPT-4', 'Zapier', 'Google Analytics 4'],
    testimonial: {
      quote: "The AI tool recommendations we got were spot-on. We've saved countless hours researching tools and can now focus on strategic work that drives real results for our clients.",
      author: 'David Chen',
      role: 'Marketing Manager',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    },
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
      'https://images.unsplash.com/photo-1553028826-f4804a6dba3b',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
    ],
    keyFeatures: [
      'Automated market research and competitor analysis',
      'AI-powered content calendar generation',
      'Intelligent campaign optimization suggestions',
      'Automated reporting and client communication',
      'Predictive analytics for campaign performance'
    ],
    lessonsLearned: [
      'Client communication about AI usage builds trust',
      'Combining multiple AI tools creates compound benefits',
      'Regular tool evaluation ensures optimal performance',
      'Human oversight remains essential for quality control'
    ]
  },
  'innovatetech': {
    id: 'innovatetech',
    title: 'Startup AI Transformation',
    company: 'InnovateTech Solutions',
    industry: 'Technology Startup',
    description: 'A fast-growing startup leveraged AI tools to accelerate product development and reduce operational costs while maintaining high quality standards.',
    challenge: 'As a rapidly scaling startup, InnovateTech needed to accelerate product development cycles while keeping costs low. Manual processes were slowing down development, and the small team was overwhelmed with routine tasks.',
    solution: 'How2doAI designed a comprehensive AI strategy including GitHub Copilot for development, Notion AI for documentation, Slack AI for communication, and various automation tools for testing and deployment.',
    implementation: 'The 2-month rapid implementation focused on immediate impact areas. We prioritized development acceleration and operational automation, with continuous monitoring and adjustment.',
    results: [
      'Accelerated product development by 400%',
      'Reduced operational costs by 50% through automation',
      'Achieved 95% automation of routine development tasks',
      'Improved code quality scores by 60%',
      'Reduced time-to-market for new features by 75%'
    ],
    metrics: [
      {
        label: 'Development Speed',
        value: '400%',
        description: 'Feature development cycles shortened dramatically'
      },
      {
        label: 'Cost Reduction',
        value: '50%',
        description: 'Operational expenses reduced significantly'
      },
      {
        label: 'Task Automation',
        value: '95%',
        description: 'Routine tasks now automated'
      },
      {
        label: 'Time to Market',
        value: '75% Faster',
        description: 'New features ship much faster'
      }
    ],
    timeline: '2 months',
    teamSize: '8 engineers and product managers',
    technologies: ['GitHub Copilot', 'Notion AI', 'Slack AI', 'Vercel AI', 'Linear'],
    testimonial: {
      quote: "How2doAI helped us identify the perfect AI tools for our product development cycle. The detailed comparisons and user reviews gave us confidence in our technology stack decisions.",
      author: 'Anish Reddy',
      role: 'Product Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    },
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44',
      'https://images.unsplash.com/photo-1551434678-e076c223a692'
    ],
    keyFeatures: [
      'AI-assisted code generation and review',
      'Automated testing and quality assurance',
      'Intelligent project management and planning',
      'Automated documentation generation',
      'Smart deployment and monitoring systems'
    ],
    lessonsLearned: [
      'Early AI adoption provides competitive advantages',
      'Developer experience improves significantly with AI tools',
      'Automation frees teams to focus on innovation',
      'Continuous learning and adaptation are essential'
    ]
  },
  'creative-digital': {
    id: 'creative-digital',
    title: 'Digital Marketing Revolution',
    company: 'Creative Digital Agency',
    industry: 'Digital Marketing & Creative Services',
    description: 'A creative agency transformed their entire workflow using AI tools, dramatically increasing content production while improving campaign ROI.',
    challenge: 'Creative Digital Agency was struggling to meet increasing client demands for content while maintaining creative quality. Manual design processes and content creation were bottlenecks preventing growth.',
    solution: 'How2doAI recommended a creative AI toolkit including Midjourney for visual content, Jasper for copywriting, Canva AI for design automation, and Adobe Creative Cloud AI features for advanced editing.',
    implementation: 'The 3-month transformation included creative workflow redesign, tool integration, team upskilling, and client communication strategy about AI-enhanced creative services.',
    results: [
      'Increased content production volume by 500%',
      'Improved campaign ROI by 80% across all clients',
      'Reduced manual design work by 60%',
      'Shortened project timelines by 70%',
      'Increased client satisfaction scores to 4.9/5'
    ],
    metrics: [
      {
        label: 'Content Production',
        value: '5x',
        description: 'Monthly content output increased dramatically'
      },
      {
        label: 'Campaign ROI',
        value: '80%',
        description: 'Average return on investment improved'
      },
      {
        label: 'Manual Work Reduction',
        value: '60%',
        description: 'Repetitive design tasks automated'
      },
      {
        label: 'Project Timeline',
        value: '70% Faster',
        description: 'Projects completed much faster'
      }
    ],
    timeline: '3 months',
    teamSize: '12 creative professionals',
    technologies: ['Midjourney', 'Jasper AI', 'Canva AI', 'Adobe Creative Cloud AI', 'Figma AI'],
    testimonial: {
      quote: "The workflow bundles feature transformed how we approach AI implementation. We went from struggling with tool selection to having a comprehensive AI-powered marketing suite.",
      author: 'Meera Gupta',
      role: 'Digital Marketing Lead',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    images: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0'
    ],
    keyFeatures: [
      'AI-powered visual content generation',
      'Automated copywriting and editing',
      'Intelligent design template creation',
      'Smart brand guideline enforcement',
      'Automated campaign performance optimization'
    ],
    lessonsLearned: [
      'AI enhances rather than replaces creative talent',
      'Client education about AI capabilities builds trust',
      'Quality control processes must evolve with AI tools',
      'Creative teams need ongoing AI training and support'
    ]
  },
  'medtech-india': {
    id: 'medtech-india',
    title: 'Healthcare AI Implementation',
    company: 'MedTech India',
    industry: 'Healthcare Technology',
    description: 'A healthcare technology company revolutionized their diagnostic processes using AI tools, dramatically improving accuracy and reducing processing times.',
    challenge: 'MedTech India faced challenges with manual diagnostic processes that were slow, prone to human error, and expensive to scale. They needed AI solutions that could integrate with existing healthcare systems while maintaining strict compliance standards.',
    solution: 'How2doAI helped implement a healthcare-focused AI stack including diagnostic AI tools, automated reporting systems, and intelligent data analysis platforms, all while ensuring HIPAA compliance and regulatory adherence.',
    implementation: 'The 6-month implementation included rigorous testing, compliance verification, staff training, and gradual rollout across multiple healthcare facilities with continuous monitoring and optimization.',
    results: [
      'Accelerated diagnosis processing by 70%',
      'Improved diagnostic accuracy by 85%',
      'Reduced operational costs by 40%',
      'Enhanced patient satisfaction scores to 4.7/5',
      'Achieved 99.9% system uptime and reliability'
    ],
    metrics: [
      {
        label: 'Processing Speed',
        value: '70%',
        description: 'Diagnostic reports generated much faster'
      },
      {
        label: 'Accuracy Improvement',
        value: '85%',
        description: 'Diagnostic accuracy significantly enhanced'
      },
      {
        label: 'Cost Savings',
        value: '40%',
        description: 'Operational expenses reduced substantially'
      },
      {
        label: 'System Reliability',
        value: '99.9%',
        description: 'Near-perfect system uptime achieved'
      }
    ],
    timeline: '6 months',
    teamSize: '20 medical professionals and engineers',
    technologies: ['IBM Watson Health', 'Google Cloud Healthcare AI', 'Microsoft Healthcare Bot', 'Nuance AI', 'Epic Integration'],
    testimonial: {
      quote: "The AI diagnostic tools recommended by How2doAI have revolutionized our healthcare delivery. We're now able to provide faster, more accurate diagnoses while reducing costs.",
      author: 'Dr. Priya Sharma',
      role: 'Chief Medical Officer',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2'
    },
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f',
      'https://images.unsplash.com/photo-1582560469781-1548c129bd71',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef'
    ],
    keyFeatures: [
      'AI-powered diagnostic imaging analysis',
      'Automated patient data processing',
      'Intelligent treatment recommendation systems',
      'Real-time monitoring and alert systems',
      'Compliance and audit trail automation'
    ],
    lessonsLearned: [
      'Healthcare AI requires extensive validation and testing',
      'Compliance and security are paramount in healthcare',
      'Staff training and change management are critical',
      'Continuous monitoring ensures optimal performance'
    ]
  },
  'shopsmart': {
    id: 'shopsmart',
    title: 'E-commerce AI Optimization',
    company: 'ShopSmart Solutions',
    industry: 'E-commerce & Retail',
    description: 'An e-commerce platform leveraged AI tools to dramatically improve conversion rates, customer experience, and operational efficiency.',
    challenge: 'ShopSmart was facing declining conversion rates, increasing customer support queries, and challenges with personalization at scale. They needed AI solutions to enhance customer experience while reducing operational overhead.',
    solution: 'How2doAI recommended a comprehensive e-commerce AI suite including recommendation engines, chatbots for customer support, dynamic pricing tools, and inventory optimization systems.',
    implementation: 'The 4-month implementation focused on customer-facing improvements first, followed by backend optimization. A/B testing ensured optimal performance at each stage.',
    results: [
      'Increased conversion rates by 300%',
      'Reduced customer support queries by 50%',
      'Improved personalization effectiveness by 200%',
      'Enhanced customer lifetime value by 45%',
      'Achieved 24/7 automated customer support'
    ],
    metrics: [
      {
        label: 'Conversion Rate',
        value: '3x',
        description: 'Conversion rates tripled across all channels'
      },
      {
        label: 'Support Efficiency',
        value: '50%',
        description: 'Customer support queries reduced significantly'
      },
      {
        label: 'Personalization',
        value: '200%',
        description: 'Recommendation accuracy improved dramatically'
      },
      {
        label: 'Customer Value',
        value: '45%',
        description: 'Average customer lifetime value increased'
      }
    ],
    timeline: '4 months',
    teamSize: '18 e-commerce and development professionals',
    technologies: ['Shopify AI', 'Klaviyo AI', 'Yotpo AI', 'Dynamic Yield', 'Zendesk AI'],
    testimonial: {
      quote: "How2doAI's e-commerce AI recommendations transformed our online store. We've seen incredible improvements in conversion rates and customer satisfaction.",
      author: 'Rajesh Kumar',
      role: 'E-commerce Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
    },
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3'
    ],
    keyFeatures: [
      'AI-powered product recommendations',
      'Intelligent chatbot customer support',
      'Dynamic pricing optimization',
      'Automated inventory management',
      'Personalized marketing campaigns'
    ],
    lessonsLearned: [
      'Customer experience improvements drive immediate ROI',
      'A/B testing is essential for AI optimization',
      'Data quality directly impacts AI performance',
      'Continuous optimization yields best results'
    ]
  }
};

const CaseStudyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id || !caseStudiesData[id]) {
    return <Navigate to="/testimonials" replace />;
  }

  const caseStudy = caseStudiesData[id];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                {caseStudy.industry}
              </Badge>
              <div className="text-sm text-gray-500">
                {caseStudy.timeline} • {caseStudy.teamSize}
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {caseStudy.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <h2 className="text-2xl font-semibold text-indigo-600">
                {caseStudy.company}
              </h2>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {caseStudy.description}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {caseStudy.metrics.map((metric, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {metric.value}
              </div>
              <div className="font-medium text-gray-900 mb-1">
                {metric.label}
              </div>
              <div className="text-sm text-gray-500">
                {metric.description}
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Challenge */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                The Challenge
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {caseStudy.challenge}
              </p>
            </Card>

            {/* Solution */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Solution
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {caseStudy.solution}
              </p>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Key Features Implemented:
              </h4>
              <ul className="space-y-2">
                {caseStudy.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Implementation */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Implementation Process
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {caseStudy.implementation}
              </p>
            </Card>

            {/* Results */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Results & Impact
              </h3>
              <div className="space-y-3">
                {caseStudy.results.map((result, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">{result}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Lessons Learned */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Key Lessons Learned
              </h3>
              <div className="space-y-3">
                {caseStudy.lessonsLearned.map((lesson, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-indigo-600 mr-2">💡</span>
                    <span className="text-gray-600">{lesson}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies Used */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {caseStudy.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Testimonial */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Client Testimonial
              </h3>
              <div className="space-y-4">
                <blockquote className="text-gray-600 italic">
                  "{caseStudy.testimonial.quote}"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <img
                    src={caseStudy.testimonial.avatar}
                    alt={caseStudy.testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {caseStudy.testimonial.author}
                    </div>
                    <div className="text-sm text-gray-500">
                      {caseStudy.testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Project Images */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Project Gallery
              </h3>
              <div className="space-y-3">
                {caseStudy.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${caseStudy.company} project ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="p-8 text-center bg-indigo-50 border-indigo-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business with AI?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Let How2doAI help you find the perfect AI tools for your specific needs. 
            Get personalized recommendations and implementation guidance from our experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tool-finder"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get AI Tool Recommendations
            </a>
            <a
              href="/contact"
              className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Contact Our Experts
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CaseStudyPage;