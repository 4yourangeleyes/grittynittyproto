# SendGrid Email Service Setup Guide

## 🎯 Goal
Enable invoice and contract email sending with PDF attachments.

## 📋 Step-by-Step Instructions

### 1. Create SendGrid Account (5 minutes)

1. Go to https://sendgrid.com/free/
2. Click "Start for free"
3. Fill in your details:
   - Email: Use your business email
   - Company: Your company name
   - Website: netlify.app URL or your domain
4. Verify your email address
5. Complete the getting started wizard

### 2. Generate API Key (2 minutes)

1. Log in to SendGrid Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Settings:
   - Name: `GritDocs Production`
   - Permissions: **Full Access** (or minimum: Mail Send)
5. Click **Create & View**
6. **COPY THE KEY IMMEDIATELY** (you won't see it again!)
   - Format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. Configure in Supabase (2 minutes)

**Option A: Via Supabase Dashboard**
1. Go to https://supabase.com/dashboard/project/fopyamyrykwtlwgefxuq
2. Click **Edge Functions** in left sidebar
3. Click **Manage secrets**
4. Click **Add new secret**
5. Name: `SENDGRID_API_KEY`
6. Value: Paste your API key
7. Click **Save**

**Option B: Via CLI**
```bash
cd /Users/sachinphilander/Desktop/prnME/grittynittyproto
npx supabase secrets set SENDGRID_API_KEY="YOUR_API_KEY_HERE" --project-ref fopyamyrykwtlwgefxuq
```

### 4. Verify Configuration (1 minute)

Run the test script:
```bash
npx tsx test-email-service.ts
```

Expected output:
```
✅ Email sent successfully!
Check your inbox for test invoice
```

### 5. Test in App (2 minutes)

1. Start dev server: `npm run dev`
2. Create a test invoice
3. Click "Send Email" button
4. Enter recipient email
5. Check inbox - you should receive:
   - Professional email with invoice details
   - PDF attachment
   - Proper formatting

## 🔧 Troubleshooting

### "Invalid API key" error
- Double-check you copied the entire key (starts with `SG.`)
- Verify no extra spaces before/after
- Make sure you created a new key (old ones expire)

### Email not arriving
- Check spam/junk folder
- Verify email address is correct
- Check SendGrid dashboard → Activity for delivery status

### "Rate limit exceeded"
- Free tier: 100 emails/day
- Wait 24 hours or upgrade plan
- Check SendGrid dashboard → Usage

## 📊 SendGrid Free Tier Limits

- **100 emails per day** (3,000/month)
- Perfect for testing and early users
- Upgrade when you hit consistent usage

## 🎯 Next Steps After Setup

1. Test sending invoices to multiple email addresses
2. Test contract sending
3. Verify PDF attachments work correctly
4. Add custom "from" name in email settings
5. Consider adding email templates for branding

## 📧 Email Template Customization (Optional)

The current email template is in:
`supabase/functions/send-email/index.ts`

You can customize:
- Email subject line
- Email body text
- Sender name
- Reply-to address

## ✅ Success Checklist

- [ ] SendGrid account created
- [ ] API key generated
- [ ] API key added to Supabase secrets
- [ ] Test email sent successfully
- [ ] Invoice email received with PDF
- [ ] Contract email tested
- [ ] Email appears professional (not in spam)
- [ ] PDF attachments open correctly

---

**Estimated Total Time:** 15-20 minutes
**Cost:** FREE (100 emails/day)
