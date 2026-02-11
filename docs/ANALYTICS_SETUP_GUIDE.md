# Analytics System - Quick Setup Guide

## 🚀 Getting Started (5 Minutes)

Follow these steps to get the complete analytics system up and running.

## Step 1: Apply Database Migrations

You need to run TWO migrations in Supabase Studio:

### Migration 1: Referral System ✅ (Already Fixed)

1. Open Supabase Studio → SQL Editor
2. Click "New Query"
3. Copy the entire contents of:
   ```
   supabase/migrations/20260210000000_create_referral_system.sql
   ```
4. Paste and click **"Run"**
5. Should see: "Success. No rows returned"

### Migration 2: Page Analytics 🆕 (New)

1. In Supabase Studio → SQL Editor
2. Click "New Query"
3. Copy the entire contents of:
   ```
   supabase/migrations/20260210000001_create_page_analytics.sql
   ```
4. Paste and click **"Run"**
5. Should see: "Success. No rows returned"

## Step 2: Verify Tables Created

In Supabase Studio → Table Editor, you should see:

**Referral Tables:**
- ✅ `tool_referrals`
- ✅ `tool_referral_analytics`

**Page Analytics Tables:**
- ✅ `page_visits`
- ✅ `user_sessions`
- ✅ `page_analytics_summary`
- ✅ `site_analytics_summary`

## Step 3: Enable Page Tracking

In your main App component, add the tracking hook:

### Option A: Add to App.tsx

```typescript
import { usePageAnalytics } from './hooks/usePageAnalytics';

function App() {
  // Enable automatic page visit tracking
  usePageAnalytics({
    enabled: true,
    trackPageTitle: true
  });

  return (
    <Router>
      {/* Your routes */}
    </Router>
  );
}
```

### Option B: Add to MainLayout.tsx

```typescript
import { usePageAnalytics } from '../hooks/usePageAnalytics';

function MainLayout({ children }: { children: React.ReactNode }) {
  // Enable tracking for all pages using this layout
  usePageAnalytics({ enabled: true });

  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
```

## Step 4: Test the System

### Test Page Tracking

1. **Open your site** (development or production)
2. **Navigate to different pages** (home, directory, tools, etc.)
3. **Check Supabase Studio**:
   - Go to Table Editor → `page_visits`
   - You should see new rows appearing
   - Each row = one page visit

### Test Referral Tracking

1. **Go to a tool listing page**
2. **Click "Visit Site"** on any tool card
3. **Check Supabase Studio**:
   - Go to Table Editor → `tool_referrals`
   - You should see a new row with the click data

### Test Admin Dashboard

1. **Log in as admin**
2. **Go to Admin → Analytics**
3. **You should see**:
   - Analytics Workflow interface
   - Four tabs: Overview, Page Analytics, Referrals, Real-Time
   - Metrics displaying (may be zero if no data yet)

## Step 5: Verify Real-Time Updates

1. **In Admin → Analytics**, click the **"Real-Time"** tab
2. **Open your site in another tab**
3. **Navigate around the site**
4. **Go back to Admin → Analytics**
5. **Click "Refresh Now"**
6. You should see the **"Active Users"** count increase

## 🎯 Quick Verification Checklist

Use this checklist to ensure everything is working:

- [ ] Both migrations applied successfully
- [ ] All tables visible in Supabase Studio
- [ ] usePageAnalytics hook added to App
- [ ] Page visits appear in `page_visits` table when navigating
- [ ] Tool clicks appear in `tool_referrals` table when clicking "Visit Site"
- [ ] Admin Analytics page loads without errors
- [ ] All four tabs (Overview, Pages, Referrals, Real-Time) work
- [ ] Export button downloads CSV files
- [ ] Real-time tab shows active users

## 🐛 Common Issues & Fixes

### Issue: "Function track_page_visit does not exist"

**Cause:** Migration not applied
**Fix:** Re-run Migration 2 (page analytics)

### Issue: No data showing in analytics

**Cause:** No traffic yet OR tracking not enabled
**Fix:**
1. Verify usePageAnalytics is called
2. Navigate around your site
3. Wait 1-2 minutes for data to appear
4. Refresh the analytics page

### Issue: "Permission denied" errors

**Cause:** RLS policies not created
**Fix:** Re-run both migrations completely

### Issue: Export button not working

**Cause:** No data to export OR browser blocking download
**Fix:**
1. Check if data exists in tables
2. Try a different browser
3. Check browser download settings

## 📊 What Happens Next

Once setup is complete:

1. **Automatic Tracking**: Every page visit is tracked automatically
2. **Tool Clicks**: Every "Visit Site" click is recorded
3. **Session Tracking**: User sessions are managed automatically
4. **Analytics Updates**: Data appears in admin dashboard in real-time
5. **Daily Aggregations**: RPC functions calculate daily summaries

## 💡 Pro Tips

### For Development

```typescript
// Disable tracking in development if needed
usePageAnalytics({
  enabled: process.env.NODE_ENV === 'production'
});
```

### For Testing

```typescript
// Enable tracking with detailed logging
usePageAnalytics({
  enabled: true,
  trackPageTitle: true // Helps identify pages in analytics
});
```

### For Production

```typescript
// Standard production setup
usePageAnalytics({
  enabled: true,
  trackPageTitle: true
});
```

## 📈 Usage Workflow

### Daily Monitoring

1. Open Admin → Analytics
2. Check "Real-Time" tab for current activity
3. Review "Overview" for overall performance
4. Export data weekly for records

### Weekly Analysis

1. Go to "Page Analytics" tab
2. Review top pages
3. Check bounce rates
4. Identify popular content

### Monthly Reporting

1. Set date range to "Last 30 days"
2. Go to "Overview" tab
3. Click "Export"
4. Generate comprehensive report

## 🎓 Next Steps

After setup, you might want to:

1. **Customize tracking sources** in ReferralLink components
2. **Add custom events** for specific user actions
3. **Set up scheduled exports** (future feature)
4. **Create custom dashboards** for specific metrics
5. **Integrate with external tools** (Google Analytics, etc.)

## 📞 Need Help?

If you encounter issues:

1. Check the main documentation: `ANALYTICS_WORKFLOW_IMPLEMENTATION.md`
2. Review Supabase logs for SQL errors
3. Check browser console for JavaScript errors
4. Verify RLS policies in Supabase Studio

## ✅ Success Criteria

Your setup is successful when:

✅ Both migrations run without errors
✅ All tables exist in Supabase
✅ Page visits are tracked automatically
✅ Tool clicks are recorded
✅ Admin dashboard shows metrics
✅ All four tabs work correctly
✅ Export functionality works
✅ Real-time updates refresh

---

**Estimated Setup Time**: 5-10 minutes
**Difficulty**: Easy
**Prerequisites**: Admin access to Supabase Studio

🎉 **You're ready to monitor your site analytics!**
