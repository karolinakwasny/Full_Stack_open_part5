import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import CreateBlog from './CreateBlog'
import userEvent from '@testing-library/user-event'

test('the form calls the event handler it received as props with the right details when a new blog is created', async () => {
  const addBlog = vi.fn()
  const user = userEvent.setup()

  render(<CreateBlog addBlog={addBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('Url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Test title')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'https://url.com')
  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('Test title')
  expect(addBlog.mock.calls[0][0].author).toBe('John Doe')
  expect(addBlog.mock.calls[0][0].url).toBe('https://url.com')

})
