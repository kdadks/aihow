# Analytics Cron Jobs - Setup & Usage Guide

## ✅ What Was Implemented

### 1. App.tsx Updated
- Added `usePageAnalytics` hook to automatically track all page visits
- Tracking is now enabled site-wide with page title capture

### 2. Automated Cron Jobs Created
Four scheduled jobs that run automatically:

| Job Name | Schedule | Purpose |
|----------|----------|---------|
| `aggregate-page-analytics-daily` | Daily at 1:00 AM UTC | Aggregates page visit data into daily summaries |
| `aggregate-site-analytics-daily` | Daily at 1:15 AM UTC | Aggregates site-wide metrics (total visits, sessions, etc.) |
| `aggregate-referral-analytics-daily` | Daily at 1:30 AM UTC | Aggregates tool referral click data |
| `cleanup-old-analytics-data` | Weekly (Sundays) at 2:00 AM UTC | Removes raw data older than 90 days |

## 🚀 Setup Instructions

### Step 1: Apply the Cron Jobs Migration

Go to Supabase Studio → SQL Editor:

```sql
-- Copy and paste the entire contents of:
-- supabase/migrations/20260210000002_create_analytics_cron_jobs.sql
-- Then click "Run"
```

This will:
- ✅ Enable pg_cron extension
- ✅ Create aggregation functions
- ✅ Schedule all cron jobs
- ✅ Create manual trigger functions for testing

### Step 2: Verify Cron Jobs Are Scheduled

Run this query in Supabase SQL Editor:

```sql
SELECT * FROM public.get_analytics_cron_jobs();
```

You should see 4 jobs:
- aggregate-page-analytics-daily
- aggregate-site-analytics-daily
- aggregate-referral-analytics-daily
- cleanup-old-analytics-data

### Step 3: Test the Aggregations Manually

Before waiting for the scheduled time, test the aggregations:

```sql
SELECT * FROM public.run_analytics_aggregation_now();
```

This will run all three aggregation functions and show you the results:
- Page Analytics: SUCCESS
- Site Analytics: SUCCESS
- Referral Analytics: SUCCESS

## 📊 How It Works

### Daily Aggregation Process

**1:00 AM UTC** - Page Analytics Aggregation
- Processes yesterday's page visit data
- Calculates: total visits, unique visitors, avg time on page, bounce rate
- Stores in `page_analytics_summary` table

**1:15 AM UTC** - Site Analytics Aggregation
- Processes yesterday's site-wide data
- Calculates: sessions, duration, new users, device breakdown
- Generates top pages and referrers lists
- Stores in `site_analytics_summary` table

**1:30 AM UTC** - Referral Analytics Aggregation
- Processes yesterday's tool click data
- Calculates: total clicks, unique clicks by tool
- Breaks down clicks by source
- Stores in `tool_referral_analytics` table

**2:00 AM UTC (Sundays)** - Data Cleanup
- Removes raw page visits older than 90 days
- Removes old session data
- Keeps aggregated summaries forever

### Why Staggered Times?

Jobs are scheduled 15 minutes apart to:
- Avoid database resource contention
- Ensure one job completes before the next starts
- Prevent timeout issues with large datasets

## 🛠️ Manual Operations

### Manually Trigger Aggregation

If you want to aggregate data immediately (for testing or after importing historical data):

```sql
-- Run all aggregations
SELECT * FROM public.run_analytics_aggregation_now();

-- Or run individually
SELECT public.aggregate_page_analytics_daily();
SELECT public.aggregate_site_analytics_daily();
SELECT public.aggregate_referral_analytics_daily();
```

### View Aggregated Data

Check the summary tables:

```sql
-- View page analytics summaries
SELECT * FROM public.page_analytics_summary
ORDER BY date DESC, total_visits DESC
LIMIT 20;

-- View site analytics summaries
SELECT * FROM public.site_analytics_summary
ORDER BY date DESC
LIMIT 10;

-- View referral analytics
SELECT * FROM public.tool_referral_analytics
WHERE time_period = 'daily'
ORDER BY period_start DESC
LIMIT 20;
```

### Check Job Execution Logs

To see if jobs ran successfully:

```sql
-- View cron job history (if pg_cron.job_run_details is available)
SELECT *
FROM cron.job_run_details
WHERE jobname LIKE 'aggregate-%'
ORDER BY start_time DESC
LIMIT 10;
```

## 🔧 Customization

### Change Schedule Times

If you want different execution times:

```sql
-- Update a cron job schedule
SELECT cron.unschedule('aggregate-page-analytics-daily');

-- Reschedule with new time (example: 3 AM instead of 1 AM)
SELECT cron.schedule(
    'aggregate-page-analytics-daily',
    '0 3 * * *', -- 3 AM UTC
    $$SELECT public.aggregate_page_analytics_daily();$$
);
```

### Change Data Retention Period

To keep raw data longer than 90 days, modify the cleanup function:

```sql
-- Update cleanup function to keep data for 180 days
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cutoff_date DATE;
BEGIN
    -- Change 90 to 180 (or any number of days)
    v_cutoff_date := CURRENT_DATE - INTERVAL '180 days';

    DELETE FROM public.page_visits
    WHERE visited_at::DATE < v_cutoff_date;

    DELETE FROM public.user_sessions
    WHERE started_at::DATE < v_cutoff_date;
END;
$$;
```

### Disable Automatic Cleanup

If you want to keep all raw data:

```sql
-- Unschedule the cleanup job
SELECT cron.unschedule('cleanup-old-analytics-data');
```

## 📈 Monitoring & Troubleshooting

### Check if Jobs Are Running

```sql
-- List all cron jobs
SELECT * FROM cron.job
WHERE jobname LIKE '%analytics%'
ORDER BY jobname;

-- See job status
SELECT
    jobname,
    schedule,
    active,
    database
FROM cron.job
WHERE active = true;
```

### Disable a Job

```sql
-- Temporarily disable a job
SELECT cron.alter_job('aggregate-page-analytics-daily', active => false);

-- Re-enable it
SELECT cron.alter_job('aggregate-page-analytics-daily', active => true);
```

### Remove a Job

```sql
-- Completely remove a job
SELECT cron.unschedule('job-name-here');
```

### Check for Errors

If aggregations fail:

1. **Check table structure** - Ensure all tables exist
2. **Check data** - Verify there's data to aggregate
3. **Run manually** - Use `run_analytics_aggregation_now()` to see error messages
4. **Check logs** - Look in Supabase Dashboard → Database → Logs

## 🎯 Benefits of Automated Aggregation

### Performance
- ✅ Pre-calculated summaries load instantly
- ✅ No heavy queries on raw data during peak hours
- ✅ Admin dashboard remains fast even with millions of records

### Storage Optimization
- ✅ Raw data auto-cleaned after 90 days
- ✅ Aggregated summaries remain forever
- ✅ Reduces database size and costs

### Historical Analysis
- ✅ Daily summaries enable long-term trend analysis
- ✅ Year-over-year comparisons
- ✅ Consistent data format for reporting

## 📊 Using Aggregated Data in Dashboard

The admin dashboard automatically uses aggregated data when available:

```typescript
// In your analytics components, this query will use aggregated data:
const { data } = await supabase
  .from('site_analytics_summary')
  .select('*')
  .gte('date', startDate)
  .lte('date', endDate)
  .order('date', { ascending: false });
```

## 🔐 Security

### Permissions
- Only authenticated users can execute aggregation functions
- Only admins can view aggregated data (via RLS policies)
- Cron jobs run with SECURITY DEFINER (elevated privileges)

### Data Privacy
- Aggregations don't expose individual user data
- IP addresses cleaned up after 90 days
- Only statistical summaries retained long-term

## 📅 Typical Usage Timeline

**Day 1**: Install and test
- Apply migration
- Run manual aggregation
- Verify data in summary tables

**Day 2**: First automatic run
- Jobs run at scheduled time (1 AM UTC)
- Check summary tables for yesterday's data
- Verify dashboard shows aggregated metrics

**Week 1**: Monitor
- Check job execution daily
- Ensure no errors
- Verify data accuracy

**Week 4**: First cleanup
- On first Sunday, old data is cleaned
- Verify raw data >90 days is removed
- Aggregated summaries remain intact

## 🆘 Common Issues

### Issue: Jobs not running

**Check:**
```sql
SELECT * FROM cron.job WHERE active = false;
```

**Fix:**
```sql
SELECT cron.alter_job('job-name', active => true);
```

### Issue: No data in summary tables

**Check:**
- Is there raw data to aggregate?
- Has enough time passed (jobs run at 1 AM)?

**Fix:**
```sql
-- Manually run aggregation
SELECT * FROM public.run_analytics_aggregation_now();
```

### Issue: "relation cron.job does not exist"

**Cause:** pg_cron extension not enabled

**Fix:**
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

## 📝 Best Practices

1. **Test First** - Always run manual aggregation before relying on cron
2. **Monitor Regularly** - Check job execution weekly
3. **Backup Data** - Export summaries monthly
4. **Review Performance** - Monitor query execution times
5. **Adjust Retention** - Change 90-day limit based on your needs

## 🎓 Next Steps

1. ✅ Apply the cron jobs migration
2. ✅ Test manual aggregation
3. ✅ Wait 24 hours for first automatic run
4. ✅ Verify data in summary tables
5. ✅ Check admin dashboard shows aggregated data
6. ✅ Monitor job execution weekly

---

**Migration File**: `supabase/migrations/20260210000002_create_analytics_cron_jobs.sql`
**Status**: Ready to Deploy ✅
**Created**: February 10, 2026
