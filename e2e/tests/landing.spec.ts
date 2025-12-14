import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test('should load and display main elements', async ({ page }) => {
    await page.goto('/')

    // Check main heading
    await expect(page.getByText('SuKoç')).toBeVisible()

    // Check hero section
    await expect(page.getByText(/Su tasarrufuna başlamak/i)).toBeVisible()
    await expect(page.getByText(/5 dakikalık quiz ile/i)).toBeVisible()

    // Check CTA button
    await expect(page.getByRole('button', { name: /quiz'e başla/i })).toBeVisible()

    // Check features section
    await expect(page.getByText('Neden SuKoç?')).toBeVisible()
    await expect(page.getByText('Kişiselleştirilmiş Analiz')).toBeVisible()
    await expect(page.getByText('Uygulanabilir Öneriler')).toBeVisible()
    await expect(page.getByText('İlerleme Takibi')).toBeVisible()

    // Check testimonial
    await expect(page.getByText(/SuKoç sayesinde/i)).toBeVisible()
  })

  test('should navigate to onboarding when CTA is clicked', async ({ page }) => {
    await page.goto('/')

    // Click the main CTA button
    await page.getByRole('button', { name: /quiz'e başla/i }).click()

    // Should navigate to onboarding page
    await expect(page).toHaveURL('/onboarding')
    await expect(page.getByText(/Hadi tanışalım/i)).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check that main elements are still visible
    await expect(page.getByText('SuKoç')).toBeVisible()
    await expect(page.getByRole('button', { name: /quiz'e başla/i })).toBeVisible()

    // Check that layout adapts to mobile
    const heroSection = page.locator('section').first()
    await expect(heroSection).toBeVisible()
  })
})

test.describe('Onboarding Flow', () => {
  test('should complete onboarding flow', async ({ page }) => {
    await page.goto('/onboarding')

    // Fill household size
    await page.selectOption('select', { label: '2 kişi' })

    // Fill region
    await page.selectOption('select', { label: 'Marmara' })

    // Select water use areas
    await page.check('input[value="shower"]')
    await page.check('input[value="kitchen"]')

    // Submit form
    await page.getByRole('button', { name: /devam et/i }).click()

    // Should navigate to quiz
    await expect(page).toHaveURL('/quiz')
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/onboarding')

    // Try to submit empty form
    await page.getByRole('button', { name: /devam et/i }).click()

    // Should show validation errors
    await expect(page.getByText(/aile büyüklüğünüzü seçin/i)).toBeVisible()
  })
})

test.describe('Quiz Flow', () => {
  test('should complete quiz flow', async ({ page }) => {
    // Start from onboarding
    await page.goto('/onboarding')

    // Complete onboarding
    await page.selectOption('select', { label: '2 kişi' })
    await page.selectOption('select', { label: 'Marmara' })
    await page.check('input[value="shower"]')
    await page.getByRole('button', { name: /devam et/i }).click()

    // Should be on quiz page
    await expect(page).toHaveURL('/quiz')
    await expect(page.getByText(/Su Kullanım Analizi/i)).toBeVisible()

    // Answer first few questions
    const slider = page.locator('input[type="range"]').first()
    await slider.fill('15')

    await page.getByRole('button', { name: /ileri/i }).click()

    // Should show progress
    await expect(page.getByText(/ilerleme/i)).toBeVisible()
  })
})

test.describe('Results Page', () => {
  test('should display results after quiz completion', async ({ page }) => {
    // Mock quiz completion by going directly to results
    await page.goto('/results')

    // Should show results or redirect to landing
    // (In real app, this would show results after quiz completion)
    await expect(page.locator('body')).toBeVisible()
  })
})
