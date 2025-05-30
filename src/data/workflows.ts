import { WorkflowBundle } from '../types';
import { tools } from './tools';

// Helper function to safely find a tool
const findTool = (id: string) => {
  const tool = tools.find(t => t.id === id);
  if (!tool) {
    throw new Error(`Tool with id ${id} not found`);
  }
  return tool;
};

export const workflowBundles: WorkflowBundle[] = [
  {
    id: '1',
    name: 'Advanced Code Development Suite',
    description: 'Comprehensive AI-powered development environment combining multiple code assistants for enhanced productivity.',
    tools: [
      findTool('github-copilot'), // GitHub Copilot
      findTool('claude-code-assistant'), // Claude Code Assistant  
      findTool('cursor-ai')  // Cursor AI
    ],
    totalCost: '$50/month',
    implementationSteps: [
      'Set up GitHub Copilot in your IDE for real-time code suggestions',
      'Use Claude Code Assistant for complex code generation and refactoring',
      'Leverage Cursor AI for additional insights and code optimization',
      'Integrate tools into your development workflow'
    ]
  },
  {
    id: '2',
    name: 'Presentation & Content Creation',
    description: 'AI-powered suite for creating professional presentations and optimizing content.',
    tools: [
      findTool('18'), // Slidebot AI
      findTool('17'), // PromptBase Pro
      findTool('2')   // ChatGPT
    ],
    totalCost: '$60/month',
    implementationSteps: [
      'Generate presentation layouts with Slidebot AI',
      'Optimize content using PromptBase Pro',
      'Refine and polish content with ChatGPT',
      'Ensure brand consistency across materials'
    ]
  },
  {
    id: '3',
    name: 'Full-Stack Development Bundle',
    description: 'Complete toolkit for modern software development, combining code generation with workflow automation.',
    tools: [
      findTool('github-copilot'), // GitHub Copilot
      findTool('codeium'), // Codeium
      findTool('zapier-ai')  // Zapier AI
    ],
    totalCost: '$40/month',
    implementationSteps: [
      'Integrate Copilot and Codeium for comprehensive code assistance',
      'Set up automated workflows with Zapier AI',
      'Configure IDE extensions and integrations',
      'Establish efficient development processes'
    ]
  },
  {
    id: '4',
    name: 'AI Code Review & Quality',
    description: 'Advanced toolkit for code review, optimization, and quality assurance using multiple AI assistants.',
    tools: [
      findTool('claude-code-assistant'), // Claude Code Assistant
      findTool('google-gemini-code'), // Google Gemini Code
      findTool('17')  // PromptBase Pro
    ],
    totalCost: '$65/month',
    implementationSteps: [
      'Use Claude Code Assistant for detailed code reviews',
      'Optimize code quality with Gemini Code',
      'Create custom review prompts with PromptBase Pro',
      'Implement automated quality checks'
    ]
  },
  {
    id: '5',
    name: 'Autonomous Agent Workflow',
    description: 'Complete autonomous AI agent setup for complex task execution and process automation.',
    tools: [
      findTool('autogpt'), // AutoGPT
      findTool('langchain-agents'), // LangChain Agents
      findTool('crew-ai')  // CrewAI
    ],
    totalCost: '$68/month',
    implementationSteps: [
      'Deploy AutoGPT for autonomous goal achievement',
      'Set up LangChain Agents framework for tool integration',
      'Configure CrewAI for multi-agent collaboration',
      'Establish monitoring and safety protocols'
    ]
  },
  {
    id: '6',
    name: 'AI Research Assistant',
    description: 'Comprehensive research automation using AI agents for data gathering, analysis, and report generation.',
    tools: [
      findTool('research-agent-gpt'), // ResearchAgent GPT
      findTool('babyagi'), // BabyAGI
      findTool('dataiku-ai-agents')  // Dataiku AI Agents
    ],
    totalCost: '$29+/month',
    implementationSteps: [
      'Configure ResearchAgent GPT for automated research tasks',
      'Set up BabyAGI for task management and prioritization',
      'Integrate Dataiku AI Agents for advanced data analysis',
      'Create research workflows and quality checks'
    ]
  },
  {
    id: '7',
    name: 'Business Process Automation',
    description: 'Enterprise-grade AI agents for automating customer service, sales, and business operations.',
    tools: [
      findTool('superagent'), // SuperAgent
      findTool('microsoft-copilot-studio'), // Microsoft Copilot Studio
      findTool('apollo-ai-agent')  // Apollo AI Agent
    ],
    totalCost: '$398/month',
    implementationSteps: [
      'Deploy SuperAgent for customer service automation',
      'Set up Microsoft Copilot Studio for enterprise workflows',
      'Configure Apollo AI Agent for sales automation',
      'Integrate with existing business systems and CRM'
    ]
  },
  {
    id: '8',
    name: 'AI Development Team',
    description: 'AI-powered software development agents for code generation, review, and project management.',
    tools: [
      findTool('devika-ai'), // Devika AI
      findTool('gpt-engineer'), // GPT Engineer
      findTool('agent-gpt')  // AgentGPT
    ],
    totalCost: '$88/month',
    implementationSteps: [
      'Set up Devika AI for software engineering tasks',
      'Configure GPT Engineer for codebase generation',
      'Deploy AgentGPT for project coordination',
      'Establish code review and quality assurance processes'
    ]
  },
  {
    id: '9',
    name: 'Marketing Automation Agents',
    description: 'AI agents for content creation, campaign management, and marketing process automation.',
    tools: [
      findTool('jasper-ai-agent'), // Jasper AI Agent
      findTool('crew-ai'), // CrewAI
      findTool('superagent')  // SuperAgent
    ],
    totalCost: '$247/month',
    implementationSteps: [
      'Deploy Jasper AI Agent for marketing campaign automation',
      'Set up CrewAI for collaborative content creation',
      'Configure SuperAgent for lead nurturing workflows',
      'Integrate with marketing tools and analytics platforms'
    ]
  },
  {
    id: '10',
    name: 'AI Learning Fundamentals',
    description: 'Complete beginner-friendly bundle for learning AI concepts, from interactive tutorials to hands-on coding.',
    tools: [
      findTool('coursera-ai'), // Coursera AI
      findTool('brilliant-ai'), // Brilliant AI
      findTool('tensorflow-playground'), // TensorFlow Playground
      findTool('neural-network-playground') // Neural Network Playground
    ],
    totalCost: '$49/month',
    implementationSteps: [
      'Start with Coursera AI courses for structured learning',
      'Use Brilliant AI for interactive concept understanding',
      'Practice with TensorFlow Playground for hands-on experience',
      'Experiment with Neural Network Playground for visualization',
      'Build a portfolio of small AI projects'
    ]
  },
  {
    id: '11', 
    name: 'AI Research & Academia',
    description: 'Professional research toolkit combining paper discovery, collaboration platforms, and academic resources.',
    tools: [
      findTool('arxiv'), // arXiv
      findTool('papers-with-code'), // Papers with Code
      findTool('connected-papers'), // Connected Papers
      findTool('semantic-scholar') // Semantic Scholar
    ],
    totalCost: '$5/month',
    implementationSteps: [
      'Set up arXiv alerts for your research areas',
      'Use Papers with Code to find implementations',
      'Explore research networks with Connected Papers',
      'Leverage Semantic Scholar for AI-powered discovery',
      'Build a comprehensive research library'
    ]
  },
  {
    id: '12',
    name: 'AI Coding Bootcamp',
    description: 'Hands-on AI development environment with cloud platforms, collaborative coding, and learning resources.',
    tools: [
      findTool('google-colab'), // Google Colab
      findTool('kaggle'), // Kaggle
      findTool('jupyter-notebooks'), // Jupyter Notebooks
      findTool('github-codespaces') // GitHub Codespaces
    ],
    totalCost: '$0-50/month',
    implementationSteps: [
      'Start with Google Colab for free GPU access',
      'Join Kaggle competitions for practical experience',
      'Set up local Jupyter Notebooks for development',
      'Use GitHub Codespaces for collaborative projects',
      'Build and deploy AI models progressively'
    ]
  },
  {
    id: '13',
    name: 'Professional AI Education',
    description: 'Enterprise-level AI learning combining professional courses, certifications, and industry platforms.',
    tools: [
      findTool('udacity-ai'), // Udacity AI
      findTool('pluralsight-ai'), // Pluralsight AI
      findTool('linkedin-learning-ai'), // LinkedIn Learning AI
      findTool('fastai') // fast.ai
    ],
    totalCost: '$118/month',
    implementationSteps: [
      'Enroll in Udacity AI Nanodegree program',
      'Use Pluralsight AI for skill assessments',
      'Complete LinkedIn Learning courses for career advancement',
      'Follow fast.ai practical approach for real-world skills',
      'Build a professional AI portfolio'
    ]
  },
  {
    id: '14',
    name: 'AI Community Learning',
    description: 'Social learning bundle connecting with AI communities, forums, and collaborative platforms.',
    tools: [
      findTool('huggingface-community'), // Hugging Face Community
      findTool('towards-data-science'), // Towards Data Science
      findTool('ai-stack-overflow'), // AI Stack Overflow
      findTool('discord-ai') // Discord AI Communities
    ],
    totalCost: '$9/month',
    implementationSteps: [
      'Join Hugging Face community for model sharing',
      'Follow Towards Data Science for industry insights',
      'Participate in AI Stack Overflow discussions',
      'Connect with Discord AI study groups',
      'Build your professional AI network'
    ]
  }
];