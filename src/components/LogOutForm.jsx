const LogOutForm = ({ user, setUser }) => {

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  return (
    <form onSubmit={handleLogout}>
      {user.name} logged-in
      <button type="submit">logout</button>
    </form>
  )
}

export default LogOutForm
