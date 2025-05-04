import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test('user can login', async ({ page }) => {
    await page.getByTestId('username').fill('test')
    await page.getByTestId('password').fill('password')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Test User logged-in')).toBeVisible()
  })
})
