const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: String,
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
  type: String,

  //probably gonna change (age) to something else because if there is months or days.
  //I could include date of birth as a way to work around this.
  age: Number,

  adopted: Boolean,

  //more constraints are gonna be added later on.
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
