const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
    trim: true,
  },

  // gonna add regex to password for special characters and numbers and uppercase
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 64,
  },

  phoneNumber: {
    type: Number,
    min: 8,
    max: 8,
  },
  //more constraints are gonna be added later on.
});

const User = mongoose.model("User", userSchema);

module.exports = User;
