import { test, expect } from '@playwright/test'
import { loginWith, createBlog, likeBlog } from './helper.js'

test.describe('Blog app', () => {

  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'test',
        password: 'password'
      }
    })

    await page.goto('/')
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
      await loginWith(page, 'test', 'wrong password')

      const errorDiv = await page.locator('.notification')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Test User logged-in')).not.toBeVisible()
    })
  })

  test.describe('when logged in', () => {

    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'test', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test title', 'Test User', 'https://url.com')

      await expect(page.getByText('a new blog Test title by Test User added')).toBeVisible()
      await expect(page.getByText('Test title ~ Test User')).toBeVisible()
    })

    test.describe('and a blogs exists', () => {
      test.beforeEach(async ({ page }) => {
        await createBlog(page, 'First title', 'Test User', 'https://first-url.com')
        await createBlog(page, 'Second title', 'Test User', 'https://second-url.com')
        await createBlog(page, 'Third title', 'Test User', 'https://third-url.com')
      })

      test('it can be liked', async ({ page }) => {
        await likeBlog(page, 'Second title', 1)

        await expect(page.getByText('https://second-url.com')).toBeVisible()
        await expect(page.getByText('likes 1')).toBeVisible()
      })

      test('it can be removed by the user who created it', async ({ page }) => {
        const blog = await page.getByText('First title ~ Test User')
        await blog.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
        page.on('dialog', async dialog => {
          console.log(dialog.message())
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.getByText('blog First title removed')).toBeVisible()
        await expect(page.getByText('First title ~ Test User')).not.toBeVisible()
      })

      test('it cannot be removed by another user', async ({ page, request }) => {
        await page.getByText('logout').click()

        await request.post('/api/users', {
          data: {
            name: 'New User',
            username: 'newuser',
            password: 'password'
          }
        })

        await loginWith(page, 'newuser', 'password')
        await createBlog(page, 'New title', 'New User', 'https://new-url.com')

        const oldBlog = await page.getByText('First title ~ Test User')
        await oldBlog.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()

        const newBlog = await page.getByText('New title ~ New User')
        await newBlog.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      })

      test('blogs are ordered according to likes', async ({ page }) => {
        await likeBlog(page, 'Third title', 3)
        await likeBlog(page, 'Second title', 2)
        await likeBlog(page, 'First title', 1)

        const blogs = await page.locator('.test-blog-title')
        await expect(blogs.nth(0)).toContainText('Third title')
        await expect(blogs.nth(1)).toContainText('Second title')
        await expect(blogs.nth(2)).toContainText('First title')

        const blogDetails = await page.locator('.test-blog-details')
        await expect(blogDetails.nth(0)).toContainText('likes 3')
        await expect(blogDetails.nth(1)).toContainText('likes 2')
        await expect(blogDetails.nth(2)).toContainText('likes 1')
      })
    })
  })
})
