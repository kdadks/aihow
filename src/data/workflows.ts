import { WorkflowBundle } from '../types';
import { tools } from './tools';

export const workflowBundles: WorkflowBundle[] = [
  {
    id: '1',
    name: 'Content Creator Suite',
    description: 'A complete workflow for content creators who need to generate ideas, create written content, and produce supporting visuals.',
    tools: [
      tools.find(tool => tool.id === '2')!, // ChatGPT
      tools.find(tool => tool.id === '5')!, // DALL-E
      tools.find(tool => tool.id === '3')!  // Notion AI
    ],
    totalCost: '$48/month',
    implementationSteps: [
      'Use ChatGPT to brainstorm content ideas and create content outlines',
      'Draft and refine content with Notion AI integrated in your workspace',
      'Generate supporting images with DALL-E based on your content',
      'Organize your content calendar and assets in Notion'
    ]
  },
  {
    id: '2',
    name: 'Developer Productivity Stack',
    description: 'A workflow designed to maximize developer productivity by assisting with code generation, documentation, and managing technical content.',
    tools: [
      tools.find(tool => tool.id === '4')!, // GitHub Copilot
      tools.find(tool => tool.id === '2')!, // ChatGPT
      tools.find(tool => tool.id === '6')!  // Zapier AI
    ],
    totalCost: '$50/month',
    implementationSteps: [
      'Use GitHub Copilot within your IDE for real-time code suggestions',
      'Generate complex functions and algorithms with ChatGPT',
      'Create documentation and explain code with ChatGPT',
      'Automate repetitive development tasks with Zapier AI'
    ]
  },
  {
    id: '3',
    name: 'Visual Content Production',
    description: 'An end-to-end workflow for creating professional visual content including images, videos, and presentations.',
    tools: [
      tools.find(tool => tool.id === '1')!, // MidJourney
      tools.find(tool => tool.id === '7')!, // Synthesia
      tools.find(tool => tool.id === '10')! // Beautiful.ai
    ],
    totalCost: '$52/month',
    implementationSteps: [
      'Generate unique images and artwork with MidJourney',
      'Create professional video content with Synthesia\'s AI avatars',
      'Build polished presentations using Beautiful.ai\'s smart templates',
      'Combine all elements into cohesive visual storytelling'
    ]
  },
  {
    id: '4',
    name: 'AI Research Assistant',
    description: 'A powerful combination of tools for research, analysis, and creating research outputs.',
    tools: [
      tools.find(tool => tool.id === '8')!, // Anthropic Claude
      tools.find(tool => tool.id === '3')!, // Notion AI
      tools.find(tool => tool.id === '10')! // Beautiful.ai
    ],
    totalCost: '$40/month',
    implementationSteps: [
      'Perform deep research and literature analysis with Claude\'s 100K token context',
      'Organize research findings and create structured notes in Notion',
      'Generate insights and summaries with Notion AI',
      'Create research presentations and visualizations with Beautiful.ai'
    ]
  }
];