const Notification = ({ message, success }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: success ? 'green' : 'red',
    backgroundColor: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div className='notification' style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification
