/**
 * Week 1 Service Testing Script
 * Tests: Email service, AI service, Error handling
 * Run: npx tsx test-week1-services.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('\n🧪 WEEK 1 SERVICE TESTING\n');
console.log('=' .repeat(60));

// Test 1: AI Service Health Check
async function testAIServiceHealth() {
  console.log('\n📡 TEST 1: AI Service Health Check');
  console.log('-'.repeat(60));
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-document', {
      body: { ping: true }
    });

    if (error) {
      console.error('❌ FAILED: AI Service health check failed');
      console.error('Error:', error);
      return false;
    }

    if (data?.status === 'ok') {
      console.log('✅ PASSED: AI Service is online');
      console.log('Response:', data);
      return true;
    } else {
      console.error('❌ FAILED: Unexpected response');
      console.error('Data:', data);
      return false;
    }
  } catch (err) {
    console.error('❌ FAILED: Exception thrown');
    console.error('Error:', err);
    return false;
  }
}

// Test 2: AI Document Generation (Invoice)
async function testAIInvoiceGeneration() {
  console.log('\n🤖 TEST 2: AI Invoice Generation');
  console.log('-'.repeat(60));
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-document', {
      body: {
        prompt: 'I replaced a toilet and retiled bathroom floor for John Smith',
        docType: 'INVOICE',
        clientName: 'John Smith',
        businessName: 'Test Plumbing Co',
        industry: 'Plumber'
      }
    });

    if (error) {
      console.error('❌ FAILED: AI generation failed');
      console.error('Error:', error);
      return false;
    }

    if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
      console.log('✅ PASSED: AI generated invoice items');
      console.log(`Generated ${data.items.length} items:`);
      data.items.forEach((item: any, i: number) => {
        console.log(`  ${i + 1}. ${item.description} - R${item.price} (${item.quantity} ${item.unitType})`);
      });
      return true;
    } else {
      console.error('❌ FAILED: No items generated');
      console.error('Data:', data);
      return false;
    }
  } catch (err) {
    console.error('❌ FAILED: Exception thrown');
    console.error('Error:', err);
    return false;
  }
}

// Test 3: AI Contract Generation
async function testAIContractGeneration() {
  console.log('\n📜 TEST 3: AI Contract Generation');
  console.log('-'.repeat(60));
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-document', {
      body: {
        prompt: 'Create a service agreement for bathroom renovation project',
        docType: 'CONTRACT',
        clientName: 'ABC Properties',
        businessName: 'Test Construction',
        industry: 'Construction'
      }
    });

    if (error) {
      console.error('❌ FAILED: Contract generation failed');
      console.error('Error:', error);
      return false;
    }

    if (data?.clauses && Array.isArray(data.clauses) && data.clauses.length > 0) {
      console.log('✅ PASSED: AI generated contract clauses');
      console.log(`Generated ${data.clauses.length} clauses:`);
      data.clauses.slice(0, 3).forEach((clause: any, i: number) => {
        console.log(`  ${i + 1}. ${clause.title}`);
      });
      if (data.clauses.length > 3) {
        console.log(`  ... and ${data.clauses.length - 3} more`);
      }
      return true;
    } else {
      console.error('❌ FAILED: No clauses generated');
      console.error('Data:', data);
      return false;
    }
  } catch (err) {
    console.error('❌ FAILED: Exception thrown');
    console.error('Error:', err);
    return false;
  }
}

// Test 4: Email Service Health Check
async function testEmailServiceHealth() {
  console.log('\n📧 TEST 4: Email Service Health Check');
  console.log('-'.repeat(60));
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { ping: true }
    });

    if (error) {
      console.error('❌ FAILED: Email service health check failed');
      console.error('Error:', error);
      return false;
    }

    if (data?.status === 'ok') {
      console.log('✅ PASSED: Email Service is online');
      console.log('Response:', data);
      return true;
    } else {
      console.error('❌ FAILED: Unexpected response');
      console.error('Data:', data);
      return false;
    }
  } catch (err) {
    console.error('❌ FAILED: Exception thrown');
    console.error('Error:', err);
    return false;
  }
}

// Test 5: Gmail API Email Send (if configured)
async function testGmailSend() {
  console.log('\n✉️  TEST 5: Gmail Email Send Test');
  console.log('-'.repeat(60));
  console.log('⚠️  SKIPPED: Requires Gmail OAuth setup');
  console.log('To enable: Configure Gmail API in Supabase Edge Function');
  console.log('For now, using SendGrid/Resend as fallback\n');
  return null; // Skip for now
}

// Test 6: Error Handling & Input Validation
async function testErrorHandling() {
  console.log('\n🛡️  TEST 6: Error Handling & Input Validation');
  console.log('-'.repeat(60));
  
  let passed = 0;
  let failed = 0;

  // Test 6.1: Missing required fields
  try {
    const { error } = await supabase.functions.invoke('generate-document', {
      body: {
        // Missing prompt, docType, etc.
        clientName: 'Test'
      }
    });

    if (error || error) {
      console.log('✅ PASSED: Correctly rejects missing fields');
      passed++;
    } else {
      console.error('❌ FAILED: Should reject missing fields');
      failed++;
    }
  } catch (err) {
    console.log('✅ PASSED: Correctly throws error for missing fields');
    passed++;
  }

  // Test 6.2: Invalid docType
  try {
    const { error } = await supabase.functions.invoke('generate-document', {
      body: {
        prompt: 'test',
        docType: 'INVALID',
        clientName: 'Test',
        businessName: 'Test'
      }
    });

    if (error) {
      console.log('✅ PASSED: Correctly rejects invalid docType');
      passed++;
    } else {
      console.error('❌ FAILED: Should reject invalid docType');
      failed++;
    }
  } catch (err) {
    console.log('✅ PASSED: Correctly throws error for invalid docType');
    passed++;
  }

  console.log(`\nError Handling: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

// Test 7: Response Time Performance
async function testResponseTime() {
  console.log('\n⏱️  TEST 7: AI Response Time Performance');
  console.log('-'.repeat(60));
  
  const start = Date.now();
  
  try {
    await supabase.functions.invoke('generate-document', {
      body: {
        prompt: 'Quick test invoice for plumbing work',
        docType: 'INVOICE',
        clientName: 'Test Client',
        businessName: 'Test Business',
        industry: 'Plumber'
      }
    });

    const duration = Date.now() - start;
    const seconds = (duration / 1000).toFixed(2);

    console.log(`Response time: ${seconds}s`);
    
    if (duration < 15000) {
      console.log('✅ PASSED: Response under 15 seconds (acceptable)');
      return true;
    } else if (duration < 30000) {
      console.log('⚠️  WARNING: Response 15-30 seconds (slow but acceptable)');
      return true;
    } else {
      console.error('❌ FAILED: Response over 30 seconds (too slow)');
      return false;
    }
  } catch (err) {
    console.error('❌ FAILED: Exception thrown');
    console.error('Error:', err);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    aiHealth: false,
    aiInvoice: false,
    aiContract: false,
    emailHealth: false,
    errorHandling: false,
    responseTime: false
  };

  results.aiHealth = await testAIServiceHealth();
  
  if (results.aiHealth) {
    results.aiInvoice = await testAIInvoiceGeneration();
    results.aiContract = await testAIContractGeneration();
    results.responseTime = await testResponseTime();
  } else {
    console.log('\n⚠️  SKIPPING AI tests - service not healthy');
  }

  results.emailHealth = await testEmailServiceHealth();
  results.errorHandling = await testErrorHandling();
  
  await testGmailSend(); // Just informational

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  const tests = [
    { name: 'AI Service Health', result: results.aiHealth },
    { name: 'AI Invoice Generation', result: results.aiInvoice },
    { name: 'AI Contract Generation', result: results.aiContract },
    { name: 'Email Service Health', result: results.emailHealth },
    { name: 'Error Handling', result: results.errorHandling },
    { name: 'Response Time', result: results.responseTime },
  ];

  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${test.name}`);
  });

  const totalPassed = tests.filter(t => t.result).length;
  const totalTests = tests.length;
  const passRate = ((totalPassed / totalTests) * 100).toFixed(0);

  console.log('\n' + '='.repeat(60));
  console.log(`RESULT: ${totalPassed}/${totalTests} tests passed (${passRate}%)`);
  console.log('='.repeat(60));

  if (totalPassed === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! Week 1 services are working correctly.\n');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED - Review errors above.\n');
    console.log('Common Issues:');
    console.log('1. GENAI_API_KEY not set in Supabase → Project Settings → Edge Functions → Secrets');
    console.log('2. Edge Functions not deployed → Run: supabase functions deploy');
    console.log('3. Billing not enabled in Google Cloud → Enable Vertex AI API');
    console.log('4. SendGrid/Resend API key missing → Add SENDGRID_API_KEY or RESEND_API_KEY\n');
  }

  process.exit(totalPassed === totalTests ? 0 : 1);
}

// Run tests
runAllTests().catch(err => {
  console.error('\n💥 FATAL ERROR:', err);
  process.exit(1);
});
