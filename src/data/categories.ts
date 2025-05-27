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
    description: 'Versatile AI tools and models for a wide range of tasks including conversation, code generation, research, and multimodal processing',
    icon: 'brain',
    subcategories: [
      {
        id: 'chatbots',
        name: 'Chatbots',
        description: 'Conversational AI assistants for general-purpose tasks and everyday use',
        parentCategoryId: 'general-ai',
        tools: ['chatgpt', 'claude', 'gpt-4o', 'gemini', 'deepseek', 'perplexity-ai', 'you-ai', 'llama-3', 'anthropic-claude-for-teams', 'hugging-chat']
      },
      {
        id: 'multimodal-ai',
        name: 'Multimodal AI',
        description: 'Advanced AI models capable of understanding and processing multiple input types including text, images, audio, and video',
        parentCategoryId: 'general-ai',
        tools: ['gpt-4o', 'claude-3-opus', 'gemini', 'llama-3', 'deepseek', 'groq']
      },
      {
        id: 'coding-assistants',
        name: 'Coding Assistants',
        description: 'AI tools specifically designed to help developers write, understand, debug, and optimize code across various programming languages',
        parentCategoryId: 'general-ai',
        tools: ['github-copilot', 'codeium', 'cursor-ai', 'deepseek', 'tabnine', 'aws-codewhisperer']
      },
      {
        id: 'search-augmentation',
        name: 'Search & Research',
        description: 'AI-enhanced search engines and research tools that provide contextual answers, citations, and intelligent information retrieval',
        parentCategoryId: 'general-ai',
        tools: ['perplexity-ai', 'you-ai', 'bing-copilot', 'kagi', 'elicit', 'google-search']
      },
      {
        id: 'specialized-assistants',
        name: 'Specialized Assistants',
        description: 'Purpose-built AI assistants optimized for specific domains, industries, or enterprise use cases with enhanced security and collaboration features',
        parentCategoryId: 'general-ai',
        tools: ['anthropic-claude-for-teams', 'microsoft-copilot', 'notion-ai', 'jasper-ai', 'google-duet-ai', 'claude-3-opus']
      }
    ]
  },
  {
    id: 'prompt-engineering',
    name: 'Prompt Engineering',
    description: 'Advanced tools for crafting, optimizing, managing, and discovering AI prompts to enhance output quality, ensure consistency, and maximize the capabilities of large language models',
    icon: 'message-square',
    subcategories: [
      {
        id: 'prompt-management',
        name: 'Prompt Management Platforms',
        description: 'Comprehensive platforms for organizing, versioning, tracking, and collaborating on AI prompts across teams and applications with analytics and monitoring capabilities',
        parentCategoryId: 'prompt-engineering',
        tools: ['promptlayer', 'langchain', 'flowise', 'promptable-ai', 'promptops', 'langsmith', 'everyprompt', 'prompster', 'taxonomist', 'humanloop']
      },
      {
        id: 'prompt-testing',
        name: 'Prompt Testing & Optimization',
        description: 'Specialized tools for systematically testing, evaluating, refining and optimizing prompts to improve response quality, reduce token usage, and enhance performance across different models',
        parentCategoryId: 'prompt-engineering',
        tools: ['promptperfect', 'promptstorm', 'chainforge', 'lmql', 'openprompt', 'prompttools', 'dyno', 'snorkel', 'promptfoo', 'goose-ai']
      },
      {
        id: 'prompt-discovery',
        name: 'Prompt Discovery & Templates',
        description: 'Extensive libraries, marketplaces and repositories of pre-built prompts, templates and patterns organized by use case, enabling discovery of effective prompting techniques for various applications',
        parentCategoryId: 'prompt-engineering',
        tools: ['aiprm-for-chatgpt', 'flowgpt', 'prompthero', 'promptvibes', 'anthropic-prompt-guide', 'gpt-prompt-engineering', 'promptingguide', 'promptknit']
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
    description: 'AI-powered tools for automating workflows, managing schedules, and optimizing productivity',
    icon: 'git-branch',
    subcategories: [
      {
        id: 'business-automation',
        name: 'Business Automation',
        description: 'AI-powered tools to streamline and automate business processes, workflows, and operations',
        parentCategoryId: 'workflow-automation',
        tools: ['zapier-ai', 'make-ai', 'microsoft-power-automate', 'integromat', 'n8n', 'activepieces']
      },
      {
        id: 'personal-automation',
        name: 'Personal Automation',
        description: 'Tools to automate personal tasks, schedules, and daily routines',
        parentCategoryId: 'workflow-automation',
        tools: ['reclaim-ai', 'motion', 'todoist', 'ifttt', 'automate-io']
      },
      {
        id: 'productivity-ai',
        name: 'Productivity AI',
        description: 'AI assistants for enhancing productivity, managing projects, and organizing workspaces',
        parentCategoryId: 'workflow-automation',
        tools: ['notion-ai', 'tana', 'mem-ai', 'coda-ai', 'clickup-ai']
      },
      {
        id: 'scheduling-automation',
        name: 'Scheduling & Calendar AI',
        description: 'AI tools for intelligent scheduling, calendar management, and time optimization',
        parentCategoryId: 'workflow-automation',
        tools: ['reclaim-ai', 'motion', 'clockwise', 'cal-ai', 'zcal']
      },
      {
        id: 'data-workflow',
        name: 'Data & Analytics Automation',
        description: 'Tools that automate data processing, analytics, and reporting workflows',
        parentCategoryId: 'workflow-automation',
        tools: ['alteryx', 'hex', 'mode', 'obviously-ai', 'anakin-ai']
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