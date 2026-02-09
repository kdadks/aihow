/**
 * Tools V2 Migration - Data Seeding Script
 * Phase 1 - Day 2
 *
 * Reads static data from src/data/ and inserts into V2 Supabase tables.
 *
 * Usage:
 *   node scripts/seed-v2-data.js
 *
 * Prerequisites:
 *   - V2 schema migration applied (20250604181357_create_v2_schema.sql)
 *   - VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set in .env
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

// Use service role key for seeding (bypasses RLS)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables:');
  if (!supabaseUrl) console.error('   VITE_SUPABASE_URL');
  if (!serviceRoleKey) console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// ============================================================
// Load static data via dynamic import (ESM)
// ============================================================
async function loadStaticData() {
  // Use tsx/ts-node compatible dynamic imports by reading the built output
  // or we can use a workaround: read the .ts file as text and parse
  // Since we can't directly import .ts in plain Node, we'll use the
  // compiled approach via tsx if available, otherwise fall back to
  // parsing the raw data.

  // Try to use tsx for TypeScript imports
  try {
    const { tools } = await import('../src/data/tools.js').catch(() =>
      import('../src/data/tools.ts')
    );
    const { categories } = await import('../src/data/categories.js').catch(() =>
      import('../src/data/categories.ts')
    );
    const { workflowBundles } = await import('../src/data/workflows.js').catch(() =>
      import('../src/data/workflows.ts')
    );
    return { tools, categories, workflowBundles };
  } catch (e) {
    console.error('❌ Could not import static data. Run with: npx tsx scripts/seed-v2-data.js');
    console.error('   or: npx ts-node --esm scripts/seed-v2-data.js');
    throw e;
  }
}

// ============================================================
// Slug helpers
// ============================================================
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ============================================================
// Seed categories + subcategories
// ============================================================
async function seedCategories(categories) {
  console.log('\n📂 Seeding categories...');

  const categoryInserts = categories.map((cat, idx) => ({
    slug: cat.id,
    name: cat.name,
    description: cat.description,
    icon: cat.icon || null,
    display_order: idx,
  }));

  const { data: insertedCategories, error: catError } = await supabase
    .from('tool_categories_v2')
    .upsert(categoryInserts, { onConflict: 'slug' })
    .select('id, slug');

  if (catError) {
    throw new Error(`Category insert failed: ${catError.message}`);
  }

  console.log(`   ✅ ${insertedCategories.length} categories seeded`);

  // Build slug → id map
  const categoryMap = {};
  insertedCategories.forEach((c) => {
    categoryMap[c.slug] = c.id;
  });

  // Seed subcategories
  console.log('\n📂 Seeding subcategories...');
  const subcategoryInserts = [];

  categories.forEach((cat) => {
    const parentId = categoryMap[cat.id];
    if (!parentId) {
      console.warn(`   ⚠️  No parent found for category: ${cat.id}`);
      return;
    }

    (cat.subcategories || []).forEach((sub, idx) => {
      subcategoryInserts.push({
        slug: sub.id,  // Now unique per parent via DB constraint
        name: sub.name,
        description: sub.description || null,
        parent_category_id: parentId,
        display_order: idx,
      });
    });
  });

  const { data: insertedSubs, error: subError } = await supabase
    .from('subcategories_v2')
    .upsert(subcategoryInserts, { onConflict: 'slug,parent_category_id' })
    .select('id, slug');

  if (subError) {
    throw new Error(`Subcategory insert failed: ${subError.message}`);
  }

  console.log(`   ✅ ${insertedSubs.length} subcategories seeded`);

  // Build composite subcategory map: {categorySlug}-{subSlug} → id
  // Since subcategory slugs are only unique per parent, we use composite keys
  const subcategoryMap = {};

  // Match inserted subcategories back to original data by parent_id and slug
  subcategoryInserts.forEach((insert, idx) => {
    const insertedSub = insertedSubs[idx];
    if (!insertedSub) return;

    // Find which category this belongs to
    const catEntry = Object.entries(categoryMap).find(
      ([slug, id]) => id === insert.parent_category_id
    );

    if (catEntry) {
      const [categorySlug] = catEntry;
      const compositeKey = `${categorySlug}-${insert.slug}`;
      subcategoryMap[compositeKey] = insertedSub.id;
    }
  });

  return { categoryMap, subcategoryMap };
}

// ============================================================
// Seed tools
// ============================================================
async function seedTools(tools, subcategoryMap, categories) {
  console.log('\n🔧 Seeding tools...');

  const toolInserts = tools.map((tool) => ({
    slug: tool.slug || tool.id,
    name: tool.name,
    description: tool.description || null,
    short_description: tool.shortDescription || null,
    website_url: tool.website || null,
    features: tool.features || [],
    limitations: tool.limitations || [],
    pricing: tool.pricing
      ? {
          type: tool.pricing.type,
          starting_price: tool.pricing.startingPrice || null,
          has_free_option: tool.pricing.hasFreeOption || false,
          tiers: (tool.pricing.tiers || []).map((tier) => ({
            name: tier.name,
            price: tier.price,
            billing_period: tier.billingPeriod,
            features: tier.features || [],
            limitations: tier.limitations || [],
            is_popular: tier.isPopular || false,
          })),
        }
      : {},
    integrations: tool.integrations || [],
    rating: tool.rating || 0,
    review_count: tool.reviewCount || 0,
    trending: tool.trending || false,
    featured: tool.featured || false,
    status: 'active',
    last_verified_at: tool.lastVerified ? new Date(tool.lastVerified).toISOString() : null,
    metadata: {
      technical_specs: tool.technicalSpecs || {},
      support_options: tool.supportOptions || {},
      certifications: tool.certifications || [],
      compliance_standards: tool.complianceStandards || [],
    },
  }));

  // Insert in batches of 50 to avoid payload limits
  const batchSize = 50;
  let totalInserted = 0;
  const insertedTools = [];

  for (let i = 0; i < toolInserts.length; i += batchSize) {
    const batch = toolInserts.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('tools_v2')
      .upsert(batch, { onConflict: 'slug' })
      .select('id, slug');

    if (error) {
      throw new Error(`Tool batch insert failed (batch ${i / batchSize + 1}): ${error.message}`);
    }

    insertedTools.push(...data);
    totalInserted += data.length;
    process.stdout.write(`   Progress: ${totalInserted}/${toolInserts.length}\r`);
  }

  console.log(`\n   ✅ ${totalInserted} tools seeded`);

  // Build tool slug → id map
  const toolMap = {};
  insertedTools.forEach((t) => {
    toolMap[t.slug] = t.id;
  });

  // Seed tool ↔ subcategory mappings
  // USE CATEGORIES as source of truth (subcategory.tools array)
  console.log('\n🔗 Seeding tool-subcategory mappings...');
  const mappingsSet = new Set();
  const mappings = [];

  categories.forEach((category) => {
    (category.subcategories || []).forEach((subcategory) => {
      // Get subcategory ID from the map
      const compositeKey = `${category.id}-${subcategory.id}`;
      const subId = subcategoryMap[compositeKey];

      if (!subId) {
        console.warn(`   ⚠️  Subcategory not found: ${compositeKey}`);
        return;
      }

      // Map each tool listed in this subcategory
      (subcategory.tools || []).forEach((toolSlug) => {
        const toolId = toolMap[toolSlug];
        if (toolId) {
          const uniqueKey = `${toolId}-${subId}`;
          if (!mappingsSet.has(uniqueKey)) {
            mappingsSet.add(uniqueKey);
            mappings.push({ tool_id: toolId, subcategory_id: subId });
          }
        } else {
          console.warn(`   ⚠️  Tool not found: ${toolSlug} (in ${category.id}/${subcategory.id})`);
        }
      });
    });
  });

  if (mappings.length > 0) {
    const { error: mapError } = await supabase
      .from('tool_subcategories_v2')
      .upsert(mappings, { onConflict: 'tool_id,subcategory_id' });

    if (mapError) {
      throw new Error(`Tool-subcategory mapping failed: ${mapError.message}`);
    }
    console.log(`   ✅ ${mappings.length} tool-subcategory mappings seeded`);
  } else {
    console.log('   ⚠️  No tool-subcategory mappings found');
  }

  return toolMap;
}

// ============================================================
// Seed bundles
// ============================================================
async function seedBundles(workflowBundles) {
  console.log('\n📦 Seeding bundles...');

  const bundleInserts = workflowBundles.map((bundle) => ({
    slug: toSlug(bundle.name),
    name: bundle.name,
    description: bundle.description || null,
    implementation_steps: bundle.implementationSteps || [],
    total_cost: bundle.totalCost || null,
    // Store tool references as lightweight objects (id + name)
    tools: (bundle.tools || []).map((t) => ({
      id: t.id,
      name: t.name,
      slug: t.slug || t.id,
      short_description: t.shortDescription || null,
    })),
    featured: false,
    status: 'active',
  }));

  const { data: insertedBundles, error } = await supabase
    .from('tool_bundles_v2')
    .upsert(bundleInserts, { onConflict: 'slug' })
    .select('id, slug');

  if (error) {
    throw new Error(`Bundle insert failed: ${error.message}`);
  }

  console.log(`   ✅ ${insertedBundles.length} bundles seeded`);
  return insertedBundles;
}

// ============================================================
// Verification
// ============================================================
async function verify() {
  console.log('\n🔍 Verifying seeded data...');

  const tables = [
    'tool_categories_v2',
    'subcategories_v2',
    'tools_v2',
    'tool_subcategories_v2',
    'tool_bundles_v2',
  ];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.warn(`   ⚠️  Could not count ${table}: ${error.message}`);
    } else {
      console.log(`   ${table}: ${count} rows`);
    }
  }
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log('🚀 Tools V2 Data Seeding Script');
  console.log('================================');
  console.log(`   Supabase URL: ${supabaseUrl}`);

  try {
    const { tools, categories, workflowBundles } = await loadStaticData();

    console.log(`\n📊 Static data loaded:`);
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Tools: ${tools.length}`);
    console.log(`   Bundles: ${workflowBundles.length}`);

    const { categoryMap, subcategoryMap } = await seedCategories(categories);
    await seedTools(tools, subcategoryMap, categories);
    await seedBundles(workflowBundles);
    await verify();

    console.log('\n✅ Seeding complete!\n');
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

main();
