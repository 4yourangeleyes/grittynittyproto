#!/usr/bin/env node
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateDocument(type: 'INVOICE' | 'CONTRACT', scenario: {
  name: string;
  prompt: string;
  client: string;
  business: string;
  industry: string;
}) {
  console.log(`\n📝 Generating ${type} for: ${scenario.name}`);
  
  const response = await supabase.functions.invoke('generate-document', {
    body: {
      docType: type,
      prompt: scenario.prompt,
      clientName: scenario.client,
      businessName: scenario.business,
      industry: scenario.industry
    }
  });

  if (response.error) {
    console.error(`❌ Error generating ${type}:`, response.error);
    throw response.error;
  }

  return response.data;
}

async function createHTMLDocument(
  title: string,
  type: 'invoice' | 'contract',
  data: any,
  metadata: {
    client: string;
    business: string;
    industry: string;
    scenario: string;
  }
): Promise<string> {
  const currentDate = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (type === 'invoice') {
    const subtotal = data.items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page { margin: 2cm; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e40af;
      margin: 0 0 10px 0;
      font-size: 32px;
    }
    .header .subtitle {
      color: #64748b;
      font-size: 14px;
      font-weight: normal;
    }
    .meta-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
    }
    .meta-section h3 {
      color: #1e40af;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0 0 10px 0;
    }
    .meta-section p {
      margin: 5px 0;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    thead {
      background: #1e40af;
      color: white;
    }
    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }
    tbody tr:hover {
      background: #f8fafc;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-top: 30px;
      text-align: right;
    }
    .totals-table {
      margin-left: auto;
      width: 300px;
      border-top: 2px solid #cbd5e1;
    }
    .totals-table td {
      padding: 8px 12px;
      border: none;
    }
    .total-row {
      font-weight: bold;
      font-size: 18px;
      background: #1e40af;
      color: white;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    .badge {
      display: inline-block;
      background: #22c55e;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>INVOICE</h1>
    <div class="subtitle">${data.title || title}</div>
    <div class="badge">✨ AI-Generated Template</div>
  </div>

  <div class="meta-info">
    <div class="meta-section">
      <h3>From</h3>
      <p><strong>${metadata.business}</strong></p>
      <p>${metadata.industry} Services</p>
      <p>Date: ${currentDate}</p>
    </div>
    <div class="meta-section">
      <h3>Bill To</h3>
      <p><strong>${metadata.client}</strong></p>
      <p>Invoice #: INV-${Date.now().toString().slice(-6)}</p>
      <p>Due: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-ZA')}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50%;">Description</th>
        <th style="width: 12%;">Qty</th>
        <th style="width: 13%;">Unit</th>
        <th style="width: 25%; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${data.items.map((item: any) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${item.unitType}</td>
          <td class="text-right">R${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <table class="totals-table">
      <tr>
        <td>Subtotal:</td>
        <td class="text-right">R${subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td>VAT (15%):</td>
        <td class="text-right">R${vat.toFixed(2)}</td>
      </tr>
      <tr class="total-row">
        <td>TOTAL:</td>
        <td class="text-right">R${total.toFixed(2)}</td>
      </tr>
    </table>
  </div>

  <div class="footer">
    <p><strong>Scenario:</strong> ${metadata.scenario}</p>
    <p>Generated using AI-powered template system • Document Creator Pro</p>
    <p>This is a demonstration of AI-generated invoice templates with South African pricing</p>
  </div>
</body>
</html>`;
  } else {
    // Contract
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page { margin: 2.5cm; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.8;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      border-bottom: 4px double #1e40af;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    .header h1 {
      color: #1e40af;
      margin: 0 0 10px 0;
      font-size: 36px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .header .subtitle {
      color: #475569;
      font-size: 16px;
      font-style: italic;
    }
    .badge {
      display: inline-block;
      background: #22c55e;
      color: white;
      padding: 6px 16px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 15px;
      font-family: 'Segoe UI', sans-serif;
    }
    .meta-info {
      background: #f8fafc;
      padding: 25px;
      border-left: 4px solid #2563eb;
      margin-bottom: 40px;
      font-size: 14px;
    }
    .meta-info p {
      margin: 8px 0;
    }
    .clause {
      margin-bottom: 35px;
      page-break-inside: avoid;
    }
    .clause-number {
      color: #1e40af;
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-family: 'Segoe UI', sans-serif;
    }
    .clause-title {
      color: #334155;
      font-size: 20px;
      font-weight: bold;
      margin: 15px 0 10px 0;
    }
    .clause-content {
      text-align: justify;
      padding-left: 20px;
      border-left: 2px solid #e2e8f0;
      color: #334155;
    }
    .signatures {
      margin-top: 60px;
      padding-top: 30px;
      border-top: 2px solid #cbd5e1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .signature-block {
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #1e40af;
      margin: 40px 0 10px 0;
      padding-top: 5px;
      font-size: 14px;
      font-weight: bold;
    }
    .footer {
      margin-top: 60px;
      padding-top: 25px;
      border-top: 3px double #cbd5e1;
      text-align: center;
      color: #64748b;
      font-size: 11px;
      font-family: 'Segoe UI', sans-serif;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Contract Agreement</h1>
    <div class="subtitle">${data.title || title}</div>
    <div class="badge">✨ AI-Generated Professional Contract</div>
  </div>

  <div class="meta-info">
    <p><strong>Date of Agreement:</strong> ${currentDate}</p>
    <p><strong>Between:</strong> ${metadata.business} ("Service Provider")</p>
    <p><strong>And:</strong> ${metadata.client} ("Client")</p>
    <p><strong>Industry:</strong> ${metadata.industry}</p>
    <p><strong>Scenario:</strong> ${metadata.scenario}</p>
  </div>

  ${data.clauses.map((clause: any, index: number) => `
    <div class="clause">
      <div class="clause-number">Clause ${index + 1}</div>
      <div class="clause-title">${clause.title}</div>
      <div class="clause-content">${clause.content.replace(/\n/g, '<br>')}</div>
    </div>
  `).join('')}

  <div class="signatures">
    <div class="signature-block">
      <div class="signature-line">${metadata.business}</div>
      <p>Service Provider</p>
    </div>
    <div class="signature-block">
      <div class="signature-line">${metadata.client}</div>
      <p>Client</p>
    </div>
  </div>

  <div class="footer">
    <p><strong>AI-Generated Contract Template</strong></p>
    <p>Generated using advanced AI with South African legal context • Document Creator Pro</p>
    <p>This is a professional demonstration of AI contract clause generation</p>
    <p><em>⚠️ For demonstration purposes - Please review with legal counsel before use</em></p>
  </div>
</body>
</html>`;
  }
}

async function main() {
  console.log('🎨 CREATING AI-GENERATED DEMO PDFs\n');
  console.log('='.repeat(70));

  const scenarios = {
    invoices: [
      {
        name: 'Emergency Plumbing',
        prompt: 'Emergency plumbing repair for burst pipe in kitchen. Client: Sarah Johnson. Includes emergency callout, pipe replacement, and water damage assessment.',
        client: 'Sarah Johnson',
        business: 'QuickFix Plumbing Services',
        industry: 'Plumber'
      },
      {
        name: 'Website Development',
        prompt: 'Full website development for small business. Client: Tech Startup Ltd. Includes design, frontend development, backend API, database setup, and 3 months support.',
        client: 'Tech Startup Ltd',
        business: 'Digital Solutions Agency',
        industry: 'Web Development'
      },
      {
        name: 'Corporate Catering',
        prompt: 'Corporate lunch catering for 50 people. Client: ABC Corporation. Includes buffet setup, main courses, sides, desserts, beverages, and service staff.',
        client: 'ABC Corporation',
        business: 'Gourmet Events Catering',
        industry: 'Catering'
      }
    ],
    contracts: [
      {
        name: 'Software Development Agreement',
        prompt: 'Software development contract for mobile app project. Client: Startup Inc. Include scope, timeline, payment terms, intellectual property rights, confidentiality, and support terms.',
        client: 'Startup Inc',
        business: 'Tech Innovators Pty Ltd',
        industry: 'Software Development'
      },
      {
        name: 'Partnership Agreement',
        prompt: 'Business partnership agreement for 60/40 equity split. Partners: Founder A and Investor B. Include capital contribution, profit sharing, decision making, and exit terms.',
        client: 'Investor B',
        business: 'Founder A',
        industry: 'Business Partnership'
      }
    ]
  };

  const outputDir = path.join(process.cwd(), 'ai-generated-demos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate invoices
  console.log('\n📄 GENERATING INVOICES');
  console.log('-'.repeat(70));
  for (const scenario of scenarios.invoices) {
    try {
      const data = await generateDocument('INVOICE', scenario);
      const html = await createHTMLDocument(
        scenario.name,
        'invoice',
        data,
        {
          client: scenario.client,
          business: scenario.business,
          industry: scenario.industry,
          scenario: scenario.prompt
        }
      );

      const filename = `invoice-${scenario.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, html);
      console.log(`  ✅ ${filename}`);
      console.log(`     Items: ${data.items.length}, Total: R${data.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toFixed(2)}`);

      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ❌ Failed: ${scenario.name}`, error);
    }
  }

  // Generate contracts
  console.log('\n📜 GENERATING CONTRACTS');
  console.log('-'.repeat(70));
  for (const scenario of scenarios.contracts) {
    try {
      const data = await generateDocument('CONTRACT', scenario);
      const html = await createHTMLDocument(
        scenario.name,
        'contract',
        data,
        {
          client: scenario.client,
          business: scenario.business,
          industry: scenario.industry,
          scenario: scenario.prompt
        }
      );

      const filename = `contract-${scenario.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, html);
      console.log(`  ✅ ${filename}`);
      console.log(`     Clauses: ${data.clauses.length}`);

      // Wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ❌ Failed: ${scenario.name}`, error);
    }
  }

  console.log('\n\n✨ COMPLETE!');
  console.log('='.repeat(70));
  console.log(`📁 All documents saved to: ${outputDir}`);
  console.log('\n📋 Files generated:');
  const files = fs.readdirSync(outputDir);
  files.forEach(file => {
    console.log(`   • ${file}`);
  });
  console.log('\n💡 Open the HTML files in your browser to view beautifully formatted documents!');
  console.log('💡 You can print these as PDFs directly from your browser (Cmd/Ctrl + P)');
}

main()
  .then(() => {
    console.log('\n✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
