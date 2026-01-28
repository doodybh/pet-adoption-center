const Pet = require("../models/Pet");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const allPets = await Pet.find().populate('owner');   
  res.render("pets/all-pets.ejs", {allPets: allPets});
});

router.get("/list-a-pet", async (req, res) => {
  try {
    res.render("pets/list-a-pet.ejs");
  } catch (error) {
    console.log(error);
  }
});

router.post("/list-a-pet", async (req, res) => {
  const listedPet = await Pet.create({
    ...req.body,
    owner: req.session.user._id,
  });
  res.redirect("/");
});
module.exports = router;
