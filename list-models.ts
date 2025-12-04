import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('📋 Listing available Gemini models for your API key...\n');

// Call a custom Edge Function endpoint that lists models
const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-document`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    listModels: true
  })
});

const data = await response.json();
console.log('Response:', JSON.stringify(data, null, 2));
