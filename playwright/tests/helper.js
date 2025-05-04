import { expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('Title').fill(title)
  await page.getByPlaceholder('Author').fill(author)
  await page.getByPlaceholder('Url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const likeBlog = async (page, blogTitle, likesCount = 1) => {
  const blog = await page.locator('.test-blog', { hasText: blogTitle })
  await blog.getByRole('button', { name: 'view' }).click()

  const likeCountElement = blog.locator('.test-blog-details')

  for (let i = 0; i < likesCount; i++) {
    await blog.getByRole('button', { name: 'like' }).click()
    await expect(page.getByText(`likes ${i}`)).toBeVisible()
    await likeCountElement.waitFor({ state: 'attached' })
  }
}

export { loginWith, createBlog, likeBlog }
