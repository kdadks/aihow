/**
 * Tools V2 Migration - Category Type Definitions
 */

export interface SubcategoryV2 {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_category_id: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryV2 {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  subcategories?: SubcategoryV2[];
  created_at: string;
  updated_at: string;
}

/** Lightweight reference used in nested views */
export interface CategoryRef {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
}

export interface SubcategoryRef {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_category_id: string;
  category_slug: string;
  category_name: string;
  category_icon: string | null;
}
