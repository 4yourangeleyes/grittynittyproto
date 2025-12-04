#!/usr/bin/env node
/**
 * Create App-Styled Demo Documents
 * Generate HTML previews using your app's actual theme styles
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate document using AI
async function generateAIDocument(type: 'INVOICE' | 'CONTRACT', scenario: any) {
  const response = await supabase.functions.invoke('generate-document', {
    body: {
      docType: type,
      prompt: scenario.prompt,
      clientName: scenario.client,
      businessName: scenario.business,
      industry: scenario.industry
    }
  });

  if (response.error) throw response.error;
  return response.data;
}

// Create invoice in Swiss theme (matching your app)
function createSwissInvoiceHTML(data: any, meta: any): string {
  const subtotal = data.items.reduce((s: number, i: any) => s + (i.price * i.quantity), 0);
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f3f4f6;
      padding: 40px 20px;
    }
    .page-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .header .subtitle {
      font-size: 16px;
      opacity: 0.9;
      font-weight: 500;
    }
    .badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 12px;
      border: 1px solid rgba(255,255,255,0.3);
    }
    .content {
      padding: 40px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 2px solid #e5e7eb;
    }
    .meta-section h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #6b7280;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .meta-section p {
      font-size: 14px;
      color: #1f2937;
      margin: 6px 0;
      line-height: 1.5;
    }
    .meta-section strong {
      font-weight: 600;
      color: #111827;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    thead {
      background: #f9fafb;
      border-top: 2px solid #e5e7eb;
      border-bottom: 2px solid #e5e7eb;
    }
    th {
      text-align: left;
      padding: 14px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
      color: #6b7280;
    }
    td {
      padding: 16px 12px;
      border-bottom: 1px solid #f3f4f6;
      font-size: 14px;
      color: #374151;
    }
    tbody tr:hover {
      background: #fafafa;
    }
    .text-right { text-align: right; }
    .totals {
      margin-top: 40px;
      display: flex;
      justify-content: flex-end;
    }
    .totals-box {
      width: 350px;
      background: #f9fafb;
      border-radius: 8px;
      padding: 24px;
      border: 1px solid #e5e7eb;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
    }
    .total-row.final {
      margin-top: 12px;
      padding-top: 16px;
      border-top: 2px solid #d1d5db;
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }
    .footer {
      background: #f9fafb;
      padding: 30px 40px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 13px;
      line-height: 1.6;
    }
    .footer strong {
      color: #374151;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="header">
      <h1>INVOICE</h1>
      <div class="subtitle">${data.title || meta.title}</div>
      <div class="badge">✨ AI-Generated • Swiss Theme</div>
    </div>

    <div class="content">
      <div class="meta-grid">
        <div class="meta-section">
          <h3>From</h3>
          <p><strong>${meta.business}</strong></p>
          <p>${meta.industry}</p>
          <p>Date: ${new Date().toLocaleDateString('en-ZA')}</p>
        </div>
        <div class="meta-section">
          <h3>Bill To</h3>
          <p><strong>${meta.client}</strong></p>
          <p>Invoice #: ${Date.now().toString().slice(-8)}</p>
          <p>Due: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-ZA')}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 10%;">QTY</th>
            <th style="width: 10%;">UNIT</th>
            <th style="width: 55%;">DESCRIPTION</th>
            <th style="width: 25%; text-align: right;">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map((item: any) => `
            <tr>
              <td class="text-right">${item.quantity}</td>
              <td>${item.unitType}</td>
              <td>${item.description}</td>
              <td class="text-right"><strong>R${(item.price * item.quantity).toFixed(2)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-box">
          <div class="total-row">
            <span>Subtotal</span>
            <strong>R${subtotal.toFixed(2)}</strong>
          </div>
          <div class="total-row">
            <span>VAT (15%)</span>
            <strong>R${vat.toFixed(2)}</strong>
          </div>
          <div class="total-row final">
            <span>TOTAL</span>
            <span>R${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>AI-Generated Template Block</strong></p>
      <p>Scenario: ${meta.scenario}</p>
      <p>Created using your app's Swiss theme styling with Gemini AI • Ready to use in Document Creator</p>
      <p style="margin-top: 12px; font-size: 11px; color: #9ca3af;">This template can be saved and reused for similar projects</p>
    </div>
  </div>
</body>
</html>`;
}

// Create contract in Legal theme (matching your app)
function createLegalContractHTML(data: any, meta: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Inter:wght@500;600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Crimson Pro', Georgia, serif;
      background: #f3f4f6;
      padding: 40px 20px;
      line-height: 1.8;
    }
    .page-container {
      max-width: 850px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #1f2937;
      color: white;
      padding: 50px 40px;
      border-top: 6px solid #667eea;
      text-align: center;
    }
    .header h1 {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .header .subtitle {
      font-size: 18px;
      opacity: 0.9;
      font-weight: 400;
      font-style: italic;
    }
    .badge {
      display: inline-block;
      background: #667eea;
      padding: 8px 18px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 20px;
      font-family: 'Inter', sans-serif;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 50px;
    }
    .preamble {
      background: #f9fafb;
      border-left: 4px solid #667eea;
      padding: 25px 30px;
      margin-bottom: 40px;
      font-size: 15px;
      color: #374151;
    }
    .preamble p {
      margin: 8px 0;
    }
    .preamble strong {
      color: #111827;
      font-weight: 600;
    }
    .clause {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .clause-number {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      text-transform: uppercase;
      color: #667eea;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .clause-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
    }
    .clause-content {
      font-size: 16px;
      color: #374151;
      text-align: justify;
      line-height: 1.9;
    }
    .signatures {
      margin-top: 60px;
      padding-top: 40px;
      border-top: 3px solid #1f2937;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
    }
    .signature-block {
      text-align: center;
    }
    .signature-line {
      border-top: 2px solid #1f2937;
      margin: 50px 0 12px 0;
      padding-top: 8px;
      font-weight: 600;
      font-size: 15px;
      color: #111827;
    }
    .signature-role {
      font-size: 13px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-family: 'Inter', sans-serif;
    }
    .footer {
      background: #1f2937;
      color: white;
      padding: 35px 50px;
      text-align: center;
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      line-height: 1.7;
    }
    .footer p {
      margin: 8px 0;
      opacity: 0.9;
    }
    .footer strong {
      color: white;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div class="header">
      <h1>Contract Agreement</h1>
      <div class="subtitle">${data.title || meta.title}</div>
      <div class="badge">✨ AI-Generated • Legal Theme</div>
    </div>

    <div class="content">
      <div class="preamble">
        <p><strong>THIS AGREEMENT</strong> is entered into on <strong>${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
        <p><strong>BETWEEN:</strong> ${meta.business} ("Service Provider")</p>
        <p><strong>AND:</strong> ${meta.client} ("Client")</p>
        <p><strong>INDUSTRY:</strong> ${meta.industry}</p>
        <p style="margin-top: 16px; font-style: italic;">WHEREAS the parties wish to enter into an agreement for the provision of professional services as detailed herein.</p>
      </div>

      ${data.clauses.map((clause: any, index: number) => `
        <div class="clause">
          <div class="clause-number">Clause ${index + 1}</div>
          <div class="clause-title">${clause.title}</div>
          <div class="clause-content">${clause.content.replace(/\n/g, '<br><br>')}</div>
        </div>
      `).join('')}

      <div class="signatures">
        <div class="signature-block">
          <div class="signature-line">${meta.business}</div>
          <div class="signature-role">Service Provider</div>
        </div>
        <div class="signature-block">
          <div class="signature-line">${meta.client}</div>
          <div class="signature-role">Client</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>AI-Generated Contract Template</strong></p>
      <p>Scenario: ${meta.scenario}</p>
      <p>Created using your app's Legal theme styling with Gemini AI • Ready to use in Document Creator</p>
      <p style="margin-top: 12px; font-size: 11px; opacity: 0.8;">⚠️ For demonstration purposes - Please review with legal counsel before use</p>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('🎨 CREATING APP-STYLED AI DEMOS\n');
  console.log('='.repeat(70));

  const scenarios = [
    {
      type: 'INVOICE' as const,
      theme: 'Swiss',
      name: 'Emergency Plumbing Invoice',
      prompt: 'Emergency plumbing repair: burst pipe in kitchen, emergency callout, pipe replacement, 3 hours labour, water damage assessment',
      client: 'Sarah Johnson',
      business: 'QuickFix Plumbing',
      industry: 'Plumber'
    },
    {
      type: 'INVOICE' as const,
      theme: 'Swiss',
      name: 'Website Development Invoice',
      prompt: 'Complete website development: design consultation, frontend development, backend API, database setup, hosting, 3 months support',
      client: 'Tech Startup Ltd',
      business: 'Digital Solutions',
      industry: 'Web Development'
    },
    {
      type: 'CONTRACT' as const,
      theme: 'Legal',
      name: 'Software Development Contract',
      prompt: 'Software development agreement for mobile app: scope, milestones, payment terms (50% deposit), IP rights, confidentiality, warranty, support',
      client: 'Innovation Inc',
      business: 'App Developers SA',
      industry: 'Software Development'
    },
    {
      type: 'CONTRACT' as const,
      theme: 'Legal',
      name: 'Partnership Agreement',
      prompt: 'Business partnership for 60/40 equity split: capital contribution, profit sharing, decision authority, exit strategy, dispute resolution',
      client: 'Investor Partners',
      business: 'Founder Enterprises',
      industry: 'Business Partnership'
    }
  ];

  const outputDir = path.join(process.cwd(), 'app-styled-demos');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const scenario of scenarios) {
    try {
      console.log(`\n📝 Generating ${scenario.type}: ${scenario.name}`);
      
      const data = await generateAIDocument(scenario.type, scenario);
      
      let html: string;
      if (scenario.type === 'INVOICE') {
        html = createSwissInvoiceHTML(data, {
          title: scenario.name,
          client: scenario.client,
          business: scenario.business,
          industry: scenario.industry,
          scenario: scenario.prompt
        });
      } else {
        html = createLegalContractHTML(data, {
          title: scenario.name,
          client: scenario.client,
          business: scenario.business,
          industry: scenario.industry,
          scenario: scenario.prompt
        });
      }

      const filename = `${scenario.type.toLowerCase()}-${scenario.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      fs.writeFileSync(path.join(outputDir, filename), html);
      
      console.log(`  ✅ Created ${filename}`);
      if (scenario.type === 'INVOICE') {
        const total = data.items.reduce((s: number, i: any) => s + (i.price * i.quantity), 0);
        console.log(`     Items: ${data.items.length}, Total: R${total.toFixed(2)}`);
      } else {
        console.log(`     Clauses: ${data.clauses.length}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ❌ Failed: ${scenario.name}`, error);
    }
  }

  console.log('\n\n✨ COMPLETE!');
  console.log('='.repeat(70));
  console.log(`📁 Files saved to: ${outputDir}`);
  console.log('\n📋 Generated documents:');
  fs.readdirSync(outputDir).forEach(file => {
    console.log(`   • ${file}`);
  });
  console.log('\n💡 Open these HTML files to see AI-generated content in your app\'s actual themes!');
  console.log('💡 Print as PDF directly from your browser (Cmd/Ctrl + P)');
}

main()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
