const bcrypt = require("bcrypt");
const uuid = require("uuid");
const userModel = require("../models/UserModel");
const {generateTokens, saveToken} = require("./tokenService");
const {sendActivationMail} = require("./mailService");
const {createUserDTO} = require("../DTO/UserDTO");

const userRegistration = async ({username, password, email}) => {
  const hashedPassword = await bcrypt.hash(password, 3);
  const activationString = uuid.v4();

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
    activationString
  });

  const userDTO = createUserDTO(user);
  const {accessToken, refreshToken} = generateTokens(userDTO);
  await saveToken(user._id, refreshToken);
  await sendActivationMail(email, `${process.env.API_URL}/auth/activate/${activationString}`);

  return {user, accessToken, refreshToken};
}

const userLogin = async ({username}) => {
  const user = await userModel.findOne({username});
  console.log(user);
  const userDTO = createUserDTO(user);
  const {accessToken, refreshToken} = generateTokens(userDTO);
  await saveToken(user._id, refreshToken);
  return {userDTO, accessToken, refreshToken};
}

const activateUser = async (token) => {
  const user = await userModel.findOneAndUpdate({activationString: token, activated: false}, {activated: true}, {new: true});
  return !!user;
}

module.exports = {userRegistration, activateUser, userLogin};
