import { Category } from '../types';

export const categories: Category[] = [
  {
    id: 'media-creation',
    name: 'Media Creation',
    description: 'Tools for creating and editing images, videos, and other media',
    icon: 'image',
    subcategories: [
      {
        id: 'video-generation',
        name: 'Video Generation',
        description: 'Create and edit videos using AI with text prompts, images, or rough video input',
        parentCategoryId: 'media-creation',
        tools: ['Runway Gen-2', 'Pika', 'Sora', 'Synthesia', 'Colossyan', 'Lumen5']
      },
      {
        id: 'image-generation',
        name: 'Image Generation',
        description: 'Generate or edit images from text prompts, other images, or sketches',
        parentCategoryId: 'media-creation',
        tools: ['DALL·E 3', 'Midjourney', 'Stable Diffusion', 'Adobe Firefly', 'Leonardo.ai', 'ClipDrop']
      },
      {
        id: 'audio-generation',
        name: 'Audio & Music Generation',
        description: 'Create voice, music, and sound effects using AI',
        parentCategoryId: 'media-creation',
        tools: ['ElevenLabs', 'Voicemod', 'Suno.ai', 'Aiva', 'Soundraw', 'Mubert']
      },
      {
        id: 'interactive-media',
        name: 'Interactive & Game Media',
        description: 'Create games, interactive characters, and 3D assets using AI',
        parentCategoryId: 'media-creation',
        tools: ['Inworld AI', 'Scenario.gg', 'Luma AI', 'Unity Muse', 'Character.ai', 'NovelAI']
      },
      {
        id: 'media-editing',
        name: 'AI-Powered Media Editing',
        description: 'Enhanced editing tools for video, audio, and images',
        parentCategoryId: 'media-creation',
        tools: ['Descript', 'Runway', 'Adobe Photoshop & Premiere', 'Kapwing', 'Otter.ai', 'Pictory']
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
        id: 'general-documents',
        name: 'General-Purpose Documents',
        description: 'Create various types of documents including essays, reports, and creative writing',
        parentCategoryId: 'document-creation',
        tools: ['chatgpt-document', 'notion-ai', 'grammarly-go', 'canva-docs', 'otter-ai']
      },
      {
        id: 'business-documents',
        name: 'Professional & Business Documents',
        description: 'Create business plans, proposals, reports, and other professional documents',
        parentCategoryId: 'document-creation',
        tools: ['microsoft-copilot', 'tome', 'copy-ai', 'jasper-ai', 'clickup-ai', 'canva-docs']
      },
      {
        id: 'academic-research',
        name: 'Academic & Research Documents',
        description: 'Create academic papers, literature reviews, and research documents',
        parentCategoryId: 'document-creation',
        tools: ['scite', 'consensus']
      },
      {
        id: 'legal-documents',
        name: 'Legal & Contract Documents',
        description: 'Create and analyze legal documents, contracts, and compliance materials',
        parentCategoryId: 'document-creation',
        tools: ['lawgeex', 'donotpay']
      },
      {
        id: 'resume-documents',
        name: 'Resume & Cover Letters',
        description: 'Create professional resumes, CVs, and cover letters',
        parentCategoryId: 'document-creation',
        tools: ['resume-io', 'teal']
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