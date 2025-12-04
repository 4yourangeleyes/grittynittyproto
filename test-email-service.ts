#!/usr/bin/env node
/**
 * Test Email Service
 * Quick test to verify SendGrid is configured correctly
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEmailService() {
  console.log('\n📧 TESTING EMAIL SERVICE\n');
  console.log('='.repeat(60));

  const testEmail = process.argv[2] || 'test@example.com';
  
  console.log(`\n📨 Sending test email to: ${testEmail}`);
  console.log('⏳ Please wait...\n');

  try {
    const response = await supabase.functions.invoke('send-email', {
      body: {
        to: testEmail,
        subject: 'Test Email from GritDocs',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #667eea;">✅ Email Service Working!</h1>
            <p>If you're reading this, your SendGrid integration is configured correctly.</p>
            <p><strong>Test Details:</strong></p>
            <ul>
              <li>Sent: ${new Date().toLocaleString()}</li>
              <li>Service: SendGrid via Supabase Edge Function</li>
              <li>Status: Operational ✅</li>
            </ul>
            <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
              This is an automated test email from your GritDocs application.
            </p>
          </div>
        `,
        text: 'Email service test successful! Your SendGrid integration is working correctly.'
      }
    });

    if (response.error) {
      console.error('❌ ERROR:', response.error);
      console.error('\n📋 Troubleshooting Steps:');
      console.error('1. Check if SENDGRID_API_KEY is set in Supabase secrets');
      console.error('2. Verify the API key is valid (starts with SG.)');
      console.error('3. Check Supabase Edge Function logs for details');
      console.error('4. See SENDGRID_SETUP.md for full setup guide\n');
      process.exit(1);
    }

    console.log('✅ SUCCESS!');
    console.log('='.repeat(60));
    console.log('\n📬 Email sent successfully!');
    console.log(`📧 Check inbox: ${testEmail}`);
    console.log('\n💡 Tips:');
    console.log('  - Check spam folder if not in inbox');
    console.log('  - Verify email formatting looks professional');
    console.log('  - Try sending an invoice with PDF next\n');

  } catch (error) {
    console.error('\n💥 EXCEPTION:', error);
    console.error('\nMake sure:');
    console.error('  1. Supabase Edge Function is deployed');
    console.error('  2. SENDGRID_API_KEY is configured');
    console.error('  3. Internet connection is working\n');
    process.exit(1);
  }
}

console.log('\n🚀 Email Service Test');
console.log('Usage: npx tsx test-email-service.ts [email@example.com]\n');

testEmailService()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
