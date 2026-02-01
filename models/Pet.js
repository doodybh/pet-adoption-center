const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  category: {
    type: String,
    enum: [
      "Fluffies",
      "Chripers",
      "Slitherers",
      "Pocket Pets",
      "Fishies",
      "Others",
    ],
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 200,
  },

  dob: {
    type: Date,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  picture: {
    type: String,
    required: true,
  },
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
