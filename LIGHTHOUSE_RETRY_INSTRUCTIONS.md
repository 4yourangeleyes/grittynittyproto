# 🔧 Fix Current Issues

## Issue #1: Database Schema Error (CRITICAL - Fix Now)

**Error:** `Could not find the 'body_text' column of 'documents' in the schema cache`

**Cause:** Your Supabase schema is missing the `body_text` column that contracts need.

### ✅ Fix (30 seconds):

1. **Supabase Dashboard** → SQL Editor → New Query
2. **Copy/Paste:** `FIX_SCHEMA_MISMATCH.sql`
3. **Click:** Run
4. **Refresh** your deployed site - error should be gone

---

## Issue #2: Lighthouse Audit Failed

**Error:** `NO_FCP - The page did not paint any content`

**Cause:** Browser window lost focus during audit (you probably switched tabs/windows)

### ✅ Fix (Re-run Lighthouse correctly):

**IMPORTANT STEPS:**

1. **Open site** in Chrome: https://monumental-axolotl-b1c008.netlify.app

2. **Close ALL other tabs** (this is critical - avoid distractions)

3. **Don't touch anything** during the audit

4. **F12** → Lighthouse tab

5. **Settings:**
   - Mode: **Navigation (Default)**
   - Device: **Desktop**
   - Categories: ✅ **All 5** (Performance, Accessibility, Best Practices, SEO, PWA)

6. **Click "Analyze page load"**

7. **Keep browser in foreground** - DO NOT:
   - ❌ Switch tabs
   - ❌ Switch windows
   - ❌ Minimize browser
   - ❌ Open other apps
   - ✅ Just wait ~30 seconds

8. **After completion:**
   - Click "Save as HTML"
   - Save as `lighthouse-report.html` in repo root
   - Move old report to `lighthouse audits/` folder

---

## Expected Lighthouse Scores (After Schema Fix)

Once `body_text` column is added and console errors are gone:

- **Performance:** 75-85 (good for React SPA)
- **Accessibility:** 95-100 (already excellent)
- **Best Practices:** 90-95 (HTTPS, no console errors)
- **SEO:** 90-100 (has title, meta, structured data)
- **PWA:** 85-90 (has manifest + service worker, needs icons for 100)

---

## Console Errors - What Got Fixed

After adding `body_text` column, these will disappear:

❌ **Before:**
```
POST /rest/v1/documents 400 (Bad Request)
Could not find the 'body_text' column of 'documents' in the schema cache
Failed to save document
```

✅ **After:**
```
POST /rest/v1/documents 201 (Created)
Document saved successfully
```

---

## Quick Checklist

- [ ] Run `FIX_SCHEMA_MISMATCH.sql` in Supabase
- [ ] Verify `body_text` column exists
- [ ] Refresh deployed site and check console (F12)
- [ ] Re-run Lighthouse (keep window focused!)
- [ ] Save report as `lighthouse-report.html`
- [ ] Commit: `git add lighthouse-report.html && git commit -m "Add working Lighthouse audit" && git push`

**Time to fix:** ~2 minutes
