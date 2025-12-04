# 🚀 DEPLOYMENT & TESTING CHECKLIST

**Date:** December 4, 2025  
**Status:** Week's tasks complete - ready for deployment

---

## ✅ COMPLETED
- Security hardening (rate limiting, input sanitization, link expiration)
- Database indexes & pagination
- E2E tests with Playwright
- PWA manifest & service worker
- All code committed and pushed to GitHub

---

## 📋 NEXT STEPS (In Order)

### **STEP 1: Verify Netlify Auto-Deploy** 🌐

Your Netlify should auto-deploy from GitHub! Check:

1. **Netlify Dashboard:** https://app.netlify.com
   - Look for site: `grittynittyproto`
   - Should show latest commit: `87087b9`
   - Status: "Published" or "Deploying..."

2. **If not auto-deploying:**
   - Netlify Dashboard → Site Settings → Build & Deploy
   - Check "Continuous Deployment" is enabled
   - Branch: `master` or `main`

3. **Verify Environment Variables:**
   - Site Settings → Environment Variables
   - Must have:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

**Result:** ✅ Site live at your Netlify URL

---

### **STEP 2: Run Database Migration** 🗄️

**File to run:** `MIGRATION_SECURITY_PERFORMANCE.sql`

1. **Supabase Dashboard:** https://supabase.com/dashboard
2. **SQL Editor** → New Query
3. **Copy/paste** entire `MIGRATION_SECURITY_PERFORMANCE.sql`
4. **Click "Run"**

**What it does:**
- Creates `rate_limits` table (for security)
- Adds 7 performance indexes
- Sets up RLS policies

**Verify it worked:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'rate_limits';
-- Should return: rate_limits
```

**Result:** ✅ Database has security table + indexes

---

### **STEP 3: Run Lighthouse Audit** 📊

1. **Open deployed site** in Chrome
2. **DevTools** (F12) → **Lighthouse** tab
3. **Select all categories** + Desktop
4. **Click "Analyze"**

**Expected Scores:**
- Performance: 85+
- Accessibility: 90+
- Best Practices: 95+
- SEO: 90+
- PWA: 85+ (will be 100 with real icons)

**If PWA score low:**
- Issue: "Icons not found"
- Fix: Need to create icons (see Step 4)

**Save report:**
```bash
# In Lighthouse, click "Save as HTML"
# Save to repo root as lighthouse-report.html
git add lighthouse-report.html
git commit -m "Add Lighthouse audit report"
git push
```

**Result:** ✅ Lighthouse scores documented

---

### **STEP 4: Create PWA Icons** 🎨

**Quick solution** (placeholder icons):

**Option A: Online Generator**
1. Go to: https://favicon.io/favicon-generator/
2. Text: "GD"
3. Background: `#48CFCB`
4. Font: Bold
5. Download → Extract → Rename files:
   - `favicon-192.png` → `icon-192.png`
   - `favicon-512.png` → `icon-512.png`
6. Copy both to `public/` folder
7. Duplicate for maskable versions:
   ```bash
   cp public/icon-192.png public/icon-maskable-192.png
   cp public/icon-512.png public/icon-maskable-512.png
   ```

**Option B: Simple colored squares** (fastest)
```bash
cd public
# Create 192x192 colored square
convert -size 192x192 xc:#48CFCB icon-192.png
convert -size 512x512 xc:#48CFCB icon-512.png
cp icon-192.png icon-maskable-192.png
cp icon-512.png icon-maskable-512.png
```

**Commit and deploy:**
```bash
git add public/icon-*.png
git commit -m "Add PWA placeholder icons"
git push
# Netlify will auto-deploy
```

**Result:** ✅ PWA installable (Lighthouse PWA = 100)

---

### **STEP 5: Configure E2E Test Credentials** 🧪

**Create test user:**

1. **Supabase Dashboard** → Authentication → Users
2. **Add User:**
   - Email: `test@gritdocs.com`
   - Password: `TestPassword123!`
   - Auto-confirm: ✅ Yes

3. **Add to GitHub Secrets:**
   - Repo: https://github.com/4yourangeleyes/grittynittyproto
   - Settings → Secrets → Actions → New secret

   Add these 4 secrets:
   ```
   TEST_USER_EMAIL = test@gritdocs.com
   TEST_USER_PASSWORD = TestPassword123!
   VITE_SUPABASE_URL = https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGc...
   ```

4. **Update workflow** to use secrets:

**Result:** ✅ E2E tests can run on CI/CD

---

## 🎯 QUICK SUMMARY

**Do these 5 steps in order:**

1. ✅ **Netlify** - Verify auto-deploy working
2. ✅ **Database** - Run `MIGRATION_SECURITY_PERFORMANCE.sql`
3. ✅ **Lighthouse** - Run audit, save report
4. ✅ **Icons** - Create placeholder icons (5 min)
5. ✅ **Tests** - Add test user + GitHub secrets

**Total time:** ~30 minutes

**Result:** Production-ready app with 100 Lighthouse PWA score! 🚀

---

## 🚨 TROUBLESHOOTING

**"Netlify not deploying"**
- Check Site Settings → Build & Deploy
- Verify branch is `master`
- Check build logs for errors

**"Migration failed"**
- Might already have some tables
- Migration uses `IF NOT EXISTS` - safe to re-run
- Check SQL Editor output for errors

**"PWA won't install"**
- Icons must exist in `public/` folder
- Manifest must be accessible at `/manifest.json`
- Must be HTTPS (Netlify provides)
- Try incognito window

**"E2E tests failing"**
- Verify test user exists in Supabase
- Check GitHub secrets are set correctly
- View Actions logs for specific errors

---

## ✅ FINAL CHECKLIST

After all 5 steps:

- [ ] Netlify site is live and accessible
- [ ] Database has rate_limits table + indexes
- [ ] Lighthouse audit saved (all scores 85+)
- [ ] PWA icons created (4 files in public/)
- [ ] E2E test user created in Supabase
- [ ] GitHub secrets configured

**When complete:** Ready for beta users! 🎉
