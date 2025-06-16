import { Question } from '../types';

export const assessmentQuestions: Question[] = [
  {
    id: 'purpose',
    text: 'What is your primary purpose for using AI tools?',
    type: 'single',
    options: [
      { id: 'purpose-1', text: 'Content Creation (text, images, videos)', value: 'content' },
      { id: 'purpose-2', text: 'Productivity & Workflow Automation', value: 'productivity' },
      { id: 'purpose-3', text: 'Software Development & Coding', value: 'development' },
      { id: 'purpose-4', text: 'Research & Academic Work', value: 'research' },
      { id: 'purpose-5', text: 'Business & Enterprise Applications', value: 'business' },
      { id: 'purpose-6', text: 'Data Analysis & Visualization', value: 'data' },
      { id: 'purpose-7', text: 'Learning & Education', value: 'education' }
    ]
  },
  {
    id: 'experience',
    text: 'What is your experience level with AI tools?',
    type: 'single',
    options: [
      { id: 'experience-1', text: 'Beginner (Never used AI tools)', value: 'beginner' },
      { id: 'experience-2', text: 'Novice (Used a few basic AI tools)', value: 'novice' },
      { id: 'experience-3', text: 'Intermediate (Regular user of several AI tools)', value: 'intermediate' },
      { id: 'experience-4', text: 'Advanced (Power user, comfortable with complex AI tools)', value: 'advanced' },
      { id: 'experience-5', text: 'Expert (Professional working with or developing AI)', value: 'expert' }
    ]
  },
  {
    id: 'content-type',
    text: 'What type of content are you primarily looking to create?',
    type: 'multiple',
    options: [
      { id: 'content-1', text: 'Written content (articles, blogs, reports)', value: 'written' },
      { id: 'content-2', text: 'Images and graphics', value: 'images' },
      { id: 'content-3', text: 'Videos', value: 'videos' },
      { id: 'content-4', text: 'Audio (music, voice, sound effects)', value: 'audio' },
      { id: 'content-5', text: 'Presentations and slides', value: 'presentations' },
      { id: 'content-6', text: 'Code and technical content', value: 'code' }
    ],
    dependsOn: {
      questionId: 'purpose',
      answers: ['content']
    }
  },
  {
    id: 'development-focus',
    text: 'What aspects of software development are you focused on?',
    type: 'multiple',
    options: [
      { id: 'dev-1', text: 'Code generation and completion', value: 'code-gen' },
      { id: 'dev-2', text: 'Debugging and optimization', value: 'debugging' },
      { id: 'dev-3', text: 'Documentation', value: 'documentation' },
      { id: 'dev-4', text: 'Learning new languages/frameworks', value: 'learning' },
      { id: 'dev-5', text: 'Project management and planning', value: 'project-management' }
    ],
    dependsOn: {
      questionId: 'purpose',
      answers: ['development']
    }
  },
  {
    id: 'budget',
    text: 'What is your budget for AI tools?',
    type: 'single',
    options: [
      { id: 'budget-1', text: 'Free tools only', value: 'free' },
      { id: 'budget-2', text: 'Less than $20/month', value: 'low' },
      { id: 'budget-3', text: '$20-50/month', value: 'medium' },
      { id: 'budget-4', text: '$50-100/month', value: 'high' },
      { id: 'budget-5', text: 'Over $100/month', value: 'enterprise' }
    ]
  },
  {
    id: 'research-focus',
    text: 'What type of research work are you primarily focused on?',
    type: 'multiple',
    options: [
      { id: 'research-1', text: 'Academic literature review and analysis', value: 'literature' },
      { id: 'research-2', text: 'Complex mathematical or scientific reasoning', value: 'reasoning' },
      { id: 'research-3', text: 'Data analysis and statistical research', value: 'data-analysis' },
      { id: 'research-4', text: 'Knowledge management and organization', value: 'knowledge' },
      { id: 'research-5', text: 'Academic writing and paper creation', value: 'writing' }
    ],
    dependsOn: {
      questionId: 'purpose',
      answers: ['research']
    }
  },
  {
    id: 'business-focus',
    text: 'What business applications are you most interested in?',
    type: 'multiple',
    options: [
      { id: 'business-1', text: 'Team collaboration and communication', value: 'collaboration' },
      { id: 'business-2', text: 'AI model deployment and MLOps', value: 'deployment' },
      { id: 'business-3', text: 'Enterprise security and compliance', value: 'security' },
      { id: 'business-4', text: 'Custom AI model training and fine-tuning', value: 'custom-models' },
      { id: 'business-5', text: 'Business process automation', value: 'automation' }
    ],
    dependsOn: {
      questionId: 'purpose',
      answers: ['business']
    }
  }
];