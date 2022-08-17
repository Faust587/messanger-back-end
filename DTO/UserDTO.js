const createUserDTO = ({_id, username, email, activated}) => (
  {
    id: _id,
    username,
    email,
    activated
  }
)

module.exports = {
  createUserDTO,
}
