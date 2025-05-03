import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test } from 'vitest'

test('renders blog title and author by default and url and likes when clicked on view', async () => {
  const blog = {
    title: 'Test title',
    author: 'John Doe',
    url: 'url.com',
    likes: 0,
  }
  const { container } = render(<Blog blog={blog} />)

  expect(screen.getByText('Test title ~ John Doe')).toBeInTheDocument()
  expect(screen.queryByText('url.com')).not.toBeInTheDocument()
  expect(screen.queryByText('likes 0')).not.toBeInTheDocument()

  const blogSectionbefore = container.querySelector('.test-blog')
  expect(blogSectionbefore).toBeInTheDocument()

  const detailsSectionbefore = container.querySelector('.test-blog-details')
  expect(detailsSectionbefore).not.toBeInTheDocument()

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('url.com')).toBeInTheDocument()
  expect(screen.getByText('likes 0')).toBeInTheDocument()

  const blogSection = container.querySelector('.test-blog')
  expect(blogSection).toBeInTheDocument()

  const detailsSection = container.querySelector('.test-blog-details')
  expect(detailsSection).toBeInTheDocument()
})

test('updates likes when button is clicked on twice', async () => {
  const blog = {
    title: 'A really interesting blog',
    author: 'John Doe',
    url: 'https://blog.com',
    likes: 0,
  }
  const mockHandler = vi.fn()
  render(<Blog blog={blog} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const view_button = screen.getByText('view')
  await user.click(view_button)

  const like_button = screen.getByText('like')
  await user.click(like_button)
  await user.click(like_button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})
