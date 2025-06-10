import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar, Share2, BookmarkPlus } from 'lucide-react';
import { blogPosts } from '../data/community';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const renderContent = () => {
    if (post.slug === 'top-ai-writing-tools-2025') {
      return (
        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <p className="text-xl text-gray-600 leading-relaxed">
              In 2025, AI writing tools have become indispensable for content creators, marketers, and businesses looking to scale their content production while maintaining quality. From generating blog posts to crafting marketing copy, these tools are revolutionizing how we approach writing.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. GPT-4 Turbo (OpenAI)</h2>
          <p className="text-gray-700 mb-4">
            The latest iteration of OpenAI's flagship model continues to lead the pack with improved reasoning, reduced hallucinations, and better context understanding. Perfect for long-form content and complex writing tasks.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Key Features:</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• 128k context window for handling large documents</li>
              <li>• Superior reasoning and factual accuracy</li>
              <li>• Multi-modal capabilities (text, images, code)</li>
              <li>• API access for custom integrations</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Claude 3.5 Sonnet (Anthropic)</h2>
          <p className="text-gray-700 mb-4">
            Anthropic's Claude 3.5 Sonnet excels at nuanced writing tasks, offering exceptional safety measures and thoughtful content generation. Ideal for sensitive content and detailed analysis.
          </p>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-green-900 mb-2">Key Features:</h4>
            <ul className="text-green-800 space-y-1">
              <li>• Constitutional AI for safer outputs</li>
              <li>• Excellent at following complex instructions</li>
              <li>• Strong reasoning capabilities</li>
              <li>• 200k context window</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Gemini Ultra (Google)</h2>
          <p className="text-gray-700 mb-4">
            Google's most advanced AI model brings multimodal capabilities and seamless integration with Google Workspace, making it perfect for collaborative writing environments.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Copy.ai</h2>
          <p className="text-gray-700 mb-4">
            Specialized for marketing copy and sales content, Copy.ai offers templates and workflows specifically designed for business communications, social media, and advertising.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Jasper AI</h2>
          <p className="text-gray-700 mb-4">
            A comprehensive content creation platform that combines AI writing with brand voice training, SEO optimization, and team collaboration features.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Writesonic</h2>
          <p className="text-gray-700 mb-4">
            Offers a wide range of writing tools from blog posts to product descriptions, with built-in SEO optimization and factual accuracy checks.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Notion AI</h2>
          <p className="text-gray-700 mb-4">
            Integrated directly into the popular productivity platform, Notion AI helps with writing, editing, and organizing content within your existing workflows.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Grammarly AI</h2>
          <p className="text-gray-700 mb-4">
            Beyond grammar checking, Grammarly's AI now offers full writing assistance, tone suggestions, and style improvements for various communication contexts.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Rytr</h2>
          <p className="text-gray-700 mb-4">
            An affordable AI writing assistant that covers over 40 use cases and supports 30+ languages, making it accessible for global content creators.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. ContentBot</h2>
          <p className="text-gray-700 mb-4">
            Focuses on automated content workflows with features like bulk content generation, plagiarism checking, and content optimization for different platforms.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Choosing the Right Tool</h2>
          <p className="text-gray-700 mb-4">
            When selecting an AI writing tool, consider these factors:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
            <li><strong>Content Type:</strong> Blog posts, marketing copy, technical documentation, or creative writing</li>
            <li><strong>Integration Needs:</strong> API access, team collaboration, or platform-specific features</li>
            <li><strong>Budget:</strong> Free tiers, subscription models, or pay-per-use pricing</li>
            <li><strong>Customization:</strong> Brand voice training, style guides, and template customization</li>
            <li><strong>Output Quality:</strong> Accuracy, creativity, and consistency requirements</li>
          </ul>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">The Future of AI Writing</h3>
            <p className="text-gray-700">
              As we move further into 2025, AI writing tools are becoming more sophisticated, with better understanding of context, improved factual accuracy, and enhanced creative capabilities. The key is finding the right tool that fits your specific needs and workflow, rather than trying to use a one-size-fits-all solution.
            </p>
          </div>
        </div>
      );
    }

    if (post.slug === 'future-of-ai-business-trends') {
      return (
        <div className="prose prose-lg max-w-none">
          <div className="mb-8">
            <p className="text-xl text-gray-600 leading-relaxed">
              As we progress through 2025, artificial intelligence continues to reshape the business landscape at an unprecedented pace. From automated decision-making to predictive analytics, AI is no longer a luxury but a necessity for competitive advantage. Let's explore the key trends that are defining the future of AI in business.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Hyper-Personalization at Scale</h2>
          <p className="text-gray-700 mb-4">
            Businesses are moving beyond basic personalization to create truly individualized experiences for each customer. AI algorithms now analyze millions of data points in real-time to deliver personalized content, product recommendations, and pricing strategies.
          </p>
          <div className="bg-purple-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-purple-900 mb-2">Impact Areas:</h4>
            <ul className="text-purple-800 space-y-1">
              <li>• Dynamic pricing based on individual customer behavior</li>
              <li>• Personalized user interfaces that adapt to usage patterns</li>
              <li>• Custom product configurations and recommendations</li>
              <li>• Individualized marketing messages and timing</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Autonomous Business Operations</h2>
          <p className="text-gray-700 mb-4">
            The rise of fully autonomous business processes is transforming operations. From supply chain management to customer service, AI systems are making decisions without human intervention, leading to faster response times and reduced operational costs.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Key Applications:</h4>
            <ul className="text-blue-800 space-y-1">
              <li>• Automated inventory management and reordering</li>
              <li>• Self-optimizing marketing campaigns</li>
              <li>• Autonomous customer support with intelligent escalation</li>
              <li>• Predictive maintenance and resource allocation</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. AI-Driven Decision Intelligence</h2>
          <p className="text-gray-700 mb-4">
            Traditional business intelligence is evolving into decision intelligence, where AI not only provides insights but also recommends specific actions and predicts their outcomes with high accuracy.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Conversational AI for Business</h2>
          <p className="text-gray-700 mb-4">
            Advanced conversational AI is replacing traditional interfaces across business applications. From internal tools to customer-facing platforms, natural language is becoming the primary mode of interaction.
          </p>
          <div className="bg-green-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-green-900 mb-2">Business Applications:</h4>
            <ul className="text-green-800 space-y-1">
              <li>• Voice-activated business intelligence queries</li>
              <li>• Natural language programming and system configuration</li>
              <li>• Conversational interfaces for complex business processes</li>
              <li>• AI-powered meeting assistants and note-taking</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Ethical AI and Responsible Innovation</h2>
          <p className="text-gray-700 mb-4">
            As AI becomes more pervasive, businesses are prioritizing ethical AI practices, transparency, and responsible innovation. This includes addressing bias, ensuring privacy, and maintaining human oversight in critical decisions.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Edge AI and Real-Time Processing</h2>
          <p className="text-gray-700 mb-4">
            The shift toward edge computing is enabling real-time AI processing closer to data sources, reducing latency and enabling new use cases in manufacturing, retail, and autonomous systems.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. AI-Human Collaboration Workflows</h2>
          <p className="text-gray-700 mb-4">
            Rather than replacing humans, AI is increasingly designed to augment human capabilities. New collaboration models are emerging where AI handles routine tasks while humans focus on strategy, creativity, and complex problem-solving.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Predictive Business Modeling</h2>
          <p className="text-gray-700 mb-4">
            AI-powered predictive models are becoming sophisticated enough to forecast market trends, customer behavior, and business outcomes with remarkable accuracy, enabling proactive rather than reactive business strategies.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Automated Content Generation</h2>
          <p className="text-gray-700 mb-4">
            From marketing materials to technical documentation, AI is automating content creation across all business functions, maintaining brand consistency while scaling content production.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. AI-Powered Cybersecurity</h2>
          <p className="text-gray-700 mb-4">
            As cyber threats evolve, AI-driven security systems are becoming essential for real-time threat detection, automated response, and predictive security measures.
          </p>

          <div className="bg-orange-50 p-6 rounded-lg mt-8 mb-6">
            <h3 className="text-xl font-bold text-orange-900 mb-4">Implementation Challenges</h3>
            <ul className="text-orange-800 space-y-2">
              <li>• <strong>Data Quality:</strong> Ensuring clean, comprehensive data for AI training</li>
              <li>• <strong>Integration Complexity:</strong> Connecting AI systems with existing infrastructure</li>
              <li>• <strong>Skill Gaps:</strong> Training workforce to work alongside AI systems</li>
              <li>• <strong>Regulatory Compliance:</strong> Navigating evolving AI regulations and standards</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Preparing for the AI-Driven Future</h2>
          <p className="text-gray-700 mb-4">
            To succeed in this AI-driven business landscape, organizations must:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
            <li>Develop a comprehensive AI strategy aligned with business objectives</li>
            <li>Invest in data infrastructure and quality management</li>
            <li>Build AI literacy across all levels of the organization</li>
            <li>Establish ethical AI governance frameworks</li>
            <li>Foster a culture of continuous learning and adaptation</li>
          </ul>

          <div className="bg-gray-50 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Looking Ahead</h3>
            <p className="text-gray-700">
              The future of AI in business is not just about technology—it's about reimagining how work gets done, how decisions are made, and how value is created. Organizations that embrace these trends and adapt their strategies accordingly will not only survive but thrive in the AI-powered economy of tomorrow.
            </p>
          </div>
        </div>
      );
    }

    // Default content for other posts
    return (
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 leading-relaxed mb-6">
          {post.excerpt}
        </p>
        <p className="text-gray-700">
          This article is currently being developed. Please check back soon for the full content.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Article Header */}
      <article className="mb-12">
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.image}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">{post.author.name}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center space-x-1"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Save</span>
              </Button>
            </div>
          </div>
          
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />
        </header>

        {/* Article Content */}
        <div className="text-gray-700 leading-relaxed">
          {renderContent()}
        </div>
      </article>

      {/* Related Articles */}
      <section className="border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {blogPosts
            .filter(p => p.slug !== slug)
            .slice(0, 2)
            .map((relatedPost) => (
              <Card key={relatedPost.slug} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {relatedPost.category}
                    </span>
                  </div>
                  <Link to={`/blog/${relatedPost.slug}`}>
                    <h4 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2">
                      {relatedPost.title}
                    </h4>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3">
                    {relatedPost.excerpt.substring(0, 120)}...
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>{relatedPost.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPostDetailPage;