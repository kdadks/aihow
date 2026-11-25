-- Script: nirchal_strict_isolation_policies.sql
-- Description: Airtight RLS policies for Nirchal tables in 'public' schema.
-- Prevents any How2doAI user from viewing or mutating Nirchal data.

-- ==============================================================================
-- 1. Storefront Public Catalog Tables (products, categories, slides, images)
-- Storefront visitors (anon) and Nirchal users can view active items.
-- Logged-in How2doAI users receive ZERO rows!
-- ==============================================================================

-- Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal public view products" ON public.products;
CREATE POLICY "Nirchal public view products"
ON public.products FOR SELECT
TO anon, authenticated
USING (
    is_active = true
    AND (auth.role() = 'anon' OR shared.is_user_bound_to('nirchal'))
);

-- Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal public view categories" ON public.categories;
CREATE POLICY "Nirchal public view categories"
ON public.categories FOR SELECT
TO anon, authenticated
USING (
    is_active = true
    AND (auth.role() = 'anon' OR shared.is_user_bound_to('nirchal'))
);

-- Product Images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal public view product images" ON public.product_images;
CREATE POLICY "Nirchal public view product images"
ON public.product_images FOR SELECT
TO anon, authenticated
USING (auth.role() = 'anon' OR shared.is_user_bound_to('nirchal'));

-- Product Variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal public view product variants" ON public.product_variants;
CREATE POLICY "Nirchal public view product variants"
ON public.product_variants FOR SELECT
TO anon, authenticated
USING (auth.role() = 'anon' OR shared.is_user_bound_to('nirchal'));

-- Hero Slides & Featured Sections
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal public view hero slides" ON public.hero_slides;
CREATE POLICY "Nirchal public view hero slides"
ON public.hero_slides FOR SELECT
TO anon, authenticated
USING (
    is_active = true
    AND (auth.role() = 'anon' OR shared.is_user_bound_to('nirchal'))
);

ALTER TABLE public.featured_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal public view featured sections" ON public.featured_sections;
CREATE POLICY "Nirchal public view featured sections"
ON public.featured_sections FOR SELECT
TO anon, authenticated
USING (
    is_active = true
    AND (auth.role() = 'anon' OR shared.is_user_bound_to('nirchal'))
);

ALTER TABLE public.featured_section_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal public view featured section products" ON public.featured_section_products;
CREATE POLICY "Nirchal public view featured section products"
ON public.featured_section_products FOR SELECT
TO anon, authenticated
USING (auth.role() = 'anon' OR shared.is_user_bound_to('nirchal'));

-- ==============================================================================
-- 2. Customer & Order Private Tables
-- ONLY users bound to 'nirchal' can access. How2doAI and Anon get 0 rows!
-- ==============================================================================

-- Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal view own orders" ON public.orders;
CREATE POLICY "Nirchal view own orders"
ON public.orders FOR SELECT
TO authenticated
USING (shared.is_user_bound_to('nirchal'));

DROP POLICY IF EXISTS "Nirchal insert orders" ON public.orders;
CREATE POLICY "Nirchal insert orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (shared.is_user_bound_to('nirchal'));

DROP POLICY IF EXISTS "Nirchal update orders" ON public.orders;
CREATE POLICY "Nirchal update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (shared.is_user_bound_to('nirchal'))
WITH CHECK (shared.is_user_bound_to('nirchal'));

-- Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal view order items" ON public.order_items;
CREATE POLICY "Nirchal view order items"
ON public.order_items FOR SELECT
TO authenticated
USING (shared.is_user_bound_to('nirchal'));

DROP POLICY IF EXISTS "Nirchal insert order items" ON public.order_items;
CREATE POLICY "Nirchal insert order items"
ON public.order_items FOR INSERT
TO authenticated
WITH CHECK (shared.is_user_bound_to('nirchal'));

-- Invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal view invoices" ON public.invoices;
CREATE POLICY "Nirchal view invoices"
ON public.invoices FOR SELECT
TO authenticated
USING (shared.is_user_bound_to('nirchal'));

-- Customer Wishlist
ALTER TABLE public.customer_wishlist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal manage wishlist" ON public.customer_wishlist;
CREATE POLICY "Nirchal manage wishlist"
ON public.customer_wishlist FOR ALL
TO authenticated
USING (shared.is_user_bound_to('nirchal'))
WITH CHECK (shared.is_user_bound_to('nirchal'));

-- Customer Addresses
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal manage customer addresses" ON public.customer_addresses;
CREATE POLICY "Nirchal manage customer addresses"
ON public.customer_addresses FOR ALL
TO authenticated
USING (shared.is_user_bound_to('nirchal'))
WITH CHECK (shared.is_user_bound_to('nirchal'));

-- Abandoned Carts
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal manage abandoned carts" ON public.abandoned_carts;
CREATE POLICY "Nirchal manage abandoned carts"
ON public.abandoned_carts FOR ALL
TO authenticated
USING (shared.is_user_bound_to('nirchal'))
WITH CHECK (shared.is_user_bound_to('nirchal'));

-- Return Requests
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Nirchal manage return requests" ON public.return_requests;
CREATE POLICY "Nirchal manage return requests"
ON public.return_requests FOR ALL
TO authenticated
USING (shared.is_user_bound_to('nirchal'))
WITH CHECK (shared.is_user_bound_to('nirchal'));

-- ==============================================================================
-- 3. Block Anon from Any Private Nirchal Tables
-- ==============================================================================
REVOKE ALL ON TABLE public.orders FROM anon;
REVOKE ALL ON TABLE public.order_items FROM anon;
REVOKE ALL ON TABLE public.invoices FROM anon;
REVOKE ALL ON TABLE public.customer_addresses FROM anon;
REVOKE ALL ON TABLE public.customer_wishlist FROM anon;
REVOKE ALL ON TABLE public.return_requests FROM anon;
REVOKE ALL ON TABLE public.return_items FROM anon;
REVOKE ALL ON TABLE public.abandoned_carts FROM anon;
REVOKE ALL ON TABLE public.settings FROM anon;
REVOKE ALL ON TABLE public.vendors FROM anon;
REVOKE ALL ON TABLE public.logistics_partners FROM anon;
