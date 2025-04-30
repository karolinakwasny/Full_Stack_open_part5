import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const handleWhenHidden = { display: showDetails ? 'none' : '' }
  const handleWhenVisible = { display: showDetails ? '' : 'none' }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = (event) => {
    event.preventDefault()
    const updatedBlog = {
      ...blog,
      likes: likes + 1
    }

    blogService
      .updateBlog(blog.id, updatedBlog)
      .then(returnedBlog => {
        setLikes(returnedBlog.likes)
      })
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
          <form onSubmit={handleLike}>
            likes {likes}
            <button type="submit">like</button>
          </form>
          <div>{blog.author}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
