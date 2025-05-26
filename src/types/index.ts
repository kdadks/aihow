import { Tool } from './Tool';

export * from './common';
export * from './Tool';

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  description: string;
  parentCategoryId: string;
  tools?: string[];
};

export type Review = {
  id: string;
  toolId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: Date;
  verified: boolean;
  upvotes: number;
};

export type Recommendation = {
  toolId: string;
  score: number;
  matchReason: string;
};

export type WorkflowBundle = {
  id: string;
  name: string;
  description: string;
  tools: Tool[];
  totalCost: string;
  implementationSteps: string[];
};

export type QuestionOption = {
  id: string;
  text: string;
  value: string;
};

export type Question = {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'range';
  options?: QuestionOption[];
  dependsOn?: {
    questionId: string;
    answers: string[];
  };
};

export type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  savedTools: string[];
  savedWorkflows: string[];
  recommendations: Recommendation[];
};