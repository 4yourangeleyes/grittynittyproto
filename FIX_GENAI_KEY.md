# 🔴 CRITICAL: AI Service Not Working

## Current Status
- ✅ Edge Function deployed
- ✅ Health check passing
- ❌ **GENAI_API_KEY environment variable NOT SET in Supabase**

---

## The Problem

The Edge Function is throwing a 500 error because it can't find `GENAI_API_KEY`.

You mentioned you added a "genai api key" - but the **exact name matters**.

---

## IMMEDIATE FIX (5 minutes)

### Step 1: Open Supabase Dashboard

Go to: **https://supabase.com/dashboard/project/fopyamyrykwtlwgefxuq/settings/functions**

OR

1. Go to https://supabase.com/dashboard
2. Click your `GritDocs` project
3. Click ⚙️ **Settings** (bottom left)
4. Click **Edge Functions** (in sidebar)
5. Click **Add new secret** button

### Step 2: Add Secret

**Secret Name (MUST BE EXACT):**
```
GENAI_API_KEY
```

**Secret Value:**
Your Google Gemini API key (starts with `AIza...`)

Example:
```
AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

### Step 3: Verify It's Set

You should see in the list of secrets:
```
GENAI_API_KEY • • • • • • • • • • • 567 (last 3 digits visible)
```

### Step 4: Re-run Test

```bash
cd /Users/sachinphilander/Desktop/prnME/grittynittyproto
npx tsx test-week1-services.ts
```

**Expected:** All 6 tests pass ✅

---

## Where to Get Your Gemini API Key

If you don't have it yet:

1. **Go to:** https://aistudio.google.com/app/apikey
2. **Click:** "Create API key"
3. **Select:** Your Google Cloud project (the one with Vertex AI enabled)
4. **Copy** the key (starts with `AIza...`)
5. **Paste** into Supabase secret above

---

## Troubleshooting

### "I already added it but it's not working"

**Check the exact name:**
- ❌ `genai_api_key` (lowercase - won't work)
- ❌ `GEMINI_API_KEY` (wrong name - won't work)
- ❌ `GENAI_KEY` (wrong name - won't work)
- ✅ `GENAI_API_KEY` (EXACT match - will work)

**Solution:** Delete any old secrets and add new one with EXACT name above

### "I don't see an 'Edge Functions' section in Settings"

Try this direct link:
https://supabase.com/dashboard/project/fopyamyrykwtlwgefxuq/settings/functions

### "I get 'Billing not enabled' error"

This means your Google Cloud project doesn't have billing enabled.

**Fix:**
1. Go to: https://console.cloud.google.com/billing
2. Select your project
3. Link a billing account (credit card required, but you won't be charged much)
4. Enable Vertex AI API: https://console.cloud.google.com/apis/library/aiplatform.googleapis.com

---

## Alternative Quick Fix: Use Gemini Directly (No Edge Function)

If you can't get the Edge Function working, we can bypass it and use Gemini directly from the browser.

**Trade-off:**
- ✅ Easier setup (2 minutes)
- ✅ Works immediately
- ❌ API key visible in browser (restricted by domain)
- ❌ No server-side rate limiting

**How:**

1. **Add to `.env.local`:**
```env
VITE_GEMINI_API_KEY=AIzaSy...your_key_here
```

2. **Restrict API key in Google Cloud:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click your API key
   - Under "Application restrictions" → Select "HTTP referrers"
   - Add: `https://gritdocs.netlify.app/*`
   - Add: `http://localhost:3001/*`
   - Click Save

3. **Tell me and I'll update the code** to use client-side Gemini instead

**This is simpler but less secure. Your call.**

---

## Next Steps After Fix

Once `GENAI_API_KEY` is set correctly:

1. ✅ Re-run tests (should get 6/6 passing)
2. ✅ Test in browser: http://localhost:3001
3. ✅ Go to ChatScreen
4. ✅ Create test invoice
5. ✅ Verify AI generates items correctly
6. ✅ Move to Week 1 Day 3-4: Security Hardening

---

## Support

If still stuck after adding the secret:

**Screenshot needed:**
- Supabase Dashboard → Settings → Edge Functions → Secrets list

**Share:**
- Last 3 digits of your API key (so I can confirm it's set)
- Any error messages from test script

I'll help you debug from there.
