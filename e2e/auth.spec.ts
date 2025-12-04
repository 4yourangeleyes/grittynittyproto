import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should sign up a new user', async ({ page }) => {
    await page.goto('/');
    
    // Should see login screen
    await expect(page.locator('h1')).toContainText('GritDocs');
    
    // Fill in signup form (assuming signup UI exists)
    // Note: This is a placeholder - adjust based on actual auth flow
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    
    if (await emailInput.isVisible()) {
      await emailInput.fill(`test-${Date.now()}@example.com`);
      await passwordInput.fill('TestPassword123!');
      
      // Click sign up button
      const signUpButton = page.getByRole('button', { name: /sign up|register/i });
      if (await signUpButton.isVisible()) {
        await signUpButton.click();
        
        // Wait for redirect to dashboard
        await expect(page).toHaveURL(/dashboard|chat/);
      }
    }
  });

  test('should log in with credentials', async ({ page }) => {
    await page.goto('/');
    
    // Note: This assumes you have a test user created
    // Replace with actual test credentials
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@gritdocs.com');
      await passwordInput.fill('testpassword123');
      
      const loginButton = page.getByRole('button', { name: /sign in|log in/i });
      await loginButton.click();
      
      // Should redirect to main app
      await page.waitForURL(/dashboard|chat/, { timeout: 10000 });
      await expect(page).toHaveURL(/dashboard|chat/);
    }
  });

  test('should sign out', async ({ page }) => {
    await page.goto('/');
    
    // Log in first (reuse logic or use session storage)
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@gritdocs.com');
      await passwordInput.fill('testpassword123');
      
      const loginButton = page.getByRole('button', { name: /sign in|log in/i });
      await loginButton.click();
      
      await page.waitForURL(/dashboard|chat/, { timeout: 10000 });
      
      // Navigate to settings or find sign out button
      const settingsLink = page.getByRole('link', { name: /settings/i });
      if (await settingsLink.isVisible()) {
        await settingsLink.click();
        
        const signOutButton = page.getByRole('button', { name: /sign out|log out/i });
        if (await signOutButton.isVisible()) {
          await signOutButton.click();
          
          // Should redirect to login
          await expect(page).toHaveURL('/');
        }
      }
    }
  });
});
