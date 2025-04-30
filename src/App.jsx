import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateNewBlog from './components/CreateBlog'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null, success: true })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
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
    if (newBlog.author !== user.name){
      setNotification({
        message: `You have to be the author to add a blog`,
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
  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
        const user = await loginService.login({
          username, password,
        })
        window.localStorage.setItem(
          'loggedBlogappUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
      } catch (exception) {
        setNotification({
          message: `wrong username or password`,
          success: false,
        })
        setTimeout(() => {
          setNotification({ message: null, success: true })
        }, 5000)
      }
  }

  const createBlog = () => {
    const handleWhenVisible = { display: showCreate ? 'none' : '' }
    const handleWhenHidden = { display: showCreate ? '' : 'none' }

    return (
      <div>
        <div style={handleWhenVisible}>
          <button onClick={() => setShowCreate(true)}>new blog</button>
        </div>
        <div style={handleWhenHidden}>
          <CreateNewBlog addBlog={addBlog} />
          <button onClick={() => setShowCreate(false)}>cancel</button>
        </div>
      </div>
    )
  }

  if (user === null){
    return (
      <div>
      <Notification message={notification.message} success={notification?.success} />
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      </div>
    )
  }
  else if(user){
    return(
      <div>
      <h2>blogs</h2>
      <Notification message={notification.message} success={notification?.success} />
      <form onSubmit={handleLogout}>
        {user.name} logged-in
        <button type="submit">logout</button>
      </form>
      {createBlog()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      </div>
    )
  }
}

export default App
