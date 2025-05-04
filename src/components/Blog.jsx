import React, { useState } from 'react'

const Blog = ({ blog, userLoggedIn, handleLike, handleRemove }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [loggedIn, setLoggedIn] = useState(userLoggedIn === blog.author)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className='test-blog'>
      <div className='test-blog-title'>
        {blog.title} ~ {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div className='test-blog-details'>
          <div>{blog.url}</div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
          <div>{blog.author}</div>
          {loggedIn && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
