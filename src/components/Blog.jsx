import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, userLoggedIn, blogs, setBlogs, setNotification, handleLike }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const [loggedIn, setLoggedIn] = useState(userLoggedIn === blog.author)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleRemove = () => {
    const title = blog.title
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .deleteBlog(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setNotification({
            message: `blog "${title}" removed `,
            success: true,
          })
          setTimeout(() => {
            setNotification({ message: null, success: true })
          }, 5000)
        })
    }
  }


  return (
    <div style={blogStyle} className='test-blog'>
      <div>
        {blog.title} ~ {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div className='test-blog-details'>
          <div>{blog.url}</div>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleLike()
            setLikes(likes + 1)
          }}>
            likes {likes} <button type="submit">like</button>
          </form>
          <div>{blog.author}</div>
          {loggedIn && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
