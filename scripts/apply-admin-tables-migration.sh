#!/bin/bash

# Apply missing admin tables migration to Supabase
# This script will apply the migration using the Supabase CLI

echo "🔄 Applying missing admin tables migration..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Please install it with: npm install -g supabase"
    echo ""
    echo "Or apply the migration manually:"
    echo "1. Go to your Supabase Dashboard -> SQL Editor"
    echo "2. Copy the contents of: supabase/migrations/20260209000002_create_missing_admin_tables.sql"
    echo "3. Paste and run it"
    exit 1
fi

# Apply the migration
echo "Applying migration..."
supabase db push --db-url "${SUPABASE_DB_URL:-$DATABASE_URL}"

if [ $? -eq 0 ]; then
    echo "✅ Migration applied successfully!"
    echo ""
    echo "The following tables have been created/verified:"
    echo "  - system_settings"
    echo "  - feature_flags"
    echo "  - moderation_queue"
    echo "  - content_items"
    echo "  - audit_logs"
    echo ""
    echo "You can now access /admin/settings without errors!"
else
    echo "❌ Migration failed. Please apply manually:"
    echo "1. Go to your Supabase Dashboard -> SQL Editor"
    echo "2. Copy the contents of: supabase/migrations/20260209000002_create_missing_admin_tables.sql"
    echo "3. Paste and run it"
    exit 1
fi
