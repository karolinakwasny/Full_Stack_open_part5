import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import CreateNewBlog from './components/CreateBlog'
import LogInForm from './components/LogInForm'
import LogOutForm from './components/LogOutForm'
import Togglable from './components/Toggable'
import { notifyUser } from './utils/notifications'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, success: true })
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs( blogs )
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    if (newBlog.author !== user.name){
      notifyUser(
        setNotification,
        'You can only add blogs with your own name',
        false)
    }
    else{
      blogService
        .createBlog(newBlog)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          notifyUser(
            setNotification,
            `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
            true
          )
        })
        .catch(error => {
          const errorMessage = error.response.data.error
          notifyUser(
            setNotification,
            errorMessage,
            false
          )
        })
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    const returnedBlog = await blogService.updateBlog(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
  }

  const handleRemove = (blog) => {
    const title = blog.title
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .deleteBlog(blog.id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          notifyUser(
            setNotification,
            `blog ${title} removed`,
            true
          )
        })
    }
  }

  const createBlog = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <CreateNewBlog addBlog={addBlog} />
    </Togglable>
  )

  if (user === null){
    return (
      <div>
        <Notification message={notification.message} success={notification?.success} />
        <LogInForm  setUser={setUser} setNotification={setNotification} />
      </div>
    )
  }
  else if(user){
    return(
      <div>
        <h2>blogs</h2>
        <Notification message={notification.message} success={notification?.success} />
        <LogOutForm user={user} setUser={setUser} />
        {createBlog()}
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id}
              blog={blog}
              userLoggedIn={user.name}
              handleLike={handleLike}
              handleRemove={handleRemove} />
          )}
      </div>
    )
  }
}

export default App
