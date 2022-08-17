const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    activationString: { type: String },
    activated: { type: Boolean, default: false},
  }
);

module.exports = model("User", userSchema);
