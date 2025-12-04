# GritDocs Manual Testing Guide
**Version 2.0.0 - Contract Generation Feature**  
**Last Updated:** December 4, 2025

---

## 🎯 Testing Objectives

Verify that all new features work correctly in production:
1. ✅ AI Contract Generation (full workflow)
2. ✅ AI Invoice Generation (ensure no regression)
3. ✅ AI Preview Modal (both modes)
4. ✅ Canvas Integration (route state handling)
5. ✅ Template Performance (no crashes)

---

## 🚀 Prerequisites

### Environment Setup
```bash
# Start development server
npm run dev

# Or start preview server (production build)
npm run build && npm run preview
```

### Test Account
- Email: Your Supabase authenticated email
- Password: Your password
- Industry: Any (e.g., "Software Development", "Plumbing", "Legal Services")

### Browser
- Chrome/Edge (recommended)
- Firefox (secondary)
- Safari (optional)

---

## 📝 Test Cases

### TEST 1: AI Contract Generation Workflow
**Priority:** CRITICAL  
**Estimated Time:** 5 minutes

#### Steps:
1. **Login** to GritDocs
   - Navigate to `/`
   - Enter credentials
   - ✅ Verify: Redirected to dashboard

2. **Navigate to Chat Screen**
   - Click "💬 Chat" or "Create Document" link
   - ✅ Verify: URL is `/chat`
   - ✅ Verify: Multi-step wizard visible (Step 1: Client)

3. **Select Client**
   - Enter client name: "Test Client Inc"
   - Click "Next" or "Continue"
   - ✅ Verify: Move to Step 2 (Scope)

4. **Switch to Contract Mode**
   - Look for toggle buttons at top: "💰 Invoice" | "📄 Contract"
   - Click "📄 Contract"
   - ✅ Verify: Button changes to active state
   - ✅ Verify: Contract type dropdown appears

5. **Select Contract Type**
   - Open "Contract Type" dropdown
   - Select "Service Agreement"
   - ✅ Verify: Dropdown shows "Service Agreement"

6. **Enter Contract Description (Napkin Sketch)**
   - In the contract napkin textarea, enter:
     ```
     Web development services for e-commerce platform.
     6-week timeline. R50,000 total project cost.
     50% deposit upfront, 50% on completion.
     ```
   - ✅ Verify: Text entered successfully

7. **Generate Contract with AI**
   - Click "✨ Generate Contract" button
   - ✅ Verify: Loading spinner appears
   - ✅ Verify: Button text changes to "Generating..."
   - **Wait 3-5 seconds** for AI response

8. **Review AI Preview Modal**
   - ✅ Verify: Modal appears with title "AI Generated Contract"
   - ✅ Verify: Shows count (e.g., "Review 5 AI-generated clauses")
   - ✅ Verify: Clauses are listed with titles and content
   - ✅ Verify: Required clauses have "Required" badge
   - ✅ Verify: Can scroll through all clauses
   - ✅ Verify: Template name auto-filled (e.g., "Service Agreement - Test Client Inc")

9. **Test Modal Actions**
   - **Test Discard:**
     - Click "Discard" button
     - ✅ Verify: Modal closes
     - ✅ Verify: Clauses NOT added to contract
     - **Re-generate contract** (repeat steps 7-8)
   
   - **Test Add to Contract:**
     - In preview modal, click "Add to Contract" button
     - ✅ Verify: Modal closes
     - ✅ Verify: Move to Step 3 (Review)
     - ✅ Verify: Contract clauses visible in review section

10. **Review Contract in Step 3**
    - ✅ Verify: Client name displayed: "Test Client Inc"
    - ✅ Verify: Contract type shown: "Service Agreement"
    - ✅ Verify: All clauses listed with titles
    - ✅ Verify: "Create & Open Contract" button visible

11. **Create and Navigate to Canvas**
    - Click "Create & Open Contract" button
    - ✅ Verify: Navigate to `/canvas` URL
    - ✅ Verify: Contract loads in Canvas
    - ✅ Verify: Document title: "Service Agreement - Test Client Inc" (or AI-generated title)
    - ✅ Verify: All clauses visible in Canvas
    - ✅ Verify: Theme is "Legal" (or appropriate contract theme)

12. **Edit Contract in Canvas**
    - ✅ Verify: Can edit clause titles
    - ✅ Verify: Can edit clause content
    - ✅ Verify: Can add new clauses
    - ✅ Verify: Can delete clauses
    - ✅ Verify: Can change contract theme

13. **Export Contract to PDF**
    - Click "📄 Export PDF" or similar button
    - ✅ Verify: PDF generation starts
    - ✅ Verify: PDF downloads successfully
    - ✅ Verify: PDF contains all clauses
    - ✅ Verify: PDF has professional formatting

#### Expected Results:
- ✅ Complete workflow from Chat → AI → Preview → Canvas → PDF
- ✅ No errors in console
- ✅ No UI glitches or broken layouts
- ✅ All AI-generated clauses make sense contextually
- ✅ Navigation works smoothly

---

### TEST 2: AI Invoice Generation (Regression Test)
**Priority:** HIGH  
**Estimated Time:** 5 minutes

#### Steps:
1. **Navigate to Chat Screen**
   - Go to `/chat`
   - Select client: "Invoice Test Client"
   - Click "Next"

2. **Ensure Invoice Mode**
   - ✅ Verify: "💰 Invoice" button is active by default
   - If not, click "💰 Invoice" to switch

3. **Enter Invoice Description**
   - In napkin textarea, enter:
     ```
     Plumbing services: Fixed kitchen sink drain, replaced U-bend pipe.
     2 hours labour at R500/hour. Parts: R150.
     ```
   - Click "✨ Generate Invoice"

4. **Review AI Preview Modal**
   - ✅ Verify: Modal appears with title "AI Generated Items"
   - ✅ Verify: Shows invoice items with descriptions
   - ✅ Verify: Each item shows: quantity, unit type, price
   - ✅ Verify: Total amount calculated correctly
   - ✅ Verify: Template name auto-filled

5. **Add to Job**
   - Click "Add to Current Job" button
   - ✅ Verify: Modal closes
   - ✅ Verify: Items added to invoice
   - ✅ Verify: Move to Step 3 (Review)

6. **Create Invoice**
   - ✅ Verify: Items listed in review
   - ✅ Verify: Subtotal, tax, and total calculated
   - Click "Create & Send Invoice" (or similar)
   - ✅ Verify: Navigate to Canvas
   - ✅ Verify: Invoice loads correctly

7. **Verify Invoice Features**
   - ✅ Verify: All items visible
   - ✅ Verify: Prices and quantities correct
   - ✅ Verify: Total matches preview
   - ✅ Verify: Can export to PDF

#### Expected Results:
- ✅ Invoice generation still works (no regression)
- ✅ AI preview modal works for invoices
- ✅ All calculations correct

---

### TEST 3: AI Template Saving
**Priority:** MEDIUM  
**Estimated Time:** 3 minutes

#### Steps:
1. **Generate Contract/Invoice**
   - Follow TEST 1 or TEST 2 to generate AI content
   - When preview modal appears, **do NOT click "Add to Job/Contract"**

2. **Enter Template Name**
   - In "Optional: Save as Template" section
   - Enter template name: "Kitchen Plumbing Services" (for invoice)
   - OR "Standard Service Agreement" (for contract)
   - ✅ Verify: Input accepts text

3. **Save as Template**
   - Click "Save as Template '[name]'" button
   - ✅ Verify: Success message appears
   - ✅ Verify: Modal closes
   - ✅ Verify: Template saved notification

4. **Verify Template Saved**
   - Navigate to Templates screen (if available)
   - OR create new document and check template list
   - ✅ Verify: New template appears in list
   - ✅ Verify: Template name matches what was entered
   - ✅ Verify: Template contains all items/clauses

#### Expected Results:
- ✅ Templates save successfully
- ✅ Can reuse templates in future documents

---

### TEST 4: Performance Check (Template Loading)
**Priority:** HIGH  
**Estimated Time:** 2 minutes

#### Steps:
1. **Navigate to Templates Section**
   - Go to templates screen OR
   - Open template selector in Canvas/Chat

2. **Check Load Time**
   - ✅ Verify: Templates load in < 1 second
   - ✅ Verify: No "Loading..." spinner for more than 2 seconds
   - ✅ Verify: No browser freezing or lag

3. **Select Template**
   - Choose any template
   - ✅ Verify: Template items/clauses load instantly
   - ✅ Verify: No crashes or errors

4. **Check Memory Usage**
   - Open browser DevTools (F12)
   - Go to Performance/Memory tab
   - ✅ Verify: Memory usage reasonable (< 200MB)
   - ✅ Verify: No memory leaks

#### Expected Results:
- ✅ Fast loading times (< 1s)
- ✅ No crashes (regression from 500+ item bug)
- ✅ Smooth UX

---

### TEST 5: Error Handling
**Priority:** MEDIUM  
**Estimated Time:** 3 minutes

#### Steps:
1. **Test Empty Input**
   - Navigate to Chat
   - Leave napkin textarea empty
   - Click "Generate Invoice/Contract"
   - ✅ Verify: Error message appears
   - ✅ Verify: "Please provide more details" or similar

2. **Test Short Input**
   - Enter only "test" (< 10 characters)
   - Click generate
   - ✅ Verify: Error message appears
   - ✅ Verify: Minimum length requirement enforced

3. **Test Special Characters**
   - Enter: `<script>alert('xss')</script>`
   - Click generate
   - ✅ Verify: Input sanitized
   - ✅ Verify: No XSS vulnerability
   - ✅ Verify: Error message or sanitized input

4. **Test AI Timeout (if applicable)**
   - Generate contract
   - If AI takes > 10 seconds:
   - ✅ Verify: Timeout message appears
   - ✅ Verify: User prompted to try again

#### Expected Results:
- ✅ All edge cases handled gracefully
- ✅ No XSS vulnerabilities
- ✅ Clear error messages

---

### TEST 6: Mobile Responsiveness
**Priority:** MEDIUM  
**Estimated Time:** 3 minutes

#### Steps:
1. **Open DevTools**
   - Press F12
   - Click "Toggle Device Toolbar" (phone icon)
   - Select "iPhone 12 Pro" or similar

2. **Test Chat Screen**
   - ✅ Verify: Buttons not overlapping
   - ✅ Verify: Text readable
   - ✅ Verify: Contract/Invoice toggle visible
   - ✅ Verify: Can scroll through all content

3. **Test AI Preview Modal**
   - Generate contract/invoice
   - ✅ Verify: Modal fits screen
   - ✅ Verify: Can scroll through items/clauses
   - ✅ Verify: Buttons accessible
   - ✅ Verify: No horizontal scrolling

4. **Test Canvas**
   - ✅ Verify: Document preview visible
   - ✅ Verify: Can zoom in/out
   - ✅ Verify: Can edit clauses/items

#### Expected Results:
- ✅ Fully responsive on mobile
- ✅ No broken layouts
- ✅ Usable on small screens

---

## 🐛 Bug Reporting

### If you encounter an issue:

1. **Check Console Errors**
   - Open DevTools (F12)
   - Go to Console tab
   - Copy any error messages

2. **Take Screenshots**
   - Screenshot of the issue
   - Screenshot of console errors

3. **Record Details**
   ```
   Browser: Chrome 120.0
   OS: macOS 14.0
   Test Case: TEST 1 - Step 8
   Issue: AI preview modal doesn't appear
   Error: [paste console error]
   Steps to Reproduce:
   1. ...
   2. ...
   ```

4. **Create GitHub Issue**
   - Go to: https://github.com/4yourangeleyes/grittynittyproto/issues
   - Click "New Issue"
   - Paste details above

---

## ✅ Testing Checklist

### Critical Features
- [ ] TEST 1: AI Contract Generation (full workflow)
- [ ] TEST 2: AI Invoice Generation (regression test)
- [ ] TEST 3: AI Template Saving
- [ ] TEST 4: Performance Check
- [ ] TEST 5: Error Handling
- [ ] TEST 6: Mobile Responsiveness

### Additional Checks
- [ ] No console errors during normal usage
- [ ] No broken images or icons
- [ ] All buttons clickable and responsive
- [ ] Smooth transitions and animations
- [ ] Fast loading times (< 2s per page)
- [ ] PDF export works for both invoices and contracts
- [ ] Email sending functional (if testing email features)

### Cross-Browser Testing (Optional)
- [ ] Chrome/Edge (primary)
- [ ] Firefox
- [ ] Safari

---

## 📊 Test Results Template

```markdown
# Test Results - [Date]

**Tester:** [Your Name]
**Environment:** Dev / Preview / Production
**Browser:** Chrome 120.0
**OS:** macOS 14.0

## Summary
- Total Tests: 6
- Passed: X
- Failed: X
- Blocked: X

## Detailed Results

### TEST 1: AI Contract Generation
Status: ✅ PASS / ❌ FAIL
Notes: [Any observations]

### TEST 2: AI Invoice Generation
Status: ✅ PASS / ❌ FAIL
Notes: [Any observations]

### TEST 3: AI Template Saving
Status: ✅ PASS / ❌ FAIL
Notes: [Any observations]

### TEST 4: Performance Check
Status: ✅ PASS / ❌ FAIL
Notes: [Any observations]

### TEST 5: Error Handling
Status: ✅ PASS / ❌ FAIL
Notes: [Any observations]

### TEST 6: Mobile Responsiveness
Status: ✅ PASS / ❌ FAIL
Notes: [Any observations]

## Issues Found
1. [Issue description]
2. [Issue description]

## Recommendations
- [Any suggestions for improvement]
```

---

## 🎯 Success Criteria

### Minimum Requirements for Production
- ✅ All 6 critical tests PASS
- ✅ Zero console errors during normal flow
- ✅ No crashes or freezes
- ✅ Mobile responsive
- ✅ PDF export working

### Nice to Have
- Fast loading (< 1s page loads)
- Smooth animations
- Cross-browser compatibility
- Perfect mobile UX

---

**End of Testing Guide**

**Next Step:** Run through all tests and document results. Once all tests pass, the application is ready for production deployment!
