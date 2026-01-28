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

  //probably gonna change (age) to something else because if there is months or days.
  //I could include date of birth as a way to work around this.
  dob: {
    type: Date,
    required: true,
  },

  adopted: {
    type: Boolean,
    required: true,
    default: false,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  //more constraints are gonna be added later on.

  picture: {
    type: String,
  },
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
