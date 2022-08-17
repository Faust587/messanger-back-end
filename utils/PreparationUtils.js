const prepareSignUpData = (userData) => (
  {
    username: userData.username.trim(),
    password: userData.password.trim(),
    email: userData.email.trim(),
  }
)

const prepareSignInData = (userData) => (
  {
    username: userData.username.trim(),
    password: userData.password.trim(),
  }
)

module.exports = {
  prepareSignUpData,
  prepareSignInData,
}
