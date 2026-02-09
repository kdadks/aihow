#!/bin/bash

# Script to run migrations directly via psql

DATABASE_URL="postgres://postgres.bynlkphjpmxskoqiahow:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bmxrcGhqcG14c2tvcWlhaG93Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MDEyNCwiZXhwIjoyMDYzNzY2MTI0fQ.9m73ycx68w-itsiVes6zXbz7bxkRtrJ9waxUm49n2jQ@db.bynlkphjpmxskoqiahow.supabase.co:5432/postgres"

echo "🚀 Running migrations..."

echo "📝 Applying forum tables migration..."
psql "$DATABASE_URL" < supabase/migrations/20250601_community.sql

echo "📝 Applying reviews V2 migration..."
psql "$DATABASE_URL" < supabase/migrations/20250609000000_create_reviews_v2.sql

echo "📝 Applying case studies migration..."
psql "$DATABASE_URL" < supabase/migrations/20250609000001_create_case_studies.sql

echo "✅ Migrations complete!"
