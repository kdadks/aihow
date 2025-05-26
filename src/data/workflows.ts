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
      findTool('20'), // GitHub Copilot
      findTool('21'), // Claude Code Assistant
      findTool('22')  // Google Gemini Code
    ],
    totalCost: '$45/month',
    implementationSteps: [
      'Set up GitHub Copilot in your IDE for real-time code suggestions',
      'Use Claude Code Assistant for complex code generation and refactoring',
      'Leverage Gemini Code for additional insights and code optimization',
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
      findTool('20'), // GitHub Copilot
      findTool('16'), // Tabnine
      findTool('19')  // WorkflowGPT
    ],
    totalCost: '$61/month',
    implementationSteps: [
      'Integrate Copilot and Tabnine for comprehensive code assistance',
      'Set up automated workflows with WorkflowGPT',
      'Configure IDE extensions and integrations',
      'Establish efficient development processes'
    ]
  },
  {
    id: '4',
    name: 'AI Code Review & Quality',
    description: 'Advanced toolkit for code review, optimization, and quality assurance using multiple AI assistants.',
    tools: [
      findTool('21'), // Claude Code Assistant
      findTool('22'), // Google Gemini Code
      findTool('17')  // PromptBase Pro
    ],
    totalCost: '$55/month',
    implementationSteps: [
      'Use Claude Code Assistant for detailed code reviews',
      'Optimize code quality with Gemini Code',
      'Create custom review prompts with PromptBase Pro',
      'Implement automated quality checks'
    ]
  }
];