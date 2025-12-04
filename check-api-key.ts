import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Checking API key configuration...\n');

supabase.functions.invoke('generate-document', {
  body: { debug: true }
}).then(({ data, error }) => {
  if (error) {
    console.error('ERROR:', error);
    return;
  }
  
  console.log('✅ Debug Response:');
  console.log(JSON.stringify(data, null, 2));
  
  if (!data.has_GENAI_API_KEY && !data.has_geni_ai_api) {
    console.log('\n❌ NO API KEY FOUND!');
    console.log('\nYou need to add ONE of these secrets in Supabase:');
    console.log('1. Go to: https://supabase.com/dashboard/project/fopyamyrykwtlwgefxuq/settings/functions');
    console.log('2. Click "Add new secret"');
    console.log('3. Name: GENAI_API_KEY');
    console.log('4. Value: Your Google Gemini API key (starts with AIza...)');
  } else {
    console.log('\n✅ API key is configured!');
    if (data.has_geni_ai_api) {
      console.log('Using key: geni_ai_api');
    }
    if (data.has_GENAI_API_KEY) {
      console.log('Using key: GENAI_API_KEY');
    }
  }
});
