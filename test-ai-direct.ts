/**
 * Direct AI Service Test - Get actual error messages
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('\n🔍 DIRECT AI SERVICE TEST\n');
console.log('=' .repeat(60));

async function testAI() {
  console.log('\n📡 Calling AI service...\n');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        prompt: 'I replaced a toilet for John Smith. It cost R1500 for the toilet and R800 for labor.',
        docType: 'INVOICE',
        clientName: 'John Smith',
        businessName: 'Test Plumbing',
        industry: 'Plumber'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('\nResponse body:');
    console.log(text);

    if (!response.ok) {
      console.error('\n❌ ERROR: HTTP', response.status);
      try {
        const json = JSON.parse(text);
        console.error('Error details:', JSON.stringify(json, null, 2));
      } catch {
        console.error('Raw error:', text);
      }
      return;
    }

    console.log('\n✅ SUCCESS!\n');
    const data = JSON.parse(text);
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (err: any) {
    console.error('💥 EXCEPTION:', err);
    console.error('\nException details:');
    console.error('- Message:', err.message);
    console.error('- Stack:', err.stack);
  }
}

testAI();
