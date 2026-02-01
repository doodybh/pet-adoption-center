const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 64,
    match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/,
  },

  phoneNumber: {
    type: String,
    required: true,
    match: /^\d{8}$/,
  },

  email: {
    type: String,
    required: true,
    match:
      /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)?@[a-zA-Z0-9]+(-[a-zA-Z0-9]+)?\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2,3})?$/,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
