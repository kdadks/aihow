#!/usr/bin/env node
/**
 * Apply Database Migration to Supabase
 * This script reads the migration file and displays instructions
 * for applying it via Supabase SQL Editor
 */

import fs from 'fs';
import path from 'path';

const migrationFile = path.join(
  process.cwd(),
  'supabase/migrations/20260807_fix_analytics_functions_final.sql'
);

if (!fs.existsSync(migrationFile)) {
  console.error(`❌ Migration file not found: ${migrationFile}`);
  process.exit(1);
}

const sql = fs.readFileSync(migrationFile, 'utf-8');

console.log('\n🚀 SUPABASE MIGRATION APPLICATION GUIDE\n');
console.log('================================================\n');

console.log('📋 Instructions:');
console.log('1. Go to: https://app.supabase.com/project/[YOUR_PROJECT_ID]/sql');
console.log('2. Click "New Query"');
console.log('3. Copy and paste the SQL below into the editor');
console.log('4. Click "RUN" button');
console.log('5. Wait for success message\n');

console.log('================================================');
console.log('SQL MIGRATION CONTENT:');
console.log('================================================\n');

console.log(sql);

console.log('\n================================================');
console.log('After running the migration:');
console.log('- Admin dashboard analytics will load correctly ✅');
console.log('- No more "Could not choose function" errors ✅');
console.log('- No more "GROUP BY" errors ✅');
console.log('================================================\n');
