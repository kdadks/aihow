import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'media-creation',
    name: 'Media Creation',
    description: 'Tools for creating and editing images, videos, and other media',
    icon: 'image',
    subcategories: [
      {
        id: 'image-generation',
        name: 'Image Generation',
        description: 'Create images from text prompts',
        parentCategoryId: 'media-creation'
      },
      {
        id: 'video-generation',
        name: 'Video Generation',
        description: 'Create videos from text or image prompts',
        parentCategoryId: 'media-creation'
      },
      {
        id: 'audio-generation',
        name: 'Audio Generation',
        description: 'Generate music, voice, and sound effects',
        parentCategoryId: 'media-creation'
      }
    ]
  },
  {
    id: 'document-creation',
    name: 'Document Creation',
    description: 'Tools for creating and editing documents, reports, and other text-based content',
    icon: 'file-text',
    subcategories: [
      {
        id: 'text-generation',
        name: 'Text Generation',
        description: 'Generate written content from prompts',
        parentCategoryId: 'document-creation'
      },
      {
        id: 'document-formatting',
        name: 'Document Formatting',
        description: 'Format and style documents',
        parentCategoryId: 'document-creation'
      }
    ]
  },
  {
    id: 'code-creation',
    name: 'Code Creation',
    description: 'Tools for writing, debugging, and optimizing code',
    icon: 'code',
    subcategories: [
      {
        id: 'coding-assistants',
        name: 'Coding Assistants',
        description: 'Get help with writing and debugging code',
        parentCategoryId: 'code-creation'
      },
      {
        id: 'code-optimization',
        name: 'Code Optimization',
        description: 'Optimize and refactor code',
        parentCategoryId: 'code-creation'
      }
    ]
  },
  {
    id: 'general-ai',
    name: 'General AI',
    description: 'Multipurpose AI tools for various tasks',
    icon: 'brain',
    subcategories: [
      {
        id: 'chatbots',
        name: 'Chatbots',
        description: 'Conversational AI assistants',
        parentCategoryId: 'general-ai'
      },
      {
        id: 'multimodal-ai',
        name: 'Multimodal AI',
        description: 'AI that can understand multiple types of input',
        parentCategoryId: 'general-ai'
      }
    ]
  },
  {
    id: 'prompt-engineering',
    name: 'Prompt Engineering',
    description: 'Tools for creating and optimizing prompts',
    icon: 'message-square',
    subcategories: [
      {
        id: 'prompt-generators',
        name: 'Prompt Generators',
        description: 'Generate effective prompts for AI tools',
        parentCategoryId: 'prompt-engineering'
      },
      {
        id: 'prompt-libraries',
        name: 'Prompt Libraries',
        description: 'Collections of prompts for various use cases',
        parentCategoryId: 'prompt-engineering'
      }
    ]
  },
  {
    id: 'healthcare-ai',
    name: 'Healthcare AI',
    description: 'AI tools for healthcare and medical applications',
    icon: 'heart-pulse',
    subcategories: [
      {
        id: 'diagnostic-ai',
        name: 'Diagnostic AI',
        description: 'AI for medical diagnostics',
        parentCategoryId: 'healthcare-ai'
      },
      {
        id: 'medical-research',
        name: 'Medical Research',
        description: 'AI for medical research and development',
        parentCategoryId: 'healthcare-ai'
      }
    ]
  },
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Tools for automating workflows and processes',
    icon: 'git-branch',
    subcategories: [
      {
        id: 'business-automation',
        name: 'Business Automation',
        description: 'Automate business processes',
        parentCategoryId: 'workflow-automation'
      },
      {
        id: 'personal-automation',
        name: 'Personal Automation',
        description: 'Automate personal tasks',
        parentCategoryId: 'workflow-automation'
      }
    ]
  },
  {
    id: 'agentic-ai',
    name: 'Agentic AI',
    description: 'AI agents that can perform tasks autonomously',
    icon: 'bot',
    subcategories: [
      {
        id: 'task-agents',
        name: 'Task Agents',
        description: 'AI agents for specific tasks',
        parentCategoryId: 'agentic-ai'
      },
      {
        id: 'autonomous-agents',
        name: 'Autonomous Agents',
        description: 'Fully autonomous AI agents',
        parentCategoryId: 'agentic-ai'
      }
    ]
  },
  {
    id: 'ai-education',
    name: 'AI Education',
    description: 'Tools for learning about AI and machine learning',
    icon: 'graduation-cap',
    subcategories: [
      {
        id: 'tutorials',
        name: 'Tutorials',
        description: 'Interactive tutorials for learning AI',
        parentCategoryId: 'ai-education'
      },
      {
        id: 'courses',
        name: 'Courses',
        description: 'Comprehensive courses on AI topics',
        parentCategoryId: 'ai-education'
      }
    ]
  },
  {
    id: 'presentation-tools',
    name: 'Presentation Tools',
    description: 'AI tools for creating and enhancing presentations',
    icon: 'presentation',
    subcategories: [
      {
        id: 'slide-generation',
        name: 'Slide Generation',
        description: 'Generate presentation slides',
        parentCategoryId: 'presentation-tools'
      },
      {
        id: 'presentation-enhancement',
        name: 'Presentation Enhancement',
        description: 'Enhance existing presentations',
        parentCategoryId: 'presentation-tools'
      }
    ]
  },
  {
    id: 'diagramming-tools',
    name: 'Diagramming Tools',
    description: 'AI tools for creating diagrams and visualizations',
    icon: 'bar-chart',
    subcategories: [
      {
        id: 'flowcharts',
        name: 'Flowcharts',
        description: 'Create flowcharts and process diagrams',
        parentCategoryId: 'diagramming-tools'
      },
      {
        id: 'mind-maps',
        name: 'Mind Maps',
        description: 'Create mind maps and concept diagrams',
        parentCategoryId: 'diagramming-tools'
      }
    ]
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'AI tools for analyzing and visualizing data',
    icon: 'database',
    subcategories: [
      {
        id: 'data-visualization',
        name: 'Data Visualization',
        description: 'Visualize data with AI assistance',
        parentCategoryId: 'data-analysis'
      },
      {
        id: 'predictive-analysis',
        name: 'Predictive Analysis',
        description: 'Predict trends and patterns in data',
        parentCategoryId: 'data-analysis'
      }
    ]
  }
];