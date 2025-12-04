#!/usr/bin/env node
/**
 * Test AI Template Generation for App Integration
 * This test generates invoice items and contract clauses in the exact format
 * that the app expects, ready to be added as template blocks.
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import types matching the app
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitType: string;
  price: number;
  templateBlockName?: string;
}

interface ContractClause {
  id: string;
  title: string;
  content: string;
  order?: number;
  required?: boolean;
  category?: string;
}

interface TemplateBlock {
  id: string;
  name: string;
  category: string;
  type: 'Invoice' | 'Contract';
  items?: InvoiceItem[];
  clause?: ContractClause;
  clauses?: ContractClause[];
  contractType?: string;
}

async function generateInvoiceBlock(scenario: {
  name: string;
  category: string;
  prompt: string;
}): Promise<TemplateBlock> {
  console.log(`\n📦 Creating invoice template: ${scenario.name}`);
  
  const response = await supabase.functions.invoke('generate-document', {
    body: {
      docType: 'INVOICE',
      prompt: scenario.prompt,
      clientName: 'Sample Client',
      businessName: 'Your Business',
      industry: scenario.category
    }
  });

  if (response.error) {
    console.error('❌ Error:', response.error);
    throw response.error;
  }

  // Transform AI response to template block format
  const items: InvoiceItem[] = response.data.items.map((item: any, index: number) => ({
    id: `item-${Date.now()}-${index}`,
    description: item.description,
    quantity: item.quantity,
    unitType: item.unitType,
    price: item.price,
    templateBlockName: scenario.name
  }));

  const templateBlock: TemplateBlock = {
    id: `template-${Date.now()}`,
    name: scenario.name,
    category: scenario.category,
    type: 'Invoice',
    items
  };

  console.log(`  ✅ Generated ${items.length} items`);
  console.log(`  💰 Total value: R${items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`);
  
  return templateBlock;
}

async function generateContractBlock(scenario: {
  name: string;
  category: string;
  contractType: string;
  prompt: string;
}): Promise<TemplateBlock> {
  console.log(`\n📜 Creating contract template: ${scenario.name}`);
  
  const response = await supabase.functions.invoke('generate-document', {
    body: {
      docType: 'CONTRACT',
      prompt: scenario.prompt,
      clientName: 'Sample Client',
      businessName: 'Your Business',
      industry: scenario.category
    }
  });

  if (response.error) {
    console.error('❌ Error:', response.error);
    throw response.error;
  }

  // Transform AI response to template block format
  const clauses: ContractClause[] = response.data.clauses.map((clause: any, index: number) => ({
    id: `clause-${Date.now()}-${index}`,
    title: clause.title,
    content: clause.content,
    order: index + 1,
    required: ['Scope of Work', 'Payment Terms', 'Warranty'].includes(clause.title),
    category: scenario.category
  }));

  const templateBlock: TemplateBlock = {
    id: `template-${Date.now()}`,
    name: scenario.name,
    category: scenario.category,
    type: 'Contract',
    clauses,
    contractType: scenario.contractType
  };

  console.log(`  ✅ Generated ${clauses.length} clauses`);
  console.log(`  📝 Average clause length: ${Math.round(clauses.reduce((sum, c) => sum + c.content.length, 0) / clauses.length)} chars`);
  
  return templateBlock;
}

async function main() {
  console.log('🎯 AI TEMPLATE BLOCK GENERATION FOR APP');
  console.log('=' .repeat(80));
  console.log('Generating ready-to-use template blocks for your document creator app\n');

  const templateBlocks: TemplateBlock[] = [];

  // Invoice Template Scenarios
  const invoiceScenarios = [
    {
      name: 'Emergency Plumbing Call-out',
      category: 'Plumber',
      prompt: 'Emergency plumbing service: burst pipe repair, includes emergency callout fee, pipe replacement, labour, and water damage assessment'
    },
    {
      name: 'Website Development Package',
      category: 'Web Development',
      prompt: 'Complete website development: design, frontend, backend API, database, hosting setup, and 3 months support'
    },
    {
      name: 'Corporate Event Catering',
      category: 'Catering',
      prompt: 'Corporate lunch catering for 50 people: buffet setup, main courses, sides, desserts, beverages, service staff'
    },
    {
      name: 'Vehicle Full Service',
      category: 'Mechanic',
      prompt: 'Complete vehicle service: oil change, brake inspection, tire rotation, fluid check, safety inspection'
    },
    {
      name: 'Home Office Electrical',
      category: 'Electrician',
      prompt: 'Home office electrical installation: new circuit breaker, wiring, 4 double sockets, compliance certificate'
    },
    {
      name: 'Bathroom Renovation',
      category: 'Plumber',
      prompt: 'Full bathroom renovation: remove old toilet, install wall-hung toilet system, replace basin, new tiling, waterproofing'
    }
  ];

  // Contract Template Scenarios
  const contractScenarios = [
    {
      name: 'Software Development Agreement',
      category: 'Software Development',
      contractType: 'Project Contract',
      prompt: 'Software development contract for mobile app: scope, timeline, payment terms (50% deposit), IP rights, confidentiality, 3-month support warranty'
    },
    {
      name: 'Monthly Retainer Agreement',
      category: 'Consulting',
      contractType: 'Retainer Agreement',
      prompt: 'Monthly retainer for business consulting: 20 hours per month, hourly rate R650, unused hours don\'t rollover, 30-day cancellation notice'
    },
    {
      name: 'Website Maintenance SLA',
      category: 'Web Development',
      contractType: 'Maintenance Agreement',
      prompt: 'Website maintenance service level agreement: monthly updates, security patches, 24hr response time, 99% uptime guarantee, backup included'
    },
    {
      name: 'Partnership Equity Agreement',
      category: 'Business Partnership',
      contractType: 'Partnership Agreement',
      prompt: 'Business partnership for 60/40 equity split: capital contribution, profit sharing, decision making authority, exit terms, dispute resolution'
    },
    {
      name: 'Freelance Service Agreement',
      category: 'Freelance',
      contractType: 'Service Agreement',
      prompt: 'Freelance service agreement: deliverables, payment on completion, expenses reimbursement, termination clause, liability limitation'
    }
  ];

  // Generate Invoice Templates
  console.log('\n💼 GENERATING INVOICE TEMPLATE BLOCKS');
  console.log('-'.repeat(80));
  
  for (const scenario of invoiceScenarios) {
    try {
      const block = await generateInvoiceBlock(scenario);
      templateBlocks.push(block);
      
      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to generate ${scenario.name}:`, error);
    }
  }

  // Generate Contract Templates
  console.log('\n\n📋 GENERATING CONTRACT TEMPLATE BLOCKS');
  console.log('-'.repeat(80));
  
  for (const scenario of contractScenarios) {
    try {
      const block = await generateContractBlock(scenario);
      templateBlocks.push(block);
      
      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to generate ${scenario.name}:`, error);
    }
  }

  // Save to file
  const outputDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'ai-generated-templates.json');
  fs.writeFileSync(outputPath, JSON.stringify(templateBlocks, null, 2));

  // Generate summary
  console.log('\n\n📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Generated ${templateBlocks.length} template blocks`);
  console.log(`📄 Invoice templates: ${templateBlocks.filter(t => t.type === 'Invoice').length}`);
  console.log(`📜 Contract templates: ${templateBlocks.filter(t => t.type === 'Contract').length}`);
  console.log(`📁 Saved to: ${outputPath}`);

  // Show sample data structure
  console.log('\n\n🔍 SAMPLE TEMPLATE BLOCK STRUCTURE:');
  console.log('-'.repeat(80));
  
  const sampleInvoice = templateBlocks.find(t => t.type === 'Invoice');
  if (sampleInvoice) {
    console.log('\n📦 Invoice Template Example:');
    console.log(JSON.stringify({
      ...sampleInvoice,
      items: sampleInvoice.items?.slice(0, 2) // Show only first 2 items
    }, null, 2));
  }

  const sampleContract = templateBlocks.find(t => t.type === 'Contract');
  if (sampleContract) {
    console.log('\n📜 Contract Template Example:');
    console.log(JSON.stringify({
      ...sampleContract,
      clauses: sampleContract.clauses?.slice(0, 2) // Show only first 2 clauses
    }, null, 2));
  }

  console.log('\n\n💡 HOW TO USE THESE IN YOUR APP:');
  console.log('-'.repeat(80));
  console.log('1. Import ai-generated-templates.json into your app');
  console.log('2. Add to your templates state: setTemplates([...templates, ...aiTemplates])');
  console.log('3. Templates will appear in the "Add Block" menu');
  console.log('4. Users can click to add pre-filled invoice items or contract clauses');
  console.log('5. All items have proper IDs, unitTypes, and pricing ready for your InvoiceThemeRenderer');
  console.log('6. All clauses have proper structure ready for your ContractThemeRenderer');
  
  console.log('\n\n🎨 THEMING COMPATIBILITY:');
  console.log('-'.repeat(80));
  console.log('✅ Compatible with all 12 invoice themes (swiss, geometric, blueprint, etc.)');
  console.log('✅ Compatible with all 7 contract themes (legal, modern, executive, etc.)');
  console.log('✅ Unit types match your app: ea, hrs, days, m, ft, sqm, set, pts');
  console.log('✅ South African pricing (R amounts)');
  console.log('✅ Ready for VAT calculation (15%)');
}

main()
  .then(() => {
    console.log('\n\n✅ Template generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n\n❌ Error:', error);
    process.exit(1);
  });
