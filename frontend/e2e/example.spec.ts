import { test, expect } from '@playwright/test';

test.describe('AeroDuct Frontend E2E Flows', () => {
  test('homepage renders hero, trust signals, and navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Duct Cleaning Service|AeroDuct/i);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByText(/Hospital-Grade HVAC & Air Duct Sanitization/i)).toBeVisible();
    await expect(page.getByText(/About AeroDuct/i)).toBeVisible();
  });

  test('pricing page allows service selection and shows calculated total', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/Flat-Rate Pricing Calculator/i)).toBeVisible();
    await expect(page.getByText(/Transparent Total/i)).toBeVisible();
    await expect(page.getByText(/Total Due/i)).toBeVisible();
  });

  test('booking flow navigation renders 3 steps', async ({ page }) => {
    await page.goto('/book');
    await expect(page.getByText(/Schedule Your Service Appointment/i)).toBeVisible();
    await expect(page.getByText(/Contact & Address/i)).toBeVisible();
    await expect(page.getByText(/Date & Slot/i)).toBeVisible();
    await expect(page.getByText(/Review & Book/i)).toBeVisible();
  });

  test('digital airway passport renders certificate and audit score', async ({ page }) => {
    await page.goto('/passport/PASS-TEST-1234');
    await expect(page.getByText(/Digital Airway Passport/i)).toBeVisible();
    await expect(page.getByText(/Airflow Restoration Score/i)).toBeVisible();
    await expect(page.getByText(/96 \/ 100/i)).toBeVisible();
  });
});
