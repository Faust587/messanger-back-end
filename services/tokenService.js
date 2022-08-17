const jwt = require("jsonwebtoken");
const {SUCCESS, FAIL} = require("../const/Status");
const tokenModel = require("../models/TokenModel");
const {createUserDTO} = require("../DTO/UserDTO");
const userModel = require("../models/UserModel");

const generateTokens = payload => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: "60s"});
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: "30d"});
  return {
    accessToken,
    refreshToken
  };
}

const saveToken = async (userId, refresh) => {
  const tokenData = await tokenModel.findOne({user: userId});
  if (tokenData) {
    tokenData.refreshToken = refresh;
    return tokenData.save();
  }
  return await tokenModel.create({ user: userId, refreshToken: refresh});
}

const removeToken = async token => {
  return tokenModel.deleteOne({ refreshToken: token});
}

const validateAccessToken = token => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
  } catch (e) {
    return null;
  }
}

const validateRefreshToken = token => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
  } catch (e) {
    return null;
  }
}

const findToken = async token => {
  return tokenModel.findOne({ refreshToken: token});
}

const refreshingToken = async token => {
  const result = {
    ok: SUCCESS,
    data: {}
  }

  if (!token) {
    result.ok = FAIL;
    return result;
  }

  const userPayload = validateRefreshToken(token);
  const isTokenExists = await findToken(token);

  if (!userPayload || !isTokenExists) {
    result.ok = FAIL;
    return result;
  }

  const user = await userModel.findOne({username: userPayload.username});

  const userDTO = createUserDTO(user);
  const {accessToken, refreshToken} = generateTokens(userDTO);

  await saveToken(user._id, refreshToken);

  result.data = {userDTO, accessToken, refreshToken}
  return result;
}

module.exports = {
  generateTokens,
  saveToken,
  removeToken,
  refreshingToken,
  validateAccessToken,
}
