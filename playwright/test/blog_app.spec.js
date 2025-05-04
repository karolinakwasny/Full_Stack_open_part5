import { test, expect } from '@playwright/test'
import { loginWith } from './helper.js'

test.describe('Blog app', () => {

  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'test',
        password: 'password'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in to application')
    await expect(locator).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'test', 'password')

      await expect(page.getByText('Test User logged-in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'wrong username', 'wrong password')

      const locator = await page.getByText('wrong username or password')
      await expect(locator).toBeVisible()
    })
  })

  test.describe('when logged in', () => {

    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('Title').fill('Test title')
      await page.getByPlaceholder('Author').fill('Test User')
      await page.getByPlaceholder('Url').fill('https://url.com')
      await page.getByRole('button', { name: 'create' }).click()

      const locator = await page.getByText('a new blog Test title by Test User added')
      await expect(locator).toBeVisible()

      const blog = await page.getByText('Test title ~ Test User')
      await expect(blog).toBeVisible()
    })
  })
})
