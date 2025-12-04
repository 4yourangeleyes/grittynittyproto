# Sentry Error Monitoring Setup Guide

## 🎯 Goal
Set up comprehensive error tracking and monitoring for production.

## 📋 Step-by-Step Instructions

### 1. Create Sentry Account (5 minutes)

1. Go to https://sentry.io/signup/
2. Sign up with:
   - GitHub (recommended - auto-connects repos)
   - OR Email
3. Verify your email
4. Create organization name (e.g., "YourCompany")

### 2. Create New Project (2 minutes)

1. Click **Create Project**
2. Select platform: **React**
3. Set alert frequency: **Alert me on every new issue**
4. Project name: `gritdocs-production`
5. Click **Create Project**

### 3. Get DSN (Data Source Name) (1 minute)

After project creation, you'll see:
```
Sentry.init({
  dsn: "https://xxxxxx@xxxxx.ingest.sentry.io/xxxxxx"
})
```

**COPY THIS DSN** - you'll need it!

If you missed it:
1. Go to **Settings** → **Projects** → **gritdocs-production**
2. Click **Client Keys (DSN)**
3. Copy the DSN

### 4. Add to Environment Variables (1 minute)

Add to `.env.local`:
```bash
VITE_SENTRY_DSN=https://xxxxxx@xxxxx.ingest.sentry.io/xxxxxx
VITE_SENTRY_ENVIRONMENT=production
```

### 5. Verify Setup (1 minute)

The Sentry integration is already configured in `App.tsx`!

Test it:
```bash
npm run dev
```

Open browser console and run:
```javascript
throw new Error("Test Sentry Error");
```

Check Sentry dashboard - error should appear within 30 seconds.

## 🔧 What's Already Configured

### App.tsx Integration
- ✅ Sentry initialized on app startup
- ✅ User context tracked (email, id)
- ✅ Environment tags (production/development)
- ✅ Release tracking
- ✅ Performance monitoring enabled

### Error Boundaries
- ✅ ErrorBoundary component wraps app
- ✅ Catches React component errors
- ✅ Shows user-friendly fallback UI
- ✅ Automatically reports to Sentry

### Automatic Tracking
- ✅ JavaScript exceptions
- ✅ Promise rejections
- ✅ Network errors (failed API calls)
- ✅ React component errors
- ✅ Performance metrics

## 📊 Sentry Dashboard Features

### Issues Tab
- See all errors in real-time
- Stack traces with source maps
- User context (who experienced the error)
- Browser/OS information
- Frequency and impact metrics

### Performance Tab
- Page load times
- API call durations
- Slow database queries
- User flow analysis

### Alerts
- Email notifications for new errors
- Slack integration (optional)
- Weekly summary reports
- Spike detection

## 🎯 Custom Error Tracking

### Manual Error Reporting
```typescript
import * as Sentry from '@sentry/react';

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'invoice-creation' },
    extra: { documentId: doc.id }
  });
}
```

### Custom Messages
```typescript
Sentry.captureMessage('Important event happened', {
  level: 'info',
  tags: { feature: 'ai-generation' }
});
```

### User Feedback
```typescript
Sentry.setUser({
  email: user.email,
  id: user.id,
  username: user.fullName
});
```

## 🚀 Deployment Setup

### For Netlify

Add environment variables in Netlify dashboard:
1. Go to **Site Settings** → **Environment variables**
2. Add:
   - Key: `VITE_SENTRY_DSN`
   - Value: Your Sentry DSN
3. Add:
   - Key: `VITE_SENTRY_ENVIRONMENT`
   - Value: `production`
4. Redeploy site

### Source Maps Upload (Optional)

For better stack traces, upload source maps:

1. Install Sentry CLI:
```bash
npm install --save-dev @sentry/vite-plugin
```

2. Add to `vite.config.ts`:
```typescript
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
  plugins: [
    sentryVitePlugin({
      org: "your-org",
      project: "gritdocs-production",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});
```

## 📋 Monitoring Checklist

### Critical Errors to Watch
- [ ] Supabase authentication failures
- [ ] AI generation errors (Gemini API)
- [ ] PDF export failures
- [ ] Email sending failures
- [ ] Template loading errors
- [ ] Payment processing (future)

### Performance Metrics
- [ ] Page load time < 3 seconds
- [ ] Time to Interactive < 5 seconds
- [ ] AI generation < 10 seconds
- [ ] PDF export < 5 seconds

### Alert Configuration
- [ ] Set up email alerts for new errors
- [ ] Create Slack channel for urgent issues
- [ ] Configure spike detection (> 10 errors/minute)
- [ ] Set up uptime monitoring

## 🔍 Debugging with Sentry

### 1. Reproduce User Errors
- Click issue in dashboard
- See exact user actions before error
- View network requests
- Check browser console logs

### 2. Fix and Deploy
- Fix the bug
- Deploy new version
- Mark issue as "Resolved"

### 3. Monitor Resolution
- Sentry auto-reopens if error recurs
- Track regression rate
- See if fix actually worked

## 💰 Pricing

### Free Tier (Perfect for starting)
- **5,000 errors/month**
- **10,000 performance units/month**
- 1 project
- 30-day history
- Email support

### Paid Tier (When you grow)
- $26/month
- 50,000 errors/month
- Unlimited projects
- 90-day history
- Priority support

## ✅ Success Checklist

- [ ] Sentry account created
- [ ] Project created
- [ ] DSN copied and added to .env.local
- [ ] Test error sent successfully
- [ ] Error appears in Sentry dashboard
- [ ] Email alert received
- [ ] Environment variables added to Netlify
- [ ] Source maps uploading (optional)

## 🚨 Common Issues

### No errors showing up
- Check DSN is correct
- Verify VITE_SENTRY_DSN is set
- Check browser console for Sentry initialization
- Make sure environment is "production" in Netlify

### Too many errors
- Set up filters to ignore known issues
- Configure sample rate (50% of errors)
- Add beforeSend hook to filter noise

### Performance slow
- Sentry adds ~30KB to bundle
- Performance monitoring is optional
- Consider disabling in development

---

**Estimated Setup Time:** 15 minutes
**Cost:** FREE (5,000 errors/month)
**Value:** Catch bugs before users complain! 🐛
