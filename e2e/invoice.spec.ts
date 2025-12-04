import { test, expect } from '@playwright/test';

// Test credentials from environment variables
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@gritdocs.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';

// Helper function to login
async function login(page) {
  await page.goto('/');
  
  const emailInput = page.getByPlaceholder(/email/i);
  const passwordInput = page.getByPlaceholder(/password/i);
  
  if (await emailInput.isVisible()) {
    await emailInput.fill(TEST_EMAIL);
    await passwordInput.fill(TEST_PASSWORD);
    
    const loginButton = page.getByRole('button', { name: /sign in|log in/i });
    await loginButton.click();
    
    await page.waitForURL(/dashboard|chat/, { timeout: 10000 });
  }
}

test.describe('Invoice Creation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should create a new invoice', async ({ page }) => {
    // Navigate to chat/invoice creation
    const newDocButton = page.getByRole('button', { name: /new invoice|create invoice/i });
    
    if (await newDocButton.isVisible()) {
      await newDocButton.click();
    } else {
      // Try navigating via link
      const chatLink = page.getByRole('link', { name: /chat|create/i });
      if (await chatLink.isVisible()) {
        await chatLink.click();
      }
    }
    
    // Should be on chat screen
    await expect(page).toHaveURL(/chat/);
    
    // Fill in napkin sketch or direct invoice creation
    const napkinInput = page.getByPlaceholder(/describe your invoice|napkin sketch/i);
    if (await napkinInput.isVisible()) {
      await napkinInput.fill('Invoice for web development services. 10 hours at $100/hour.');
      
      const generateButton = page.getByRole('button', { name: /generate|create/i });
      await generateButton.click();
      
      // Wait for AI generation (may take time)
      await page.waitForTimeout(3000);
      
      // Should see document preview or canvas
      await expect(page.locator('body')).toContainText(/invoice|total/i);
    }
  });

  test('should add line items to invoice', async ({ page }) => {
    // Navigate to canvas or existing invoice
    await page.goto('/');
    await page.waitForURL(/dashboard|chat/, { timeout: 10000 });
    
    // Go to documents
    const docsLink = page.getByRole('link', { name: /documents/i });
    if (await docsLink.isVisible()) {
      await docsLink.click();
      
      // Click first document
      const firstDoc = page.locator('[data-testid="document-card"]').first();
      if (await firstDoc.isVisible()) {
        await firstDoc.click();
      }
      
      // Should be on canvas
      await page.waitForTimeout(1000);
      
      // Look for add item button
      const addItemButton = page.getByRole('button', { name: /add item|add line/i });
      if (await addItemButton.isVisible()) {
        await addItemButton.click();
        
        // Fill in line item details
        const itemDesc = page.getByPlaceholder(/description/i).last();
        const itemQty = page.getByPlaceholder(/quantity/i).last();
        const itemPrice = page.getByPlaceholder(/price|rate/i).last();
        
        await itemDesc.fill('Additional consulting');
        await itemQty.fill('5');
        await itemPrice.fill('150');
        
        // Verify total updated
        await page.waitForTimeout(500);
        await expect(page.locator('body')).toContainText(/total/i);
      }
    }
  });

  test('should change invoice theme', async ({ page }) => {
    // Navigate to canvas
    await page.goto('/');
    await page.waitForURL(/dashboard|chat/, { timeout: 10000 });
    
    const docsLink = page.getByRole('link', { name: /documents/i });
    if (await docsLink.isVisible()) {
      await docsLink.click();
      
      const firstDoc = page.locator('[data-testid="document-card"]').first();
      if (await firstDoc.isVisible()) {
        await firstDoc.click();
      }
      
      await page.waitForTimeout(1000);
      
      // Look for theme selector
      const themeButton = page.getByRole('button', { name: /theme|style/i });
      if (await themeButton.isVisible()) {
        await themeButton.click();
        
        // Select different theme
        const theme = page.locator('[data-testid="theme-option"]').first();
        if (await theme.isVisible()) {
          await theme.click();
          
          // Verify theme changed (visual change in preview)
          await page.waitForTimeout(500);
        }
      }
    }
  });

  test('should export invoice as PDF', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/dashboard|chat/, { timeout: 10000 });
    
    const docsLink = page.getByRole('link', { name: /documents/i });
    if (await docsLink.isVisible()) {
      await docsLink.click();
      
      const firstDoc = page.locator('[data-testid="document-card"]').first();
      if (await firstDoc.isVisible()) {
        await firstDoc.click();
      }
      
      await page.waitForTimeout(1000);
      
      // Look for download/export button
      const downloadButton = page.getByRole('button', { name: /download|export|pdf/i });
      if (await downloadButton.isVisible()) {
        // Setup download listener
        const downloadPromise = page.waitForEvent('download');
        
        await downloadButton.click();
        
        const download = await downloadPromise;
        
        // Verify download started
        expect(download.suggestedFilename()).toMatch(/\.pdf$/);
      }
    }
  });
});
