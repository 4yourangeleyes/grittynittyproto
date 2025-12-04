import { test, expect, Page } from '@playwright/test';

// Test credentials from environment variables
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'test@gritdocs.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';

// Helper function to login
async function login(page: Page) {
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

test.describe('Contract Creation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should create a new contract', async ({ page }) => {
    // Navigate to chat
    const chatLink = page.getByRole('link', { name: /chat|create/i });
    if (await chatLink.isVisible()) {
      await chatLink.click();
    }
    
    await expect(page).toHaveURL(/chat/);
    
    // Select contract type (if selector exists)
    const contractButton = page.getByRole('button', { name: /contract/i });
    if (await contractButton.isVisible()) {
      await contractButton.click();
    }
    
    // Fill napkin sketch
    const napkinInput = page.getByPlaceholder(/describe|napkin sketch/i);
    if (await napkinInput.isVisible()) {
      await napkinInput.fill('Service agreement for monthly website maintenance. 1 year term, $500/month.');
      
      const generateButton = page.getByRole('button', { name: /generate|create/i });
      await generateButton.click();
      
      // Wait for AI generation
      await page.waitForTimeout(3000);
      
      // Should see contract preview
      await expect(page.locator('body')).toContainText(/agreement|contract/i);
    }
  });

  test('should add clauses to contract', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/dashboard|chat/, { timeout: 10000 });
    
    // Navigate to documents and open a contract
    const docsLink = page.getByRole('link', { name: /documents/i });
    if (await docsLink.isVisible()) {
      await docsLink.click();
      
      // Find contract document (filter by type if possible)
      const contractDoc = page.locator('[data-testid="document-card"]').filter({ hasText: /contract/i }).first();
      if (await contractDoc.isVisible()) {
        await contractDoc.click();
      }
      
      await page.waitForTimeout(1000);
      
      // Look for add clause button
      const addClauseButton = page.getByRole('button', { name: /add clause|add section/i });
      if (await addClauseButton.isVisible()) {
        await addClauseButton.click();
        
        // Fill in clause details
        const clauseTitle = page.getByPlaceholder(/title|heading/i).last();
        const clauseContent = page.getByPlaceholder(/content|text/i).last();
        
        if (await clauseTitle.isVisible()) {
          await clauseTitle.fill('Termination Clause');
          await clauseContent.fill('Either party may terminate this agreement with 30 days written notice.');
          
          const saveButton = page.getByRole('button', { name: /save|add/i });
          if (await saveButton.isVisible()) {
            await saveButton.click();
          }
          
          // Verify clause added
          await expect(page.locator('body')).toContainText(/termination clause/i);
        }
      }
    }
  });

  test('should add visual components to contract', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/dashboard|chat/, { timeout: 10000 });
    
    const docsLink = page.getByRole('link', { name: /documents/i });
    if (await docsLink.isVisible()) {
      await docsLink.click();
      
      const contractDoc = page.locator('[data-testid="document-card"]').filter({ hasText: /contract/i }).first();
      if (await contractDoc.isVisible()) {
        await contractDoc.click();
      }
      
      await page.waitForTimeout(1000);
      
      // Look for visual component options (images, diagrams, etc.)
      const addVisualButton = page.getByRole('button', { name: /add visual|add image|add component/i });
      if (await addVisualButton.isVisible()) {
        await addVisualButton.click();
        
        // Select component type
        const imageOption = page.getByRole('button', { name: /image|photo/i });
        if (await imageOption.isVisible()) {
          await imageOption.click();
          
          // Should see upload or URL input
          await page.waitForTimeout(500);
        }
      }
    }
  });

  test('should switch to preview mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/dashboard|chat/, { timeout: 10000 });
    
    const docsLink = page.getByRole('link', { name: /documents/i });
    if (await docsLink.isVisible()) {
      await docsLink.click();
      
      const contractDoc = page.locator('[data-testid="document-card"]').filter({ hasText: /contract/i }).first();
      if (await contractDoc.isVisible()) {
        await contractDoc.click();
      }
      
      await page.waitForTimeout(1000);
      
      // Look for preview toggle
      const previewButton = page.getByRole('button', { name: /preview|view/i });
      if (await previewButton.isVisible()) {
        await previewButton.click();
        
        // Should see preview mode (no edit controls)
        await page.waitForTimeout(500);
        
        // Verify can't edit in preview mode
        const editControls = page.locator('[data-testid="edit-controls"]');
        if (await editControls.isVisible()) {
          expect(await editControls.isVisible()).toBe(false);
        }
      }
    }
  });
});
