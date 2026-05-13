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
    await expect(page.getByRole('banner').getByRole('link', { name: 'Início', exact: true })).toBeVisible()
    await expect(page.getByRole('banner').getByRole('link', { name: 'Nossos Serviços', exact: true })).toBeVisible()
    await expect(page.getByRole('banner').getByRole('link', { name: 'Perguntas Frequentes', exact: true })).toBeVisible()
  })

  test('navigates to services page and back home', async ({ page }) => {
    await page.getByText('Nossos Serviços').first().click()
    await expect(page).toHaveURL(/\/nossos-servicos$/)
    await expect(page.getByRole('heading', { name: 'Conheça as soluções premium que oferecemos para sua empresa' })).toBeVisible()

    await page.getByText('Início').first().click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('loads services page directly and returns via logo', async ({ page }) => {
    await page.goto('/nossos-servicos')
    await expect(page).toHaveURL(/\/nossos-servicos$/)
    await expect(page.getByRole('heading', { name: 'Conheça as soluções premium que oferecemos para sua empresa' })).toBeVisible()

    await page.getByAltText('Truth Commerce').first().click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('mobile menu navigates between home and services', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.locator('nav').filter({ has: page.getByRole('link', { name: 'Nossos Serviços', exact: true }) }).getByRole('link', { name: 'Nossos Serviços', exact: true }).click()
    await expect(page).toHaveURL(/\/nossos-servicos$/)
    await expect(page.getByRole('heading', { name: 'Conheça as soluções premium que oferecemos para sua empresa' })).toBeVisible()

    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.locator('nav').filter({ has: page.getByRole('link', { name: 'Início', exact: true }) }).last().getByRole('link', { name: 'Início', exact: true }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('h1').first()).toBeVisible()
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
