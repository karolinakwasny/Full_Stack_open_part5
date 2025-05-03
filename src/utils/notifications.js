export const notifyUser = (setNotification, message, success = true) => {
  setNotification({ message, success })
  setTimeout(() => {
    setNotification({ message: null, success: true })
  }, 5000)
}
