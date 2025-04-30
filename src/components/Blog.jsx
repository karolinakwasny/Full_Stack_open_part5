import React, { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const handleWhenHidden = { display: showDetails ? 'none' : '' }
  const handleWhenVisible = { display: showDetails ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} ~ {blog.author}
      <button
        style={handleWhenHidden}
        onClick={() => setShowDetails(true)}>
          view
      </button>
      <button
        style={handleWhenVisible}
        onClick={() => setShowDetails(false)}>
          hide
      </button>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes}
          <button>like</button>
          </div>
          <div>{blog.user.name}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
