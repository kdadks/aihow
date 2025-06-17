import { SupportOptionKey } from './common';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  website: string;
  categoryId: string;
  subcategoryIds: string[];
  pricing: {
    type: string;
    startingPrice?: string;
    hasFreeOption: boolean;
    tiers?: PricingTier[];
  };
  features: string[];
  featureDetails?: {
    [key: string]: {
      description: string;
      availability: 'all' | 'premium' | 'enterprise';
    };
  };
  limitations: string[];
  rating: number;
  reviewCount: number;
  trending?: boolean;
  featured?: boolean;
  integrations?: string[];
  lastVerified?: Date;
  technicalSpecs?: {
    [key: string]: string;
  };
  supportOptions?: Record<SupportOptionKey, boolean>;
  certifications?: string[];
  complianceStandards?: string[];
}

export interface PricingTier {
  name: string;
  price: string;
  billingPeriod: 'monthly' | 'yearly' | 'one-time' | 'pay-per-use';
  features: string[];
  limitations?: string[];
  isPopular?: boolean;
}