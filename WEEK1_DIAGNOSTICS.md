# Week 1 Service Diagnostics

## Test Results Summary (Just Now)

**Date:** December 3, 2025  
**Tests Run:** 6  
**Tests Passed:** 3/6 (50%)

### ✅ Passing Tests

1. **AI Service Health Check** - Edge Function is deployed and responding
2. **Error Handling** - Correctly rejects invalid inputs
3. **Response Time** - 0.61s (under 15s threshold)

### ❌ Failing Tests

1. **AI Invoice Generation** - 500 Internal Server Error
2. **AI Contract Generation** - 500 Internal Server Error  
3. **Email Service Health** - 404 Not Found (not deployed)

---

## Root Cause Analysis

### Issue #1: AI Generation Returning 500 Errors

**Error:**
```
FunctionsHttpError: Edge Function returned a non-2xx status code
Status: 500 Internal Server Error
```

**Most Likely Causes:**

1. **GENAI_API_KEY Not Set in Supabase Secrets**
   - Edge Function looks for: `Deno.env.get('GENAI_API_KEY')`
   - You said you added "genai api key" - need to verify EXACT name matches
   - Location: Supabase Dashboard → Project Settings → Edge Functions → Secrets

2. **Google Gemini API Restrictions**
   - Vertex AI API enabled but may have billing/quota issues
   - Service Account permissions not configured
   - API endpoint region mismatch

3. **Edge Function Not Redeployed After Secret Added**
   - Secrets require Edge Function redeployment to take effect
   - Fix: `supabase functions deploy generate-document`

### Issue #2: Email Service Not Found (404)

**Error:**
```
Status: 404 Not Found
URL: /functions/v1/send-email
```

**Cause:** Email Edge Function not deployed to Supabase

**Fix:** Deploy the function:
```bash
supabase functions deploy send-email --no-verify-jwt
```

---

## Recommended Fix Sequence

### Step 1: Verify Supabase Secret Configuration

Go to: https://supabase.com/dashboard/project/fopyamyrykwtlwgefxuq/settings/functions

Check that you have a secret named **EXACTLY** this:
```
GENAI_API_KEY
```

Value should be your Google Gemini API key (starts with `AIza...`)

### Step 2: Deploy Edge Functions

```bash
# From project root
cd /Users/sachinphilander/Desktop/prnME/grittynittyproto

# Deploy AI generation function
supabase functions deploy generate-document --no-verify-jwt

# Deploy email function  
supabase functions deploy send-email --no-verify-jwt
```

### Step 3: Re-run Tests

```bash
npx tsx test-week1-services.ts
```

---

## Alternative: Use Gemini API Directly (Skip Edge Function)

If Edge Functions continue failing, you can use Gemini API directly from the client:

**Pros:**
- Simpler setup
- No Edge Function deployment needed
- Faster iteration

**Cons:**
- API key exposed in browser (need to restrict by domain)
- No rate limiting on server
- Less secure

**Implementation:**

1. Add Gemini API key to `.env.local`:
```env
VITE_GEMINI_API_KEY=your_key_here
```

2. Restrict API key in Google Cloud Console:
   - Application restrictions → HTTP referrers
   - Add: `https://gritdocs.netlify.app/*`
   - Add: `http://localhost:3001/*`

3. Update `services/geminiService.ts`:
```typescript
// Use client-side Gemini instead of Edge Function
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
```

---

## Email Service Configuration

### Current State
- Edge Function expects: `SENDGRID_API_KEY` OR `RESEND_API_KEY`
- You enabled: Gmail API in Google Cloud

### Options

**Option A: Use Resend (Recommended - Easiest)**
1. Sign up: https://resend.com (free tier: 3,000 emails/month)
2. Get API key
3. Add to Supabase secrets: `RESEND_API_KEY`
4. Deploy: `supabase functions deploy send-email`

**Option B: Use SendGrid**
1. Sign up: https://sendgrid.com (free tier: 100 emails/day)
2. Get API key
3. Add to Supabase secrets: `SENDGRID_API_KEY`
4. Deploy: `supabase functions deploy send-email`

**Option C: Use Gmail API (Most Complex)**
- Requires OAuth2 setup
- Need to handle token refresh
- More code changes needed
- **NOT RECOMMENDED for now**

---

## Next Actions (In Order)

1. **[5 min]** Verify `GENAI_API_KEY` secret in Supabase Dashboard
2. **[2 min]** Deploy both Edge Functions
3. **[1 min]** Re-run test script
4. **[10 min]** If still failing, get Resend API key and add to secrets
5. **[2 min]** Deploy send-email function
6. **[1 min]** Final test run

**Expected Outcome:** 6/6 tests passing

---

## Support Commands

### Check Supabase CLI Version
```bash
npx supabase --version
```

### Link Local Project to Remote
```bash
npx supabase link --project-ref fopyamyrykwtlwgefxuq
```

### List Deployed Functions
```bash
npx supabase functions list
```

### View Function Logs (After Deploy)
```bash
npx supabase functions logs generate-document
```

---

## Status After Fixes

- [ ] GENAI_API_KEY verified in Supabase
- [ ] generate-document deployed successfully
- [ ] send-email deployed successfully  
- [ ] AI Invoice Generation test passing
- [ ] AI Contract Generation test passing
- [ ] Email Service Health test passing
- [ ] All 6/6 tests passing

**Once all checked:** Week 1 Day 1-2 tasks COMPLETE ✅
