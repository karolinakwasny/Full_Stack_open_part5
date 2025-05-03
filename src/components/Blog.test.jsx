import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

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
