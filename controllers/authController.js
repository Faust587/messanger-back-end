const {validateSignUpData, validateSignInData} = require("../services/validationService");
const {userRegistration, userLogin, activateUser} = require("../services/userService");
const {removeToken, refreshingToken} = require("../services/tokenService");
const {prepareSignUpData, prepareSignInData} = require("../utils/PreparationUtils");
const {FAIL} = require("../const/Status");

const signInController = async (req, res) => {
  const preparedData = prepareSignInData(req.body);
  const validationResult = await validateSignInData(preparedData);
  if (validationResult.ok === FAIL) return res.status(422).json(validationResult.result);

  const {userDTO, refreshToken, accessToken} = await userLogin(preparedData);
  res.cookie("refreshToken", refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
  res.status(200).json({user: userDTO, accessToken});
}

const signUpController = async (req, res) => {
  const preparedData = prepareSignUpData(req.body);
  const validationResult = await validateSignUpData(preparedData);
  if (validationResult.ok === FAIL) return res.status(422).json(validationResult.result);

  const {user, refreshToken, accessToken} = await userRegistration(preparedData);
  res.cookie("refreshToken", refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
  res.status(200).json({user, accessToken});
}

const signOutController = async (req, res) => {
  const {refreshToken} = req.cookies;
  const tokenData = await removeToken(refreshToken);
  res.clearCookie("refreshToken");
  res.status(200).json(tokenData);
}

const activateUserController = async (req, res) => {
  const token = req.params["token"];
  const activateResult = await activateUser(token);
  if (activateResult) {
    res.redirect(`${process.env.CLIENT_URL}/activation-success`);
  } else {
   res.redirect(`${process.env.CLIENT_URL}/activation-fail`);
  }
}

const refreshTokenController = async (req, res) => {
  const {refreshToken} = req.cookies;

  const refreshResult = await refreshingToken(refreshToken);

  if (refreshResult.ok === FAIL) return res.status(401);

  res.cookie("refreshToken", refreshResult.data.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
  res.status(200).json(refreshResult.data);
}

module.exports = {
  signInController,
  signUpController,
  activateUserController,
  signOutController,
  refreshTokenController,
};
