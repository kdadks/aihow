export type SupportOptionKey = 'documentation' | 'email' | 'phone' | 'chat' | 'community';

export type SearchFilters = {
  category?: string;
  subcategory?: string;
  pricing?: string[];
  features?: string[];
  rating?: number;
  certifications?: string[];
  supportOptions?: SupportOptionKey[];
  query?: string;
};

export type SavedComparison = {
  id: string;
  name: string;
  toolIds: string[];
  createdAt: Date;
  userId: string;
  isPublic: boolean;
  views: number;
};

export type ComparisonMetric = {
  toolIds: string[];
  count: number;
  lastUsed: Date;
};