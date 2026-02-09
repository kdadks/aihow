/**
 * Apply migrations using Supabase client
 */

import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

async function runMigration(client, filePath, name) {
  console.log(`\n📝 Running ${name}...`);

  try {
    const sql = readFileSync(filePath, 'utf8');
    await client.query(sql);
    console.log(`   ✅ Success!`);
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    // Don't stop on errors, some might be "already exists" errors
    return false;
  }
}

async function main() {
  console.log('🚀 Applying migrations via direct PostgreSQL connection...\n');

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }

  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    const migrations = [
      {
        path: resolve(__dirname, '../supabase/migrations/20250601_community.sql'),
        name: 'Forum tables (20250601_community.sql)'
      },
      {
        path: resolve(__dirname, '../supabase/migrations/20250609000000_create_reviews_v2.sql'),
        name: 'Reviews V2 table (20250609000000_create_reviews_v2.sql)'
      },
      {
        path: resolve(__dirname, '../supabase/migrations/20250609000001_create_case_studies.sql'),
        name: 'Case studies table (20250609000001_create_case_studies.sql)'
      }
    ];

    for (const migration of migrations) {
      await runMigration(client, migration.path, migration.name);
    }

    console.log('\n✅ All migrations applied!');

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
