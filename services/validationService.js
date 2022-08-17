const bcrypt = require("bcrypt");
const userModel = require("../models/UserModel");
const {SUCCESS, FAIL} = require("../const/Status");
const {fields, errors} = require("../const/Auth");

const validateSignUpData = async ({username, password, email}) => {
  const validationResult = {
    ok: SUCCESS,
    result: []
  }

  const usernameResult = await validateUsername(username);
  const passwordResult = validatePassword(password);
  const emailResult = await validateEmail(email);

  validationResult.result.push(usernameResult);
  validationResult.result.push(passwordResult);
  validationResult.result.push(emailResult);

  if (usernameResult.ok === FAIL) {
    validationResult.ok = FAIL;
  }
  if (passwordResult.ok === FAIL) {
    validationResult.ok = FAIL;
  }
  if (emailResult.ok === FAIL) {
    validationResult.ok = FAIL;
  }

  return validationResult;
}

const validateSignInData = async ({username, password}) => {
  const validationResult = {
    ok: SUCCESS,
    result: {}
  }

  const user = await checkUserExist(username);
  if (!user) {
    validationResult.ok = FAIL;
    validationResult.result = {
      field: fields.USERNAME_FIELD,
      value: "This username is not exists"
    }
    return validationResult;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user["password"]);
  if (!isPasswordCorrect) {
    validationResult.ok = FAIL;
    validationResult.result = {
      field: fields.PASSWORD_FIELD,
      value: "Password is incorrect"
    };
    return validationResult;
  }

  return validationResult;
}

const checkUserExist = async (username) => (userModel.findOne({username}));
const checkEmailExist = async (email) => (userModel.findOne({email}));

const validateUsername = async (username) => {
  const result = {
    ok: SUCCESS,
    field: fields.USERNAME_FIELD,
    value: ""
  }

  const userExists = await checkUserExist(username);
  if (userExists) {
    result.ok = FAIL;
    result.value = errors.USERNAME_IS_BUSY;
    return result;
  }

  if (username.length < 3) {
    result.ok = FAIL;
    result.value = errors.USERNAME_LENGTH_SHOULD_BE_MORE;
    return result;
  }

  if (username.length > 15) {
    result.ok = FAIL;
    result.value = errors.USERNAME_LENGTH_SHOULD_BE_LESS;
    return result;
  }

  const validationRegExp = new RegExp(/^[a-zA-Z]/);
  if (!validationRegExp.test(username)) {
    result.ok = FAIL;
    result.value = errors.USERNAME_IS_NOT_VALID;
    return result;
  }
  return result;
}

const validatePassword = (password) => {
  const result = {
    ok: SUCCESS,
    field: fields.PASSWORD_FIELD,
    value: ""
  }

  if (password.length < 8) {
    result.ok = FAIL;
    result.value = errors.PASSWORD_LENGTH_SHOULD_BE_MORE;
    return result;
  }

  if (password.length > 15) {
    result.ok = FAIL;
    result.value = errors.PASSWORD_LENGTH_SHOULD_BE_LESS;
    return result;
  }

  const validationRegExp = new RegExp(/^(?=.*\d)(?=.*)(?=.*[a-z])(?=.*[A-Z])/);
  if (!validationRegExp.test(password)) {
    result.ok = FAIL;
    result.value = errors.PASSWORD_IS_NOT_VALID;
    return result;
  }
  return result;
}

const validateEmail = async (email) => {
  const result = {
    ok: SUCCESS,
    field: fields.EMAIL_FIELD,
    value: ""
  }

  const isEmailExists = await checkEmailExist(email);
  if (isEmailExists) {
    result.ok = FAIL;
    result.value = errors.EMAIL_IS_BUSY;
    return result;
  }

  const validationRegExp = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
  if (!validationRegExp.test(email)) {
    result.ok = FAIL;
    result.value = errors.EMAIL_IS_NOT_VALID;
    return result;
  }
  return result;
}

module.exports = {
  validateSignUpData,
  validateSignInData,
}
