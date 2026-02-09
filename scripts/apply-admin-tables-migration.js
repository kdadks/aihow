#!/usr/bin/env node

/**
 * Apply Admin Tables Migration
 * This script creates the missing admin portal tables in Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials');
    console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY in your .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
    console.log('🔄 Applying missing admin tables migration...\n');

    try {
        // Read the migration file
        const migrationPath = join(__dirname, '../supabase/migrations/20260209000002_create_missing_admin_tables.sql');
        const migrationSQL = readFileSync(migrationPath, 'utf8');

        // Note: The Supabase JS client doesn't support running raw SQL directly
        // You need to use the Supabase Dashboard or CLI
        console.log('⚠️  The Supabase JS client cannot run raw SQL migrations.');
        console.log('');
        console.log('Please apply this migration using one of the following methods:');
        console.log('');
        console.log('📋 Method 1: Supabase Dashboard (Recommended)');
        console.log('  1. Go to: ' + supabaseUrl.replace('/v1', '') + '/project/_/sql');
        console.log('  2. Copy the migration SQL from: supabase/migrations/20260209000002_create_missing_admin_tables.sql');
        console.log('  3. Paste and click "Run"');
        console.log('');
        console.log('🔧 Method 2: Supabase CLI');
        console.log('  Run: supabase db push');
        console.log('');
        console.log('📄 Migration file location:');
        console.log('  ' + migrationPath);
        console.log('');

        // Try to verify if tables exist
        console.log('🔍 Checking current database state...\n');
        
        const tables = ['system_settings', 'moderation_queue', 'feature_flags', 'audit_logs'];
        for (const table of tables) {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (error && error.code === '42P01') {
                console.log(`❌ Table "${table}" does not exist`);
            } else if (error) {
                console.log(`⚠️  Table "${table}": ${error.message}`);
            } else {
                console.log(`✅ Table "${table}" exists`);
            }
        }

        console.log('');
        console.log('After applying the migration, the following tables will be available:');
        console.log('  ✓ system_settings - System configuration');
        console.log('  ✓ feature_flags - Feature toggles');
        console.log('  ✓ moderation_queue - Content moderation');
        console.log('  ✓ content_items - Content management');
        console.log('  ✓ audit_logs - Audit trail');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

applyMigration();
