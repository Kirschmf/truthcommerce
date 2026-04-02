import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page loads and header is visible', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('hero section displays typewriter text', async ({ page }) => {
    // Wait for the typewriter to start rendering the first phrase
    const heroHeading = page.locator('h1').first()
    await expect(heroHeading).toBeVisible({ timeout: 10000 })
    // Should contain part of the first phrase after typewriter starts
    await expect(heroHeading).not.toBeEmpty()
  })

  test('nav links are present', async ({ page }) => {
    await expect(page.getByText('Metodologia')).toBeVisible()
    await expect(page.getByText('Perguntas Frequentes')).toBeVisible()
  })

  test('sections become visible on scroll', async ({ page }) => {
    // Scroll down to trigger GSAP animations and lazy loading
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 3))
    await page.waitForTimeout(1000)

    // AlertaCritico section should exist in the DOM
    const alertSection = page.locator('text=Alerta Crítico').first()
    await expect(alertSection).toBeAttached({ timeout: 5000 })
  })

  test('lazy-loaded CarrosselCases renders on scroll', async ({ page }) => {
    // Scroll far enough to trigger the lazy-loaded carousel
    await page.evaluate(async () => {
      const scrollStep = window.innerHeight
      for (let i = 0; i < 8; i++) {
        window.scrollBy(0, scrollStep)
        await new Promise(r => setTimeout(r, 300))
      }
    })

    // The carousel canvas should be in the DOM after scrolling
    const canvasElements = page.locator('canvas')
    await expect(canvasElements.first()).toBeAttached({ timeout: 10000 })
  })
})
