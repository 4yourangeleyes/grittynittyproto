# Quick Start Guide: Templates & Quick Create

## 🚀 New Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     GRITDOCS - NEW FEATURES                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │   TEMPLATES      │              │   QUICK CREATE   │        │
│  │                  │              │                  │        │
│  │  Manage Your     │              │  Fast Document   │        │
│  │  Template        │◄─────────────┤  Generation      │        │
│  │  Library         │  Templates   │  (3 Steps)       │        │
│  │                  │  Auto-Saved  │                  │        │
│  └────────┬─────────┘              └────────┬─────────┘        │
│           │                                 │                  │
│           │  Templates Available            │  Document        │
│           │  for Insertion                  │  Created         │
│           │                                 │                  │
│           └─────────────┬───────────────────┘                  │
│                         ▼                                      │
│                  ┌──────────────┐                              │
│                  │    CANVAS    │                              │
│                  │              │                              │
│                  │  Edit & Export│                              │
│                  │  Documents    │                              │
│                  └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Templates Page

### Purpose
Build a library of reusable invoice items and contract clauses

### How to Access
```
Menu → Templates
```

### Quick Actions

#### Create Invoice Template
```
1. Click "Create Template"
2. Name: "Standard Plumbing Package"
3. Category: "Plumbing"
4. Tab: "Invoice Blocks"
5. Add items:
   Option A - Manual:
     • Description: "Toilet installation"
     • Quantity: 1
     • Unit: ea
     • Price: 1500
     
   Option B - AI:
     • Type: "Standard bathroom fixtures package"
     • Click Sparkles button
     • AI generates items automatically
     
6. Click "Save Template"
```

#### Create Contract Clause Template
```
1. Click "Create Template"
2. Name: "Milestone Payment Terms"
3. Category: "Payment"
4. Tab: "Contract Clauses"
5. Contract Type: "Service Agreement"
6. Add clauses:
   Option A - Manual:
     • Title: "Payment Schedule"
     • Content: "Payment split into 3 milestones..."
     
   Option B - AI:
     • Type: "3 milestone payment structure with holdback"
     • Click Sparkles button
     • AI generates clauses
     
7. Click "Save Template"
```

### Template Organization
```
Templates Page
│
├── Invoice Blocks Tab
│   ├── Category: Plumbing
│   │   ├── Standard Bathroom Package
│   │   ├── Emergency Repair Kit
│   │   └── Maintenance Package
│   │
│   ├── Category: Electrical
│   │   ├── Wiring Package
│   │   └── Lighting Installation
│   │
│   └── Category: Quick Generated
│       └── (Auto-saved from Quick Create)
│
└── Contract Clauses Tab
    ├── Category: Payment
    │   ├── Milestone Payment Terms
    │   └── Upfront Payment
    │
    ├── Category: Legal
    │   ├── Liability Clause
    │   └── Termination Terms
    │
    └── Category: Quick Generated
        └── (Auto-saved from Quick Create)
```

---

## ⚡ Quick Create Page

### Purpose
Generate complete documents in 3 simple steps

### How to Access
```
Menu → Quick Create
OR
Auto-redirects here if you have no documents yet
```

### The 3-Step Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Select Client                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Search clients...  [________________]                      │
│                                                             │
│  ┌─────────────────────────────────────────┐              │
│  │  ABC Plumbing Co.                        │ ◄── Click    │
│  │  abc@plumbing.com                        │              │
│  └─────────────────────────────────────────┘              │
│                                                             │
│  ┌─────────────────────────────────────────┐              │
│  │  XYZ Construction                        │              │
│  │  xyz@construction.com                    │              │
│  └─────────────────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Choose Document Type                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────┐       │
│  │                      │    │                      │       │
│  │    📦 INVOICE        │    │   📄 CONTRACT       │       │
│  │                      │    │                      │       │
│  │  Itemized billing    │    │  Legal agreement    │       │
│  │  document            │    │  with clauses       │       │
│  │                      │    │                      │       │
│  └─────────────────────┘    └─────────────────────┘       │
│         ▲ Click                      ▲ Click               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Describe the Work                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Client: ABC Plumbing Co.                                   │
│  Type: Invoice                                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Bathroom renovation including new toilet, basin,    │  │
│  │ and tiling. Labor for 3 days plus materials.        │  │
│  │                                                      │  │
│  │                                                      │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
│  ℹ️  AI will automatically:                                 │
│     • Break down into line items                           │
│     • Suggest quantities and pricing                       │
│     • Save as reusable template                            │
│     • Calculate totals with tax                            │
│                                                             │
│  [Back]              [Generate Document →]                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### What Happens After "Generate"

```
1. AI processes your description
   ↓
2. Generates appropriate structure:
   
   For INVOICES:
   • Toilet installation (1 ea × R1,500)
   • Basin installation (1 ea × R800)
   • Floor tiling (12 sqm × R250/sqm)
   • Labor (3 days × R1,200/day)
   
   For CONTRACTS:
   • Scope of Work clause
   • Payment Terms (3 milestones)
   • Deliverables clause
   • Timeline clause
   • Acceptance criteria
   ↓
3. Saves to Templates
   Name: "Quick: Bathroom renovation including..."
   Category: "Quick Generated"
   ↓
4. Creates complete document
   • Client info inserted
   • Items/clauses added
   • Totals calculated (if invoice)
   ↓
5. Opens in Canvas
   Ready to edit, customize, export
```

---

## 💡 Usage Examples

### Example 1: First-Time Invoice

**Scenario:** You just completed a bathroom job and need to invoice the client

```
Navigation: Menu → Quick Create

Step 1: Select Client
  → Click "ABC Plumbing Co."

Step 2: Choose Type
  → Click "Invoice"

Step 3: Describe
  → Type: "Replaced leaking geyser including new 200L 
           tank, copper piping, pressure valve, and 
           installation labor (4 hours)"
  → Click "Generate Document"

Result:
  ✅ AI generates:
     • 200L Geyser Tank (1 ea × R3,500)
     • Copper Piping (6 m × R85/m)
     • Pressure Valve (1 ea × R280)
     • Installation Labor (4 hrs × R450/hr)
  
  ✅ Saves as template: "Quick: Replaced leaking geyser..."
  
  ✅ Opens in Canvas with:
     • All items listed
     • Subtotal: R6,070
     • VAT (15%): R910.50
     • Total: R6,980.50
  
  ✅ You can now:
     • Adjust prices
     • Add/remove items
     • Export to PDF
     • Email to client
```

### Example 2: Repeat Work Using Templates

**Scenario:** You're doing another geyser replacement (similar to last time)

```
Navigation: Menu → Templates

Action: Find your saved template
  → Category: "Quick Generated"
  → Template: "Quick: Replaced leaking geyser..."
  → Click "Edit"
  → Adjust prices if needed
  → Click "Save"

Then use it:
  Option A - Via Quick Create:
    • Select client
    • Choose Invoice
    • AI will suggest this template
  
  Option B - Via Canvas:
    • Create new invoice (wizard)
    • In Canvas, insert from Templates
    • Select this template
    • Items auto-populate

Time saved: 5+ minutes per invoice!
```

### Example 3: Building a Contract Library

**Scenario:** Create reusable contract clauses for your business

```
Navigation: Menu → Templates

Create Clause Set 1: Payment Terms
  1. Name: "50/50 Payment Split"
  2. Category: "Payment"
  3. Contract Type: "Service Agreement"
  4. AI Prompt: "Payment split 50% upfront, 50% on completion"
  5. Save ✓

Create Clause Set 2: Liability
  1. Name: "Standard Liability Clause"
  2. Category: "Legal"
  3. AI Prompt: "Contractor liability for workmanship defects, 
                 1 year warranty period"
  5. Save ✓

Create Clause Set 3: Timeline
  1. Name: "30-Day Completion"
  2. Category: "Schedule"
  3. Manual entry:
     Title: "Project Timeline"
     Content: "Work to be completed within 30 business days 
               from contract signing. Extensions require 
               written approval."
  4. Save ✓

Usage:
  → Now when creating contracts, select these clauses
  → Mix and match as needed
  → Instant professional contracts!
```

### Example 4: Industry-Specific Template Pack

**Scenario:** You're a plumber, build your template library

```
Phase 1: Create Invoice Templates
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Template: "Emergency Call-Out"
  Category: "Emergency"
  Items:
    • Emergency call-out fee (1 ea × R800)
    • After-hours surcharge (1 ea × R500)
  
  Template: "Standard Bathroom Package"
  Category: "Bathroom"
  Items:
    • Toilet installation (1 ea × R1,500)
    • Basin installation (1 ea × R800)
    • Tap replacement (2 ea × R450)
  
  Template: "Geyser Replacement"
  Category: "Geyser"
  Items:
    • 200L Geyser (1 ea × R3,500)
    • Labor: Geyser Install (1 ea × R2,000)
    • Copper piping (6 m × R85/m)
    • Pressure valve (1 ea × R280)

Phase 2: Create Contract Templates
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Template: "Maintenance Agreement Clauses"
  Category: "Maintenance"
  Clauses:
    • Monthly inspection schedule
    • Emergency response time (4 hours)
    • Parts replacement policy
    • Annual contract renewal terms
  
  Template: "Renovation Project Clauses"
  Category: "Projects"
  Clauses:
    • Scope of work definition
    • Milestone payment schedule (3 phases)
    • Change order process
    • Completion criteria

Phase 3: Mix & Match
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  Quick Create Workflow:
    1. Client: "Home Owner XYZ"
    2. Type: Invoice
    3. Describe: "Bathroom renovation"
    4. AI suggests:
       → "Standard Bathroom Package"
       → Adds automatically
    5. Tweak quantities/prices
    6. Done in 2 minutes!
```

---

## 🎯 Best Practices

### Template Naming Convention

**Good Names:**
```
✅ "Standard Bathroom Package"
✅ "Emergency Call-Out Fee"
✅ "Milestone Payment (3-phase)"
✅ "Liability - 12 Month Warranty"
```

**Bad Names:**
```
❌ "Template 1"
❌ "asdf"
❌ "Contract thing"
❌ "aaa"
```

### Category Organization

**Good Categories:**
```
✅ Invoice Categories:
   • Plumbing
   • Electrical
   • Emergency
   • Maintenance
   • Materials

✅ Contract Categories:
   • Payment
   • Legal
   • Schedule
   • Warranties
   • Scope
```

**Bad Categories:**
```
❌ "Misc"
❌ "Other"
❌ "asdf"
❌ Leaving category empty
```

### AI Prompt Tips

**Good Prompts:**
```
✅ "Standard bathroom plumbing package including toilet, 
    basin, and basic fixtures"

✅ "Emergency plumbing call-out with after-hours surcharge"

✅ "3-phase milestone payment structure with 30/40/30 split"

✅ "Warranty clause covering workmanship for 12 months with 
    exclusions for client-supplied materials"
```

**Bad Prompts:**
```
❌ "stuff"
❌ "plumbing"
❌ "make contract"
❌ "payment"
```

**Why Detailed Prompts Work Better:**
- AI understands context
- Generates accurate prices
- Creates proper structure
- Includes relevant details

---

## 🔄 Workflow Comparison

### Old Way (AI Chat - Removed)
```
Time: ~10 minutes per document

1. Navigate to AI Chat
2. Type: "I need an invoice"
3. Wait for AI response
4. Type: "For bathroom work"
5. Wait for AI response
6. Type: "With toilet and basin"
7. Wait for AI response
8. Type: "Add labor"
9. Wait for AI response
10. Maybe get something useful
11. Manually copy to document
12. Navigate to Canvas
13. Paste and fix formatting
14. Finally ready to edit

Problems:
❌ Conversational back-and-forth
❌ No template reuse
❌ Can't save patterns
❌ Time-consuming
❌ Frustrating workflow
```

### New Way (Quick Create)
```
Time: ~2 minutes per document

1. Navigate to Quick Create
2. Select client (1 click)
3. Choose Invoice (1 click)
4. Describe: "Bathroom with toilet, basin, labor"
5. Click Generate
6. Opens in Canvas ready to edit

Benefits:
✅ 3 simple steps
✅ Auto-saves as template
✅ Reusable for next time
✅ Direct to Canvas
✅ 80% faster!
```

### Even Faster (Using Templates)
```
Time: ~30 seconds per document

First Time:
  → Use Quick Create (2 minutes)
  → Saves as template automatically

Next Times:
  → Quick Create suggests your template
  → 1 click to apply
  → Opens in Canvas
  → Done!

After 5-10 jobs:
  → Library of common templates
  → Mix and match
  → Almost instant invoices
  → Professional consistency
```

---

## 📊 Time Savings Calculator

### Invoice Creation Time

```
Traditional Manual Entry:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Research pricing: 3 min
  • Type items: 5 min
  • Calculate totals: 2 min
  • Format document: 3 min
  • Total: ~13 minutes
  
Old AI Chat Method:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Chat back-and-forth: 7 min
  • Copy/paste to doc: 2 min
  • Fix formatting: 3 min
  • Total: ~12 minutes

Quick Create (First Time):
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Select client: 10 sec
  • Choose type: 5 sec
  • Describe work: 30 sec
  • AI generates: 15 sec
  • Total: ~60 seconds ✨

Quick Create (Using Template):
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • Select client: 10 sec
  • Choose type: 5 sec
  • AI suggests template: 5 sec
  • Apply: 5 sec
  • Total: ~25 seconds ⚡

Monthly Time Savings:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  If you create 20 invoices/month:
  
  Old way: 20 × 12 min = 240 minutes (4 hours)
  New way: 20 × 1 min = 20 minutes
  
  Saved: 220 minutes (3.7 hours) per month!
  
  Annual savings: 44 hours
  = More than 1 work week! 🎉
```

---

## 🐛 Troubleshooting

### Templates Page Issues

**Problem:** Can't see my templates
```
Solution:
1. Check you're logged in
2. Verify correct tab selected (Invoice/Contract)
3. Templates load from Supabase - check internet connection
4. Try refreshing page
```

**Problem:** AI generation not working
```
Solution:
1. Check internet connection
2. Verify Gemini API key configured in Supabase
3. Check prompt is detailed enough (see AI Prompt Tips)
4. Try again - API may have rate limits
```

**Problem:** Can't delete template
```
Solution:
1. Verify you own the template
2. Check you're logged in
3. Try refreshing page
4. Check console for errors (F12)
```

### Quick Create Issues

**Problem:** No clients showing in Step 1
```
Solution:
1. Navigate to Menu → Clients
2. Add at least one client
3. Return to Quick Create
4. Client should now appear
```

**Problem:** AI generates wrong items
```
Solution:
1. Make prompt more specific (see AI Prompt Tips)
2. Example: Instead of "plumbing", try:
   "Install new toilet including wax ring, bolts, 
    and water supply line"
3. You can always edit in Canvas after
```

**Problem:** Canvas doesn't open after generation
```
Solution:
1. Check browser console (F12) for errors
2. Verify document was created
3. Navigate manually: Menu → Documents → Select doc
4. Report bug if persists
```

---

## 🚀 Pro Tips

### Speed Hacks

1. **Keyboard Shortcuts**
   ```
   • Type in search: Auto-focuses client search
   • Enter: Selects first result
   • Tab: Navigate between fields
   ```

2. **Template Presets**
   ```
   Create templates for:
   • Your 3 most common jobs
   • Emergency call-outs
   • Standard packages
   
   Result: 90% of invoices use templates
   ```

3. **Category Strategy**
   ```
   Group by:
   • Job type (not client)
   • Service category
   • Price tier
   
   Makes finding templates faster
   ```

### Quality Improvements

1. **Refine Templates Over Time**
   ```
   After each job:
   • Did prices change?
   • New items needed?
   • Update your templates
   
   Templates get better with use
   ```

2. **Detailed AI Prompts**
   ```
   Include:
   • Specific items/services
   • Quantities
   • Quality level (standard/premium)
   • Time estimates
   
   = Better AI results
   ```

3. **Review Before Sending**
   ```
   Always check in Canvas:
   • Prices accurate?
   • Client details correct?
   • Professional appearance?
   
   Quick Create is fast, but verify!
   ```

---

## 📚 Related Documentation

- **Main Update Doc:** `TEMPLATES_QUICK_CREATE_UPDATE.md`
- **Release Notes:** `RELEASE_NOTES.md`
- **Testing Guide:** `MANUAL_TESTING_GUIDE.md`
- **Advanced Features:** `ADVANCED_FEATURES_ROADMAP.md`

---

**Quick Start Guide Version:** 1.0.0  
**Last Updated:** December 5, 2025  
**Need Help?** Check the full documentation in `TEMPLATES_QUICK_CREATE_UPDATE.md`
