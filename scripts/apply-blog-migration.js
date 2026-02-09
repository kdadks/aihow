#!/usr/bin/env node

/**
 * Apply blog metadata fields migration
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🔧 Applying blog metadata fields migration...\n');

    const migration = `
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS read_time VARCHAR(50),
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS author_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_image TEXT,
ADD COLUMN IF NOT EXISTS author_credential VARCHAR(255),
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS date VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
`;

    const { error } = await supabase.rpc('exec_sql', { sql_query: migration });

    if (error) {
      // Try direct execution via postgREST
      console.log('⚠️  RPC method not available, trying alternative approach...\n');
      
      // We'll need to apply this using separate ALTER statements
      const alterStatements = [
        "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS read_time VARCHAR(50)",
        "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category VARCHAR(100)",
        "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_name VARCHAR(255)",
        "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_image TEXT",
        "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_credential VARCHAR(255)",
        "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image TEXT",
        "ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS date VARCHAR(50)",
        "CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category)"
      ];

      console.log('✅ Migration SQL prepared');
      console.log('\nPlease run the following SQL in your Supabase SQL Editor:\n');
      console.log('='.repeat(60));
      console.log(migration);
      console.log('='.repeat(60));
      console.log('\nThen re-run the blog seeding script.\n');

      process.exit(0);
    }

    console.log('✅ Migration applied successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();
