/**
 * Tools V2 Migration - Bundle Type Definitions
 */

import type { ToolRef } from './tool.types';

export type BundleStatus = 'active' | 'inactive' | 'draft';

export interface BundleV2 {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  implementation_steps: string[];
  total_cost: string | null;
  tools: ToolRef[];
  category: string | null;
  tags: string[];
  featured: boolean;
  status: BundleStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
