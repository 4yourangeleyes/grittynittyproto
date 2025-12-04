#!/usr/bin/env node
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables. Please check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface InvoiceItem {
  description: string;
  quantity: number;
  unitType: string;
  price: number;
}

interface ContractClause {
  title: string;
  content: string;
}

async function generateInvoiceItems(scenario: string): Promise<InvoiceItem[]> {
  console.log(`\n📄 Generating invoice items for: ${scenario}`);
  
  const response = await supabase.functions.invoke('generate-document', {
    body: {
      docType: 'INVOICE',
      prompt: scenario,
      clientName: 'Test Client',
      businessName: 'Professional Services',
      industry: 'general'
    }
  });

  if (response.error) {
    console.error('❌ Error:', response.error);
    // Try to get more details from the response
    try {
      const text = await response.error.context?.text();
      console.error('❌ Error details:', text);
    } catch (e) {
      // Ignore if we can't read the error
    }
    throw response.error;
  }

  console.log('✅ Generated items:', response.data.items.length);
  return response.data.items;
}

async function generateContractClauses(scenario: string): Promise<ContractClause[]> {
  console.log(`\n📜 Generating contract clauses for: ${scenario}`);
  
  const response = await supabase.functions.invoke('generate-document', {
    body: {
      docType: 'CONTRACT',
      prompt: scenario,
      clientName: 'Test Client',
      businessName: 'Professional Services',
      industry: 'general'
    }
  });

  if (response.error) {
    console.error('❌ Error:', response.error);
    throw response.error;
  }

  console.log('✅ Generated clauses:', response.data.clauses.length);
  return response.data.clauses;
}

async function testAITemplates() {
  console.log('🤖 COMPREHENSIVE AI TEMPLATE GENERATION TEST');
  console.log('============================================================\n');

  const results: any = {
    invoices: {},
    contracts: {},
    timestamp: new Date().toISOString()
  };

  // Test Invoice Scenarios
  const invoiceScenarios = [
    {
      name: 'Plumbing Emergency Repair',
      prompt: 'Emergency plumbing repair for burst pipe in kitchen. Client: Sarah Johnson. Includes emergency callout, pipe replacement, and water damage assessment.'
    },
    {
      name: 'Website Development Project',
      prompt: 'Full website development for small business. Client: Tech Startup Ltd. Includes design, frontend development, backend API, database setup, and 3 months support.'
    },
    {
      name: 'Catering Corporate Event',
      prompt: 'Corporate lunch catering for 50 people. Client: ABC Corporation. Includes buffet setup, main courses, sides, desserts, beverages, and service staff.'
    },
    {
      name: 'Vehicle Mechanical Service',
      prompt: 'Full vehicle service for Toyota Corolla 2018. Client: John Smith. Includes oil change, brake inspection, tire rotation, fluid top-up, and safety check.'
    },
    {
      name: 'Electrical Installation',
      prompt: 'New electrical circuit installation for home office. Client: Remote Worker. Includes new circuit breaker, wiring, 4 double sockets, and compliance certificate.'
    }
  ];

  console.log('🔧 TESTING INVOICE GENERATION');
  console.log('------------------------------------------------------------');
  
  for (const scenario of invoiceScenarios) {
    try {
      const items = await generateInvoiceItems(scenario.prompt);
      results.invoices[scenario.name] = {
        prompt: scenario.prompt,
        items,
        totalItems: items.length,
        totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      
      console.log(`  Items: ${items.length}`);
      console.log(`  Total: R${results.invoices[scenario.name].totalAmount.toFixed(2)}`);
      
      // Wait 1 second between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to generate invoice for ${scenario.name}:`, error);
      results.invoices[scenario.name] = { error: String(error) };
    }
  }

  // Test Contract Scenarios
  const contractScenarios = [
    {
      name: 'Software Development Agreement',
      prompt: 'Software development contract for mobile app project. Client: Startup Inc. Include scope, timeline, payment terms, intellectual property rights, confidentiality, and support terms.'
    },
    {
      name: 'Freelance Consulting Agreement',
      prompt: 'Consulting services agreement for business strategy consulting. Client: Growing Business Ltd. Include deliverables, hourly rate, expenses, termination clause, and liability.'
    },
    {
      name: 'Service Level Agreement',
      prompt: 'IT support service level agreement. Client: Corporate Client. Include response times, availability, escalation procedures, performance metrics, and penalties.'
    },
    {
      name: 'Partnership Agreement',
      prompt: 'Business partnership agreement for 60/40 equity split. Partners: Founder A and Investor B. Include capital contribution, profit sharing, decision making, and exit terms.'
    },
    {
      name: 'Maintenance Contract',
      prompt: 'Annual maintenance contract for HVAC systems. Client: Office Building. Include monthly inspections, emergency repairs, replacement parts, and warranty terms.'
    }
  ];

  console.log('\n\n📋 TESTING CONTRACT GENERATION');
  console.log('------------------------------------------------------------');
  
  for (const scenario of contractScenarios) {
    try {
      const clauses = await generateContractClauses(scenario.prompt);
      results.contracts[scenario.name] = {
        prompt: scenario.prompt,
        clauses,
        totalClauses: clauses.length,
        averageClauseLength: Math.round(
          clauses.reduce((sum, c) => sum + c.content.length, 0) / clauses.length
        )
      };
      
      console.log(`  Clauses: ${clauses.length}`);
      console.log(`  Avg length: ${results.contracts[scenario.name].averageClauseLength} chars`);
      
      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to generate contract for ${scenario.name}:`, error);
      results.contracts[scenario.name] = { error: String(error) };
    }
  }

  // Save results
  const outputDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'ai-templates-test.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log('\n\n📊 TEST SUMMARY');
  console.log('============================================================');
  console.log(`✅ Invoice scenarios tested: ${invoiceScenarios.length}`);
  console.log(`✅ Contract scenarios tested: ${contractScenarios.length}`);
  console.log(`📁 Results saved to: ${outputPath}`);
  
  // Print detailed summary
  console.log('\n\n📈 DETAILED RESULTS');
  console.log('============================================================');
  
  console.log('\n🔧 INVOICES:');
  for (const [name, data] of Object.entries(results.invoices) as [string, any][]) {
    if (data.error) {
      console.log(`  ❌ ${name}: ERROR`);
    } else {
      console.log(`  ✅ ${name}:`);
      console.log(`     Items: ${data.totalItems}, Total: R${data.totalAmount.toFixed(2)}`);
      console.log(`     Sample: ${data.items[0]?.description || 'N/A'}`);
    }
  }
  
  console.log('\n📋 CONTRACTS:');
  for (const [name, data] of Object.entries(results.contracts) as [string, any][]) {
    if (data.error) {
      console.log(`  ❌ ${name}: ERROR`);
    } else {
      console.log(`  ✅ ${name}:`);
      console.log(`     Clauses: ${data.totalClauses}, Avg: ${data.averageClauseLength} chars`);
      console.log(`     Sample: ${data.clauses[0]?.title || 'N/A'}`);
    }
  }

  return results;
}

// Run the test
testAITemplates()
  .then(() => {
    console.log('\n✅ All tests completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
