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
        tools: ['Runway Gen-2', 'Pika', 'Sora', 'Synthesia', 'Colossyan', 'Lumen5', 'Invideo AI', 'Fliki', 'Steve AI', 'HeyGen']
      },
      {
        id: 'image-generation',
        name: 'Image Generation',
        description: 'Generate or edit images from text prompts, other images, or sketches',
        parentCategoryId: 'media-creation',
        tools: ['DALL·E 3', 'Midjourney', 'Stable Diffusion', 'Adobe Firefly', 'Leonardo.ai', 'ClipDrop', 'Ideogram', 'Flux', 'Freepik AI', 'Canva AI']
      },
      {
        id: 'audio-generation',
        name: 'Audio & Music Generation',
        description: 'Create voice, music, and sound effects using AI',
        parentCategoryId: 'media-creation',
        tools: ['ElevenLabs', 'Voicemod', 'Suno.ai', 'Aiva', 'Soundraw', 'Mubert', 'Udio', 'Boomy', 'Beatoven.ai', 'Lalal.ai']
      },
      {
        id: 'interactive-media',
        name: 'Interactive & Game Media',
        description: 'Create games, interactive characters, and 3D assets using AI',
        parentCategoryId: 'media-creation',
        tools: ['Inworld AI', 'Scenario.gg', 'Luma AI', 'Unity Muse', 'Character.ai', 'NovelAI', 'Meshy', 'Spline AI', 'Blender Copilot', 'Promethean AI']
      },
      {
        id: 'media-editing',
        name: 'AI-Powered Media Editing',
        description: 'Enhanced editing tools for video, audio, and images',
        parentCategoryId: 'media-creation',
        tools: ['Descript', 'Runway', 'Adobe Photoshop & Premiere', 'Kapwing', 'Otter.ai', 'Pictory', 'Filmora AI', 'InVideo', 'Wondershare Filmii', 'Topaz AI']
      },
      {
        id: 'avatar-generation',
        name: 'AI Avatar & Digital Human Creation',
        description: 'Create realistic AI avatars, digital humans, and virtual presenters',
        parentCategoryId: 'media-creation',
        tools: ['D-ID', 'Synthesia', 'Hour One', 'Colossyan', 'Elai.io', 'Yepic AI', 'Tavus', 'Movio']
      },
      {
        id: 'animation-motion',
        name: 'Animation & Motion Graphics',
        description: 'AI tools for creating animations, motion graphics, and dynamic visual content',
        parentCategoryId: 'media-creation',
        tools: ['RunwayML', 'Stable Video Diffusion', 'Pika Labs', 'LeiaPix', 'MyHeritage AI', 'Immersity AI', 'Kaiber', 'Neural Frames']
      },
      {
        id: 'podcast-audio',
        name: 'Podcast & Audio Production',
        description: 'Specialized AI tools for podcast creation, audio enhancement, and voice synthesis',
        parentCategoryId: 'media-creation',
        tools: ['Descript', 'Podcastle', 'Speechify', 'Cleanvoice', 'Adobe Podcast', 'Krisp', 'Auphonic', 'Resemble AI']
      },
      {
        id: 'social-media-content',
        name: 'Social Media Content Creation',
        description: 'AI tools specifically designed for creating social media posts, stories, and viral content',
        parentCategoryId: 'media-creation',
        tools: ['Canva AI', 'Jasper Art', 'Lumen5', 'InVideo', 'Buffer AI', 'Hootsuite AI', 'Lately', 'Predis AI']
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
        tools: ['microsoft-copilot', 'tome', 'copy-ai', 'jasper-ai', 'writesonic', 'clickup-ai', 'canva-docs']
      },
      {
        id: 'academic-research',
        name: 'Academic & Research Documents',
        description: 'Create academic papers, literature reviews, and research documents',
        parentCategoryId: 'document-creation',
        tools: ['scispace', 'scite', 'consensus', 'deepseek']
      },
      {
        id: 'legal-documents',
        name: 'Legal & Contract Documents',
        description: 'Create and analyze legal documents, contracts, and compliance materials',
        parentCategoryId: 'document-creation',
        tools: ['lexis-ai', 'harvey-ai', 'litera-one', 'lawgeex', 'donotpay']
      },
      {
        id: 'resume-documents',
        name: 'Resume & Cover Letters',
        description: 'Create professional resumes, CVs, and cover letters',
        parentCategoryId: 'document-creation',
        tools: ['teal', 'rezi', 'kickresume', 'zety', 'resumai-wonsulting', 'resume-io']
      },
      {
        id: 'technical-documentation',
        name: 'Technical Documentation',
        description: 'AI tools for creating API documentation, user manuals, technical specifications, and developer guides',
        parentCategoryId: 'document-creation',
        tools: ['gitbook-ai', 'confluence-ai', 'mintlify-docs', 'readme-ai', 'docusaurus-ai', 'gitiles-ai']
      },
      {
        id: 'creative-writing',
        name: 'Creative Writing',
        description: 'AI tools for stories, scripts, poetry, novels, and other creative content creation',
        parentCategoryId: 'document-creation',
        tools: ['sudowrite', 'novelai', 'shortlyai', 'jasper-creative', 'rytr-creative', 'writesonic']
      },
      {
        id: 'marketing-sales',
        name: 'Marketing & Sales Materials',
        description: 'AI tools for creating brochures, sales decks, marketing copy, and promotional content',
        parentCategoryId: 'document-creation',
        tools: ['copy-ai-marketing', 'persado', 'anyword', 'jasper-marketing', 'writesonic-marketing', 'phrasee']
      },
      {
        id: 'educational-content',
        name: 'Educational Content',
        description: 'AI tools for creating course materials, tutorials, training documents, and educational resources',
        parentCategoryId: 'document-creation',
        tools: ['courseai', 'synthesia-education', 'coursebox-ai', 'teachable-ai', 'udemy-ai', 'coursera-ai', 'skillshare-ai', 'thinkific-ai']
      },
      {
        id: 'proposals-contracts',
        name: 'Proposal & Contract Tools',
        description: 'AI tools for creating RFP responses, project proposals, and contract documents',
        parentCategoryId: 'document-creation',
        tools: ['pandadoc-ai', 'proposify-ai', 'qwilr-ai', 'docusign-ai', 'bidsketch-ai', 'nusii-ai']
      },
      {
        id: 'translation-localization',
        name: 'Translation & Localization',
        description: 'AI tools for multi-language documents, translation, and content localization',
        parentCategoryId: 'document-creation',
        tools: ['deepl-ai', 'lokalise-ai', 'phrase-ai', 'google-translate-ai', 'crowdin-ai', 'transifex-ai']
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
        parentCategoryId: 'code-creation',
        tools: ['github-copilot', 'github-copilot-business', 'claude-dev', 'gemini-code', 'roocode', 'codeium', 'cursor-ai', 'tabnine', 'aider-ai', 'safurai']
      },
      {
        id: 'code-optimization',
        name: 'Code Optimization',
        description: 'Optimize and refactor code',
        parentCategoryId: 'code-creation',
        tools: ['roocode', 'mintlify', 'aider-ai', 'safurai', 'sourcegraph-cody', 'codiumai']
      },
      {
        id: 'code-generation',
        name: 'Code Generation',
        description: 'Generate complete code snippets or applications from descriptions',
        parentCategoryId: 'code-creation',
        tools: ['claude-code', 'gemini-code', 'gpt-pilot', 'devin-ai', 'mutable-ai', 'replit-ghost-writer']
      },
      {
        id: 'api-development',
        name: 'API Development Tools',
        description: 'Tools for designing, building, and testing APIs with AI assistance',
        parentCategoryId: 'code-creation',
        tools: ['thunder-client-ai', 'swagger-ai', 'rapidapi-ai', 'apidog', 'bruno-ai']
      },
      {
        id: 'testing-automation',
        name: 'Testing & QA Automation',
        description: 'AI-powered tools for automated testing, test generation, and quality assurance',
        parentCategoryId: 'code-creation',
        tools: ['playwright-ai', 'jest-ai', 'selenium-ai', 'testim-ai']
      },
      {
        id: 'devops-cicd',
        name: 'DevOps & CI/CD',
        description: 'AI tools for deployment automation, infrastructure management, and continuous integration',
        parentCategoryId: 'code-creation',
        tools: ['github-actions-ai', 'jenkins-ai', 'docker-ai', 'kubernetes-ai', 'terraform-ai', 'ansible-ai', 'gitlab-ai']
      },
      {
        id: 'database-backend',
        name: 'Database & Backend Tools',
        description: 'AI tools for database design, backend architecture, and server-side development',
        parentCategoryId: 'code-creation',
        tools: ['prisma-ai', 'supabase-ai', 'firebase-ai', 'mongodb-ai', 'planetscale-ai', 'neon-ai']
      },
      {
        id: 'frontend-development',
        name: 'Frontend Development',
        description: 'AI tools for UI/UX code generation, component libraries, and frontend frameworks',
        parentCategoryId: 'code-creation',
        tools: ['v0-dev', 'builder-ai', 'framer-ai', 'webflow-ai', 'figma-to-code', 'locofy-ai']
      },
      {
        id: 'mobile-development',
        name: 'Mobile Development',
        description: 'AI tools for iOS, Android, and cross-platform mobile app development',
        parentCategoryId: 'code-creation',
        tools: ['flutterflow', 'expo-ai', 'react-native-ai', 'ionic-ai', 'capacitor-ai', 'kodular-ai']
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
        tools: ['chatgpt', 'claude', 'gpt-4o', 'gemini', 'deepseek', 'perplexity-ai', 'you-ai', 'llama-3', 'anthropic-claude-for-teams', 'hugging-chat', 'llama-3-2', 'claude-3-5-sonnet', 'o1-preview', 'groq-ai', 'hugging-chat', 'mistral-ai', 'anthropic-claude-teams']
      },
      {
        id: 'multimodal-ai',
        name: 'Multimodal AI',
        description: 'Advanced AI models capable of understanding and processing multiple input types including text, images, audio, and video',
        parentCategoryId: 'general-ai',
        tools: ['gpt-4o', 'claude-3-opus', 'gemini', 'llama-3', 'deepseek', 'groq', 'llama-3-2', 'claude-3-5-sonnet', 'groq-ai', 'hugging-chat', 'huggingface-hub', 'replicate']
      },
      {
        id: 'coding-assistants',
        name: 'Coding Assistants',
        description: 'AI tools specifically designed to help developers write, understand, debug, and optimize code across various programming languages',
        parentCategoryId: 'general-ai',
        tools: ['github-copilot', 'codeium', 'cursor-ai', 'deepseek', 'tabnine', 'aws-codewhisperer', 'openai-codex']
      },
      {
        id: 'search-augmentation',
        name: 'Search & Research',
        description: 'AI-enhanced search engines and research tools that provide contextual answers, citations, and intelligent information retrieval',
        parentCategoryId: 'general-ai',
        tools: ['perplexity-ai', 'you-ai', 'bing-copilot', 'kagi', 'elicit', 'google-search', 'wolfram-alpha', 'consensus-ai']
      },
      {
        id: 'specialized-assistants',
        name: 'Specialized Assistants',
        description: 'Purpose-built AI assistants optimized for specific domains, industries, or enterprise use cases with enhanced security and collaboration features',
        parentCategoryId: 'general-ai',
        tools: ['anthropic-claude-for-teams', 'microsoft-copilot', 'notion-ai', 'jasper-ai', 'google-duet-ai', 'claude-3-opus', 'claude-3-5-sonnet', 'o1-preview', 'mem-ai', 'anthropic-constitutional-ai']
      },
      {
        id: 'reasoning-math',
        name: 'Reasoning & Mathematical AI',
        description: 'AI models specifically designed for complex reasoning, mathematical problem-solving, and logical analysis',
        parentCategoryId: 'general-ai',
        tools: ['o1-preview', 'wolfram-alpha', 'claude-3-5-sonnet', 'llama-3-2']
      },
      {
        id: 'fast-inference',
        name: 'High-Speed AI Inference',
        description: 'AI platforms optimized for ultra-fast response times and high-throughput applications',
        parentCategoryId: 'general-ai',
        tools: ['groq-ai', 'replicate', 'huggingface-hub']
      },
      {
        id: 'open-source-models',
        name: 'Open Source AI Models',
        description: 'Free and open-source AI models that can be self-hosted and customized',
        parentCategoryId: 'general-ai',
        tools: ['llama-3-2', 'hugging-chat', 'mistral-ai', 'huggingface-hub']
      },
      {
        id: 'research-analysis',
        name: 'AI Research & Analysis Tools',
        description: 'AI tools specifically designed for academic research, literature analysis, and scientific discovery',
        parentCategoryId: 'general-ai',
        tools: ['elicit', 'consensus-ai', 'wolfram-alpha', 'anthropic-constitutional-ai']
      },
      {
        id: 'knowledge-management',
        name: 'AI Knowledge Management',
        description: 'AI-powered tools for organizing, connecting, and retrieving personal or organizational knowledge',
        parentCategoryId: 'general-ai',
        tools: ['mem-ai', 'notion-ai', 'elicit']
      },
      {
        id: 'model-deployment',
        name: 'AI Model Deployment & MLOps',
        description: 'Platforms for deploying, managing, and monitoring AI models in production environments',
        parentCategoryId: 'general-ai',
        tools: ['weights-biases', 'huggingface-hub', 'replicate', 'openai-fine-tuning', 'scale-ai', 'together-ai', 'cohere-ai']
      },
      {
        id: 'ai-safety-ethics',
        name: 'AI Safety & Ethics',
        description: 'Tools and frameworks focused on responsible AI development, safety, and ethical considerations',
        parentCategoryId: 'general-ai',
        tools: ['anthropic-constitutional-ai', 'weights-biases']
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
        description: 'AI tools for medical imaging analysis, pathology diagnosis, and clinical decision support',
        parentCategoryId: 'healthcare-ai',
        tools: ['pathology-ai', 'radiology-assist', 'paige-ai-pathology', 'ibm-watson-oncology', 'veracyte-ai-genomics']
      },
      {
        id: 'medical-research',
        name: 'Medical Research',
        description: 'AI platforms for drug discovery, genomic analysis, and pharmaceutical research',
        parentCategoryId: 'healthcare-ai',
        tools: ['drug-discovery-ai', 'genomics-ai', 'veracyte-ai-genomics']
      },
      {
        id: 'clinical-documentation',
        name: 'Clinical Documentation',
        description: 'AI tools for automated clinical note generation, medical coding, and documentation workflows',
        parentCategoryId: 'healthcare-ai',
        tools: ['clinical-notes-ai', 'ibm-watson-oncology']
      },
      {
        id: 'patient-support',
        name: 'Patient Support',
        description: 'AI-powered tools for patient consultation, mental health support, and wellness management',
        parentCategoryId: 'healthcare-ai',
        tools: ['medchat-ai', 'mental-health-ai', 'nutrition-ai', 'babylon-health-ai']
      },
      {
        id: 'clinical-operations',
        name: 'Clinical Operations',
        description: 'AI systems for pharmacy management, telemedicine platforms, and healthcare operations',
        parentCategoryId: 'healthcare-ai',
        tools: ['pharmacy-ai', 'telemedicine-ai', 'babylon-health-ai']
      },
      {
        id: 'surgical-assistance',
        name: 'Surgical Assistance',
        description: 'AI platforms for surgical planning, 3D modeling, and operative assistance',
        parentCategoryId: 'healthcare-ai',
        tools: ['surgical-planning-ai']
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
    description: 'Autonomous AI agents that can plan, reason, and execute complex tasks independently with minimal human supervision',
    icon: 'bot',
    subcategories: [
      {
        id: 'autonomous-agents',
        name: 'Autonomous Agents',
        description: 'Fully autonomous AI agents that can operate independently to achieve complex goals through self-directed planning and execution',
        parentCategoryId: 'agentic-ai',
        tools: ['autogpt', 'babyagi', 'agent-gpt', 'devika-ai']
      },
      {
        id: 'task-automation',
        name: 'Task Automation Agents',
        description: 'AI agents specialized in automating specific tasks and workflows with intelligent decision-making capabilities',
        parentCategoryId: 'agentic-ai',
        tools: ['autogpt', 'babyagi', 'agent-gpt', 'superagent']
      },
      {
        id: 'multi-agent-systems',
        name: 'Multi-Agent Systems',
        description: 'Frameworks and platforms for coordinating multiple AI agents to work together on complex collaborative tasks',
        parentCategoryId: 'agentic-ai',
        tools: ['crew-ai', 'langchain-agents']
      },
      {
        id: 'business-agents',
        name: 'Business Process Agents',
        description: 'Enterprise-focused AI agents for automating business processes, customer service, and organizational workflows',
        parentCategoryId: 'agentic-ai',
        tools: ['superagent', 'microsoft-copilot-studio', 'apollo-ai-agent']
      },
      {
        id: 'development-agents',
        name: 'Development & Code Agents',
        description: 'AI agents specialized in software development, code generation, and engineering tasks with autonomous problem-solving',
        parentCategoryId: 'agentic-ai',
        tools: ['devika-ai', 'gpt-engineer']
      },
      {
        id: 'research-agents',
        name: 'Research & Analysis Agents',
        description: 'AI agents focused on conducting research, data analysis, and information synthesis across multiple sources',
        parentCategoryId: 'agentic-ai',
        tools: ['research-agent-gpt', 'dataiku-ai-agents']
      },
      {
        id: 'sales-agents',
        name: 'Sales & Marketing Agents',
        description: 'AI agents for automating sales prospecting, lead generation, and marketing campaign management',
        parentCategoryId: 'agentic-ai',
        tools: ['apollo-ai-agent', 'jasper-ai-agent']
      },
      {
        id: 'agent-frameworks',
        name: 'Agent Development Frameworks',
        description: 'Comprehensive frameworks and platforms for building, deploying, and managing custom AI agents',
        parentCategoryId: 'agentic-ai',
        tools: ['langchain-agents', 'crew-ai', 'superagent']
      },
      {
        id: 'personal-agents',
        name: 'Personal Assistant Agents',
        description: 'AI agents designed for individual productivity, personal task management, and lifestyle automation',
        parentCategoryId: 'agentic-ai',
        tools: ['agent-gpt', 'microsoft-copilot-studio']
      },
      {
        id: 'enterprise-agents',
        name: 'Enterprise AI Agents',
        description: 'Large-scale AI agents designed for enterprise environments with advanced security, compliance, and integration capabilities',
        parentCategoryId: 'agentic-ai',
        tools: ['microsoft-copilot-studio', 'dataiku-ai-agents']
      }
    ]
  },
  {
    id: 'ai-education',
    name: 'AI Education',
    description: 'Comprehensive tools and platforms for learning AI, machine learning, and data science with interactive tutorials, courses, and practice environments',
    icon: 'graduation-cap',
    subcategories: [
      {
        id: 'online-courses',
        name: 'Online Courses & MOOCs',
        description: 'Comprehensive online courses and massive open online courses for AI and machine learning education',
        parentCategoryId: 'ai-education',
        tools: ['coursera-ai', 'udacity-ai', 'edx-ai', 'udemy-ai', 'pluralsight-ai', 'linkedin-learning-ai']
      },
      {
        id: 'interactive-tutorials',
        name: 'Interactive Tutorials',
        description: 'Hands-on interactive tutorials and coding exercises for learning AI concepts and implementations',
        parentCategoryId: 'ai-education',
        tools: ['kaggle-learn', 'codecademy-ai', 'brilliant-ai', 'fastai', 'deeplearning-ai', 'elements-of-ai']
      },
      {
        id: 'coding-platforms',
        name: 'AI Coding Platforms',
        description: 'Platforms for practicing AI and machine learning coding with real datasets and projects',
        parentCategoryId: 'ai-education',
        tools: ['kaggle', 'google-colab', 'jupyter-notebooks', 'paperspace-gradient', 'github-codespaces', 'replit-ai']
      },
      {
        id: 'visualization-tools',
        name: 'AI Visualization & Learning Tools',
        description: 'Visual tools for understanding AI concepts, neural networks, and machine learning algorithms',
        parentCategoryId: 'ai-education',
        tools: ['tensorflow-playground', 'neural-network-playground', 'seeing-ai', 'distill-pub', 'ml-visuals', 'ai-explainer']
      },
      {
        id: 'research-papers',
        name: 'Research & Academic Tools',
        description: 'Platforms for accessing AI research papers, academic content, and scholarly resources',
        parentCategoryId: 'ai-education',
        tools: ['arxiv', 'papers-with-code', 'google-scholar', 'semantic-scholar', 'connected-papers', 'research-rabbit']
      },
      {
        id: 'ai-communities',
        name: 'Learning Communities',
        description: 'Online communities and forums for AI learners to collaborate, ask questions, and share knowledge',
        parentCategoryId: 'ai-education',
        tools: ['towards-data-science', 'ai-stack-overflow', 'reddit-ml', 'discord-ai', 'huggingface-community', 'ml-twitter']
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
        parentCategoryId: 'presentation-tools',
        tools: ['gamma-ai', 'slidebot-ai', 'presentations-ai', 'pitch-avatar', 'decktopus-ai', 'slidebean-ai', 'tome-presentations', 'sendsteps-ai', 'prezo-ai']
      },
      {
        id: 'presentation-enhancement',
        name: 'Presentation Enhancement',
        description: 'Enhance existing presentations',
        parentCategoryId: 'presentation-tools',
        tools: ['beautiful-ai', 'decktopus-ai', 'tome-presentations', 'designrr-presentations', 'slides-ai', 'sendsteps-ai', 'plus-ai-google-slides', 'prezo-ai']
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
        parentCategoryId: 'diagramming-tools',
        tools: ['lucidchart-ai', 'draw-io-ai', 'visio-ai', 'whimsical-ai', 'creately-ai', 'conceptdraw-ai', 'miro-ai']
      },
      {
        id: 'mind-maps',
        name: 'Mind Maps',
        description: 'Create mind maps and concept diagrams',
        parentCategoryId: 'diagramming-tools',
        tools: ['miro-ai', 'mindmeister-ai', 'whimsical-ai', 'xmind-ai']
      },
      {
        id: 'technical-diagrams',
        name: 'Technical Diagrams',
        description: 'Create technical and engineering diagrams',
        parentCategoryId: 'diagramming-tools',
        tools: ['lucidchart-ai', 'draw-io-ai', 'visio-ai', 'conceptdraw-ai']
      },
      {
        id: 'collaborative-diagramming',
        name: 'Collaborative Diagramming',
        description: 'Real-time collaborative diagram creation',
        parentCategoryId: 'diagramming-tools',
        tools: ['miro-ai', 'creately-ai', 'lucidchart-ai', 'whimsical-ai']
      },
      {
        id: 'process-mapping',
        name: 'Process Mapping',
        description: 'Business process and workflow mapping',
        parentCategoryId: 'diagramming-tools',
        tools: ['lucidchart-ai', 'visio-ai', 'creately-ai', 'conceptdraw-ai']
      },
      {
        id: 'wireframes',
        name: 'Wireframes & Mockups',
        description: 'UI/UX wireframes and mockup creation',
        parentCategoryId: 'diagramming-tools',
        tools: ['whimsical-ai', 'miro-ai']
      },
      {
        id: 'network-diagrams',
        name: 'Network Diagrams',
        description: 'IT infrastructure and network diagrams',
        parentCategoryId: 'diagramming-tools',
        tools: ['draw-io-ai', 'lucidchart-ai', 'visio-ai']
      },
      {
        id: 'mood-boards',
        name: 'Mood Boards',
        description: 'Creative mood boards and inspiration collections',
        parentCategoryId: 'diagramming-tools',
        tools: ['milanote-ai', 'miro-ai']
      },
      {
        id: 'brainstorming-tools',
        name: 'Brainstorming Tools',
        description: 'AI-powered brainstorming and ideation',
        parentCategoryId: 'diagramming-tools',
        tools: ['miro-ai', 'mindmeister-ai', 'xmind-ai']
      },
      {
        id: 'creative-planning',
        name: 'Creative Planning',
        description: 'Creative project planning and organization',
        parentCategoryId: 'diagramming-tools',
        tools: ['milanote-ai', 'miro-ai', 'whimsical-ai']
      },
      {
        id: 'business-process-modeling',
        name: 'Business Process Modeling',
        description: 'Enterprise business process modeling and optimization',
        parentCategoryId: 'diagramming-tools',
        tools: ['conceptdraw-ai', 'visio-ai', 'lucidchart-ai', 'creately-ai']
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
        parentCategoryId: 'data-analysis',
        tools: ['alteryx', 'hex', 'mode', 'anakin-ai']
      },
      {
        id: 'predictive-analysis',
        name: 'Predictive Analysis',
        description: 'Predict trends and patterns in data',
        parentCategoryId: 'data-analysis',
        tools: ['alteryx', 'hex', 'mode', 'obviously-ai', 'anakin-ai']
      }
    ]
  }
];