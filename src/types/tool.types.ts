/**
 * Tools V2 Migration - Tool Type Definitions
 */

import type { SubcategoryRef } from './category.types';

export type PricingType = 'free' | 'freemium' | 'paid' | 'subscription' | 'enterprise' | 'pay-per-use';

export type BillingPeriod = 'monthly' | 'yearly' | 'one-time' | 'pay-per-use';

export type ToolStatus = 'active' | 'inactive' | 'pending';

export interface PricingTierV2 {
  name: string;
  price: string;
  billing_period: BillingPeriod;
  features: string[];
  limitations?: string[];
  is_popular?: boolean;
}

export interface PricingV2 {
  type: PricingType;
  starting_price?: string | null;
  has_free_option: boolean;
  tiers?: PricingTierV2[];
}

export interface ToolMetadata {
  technical_specs?: Record<string, string>;
  support_options?: Record<string, boolean>;
  certifications?: string[];
  compliance_standards?: string[];
}

export interface ToolV2 {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  short_description: string | null;
  website_url: string | null;
  features: string[];
  limitations: string[];
  pricing: PricingV2;
  integrations: string[];
  rating: number;
  review_count: number;
  trending: boolean;
  featured: boolean;
  status: ToolStatus;
  metadata: ToolMetadata;
  last_verified_at: string | null;
  subcategories?: SubcategoryRef[];
  created_at: string;
  updated_at: string;
}

/** Lightweight tool reference stored inside bundles JSONB */
export interface ToolRef {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
}
