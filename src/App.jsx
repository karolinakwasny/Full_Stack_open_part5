import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import CreateNewBlog from './components/CreateBlog'
import LogInForm from './components/LogInForm'
import LogOutForm from './components/LogOutForm'
import Togglable from './components/Toggable'

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
      setNotification({
        message: 'You have to be the author to add a blog',
        success: false,
      })
      setTimeout(() => {
        setNotification({ message: null, success: true })
      }, 5000)
    }
    else{
      blogService
        .createBlog(newBlog)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNotification({
            message: `a new blog ${newBlog.title} by ${newBlog.author} added `,
            success: true,
          })
          setTimeout(() => {
            setNotification({ message: null, success: true })
          }, 5000)
        })
        .catch(error => {
          const errorMessage = error.response.data.error
          setNotification({
            message: `${errorMessage}`,
            success: false,
          })
          setTimeout(() => {
            setNotification({ message: null, success: true })
          }, 5000)
        })
    }
  }

  const handleLike = () => {
      const updatedBlog = {
        ...blog,
        likes: likes + 1
      }
      blogService.updateBlog(blog.id, updatedBlog)
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
              blogs={blogs}
              setBlogs={setBlogs}
              setNotification={setNotification}
              handleLike={handleLike} />
          )}
      </div>
    )
  }
}

export default App
